import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

if (!getApps().length) {
  try {
    let serviceAccount;
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      // Production (Vercel): Read from secure Environment Variable
      // Handle Vercel escaping newlines in JSON strings
      const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      try {
        serviceAccount = JSON.parse(rawKey);
      } catch (parseError) {
        // Fallback: if Vercel escaped newlines or it's a single line string with literal \n
        serviceAccount = JSON.parse(rawKey.replace(/\\n/g, '\n'));
      }
    } else {
      // Local Development: Read from JSON file
      const serviceAccountPath = path.join(process.cwd(), 'firebase-service-account.json');
      if (fs.existsSync(serviceAccountPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      } else {
        console.warn("firebase-service-account.json not found in the root directory!");
      }
    }

    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount)
      });
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminDb = getApps().length ? getFirestore() : null;
export const adminAuth = getApps().length ? getAuth() : null;
