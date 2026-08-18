"use client";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import StatCard from "@/components/ui/StatCard";

import {
  BarChart3,
  Building2,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  Users,
  Bell,
} from "lucide-react";

import { firestoreDb } from "@/lib/firebase/client";
import { useLiveCollection } from "@/hooks/useLiveCollection";

export default function Admin() {
  const students = useLiveCollection(
    firestoreDb,
    "students",
    { limit: 500 }
  );

  const faculty = useLiveCollection(
    firestoreDb,
    "faculty",
    { limit: 500 }
  );

  const courses = useLiveCollection(
    firestoreDb,
    "courses",
    { limit: 200 }
  );

  const departments = useLiveCollection(
    firestoreDb,
    "departments",
    { limit: 200 }
  );

  const notices = useLiveCollection(
    firestoreDb,
    "notices",
    {
      filters: [
        {
          field: "status",
          op: "==",
          value: "published",
        },
      ],
      limit: 200,
    }
  );

  const exams = useLiveCollection(
    firestoreDb,
    "exams",
    { limit: 200 }
  );

  const attendance = useLiveCollection(
    firestoreDb,
    "attendance",
    { limit: 500 }
  );

  const fees = useLiveCollection(
    firestoreDb,
    "fees",
    { limit: 500 }
  );

  return (
    <PortalShell
      role="admin"
      title="Admin Dashboard"
    >
      <PageHeading
        eyebrow="Central administration"
        title="Institutional control center"
        description="Live institutional counts and operational records from Cloud Firestore."
      />

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Students"
          value={String(students.data.length)}
          icon={Users}
          trend="Live records"
        />

        <StatCard
          label="Faculty"
          value={String(faculty.data.length)}
          icon={GraduationCap}
          trend="Live records"
        />

        <StatCard
          label="Courses"
          value={String(courses.data.length)}
          icon={Building2}
          trend="Published/configured"
        />

        <StatCard
          label="Departments"
          value={String(departments.data.length)}
          icon={Building2}
          trend="Configured"
        />

        <StatCard
          label="Attendance Records"
          value={String(attendance.data.length)}
          icon={ClipboardCheck}
        />

        <StatCard
          label="Fee Records"
          value={String(fees.data.length)}
          icon={CreditCard}
        />

        <StatCard
          label="Upcoming/Configured Exams"
          value={String(exams.data.length)}
          icon={CalendarDays}
        />

        <StatCard
          label="Published Notices"
          value={String(notices.data.length)}
          icon={Bell}
        />

      </div>

      {/* System health + actions */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        <div className="card p-6">

          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-[var(--navy)]">
              Live system health
            </h3>

            <BarChart3 className="h-5 w-5 text-[var(--blue)]" />
          </div>

          <div className="mt-6 grid gap-4">

            <Health
              label="Students listener"
              loading={students.loading}
              error={students.error}
            />

            <Health
              label="Faculty listener"
              loading={faculty.loading}
              error={faculty.error}
            />

            <Health
              label="Notices listener"
              loading={notices.loading}
              error={notices.error}
            />

            <Health
              label="Attendance listener"
              loading={attendance.loading}
              error={attendance.error}
            />

          </div>
        </div>

        <div className="card p-6">

          <h3 className="font-extrabold text-[var(--navy)]">
            Next actions
          </h3>

          <div className="mt-5 grid gap-3 text-sm text-slate-600">

            <div className="rounded-xl bg-slate-50 p-4">
              Review new Google accounts under{" "}
              <b>Users</b> and assign the correct role.
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              Create courses and departments before
              linking student academic records.
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              Publish notices and events to update the
              public website in real time.
            </div>

            <div className="rounded-xl bg-blue-50 p-4 text-blue-800">
              Open <b>Queries</b> from the admin sidebar
              to monitor enquiries in real time.
            </div>

          </div>
        </div>

      </div>
    </PortalShell>
  );
}

function Health({
  label,
  loading,
  error,
}: {
  label: string;
  loading: boolean;
  error: string | null;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">

      <span className="font-semibold">
        {label}
      </span>

      <span
        className={`text-xs font-extrabold ${
          error
            ? "text-red-600"
            : loading
              ? "text-amber-600"
              : "text-emerald-600"
        }`}
      >
        {error
          ? "ERROR"
          : loading
            ? "CONNECTING"
            : "LIVE"}
      </span>

    </div>
  );
}