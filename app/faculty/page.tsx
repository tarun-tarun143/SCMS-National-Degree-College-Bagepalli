"use client";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import StatCard from "@/components/ui/StatCard";

import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Users,
} from "lucide-react";

import { firestoreDb } from "@/lib/firebase/client";
import { useLiveCollection } from "@/hooks/useLiveCollection";
import { useScmsSession } from "@/lib/auth/session";

type Student = {
  id: string;
  name?: string;
  studentId?: string;
  registerNumber?: string;
  courseId?: string;
  sectionId?: string;
};

type Subject = {
  id: string;
  name?: string;
  code?: string;
};

export default function Faculty() {
  const { user } = useScmsSession("faculty");

  const students = useLiveCollection<Student>(
    firestoreDb,
    "students",
    {
      limit: 100,
    }
  );

  const subjects = useLiveCollection<Subject>(
    firestoreDb,
    "subjects",
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

  return (
    <PortalShell
      role="faculty"
      title="Faculty Dashboard"
    >
      <PageHeading
        eyebrow="Faculty workspace"
        title="Classroom operations at a glance"
        description="Live counts and records come directly from your authorized Firestore data."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Students"
          value={String(students.data.length)}
          icon={Users}
          trend="Live college records"
        />

        <StatCard
          label="Subjects"
          value={String(subjects.data.length)}
          icon={BookOpen}
          trend="Assigned to your account"
        />

        <StatCard
          label="Attendance"
          value="—"
          icon={ClipboardCheck}
          trend="Live sessions appear here"
        />

        <StatCard
          label="Today's Classes"
          value="—"
          icon={GraduationCap}
          trend="Timetable records appear here"
        />

      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">

        {/* Student directory */}
        <div className="card overflow-hidden">

          <div className="border-b border-slate-100 p-5 font-extrabold text-[var(--navy)]">
            Live student directory
          </div>

          {students.loading && (
            <div className="p-5 text-sm text-slate-500">
              Loading students…
            </div>
          )}

          {students.error && (
            <div className="p-5 text-sm text-red-600">
              {students.error}
            </div>
          )}

          {!students.loading &&
            !students.error &&
            !students.data.length && (
              <div className="p-5 text-sm text-slate-500">
                No student records have been assigned yet.
              </div>
            )}

          {students.data.slice(0, 8).map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between border-b border-slate-100 p-5"
            >
              <div>
                <div className="font-bold">
                  {student.name ||
                    student.studentId ||
                    "Student"}
                </div>

                <div className="text-xs text-slate-500">
                  {student.registerNumber ||
                    student.id}{" "}
                  · {student.courseId || "Course"} ·{" "}
                  {student.sectionId || "Section"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Assigned subjects */}
        <div className="card p-6">

          <h3 className="font-extrabold text-[var(--navy)]">
            Assigned subjects
          </h3>

          {subjects.loading && (
            <div className="mt-5 text-sm text-slate-500">
              Loading subjects…
            </div>
          )}

          {!subjects.loading &&
            !subjects.data.length && (
              <div className="mt-5 text-sm text-slate-500">
                No subjects are assigned to this faculty
                account yet.
              </div>
            )}

          <div className="mt-5 grid gap-3">
            {subjects.data.map((subject) => (
              <div
                key={subject.id}
                className="rounded-xl bg-slate-50 p-4"
              >
                <div className="text-xs font-bold text-[var(--blue)]">
                  {subject.code || "Subject"}
                </div>

                <div className="mt-1 font-bold">
                  {subject.name || "Untitled subject"}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </PortalShell>
  );
}