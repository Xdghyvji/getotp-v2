import admin from 'firebase-admin';
import axios from 'axios';

// --- FIREBASE ADMIN INITIALIZATION ---
if (admin.apps.length === 0) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      const buffer = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64');
      const serviceAccount = JSON.parse(buffer.toString('utf8'));
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      console.error("❌ MISSING CREDENTIALS: FIREBASE_SERVICE_ACCOUNT_BASE64 env var is not set.");
    }
  } catch (error) {
    console.error("❌ FIREBASE INIT ERROR:", error);
  }
}

// --- 5SIM API CONFIGURATION ---
const FIVESIM_API_TOKEN = process.env.FIVESIM_API_TOKEN; 
const BASE_URL = 'https://5sim.net/v1';

export const handler = async (event, context) => {
  // 1. Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // 2. Validate Firebase Init
  if (admin.apps.length === 0) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server misconfiguration: Firebase Admin not initialized. Check logs.' })
    };
  }

  try {
    // 3. Parse Request
    const { action, payload } = JSON.parse(event.body);

    // 4. Route Actions
    let result;

    if (action === 'getOperatorsAndPrices') {
      const { country, product } = payload;
      // Axios automatically parses JSON responses
      const response = await axios.get(`${BASE_URL}/guest/prices`, {
        params: { country, product },
        headers: { 'Accept': 'application/json' }
      });
      result = response.data;
    
    } else if (action === 'buyNumber') {
      // Auth Check
      const authHeader = event.headers.authorization || event.headers.Authorization;
      if (!authHeader) throw new Error("Unauthorized");
      
      const idToken = authHeader.split('Bearer ')[1];
      await admin.auth().verifyIdToken(idToken); 

      const { service, server, operator } = payload;
      
      // Determine request URL
      let opName = operator && operator.name ? operator.name : 'any';
      let fetchUrl;
      
      if (opName === 'any') {
          fetchUrl = `${BASE_URL}/user/buy/activation/${server.name}/any/${service.name.toLowerCase()}`;
      } else {
          fetchUrl = `${BASE_URL}/user/buy/activation/${server.name}/${opName}/${service.name.toLowerCase()}`;
      }
      
      const response = await axios.get(fetchUrl, {
        headers: { 
          'Authorization': `Bearer ${FIVESIM_API_TOKEN}`,
          'Accept': 'application/json'
        }
      });
      result = response.data;

    } else if (action === 'checkOrder') {
        const { orderId } = payload;
        const response = await axios.get(`${BASE_URL}/user/check/${orderId}`, {
            headers: { 
              'Authorization': `Bearer ${FIVESIM_API_TOKEN}`,
              'Accept': 'application/json'
            }
        });
        result = response.data;
    
    } else if (action === 'finishOrder') {
        const { orderId } = payload;
        const response = await axios.get(`${BASE_URL}/user/finish/${orderId}`, {
            headers: { 
              'Authorization': `Bearer ${FIVESIM_API_TOKEN}`,
              'Accept': 'application/json'
            }
        });
        result = response.data;

    } else if (action === 'cancelOrder') {
        const { orderId } = payload;
        const response = await axios.get(`${BASE_URL}/user/cancel/${orderId}`, {
            headers: { 
              'Authorization': `Bearer ${FIVESIM_API_TOKEN}`,
              'Accept': 'application/json'
            }
        });
        result = response.data;
    } else {
        throw new Error(`Unknown action: ${action}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error("API Proxy Error:", error.message);
    
    // Handle Axios errors specifically to give better feedback
    const errorMessage = error.response && error.response.data 
        ? JSON.stringify(error.response.data) 
        : error.message || 'Internal Server Error';

    return {
      statusCode: error.response ? error.response.status : 500,
      headers,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};