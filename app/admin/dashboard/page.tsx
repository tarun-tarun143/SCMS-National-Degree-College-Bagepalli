
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";

import {
  AlertCircle,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Database,
  GraduationCap,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";

/* ============================================================
   PAGE
============================================================ */

export default function AdminDashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [attendanceCount, setAttendanceCount] =
    useState(0);
  const [feeCount, setFeeCount] = useState(0);
  const [examCount, setExamCount] = useState(0);
  const [noticeCount, setNoticeCount] =
    useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCounts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const db = firestoreDb;

      if (!db) {
        throw new Error(
          "Firestore is not initialized. Check your Firebase configuration."
        );
      }

      const [
        studentsSnapshot,
        facultySnapshot,
        attendanceSnapshot,
        feesSnapshot,
        examsSnapshot,
        noticesSnapshot,
      ] = await Promise.all([
        getCountFromServer(
          collection(db, "students")
        ),
        getCountFromServer(
          collection(db, "faculty")
        ),
        getCountFromServer(
          collection(db, "attendance")
        ),
        getCountFromServer(
          collection(db, "fees")
        ),
        getCountFromServer(
          collection(db, "exams")
        ),
        getCountFromServer(
          query(
            collection(db, "notices"),
            where(
              "status",
              "==",
              "published"
            )
          )
        ),
      ]);

      setStudentCount(
        studentsSnapshot.data().count
      );

      setFacultyCount(
        facultySnapshot.data().count
      );

      setAttendanceCount(
        attendanceSnapshot.data().count
      );

      setFeeCount(
        feesSnapshot.data().count
      );

      setExamCount(
        examsSnapshot.data().count
      );

      setNoticeCount(
        noticesSnapshot.data().count
      );
    } catch (err) {
      console.error(
        "Dashboard count error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard counts."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCounts();
  }, [loadCounts]);

  return (
    <PortalShell
      role="admin"
      title="Admin Dashboard"
    >
      <main className="space-y-8 pb-10">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 text-white shadow-xl sm:p-8">

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative">
            <PageHeading
              eyebrow="Central administration"
              title="Institutional control center"
              description="Monitor students, faculty and important college operations from one professional administrative dashboard."
            />

            <div className="mt-6 flex flex-wrap items-center gap-3">

              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                System online
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
                <Database className="h-4 w-4" />
                Firestore connected
              </span>

              <button
                type="button"
                onClick={() =>
                  void loadCounts()
                }
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-blue-700 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    loading
                      ? "animate-spin"
                      : ""
                  }`}
                />
                Refresh data
              </button>

            </div>
          </div>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-5 shadow-sm">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-red-100 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-black text-red-800">
                    Dashboard data could not be loaded
                  </p>

                  <p className="mt-1 text-xs leading-6 text-red-600">
                    {error}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  void loadCounts()
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>

            </div>
          </div>
        )}

        {/* =====================================================
            MAIN KPI CARDS
        ====================================================== */}

        <section className="grid gap-5 sm:grid-cols-2">

          <TotalCard
            title="Total Students"
            value={studentCount}
            description="Registered student records"
            icon={Users}
            gradient="from-blue-600 via-indigo-600 to-cyan-500"
            light="from-blue-50 to-cyan-50"
            loading={loading}
          />

          <TotalCard
            title="Total Faculty"
            value={facultyCount}
            description="Registered faculty records"
            icon={GraduationCap}
            gradient="from-emerald-600 via-teal-600 to-cyan-500"
            light="from-emerald-50 to-cyan-50"
            loading={loading}
          />

        </section>

        {/* =====================================================
            OVERVIEW HEADER
        ====================================================== */}

        <section>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                  Institution
                </span>
              </div>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--navy)]">
                College Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current records across the main SCMS modules.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 sm:self-auto">
              <CheckCircle2 className="h-4 w-4" />
              Operational
            </div>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <OverviewCard
              label="Attendance Records"
              value={attendanceCount}
              icon={ClipboardCheck}
              loading={loading}
              gradient="from-emerald-500 to-teal-500"
              background="from-emerald-50 to-teal-50"
            />

            <OverviewCard
              label="Fee Records"
              value={feeCount}
              icon={CreditCard}
              loading={loading}
              gradient="from-orange-500 to-amber-500"
              background="from-orange-50 to-amber-50"
            />

            <OverviewCard
              label="Exams"
              value={examCount}
              icon={CalendarDays}
              loading={loading}
              gradient="from-purple-500 to-violet-500"
              background="from-purple-50 to-violet-50"
            />

            <OverviewCard
              label="Published Notices"
              value={noticeCount}
              icon={Bell}
              loading={loading}
              gradient="from-pink-500 to-rose-500"
              background="from-pink-50 to-rose-50"
            />

          </div>
        </section>

        {/* =====================================================
            SYSTEM STATUS + SUMMARY
        ====================================================== */}

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">

          {/* DATABASE STATUS */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl">

            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl transition duration-500 group-hover:scale-125" />

            <div className="relative">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                    System
                  </p>

                  <h3 className="mt-1 text-xl font-black text-[var(--navy)]">
                    Database Status
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Live overview of connected collections.
                  </p>
                </div>

                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
                  <BarChart3 className="h-5 w-5" />
                </div>

              </div>

              <div className="mt-6 space-y-3">

                <StatusRow
                  label="Students database"
                  loading={loading}
                  count={studentCount}
                  gradient="from-blue-500 to-cyan-500"
                />

                <StatusRow
                  label="Faculty database"
                  loading={loading}
                  count={facultyCount}
                  gradient="from-emerald-500 to-teal-500"
                />

                <StatusRow
                  label="Attendance database"
                  loading={loading}
                  count={attendanceCount}
                  gradient="from-violet-500 to-purple-500"
                />

                <StatusRow
                  label="Notices database"
                  loading={loading}
                  count={noticeCount}
                  gradient="from-pink-500 to-rose-500"
                />

              </div>
            </div>
          </div>

          {/* ADMIN SUMMARY */}

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 text-white shadow-xl">

            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-violet-400/10 blur-3xl" />

            <div className="relative">

              <div className="flex items-center gap-2">

                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
                  <ShieldCheck className="h-5 w-5 text-cyan-300" />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
                    Firestore
                  </p>

                  <h3 className="text-xl font-black text-white">
                    Administration Summary
                  </h3>
                </div>

              </div>

              <p className="mt-4 text-sm leading-6 text-blue-100">
                A quick snapshot of important institutional records.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                <SummaryRow
                  label="Students"
                  value={studentCount}
                  gradient="from-blue-500 to-cyan-400"
                />

                <SummaryRow
                  label="Faculty"
                  value={facultyCount}
                  gradient="from-emerald-500 to-teal-400"
                />

                <SummaryRow
                  label="Attendance"
                  value={attendanceCount}
                  gradient="from-violet-500 to-purple-400"
                />

                <SummaryRow
                  label="Fee records"
                  value={feeCount}
                  gradient="from-orange-500 to-amber-400"
                />

                <SummaryRow
                  label="Exams"
                  value={examCount}
                  gradient="from-pink-500 to-rose-400"
                />

                <SummaryRow
                  label="Published notices"
                  value={noticeCount}
                  gradient="from-indigo-500 to-blue-400"
                />

              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FOOTER STATUS
        ====================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Database className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-black text-slate-800">
                  SCMS Database Connection
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Dashboard collections are connected to Firebase Firestore.
                </p>
              </div>

            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Connected
            </div>

          </div>

        </section>

      </main>
    </PortalShell>
  );
}

/* ============================================================
   TOTAL CARD
============================================================ */

function TotalCard({
  title,
  value,
  description,
  icon: Icon,
  gradient,
  light,
  loading,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  gradient: string;
  light: string;
  loading: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-6 text-white shadow-xl transition duration-500 hover:-translate-y-1.5 hover:shadow-2xl sm:p-7`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl transition duration-700 group-hover:scale-150" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

      <div className="relative">

        <div className="flex items-start justify-between">

          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 shadow-lg backdrop-blur-md transition duration-500 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="h-7 w-7" />
          </div>

          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
            Total
          </span>

        </div>

        <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-white/70">
          {title}
        </p>

        {loading ? (
          <div className="mt-2 h-14 w-28 animate-pulse rounded-xl bg-white/20" />
        ) : (
          <p className="mt-1 text-5xl font-black tracking-tight">
            {value.toLocaleString()}
          </p>
        )}

        <p className="mt-3 text-sm leading-6 text-white/75">
          {description}
        </p>

        <div className="mt-6 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/5 rounded-full bg-white/60 transition-all duration-700 group-hover:w-full" />
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider text-white/60">
            Live
          </span>
        </div>

      </div>
    </div>
  );
}

