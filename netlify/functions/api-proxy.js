const admin = require('firebase-admin');
const fetch = require('node-fetch');

// --- FIREBASE ADMIN INITIALIZATION ---
// We check if the app is already initialized to prevent "App already exists" errors in hot-reload environments.
if (admin.apps.length === 0) {
  try {
    // OPTION 1: Using a Base64 encoded Service Account JSON (Recommended for Netlify)
    // This prevents issues with newlines in private keys.
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      const serviceAccount = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } 
    // OPTION 2: Using individual variables (Common fallback)
    else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Handle private key newlines correctly for Netlify
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        })
      });
    } else {
      console.error("❌ MISSING CREDENTIALS: FIREBASE_SERVICE_ACCOUNT_BASE64 or FIREBASE_PRIVATE_KEY env vars are not set.");
      throw new Error("Missing Firebase Credentials");
    }
  } catch (error) {
    console.error("❌ FIREBASE INIT ERROR:", error);
    // We do not throw here to allow the function to return a 500 error properly instead of crashing the process
  }
}

const db = admin.firestore();

// --- 5SIM API CONFIGURATION ---
const FIVESIM_API_TOKEN = process.env.FIVESIM_API_TOKEN; // Add this to Netlify Env Vars
const BASE_URL = 'https://5sim.net/v1';

exports.handler = async (event, context) => {
  // 1. Handle CORS (Allow requests from your frontend)
  const headers = {
    'Access-Control-Allow-Origin': '*', // Change '*' to your domain in production for security
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
      body: JSON.stringify({ error: 'Server misconfiguration: Firebase Admin not initialized.' })
    };
  }

  try {
    // 3. Authenticate User (Verify the ID Token sent from Frontend)
    // We expect the Authorization header: "Bearer <token>"
    const authHeader = event.headers.authorization || event.headers.Authorization;
    
    // NOTE: For 'getOperatorsAndPrices', we might allow public access (no token).
    // If you want strict auth for everything, uncomment the check below.
    
    /* if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized: Missing token' }) };
    }
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    */

    // 4. Parse Request
    const { action, payload } = JSON.parse(event.body);

    // 5. Route Actions
    let result;

    if (action === 'getOperatorsAndPrices') {
      const { country, product } = payload;
      // Fetch from 5SIM Guest API (No token needed for guest endpoints usually, but good to proxy)
      const response = await fetch(`${BASE_URL}/guest/prices?country=${country}&product=${product}`, {
        headers: { 'Accept': 'application/json' }
      });
      result = await response.json();
    
    } else if (action === 'buyNumber') {
      // REQUIRE AUTH for buying
      const authHeader = event.headers.authorization || event.headers.Authorization;
      if (!authHeader) throw new Error("Unauthorized");
      const idToken = authHeader.split('Bearer ')[1];
      const user = await admin.auth().verifyIdToken(idToken); // Verify user

      const { service, server, operator } = payload;
      
      // Call 5SIM User Buy API
      // Note: We use the server-side FIVESIM_API_TOKEN here
      const fetchUrl = `${BASE_URL}/user/buy/activation/${server.name}/${operator.name}/${service.name.toLowerCase()}`;
      
      const response = await fetch(fetchUrl, {
        headers: { 
          'Authorization': `Bearer ${FIVESIM_API_TOKEN}`,
          'Accept': 'application/json'
        }
      });
      result = await response.json();

      // If successful, you might want to log this to Firestore here as a backup
      if (result.id) {
         // Log purchase logic here if needed
      }

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