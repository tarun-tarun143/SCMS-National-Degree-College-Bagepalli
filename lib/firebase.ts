"use client";

import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  type Auth,
} from "firebase/auth";

import {
  getFirestore,
  type Firestore,
} from "firebase/firestore";

/* ============================================================
   FIREBASE CONFIG
============================================================ */

const firebaseConfig: FirebaseOptions = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY,

  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,

  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,

  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,

  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/* ============================================================
   CHECK CONFIGURATION
============================================================ */

const missingVariables = [
  [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    firebaseConfig.apiKey,
  ],
  [
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    firebaseConfig.authDomain,
  ],
  [
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    firebaseConfig.projectId,
  ],
  [
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    firebaseConfig.messagingSenderId,
  ],
  [
    "NEXT_PUBLIC_FIREBASE_APP_ID",
    firebaseConfig.appId,
  ],
].filter(([, value]) => !value)
  .map(([name]) => name);

export const isFirebaseConfigured =
  missingVariables.length === 0;

/* ============================================================
   FIREBASE APP
============================================================ */

let app: FirebaseApp;

if (isFirebaseConfigured) {
  app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);
} else {
  throw new Error(
    `Firebase configuration is missing: ${missingVariables.join(
      ", "
    )}`
  );
}

/* ============================================================
   AUTH
============================================================ */

export const auth: Auth =
  getAuth(app);

/* ============================================================
   FIRESTORE
============================================================ */

export const db: Firestore =
  getFirestore(app);

/* ============================================================
   GOOGLE PROVIDER
============================================================ */

export const googleProvider =
  new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

/* ============================================================
   AUTH PERSISTENCE
============================================================ */

if (typeof window !== "undefined") {
  setPersistence(
    auth,
    browserLocalPersistence
  ).catch((error) => {
    console.error(
      "Firebase persistence error:",
      error
    );
  });
}

/* ============================================================
   DEBUG
============================================================ */

if (
  typeof window !== "undefined"
) {
  console.log(
    "SCMS Firebase initialized:",
    firebaseConfig.projectId
  );

  console.log(
    "Current Firebase user:",
    auth.currentUser?.uid ??
      "Not signed in"
  );
}

export default app;