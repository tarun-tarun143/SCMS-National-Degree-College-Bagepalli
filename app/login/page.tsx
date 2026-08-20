import Link from "next/link";

import {
  ArrowLeft,
  Building2,
  GraduationCap,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import PublicFooter from "@/components/public/PublicFooter";
import GoogleLogin from "@/lib/auth/GoogleLogin";

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-[calc(100vh-220px)] lg:grid-cols-2">

        <div className="gradient-academic flex items-center p-8 text-white lg:p-14">
          <div className="mx-auto max-w-xl">

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to website
            </Link>

            <div className="mt-16 grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-xl font-black text-[var(--gold)]">
              NDC
            </div>

            <div className="mt-7 text-xs font-bold uppercase tracking-[.22em] text-blue-200">
              The National Degree College, Bagepalli
            </div>

            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
              One secure gateway for the college digital campus.
            </h1>

            <p className="mt-5 leading-7 text-blue-100">
              Sign in with your authorized Google account. SCMS reads
              your role from the college Firestore database and opens
              only the portal assigned to you.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <LoginFeature
                icon={GraduationCap}
                text="Student"
              />

              <LoginFeature
                icon={UserRound}
                text="Faculty"
              />

              <LoginFeature
                icon={Building2}
                text="Admin"
              />
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-blue-100">
              <ShieldCheck className="h-4 w-4 text-[var(--gold)]" />
              Role is controlled by the college, not by the login page.
            </div>

          </div>
        </div>

        <div className="flex items-center p-5 sm:p-8">
          <div className="mx-auto w-full max-w-md">

            <div className="card p-7 sm:p-8">

              <div className="text-xs font-bold uppercase tracking-wider text-[var(--blue)]">
                SCMS Secure Login
              </div>

              <h2 className="mt-2 text-3xl font-black text-[var(--navy)]">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Use the Google account issued or approved for your
                college role. New accounts stay pending until an
                administrator provisions them.
              </p>

              <div className="mt-7">
                <GoogleLogin />
              </div>

              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-800">
                <b>How access works:</b> Google verifies who you are;
                Firestore determines whether your account is an active
                Student, Faculty or Admin account.
              </div>

            </div>

            <p className="mt-5 text-center text-xs text-slate-500">
              Need college information?{" "}
              <Link
                href="/contact"
                className="font-bold text-[var(--blue)]"
              >
                Contact the college
              </Link>
            </p>

          </div>
        </div>

      </div>

      <PublicFooter />
    </div>
  );
}

function LoginFeature({
  icon: Icon,
  text,
}: {
  icon: typeof GraduationCap;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-bold">
      <Icon className="h-4 w-4 text-[var(--gold)]" />
      {text}
    </div>
  );
}

