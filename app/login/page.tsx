"use client";

import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
  Wifi,
  XCircle,
  Phone,
  CalendarDays,
} from "lucide-react";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import { useRouter } from "next/navigation";

import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";

import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

/* ============================================================
   TYPES
============================================================ */

type Role = "student" | "faculty" | "admin";

type RegistrationForm = {
  name: string;
  phone: string;
  year: string;
};

type UserProfile = {
  uid?: string;
  name?: string;
  email?: string;
  role?: string;
  photoURL?: string;

  status?: string;
  approvalStatus?: string;
  registrationComplete?: boolean;

  phone?: string;
  year?: string;
};

/* ============================================================
   ROLE CONFIGURATION
============================================================ */

const roleConfig = {
  student: {
    label: "Student",
    description:
      "Access classes, attendance, results & assignments",
    icon: GraduationCap,
  },

  faculty: {
    label: "Faculty",
    description:
      "Manage classes, attendance, marks & assignments",
    icon: Users,
  },

  admin: {
    label: "Administrator",
    description:
      "Manage the complete college management system",
    icon: UserCog,
  },
};

const emptyRegistrationForm: RegistrationForm = {
  name: "",
  phone: "",
  year: "",
};

/* ============================================================
   LOGIN PAGE
============================================================ */

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] =
    useState<Role>("student");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [registrationSaving, setRegistrationSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [mounted, setMounted] =
    useState(false);

  const [showRegistration, setShowRegistration] =
    useState(false);

  const [registrationSubmitted, setRegistrationSubmitted] =
    useState(false);

  const [registrationForm, setRegistrationForm] =
    useState<RegistrationForm>(
      emptyRegistrationForm
    );

  /*
   * Real-time users/{uid} listener.
   */
  const userListenerRef =
    useRef<Unsubscribe | null>(null);

  /*
   * Prevent multiple redirects.
   */
  const redirectingRef =
    useRef(false);

  /* ==========================================================
     MOUNT / CLEANUP
  ========================================================== */

  useEffect(() => {
    setMounted(true);

    return () => {
      userListenerRef.current?.();
      userListenerRef.current = null;
    };
  }, []);

  /* ==========================================================
     STOP REAL-TIME LISTENER
  ========================================================== */

  function stopUserListener() {
    userListenerRef.current?.();
    userListenerRef.current = null;
  }

  /* ==========================================================
     MESSAGE HELPERS
  ========================================================== */

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  /* ==========================================================
     LOGIN FORM
  ========================================================== */

  function updateLoginField(
    field: "email" | "password",
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  /* ==========================================================
     GET USER PROFILE
  ========================================================== */

  async function getUserProfile(
    uid: string
  ): Promise<UserProfile | null> {
    if (!db) {
      throw new Error(
        "Firestore is not initialized."
      );
    }

    const reference = doc(
      db,
      "users",
      uid
    );

    const snapshot =
      await getDoc(reference);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as UserProfile;
  }

  /* ==========================================================
     REDIRECT APPROVED USER
  ========================================================== */

  function redirectApprovedUser(
    userRole: string
  ) {
    if (redirectingRef.current) {
      return;
    }

    redirectingRef.current = true;

    stopUserListener();

    switch (userRole) {
      case "student":
        router.replace("/student");
        return;

      case "faculty":
        router.replace("/faculty");
        return;

      case "admin":
        router.replace("/admin");
        return;

      default:
        redirectingRef.current = false;
        return;
    }
  }

  /* ==========================================================
     REAL-TIME APPROVAL LISTENER
  ========================================================== */

  function watchUserApproval(
    uid: string
  ) {
    if (!db) {
      return;
    }

    stopUserListener();

    const userRef = doc(
      db,
      "users",
      uid
    );

    userListenerRef.current =
      onSnapshot(
        userRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            setRegistrationSubmitted(
              false
            );

            setShowRegistration(true);

            setError(
              "Your registration record is no longer available."
            );

            return;
          }

          const data =
            snapshot.data() as UserProfile;

          const userRole =
            String(
              data.role ?? ""
            ).toLowerCase();

          const status =
            String(
              data.status ?? ""
            ).toLowerCase();

          const approvalStatus =
            String(
              data.approvalStatus ?? ""
            ).toLowerCase();

          /* APPROVED */

          if (
            status === "active" &&
            [
              "student",
              "faculty",
              "admin",
            ].includes(userRole)
          ) {
            setSuccess(
              "Your account has been approved. Opening your portal..."
            );

            redirectApprovedUser(
              userRole
            );

            return;
          }

          /* REJECTED */

          if (
            status === "rejected" ||
            approvalStatus === "rejected"
          ) {
            setRegistrationSubmitted(
              false
            );

            setShowRegistration(true);

            setError(
              "Your registration was rejected by the administrator. Please update your information and submit again."
            );

            return;
          }

          /* PENDING */

          if (
            status === "pending" ||
            approvalStatus === "pending"
          ) {
            setShowRegistration(false);

            setRegistrationSubmitted(
              true
            );

            setSuccess(
              `Your ${
                userRole === "faculty"
                  ? "faculty"
                  : "student"
              } registration is waiting for administrator approval.`
            );

            return;
          }
        },
        (listenerError) => {
          console.error(
            "Real-time approval listener error:",
            listenerError
          );

          setError(
            listenerError instanceof Error
              ? listenerError.message
              : "Unable to monitor your approval status."
          );
        }
      );
  }

  /* ==========================================================
     OPEN REGISTRATION
  ========================================================== */

  function openRegistration(
    profile?: UserProfile | null,
    currentUser?: User
  ) {
    const firebaseUser =
      currentUser ?? auth.currentUser;

    const studentPortal =
      role === "student";

    setRegistrationForm({
      name:
        profile?.name ??
        firebaseUser?.displayName ??
        "",

      phone:
        profile?.phone ??
        "",

      year:
        studentPortal
          ? profile?.year ?? ""
          : "",
    });

    setShowRegistration(true);

    setRegistrationSubmitted(false);
  }

  /* ==========================================================
     HANDLE AUTHENTICATED USER
  ========================================================== */

  async function handleAuthenticatedUser(
    firebaseUser: User
  ) {
    redirectingRef.current = false;

    const profile =
      await getUserProfile(
        firebaseUser.uid
      );

    /*
     * NEW USER
     */
    if (!profile) {
      openRegistration(
        null,
        firebaseUser
      );

      return;
    }

    const profileRole =
      String(
        profile.role ?? ""
      ).toLowerCase();

    const profileStatus =
      String(
        profile.status ?? ""
      ).toLowerCase();

    const approvalStatus =
      String(
        profile.approvalStatus ?? ""
      ).toLowerCase();

    /*
     * ROLE CHECK
     */
    if (
      profileRole === "student" &&
      role !== "student"
    ) {
      setError(
        "This account is registered as Student. Please select the Student portal."
      );

      await signOut(auth);

      return;
    }

    if (
      profileRole === "faculty" &&
      role !== "faculty"
    ) {
      setError(
        "This account is registered as Faculty. Please select the Faculty portal."
      );

      await signOut(auth);

      return;
    }

    if (
      profileRole === "admin" &&
      role !== "admin"
    ) {
      setError(
        "This account is registered as Administrator. Please select the Administrator portal."
      );

      await signOut(auth);

      return;
    }

    /*
     * APPROVED
     */
    if (
      profileStatus === "active" &&
      profileRole === "student"
    ) {
      redirectApprovedUser(
        "student"
      );

      return;
    }

    if (
      profileStatus === "active" &&
      profileRole === "faculty"
    ) {
      redirectApprovedUser(
        "faculty"
      );

      return;
    }

    if (
      profileStatus === "active" &&
      profileRole === "admin"
    ) {
      redirectApprovedUser(
        "admin"
      );

      return;
    }

    /*
     * PENDING
     */
    if (
      profileStatus === "pending" ||
      approvalStatus === "pending"
    ) {
      setShowRegistration(false);

      setRegistrationSubmitted(
        true
      );

      setSuccess(
        `Your ${
          profileRole === "faculty"
            ? "faculty"
            : "student"
        } registration is waiting for administrator approval.`
      );

      watchUserApproval(
        firebaseUser.uid
      );

      return;
    }

    /*
     * REJECTED
     */
    if (
      profileStatus === "rejected" ||
      approvalStatus === "rejected"
    ) {
      setError(
        "Your previous registration was rejected. Please update your details and submit again."
      );

      openRegistration(
        profile,
        firebaseUser
      );

      watchUserApproval(
        firebaseUser.uid
      );

      return;
    }

    /*
     * INCOMPLETE
     */
    openRegistration(
      profile,
      firebaseUser
    );

    watchUserApproval(
      firebaseUser.uid
    );
  }

  /* ==========================================================
     EMAIL LOGIN
  ========================================================== */

  async function handleEmailLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    clearMessages();

    if (!form.email.trim()) {
      setError(
        "Please enter your email address."
      );

      return;
    }

    if (!form.password) {
      setError(
        "Please enter your password."
      );

      return;
    }

    setLoading(true);

    try {
      const credential =
        await signInWithEmailAndPassword(
          auth,
          form.email.trim(),
          form.password
        );

      await handleAuthenticatedUser(
        credential.user
      );
    } catch (loginError: unknown) {
      console.error(
        "Email login error:",
        loginError
      );

      const code =
        typeof loginError === "object" &&
        loginError !== null &&
        "code" in loginError
          ? String(
              (
                loginError as {
                  code?: string;
                }
              ).code ?? ""
            )
          : "";

      const message =
        loginError instanceof Error
          ? loginError.message
          : "";

      switch (code) {
        case "auth/invalid-credential":
          setError(
            "Invalid email or password."
          );
          break;

        case "auth/user-not-found":
          setError(
            "No account was found with this email address."
          );
          break;

        case "auth/wrong-password":
          setError(
            "Incorrect password."
          );
          break;

        case "auth/invalid-email":
          setError(
            "Please enter a valid email address."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "Too many login attempts. Please try again later."
          );
          break;

        default:
          setError(
            message ||
              "Unable to sign in."
          );
      }
    } finally {
      setLoading(false);
    }
  }

  /* ==========================================================
     GOOGLE LOGIN
  ========================================================== */

  async function handleGoogleLogin() {
    clearMessages();

    setGoogleLoading(true);

    try {
      const provider =
        new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const credential =
        await signInWithPopup(
          auth,
          provider
        );

      await handleAuthenticatedUser(
        credential.user
      );
    } catch (loginError: unknown) {
      console.error(
        "Google login error:",
        loginError
      );

      const code =
        typeof loginError === "object" &&
        loginError !== null &&
        "code" in loginError
          ? String(
              (
                loginError as {
                  code?: string;
                }
              ).code ?? ""
            )
          : "";

      const message =
        loginError instanceof Error
          ? loginError.message
          : "";

      if (
        code ===
        "auth/popup-closed-by-user"
      ) {
        setError(
          "Google sign-in was cancelled."
        );
      } else if (
        code ===
        "auth/popup-blocked"
      ) {
        setError(
          "Your browser blocked the Google sign-in popup."
        );
      } else {
        setError(
          message ||
            "Google sign-in failed."
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  /* ==========================================================
     REGISTRATION SUBMIT
  ========================================================== */

  async function handleRegistrationSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    clearMessages();

    const currentUser =
      auth.currentUser;

    if (!currentUser) {
      setError(
        "Your Google session has expired. Please sign in again."
      );

      return;
    }

    if (!db) {
      setError(
        "Firestore is not initialized."
      );

      return;
    }

    const name =
      registrationForm.name.trim();

    const phone =
      registrationForm.phone.trim();

    const year =
      registrationForm.year.trim();

    /*
     * NAME
     */

    if (!name) {
      setError(
        "Please enter your full name."
      );

      return;
    }

    /*
     * PHONE
     */

    if (
      !/^[0-9]{10}$/.test(phone)
    ) {
      setError(
        "Please enter a valid 10-digit phone number."
      );

      return;
    }

    /*
     * STUDENT YEAR
     */

    if (
      role === "student" &&
      !year
    ) {
      setError(
        "Please select your current year."
      );

      return;
    }

    try {
      setRegistrationSaving(true);

      const userRef = doc(
        db,
        "users",
        currentUser.uid
      );

      /*
       * The registration only creates/updates
       * users/{firebaseUid}.
       *
       * No students/{uid} or faculty/{uid}
       * record is created here.
       *
       * That should happen during admin approval.
       */
      const commonData = {
        uid: currentUser.uid,

        name,

        email:
          currentUser.email ?? "",

        photoURL:
          currentUser.photoURL ?? "",

        phone,

        status: "pending",

        approvalStatus: "pending",

        registrationComplete: true,

        updatedAt:
          serverTimestamp(),
      };

      /*
       * STUDENT
       */
      if (role === "student") {
        await setDoc(
          userRef,
          {
            ...commonData,

            role: "student",

            year,

            createdAt:
              serverTimestamp(),
          },
          {
            merge: true,
          }
        );
      }

      /*
       * FACULTY
       *
       * No year field.
       */
      if (role === "faculty") {
        await setDoc(
          userRef,
          {
            ...commonData,

            role: "faculty",

            createdAt:
              serverTimestamp(),
          },
          {
            merge: true,
          }
        );
      }

      /*
       * Start real-time monitoring immediately.
       */
      watchUserApproval(
        currentUser.uid
      );

      setShowRegistration(false);

      setRegistrationSubmitted(true);

      setSuccess(
        `Your ${
          role === "student"
            ? "student"
            : "faculty"
        } registration has been submitted successfully. Waiting for administrator approval.`
      );
    } catch (registrationError) {
      console.error(
        "Registration submission error:",
        registrationError
      );

      setError(
        registrationError instanceof Error
          ? registrationError.message
          : "Unable to submit registration."
      );
    } finally {
      setRegistrationSaving(false);
    }
  }

  /* ==========================================================
     DIFFERENT ACCOUNT
  ========================================================== */

  async function handleUseDifferentAccount() {
    try {
      stopUserListener();

      await signOut(auth);

      setShowRegistration(false);

      setRegistrationSubmitted(
        false
      );

      setRegistrationForm(
        emptyRegistrationForm
      );

      clearMessages();
    } catch (logoutError) {
      console.error(
        "Logout error:",
        logoutError
      );

      setError(
        "Unable to sign out. Please try again."
      );
    }
  }

  /* ==========================================================
     BEFORE MOUNT
  ========================================================== */

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#12091f]" />
    );
  }

  const SelectedRoleIcon =
    roleConfig[role].icon;

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#12091f] text-white">

      {/* ======================================================
          LOGIN BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[430px] w-[430px] rounded-full bg-violet-600/25 blur-[120px]" />

        <div className="absolute -right-40 top-0 h-[460px] w-[460px] rounded-full bg-fuchsia-500/20 blur-[125px]" />

        <div className="absolute bottom-[-250px] left-[25%] h-[520px] w-[520px] rounded-full bg-purple-700/20 blur-[140px]" />

        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-pink-500/10 blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize:
              "55px 55px",
          }}
        />

        <FloatingParticle
          className="left-[8%] top-[18%]"
          delay="0s"
        />

        <FloatingParticle
          className="left-[15%] top-[72%]"
          delay="1.5s"
        />

        <FloatingParticle
          className="left-[38%] top-[12%]"
          delay="2s"
        />

        <FloatingParticle
          className="right-[30%] top-[20%]"
          delay="0.7s"
        />

        <FloatingParticle
          className="right-[12%] top-[70%]"
          delay="2.5s"
        />
      </div>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="relative z-10 border-b border-purple-400/10 bg-purple-950/20 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">

          <div className="flex items-center gap-3">

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-600/30">

              <Building2 className="h-5 w-5" />

            </div>

            <div>

              <p className="text-sm font-black tracking-wide">
                SCMS
              </p>

              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-purple-200/70">
                National Degree College
              </p>

            </div>

          </div>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3.5 py-1.5 text-[11px] font-semibold text-emerald-300 sm:flex">

            <span className="relative flex h-2 w-2">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />

            </span>

            System Online

          </div>

        </div>

      </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <section className="relative z-10 flex min-h-[calc(100vh-68px)] items-center px-5 py-8 sm:px-8 lg:py-10">

        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_440px]">

          {/* ==================================================
              LEFT
          ================================================== */}

          <div className="hidden lg:block">

            <div className="max-w-xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-purple-200">

                <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />

                Smart College Management System

              </div>

              <h1 className="mt-6 text-5xl font-black leading-[1.03] tracking-tight xl:text-6xl">

                Your campus.

                <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-200 to-pink-300 bg-clip-text text-transparent">
                  One smart portal.
                </span>

              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-purple-100/70">

                A modern digital campus platform for
                students, faculty and administrators of
                The National Degree College, Bagepalli.

              </p>

              <div className="mt-7 grid max-w-lg grid-cols-2 gap-3">

                <FeatureCard
                  icon={GraduationCap}
                  title="Student Portal"
                  text="Academic services"
                />

                <FeatureCard
                  icon={Users}
                  title="Faculty Portal"
                  text="Teaching management"
                />

                <FeatureCard
                  icon={ShieldCheck}
                  title="Secure Access"
                  text="Protected accounts"
                />

                <FeatureCard
                  icon={Wifi}
                  title="Digital Campus"
                  text="Connected services"
                />

              </div>

            </div>
          </div>

          {/* ==================================================
              RIGHT CARD
          ================================================== */}

          <div className="relative mx-auto w-full max-w-[440px]">

            {/* LOGIN GLOW */}

            <div className="absolute -inset-1 rounded-[1.7rem] bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 opacity-45 blur-xl" />

            <div className="relative overflow-hidden rounded-[1.7rem] border border-violet-300/15 bg-violet-950/20 p-1 shadow-2xl shadow-purple-950/50 backdrop-blur-2xl">

              <div
                className={
                  showRegistration ||
                  registrationSubmitted
                    ? "rounded-[1.4rem] bg-white p-5 text-slate-900 sm:p-6"
                    : "rounded-[1.4rem] border border-violet-300/10 bg-[#1a0d2b]/95 p-5 sm:p-6"
                }
              >

                {/* =================================================
                    PENDING
                ================================================= */}

                {registrationSubmitted ? (

                  <PendingCard
                    message={success}
                    email={
                      auth.currentUser?.email ??
                      ""
                    }
                  />

                ) : showRegistration ? (

                  /* =================================================
                     REGISTRATION
                  ================================================= */

                  <RegistrationCard
                    role={
                      role === "faculty"
                        ? "faculty"
                        : "student"
                    }
                    form={
                      registrationForm
                    }
                    setForm={
                      setRegistrationForm
                    }
                    saving={
                      registrationSaving
                    }
                    error={error}
                    email={
                      auth.currentUser?.email ??
                      ""
                    }
                    onSubmit={
                      handleRegistrationSubmit
                    }
                    onLogout={
                      handleUseDifferentAccount
                    }
                  />

                ) : (

                  /* =================================================
                     LOGIN
                  ================================================= */

                  <>
                    <div className="text-center">

                      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-500/30">

                        <GraduationCap className="h-6 w-6" />

                      </div>

                      <h1 className="mt-4 text-2xl font-black">
                        Welcome Back
                      </h1>

                      <p className="mt-1.5 text-xs text-purple-100/60">
                        Sign in to your SCMS portal
                      </p>

                    </div>

                    {/* PORTAL SELECTOR */}

                    <div className="mt-6">

                      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.15em] text-purple-200/50">
                        Select Portal
                      </p>

                      <div className="grid grid-cols-3 gap-2">

                        {(
                          Object.keys(
                            roleConfig
                          ) as Role[]
                        ).map((item) => {

                          const config =
                            roleConfig[item];

                          const Icon =
                            config.icon;

                          const active =
                            role === item;

                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                setRole(item);
                                clearMessages();
                              }}
                              className={`rounded-xl border p-3 transition ${
                                active
                                  ? "border-violet-400/50 bg-violet-500/15 text-white shadow-lg shadow-violet-500/10"
                                  : "border-violet-300/10 bg-violet-400/[0.03] text-purple-200/60 hover:border-violet-300/20 hover:bg-violet-400/[0.06]"
                              }`}
                            >

                              <Icon className="mx-auto h-5 w-5" />

                              <p className="mt-2 text-[10px] font-bold">
                                {config.label}
                              </p>

                            </button>
                          );
                        })}

                      </div>

                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-purple-200/50">

                        <SelectedRoleIcon className="h-3 w-3 text-fuchsia-300" />

                        {
                          roleConfig[
                            role
                          ].description
                        }

                      </div>

                    </div>

                    {/* EMAIL LOGIN */}

                    <form
                      onSubmit={
                        handleEmailLogin
                      }
                      className="mt-6 space-y-4"
                    >

                      <DarkInput
                        label="Email address"
                        value={
                          form.email
                        }
                        onChange={
                          (
                            value
                          ) =>
                            updateLoginField(
                              "email",
                              value
                            )
                        }
                        placeholder="you@example.com"
                        type="email"
                      />

                      {/* PASSWORD */}

                      <div>

                        <div className="mb-1.5 flex items-center justify-between">

                          <label className="text-xs font-bold text-purple-100">
                            Password
                          </label>

                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                "/forgot-password"
                              )
                            }
                            className="text-[10px] font-semibold text-fuchsia-300 hover:text-fuchsia-200"
                          >
                            Forgot password?
                          </button>

                        </div>

                        <div className="relative">

                          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-300/30" />

                          <input
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            value={
                              form.password
                            }
                            onChange={(
                              event
                            ) =>
                              updateLoginField(
                                "password",
                                event
                                  .target
                                  .value
                              )
                            }
                            placeholder="Enter your password"
                            className="h-12 w-full rounded-xl border border-violet-300/10 bg-white/[0.04] pl-10 pr-11 text-xs text-white outline-none placeholder:text-purple-200/30 focus:border-violet-400/70 focus:bg-violet-400/[0.06] focus:ring-4 focus:ring-violet-500/10"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(
                                (
                                  value
                                ) =>
                                  !value
                              )
                            }
                            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-purple-200/40 hover:text-white"
                          >

                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}

                          </button>

                        </div>
                      </div>

                      {error && (
                        <ErrorBox
                          message={
                            error
                          }
                        />
                      )}

                      {success && (
                        <SuccessBox
                          message={
                            success
                          }
                        />
                      )}

                      {/* LOGIN BUTTON */}

                      <button
                        type="submit"
                        disabled={
                          loading ||
                          googleLoading
                        }
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 text-xs font-black text-white shadow-xl shadow-violet-600/20 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >

                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}

                        Sign in as{" "}

                        {
                          roleConfig[
                            role
                          ].label
                        }

                        <ArrowRight className="h-4 w-4" />

                      </button>

                    </form>

                    {/* DIVIDER */}

                    <div className="my-5 flex items-center gap-3">

                      <div className="h-px flex-1 bg-violet-300/10" />

                      <span className="text-[9px] font-bold uppercase tracking-wider text-purple-200/30">
                        or
                      </span>

                      <div className="h-px flex-1 bg-violet-300/10" />

                    </div>

                    {/* GOOGLE LOGIN */}

                    <button
                      type="button"
                      disabled={
                        loading ||
                        googleLoading
                      }
                      onClick={
                        handleGoogleLogin
                      }
                      className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {googleLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <GoogleIcon />
                      )}

                      {googleLoading
                        ? "Connecting..."
                        : `Continue with Google as ${
                            roleConfig[
                              role
                            ].label
                          }`}

                    </button>

                    {/* SECURITY */}

                    <div className="mt-5 flex items-center justify-center gap-1.5 text-center text-[9px] leading-4 text-purple-200/30">

                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />

                      Secure Firebase Authentication

                    </div>

                  </>
                )}

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="relative z-10 border-t border-violet-300/10 bg-black/10 px-5 py-3">

        <div className="mx-auto flex max-w-7xl items-center justify-between text-[10px] text-purple-200/30">

          <p>
            © {new Date().getFullYear()} The National Degree
            College, Bagepalli
          </p>

          <span>
            SCMS Digital Campus
          </span>

        </div>

      </footer>

      {/* ======================================================
          ANIMATIONS
      ====================================================== */}

      <style jsx global>{`
        @keyframes particleFloat {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.2;
          }

          50% {
            transform: translateY(-22px);
            opacity: 0.9;
          }
        }
      `}</style>

    </main>
  );
}

