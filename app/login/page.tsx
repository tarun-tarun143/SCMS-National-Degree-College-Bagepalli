
"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
  Wifi,
  XCircle,
  Loader2,
  Building2,
  UserCog,
} from "lucide-react";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

type Role = "student" | "faculty" | "admin";

type UserProfile = {
  uid?: string;
  name?: string;
  email?: string;
  role?: Role;
  photoURL?: string;
};

const roleConfig = {
  student: {
    label: "Student",
    description: "Access classes, attendance, results & assignments",
    icon: GraduationCap,
  },

  faculty: {
    label: "Faculty",
    description: "Manage classes, attendance, marks & assignments",
    icon: Users,
  },

  admin: {
    label: "Administrator",
    description: "Manage the complete college management system",
    icon: UserCog,
  },
};

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("student");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  function updateField(
    field: "email" | "password",
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function getUserProfile(uid: string) {
    try {
      const userRef = doc(db, "users", uid);

      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        return null;
      }

      return snapshot.data() as UserProfile;
    } catch (error) {
      console.error("Unable to fetch user profile:", error);
      return null;
    }
  }

  function getDashboardPath(userRole?: string) {
    switch (userRole) {
      case "admin":
        return "/admin";

      case "faculty":
        return "/faculty";

      case "student":
        return "/student";

      default:
        return "/dashboard";
    }
  }

  async function redirectUser(uid: string) {
    const profile = await getUserProfile(uid);

    if (!profile) {
      setSuccess(
        "Login successful. Opening your dashboard..."
      );

      router.push("/dashboard");
      return;
    }

    const userRole = profile.role;

    if (userRole && userRole !== role) {
      setError(
        `This account is registered as ${userRole}. Please select the ${userRole} portal.`
      );

      await auth.signOut();
      return;
    }

    setSuccess(
      `Welcome${
        profile.name ? `, ${profile.name}` : ""
      }! Redirecting...`
    );

    router.push(getDashboardPath(userRole));
  }

  async function handleEmailLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    clearMessages();

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
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

      await redirectUser(credential.user.uid);
    } catch (loginError: any) {
      console.error("Email login error:", loginError);

      switch (loginError?.code) {
        case "auth/invalid-credential":
          setError(
            "Invalid email or password. Please check your credentials."
          );
          break;

        case "auth/user-not-found":
          setError(
            "No account was found with this email address."
          );
          break;

        case "auth/wrong-password":
          setError(
            "Incorrect password. Please try again."
          );
          break;

        case "auth/invalid-email":
          setError(
            "Please enter a valid email address."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "Too many login attempts. Please wait a few minutes and try again."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection."
          );
          break;

        default:
          setError(
            loginError?.message ||
              "Unable to sign in. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    clearMessages();

    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const credential = await signInWithPopup(
        auth,
        provider
      );

      await redirectUser(credential.user.uid);
    } catch (loginError: any) {
      console.error("Google login error:", loginError);

      if (
        loginError?.code ===
        "auth/popup-closed-by-user"
      ) {
        setError("Google sign-in was cancelled.");
      } else if (
        loginError?.code === "auth/popup-blocked"
      ) {
        setError(
          "Your browser blocked the Google sign-in popup. Please allow popups and try again."
        );
      } else if (
        loginError?.code ===
        "auth/account-exists-with-different-credential"
      ) {
        setError(
          "An account already exists with this email using another sign-in method."
        );
      } else {
        setError(
          loginError?.message ||
            "Google sign-in failed. Please try again."
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#061329]" />
    );
  }

  const SelectedRoleIcon = roleConfig[role].icon;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#061329] text-white">
      {/* =====================================================
          ANIMATED BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-600/25 blur-[110px] animate-[blob_10s_ease-in-out_infinite]" />

        <div className="absolute -right-40 top-10 h-[450px] w-[450px] rounded-full bg-cyan-500/20 blur-[120px] animate-[blob_12s_ease-in-out_infinite_reverse]" />

        <div className="absolute bottom-[-250px] left-[30%] h-[520px] w-[520px] rounded-full bg-indigo-600/20 blur-[130px] animate-[blob_14s_ease-in-out_infinite]" />

        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-amber-400/10 blur-[90px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        {/* Particles */}
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

        <FloatingParticle
          className="right-[42%] bottom-[12%]"
          delay="1s"
        />

        <FloatingParticle
          className="left-[48%] bottom-[30%]"
          delay="3s"
        />
      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="relative z-10 border-b border-white/10 bg-white/[0.03] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
              <Building2 className="h-5 w-5 text-white" />

              <span className="absolute inset-0 animate-pulse bg-white/10" />
            </div>

            <div>
              <p className="text-sm font-black tracking-wide">
                SCMS
              </p>

              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-blue-200/70">
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

      {/* =====================================================
          MAIN
      ====================================================== */}

      <section className="relative z-10 flex min-h-[calc(100vh-68px)] items-center px-5 py-8 sm:px-8 lg:py-10">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_440px]">
          {/* =================================================
              LEFT SIDE
          ================================================== */}

          <div className="hidden lg:block">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-200 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />

                Smart College Management System
              </div>

              <h1 className="mt-6 text-5xl font-black leading-[1.03] tracking-tight xl:text-6xl">
                Your campus.

                <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-amber-300 bg-clip-text text-transparent">
                  One smart portal.
                </span>
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-blue-100/70">
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

              <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                  <Lock className="h-3.5 w-3.5 text-emerald-400" />

                  Secure authentication
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />

                  Real-time system
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              LOGIN CARD
          ================================================== */}

          <div className="relative mx-auto w-full max-w-[440px]">
            {/* Glow */}
            <div className="absolute -inset-1 rounded-[1.7rem] bg-gradient-to-r from-blue-500 via-cyan-400 to-amber-400 opacity-45 blur-xl animate-[gradientBorder_6s_ease_infinite]" />

            {/* Outer card */}
            <div className="relative overflow-hidden rounded-[1.7rem] border border-white/15 bg-white/[0.09] p-1 shadow-2xl shadow-black/40 backdrop-blur-2xl">
              {/* Inner card */}
              <div className="rounded-[1.4rem] border border-white/10 bg-[#07152b]/95 p-5 sm:p-6">
                {/* Mobile heading */}
                <div className="mb-5 text-center lg:hidden">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30">
                    <GraduationCap className="h-6 w-6" />
                  </div>

                  <h1 className="mt-3 text-2xl font-black">
                    Welcome back
                  </h1>

                  <p className="mt-1.5 text-xs text-blue-100/60">
                    Sign in to your SCMS portal
                  </p>
                </div>

                {/* Desktop heading */}
                <div className="hidden lg:block">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
                        Secure portal
                      </p>

                      <h2 className="mt-1.5 text-2xl font-black">
                        Welcome back
                      </h2>

                      <p className="mt-1.5 text-xs text-blue-100/55">
                        Sign in to continue to your campus
                        dashboard.
                      </p>
                    </div>

                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-blue-400/20 bg-blue-400/10">
                      <Lock className="h-4 w-4 text-cyan-300" />
                    </div>
                  </div>
                </div>

                {/* =================================================
                    ROLE SELECTOR
                ================================================== */}

                <div className="mt-5">
                  <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Select portal
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(roleConfig) as Role[]).map(
                      (item) => {
                        const config = roleConfig[item];

                        const Icon = config.icon;

                        const active = role === item;

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setRole(item);
                              clearMessages();
                            }}
                            className={`group relative overflow-hidden rounded-lg border p-2.5 text-center transition-all duration-300 ${
                              active
                                ? "border-blue-400/60 bg-blue-500/15 shadow-lg shadow-blue-500/10"
                                : "border-white/10 bg-white/[0.03] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]"
                            }`}
                          >
                            {active && (
                              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
                            )}

                            <div
                              className={`mx-auto grid h-8 w-8 place-items-center rounded-lg transition duration-300 ${
                                active
                                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                                  : "bg-white/5 text-slate-400 group-hover:text-white"
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </div>

                            <p
                              className={`mt-1.5 text-[10px] font-bold ${
                                active
                                  ? "text-white"
                                  : "text-slate-400"
                              }`}
                            >
                              {config.label}
                            </p>
                          </button>
                        );
                      }
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                    <SelectedRoleIcon className="h-3 w-3 text-cyan-300" />

                    {roleConfig[role].description}
                  </div>
                </div>

                {/* =================================================
                    LOGIN FORM
                ================================================== */}

                <form
                  onSubmit={handleEmailLogin}
                  className="mt-5 space-y-4"
                >
                  {/* Email */}

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-xs font-bold text-slate-200"
                    >
                      Email address
                    </label>

                    <div className="group relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-cyan-400" />

                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(event) =>
                          updateField(
                            "email",
                            event.target.value
                          )
                        }
                        placeholder="you@example.com"
                        disabled={
                          loading || googleLoading
                        }
                        className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.045] pl-10 pr-3 text-xs text-white outline-none transition-all duration-300 placeholder:text-slate-500 hover:border-white/20 hover:bg-white/[0.06] focus:border-cyan-400/60 focus:bg-white/[0.07] focus:ring-4 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Password */}

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-xs font-bold text-slate-200"
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            "/forgot-password"
                          )
                        }
                        className="text-[10px] font-semibold text-cyan-300 transition hover:text-cyan-200"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="group relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-cyan-400" />

                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        autoComplete="current-password"
                        value={form.password}
                        onChange={(event) =>
                          updateField(
                            "password",
                            event.target.value
                          )
                        }
                        placeholder="Enter your password"
                        disabled={
                          loading || googleLoading
                        }
                        className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.045] pl-10 pr-11 text-xs text-white outline-none transition-all duration-300 placeholder:text-slate-500 hover:border-white/20 hover:bg-white/[0.06] focus:border-cyan-400/60 focus:bg-white/[0.07] focus:ring-4 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <button
                        type="button"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        onClick={() =>
                          setShowPassword(
                            (current) => !current
                          )
                        }
                        className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-slate-500 transition hover:bg-white/10 hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error */}

                  {error && (
                    <div className="flex items-start gap-2.5 rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-xs text-red-200 animate-[fadeIn_.3s_ease-out]">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

                      <span>{error}</span>
                    </div>
                  )}

                  {/* Success */}

                  {success && (
                    <div className="flex items-start gap-2.5 rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs text-emerald-200 animate-[fadeIn_.3s_ease-out]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                      <span>{success}</span>
                    </div>
                  )}

                  {/* Login button */}

                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="group relative flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-xs font-black text-white shadow-xl shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    <span className="pointer-events-none absolute inset-y-0 -left-20 w-16 skew-x-[-20deg] bg-white/30 transition-all duration-700 group-hover:left-[120%]" />

                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />

                        Signing in...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />

                        Sign in as{" "}
                        {roleConfig[role].label}

                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}

                <div className="my-5 flex items-center gap-2.5">
                  <div className="h-px flex-1 bg-white/10" />

                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    or continue with
                  </span>

                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Google */}

                <button
                  type="button"
                  disabled={loading || googleLoading}
                  onClick={handleGoogleLogin}
                  className="group flex h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.045] text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {googleLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}

                  {googleLoading
                    ? "Connecting to Google..."
                    : "Continue with Google"}
                </button>

                {/* Security */}

                <div className="mt-5 flex items-center justify-center gap-1.5 text-center text-[9px] leading-4 text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400/80" />

                  <span>
                    Protected by Firebase Authentication
                    <br />
                    Your account information is securely
                    handled.
                  </span>
                </div>
              </div>
            </div>

            {/* Floating icons */}

            <FloatingLoginIcon
              icon={BookOpen}
              className="-left-4 top-16"
              delay="0s"
            />

            <FloatingLoginIcon
              icon={Sparkles}
              className="-right-4 bottom-24"
              delay="1.5s"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="relative z-10 border-t border-white/10 bg-black/10 px-5 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1.5 text-center text-[10px] text-slate-500 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} The National Degree
            College, Bagepalli
          </p>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

            SCMS Digital Campus
          </div>
        </div>
      </footer>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style jsx global>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          33% {
            transform: translate3d(30px, -20px, 0) scale(1.08);
          }

          66% {
            transform: translate3d(-20px, 25px, 0) scale(0.95);
          }
        }

        @keyframes gradientBorder {
          0%,
          100% {
            background-position: 0% 50%;
          }

          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes loginFloat {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-10px) rotate(4deg);
          }
        }

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

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
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
    <div className="group rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.07]">
      <div className="flex items-center gap-2.5">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-400/10 text-cyan-300 transition duration-300 group-hover:scale-110">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <p className="text-xs font-bold text-white">
            {title}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-500">
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
      className={`absolute h-1.5 w-1.5 rounded-full bg-cyan-300/60 ${className}`}
      style={{
        animation:
          "particleFloat 4s ease-in-out infinite",
        animationDelay: delay,
      }}
    />
  );
}

/* ============================================================
   FLOATING LOGIN ICON
============================================================ */

function FloatingLoginIcon({
  icon: Icon,
  className,
  delay,
}: {
  icon: typeof BookOpen;
  className: string;
  delay: string;
}) {
  return (
    <div
      className={`absolute z-20 hidden h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/10 text-cyan-300 shadow-xl backdrop-blur-xl sm:grid ${className}`}
      style={{
        animation:
          "loginFloat 4s ease-in-out infinite",
        animationDelay: delay,
      }}
    >
      <Icon className="h-4 w-4" />
    </div>
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
