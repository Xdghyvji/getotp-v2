const admin = require('firebase-admin');

// --- FIREBASE ADMIN INITIALIZATION ---
// We check if the app is already initialized to prevent "App already exists" errors.
if (admin.apps.length === 0) {
  try {
    // This looks for the Base64 variable we asked you to set in Netlify
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      const serviceAccount = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      console.error("❌ MISSING CREDENTIALS: FIREBASE_SERVICE_ACCOUNT_BASE64 env var is not set.");
      // We don't throw here to allow the function to return a clean error message below
    }
  } catch (error) {
    console.error("❌ FIREBASE INIT ERROR:", error);
  }
}

const db = admin.firestore();

// --- 5SIM API CONFIGURATION ---
const FIVESIM_API_TOKEN = process.env.FIVESIM_API_TOKEN; 
const BASE_URL = 'https://5sim.net/v1';

exports.handler = async (event, context) => {
  // --- FIX: Dynamic Import for node-fetch ---
  // This fixes the ERR_REQUIRE_ESM error by importing fetch only when the function runs.
  const fetch = (await import('node-fetch')).default;

  // 1. Handle CORS (Allow requests from your frontend)
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
      body: JSON.stringify({ error: 'Server misconfiguration: Firebase Admin not initialized. Check server logs.' })
    };
  }

  try {
    // 3. Parse Request
    const { action, payload } = JSON.parse(event.body);

    // 4. Route Actions
    let result;

    if (action === 'getOperatorsAndPrices') {
      const { country, product } = payload;
      // Fetch from 5SIM Guest API
      const response = await fetch(`${BASE_URL}/guest/prices?country=${country}&product=${product}`, {
        headers: { 'Accept': 'application/json' }
      });
      result = await response.json();
    
    } else if (action === 'buyNumber') {
      // User must be logged in to buy
      const authHeader = event.headers.authorization || event.headers.Authorization;
      if (!authHeader) throw new Error("Unauthorized");
      
      const idToken = authHeader.split('Bearer ')[1];
      await admin.auth().verifyIdToken(idToken); // Verify the user's token

      const { service, server, operator } = payload;
      
      // Determine request URL based on whether operator is "any" or specific
      let fetchUrl;
      // Safety check: ensure operator object exists
      const opName = operator && operator.name ? operator.name : 'any';
      
      if (opName === 'any') {
          fetchUrl = `${BASE_URL}/user/buy/activation/${server.name}/any/${service.name.toLowerCase()}`;
      } else {
          fetchUrl = `${BASE_URL}/user/buy/activation/${server.name}/${opName}/${service.name.toLowerCase()}`;
      }
      
      const response = await fetch(fetchUrl, {
        headers: { 
          'Authorization': `Bearer ${FIVESIM_API_TOKEN}`,
          'Accept': 'application/json'
        }
      });
      result = await response.json();

    } else if (action === 'checkOrder') {
        const { orderId } = payload;
        const response = await fetch(`${BASE_URL}/user/check/${orderId}`, {
            headers: { 
              'Authorization': `Bearer ${FIVESIM_API_TOKEN}`,
              'Accept': 'application/json'
            }
        });
        result = await response.json();
    
    } else if (action === 'finishOrder') {
        const { orderId } = payload;
        const response = await fetch(`${BASE_URL}/user/finish/${orderId}`, {
            headers: { 
              'Authorization': `Bearer ${FIVESIM_API_TOKEN}`,
              'Accept': 'application/json'
            }
        });
        result = await response.json();

    } else if (action === 'cancelOrder') {
        const { orderId } = payload;
        const response = await fetch(`${BASE_URL}/user/cancel/${orderId}`, {
            headers: { 
              'Authorization': `Bearer ${FIVESIM_API_TOKEN}`,
              'Accept': 'application/json'
            }
        });
        result = await response.json();
    } else {
        throw new Error(`Unknown action: ${action}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error("API Proxy Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' })
    };
  }
};