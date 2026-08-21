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
  type Auth,
} from "firebase/auth";

import {
  getFirestore,
  type Firestore,
} from "firebase/firestore";

/* ============================================================
   FIREBASE CONFIGURATION
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
   REQUIRED ENVIRONMENT VARIABLES
============================================================ */

const requiredVariables: Array<
  [string, string | undefined]
> = [
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
];

const missingFirebaseVariables =
  requiredVariables
    .filter(([, value]) => !value)
    .map(([name]) => name);

export const isFirebaseConfigured =
  missingFirebaseVariables.length === 0;

/* ============================================================
   CONFIGURATION DIAGNOSTICS
============================================================ */

if (
  typeof window !== "undefined" &&
  !isFirebaseConfigured
) {
  console.error(
    "SCMS Firebase configuration missing:",
    missingFirebaseVariables
  );
}

/* ============================================================
   FIREBASE SINGLETONS
============================================================ */

let firebaseApp: FirebaseApp | null =
  null;

let firebaseAuth: Auth | null =
  null;

let firestoreDb: Firestore | null =
  null;

/* ============================================================
   INITIALIZE FIREBASE
============================================================ */

if (isFirebaseConfigured) {
  try {
    firebaseApp = getApps().length
      ? getApp()
      : initializeApp(
          firebaseConfig
        );

    firebaseAuth =
      getAuth(firebaseApp);

    firestoreDb =
      getFirestore(firebaseApp);
  } catch (error) {
    console.error(
      "SCMS Firebase initialization failed:",
      error
    );

    firebaseApp = null;
    firebaseAuth = null;
    firestoreDb = null;
  }
}

/* ============================================================
   MAIN EXPORTS
============================================================ */

export {
  firebaseAuth,
  firestoreDb,
};

/* ============================================================
   FIREBASE APP INSTANCE
============================================================ */

export const firebaseAppInstance =
  firebaseApp;

/* ============================================================
   COMPATIBILITY ALIASES
============================================================ */

export const auth =
  firebaseAuth;

export const db =
  firestoreDb;

/* ============================================================
   GOOGLE PROVIDER
============================================================ */

export const googleProvider =
  new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

/* ============================================================
   DEVELOPMENT DIAGNOSTICS
============================================================ */

if (
  typeof window !== "undefined" &&
  firebaseApp &&
  firebaseAuth &&
  firestoreDb
) {
  console.log(
    "SCMS Firebase project:",
    firebaseApp.options.projectId
  );

  console.log(
    "SCMS Firebase auth user:",
    firebaseAuth.currentUser?.uid ??
      "Not signed in"
  );
}