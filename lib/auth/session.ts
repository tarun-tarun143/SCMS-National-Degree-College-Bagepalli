"use client";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firebaseAuth, firestoreDb } from "@/lib/firebase/client";
import type { UserRecord, UserRole } from "@/types/scms";

export type SessionUser = UserRecord & { authUser: User };

export function useScmsSession(requiredRole?: UserRole) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(Boolean(firebaseAuth && firestoreDb));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseAuth || !firestoreDb) {
      setLoading(false);
      setError("Firebase is not configured. Create .env.local from .env.example and connect your Firebase project.");
      return;
    }

    const auth = firebaseAuth;
    const db = firestoreDb;
    return onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const profile = await getDoc(doc(db, "users", authUser.uid));
        if (!profile.exists()) {
          setUser(null);
          setError("Your Google account is authenticated but your SCMS account has not been provisioned yet.");
          setLoading(false);
          return;
        }
        const data = profile.data() as Omit<UserRecord, "uid">;
        const sessionUser = { ...(data as UserRecord), uid: authUser.uid, authUser };
        if (data.status !== "active") {
          setUser(null);
          setError("Your SCMS account is pending college approval or has been disabled.");
          setLoading(false);
          return;
        }
        if (requiredRole && data.role !== requiredRole) {
          setUser(null);
          setError(`This account is registered as ${data.role}. Open the correct portal.`);
          setLoading(false);
          return;
        }
        setUser(sessionUser);
        setError(null);
      } catch (sessionError) {
        console.error("SCMS session lookup failed", sessionError);
        setUser(null);
        setError(sessionError instanceof Error ? sessionError.message : "Unable to verify your SCMS account.");
      } finally {
        setLoading(false);
      }
    });
  }, [requiredRole]);

  async function logout() {
    if (firebaseAuth) await signOut(firebaseAuth);
  }

  return { user, loading, error, logout };
}

export function requiredRoleLabel(role: UserRole) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}
