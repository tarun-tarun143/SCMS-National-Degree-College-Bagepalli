"use client";

import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  ClipboardCheck,
  CreditCard,
  CalendarDays,
  Bell,
  BarChart3,
  RefreshCw,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import StatCard from "@/components/ui/StatCard";
import { firestoreDb } from "@/lib/firebase/client";

import {
  collection,
  getCountFromServer,
} from "firebase/firestore";

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

      const [
        studentsSnapshot,
        facultySnapshot,
        attendanceSnapshot,
        feesSnapshot,
        examsSnapshot,
        noticesSnapshot,
      ] = await Promise.all([
        getCountFromServer(
          collection(firestoreDb, "students")
        ),

        getCountFromServer(
          collection(firestoreDb, "faculty")
        ),

        getCountFromServer(
          collection(firestoreDb, "attendance")
        ),

        getCountFromServer(
          collection(firestoreDb, "fees")
        ),

        getCountFromServer(
          collection(firestoreDb, "exams")
        ),

        getCountFromServer(
          collection(firestoreDb, "notices")
        ),
      ]);

      setStudentCount(studentsSnapshot.data().count);
      setFacultyCount(facultySnapshot.data().count);
      setAttendanceCount(attendanceSnapshot.data().count);
      setFeeCount(feesSnapshot.data().count);
      setExamCount(examsSnapshot.data().count);
      setNoticeCount(noticesSnapshot.data().count);
    } catch (err) {
      console.error("Dashboard count error:", err);

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
    loadCounts();
  }, []);

  return (
    <PortalShell
      role="admin"
      title="Admin Dashboard"
    >
      <PageHeading
        eyebrow="Central administration"
        title="Institutional control center"
        description="Manage your college and monitor important institutional records."
      />

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          <div className="flex items-center justify-between gap-4">
            <span>{error}</span>

            <button
              onClick={loadCounts}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <AnimatedStatCard
          label="Total Students"
          value={studentCount}
          icon={Users}
          description="Registered students"
          gradient="from-blue-600 to-cyan-500"
          loading={loading}
        />

        <AnimatedStatCard
          label="Total Faculty"
          value={facultyCount}
          icon={GraduationCap}
          description="Registered faculty"
          gradient="from-violet-600 to-purple-500"
          loading={loading}
        />

        <AnimatedStatCard
          label="Attendance"
          value={attendanceCount}
          icon={ClipboardCheck}
          description="Attendance records"
          gradient="from-emerald-600 to-teal-500"
          loading={loading}
        />

        <AnimatedStatCard
          label="Fee Records"
          value={feeCount}
          icon={CreditCard}
          description="Recorded transactions"
          gradient="from-orange-500 to-amber-500"
          loading={loading}
        />

        <AnimatedStatCard
          label="Exams"
          value={examCount}
          icon={CalendarDays}
          description="Configured exams"
          gradient="from-pink-600 to-rose-500"
          loading={loading}
        />

        <AnimatedStatCard
          label="Notices"
          value={noticeCount}
          icon={Bell}
          description="Published notices"
          gradient="from-indigo-600 to-blue-500"
          loading={loading}
        />

      </div>

      {/* Dashboard information */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-2xl">
          
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl transition duration-500 group-hover:bg-blue-500/20" />

          <div className="relative">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                  Institution
                </p>

                <h2 className="mt-2 text-2xl font-black text-[var(--navy)]">
                  College Overview
                </h2>
              </div>

              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">

              <MiniStat
                label="Students"
                value={studentCount}
              />

              <MiniStat
                label="Faculty"
                value={facultyCount}
              />

              <MiniStat
                label="Attendance"
                value={attendanceCount}
              />

              <MiniStat
                label="Exams"
                value={examCount}
              />

            </div>

          </div>
        </div>

        {/* Admin actions */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-2xl">

          <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative">

            <p className="text-xs font-black uppercase tracking-[0.16em] text-purple-600">
              Administration
            </p>

            <h2 className="mt-2 text-2xl font-black text-[var(--navy)]">
              Quick actions
            </h2>

            <div className="mt-6 space-y-3">

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 transition hover:-translate-y-1 hover:shadow-md">
                <p className="font-bold text-blue-900">
                  Manage Students
                </p>

                <p className="mt-1 text-sm text-blue-700">
                  Add, edit and manage student records.
                </p>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 transition hover:-translate-y-1 hover:shadow-md">
                <p className="font-bold text-purple-900">
                  Manage Faculty
                </p>

                <p className="mt-1 text-sm text-purple-700">
                  Manage faculty members and academic information.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 transition hover:-translate-y-1 hover:shadow-md">
                <p className="font-bold text-emerald-900">
                  Monitor Queries
                </p>

                <p className="mt-1 text-sm text-emerald-700">
                  Review enquiries submitted through the website.
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </PortalShell>
  );
}

/* =========================================================
   ANIMATED STAT CARD
========================================================= */

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
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

      {/* Animated background */}
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

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600">
            Total
          </span>

        </div>

        <p className="mt-5 text-sm font-bold text-slate-500">
          {label}
        </p>

        <div className="mt-1 flex items-center gap-2">

          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-200" />
          ) : (
            <span className="text-4xl font-black tracking-tight text-[var(--navy)]">
              {value.toLocaleString()}
            </span>
          )}

        </div>

        <p className="mt-2 text-xs font-medium text-slate-400">
          {description}
        </p>

        {/* Bottom animated line */}
        <div className="mt-5 h-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full w-1/2 rounded-full bg-gradient-to-r ${gradient} transition-all duration-700 group-hover:w-full`}
          />
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md">

      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-[var(--navy)]">
        {value.toLocaleString()}
      </p>

    </div>
  );
}