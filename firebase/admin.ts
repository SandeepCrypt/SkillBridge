import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const initFirebaseAdmin = () => {
  const apps = getApps();

  if (!apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    // Debug log - check Vercel Function Logs for this
    console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID ? "SET" : "MISSING");
    console.log("FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL ? "SET" : "MISSING");
    console.log("FIREBASE_PRIVATE_KEY:", privateKey ? "SET" : "MISSING");

    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      throw new Error(
        `Missing Firebase Admin env vars: ` +
        `PROJECT_ID=${!!process.env.FIREBASE_PROJECT_ID}, ` +
        `CLIENT_EMAIL=${!!process.env.FIREBASE_CLIENT_EMAIL}, ` +
        `PRIVATE_KEY=${!!privateKey}`
      );
    }

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  }

  return { auth: getAuth(), db: getFirestore() };
};

export const { auth, db } = initFirebaseAdmin();