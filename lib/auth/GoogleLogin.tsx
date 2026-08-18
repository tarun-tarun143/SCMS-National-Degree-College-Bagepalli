"use client";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { firebaseAuth, firestoreDb, googleProvider, isFirebaseConfigured } from "@/lib/firebase/client";
import Button from "@/components/ui/Button";
import { Chrome } from "lucide-react";

export default function GoogleLogin() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function login() {
    setMessage("");
    setPending(false);
    if (!isFirebaseConfigured || !firebaseAuth || !firestoreDb) {
      setMessage("Firebase is not configured. Add your Firebase web app settings to .env.local before signing in.");
      return;
    }
    try {
      setLoading(true);
      const credential = await signInWithPopup(firebaseAuth, googleProvider);
      const ref = doc(firestoreDb, "users", credential.user.uid);
      const profile = await getDoc(ref);

      if (!profile.exists()) {
        await setDoc(ref, {
          uid: credential.user.uid,
          name: credential.user.displayName ?? "College User",
          email: credential.user.email ?? "",
          photoURL: credential.user.photoURL ?? "",
          role: "pending",
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setPending(true);
        setMessage("Your Google account is registered. A college administrator must assign your Student, Faculty or Admin role before you can enter SCMS.");
        return;
      }

      const data = profile.data() as { role?: string; status?: string };
      if (data.status !== "active") {
        setPending(true);
        setMessage("Your SCMS account exists but is not active yet. Please contact the college administrator.");
        return;
      }

      if (!data.role || !["student", "faculty", "admin"].includes(data.role)) {
        setPending(true);
        setMessage("Your SCMS profile does not have a valid role yet. Please contact the college administrator.");
        return;
      }

      window.location.assign(`/${data.role}`);
    } catch (error) {
      console.error("SCMS Google sign-in failed", error);
      setMessage(error instanceof Error ? error.message : "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button type="button" variant="outline" loading={loading} onClick={login} className="w-full">
        <Chrome className="h-4 w-4" /> Continue with Google
      </Button>
      {message && (
        <p className={`mt-3 rounded-lg p-3 text-xs font-semibold leading-5 ${pending ? "bg-amber-50 text-amber-800" : "bg-red-50 text-red-700"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