/* ============================================================
   REGISTRATION CARD
============================================================ */

function RegistrationCard({
  role,
  form,
  setForm,
  saving,
  error,
  email,
  onSubmit,
  onLogout,
}: {
  role: "student" | "faculty";

  form: RegistrationForm;

  setForm: Dispatch<
    SetStateAction<RegistrationForm>
  >;

  saving: boolean;

  error: string;

  email: string;

  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;

  onLogout: () => void;
}) {
  const isStudent =
    role === "student";

  return (
    <div className="text-slate-900">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-7 text-center">

        <div
          className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl shadow-lg ${
            isStudent
              ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/20"
              : "bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-600/20"
          }`}
        >

          {isStudent ? (
            <GraduationCap className="h-7 w-7 text-white" />
          ) : (
            <Users className="h-7 w-7 text-white" />
          )}

        </div>

        <p
          className={`mt-4 text-[9px] font-black uppercase tracking-[0.2em] ${
            isStudent
              ? "text-emerald-600"
              : "text-blue-600"
          }`}
        >
          {isStudent
            ? "Student Registration"
            : "Faculty Registration"}
        </p>

        <h2 className="mt-2 text-2xl font-black text-slate-900">
          Complete Your Profile
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
          Your Google account has been
          verified. Complete the required
          information for administrator
          approval.
        </p>

      </div>

      {/* ==================================================
          FORM
      ================================================== */}

      <form
        onSubmit={onSubmit}
        className="space-y-5"
      >

        {/* FULL NAME */}

        <LightInput
          label="Full Name"
          icon={Users}
          value={form.name}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              name: value,
            }))
          }
          placeholder="Enter your full name"
        />

        {/* GMAIL */}

        <div>

          <label className="mb-1.5 block text-sm font-bold text-slate-700">
            Gmail
          </label>

          <div className="relative">

            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={email}
              readOnly
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 pl-10 pr-4 text-sm text-slate-500 outline-none"
            />

          </div>

          <p className="mt-1.5 text-[10px] text-slate-400">
            Automatically obtained from
            your Google account.
          </p>

        </div>

        {/* PHONE */}

        <LightInput
          label="Phone Number"
          icon={Phone}
          value={form.phone}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              phone: value
                .replace(/\D/g, "")
                .slice(0, 10),
            }))
          }
          placeholder="9876543210"
          type="tel"
        />

        {/* STUDENT YEAR ONLY */}

        {isStudent && (
          <div>

            <label className="mb-1.5 block text-sm font-bold text-slate-700">
              Current Year
            </label>

            <div className="relative">

              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                value={
                  form.year
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      year: event
                        .target
                        .value,
                    })
                  )
                }
                required
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              >

                <option value="">
                  Select current year
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

              </select>

            </div>

          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3">

            <div className="flex items-start gap-2">

              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

              <p className="text-xs font-semibold leading-5 text-red-700">
                {error}
              </p>

            </div>

          </div>
        )}

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={saving}
          className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${
            isStudent
              ? "bg-gradient-to-r from-emerald-600 to-teal-500 shadow-emerald-600/20 hover:shadow-xl"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-600/20 hover:shadow-xl"
          }`}
        >

          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting Registration...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Submit for Admin Approval
            </>
          )}

        </button>

        {/* DIFFERENT ACCOUNT */}

        <button
          type="button"
          onClick={onLogout}
          disabled={saving}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
        >
          Use a different Google account
        </button>

      </form>
    </div>
  );
}

