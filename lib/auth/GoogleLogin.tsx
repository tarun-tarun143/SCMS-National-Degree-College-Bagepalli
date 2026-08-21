"use client";

import { useState } from "react";

import { signInWithPopup } from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  firebaseAuth,
  firestoreDb,
  googleProvider,
  isFirebaseConfigured,
} from "@/lib/firebase/client";

import Button from "@/components/ui/Button";

import { Chrome } from "lucide-react";

type UserProfile = {
  uid?: string;
  name?: string;
  email?: string;
  photoURL?: string;

  role?: "student" | "faculty" | "admin" | "pending" | string;

  status?: "pending" | "active" | "rejected" | string;

  registerNumber?: string;
  facultyId?: string;
  phone?: string;
  academicYear?: string;
  department?: string;
  designation?: string;

  approved?: boolean;
};

export default function GoogleLogin() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function login() {
    setMessage("");
    setPending(false);

    if (
      !isFirebaseConfigured ||
      !firebaseAuth ||
      !firestoreDb
    ) {
      setMessage(
        "Firebase is not configured. Add your Firebase web app settings to .env.local before signing in."
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * STEP 1
       * Google Authentication
       */
      const credential = await signInWithPopup(
        firebaseAuth,
        googleProvider
      );

      const user = credential.user;

      /*
       * STEP 2
       * Make sure Firebase returned a valid user.
       */
      if (!user.uid) {
        throw new Error(
          "Unable to identify your Google account."
        );
      }

      /*
       * STEP 3
       * Check users/{uid}
       */
      const userRef = doc(
        firestoreDb,
        "users",
        user.uid
      );

      const profileSnapshot = await getDoc(userRef);

      /*
       * =====================================================
       * NEW USER
       * =====================================================
       *
       * Do NOT create a pending role here.
       *
       * Send the user to the registration page where they
       * choose Student or Faculty and enter their information.
       */
      if (!profileSnapshot.exists()) {
        window.location.assign("/register");
        return;
      }

      /*
       * =====================================================
       * EXISTING USER
       * =====================================================
       */
      const data =
        profileSnapshot.data() as UserProfile;

      const role = data.role;
      const status = data.status;

      /*
       * =====================================================
       * PENDING ACCOUNT
       * =====================================================
       */
      if (status === "pending") {
        setPending(true);

        setMessage(
          "Your registration has been submitted successfully and is waiting for administrator approval."
        );

        return;
      }

      /*
       * =====================================================
       * REJECTED ACCOUNT
       * =====================================================
       *
       * Allow the user to return to registration so they
       * can correct their information.
       */
      if (status === "rejected") {
        setPending(true);

        setMessage(
          "Your registration was not approved. Please update your registration information and submit it again."
        );

        setTimeout(() => {
          window.location.assign("/register");
        }, 1500);

        return;
      }

      /*
       * =====================================================
       * ADMIN
       * =====================================================
       */
      if (
        role === "admin" &&
        status === "active"
      ) {
        window.location.assign("/admin");
        return;
      }

      /*
       * =====================================================
       * STUDENT
       * =====================================================
       */
      if (
        role === "student" &&
        status === "active"
      ) {
        window.location.assign("/student");
        return;
      }

      /*
       * =====================================================
       * FACULTY
       * =====================================================
       */
      if (
        role === "faculty" &&
        status === "active"
      ) {
        window.location.assign("/faculty");
        return;
      }

      /*
       * =====================================================
       * INVALID / INCOMPLETE PROFILE
       * =====================================================
       *
       * This handles old accounts that may have:
       *
       * role: pending
       * role: undefined
       * status: undefined
       * etc.
       */
      setPending(true);

      setMessage(
        "Your SCMS profile is incomplete. Please complete your registration before accessing the portal."
      );

      setTimeout(() => {
        window.location.assign("/register");
      }, 1500);
    } catch (error) {
      console.error(
        "SCMS Google sign-in failed:",
        error
      );

      if (
        error &&
        typeof error === "object" &&
        "code" in error
      ) {
        const firebaseError =
          error as {
            code?: string;
            message?: string;
          };

        if (
          firebaseError.code ===
          "auth/popup-closed-by-user"
        ) {
          setMessage(
            "Google sign-in was cancelled."
          );

          return;
        }

        if (
          firebaseError.code ===
          "auth/popup-blocked"
        ) {
          setMessage(
            "The Google sign-in popup was blocked by your browser. Please allow popups and try again."
          );

          return;
        }

        if (
          firebaseError.code ===
          "auth/account-exists-with-different-credential"
        ) {
          setMessage(
            "An account already exists with this email using a different sign-in method."
          );

          return;
        }

        if (
          firebaseError.code ===
          "permission-denied"
        ) {
          setMessage(
            "You do not have permission to access your SCMS profile."
          );

          return;
        }
      }

      setMessage(
        error instanceof Error
          ? error.message
          : "Google sign-in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        loading={loading}
        onClick={login}
        className="w-full"
      >
        <Chrome className="h-4 w-4" />
        Continue with Google
      </Button>

      {message && (
        <div
          className={`mt-3 rounded-xl border p-4 ${
            pending
              ? "border-amber-200 bg-amber-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <p
            className={`text-xs font-semibold leading-5 ${
              pending
                ? "text-amber-800"
                : "text-red-700"
            }`}
          >
            {message}
          </p>
        </div>
      )}
    </div>
  );
}