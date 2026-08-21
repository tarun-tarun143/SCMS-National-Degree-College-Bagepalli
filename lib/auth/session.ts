
"use client";

import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";

import {
  doc,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

import {
  useEffect,
  useState,
} from "react";

import {
  firebaseAuth,
  firestoreDb,
} from "@/lib/firebase/client";

import type {
  UserRecord,
  UserRole,
} from "@/types/scms";

export type SessionUser = UserRecord & {
  authUser: User;
};

/*
 * Firestore can contain additional fields that are not
 * required by the base UserRecord type.
 */
type FirestoreSessionProfile = Omit<
  UserRecord,
  "uid"
> & {
  approvalStatus?: string;
  facultyId?: string;
  collegeRegisterUid?: string;
  studentId?: string;
  registerNumber?: string;
  photoURL?: string;
  phone?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
};

/*
 * ============================================================
 * SCMS SESSION HOOK
 * ============================================================
 */
export function useScmsSession(
  requiredRole?: UserRole
) {
  const [user, setUser] =
    useState<SessionUser | null>(null);

  const [loading, setLoading] =
    useState(
      Boolean(
        firebaseAuth &&
          firestoreDb
      )
    );

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    /*
     * Firebase configuration check
     */
    if (
      !firebaseAuth ||
      !firestoreDb
    ) {
      setLoading(false);

      setError(
        "Firebase is not configured. Check your .env.local file."
      );

      return;
    }

    const auth = firebaseAuth;
    const db = firestoreDb;

    let profileUnsubscribe:
      | Unsubscribe
      | null = null;

    /*
     * ========================================================
     * AUTH STATE
     * ========================================================
     */
    const authUnsubscribe =
      onAuthStateChanged(
        auth,
        (authUser) => {
          /*
           * --------------------------------------------------
           * SIGNED OUT
           * --------------------------------------------------
           */
          if (!authUser) {
            profileUnsubscribe?.();
            profileUnsubscribe = null;

            setUser(null);
            setError(null);
            setLoading(false);

            return;
          }

          /*
           * --------------------------------------------------
           * AUTHENTICATED
           * --------------------------------------------------
           */

          profileUnsubscribe?.();

          setLoading(true);
          setError(null);

          const userRef = doc(
            db,
            "users",
            authUser.uid
          );

          /*
           * ==================================================
           * REAL-TIME USER PROFILE
           * ==================================================
           */
          profileUnsubscribe =
            onSnapshot(
              userRef,
              (profileSnapshot) => {
                /*
                 * ------------------------------------------------
                 * PROFILE NOT FOUND
                 * ------------------------------------------------
                 */
                if (
                  !profileSnapshot.exists()
                ) {
                  setUser(null);

                  setError(
                    "Your Google account is authenticated, but your SCMS profile has not been created yet."
                  );

                  setLoading(false);

                  return;
                }

                /*
                 * ------------------------------------------------
                 * FIRESTORE DATA
                 * ------------------------------------------------
                 */
                const data =
                  profileSnapshot.data() as FirestoreSessionProfile;

                const role =
                  String(
                    data.role ?? ""
                  )
                    .trim()
                    .toLowerCase();

                const status =
                  String(
                    data.status ?? ""
                  )
                    .trim()
                    .toLowerCase();

                /*
                 * IMPORTANT:
                 * approvalStatus does not exist in the base
                 * UserRecord type, so it is included in the
                 * FirestoreSessionProfile type above.
                 */
                const approvalStatus =
                  String(
                    data.approvalStatus ?? ""
                  )
                    .trim()
                    .toLowerCase();

                /*
                 * ------------------------------------------------
                 * ACCOUNT NOT ACTIVE
                 * ------------------------------------------------
                 */
                if (
                  status !== "active"
                ) {
                  setUser(null);

                  if (
                    status ===
                      "pending" ||
                    approvalStatus ===
                      "pending"
                  ) {
                    setError(
                      "Your SCMS account is waiting for administrator approval."
                    );
                  } else if (
                    status ===
                      "rejected" ||
                    approvalStatus ===
                      "rejected"
                  ) {
                    setError(
                      "Your SCMS registration was rejected by the administrator."
                    );
                  } else {
                    setError(
                      "Your SCMS account is not active."
                    );
                  }

                  setLoading(false);

                  return;
                }

                /*
                 * ------------------------------------------------
                 * ROLE VALIDATION
                 * ------------------------------------------------
                 */
                if (
                  requiredRole &&
                  role !== requiredRole
                ) {
                  setUser(null);

                  setError(
                    `This account is registered as ${
                      role ||
                      "another role"
                    }. Please open the correct portal.`
                  );

                  setLoading(false);

                  return;
                }

                /*
                 * ------------------------------------------------
                 * ACTIVE SESSION USER
                 * ------------------------------------------------
                 */
                const sessionUser =
                  {
                    ...(data as UserRecord),
                    uid:
                      authUser.uid,
                    authUser,
                  };

                setUser(
                  sessionUser
                );

                setError(null);
                setLoading(false);
              },
              (listenerError) => {
                console.error(
                  "SCMS real-time session listener failed:",
                  listenerError
                );

                setUser(null);

                setError(
                  listenerError instanceof
                    Error
                    ? listenerError.message
                    : "Unable to verify your SCMS account."
                );

                setLoading(false);
              }
            );
        }
      );

    /*
     * ========================================================
     * CLEANUP
     * ========================================================
     */
    return () => {
      profileUnsubscribe?.();
      profileUnsubscribe = null;

      authUnsubscribe();
    };
  }, [requiredRole]);

  /*
   * ==========================================================
   * LOGOUT
   * ==========================================================
   */
  async function logout() {
    if (!firebaseAuth) {
      return;
    }

    await signOut(
      firebaseAuth
    );
  }

  return {
    user,
    loading,
    error,
    logout,
  };
}

/*
 * ============================================================
 * ROLE LABEL
 * ============================================================
 */
export function requiredRoleLabel(
  role: UserRole
): string {
  return (
    role.charAt(0).toUpperCase() +
    role.slice(1)
  );
}