/* ============================================================
   LIGHT INPUT
============================================================ */

function LightInput({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  icon: typeof Users;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>

      <label className="mb-1.5 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <div className="relative">

        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type={type}
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          required
          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
        />

      </div>

    </div>
  );
}

/* ============================================================
   DARK INPUT
============================================================ */

function DarkInput({
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

      <label className="mb-1.5 block text-xs font-bold text-purple-100">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        required
        className="h-12 w-full rounded-xl border border-violet-300/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-purple-200/30 focus:border-violet-400/70 focus:bg-violet-400/[0.06] focus:ring-4 focus:ring-violet-500/10"
      />

    </div>
  );
}

/* ============================================================
   PENDING CARD
============================================================ */

function PendingCard({
  message,
  email,
}: {
  message: string;
  email: string;
}) {
  return (
    <div className="py-7 text-center">

      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-50 text-amber-500">

        <Loader2 className="h-8 w-8 animate-pulse" />

      </div>

      <p className="mt-5 text-[9px] font-black uppercase tracking-[0.2em] text-amber-600">
        Registration Submitted
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-900">
        Waiting for Approval
      </h2>

      <p className="mt-3 text-xs leading-6 text-slate-500">
        {message ||
          "Your registration has been submitted. Please wait for the college administrator to approve your account."}
      </p>

      {email && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">

          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            Gmail
          </p>

          <p className="mt-1 break-all text-xs font-bold text-slate-700">
            {email}
          </p>

        </div>
      )}

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700">
        Pending administrator approval
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
        Live approval monitoring enabled
      </div>

    </div>
  );
}

