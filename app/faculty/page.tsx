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
  uid?: string;
  facultyId?: string;
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  designation?: string;
  qualification?: string;
  specialization?: string;
  joiningDate?: string;
  status?: string;
};

type StudentRecord = {
  id: string;
  uid?: string;
  studentId?: string;
  registerNumber?: string;
  name?: string;
  email?: string;
  phone?: string;
  courseId?: string;
  course?: string;
  semesterId?: string;
  semester?: string;
  sectionId?: string;
  section?: string;
  department?: string;
  facultyId?: string;
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
  userId?: string;
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
  userId?: string;
};

type AttendanceRecord = {
  id: string;
  facultyId?: string;
  userId?: string;
  subjectId?: string;
  markedAt?: string;
};

export default function FacultyDashboard() {
  const {
    user,
    loading: sessionLoading,
    error: sessionError,
  } = useScmsSession("faculty");

  /*
   * Firebase UID from the authenticated session.
   * SessionUser does NOT contain facultyId.
   */
  const userUid = user?.uid ?? "";

  /*
   * Faculty profile
   *
   * The approved faculty document uses the Firebase UID
   * as its document ID and also stores the official
   * college Faculty ID in facultyId.
   */
  const {
    data: facultyRecords,
    loading: facultyLoading,
    error: facultyError,
  } = useLiveCollection<FacultyRecord>(
    userUid ? firestoreDb : null,
    "faculty",
    {
      filters: userUid
        ? [
            {
              field: "uid",
              op: "==",
              value: userUid,
            },
          ]
        : undefined,
      limit: 1,
    }
  );

  const facultyProfile = facultyRecords[0];

  /*
   * Official Faculty ID
   *
   * Priority:
   * 1. Approved faculty record facultyId
   * 2. Firebase UID for compatibility with older records
   */
  const officialFacultyId =
    facultyProfile?.facultyId?.trim() || "";

  const facultyQueryId =
    officialFacultyId || userUid;

  /*
   * Students
   */
  const {
    data: students,
    loading: studentsLoading,
    error: studentsError,
  } = useLiveCollection<StudentRecord>(
    userUid ? firestoreDb : null,
    "students",
    {
      limit: 100,
    }
  );

  /*
   * Assignments
   */
  const {
    data: assignments,
    loading: assignmentsLoading,
    error: assignmentsError,
  } = useLiveCollection<Assignment>(
    facultyQueryId ? firestoreDb : null,
    "assignments",
    {
      filters: facultyQueryId
        ? [
            {
              field: "facultyId",
              op: "==",
              value: facultyQueryId,
            },
          ]
        : undefined,
      limit: 20,
    }
  );

  /*
   * Timetable / Classes
   */
  const {
    data: classes,
    loading: classesLoading,
    error: classesError,
  } = useLiveCollection<ClassRecord>(
    facultyQueryId ? firestoreDb : null,
    "timetable",
    {
      filters: facultyQueryId
        ? [
            {
              field: "facultyId",
              op: "==",
              value: facultyQueryId,
            },
          ]
        : undefined,
      limit: 20,
    }
  );

  /*
   * Attendance
   */
  const {
    data: attendance,
    loading: attendanceLoading,
    error: attendanceError,
  } = useLiveCollection<AttendanceRecord>(
    facultyQueryId ? firestoreDb : null,
    "attendance",
    {
      filters: facultyQueryId
        ? [
            {
              field: "facultyId",
              op: "==",
              value: facultyQueryId,
            },
          ]
        : undefined,
      limit: 100,
    }
  );

  /*
   * Published notices
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
      limit: 5,
    }
  );

  /*
   * Session loading
   */
  if (sessionLoading) {
    return (
      <PortalShell
        role="faculty"
        title="Faculty Dashboard"
      >
        <div className="grid min-h-[60vh] place-items-center">
          <div className="flex flex-col items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-7 w-7 animate-spin text-[var(--blue)]" />
            <span>
              Verifying your faculty account...
            </span>
          </div>
        </div>
      </PortalShell>
    );
  }

  /*
   * Session error
   */
  if (sessionError || !user) {
    return (
      <PortalShell
        role="faculty"
        title="Faculty Dashboard"
      >
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-red-600 shadow-sm">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-extrabold text-red-900">
                Faculty account could not be verified
              </h2>

              <p className="mt-2 text-sm leading-6 text-red-700">
                {sessionError ||
                  "Your faculty account could not be loaded."}
              </p>
            </div>
          </div>
        </div>
      </PortalShell>
    );
  }

  /*
   * Combined loading state
   */
  const isLoading =
    facultyLoading ||
    studentsLoading ||
    assignmentsLoading ||
    classesLoading ||
    attendanceLoading;

  /*
   * Combined error state
   */
  const hasError =
    facultyError ||
    studentsError ||
    assignmentsError ||
    classesError ||
    attendanceError;

  /*
   * Display information
   */
  const facultyName =
    facultyProfile?.name ||
    user.name ||
    "Faculty";

  const facultyEmail =
    facultyProfile?.email ||
    user.email ||
    "Not assigned";

  const facultyPhone =
    facultyProfile?.phone ||
    "Not assigned";

  const department =
    facultyProfile?.department ||
    "Not assigned";

  const designation =
    facultyProfile?.designation ||
    "Not assigned";

  const qualification =
    facultyProfile?.qualification ||
    "Not assigned";

  const joiningDate =
    facultyProfile?.joiningDate ||
    "Not assigned";

  return (
    <PortalShell
      role="faculty"
      title="Faculty Dashboard"
    >
      <main className="space-y-8 pb-10">
        {/* Page Header */}
        <PageHeading
          eyebrow={`Welcome, ${facultyName}`}
          title="Faculty Dashboard"
          description="Manage your academic activities, classes and student support from one place."
        />

        {/* Faculty Identity */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-cyan-950 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={facultyName}
                  className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/20"
                />
              ) : (
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-xl font-black">
                  {(facultyName || "F")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Faculty Profile
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {facultyName}
                </h2>

                <p className="mt-1 text-sm text-emerald-200">
                  {designation}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-200">
                Faculty ID
              </p>

              <p className="mt-1 text-xl font-black tracking-wide text-white">
                {officialFacultyId || "Not assigned"}
              </p>
            </div>
          </div>
        </section>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Students"
            value={String(students.length)}
            icon={Users}
            trend="Student records"
          />

          <StatCard
            label="Classes"
            value={String(classes.length)}
            icon={CalendarDays}
            trend="Your timetable"
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

        {/* Profile + Quick Actions */}
        <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
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
                value={facultyName}
              />

              <AccountRow
                label="Faculty ID"
                value={
                  officialFacultyId ||
                  "Not assigned"
                }
              />

              <AccountRow
                label="Gmail"
                value={facultyEmail}
              />

              <AccountRow
                label="Phone"
                value={facultyPhone}
              />

              <AccountRow
                label="Department"
                value={department}
              />

              <AccountRow
                label="Designation"
                value={designation}
              />

              <AccountRow
                label="Qualification"
                value={qualification}
              />

              <AccountRow
                label="Joining Date"
                value={joiningDate}
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

              <Badge tone="green">
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
                text="View student records."
              />
            </div>
          </div>
        </div>

        {/* Classes + Assignments */}
        <div className="grid gap-6 xl:grid-cols-2">
          {/* My Classes */}
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
                classes.length === 0 && (
                  <EmptyRow text="No class timetable records found." />
                )}

              {classes
                .slice(0, 5)
                .map((classItem) => (
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
                        {classItem.date ||
                          "Date not set"}

                        {classItem.endTime
                          ? ` • ${classItem.endTime}`
                          : ""}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Assignments */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-[var(--navy)]">
                  Recent Assignments
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Assignments associated with your Faculty ID.
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
                assignments.length === 0 && (
                  <EmptyRow text="No assignments found." />
                )}

              {assignments
                .slice(0, 5)
                .map((assignment) => (
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
                          assignment.status ===
                          "active"
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

        {/* Notices + Attendance */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Notices */}
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
                    {notice.title || "Notice"}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {notice.publishedAt ||
                      "Recently"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance */}
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

        {/* Account Status */}
        <div className="card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-extrabold text-[var(--navy)]">
                Account Status
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your Faculty portal access is verified through
                Firebase Authentication and your Firestore role
                profile.
              </p>
            </div>

            <Badge tone="green">
              Active Faculty
            </Badge>
          </div>

          {officialFacultyId && (
            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                Official Faculty ID
              </div>

              <div className="mt-1 text-lg font-black tracking-wide text-emerald-900">
                {officialFacultyId}
              </div>
            </div>
          )}

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
      </main>
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

      <span className="max-w-[60%] break-words text-right text-sm font-extrabold text-[var(--navy)]">
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
      className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm">
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