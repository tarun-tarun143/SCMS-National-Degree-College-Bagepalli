"use client";

import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Loader2,
  Users,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import Progress from "@/components/ui/Progress";

import { firestoreDb } from "@/lib/firebase/client";
import { useLiveCollection } from "@/hooks/useLiveCollection";
import { useScmsSession } from "@/lib/auth/session";

type FacultyRecord = {
  id: string;
  userId?: string;
  name?: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  qualification?: string;
  specialization?: string;
};

type StudentRecord = {
  id: string;
  userId?: string;
  name?: string;
  studentId?: string;
  courseId?: string;
  semesterId?: string;
  sectionId?: string;
};

type Notice = {
  id: string;
  title?: string;
  category?: string;
  status?: string;
  publishedAt?: string;
};

type Assignment = {
  id: string;
  title?: string;
  subjectId?: string;
  facultyId?: string;
  dueDate?: string;
  status?: string;
};

type ClassRecord = {
  id: string;
  subjectName?: string;
  room?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  facultyId?: string;
};

type AttendanceRecord = {
  id: string;
  facultyId?: string;
  subjectId?: string;
  markedAt?: string;
};

export default function FacultyDashboard() {
  const {
    user,
    loading: sessionLoading,
    error: sessionError,
  } = useScmsSession("faculty");

  const {
    data: facultyRecords,
    loading: facultyLoading,
    error: facultyError,
  } = useLiveCollection<FacultyRecord>(
    user?.uid ? firestoreDb : null,
    "faculty",
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

  const facultyProfile = facultyRecords[0];

  const {
    data: students,
    loading: studentsLoading,
    error: studentsError,
  } = useLiveCollection<StudentRecord>(
    user?.uid ? firestoreDb : null,
    "students",
    {
      limit: 100,
    }
  );

  const {
    data: assignments,
    loading: assignmentsLoading,
    error: assignmentsError,
  } = useLiveCollection<Assignment>(
    user?.uid ? firestoreDb : null,
    "assignments",
    {
      filters: user?.uid
        ? [
            {
              field: "facultyId",
              op: "==",
              value: user.uid,
            },
          ]
        : undefined,
      limit: 10,
    }
  );

  const {
    data: classes,
    loading: classesLoading,
    error: classesError,
  } = useLiveCollection<ClassRecord>(
    user?.uid ? firestoreDb : null,
    "timetable",
    {
      filters: user?.uid
        ? [
            {
              field: "facultyId",
              op: "==",
              value: user.uid,
            },
          ]
        : undefined,
      limit: 10,
    }
  );

  const {
    data: attendance,
    loading: attendanceLoading,
    error: attendanceError,
  } = useLiveCollection<AttendanceRecord>(
    user?.uid ? firestoreDb : null,
    "attendance",
    {
      filters: user?.uid
        ? [
            {
              field: "facultyId",
              op: "==",
              value: user.uid,
            },
          ]
        : undefined,
      limit: 100,
    }
  );

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
      limit: 5,
    }
  );

  if (sessionLoading) {
    return (
      <PortalShell
        role="faculty"
        title="Faculty Dashboard"
      >
        <div className="grid min-h-[60vh] place-items-center">
          <div className="flex flex-col items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-7 w-7 animate-spin text-[var(--blue)]" />
            Verifying your faculty account...
          </div>
        </div>
      </PortalShell>
    );
  }

  if (sessionError || !user) {
    return (
      <PortalShell
        role="faculty"
        title="Faculty Dashboard"
      >
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-extrabold text-red-900">
            Faculty account could not be verified
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-700">
            {sessionError ||
              "Your faculty account could not be loaded."}
          </p>
        </div>
      </PortalShell>
    );
  }

  const isLoading =
    facultyLoading ||
    studentsLoading ||
    assignmentsLoading ||
    classesLoading ||
    attendanceLoading;

  const hasError =
    facultyError ||
    studentsError ||
    assignmentsError ||
    classesError ||
    attendanceError;

  return (
    <PortalShell
      role="faculty"
      title="Faculty Dashboard"
    >
      <PageHeading
        eyebrow={`Welcome, ${user.name || "Faculty"}`}
        title="Faculty Dashboard"
        description="Manage your academic activities, classes and student support from one place."
      />

      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="My Students"
          value={String(students.length)}
          icon={Users}
          trend="Current student records"
        />

        <StatCard
          label="Classes"
          value={String(classes.length)}
          icon={CalendarDays}
          trend="Timetable records"
        />

        <StatCard
          label="Assignments"
          value={String(assignments.length)}
          icon={FileText}
          trend="Your assignments"
        />

        <StatCard
          label="Attendance"
          value={String(attendance.length)}
          icon={ClipboardCheck}
          trend="Attendance records"
        />

      </div>

      {/* ==================================================
          PROFILE + QUICK ACTIONS
      ================================================== */}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.2fr]">

        <div className="card p-6">

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-[var(--navy)]">
                Faculty Profile
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Your current academic information.
              </p>
            </div>

            <GraduationCap className="h-5 w-5 text-[var(--blue)]" />
          </div>

          <div className="mt-5 grid gap-3">

            <AccountRow
              label="Name"
              value={
                facultyProfile?.name ||
                user.name ||
                "Not available"
              }
            />

            <AccountRow
              label="Employee ID"
              value={
                facultyProfile?.employeeId ||
                "Not assigned"
              }
            />

            <AccountRow
              label="Department"
              value={
                facultyProfile?.department ||
                "Not assigned"
              }
            />

            <AccountRow
              label="Designation"
              value={
                facultyProfile?.designation ||
                "Not assigned"
              }
            />

          </div>
        </div>

        <div className="card p-6">

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-[var(--navy)]">
                Quick Actions
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Frequently used faculty tools.
              </p>
            </div>

            <Badge tone="blue">
              Faculty Portal
            </Badge>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">

            <QuickAction
              href="/faculty/attendance"
              icon={ClipboardCheck}
              title="Mark Attendance"
              text="Record student attendance."
            />

            <QuickAction
              href="/faculty/assignments"
              icon={FileText}
              title="Assignments"
              text="Create and manage assignments."
            />

            <QuickAction
              href="/faculty/classes"
              icon={CalendarDays}
              title="My Classes"
              text="View your class schedule."
            />

            <QuickAction
              href="/faculty/students"
              icon={Users}
              title="Students"
              text="View your student records."
            />
          </div>
        </div>
      </div>

      {/* ==================================================
          CLASSES + ASSIGNMENTS
      ================================================== */}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">

        <div className="card p-6">

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-[var(--navy)]">
                My Classes
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Current timetable information.
              </p>
            </div>

            <CalendarDays className="h-5 w-5 text-[var(--blue)]" />
          </div>

          <div className="mt-5 grid gap-3">

            {classesLoading && (
              <LoadingRow text="Loading classes..." />
            )}

            {classesError && (
              <ErrorRow text="Unable to load class information." />
            )}

            {!classesLoading &&
              !classesError &&
              !classes.length && (
                <EmptyRow text="No class timetable records found." />
              )}

            {classes.slice(0, 5).map((classItem) => (
              <div
                key={classItem.id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">

                  <div>
                    <div className="font-bold text-slate-800">
                      {classItem.subjectName ||
                        "Class"}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {classItem.room ||
                        "Room not assigned"}
                    </div>
                  </div>

                  <Badge tone="blue">
                    {classItem.startTime ||
                      "Time"}
                  </Badge>

                </div>

                {(classItem.date ||
                  classItem.endTime) && (
                  <div className="mt-3 text-xs text-slate-500">
                    {classItem.date || "Date not set"}
                    {classItem.endTime
                      ? ` • ${classItem.endTime}`
                      : ""}
                  </div>
                )}

              </div>
            ))}

          </div>
        </div>

        <div className="card p-6">

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-[var(--navy)]">
                Recent Assignments
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Assignments created by you.
              </p>
            </div>

            <FileText className="h-5 w-5 text-[var(--blue)]" />
          </div>

          <div className="mt-5 grid gap-3">

            {assignmentsLoading && (
              <LoadingRow text="Loading assignments..." />
            )}

            {assignmentsError && (
              <ErrorRow text="Unable to load assignments." />
            )}

            {!assignmentsLoading &&
              !assignmentsError &&
              !assignments.length && (
                <EmptyRow text="No assignments found." />
              )}

            {assignments.slice(0, 5).map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="font-bold text-slate-800">
                  {assignment.title ||
                    "Untitled Assignment"}
                </div>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    {assignment.dueDate
                      ? `Due ${assignment.dueDate}`
                      : "No due date"}
                  </span>

                  <Badge
                    tone={
                      assignment.status === "active"
                        ? "green"
                        : "blue"
                    }
                  >
                    {assignment.status ||
                      "Active"}
                  </Badge>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>

      {/* ==================================================
          NOTICES + ATTENDANCE
      ================================================== */}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        <div className="card p-6">

          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-[var(--navy)]">
              Recent Notices
            </h3>

            <Bell className="h-5 w-5 text-[var(--blue)]" />
          </div>

          <div className="mt-4 divide-y divide-slate-100">

            {notices.loading && (
              <LoadingRow text="Loading notices..." />
            )}

            {notices.error && (
              <ErrorRow text="Unable to load notices." />
            )}

            {!notices.loading &&
              !notices.error &&
              !notices.data.length && (
                <EmptyRow text="No published notices." />
              )}

            {notices.data.map((notice) => (
              <div
                key={notice.id}
                className="py-4"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  {notice.category ||
                    "General"}
                </div>

                <div className="mt-1 text-sm font-bold text-slate-800">
                  {notice.title ||
                    "Notice"}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  {notice.publishedAt ||
                    "Recently"}
                </div>
              </div>
            ))}

          </div>
        </div>

        <div className="card p-6">

          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-[var(--navy)]">
              Attendance Overview
            </h3>

            <ClipboardCheck className="h-5 w-5 text-[var(--blue)]" />
          </div>

          <div className="mt-5">

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-center gap-3">

                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div>
                  <div className="font-extrabold text-emerald-900">
                    Attendance system active
                  </div>

                  <div className="mt-1 text-xs text-emerald-700">
                    {attendance.length} attendance records
                    available for your account.
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-5">
              <Progress
                value={
                  attendance.length
                    ? Math.min(
                        100,
                        attendance.length * 2
                      )
                    : 0
                }
                label="Recorded attendance activity"
              />
            </div>

          </div>
        </div>

      </div>

      {/* ==================================================
          ACCOUNT STATUS
      ================================================== */}

      <div className="mt-6">

        <div className="card p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h3 className="font-extrabold text-[var(--navy)]">
                Account Status
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your Faculty portal access is verified
                through Firebase Authentication and your
                Firestore role profile.
              </p>
            </div>

            <Badge tone="green">
              Active Faculty
            </Badge>

          </div>

          {isLoading && (
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Syncing live faculty information...
            </div>
          )}

          {hasError && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800">
              Some live faculty information could not be loaded.
              Your authentication session remains active.
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

function QuickAction({
  href,
  icon: Icon,
  title,
  text,
}: {
  href: string;
  icon: typeof BookOpen;
  title: string;
  text: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
    >
      <div className="flex items-start gap-3">

        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[var(--blue)] shadow-sm">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <div className="font-extrabold text-[var(--navy)]">
            {title}
          </div>

          <div className="mt-1 text-xs leading-5 text-slate-500">
            {text}
          </div>
        </div>

      </div>
    </a>
  );
}

function LoadingRow({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 py-4 text-sm text-slate-500">
      <Loader2 className="h-4 w-4 animate-spin" />
      {text}
    </div>
  );
}

function EmptyRow({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
      {text}
    </div>
  );
}

function ErrorRow({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {text}
    </div>
  );
}
