"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { useRouter } from "next/navigation";

import {
  GraduationCap,
  Users,
  Phone,
  Mail,
  User,
  BookOpen,
  Building2,
  Briefcase,
  CalendarDays,
  Hash,
  CheckCircle2,
  Clock3,
  ArrowLeft,
} from "lucide-react";

import {
  firebaseAuth,
  firestoreDb,
  isFirebaseConfigured,
} from "@/lib/firebase/client";

type RegistrationType = "student" | "faculty";

export default function RegisterPage() {
  const router = useRouter();

  const [type, setType] =
    useState<RegistrationType | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const [phone, setPhone] = useState("");
  const [academicYear, setAcademicYear] =
    useState("");

  const [registerNumber, setRegisterNumber] =
    useState("");

  const [facultyId, setFacultyId] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [designation, setDesignation] =
    useState("");

  /*
   * =====================================================
   * CHECK GOOGLE LOGIN
   * =====================================================
   */
  useEffect(() => {
    async function loadUser() {
      if (
        !isFirebaseConfigured ||
        !firebaseAuth ||
        !firestoreDb
      ) {
        setError(
          "Firebase is not configured correctly."
        );

        setLoading(false);
        return;
      }

      try {
        const user =
          firebaseAuth.currentUser;

        if (!user) {
          router.replace("/login");
          return;
        }

        setName(
          user.displayName ?? ""
        );

        setEmail(
          user.email ?? ""
        );

        setPhotoURL(
          user.photoURL ?? ""
        );

        /*
         * Check whether the user already has
         * a registration.
         */
        const userRef = doc(
          firestoreDb,
          "users",
          user.uid
        );

        const snapshot =
          await getDoc(userRef);

        if (snapshot.exists()) {
          const data = snapshot.data();

          /*
           * Already approved.
           */
          if (
            data.status === "active" &&
            data.role === "student"
          ) {
            router.replace("/student");
            return;
          }

          if (
            data.status === "active" &&
            data.role === "faculty"
          ) {
            router.replace("/faculty");
            return;
          }

          if (
            data.status === "active" &&
            data.role === "admin"
          ) {
            router.replace("/admin");
            return;
          }

          /*
           * Already pending.
           */
          if (data.status === "pending") {
            setSuccess(true);
          }

          /*
           * Restore previously entered information
           * if the user was rejected.
           */
          if (data.name) {
            setName(data.name);
          }

          if (data.phone) {
            setPhone(data.phone);
          }

          if (data.academicYear) {
            setAcademicYear(
              data.academicYear
            );
          }

          if (data.registerNumber) {
            setRegisterNumber(
              data.registerNumber
            );
          }

          if (data.facultyId) {
            setFacultyId(
              data.facultyId
            );
          }

          if (data.department) {
            setDepartment(
              data.department
            );
          }

          if (data.designation) {
            setDesignation(
              data.designation
            );
          }

          if (
            data.role === "student" ||
            data.role === "faculty"
          ) {
            setType(data.role);
          }
        }
      } catch (err) {
        console.error(
          "Registration profile error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your account."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadUser();
  }, [router]);

  /*
   * =====================================================
   * SUBMIT REGISTRATION
   * =====================================================
   */
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (
      !firebaseAuth ||
      !firestoreDb ||
      !isFirebaseConfigured
    ) {
      setError(
        "Firebase is not configured correctly."
      );
      return;
    }

    const user =
      firebaseAuth.currentUser;

    if (!user) {
      setError(
        "Your Google session has expired. Please sign in again."
      );

      router.replace("/login");

      return;
    }

    if (!type) {
      setError(
        "Please select Student or Faculty."
      );

      return;
    }

    /*
     * Basic validation
     */
    if (!name.trim()) {
      setError(
        "Please enter your full name."
      );
      return;
    }

    if (!phone.trim()) {
      setError(
        "Please enter your phone number."
      );
      return;
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (!academicYear) {
      setError(
        "Please select your academic year."
      );
      return;
    }

    if (
      type === "student" &&
      !registerNumber.trim()
    ) {
      setError(
        "Please enter your student register number."
      );
      return;
    }

    if (
      type === "faculty" &&
      !facultyId.trim()
    ) {
      setError(
        "Please enter your faculty ID."
      );
      return;
    }

    if (
      type === "faculty" &&
      !department.trim()
    ) {
      setError(
        "Please enter your department."
      );
      return;
    }

    if (
      type === "faculty" &&
      !designation.trim()
    ) {
      setError(
        "Please enter your designation."
      );
      return;
    }

    try {
      setSubmitting(true);

      const userRef = doc(
        firestoreDb,
        "users",
        user.uid
      );

      /*
       * Prevent accidental duplicate registrations.
       */
      const existing =
        await getDoc(userRef);

      if (
        existing.exists() &&
        existing.data().status === "active"
      ) {
        const existingRole =
          existing.data().role;

        if (existingRole === "student") {
          router.replace("/student");
          return;
        }

        if (existingRole === "faculty") {
          router.replace("/faculty");
          return;
        }

        if (existingRole === "admin") {
          router.replace("/admin");
          return;
        }
      }

      /*
       * Common user data
       */
      const profile: Record<
        string,
        unknown
      > = {
        uid: user.uid,

        name: name.trim(),

        email:
          user.email ??
          email.trim(),

        photoURL:
          user.photoURL ??
          photoURL,

        role: type,

        status: "pending",

        approved: false,

        phone: phone.trim(),

        academicYear,

        createdAt:
          existing.exists()
            ? existing.data()
                .createdAt ?? serverTimestamp()
            : serverTimestamp(),

        updatedAt:
          serverTimestamp(),

        submittedAt:
          serverTimestamp(),
      };

      /*
       * Student information
       */
      if (type === "student") {
        profile.registerNumber =
          registerNumber
            .trim()
            .toUpperCase();
      }

      /*
       * Faculty information
       */
      if (type === "faculty") {
        profile.facultyId =
          facultyId
            .trim()
            .toUpperCase();

        profile.department =
          department.trim();

        profile.designation =
          designation.trim();
      }

      /*
       * Save to users/{uid}
       */
      await setDoc(
        userRef,
        profile,
        {
          merge: true,
        }
      );

      setSuccess(true);
    } catch (err) {
      console.error(
        "Registration submission failed:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your registration."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * =====================================================
   * LOADING
   * =====================================================
   */
  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading your Google account...
          </p>
        </div>
      </main>
    );
  }

  /*
   * =====================================================
   * SUCCESS / PENDING
   * =====================================================
   */
  if (success) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-cyan-600 px-6 py-10 text-center text-white sm:px-10">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/15 backdrop-blur">
                <Clock3 className="h-10 w-10" />
              </div>

              <h1 className="mt-6 text-3xl font-black">
                Waiting for Admin Approval
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-blue-100">
                Your registration has been
                submitted successfully. The
                college administrator will review
                your information before activating
                your SCMS account.
              </p>
            </div>

            <div className="p-6 sm:p-10">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex gap-4">
                  <Clock3 className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />

                  <div>
                    <h2 className="font-black text-amber-900">
                      Account status: Pending
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-amber-800">
                      You cannot access the Student
                      or Faculty portal until an
                      administrator approves your
                      registration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <InfoRow
                  label="Name"
                  value={name}
                />

                <InfoRow
                  label="Gmail"
                  value={email}
                />

                <InfoRow
                  label="Account type"
                  value={
                    type === "student"
                      ? "Student"
                      : "Faculty"
                  }
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  router.replace("/login")
                }
                className="mt-8 w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Return to Login
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =====================================================
   * REGISTRATION PAGE
   * =====================================================
   */
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() =>
            router.replace("/login")
          }
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </button>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-6 py-10 text-white sm:px-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
              SCMS Registration
            </p>

            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              Complete your profile
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
              Your Google account has been
              authenticated. Complete the form below
              to submit your Student or Faculty
              registration for administrator approval.
            </p>

            {email && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-bold backdrop-blur">
                <Mail className="h-4 w-4" />
                {email}
              </div>
            )}
          </div>

          <div className="p-6 sm:p-10">
            {/* Account Type */}
            <section>
              <div className="mb-5">
                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Step 1
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  Select account type
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose the portal you belong to.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <AccountTypeCard
                  selected={
                    type === "student"
                  }
                  icon={GraduationCap}
                  title="Student"
                  description="Register as a college student."
                  onClick={() =>
                    setType("student")
                  }
                />

                <AccountTypeCard
                  selected={
                    type === "faculty"
                  }
                  icon={Users}
                  title="Faculty"
                  description="Register as a college faculty member."
                  onClick={() =>
                    setType("faculty")
                  }
                />
              </div>
            </section>

            {/* Form */}
            {type && (
              <form
                onSubmit={handleSubmit}
                className="mt-10"
              >
                <div className="mb-6">
                  <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                    Step 2
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-900">
                    {type === "student"
                      ? "Student information"
                      : "Faculty information"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter accurate information. An
                    administrator will verify these
                    details.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {/* Name */}
                  <FormField
                    label="Full Name"
                    icon={User}
                    required
                  >
                    <input
                      value={name}
                      onChange={(event) =>
                        setName(
                          event.target.value
                        )
                      }
                      placeholder="Enter your full name"
                      className="input"
                      required
                    />
                  </FormField>

                  {/* Email */}
                  <FormField
                    label="Gmail"
                    icon={Mail}
                    required
                  >
                    <input
                      value={email}
                      readOnly
                      className="input cursor-not-allowed bg-slate-50 text-slate-500"
                    />
                  </FormField>

                  {/* Phone */}
                  <FormField
                    label="Phone Number"
                    icon={Phone}
                    required
                  >
                    <input
                      value={phone}
                      onChange={(event) =>
                        setPhone(
                          event.target.value
                            .replace(
                              /\D/g,
                              ""
                            )
                            .slice(0, 10)
                        )
                      }
                      placeholder="10-digit phone number"
                      inputMode="numeric"
                      maxLength={10}
                      className="input"
                      required
                    />
                  </FormField>

                  {/* Academic Year */}
                  <FormField
                    label="Academic Year"
                    icon={CalendarDays}
                    required
                  >
                    <select
                      value={academicYear}
                      onChange={(event) =>
                        setAcademicYear(
                          event.target.value
                        )
                      }
                      className="input"
                      required
                    >
                      <option value="">
                        Select academic year
                      </option>
                      <option value="2026-27">
                        2026-27
                      </option>
                      <option value="2025-26">
                        2025-26
                      </option>
                      <option value="2024-25">
                        2024-25
                      </option>
                      <option value="2023-24">
                        2023-24
                      </option>
                    </select>
                  </FormField>

                  {/* Student fields */}
                  {type === "student" && (
                    <FormField
                      label="Register Number"
                      icon={Hash}
                      required
                    >
                      <input
                        value={registerNumber}
                        onChange={(event) =>
                          setRegisterNumber(
                            event.target.value
                          )
                        }
                        placeholder="Example: NDCBCA001"
                        className="input"
                        required
                      />
                    </FormField>
                  )}

                  {/* Faculty fields */}
                  {type === "faculty" && (
                    <>
                      <FormField
                        label="Faculty ID"
                        icon={Hash}
                        required
                      >
                        <input
                          value={facultyId}
                          onChange={(event) =>
                            setFacultyId(
                              event.target.value
                            )
                          }
                          placeholder="Example: FAC001"
                          className="input"
                          required
                        />
                      </FormField>

                      <FormField
                        label="Department"
                        icon={Building2}
                        required
                      >
                        <select
                          value={department}
                          onChange={(event) =>
                            setDepartment(
                              event.target.value
                            )
                          }
                          className="input"
                          required
                        >
                          <option value="">
                            Select department
                          </option>
                          <option value="BCA">
                            BCA
                          </option>
                          <option value="B.Com">
                            B.Com
                          </option>
                          <option value="BA">
                            BA
                          </option>
                          <option value="B.Sc">
                            B.Sc
                          </option>
                          <option value="BBM">
                            BBM
                          </option>
                          <option value="Other">
                            Other
                          </option>
                        </select>
                      </FormField>

                      <FormField
                        label="Designation"
                        icon={Briefcase}
                        required
                      >
                        <select
                          value={designation}
                          onChange={(event) =>
                            setDesignation(
                              event.target.value
                            )
                          }
                          className="input"
                          required
                        >
                          <option value="">
                            Select designation
                          </option>
                          <option value="Professor">
                            Professor
                          </option>
                          <option value="Associate Professor">
                            Associate Professor
                          </option>
                          <option value="Assistant Professor">
                            Assistant Professor
                          </option>
                          <option value="Lecturer">
                            Lecturer
                          </option>
                          <option value="HOD">
                            HOD
                          </option>
                          <option value="Other">
                            Other
                          </option>
                        </select>
                      </FormField>
                    </>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-semibold leading-6 text-red-700">
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-black text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Submitting Registration...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        Submit for Admin Approval
                      </>
                    )}
                  </button>
                </div>

                <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                  By submitting this form, your
                  registration will be sent to the
                  college administrator for verification.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(226 232 240);
          background: white;
          padding: 0.75rem 0.875rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: rgb(15 23 42);
          outline: none;
          transition: all 0.2s;
        }

        .input::placeholder {
          color: rgb(148 163 184);
        }

        .input:focus {
          border-color: rgb(37 99 235);
          box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
        }
      `}</style>
    </main>
  );
}

/*
 * ============================================================
 * ACCOUNT TYPE CARD
 * ============================================================
 */

function AccountTypeCard({
  selected,
  icon: Icon,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative rounded-2xl border p-5 text-left transition duration-300 ${
        selected
          ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
          : "border-slate-200 bg-white hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
      }`}
    >
      {selected && (
        <div className="absolute right-4 top-4">
          <CheckCircle2 className="h-5 w-5 text-blue-600" />
        </div>
      )}

      <div
        className={`grid h-12 w-12 place-items-center rounded-xl transition ${
          selected
            ? "bg-blue-600 text-white"
            : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"
        }`}
      >
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-lg font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </button>
  );
}

/*
 * ============================================================
 * FORM FIELD
 * ============================================================
 */

function FormField({
  label,
  icon: Icon,
  required,
  children,
}: {
  label: string;
  icon: React.ElementType;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600">
        <Icon className="h-4 w-4 text-blue-600" />

        {label}

        {required && (
          <span className="text-red-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

/*
 * ============================================================
 * INFO ROW
 * ============================================================
 */

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>

      <span className="truncate text-sm font-bold text-slate-700">
        {value || "—"}
      </span>
    </div>
  );
}