/* ============================================================
   ERROR
============================================================ */

function ErrorBox({
  message,
}: {
  message: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-xs text-red-200">

      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

      <span>{message}</span>

    </div>
  );
}

/* ============================================================
   SUCCESS
============================================================ */

function SuccessBox({
  message,
}: {
  message: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs text-emerald-200">

      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

      <span>{message}</span>

    </div>
  );
}

/* ============================================================
   FEATURE CARD
============================================================ */

function FeatureCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof GraduationCap;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-violet-300/10 bg-violet-400/[0.03] p-3 transition hover:-translate-y-1 hover:border-violet-300/20 hover:bg-violet-400/[0.06]">

      <div className="flex items-center gap-2.5">

        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-500/10 text-fuchsia-300">

          <Icon className="h-4 w-4" />

        </div>

        <div>

          <p className="text-xs font-bold text-white">
            {title}
          </p>

          <p className="mt-0.5 text-[10px] text-purple-200/40">
            {text}
          </p>

        </div>

      </div>
    </div>
  );
}

/* ============================================================
   FLOATING PARTICLE
============================================================ */

function FloatingParticle({
  className,
  delay,
}: {
  className: string;
  delay: string;
}) {
  return (
    <span
      className={`absolute h-1.5 w-1.5 rounded-full bg-fuchsia-300/60 ${className}`}
      style={{
        animation:
          "particleFloat 4s ease-in-out infinite",
        animationDelay: delay,
      }}
    />
  );
}

/* ============================================================
   GOOGLE ICON
============================================================ */

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M21.805 12.23c0-.79-.07-1.55-.23-2.28H12v4.31h5.495a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.05-4.4 3.05-7.67Z"
        fill="#4285F4"
      />

      <path
        d="M12 22c2.76 0 5.08-.91 6.77-2.47l-3.3-2.56c-.91.61-2.07.97-3.47.97-2.67 0-4.94-1.8-5.75-4.22H2.84v2.64A10.22 10.22 0 0 0 12 22Z"
        fill="#34A853"
      />

      <path
        d="M6.25 13.72A6.14 6.14 0 0 1 5.93 12c0-.6.11-1.18.32-1.72V7.64H2.84A10.01 10.01 0 0 0 1.78 12c0 1.61.39 3.14 1.06 4.36l3.41-2.64Z"
        fill="#FBBC05"
      />

      <path
        d="M12 6.06c1.5 0 2.84.52 3.9 1.54l2.92-2.92C17.08 3.08 14.76 2 12 2a10.22 10.22 0 0 0-9.16 5.64l3.41 2.64C7.06 7.86 9.33 6.06 12 6.06Z"
        fill="#EA4335"
      />
    </svg>
  );
}