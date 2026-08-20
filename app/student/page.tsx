"use client";

import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  Loader2,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import StatCard from "@/components/ui/StatCard";
import Progress from "@/components/ui/Progress";
import Badge from "@/components/ui/Badge";

import { firestoreDb } from "@/lib/firebase/client";
import { useLiveCollection } from "@/hooks/useLiveCollection";
import { useScmsSession } from "@/lib/auth/session";

type Student = {
  id: string;
  userId?: string;
  name?: string;
  studentId?: string;
  courseId?: string;
  semesterId?: string;
  sectionId?: string;
  cgpa?: number;
};

type Notice = {
  id: string;
  title?: string;
  category?: string;
  publishedAt?: string;
  status?: string;
};

type Subject = {
  id: string;
  name?: string;
  attendance?: number;
  courseId?: string;
};

type Fee = {
  id: string;
  userId?: string;
  balance?: number;
  amountDue?: number;
};

export default function Student() {
  const { user, loading: sessionLoading, error: sessionError } =
    useScmsSession("student");

  /*
   * IMPORTANT:
   * Do not start protected collection listeners until the
   * authenticated SCMS user is available.
   */

  const {
    data: student,
    loading: studentLoading,
    error: studentError,
  } = useLiveCollection<Student>(
    user?.uid ? firestoreDb : null,
    "students",
    {
      filters: user?.uid
        ? [
            {
              field: "userId",
              op: "==",
              value: user.uid,
            },
          ]
        : undefined,
      limit: 1,
    }
  );

  const profile = student[0];

  /*
   * Notices are public/published data, so this listener can run
   * independently of the authenticated user.
   */
  const notices = useLiveCollection<Notice>(
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
      limit: 4,
    }
  );

  /*
   * Subjects should only be queried after the Student record
   * tells us which course they belong to.
   */
  const {
    data: subjectsData,
    loading: subjectsLoading,
    error: subjectsError,
  } = useLiveCollection<Subject>(
    profile?.courseId ? firestoreDb : null,
    "subjects",
    {
      filters: profile?.courseId
        ? [
            {
              field: "courseId",
              op: "==",
              value: profile.courseId,
            },
          ]
        : undefined,
      limit: 20,
    }
  );

  /*
   * Fees must always be filtered by the authenticated user.
   */
  const {
    data: feesData,
    loading: feesLoading,
    error: feesError,
  } = useLiveCollection<Fee>(
    user?.uid ? firestoreDb : null,
    "fees",
    {
      filters: user?.uid
        ? [
            {
              field: "userId",
              op: "==",
              value: user.uid,
            },
          ]
        : undefined,
      limit: 20,
    }
  );

  const feeBalance = feesData.reduce(
    (sum, fee) =>
      sum +
      Number(
        fee.balance ??
          fee.amountDue ??
          0
      ),
    0
  );

  /*
   * Session loading state.
   */
  if (sessionLoading) {
    return (
      <PortalShell
        role="student"
        title="Student Dashboard"
      >
        <div className="grid min-h-[60vh] place-items-center">
          <div className="flex flex-col items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-7 w-7 animate-spin text-[var(--blue)]" />
            Verifying your student account...
          </div>
        </div>
      </PortalShell>
    );
  }

  /*
   * Session error.
   */
  if (sessionError || !user) {
    return (
      <PortalShell
        role="student"
        title="Student Dashboard"
      >
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-red-600 shadow-sm">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-extrabold text-red-900">
                Student account could not be verified
              </h2>

              <p className="mt-2 text-sm leading-6 text-red-700">
                {sessionError ||
                  "Your student account could not be loaded."}
              </p>
            </div>
          </div>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell
      role="student"
      title="Student Dashboard"
    >
      <PageHeading
        eyebrow={`Welcome, ${user.name || "Student"}`}
        title="Your academic overview"
        description="Live academic information from your college account."
      />

      {/* ==================================================
          SUMMARY
      ================================================== */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Attendance"
          value="—"
          icon={ClipboardCheck}
          trend="Updated from attendance records"
        />

        <StatCard
          label="Current CGPA"
          value={
            profile?.cgpa != null
              ? profile.cgpa.toFixed(2)
              : "—"
          }
          icon={GraduationCap}
          trend="Official academic record"
        />

        <StatCard
          label="Subjects"
          value={String(subjectsData.length)}
          icon={BookOpen}
          trend="Live subject allocation"
        />

        <StatCard
          label="Fee Balance"
          value={
            feesData.length
              ? `₹${feeBalance.toLocaleString("en-IN")}`
              : "—"
          }
          icon={CreditCard}
          trend="Live fee records"
        />

      </div>

      {/* ==================================================
          SUBJECTS + ACCOUNT
      ================================================== */}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">

        <div className="card p-6">

          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-[var(--navy)]">
                Subjects
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Live records assigned to your course.
              </p>
            </div>

            <Badge tone="blue">
              {subjectsData.length} subjects
            </Badge>
          </div>

          <div className="mt-6 grid gap-5">

            {subjectsLoading && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading subjects...
              </div>
            )}

            {subjectsError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Unable to load your subjects.
              </div>
            )}

            {!subjectsLoading &&
              !subjectsError &&
              !subjectsData.length && (
                <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                  No subjects have been assigned
                  to your account yet.
                </div>
              )}

            {subjectsData.map((subject) => (
              <Progress
                key={subject.id}
                value={Number(subject.attendance ?? 0)}
                label={subject.name || "Subject"}
              />
            ))}

          </div>
        </div>

        <div className="card p-6">

          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-[var(--navy)]">
              Account
            </h3>

            <CalendarDays className="h-5 w-5 text-[var(--blue)]" />
          </div>

          <div className="mt-5 grid gap-3">

            <AccountRow
              label="Student ID"
              value={
                profile?.studentId ||
                "Not assigned"
              }
            />

            <AccountRow
              label="Course"
              value={
                profile?.courseId ||
                "Not assigned"
              }
            />

            <AccountRow
              label="Semester"
              value={
                profile?.semesterId ||
                "Not assigned"
              }
            />

            <AccountRow
              label="Section"
              value={
                profile?.sectionId ||
                "Not assigned"
              }
            />

          </div>
        </div>

      </div>

      {/* ==================================================
          NOTICES + STATUS
      ================================================== */}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        <div className="card p-6">

          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-[var(--navy)]">
              Recent notices
            </h3>

            <Bell className="h-5 w-5 text-[var(--blue)]" />
          </div>

          <div className="mt-4 divide-y divide-slate-100">

            {notices.loading && (
              <div className="flex items-center gap-2 py-4 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading notices...
              </div>
            )}

            {notices.error && (
              <div className="py-4 text-sm text-red-600">
                Unable to load notices.
              </div>
            )}

            {!notices.loading &&
              !notices.error &&
              !notices.data.length && (
                <div className="py-4 text-sm text-slate-500">
                  No published notices.
                </div>
              )}

            {notices.data.map((notice) => (
              <div
                key={notice.id}
                className="py-4"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  {notice.category || "General"}
                </div>

                <div className="mt-1 text-sm font-bold text-slate-800">
                  {notice.title || "Notice"}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  {notice.publishedAt || "Recently"}
                </div>
              </div>
            ))}

          </div>
        </div>

        <div className="card p-6">

          <h3 className="font-extrabold text-[var(--navy)]">
            Live account status
          </h3>

          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
            <div className="font-bold">
              Student account verified
            </div>

            <div className="mt-1">
              Your Firebase Authentication identity
              and Firestore student role are active.
            </div>
          </div>

          {(studentLoading ||
            subjectsLoading ||
            feesLoading) && (
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Syncing live academic information...
            </div>
          )}

          {(studentError ||
            subjectsError ||
            feesError) && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800">
              Some academic information could not be
              loaded. Your login session is still active.
            </div>
          )}

        </div>

      </div>
    </PortalShell>
  );
}

function AccountRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>

      <span className="text-right text-sm font-extrabold text-[var(--navy)]">
        {value}
      </span>
    </div>
  );
}