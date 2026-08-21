"use client";

import { FormEvent, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  Chrome,
  Loader2,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Users,
} from "lucide-react";

import {
  firebaseAuth,
  firestoreDb,
  googleProvider,
  isFirebaseConfigured,
} from "@/lib/firebase/client";

import Button from "@/components/ui/Button";

type Role = "student" | "faculty";

type RegistrationForm = {
  name: string;
  registerNumber: string;
  phone: string;
  year: string;
};

const emptyForm: RegistrationForm = {
  name: "",
  registerNumber: "",
  phone: "",
  year: "",
};

export default function GoogleLogin() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [role, setRole] = useState<Role>("student");

  const [form, setForm] =
    useState<RegistrationForm>(emptyForm);

  const [googleUser, setGoogleUser] = useState<{
    uid: string;
    name: string;
    email: string;
    photoURL: string;
  } | null>(null);

  async function loginWithGoogle() {
    setLoading(true);
    setError("");
    setMessage("");
    setSubmitted(false);

    if (
      !isFirebaseConfigured ||
      !firebaseAuth ||
      !firestoreDb
    ) {
      setError(
        "Firebase is not configured. Check your .env.local file."
      );
      setLoading(false);
      return;
    }

    try {
      const result = await signInWithPopup(
        firebaseAuth,
        googleProvider
      );

      const user = result.user;

      /*
       * Always store the Google identity locally first.
       */
      const googleProfile = {
        uid: user.uid,
        name: user.displayName ?? "",
        email: user.email ?? "",
        photoURL: user.photoURL ?? "",
      };

      setGoogleUser(googleProfile);

      /*
       * Read existing Firestore profile.
       */
      const userRef = doc(
        firestoreDb,
        "users",
        user.uid
      );

      const snapshot = await getDoc(userRef);

      /*
       * =====================================================
       * BRAND NEW USER
       * =====================================================
       */
      if (!snapshot.exists()) {
        setRole("student");

        setForm({
          name: user.displayName ?? "",
          registerNumber: "",
          phone: "",
          year: "",
        });

        setShowForm(true);

        return;
      }

      const data = snapshot.data();

      const roleFromDatabase =
        typeof data.role === "string"
          ? data.role.toLowerCase()
          : "";

      const status =
        typeof data.status === "string"
          ? data.status.toLowerCase()
          : "";

      /*
       * =====================================================
       * ADMIN
       * =====================================================
       *
       * Admin can go directly into Admin Dashboard.
       */
      if (
        roleFromDatabase === "admin" &&
        status === "active"
      ) {
        window.location.href = "/admin";
        return;
      }

      /*
       * =====================================================
       * APPROVED STUDENT
       * =====================================================
       */
      if (
        roleFromDatabase === "student" &&
        status === "active" &&
        data.registrationComplete === true
      ) {
        window.location.href = "/student";
        return;
      }

      /*
       * =====================================================
       * APPROVED FACULTY
       * =====================================================
       */
      if (
        roleFromDatabase === "faculty" &&
        status === "active" &&
        data.registrationComplete === true
      ) {
        window.location.href = "/faculty";
        return;
      }

      /*
       * =====================================================
       * EXISTING BUT NOT APPROVED / INCOMPLETE
       * =====================================================
       *
       * IMPORTANT:
       * Do NOT redirect.
       *
       * Show the details form again.
       */
      setRole(
        roleFromDatabase === "faculty"
          ? "faculty"
          : "student"
      );

      setForm({
        name:
          typeof data.name === "string"
            ? data.name
            : user.displayName ?? "",

        registerNumber:
          typeof data.registerNumber === "string"
            ? data.registerNumber
            : typeof data.studentId === "string"
              ? data.studentId
              : typeof data.facultyId === "string"
                ? data.facultyId
                : "",

        phone:
          typeof data.phone === "string"
            ? data.phone
            : "",

        year:
          typeof data.year === "string"
            ? data.year
            : "",
      });

      setShowForm(true);
    } catch (err) {
      console.error(
        "SCMS Google login error:",
        err
      );

      const authError =
        err as {
          code?: string;
        };

      if (
        authError.code ===
        "auth/popup-closed-by-user"
      ) {
        setError(
          "Google sign-in was cancelled."
        );
      } else if (
        authError.code ===
        "auth/popup-blocked"
      ) {
        setError(
          "Google sign-in popup was blocked. Allow popups and try again."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Google sign-in failed."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function updateForm(
    field: keyof RegistrationForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitRegistration(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!googleUser || !firestoreDb) {
      setError(
        "Your Google session is unavailable. Please sign in again."
      );
      return;
    }

    const name = form.name.trim();
    const registerNumber =
      form.registerNumber.trim().toUpperCase();
    const phone = form.phone.trim();
    const year = form.year.trim();

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (!registerNumber) {
      setError(
        role === "student"
          ? "Please enter your Register Number / USN."
          : "Please enter your Faculty ID."
      );
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (!year) {
      setError("Please select your year.");
      return;
    }

    try {
      setSaving(true);

      const userRef = doc(
        firestoreDb,
        "users",
        googleUser.uid
      );

      const commonData = {
        uid: googleUser.uid,

        name,

        email: googleUser.email,

        photoURL:
          googleUser.photoURL ?? "",

        phone,

        year,

        role,

        status: "pending",

        approvalStatus: "pending",

        registrationComplete: true,

        registerNumber,

        updatedAt: serverTimestamp(),
      };

      if (role === "student") {
        await setDoc(
          userRef,
          {
            ...commonData,

            studentId: registerNumber,

            createdAt: serverTimestamp(),
          },
          {
            merge: true,
          }
        );
      } else {
        await setDoc(
          userRef,
          {
            ...commonData,

            facultyId: registerNumber,

            createdAt: serverTimestamp(),
          },
          {
            merge: true,
          }
        );
      }

      setShowForm(false);
      setSubmitted(true);

      setMessage(
        `Your ${role} registration has been submitted successfully.`
      );
    } catch (err) {
      console.error(
        "Registration save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit registration."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * =====================================================
   * PENDING SCREEN
   * =====================================================
   */

  if (submitted) {
    return (
      <div className="w-full">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-100 text-amber-600">
              <Clock3 className="h-8 w-8" />
            </div>

            <h2 className="mt-5 text-2xl font-black text-amber-900">
              Waiting for Admin Approval
            </h2>

            <p className="mt-3 text-sm leading-6 text-amber-800">
              {message}
            </p>

            <div className="mt-5 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-700">
              Status: Pending Approval
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * DETAILS FORM
   * =====================================================
   */

  if (showForm && googleUser) {
    return (
      <div className="w-full">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 text-white">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
              College Registration
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Complete Your Details
            </h2>

            <p className="mt-2 text-sm leading-6 text-blue-100">
              Complete the form below. Your information
              will be reviewed by the administrator.
            </p>
          </div>

          <div className="p-6">
            {/* ACCOUNT TYPE */}

            <div className="mb-6">
              <label className="mb-3 block text-xs font-black uppercase tracking-wider text-slate-500">
                Account Type
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setRole("student")
                  }
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                    role === "student"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <GraduationCap className="h-5 w-5" />
                  Student
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setRole("faculty")
                  }
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                    role === "faculty"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Users className="h-5 w-5" />
                  Faculty
                </button>
              </div>
            </div>

            <form
              onSubmit={submitRegistration}
              className="space-y-5"
            >
              {/* NAME */}

              <Input
                label="Full Name *"
                value={form.name}
                onChange={(value) =>
                  updateForm("name", value)
                }
                placeholder="Enter your full name"
              />

              {/* REGISTER / FACULTY ID */}

              <Input
                label={
                  role === "student"
                    ? "Student Register Number / USN *"
                    : "Faculty ID *"
                }
                value={form.registerNumber}
                onChange={(value) =>
                  updateForm(
                    "registerNumber",
                    value
                  )
                }
                placeholder={
                  role === "student"
                    ? "NDCBCA001"
                    : "FAC001"
                }
              />

              {/* GMAIL */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Gmail *
                </label>

                <input
                  type="email"
                  value={googleUser.email}
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-500 outline-none"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Automatically obtained from Google.
                </p>
              </div>

              {/* FIREBASE UID */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Firebase User ID
                </label>

                <input
                  type="text"
                  value={googleUser.uid}
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-xs font-medium text-slate-500 outline-none"
                />
              </div>

              {/* PHONE */}

              <Input
                label="Phone Number *"
                type="tel"
                value={form.phone}
                onChange={(value) =>
                  updateForm(
                    "phone",
                    value
                      .replace(/\D/g, "")
                      .slice(0, 10)
                  )
                }
                placeholder="9876543210"
              />

              {/* YEAR */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Which Year? *
                </label>

                <select
                  value={form.year}
                  onChange={(event) =>
                    updateForm(
                      "year",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  required
                >
                  <option value="">
                    Select Year
                  </option>

                  <option value="1st Year">
                    1st Year
                  </option>

                  <option value="2nd Year">
                    2nd Year
                  </option>

                  <option value="3rd Year">
                    3rd Year
                  </option>

                  <option value="4th Year">
                    4th Year
                  </option>
                </select>
              </div>

              {/* ERROR */}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Submit for Admin Approval
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * GOOGLE BUTTON
   * =====================================================
   */

  return (
    <div className="w-full">
      <Button
        type="button"
        variant="outline"
        loading={loading}
        onClick={loginWithGoogle}
        className="w-full"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Chrome className="h-4 w-4" />
        )}

        Continue with Google
      </Button>

      {error && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   INPUT
===================================================== */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
      />
    </div>
  );
}