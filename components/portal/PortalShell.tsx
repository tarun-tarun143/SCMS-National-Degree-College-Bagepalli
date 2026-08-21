"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import PublicFooter from "@/components/public/PublicFooter";
import {
  useScmsSession,
  requiredRoleLabel,
} from "@/lib/auth/session";
import type { UserRole } from "@/types/scms";

import {
  studentItems,
  facultyItems,
  adminItems,
} from "@/components/portal/portalItems";

type PortalShellProps = {
  role: UserRole;
  children: React.ReactNode;
  title: string;
};

export default function PortalShell({
  role,
  children,
  title,
}: PortalShellProps) {
  const path = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { user, loading, error, logout } = useScmsSession(role);

  const items =
    role === "student"
      ? studentItems
      : role === "faculty"
        ? facultyItems
        : adminItems;

  useEffect(() => {
    if (!loading && !user) {
      router.replace(
        error?.toLowerCase().includes("role")
          ? "/unauthorized"
          : "/login"
      );
    }
  }, [error, loading, router, user]);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  async function handleLogout() {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await logout();
      setShowLogoutModal(false);
      setOpen(false);
      router.replace("/login");
    } catch (logoutError) {
      console.error("SCMS logout failed:", logoutError);
      setLoggingOut(false);
    }
  }

  function openLogoutModal() {
    setShowLogoutModal(true);
    setOpen(false);
  }

  function closeLogoutModal() {
    if (loggingOut) return;
    setShowLogoutModal(false);
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Verifying your SCMS account…
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 p-6 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-xl font-black text-slate-900 dark:text-white">
            Access not available
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {error ??
              "Please sign in with an active college account."}
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-xl dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Return to secure login
          </Link>
        </div>
      </div>
    );
  }

  const roleTitle = requiredRoleLabel(role);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen">
        {/* MOBILE OVERLAY */}
        {open && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col
            border-r border-slate-200/80 bg-white/95
            shadow-2xl backdrop-blur-xl
            transition-transform duration-300 ease-out
            dark:border-slate-800 dark:bg-slate-900/95
            lg:static lg:translate-x-0 lg:shadow-none
            ${
              open
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >
          {/* HEADER */}
          <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-4 dark:border-slate-800">
            <Link
              href={`/${role}`}
              onClick={() => setOpen(false)}
              className="group flex min-w-0 items-center gap-3"
            >
              <div className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                <Image
                  src="/college-logo.jpg"
                  alt="The National Degree College, Bagepalli"
                  width={44}
                  height={44}
                  className="h-11 w-11 object-contain"
                />
              </div>

              <div className="min-w-0">
                <div className="truncate text-[11px] font-black tracking-wide text-slate-900 dark:text-white">
                  NATIONAL DEGREE COLLEGE
                </div>

                <div className="mt-0.5 text-[9px] font-bold tracking-[0.18em] text-slate-400">
                  SCMS · {roleTitle.toUpperCase()}
                </div>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* SIDEBAR BODY */}
          <div className="flex h-[calc(100vh-76px)] flex-col overflow-y-auto px-3 py-4">
            {/* USER CARD */}
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-3 shadow-sm dark:border-slate-800 dark:from-slate-800 dark:to-slate-900">
              <div className="flex items-center gap-3">
                {user.authUser.photoURL ? (
                  <img
                    src={user.authUser.photoURL}
                    alt={user.name || "User"}
                    className="h-10 w-10 shrink-0 rounded-xl object-cover ring-2 ring-white dark:ring-slate-700"
                  />
                ) : (
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-black text-white shadow-md">
                    {(user.name || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-black text-slate-900 dark:text-white">
                    {user.name}
                  </div>

                  <div className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Active · {roleTitle}
              </div>
            </div>

            {/* NAVIGATION */}
            <nav className="mt-4 grid gap-1">
              {items.map((item) => {
                const Icon = item.icon;

                const active =
                  path === item.href ||
                  path.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`
                      group relative flex items-center gap-2.5
                      rounded-xl px-2.5 py-2
                      transition-all duration-300
                      ${
                        active
                          ? "bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-950/40 dark:text-blue-300"
                          : "text-slate-600 hover:translate-x-1 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                      }
                    `}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-blue-500 to-violet-600" />
                    )}

                    <span
                      className={`
                        grid h-8 w-8 shrink-0 place-items-center rounded-lg
                        transition-all duration-300
                        group-hover:scale-110 group-hover:rotate-3
                        ${item.bg}
                        ${item.color}
                      `}
                    >
                      <Icon className="h-4 w-4" />
                    </span>

                    <span className="min-w-0 flex-1 truncate text-[12px] font-bold">
                      {item.label}
                    </span>

                    {active && (
                      <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* BOTTOM */}
            <div className="mt-auto pt-4">
              {/* SECURITY */}
              <div className="mb-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  Secure SCMS Session
                </div>

                <p className="mt-1 text-[9px] leading-4 text-emerald-600 dark:text-emerald-500">
                  Firebase Authentication protected session.
                </p>
              </div>

              {/* LOGOUT */}
              <button
                type="button"
                onClick={openLogoutModal}
                className="group flex w-full items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-2.5 py-2.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-100 hover:shadow-md dark:border-red-900/40 dark:bg-red-950/30 dark:hover:bg-red-950/50"
              >
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-white text-red-600 shadow-sm transition-transform duration-300 group-hover:scale-105 dark:bg-slate-900">
                  <LogOut className="h-4 w-4" />
                </div>

                <div>
                  <div className="text-[12px] font-black text-red-600">
                    Logout
                  </div>
                  <div className="text-[9px] font-medium text-red-400">
                    Sign out securely
                  </div>
                </div>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN AREA */}
        <div className="min-w-0 flex-1">
          {/* HEADER */}
          <header className="sticky top-0 z-40 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 md:px-6">
            <div className="flex min-w-0 items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="ml-2 min-w-0 lg:ml-0">
                <div className="text-[9px] font-black uppercase tracking-[0.16em] text-blue-600">
                  {roleTitle} Portal
                </div>

                <h1 className="truncate text-base font-black text-slate-900 dark:text-white md:text-lg">
                  {title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 sm:flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Online
              </div>

              <Link
                href="/"
                className="hidden rounded-lg px-2.5 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 sm:inline-flex"
              >
                Public Website
              </Link>

              <button
                type="button"
                onClick={openLogoutModal}
                className="hidden items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-[10px] font-black text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:hover:bg-red-950/50 md:inline-flex"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="min-h-[calc(100vh-76px)] p-4 md:p-6 lg:p-7">
            {children}
          </main>

          <PublicFooter />
        </div>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={closeLogoutModal}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-slate-100 bg-gradient-to-br from-red-50 to-white p-6 dark:border-slate-800 dark:from-red-950/30 dark:to-slate-900">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40">
                  <LogOut className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Sign out of SCMS?
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    You will be securely signed out of your college portal.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                <div className="flex items-center gap-3">
                  {user.authUser.photoURL ? (
                    <img
                      src={user.authUser.photoURL}
                      alt={user.name || "User"}
                      className="h-11 w-11 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 font-black text-white">
                      {(user.name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-800 dark:text-white">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                <p className="text-xs leading-5 text-emerald-700 dark:text-emerald-400">
                  Your Firebase authentication session will be closed when you sign out.
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeLogoutModal}
                  disabled={loggingOut}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  disabled={loggingOut}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loggingOut ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing out...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      Confirm Logout
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}