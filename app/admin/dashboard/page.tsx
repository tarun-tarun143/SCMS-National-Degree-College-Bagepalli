
"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getCountFromServer,
} from "firebase/firestore";

import {
  Users,
  GraduationCap,
  ClipboardCheck,
  CreditCard,
  CalendarDays,
  Bell,
  BarChart3,
  RefreshCw,
  Database,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";

export default function AdminDashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [feeCount, setFeeCount] = useState(0);
  const [examCount, setExamCount] = useState(0);
  const [noticeCount, setNoticeCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

async function loadCounts() {
  try {
    setLoading(true);
    setError("");

    // Create a local constant so TypeScript knows
    // this is definitely a Firestore instance.
    const db = firestoreDb;

    if (db === null) {
      throw new Error(
        "Firestore is not initialized. Check your Firebase configuration."
      );
    }

    const studentsRef = collection(db, "students");
    const facultyRef = collection(db, "faculty");
    const attendanceRef = collection(db, "attendance");
    const feesRef = collection(db, "fees");
    const examsRef = collection(db, "exams");
    const noticesRef = collection(db, "notices");

    const [
      studentsSnapshot,
      facultySnapshot,
      attendanceSnapshot,
      feesSnapshot,
      examsSnapshot,
      noticesSnapshot,
    ] = await Promise.all([
      getCountFromServer(studentsRef),
      getCountFromServer(facultyRef),
      getCountFromServer(attendanceRef),
      getCountFromServer(feesRef),
      getCountFromServer(examsRef),
      getCountFromServer(noticesRef),
    ]);

    setStudentCount(studentsSnapshot.data().count);
    setFacultyCount(facultySnapshot.data().count);
    setAttendanceCount(attendanceSnapshot.data().count);
    setFeeCount(feesSnapshot.data().count);
    setExamCount(examsSnapshot.data().count);
    setNoticeCount(noticesSnapshot.data().count);
  } catch (err) {
    console.error("Admin dashboard count error:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Unable to load dashboard counts."
    );
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    void loadCounts();
  }, []);

  return (
    <PortalShell
      role="admin"
      title="Admin Dashboard"
    >
      <main className="space-y-8 pb-10">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <PageHeading
          eyebrow="Central administration"
          title="Institutional control center"
          description="Manage students, faculty and college operations from one centralized dashboard."
        />

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-red-800">
                  Dashboard data could not be loaded
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void loadCounts()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* =====================================================
            TOTAL STUDENTS + FACULTY
        ====================================================== */}

        <section className="grid gap-6 md:grid-cols-2">

          {/* Students */}

          <TotalCard
            title="Total Students"
            value={studentCount}
            description="Registered student records"
            icon={Users}
            gradient="from-blue-600 via-indigo-600 to-cyan-500"
            loading={loading}
          />

          {/* Faculty */}

          <TotalCard
            title="Total Faculty"
            value={facultyCount}
            description="Registered faculty records"
            icon={GraduationCap}
            gradient="from-emerald-600 via-teal-600 to-cyan-500"
            loading={loading}
          />

        </section>

        {/* =====================================================
            OTHER COUNTS
        ====================================================== */}

        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-600 to-cyan-400" />

            <div>
              <h2 className="text-xl font-black text-[var(--navy)]">
                College Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current administrative records
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <OverviewCard
              label="Attendance Records"
              value={attendanceCount}
              icon={ClipboardCheck}
              loading={loading}
              gradient="from-emerald-500 to-teal-500"
            />

            <OverviewCard
              label="Fee Records"
              value={feeCount}
              icon={CreditCard}
              loading={loading}
              gradient="from-orange-500 to-amber-500"
            />

            <OverviewCard
              label="Exams"
              value={examCount}
              icon={CalendarDays}
              loading={loading}
              gradient="from-purple-500 to-violet-500"
            />

            <OverviewCard
              label="Published Notices"
              value={noticeCount}
              icon={Bell}
              loading={loading}
              gradient="from-pink-500 to-rose-500"
            />

          </div>
        </section>

        {/* =====================================================
            SYSTEM STATUS
        ====================================================== */}

        <section className="grid gap-6 lg:grid-cols-2">

          {/* System health */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl">

            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl transition duration-500 group-hover:scale-125" />

            <div className="relative">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                    System
                  </p>

                  <h3 className="mt-1 text-xl font-black text-[var(--navy)]">
                    Database Status
                  </h3>
                </div>

                <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-3">

                <StatusRow
                  label="Students database"
                  loading={loading}
                  count={studentCount}
                />

                <StatusRow
                  label="Faculty database"
                  loading={loading}
                  count={facultyCount}
                />

                <StatusRow
                  label="Attendance database"
                  loading={loading}
                  count={attendanceCount}
                />

                <StatusRow
                  label="Notices database"
                  loading={loading}
                  count={noticeCount}
                />

              </div>
            </div>
          </div>

          {/* Quick information */}

          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 text-white shadow-xl">

            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative">

              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-300" />

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
                  Firestore
                </p>
              </div>

              <h3 className="mt-3 text-2xl font-black">
                Administration Summary
              </h3>

              <div className="mt-6 space-y-3">

                <SummaryRow
                  label="Students"
                  value={studentCount}
                />

                <SummaryRow
                  label="Faculty"
                  value={facultyCount}
                />

                <SummaryRow
                  label="Attendance"
                  value={attendanceCount}
                />

                <SummaryRow
                  label="Fee records"
                  value={feeCount}
                />

                <SummaryRow
                  label="Exams"
                  value={examCount}
                />

                <SummaryRow
                  label="Notices"
                  value={noticeCount}
                />

              </div>
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
  loading,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  gradient: string;
  loading: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-6 text-white shadow-xl transition duration-500 hover:-translate-y-2 hover:shadow-2xl`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl transition duration-700 group-hover:scale-150" />

      <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-white/5 blur-3xl" />

      <div className="relative">

        <div className="flex items-start justify-between">

          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 shadow-lg backdrop-blur-md transition duration-500 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="h-7 w-7" />
          </div>

          <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
            Total
          </div>

        </div>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-white/70">
          {title}
        </p>

        {loading ? (
          <div className="mt-2 h-14 w-28 animate-pulse rounded-xl bg-white/20" />
        ) : (
          <p className="mt-1 text-5xl font-black tracking-tight">
            {value.toLocaleString()}
          </p>
        )}

        <p className="mt-3 text-sm text-white/75">
          {description}
        </p>

        <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/5 rounded-full bg-white/50 transition-all duration-700 group-hover:w-full" />
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
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition duration-500 group-hover:scale-150`}
      />

      <div className="relative">

        <div
          className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg transition duration-300 group-hover:scale-110`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        {loading ? (
          <div className="mt-2 h-8 w-20 animate-pulse rounded-lg bg-slate-100" />
        ) : (
          <p className="mt-1 text-3xl font-black text-[var(--navy)]">
            {value.toLocaleString()}
          </p>
        )}

        <p className="mt-1 text-xs text-slate-400">
          Total records
        </p>
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
}: {
  label: string;
  loading: boolean;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">

      <div className="flex items-center gap-3">

        <span
          className={`h-2.5 w-2.5 rounded-full ${
            loading
              ? "bg-amber-400 animate-pulse"
              : "bg-emerald-500"
          }`}
        />

        <span className="text-sm font-bold text-slate-700">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2">

        {!loading && (
          <span className="text-xs font-bold text-slate-400">
            {count.toLocaleString()}
          </span>
        )}

        <span
          className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${
            loading
              ? "bg-amber-50 text-amber-600"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {loading ? "Loading" : "Ready"}
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
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10">
      <span className="text-sm font-semibold text-blue-100">
        {label}
      </span>

      <span className="text-lg font-black text-white">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