/* ============================================================
   OVERVIEW CARD
============================================================ */

function OverviewCard({
  label,
  value,
  icon: Icon,
  loading,
  gradient,
  background,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
  gradient: string;
  background: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl">

      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${gradient} opacity-15 blur-2xl transition duration-500 group-hover:scale-150`}
      />

      <div className="relative">

        <div className="flex items-start justify-between">

          <div
            className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg transition duration-300 group-hover:scale-110`}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div
            className={`rounded-xl bg-gradient-to-br ${background} px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500`}
          >
            Live
          </div>

        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-wider text-slate-400">
          {label}
        </p>

        {loading ? (
          <div className="mt-2 h-9 w-24 animate-pulse rounded-lg bg-slate-100" />
        ) : (
          <p className="mt-1 text-3xl font-black tracking-tight text-[var(--navy)]">
            {value.toLocaleString()}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">

          <p className="text-xs font-medium text-slate-400">
            Total records
          </p>

          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Ready
          </div>

        </div>

      </div>
    </div>
  );
}

/* ============================================================
   STATUS ROW
============================================================ */

function StatusRow({
  label,
  loading,
  count,
  gradient,
}: {
  label: string;
  loading: boolean;
  count: number;
  gradient: string;
}) {
  return (
    <div className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition duration-300 hover:bg-white hover:shadow-md">

      <div className="flex min-w-0 items-center gap-3">

        <span
          className={`h-3 w-3 shrink-0 rounded-full bg-gradient-to-r ${gradient} ${
            loading
              ? "animate-pulse"
              : ""
          }`}
        />

        <div className="min-w-0">

          <p className="truncate text-sm font-bold text-slate-700">
            {label}
          </p>

          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400">
            Firestore collection
          </p>

        </div>

      </div>

      <div className="ml-3 flex shrink-0 items-center gap-2">

        {!loading && (
          <span className="text-xs font-black text-slate-500">
            {count.toLocaleString()}
          </span>
        )}

        <span
          className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${
            loading
              ? "bg-amber-50 text-amber-600"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {loading
            ? "Loading"
            : "Ready"}
        </span>

      </div>
    </div>
  );
}

/* ============================================================
   SUMMARY ROW
============================================================ */

function SummaryRow({
  label,
  value,
  gradient,
}: {
  label: string;
  value: number;
  gradient: string;
}) {
  return (
    <div className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 transition duration-300 hover:bg-white/10">

      <div className="flex items-center gap-3">

        <span
          className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${gradient}`}
        />

        <span className="text-sm font-semibold text-blue-100">
          {label}
        </span>

      </div>

      <span className="text-lg font-black text-white">
        {value.toLocaleString()}
      </span>

    </div>
  );
}

