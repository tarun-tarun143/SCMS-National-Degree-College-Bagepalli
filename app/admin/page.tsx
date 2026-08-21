"use client";

import { useEffect, useState } from "react";

import {
  AlertCircle,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  RefreshCw,
  Users,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

type Counts = {
  students: number;
  faculty: number;
  attendance: number;
  fees: number;
  exams: number;
  notices: number;
};

const initialCounts: Counts = {
  students: 0,
  faculty: 0,
  attendance: 0,
  fees: 0,
  exams: 0,
  notices: 0,
};

export default function AdminDashboard() {
  const [counts, setCounts] =
    useState<Counts>(initialCounts);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  useEffect(() => {
    const db = firestoreDb;

    if (!db) {
      setError(
        "Firestore is not initialized. Check your Firebase configuration."
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const loaded = {
      students: false,
      faculty: false,
      attendance: false,
      fees: false,
      exams: false,
      notices: false,
    };

    function markLoaded(
      key: keyof typeof loaded
    ) {
      loaded[key] = true;

      const allLoaded =
        Object.values(loaded).every(Boolean);

      if (allLoaded) {
        setLoading(false);
      }
    }

    const unsubscribeStudents =
      onSnapshot(
        collection(db, "students"),
        (snapshot) => {
          setCounts((current) => ({
            ...current,
            students:
              snapshot.size,
          }));

          setLastUpdated(
            new Date()
          );

          markLoaded("students");
        },
        (listenerError) => {
          console.error(
            "Students listener error:",
            listenerError
          );

          setError(
            listenerError instanceof Error
              ? listenerError.message
              : "Unable to read students."
          );

          markLoaded("students");
        }
      );

    const unsubscribeFaculty =
      onSnapshot(
        collection(db, "faculty"),
        (snapshot) => {
          setCounts((current) => ({
            ...current,
            faculty:
              snapshot.size,
          }));

          setLastUpdated(
            new Date()
          );

          markLoaded("faculty");
        },
        (listenerError) => {
          console.error(
            "Faculty listener error:",
            listenerError
          );

          setError(
            listenerError instanceof Error
              ? listenerError.message
              : "Unable to read faculty."
          );

          markLoaded("faculty");
        }
      );

    const unsubscribeAttendance =
      onSnapshot(
        collection(
          db,
          "attendance"
        ),
        (snapshot) => {
          setCounts((current) => ({
            ...current,
            attendance:
              snapshot.size,
          }));

          setLastUpdated(
            new Date()
          );

          markLoaded("attendance");
        },
        (listenerError) => {
          console.error(
            "Attendance listener error:",
            listenerError
          );

          setError(
            listenerError instanceof Error
              ? listenerError.message
              : "Unable to read attendance."
          );

          markLoaded("attendance");
        }
      );

    const unsubscribeFees =
      onSnapshot(
        collection(db, "fees"),
        (snapshot) => {
          setCounts((current) => ({
            ...current,
            fees: snapshot.size,
          }));

          setLastUpdated(
            new Date()
          );

          markLoaded("fees");
        },
        (listenerError) => {
          console.error(
            "Fees listener error:",
            listenerError
          );

          setError(
            listenerError instanceof Error
              ? listenerError.message
              : "Unable to read fees."
          );

          markLoaded("fees");
        }
      );

    const unsubscribeExams =
      onSnapshot(
        collection(db, "exams"),
        (snapshot) => {
          setCounts((current) => ({
            ...current,
            exams: snapshot.size,
          }));

          setLastUpdated(
            new Date()
          );

          markLoaded("exams");
        },
        (listenerError) => {
          console.error(
            "Exams listener error:",
            listenerError
          );

          setError(
            listenerError instanceof Error
              ? listenerError.message
              : "Unable to read exams."
          );

          markLoaded("exams");
        }
      );

    const unsubscribeNotices =
      onSnapshot(
        collection(
          db,
          "notices"
        ),
        (snapshot) => {
          setCounts((current) => ({
            ...current,
            notices:
              snapshot.size,
          }));

          setLastUpdated(
            new Date()
          );

          markLoaded("notices");
        },
        (listenerError) => {
          console.error(
            "Notices listener error:",
            listenerError
          );

          setError(
            listenerError instanceof Error
              ? listenerError.message
              : "Unable to read notices."
          );

          markLoaded("notices");
        }
      );

    return () => {
      unsubscribeStudents();
      unsubscribeFaculty();
      unsubscribeAttendance();
      unsubscribeFees();
      unsubscribeExams();
      unsubscribeNotices();
    };
  }, []);

  function handleRefresh() {
    setLoading(true);
    setError("");

    setTimeout(() => {
      window.location.reload();
    }, 350);
  }

  return (
    <PortalShell
      role="admin"
      title="Admin Dashboard"
    >
      <main className="space-y-8 pb-10">
        <PageHeading
          eyebrow="Central administration"
          title="Institutional control center"
          description="Manage your college and monitor important institutional records in real time."
        />

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/40">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />

              <div className="min-w-0 flex-1">
                <p className="font-black text-red-800 dark:text-red-200">
                  Dashboard data could not be loaded
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600 dark:text-red-300">
                  {error}
                </p>

                <p className="mt-2 text-[11px] leading-5 text-red-500 dark:text-red-400">
                  Make sure your Firestore
                  security rules allow
                  the authenticated
                  admin account to read
                  the required
                  collections.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            Real-time database
          </span>

          {lastUpdated && (
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
              Last update:{" "}
              {lastUpdated.toLocaleTimeString(
                "en-IN"
              )}
            </span>
          )}
        </div>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <AnimatedStatCard
            label="Total Students"
            value={counts.students}
            icon={Users}
            description="Approved student records"
            gradient="from-blue-600 to-cyan-500"
            loading={loading}
          />

          <AnimatedStatCard
            label="Total Faculty"
            value={counts.faculty}
            icon={GraduationCap}
            description="Approved faculty records"
            gradient="from-violet-600 to-purple-500"
            loading={loading}
          />

          <AnimatedStatCard
            label="Attendance"
            value={counts.attendance}
            icon={ClipboardCheck}
            description="Attendance records"
            gradient="from-emerald-600 to-teal-500"
            loading={loading}
          />

          <AnimatedStatCard
            label="Fee Records"
            value={counts.fees}
            icon={CreditCard}
            description="Recorded transactions"
            gradient="from-orange-500 to-amber-500"
            loading={loading}
          />

          <AnimatedStatCard
            label="Exams"
            value={counts.exams}
            icon={CalendarDays}
            description="Configured exams"
            gradient="from-pink-600 to-rose-500"
            loading={loading}
          />

          <AnimatedStatCard
            label="Notices"
            value={counts.notices}
            icon={Bell}
            description="Notice records"
            gradient="from-indigo-600 to-blue-500"
            loading={loading}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl transition duration-500 group-hover:bg-blue-500/20" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                    Institution
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                    College Overview
                  </h2>
                </div>

                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <MiniStat
                  label="Students"
                  value={counts.students}
                />

                <MiniStat
                  label="Faculty"
                  value={counts.faculty}
                />

                <MiniStat
                  label="Attendance"
                  value={counts.attendance}
                />

                <MiniStat
                  label="Exams"
                  value={counts.exams}
                />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-purple-600 dark:text-purple-400">
                Administration
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                Quick actions
              </h2>

              <div className="mt-6 space-y-3">
                <QuickAction
                  title="Manage Students"
                  description="Add, edit and manage approved student records."
                  tone="blue"
                />

                <QuickAction
                  title="Manage Faculty"
                  description="Manage approved faculty members and academic information."
                  tone="purple"
                />

                <QuickAction
                  title="Manage Approvals"
                  description="Review student and faculty registration requests."
                  tone="green"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400">
                Firestore
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                Live Database Summary
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Totals update automatically whenever Firestore records change.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-800 dark:hover:bg-blue-950/50 dark:hover:text-blue-300"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DatabaseRow
              label="Students"
              value={counts.students}
              loading={loading}
              color="blue"
            />

            <DatabaseRow
              label="Faculty"
              value={counts.faculty}
              loading={loading}
              color="purple"
            />

            <DatabaseRow
              label="Attendance"
              value={counts.attendance}
              loading={loading}
              color="green"
            />

            <DatabaseRow
              label="Fees"
              value={counts.fees}
              loading={loading}
              color="orange"
            />

            <DatabaseRow
              label="Exams"
              value={counts.exams}
              loading={loading}
              color="pink"
            />

            <DatabaseRow
              label="Notices"
              value={counts.notices}
              loading={loading}
              color="cyan"
            />
          </div>
        </section>
      </main>
    </PortalShell>
  );
}

function AnimatedStatCard({
  label,
  value,
  icon: Icon,
  description,
  gradient,
  loading,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  description: string;
  gradient: string;
  loading: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900">
      <div
        className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-20`}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div
            className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
          >
            <Icon className="h-7 w-7" />
          </div>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
            Live
          </span>
        </div>

        <p className="mt-5 text-sm font-bold text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <div className="mt-1 flex items-center gap-2">
          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          ) : (
            <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {value.toLocaleString()}
            </span>
          )}
        </div>

        <p className="mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">
          {description}
        </p>

        <div className="mt-5 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full w-1/2 rounded-full bg-gradient-to-r ${gradient} transition-all duration-700 group-hover:w-full`}
          />
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/70 dark:hover:bg-slate-800">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function DatabaseRow({
  label,
  value,
  loading,
  color,
}: {
  label: string;
  value: number;
  loading: boolean;
  color:
    | "blue"
    | "purple"
    | "green"
    | "orange"
    | "pink"
    | "cyan";
}) {
  const colorClasses = {
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    green: "bg-emerald-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
    cyan: "bg-cyan-500",
  };

  return (
    <div className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/70 dark:hover:bg-slate-800">
      <div className="flex items-center gap-3">
        <span
          className={`h-3 w-3 rounded-full ${colorClasses[color]} ${
            loading
              ? "animate-pulse"
              : ""
          }`}
        />

        <div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {label}
          </p>

          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Real-time collection
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-7 w-14 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
      ) : (
        <span className="text-xl font-black text-slate-900 dark:text-white">
          {value.toLocaleString()}
        </span>
      )}
    </div>
  );
}

function QuickAction({
  title,
  description,
  tone,
}: {
  title: string;
  description: string;
  tone: "blue" | "purple" | "green";
}) {
  const styles = {
    blue: "border-blue-100 bg-blue-50 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-100",
    purple:
      "border-purple-100 bg-purple-50 text-purple-900 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-100",
    green:
      "border-emerald-100 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100",
  };

  const descriptionStyles = {
    blue:
      "text-blue-700 dark:text-blue-300",
    purple:
      "text-purple-700 dark:text-purple-300",
    green:
      "text-emerald-700 dark:text-emerald-300",
  };

  return (
    <div
      className={`rounded-2xl border p-4 transition hover:-translate-y-1 hover:shadow-md ${styles[tone]}`}
    >
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 opacity-80" />

        <div>
          <p className="font-bold">
            {title}
          </p>

          <p
            className={`mt-1 text-sm ${descriptionStyles[tone]}`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}