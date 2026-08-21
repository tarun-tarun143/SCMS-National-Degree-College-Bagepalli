"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ElementType,
  type SetStateAction,
} from "react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  GraduationCap,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";

/* ============================================================
   TYPES
============================================================ */

type ExamStatus =
  | "Scheduled"
  | "Completed"
  | "Cancelled"
  | "Postponed";

type ExamType =
  | "Internal"
  | "Mid Term"
  | "Semester"
  | "Final"
  | "Practical"
  | "Viva"
  | "Other";

type ExamRecord = {
  id: string;

  examName: string;
  examType: ExamType;

  course: string;
  department: string;
  semester: string;

  subject: string;
  subjectCode: string;

  examDate: string;
  startTime: string;
  endTime: string;
  duration: string;

  room: string;

  faculty: string;
  facultyId: string;

  academicYear: string;

  maximumMarks: number;
  passingMarks: number;

  status: ExamStatus;

  instructions: string;

  createdAt?: unknown;
  updatedAt?: unknown;
};

type ExamForm = {
  examName: string;
  examType: ExamType;

  course: string;
  department: string;
  semester: string;

  subject: string;
  subjectCode: string;

  examDate: string;
  startTime: string;
  endTime: string;
  duration: string;

  room: string;

  faculty: string;
  facultyId: string;

  academicYear: string;

  maximumMarks: string;
  passingMarks: string;

  status: ExamStatus;

  instructions: string;
};

const emptyForm: ExamForm = {
  examName: "",
  examType: "Internal",

  course: "",
  department: "",
  semester: "",

  subject: "",
  subjectCode: "",

  examDate: "",
  startTime: "",
  endTime: "",
  duration: "",

  room: "",

  faculty: "",
  facultyId: "",

  academicYear: "",

  maximumMarks: "100",
  passingMarks: "35",

  status: "Scheduled",

  instructions: "",
};

const examTypes: ExamType[] = [
  "Internal",
  "Mid Term",
  "Semester",
  "Final",
  "Practical",
  "Viva",
  "Other",
];

const examStatuses: ExamStatus[] = [
  "Scheduled",
  "Completed",
  "Cancelled",
  "Postponed",
];

/* ============================================================
   PAGE
============================================================ */

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamRecord[]>([]);

  const [form, setForm] = useState<ExamForm>({
    ...emptyForm,
  });

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [examTypeFilter, setExamTypeFilter] =
    useState<"all" | ExamType>("all");

  const [courseFilter, setCourseFilter] =
    useState("all");

  const [semesterFilter, setSemesterFilter] =
    useState("all");

  const [departmentFilter, setDepartmentFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState<"all" | ExamStatus>("all");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [viewingExam, setViewingExam] =
    useState<ExamRecord | null>(null);

  /* ============================================================
     REAL-TIME FIRESTORE
  ============================================================ */

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

    const unsubscribe = onSnapshot(
      collection(db, "exams"),
      (snapshot) => {
        const records: ExamRecord[] =
          snapshot.docs.map((item) => {
            const data = item.data();

            return {
              id: item.id,

              examName: String(
                data.examName ?? ""
              ),

              examType: isExamType(
                data.examType
              )
                ? data.examType
                : "Internal",

              course: String(
                data.course ?? ""
              ),

              department: String(
                data.department ?? ""
              ),

              semester: String(
                data.semester ?? ""
              ),

              subject: String(
                data.subject ?? ""
              ),

              subjectCode: String(
                data.subjectCode ?? ""
              ),

              examDate: String(
                data.examDate ?? ""
              ),

              startTime: String(
                data.startTime ?? ""
              ),

              endTime: String(
                data.endTime ?? ""
              ),

              duration: String(
                data.duration ?? ""
              ),

              room: String(
                data.room ?? ""
              ),

              faculty: String(
                data.faculty ?? ""
              ),

              facultyId: String(
                data.facultyId ?? ""
              ),

              academicYear: String(
                data.academicYear ?? ""
              ),

              maximumMarks: Number(
                data.maximumMarks ?? 0
              ),

              passingMarks: Number(
                data.passingMarks ?? 0
              ),

              status: isExamStatus(
                data.status
              )
                ? data.status
                : "Scheduled",

              instructions: String(
                data.instructions ?? ""
              ),

              createdAt:
                data.createdAt,

              updatedAt:
                data.updatedAt,
            };
          });

        records.sort(
          (a, b) =>
            getTimestampValue(
              b.createdAt
            ) -
            getTimestampValue(
              a.createdAt
            )
        );

        setExams(records);
        setLoading(false);
        setError("");
      },
      (listenerError) => {
        console.error(
          "Exam listener error:",
          listenerError
        );

        setError(
          listenerError instanceof Error
            ? listenerError.message
            : "Unable to load exam records."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ============================================================
     FILTER OPTIONS
  ============================================================ */

  const courseOptions = useMemo(
    () =>
      getUniqueValues(
        exams.map(
          (exam) => exam.course
        )
      ),
    [exams]
  );

  const semesterOptions = useMemo(
    () =>
      getUniqueValues(
        exams.map(
          (exam) => exam.semester
        )
      ),
    [exams]
  );

  const departmentOptions = useMemo(
    () =>
      getUniqueValues(
        exams.map(
          (exam) => exam.department
        )
      ),
    [exams]
  );

  /* ============================================================
     FILTERED EXAMS
  ============================================================ */

  const filteredExams = useMemo(() => {
    const term =
      search.trim().toLowerCase();

    return exams.filter((exam) => {
      const matchesSearch =
        !term ||
        [
          exam.examName,
          exam.examType,
          exam.course,
          exam.department,
          exam.semester,
          exam.subject,
          exam.subjectCode,
          exam.room,
          exam.faculty,
          exam.facultyId,
          exam.academicYear,
          exam.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesExamType =
        examTypeFilter === "all" ||
        exam.examType ===
          examTypeFilter;

      const matchesCourse =
        courseFilter === "all" ||
        exam.course ===
          courseFilter;

      const matchesSemester =
        semesterFilter === "all" ||
        exam.semester ===
          semesterFilter;

      const matchesDepartment =
        departmentFilter ===
          "all" ||
        exam.department ===
          departmentFilter;

      const matchesStatus =
        statusFilter === "all" ||
        exam.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesExamType &&
        matchesCourse &&
        matchesSemester &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    exams,
    search,
    examTypeFilter,
    courseFilter,
    semesterFilter,
    departmentFilter,
    statusFilter,
  ]);

  /* ============================================================
     STATISTICS
  ============================================================ */

  const totalExams = exams.length;

  const scheduledExams =
    exams.filter(
      (exam) =>
        exam.status ===
        "Scheduled"
    ).length;

  const completedExams =
    exams.filter(
      (exam) =>
        exam.status ===
        "Completed"
    ).length;

  const cancelledExams =
    exams.filter(
      (exam) =>
        exam.status ===
        "Cancelled"
    ).length;

  const postponedExams =
    exams.filter(
      (exam) =>
        exam.status ===
        "Postponed"
    ).length;

  const upcomingExams =
    exams.filter(
      isUpcomingExam
    ).length;

  /* ============================================================
     FORM
  ============================================================ */

  function openAddForm() {
    setEditingId(null);
    setForm({
      ...emptyForm,
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditForm(
    exam: ExamRecord
  ) {
    setEditingId(exam.id);

    setForm({
      examName: exam.examName,
      examType: exam.examType,

      course: exam.course,
      department:
        exam.department,
      semester: exam.semester,

      subject: exam.subject,
      subjectCode:
        exam.subjectCode,

      examDate: exam.examDate,
      startTime:
        exam.startTime,
      endTime:
        exam.endTime,
      duration:
        exam.duration,

      room: exam.room,

      faculty:
        exam.faculty,
      facultyId:
        exam.facultyId,

      academicYear:
        exam.academicYear,

      maximumMarks:
        String(
          exam.maximumMarks
        ),

      passingMarks:
        String(
          exam.passingMarks
        ),

      status: exam.status,

      instructions:
        exam.instructions,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm({
      ...emptyForm,
    });
  }

  /* ============================================================
     SAVE
  ============================================================ */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const db = firestoreDb;

    if (!db) {
      setError(
        "Firestore is not initialized."
      );
      return;
    }

    const examName =
      form.examName.trim();

    const course =
      form.course.trim();

    const department =
      form.department.trim();

    const semester =
      form.semester.trim();

    const subject =
      form.subject.trim();

    const subjectCode =
      form.subjectCode
        .trim()
        .toUpperCase();

    const examDate =
      form.examDate.trim();

    const startTime =
      form.startTime.trim();

    const endTime =
      form.endTime.trim();

    const room =
      form.room.trim();

    const academicYear =
      form.academicYear.trim();

    const maximumMarks =
      Number(
        form.maximumMarks
      );

    const passingMarks =
      Number(
        form.passingMarks
      );

    if (!examName) {
      setError(
        "Exam name is required."
      );
      return;
    }

    if (!course) {
      setError(
        "Course is required."
      );
      return;
    }

    if (!department) {
      setError(
        "Department is required."
      );
      return;
    }

    if (!semester) {
      setError(
        "Semester is required."
      );
      return;
    }

    if (!subject) {
      setError(
        "Subject is required."
      );
      return;
    }

    if (!subjectCode) {
      setError(
        "Subject code is required."
      );
      return;
    }

    if (!examDate) {
      setError(
        "Exam date is required."
      );
      return;
    }

    if (!startTime) {
      setError(
        "Start time is required."
      );
      return;
    }

    if (!endTime) {
      setError(
        "End time is required."
      );
      return;
    }

    if (!room) {
      setError(
        "Exam room is required."
      );
      return;
    }

    if (!academicYear) {
      setError(
        "Academic year is required."
      );
      return;
    }

    if (
      !Number.isFinite(
        maximumMarks
      ) ||
      maximumMarks <= 0
    ) {
      setError(
        "Maximum marks must be greater than 0."
      );
      return;
    }

    if (
      !Number.isFinite(
        passingMarks
      ) ||
      passingMarks < 0
    ) {
      setError(
        "Passing marks must be a valid number."
      );
      return;
    }

    if (
      passingMarks >
      maximumMarks
    ) {
      setError(
        "Passing marks cannot be greater than maximum marks."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const examData = {
        examName,

        examType:
          form.examType,

        course,
        department,
        semester,

        subject,
        subjectCode,

        examDate,
        startTime,
        endTime,

        duration:
          form.duration.trim(),

        room,

        faculty:
          form.faculty.trim(),

        facultyId:
          form.facultyId.trim(),

        academicYear,

        maximumMarks,
        passingMarks,

        status:
          form.status,

        instructions:
          form.instructions
            .trim(),

        updatedAt:
          serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(
          doc(
            db,
            "exams",
            editingId
          ),
          examData
        );

        setSuccess(
          "Exam updated successfully."
        );
      } else {
        await addDoc(
          collection(
            db,
            "exams"
          ),
          {
            ...examData,
            createdAt:
              serverTimestamp(),
          }
        );

        setSuccess(
          "Exam added successfully."
        );
      }

      setShowForm(false);
      setEditingId(null);
      setForm({
        ...emptyForm,
      });
    } catch (err) {
      console.error(
        "Exam save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save exam."
      );
    } finally {
      setSaving(false);
    }
  }

  /* ============================================================
     DELETE
  ============================================================ */

  async function handleDelete(
    exam: ExamRecord
  ) {
    const db = firestoreDb;

    if (!db) {
      setError(
        "Firestore is not initialized."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete exam "${exam.examName}" for ${exam.subject}?`
      );

    if (!confirmed) return;

    try {
      setDeletingId(exam.id);
      setError("");
      setSuccess("");

      await deleteDoc(
        doc(
          db,
          "exams",
          exam.id
        )
      );

      setSuccess(
        `Exam "${exam.examName}" was deleted successfully.`
      );
    } catch (err) {
      console.error(
        "Exam delete error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete exam."
      );
    } finally {
      setDeletingId(null);
    }
  }

  /* ============================================================
     CLEAR FILTERS
  ============================================================ */

  function clearFilters() {
    setSearch("");
    setExamTypeFilter("all");
    setCourseFilter("all");
    setSemesterFilter("all");
    setDepartmentFilter("all");
    setStatusFilter("all");
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <PortalShell
      role="admin"
      title="Exams"
    >
      <main className="space-y-8 pb-10">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600 p-6 text-white shadow-xl sm:p-8">

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] backdrop-blur">
                  <CalendarDays className="h-3.5 w-3.5 text-cyan-200" />
                  Academic Administration
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Examination Control Center
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
                  Create, schedule, monitor and manage college examinations with live Firestore synchronization.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  openAddForm
                }
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                Add Examination
              </button>

            </div>

            <div className="mt-7 flex flex-wrap gap-3">

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                Real-time database
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                {scheduledExams} scheduled
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
                <Clock3 className="h-4 w-4 text-amber-200" />
                {upcomingExams} upcoming
              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            ALERTS
        ====================================================== */}

        {error && (
          <MessageBox
            type="error"
            message={error}
            onClose={() =>
              setError("")
            }
          />
        )}

        {success && (
          <MessageBox
            type="success"
            message={success}
            onClose={() =>
              setSuccess("")
            }
          />
        )}

        {/* =====================================================
            STATISTICS
        ====================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

          <StatCard
            icon={CalendarDays}
            label="Total Exams"
            value={totalExams}
            gradient="from-blue-600 to-cyan-500"
          />

          <StatCard
            icon={Clock3}
            label="Scheduled"
            value={scheduledExams}
            gradient="from-indigo-600 to-violet-500"
          />

          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={completedExams}
            gradient="from-emerald-600 to-teal-500"
          />

          <StatCard
            icon={CalendarDays}
            label="Upcoming"
            value={upcomingExams}
            gradient="from-orange-500 to-amber-500"
          />

          <StatCard
            icon={RefreshCw}
            label="Postponed"
            value={postponedExams}
            gradient="from-yellow-500 to-orange-500"
          />

          <StatCard
            icon={XCircle}
            label="Cancelled"
            value={cancelledExams}
            gradient="from-red-500 to-rose-500"
          />

        </section>

        {/* =====================================================
            FILTERS
        ====================================================== */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-600">
                  Examination records
                </p>

                <h2 className="mt-1 text-xl font-black text-[var(--navy)]">
                  Examination Schedule
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-black text-slate-700">
                    {filteredExams.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-black text-slate-700">
                    {exams.length}
                  </span>{" "}
                  examinations
                </p>
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search exams, subjects, faculty..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 lg:w-80"
                />
              </div>

            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

              <FilterSelect
                value={
                  examTypeFilter
                }
                onChange={(
                  value
                ) =>
                  setExamTypeFilter(
                    value as
                      | "all"
                      | ExamType
                  )
                }
                options={
                  examTypes
                }
                placeholder="Exam Type"
              />

              <FilterSelect
                value={
                  courseFilter
                }
                onChange={
                  setCourseFilter
                }
                options={
                  courseOptions
                }
                placeholder="Course"
              />

              <FilterSelect
                value={
                  departmentFilter
                }
                onChange={
                  setDepartmentFilter
                }
                options={
                  departmentOptions
                }
                placeholder="Department"
              />

              <FilterSelect
                value={
                  semesterFilter
                }
                onChange={
                  setSemesterFilter
                }
                options={
                  semesterOptions
                }
                placeholder="Semester"
              />

              <FilterSelect
                value={
                  statusFilter
                }
                onChange={(
                  value
                ) =>
                  setStatusFilter(
                    value as
                      | "all"
                      | ExamStatus
                  )
                }
                options={
                  examStatuses
                }
                placeholder="Status"
              />

            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                </span>

                Live Firestore synchronization
              </div>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Clear Filters
              </button>

            </div>
          </div>
        </section>

        {/* =====================================================
            TABLE
        ====================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {loading ? (
            <LoadingState />
          ) : filteredExams.length === 0 ? (
            <EmptyState
              hasFilters={
                Boolean(
                  search.trim()
                ) ||
                examTypeFilter !==
                  "all" ||
                courseFilter !==
                  "all" ||
                semesterFilter !==
                  "all" ||
                departmentFilter !==
                  "all" ||
                statusFilter !==
                  "all"
              }
              onAdd={
                openAddForm
              }
            />
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1500px]">

                <thead>
                  <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50">

                    <TableHeader>
                      Examination
                    </TableHeader>

                    <TableHeader>
                      Subject
                    </TableHeader>

                    <TableHeader>
                      Course
                    </TableHeader>

                    <TableHeader>
                      Semester
                    </TableHeader>

                    <TableHeader>
                      Date
                    </TableHeader>

                    <TableHeader>
                      Time
                    </TableHeader>

                    <TableHeader>
                      Room
                    </TableHeader>

                    <TableHeader>
                      Faculty
                    </TableHeader>

                    <TableHeader>
                      Marks
                    </TableHeader>

                    <TableHeader>
                      Status
                    </TableHeader>

                    <TableHeader align="right">
                      Actions
                    </TableHeader>

                  </tr>
                </thead>

                <tbody>
                  {filteredExams.map(
                    (exam) => {
                      const deleting =
                        deletingId ===
                        exam.id;

                      return (
                        <tr
                          key={
                            exam.id
                          }
                          className="group border-b border-slate-100 transition hover:bg-blue-50/30"
                        >

                          {/* EXAM */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">

                              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md transition group-hover:scale-105">
                                <CalendarDays className="h-5 w-5" />
                              </div>

                              <div className="min-w-0">

                                <p className="max-w-[240px] truncate font-black text-slate-800">
                                  {
                                    exam.examName
                                  }
                                </p>

                                <div className="mt-1.5 flex flex-wrap items-center gap-2">

                                  <ExamTypeBadge
                                    type={
                                      exam.examType
                                    }
                                  />

                                  <span className="text-xs font-semibold text-slate-400">
                                    {
                                      exam.academicYear
                                    }
                                  </span>

                                </div>

                              </div>
                            </div>
                          </td>

                          {/* SUBJECT */}

                          <td className="px-5 py-4">
                            <div>
                              <p className="font-bold text-slate-700">
                                {
                                  exam.subject
                                }
                              </p>

                              <span className="mt-1 inline-flex rounded-md bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">
                                {
                                  exam.subjectCode ||
                                    "NO CODE"
                                }
                              </span>
                            </div>
                          </td>

                          {/* COURSE */}

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">
                              {
                                exam.course ||
                                  "—"
                              }
                            </span>
                          </td>

                          {/* SEMESTER */}

                          <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                            {
                              exam.semester ||
                                "—"
                            }
                          </td>

                          {/* DATE */}

                          <td className="px-5 py-4">
                            <p className="text-sm font-black text-slate-700">
                              {formatDate(
                                exam.examDate
                              )}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {
                                exam.department
                              }
                            </p>
                          </td>

                          {/* TIME */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                              <Clock3 className="h-4 w-4 text-indigo-500" />

                              {
                                exam.startTime ||
                                  "--"
                              }

                              <span className="text-slate-300">
                                →
                              </span>

                              {
                                exam.endTime ||
                                  "--"
                              }
                            </div>

                            {exam.duration && (
                              <p className="mt-1 text-xs text-slate-400">
                                {
                                  exam.duration
                                }
                              </p>
                            )}
                          </td>

                          {/* ROOM */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                              <div className="grid h-8 w-8 place-items-center rounded-lg bg-orange-50 text-orange-600">
                                <MapPin className="h-4 w-4" />
                              </div>

                              {
                                exam.room ||
                                  "Not assigned"
                              }
                            </div>
                          </td>

                          {/* FACULTY */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">

                              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                                <Users className="h-4 w-4" />
                              </div>

                              <div>
                                <p className="max-w-[150px] truncate text-sm font-bold text-slate-700">
                                  {
                                    exam.faculty ||
                                      "Not assigned"
                                  }
                                </p>

                                {exam.facultyId && (
                                  <p className="mt-0.5 text-[10px] text-slate-400">
                                    {
                                      exam.facultyId
                                    }
                                  </p>
                                )}
                              </div>

                            </div>
                          </td>

                          {/* MARKS */}

                          <td className="px-5 py-4">
                            <div className="rounded-xl bg-slate-50 px-3 py-2">
                              <p className="text-sm font-black text-slate-700">
                                {
                                  exam.maximumMarks
                                }
                              </p>

                              <p className="text-[10px] font-semibold text-slate-400">
                                Pass:{" "}
                                {
                                  exam.passingMarks
                                }
                              </p>
                            </div>
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">
                            <StatusBadge
                              status={
                                exam.status
                              }
                            />
                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">

                              <ActionButton
                                title="View details"
                                className="bg-violet-50 text-violet-600 hover:bg-violet-100"
                                onClick={() =>
                                  setViewingExam(
                                    exam
                                  )
                                }
                                disabled={
                                  deleting
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </ActionButton>

                              <ActionButton
                                title="Edit exam"
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                                onClick={() =>
                                  openEditForm(
                                    exam
                                  )
                                }
                                disabled={
                                  deleting
                                }
                              >
                                <Edit3 className="h-4 w-4" />
                              </ActionButton>

                              <ActionButton
                                title="Delete exam"
                                className="bg-red-50 text-red-600 hover:bg-red-100"
                                onClick={() =>
                                  void handleDelete(
                                    exam
                                  )
                                }
                                disabled={
                                  deleting
                                }
                              >
                                {deleting ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </ActionButton>

                            </div>
                          </td>

                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* =====================================================
            ADD / EDIT MODAL
        ====================================================== */}

        {showForm && (
          <ExamModal
            form={form}
            setForm={setForm}
            editing={Boolean(
              editingId
            )}
            saving={saving}
            onClose={
              closeForm
            }
            onSubmit={
              handleSubmit
            }
          />
        )}

        {/* =====================================================
            DETAILS MODAL
        ====================================================== */}

        {viewingExam && (
          <ExamDetailsModal
            exam={
              viewingExam
            }
            onClose={() =>
              setViewingExam(
                null
              )
            }
            onEdit={() => {
              const selected =
                viewingExam;

              setViewingExam(
                null
              );

              openEditForm(
                selected
              );
            }}
          />
        )}

      </main>
    </PortalShell>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function isExamType(
  value: unknown
): value is ExamType {
  return examTypes.includes(
    String(value) as ExamType
  );
}

function isExamStatus(
  value: unknown
): value is ExamStatus {
  return examStatuses.includes(
    String(value) as ExamStatus
  );
}

function getUniqueValues(
  values: string[]
) {
  return Array.from(
    new Set(
      values
        .map((value) =>
          value.trim()
        )
        .filter(Boolean)
    )
  ).sort((a, b) =>
    a.localeCompare(b)
  );
}

function getTimestampValue(
  value: unknown
): number {
  if (!value) return 0;

  if (
    typeof value ===
      "object" &&
    value !== null &&
    "toMillis" in value &&
    typeof (
      value as {
        toMillis?: unknown;
      }
    ).toMillis === "function"
  ) {
    return (
      value as {
        toMillis: () => number;
      }
    ).toMillis();
  }

  if (
    typeof value ===
    "string"
  ) {
    const parsed =
      new Date(value).getTime();

    return Number.isNaN(parsed)
      ? 0
      : parsed;
  }

  return 0;
}

function formatDate(
  value: string
) {
  if (!value) {
    return "Not set";
  }

  const date = new Date(
    `${value}T00:00:00`
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function isUpcomingExam(
  exam: ExamRecord
) {
  if (
    !exam.examDate ||
    exam.status ===
      "Cancelled" ||
    exam.status ===
      "Completed"
  ) {
    return false;
  }

  const examDate = new Date(
    `${exam.examDate}T${
      exam.startTime ||
      "00:00"
    }:00`
  );

  if (
    Number.isNaN(
      examDate.getTime()
    )
  ) {
    return false;
  }

  return (
    examDate.getTime() >
    Date.now()
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
}: {
  icon: ElementType;
  label: string;
  value: number;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition duration-500 group-hover:scale-150`}
      />

      <div className="relative">

        <div
          className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <p className="mt-4 text-xs font-black uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-3xl font-black tracking-tight text-[var(--navy)]">
          {value.toLocaleString()}
        </p>

      </div>
    </div>
  );
}

/* ============================================================
   EXAM TYPE BADGE
============================================================ */

function ExamTypeBadge({
  type,
}: {
  type: ExamType;
}) {
  const styles: Record<
    ExamType,
    string
  > = {
    Internal:
      "bg-blue-50 text-blue-700 border-blue-100",

    "Mid Term":
      "bg-violet-50 text-violet-700 border-violet-100",

    Semester:
      "bg-indigo-50 text-indigo-700 border-indigo-100",

    Final:
      "bg-rose-50 text-rose-700 border-rose-100",

    Practical:
      "bg-emerald-50 text-emerald-700 border-emerald-100",

    Viva:
      "bg-amber-50 text-amber-700 border-amber-100",

    Other:
      "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${styles[type]}`}
    >
      {type}
    </span>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({
  status,
}: {
  status: ExamStatus;
}) {
  const config: Record<
    ExamStatus,
    {
      classes: string;
      icon: ElementType;
    }
  > = {
    Scheduled: {
      classes:
        "bg-blue-50 text-blue-700",
      icon: Clock3,
    },

    Completed: {
      classes:
        "bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    },

    Cancelled: {
      classes:
        "bg-red-50 text-red-700",
      icon: XCircle,
    },

    Postponed: {
      classes:
        "bg-amber-50 text-amber-700",
      icon: RefreshCw,
    },
  };

  const selected =
    config[status];

  const Icon =
    selected.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black ${selected.classes}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

/* ============================================================
   FILTER SELECT
============================================================ */

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (
    value: string
  ) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(
          event.target.value
        )
      }
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
    >
      <option value="all">
        All {placeholder}
      </option>

      {options.map(
        (option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        )
      )}
    </select>
  );
}

/* ============================================================
   TABLE HEADER
============================================================ */

function TableHeader({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-4 text-${align} text-xs font-black uppercase tracking-wider text-slate-500`}
    >
      {children}
    </th>
  );
}

/* ============================================================
   ACTION BUTTON
============================================================ */

function ActionButton({
  title,
  className,
  onClick,
  disabled,
  children,
}: {
  title: string;
  className: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-9 w-9 place-items-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

/* ============================================================
   MESSAGE
============================================================ */

function MessageBox({
  type,
  message,
  onClose,
}: {
  type: "error" | "success";
  message: string;
  onClose: () => void;
}) {
  const isError =
    type === "error";

  return (
    <div
      className={`rounded-2xl border p-4 ${
        isError
          ? "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
          : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">

        <div className="flex items-start gap-3">

          {isError ? (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-100 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          ) : (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}

          <div>
            <p
              className={`text-sm font-black ${
                isError
                  ? "text-red-800"
                  : "text-emerald-800"
              }`}
            >
              {isError
                ? "Operation failed"
                : "Operation completed"}
            </p>

            <p
              className={`mt-1 text-xs leading-6 ${
                isError
                  ? "text-red-700"
                  : "text-emerald-700"
              }`}
            >
              {message}
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={onClose}
          className={`rounded-lg p-2 ${
            isError
              ? "text-red-600 hover:bg-red-100"
              : "text-emerald-600 hover:bg-emerald-100"
          }`}
          aria-label="Close message"
        >
          <X className="h-4 w-4" />
        </button>

      </div>
    </div>
  );
}

/* ============================================================
   LOADING
============================================================ */

function LoadingState() {
  return (
    <div className="divide-y divide-slate-100">

      {[1, 2, 3, 4, 5].map(
        (item) => (
          <div
            key={item}
            className="animate-pulse p-5"
          >
            <div className="flex items-center gap-4">

              <div className="h-12 w-12 rounded-2xl bg-slate-100" />

              <div className="flex-1">

                <div className="h-4 w-56 rounded bg-slate-100" />

                <div className="mt-3 h-3 w-80 rounded bg-slate-100" />

              </div>

              <div className="hidden h-9 w-28 rounded-lg bg-slate-100 sm:block" />

            </div>
          </div>
        )
      )}

    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  hasFilters,
  onAdd,
}: {
  hasFilters: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="p-14 text-center">

      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600">
        <CalendarDays className="h-8 w-8" />
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-800">
        {hasFilters
          ? "No matching examinations"
          : "No examinations yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasFilters
          ? "Try changing your search term or filters."
          : "Create your first examination schedule to begin managing exams in real time."}
      </p>

      {!hasFilters && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Examination
        </button>
      )}

    </div>
  );
}

/* ============================================================
   FORM SECTION
============================================================ */

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
      <div className="mb-5">

        <h3 className="text-sm font-black text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>

      {children}
    </section>
  );
}

/* ============================================================
   EXAM MODAL
============================================================ */

function ExamModal({
  form,
  setForm,
  editing,
  saving,
  onClose,
  onSubmit,
}: {
  form: ExamForm;
  setForm: Dispatch<
    SetStateAction<ExamForm>
  >;
  editing: boolean;
  saving: boolean;
  onClose: () => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
}) {
  function updateField(
    field: keyof ExamForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">

          <div className="flex items-center gap-3">

            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                Examination Administration
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                {editing
                  ? "Edit Examination"
                  : "Add Examination"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Changes are synchronized with Firestore in real time.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-6 p-6"
        >

          <FormSection
            title="Basic Information"
            description="Core details about the examination."
          >
            <div className="grid gap-5 sm:grid-cols-2">

              <Input
                label="Exam Name *"
                value={
                  form.examName
                }
                onChange={(value) =>
                  updateField(
                    "examName",
                    value
                  )
                }
                placeholder="BCA 2nd Semester Internal Examination"
              />

              <SelectInput
                label="Exam Type *"
                value={
                  form.examType
                }
                onChange={(value) =>
                  updateField(
                    "examType",
                    value
                  )
                }
                options={
                  examTypes
                }
              />

              <Input
                label="Course *"
                value={
                  form.course
                }
                onChange={(value) =>
                  updateField(
                    "course",
                    value
                  )
                }
                placeholder="BCA"
              />

              <Input
                label="Department *"
                value={
                  form.department
                }
                onChange={(value) =>
                  updateField(
                    "department",
                    value
                  )
                }
                placeholder="Computer Applications"
              />

              <Input
                label="Semester *"
                value={
                  form.semester
                }
                onChange={(value) =>
                  updateField(
                    "semester",
                    value
                  )
                }
                placeholder="2nd Semester"
              />

              <Input
                label="Academic Year *"
                value={
                  form.academicYear
                }
                onChange={(value) =>
                  updateField(
                    "academicYear",
                    value
                  )
                }
                placeholder="2026-27"
              />

            </div>
          </FormSection>

          <FormSection
            title="Subject Information"
            description="Specify the subject included in this examination."
          >
            <div className="grid gap-5 sm:grid-cols-2">

              <Input
                label="Subject Name *"
                value={
                  form.subject
                }
                onChange={(value) =>
                  updateField(
                    "subject",
                    value
                  )
                }
                placeholder="Database Management Systems"
              />

              <Input
                label="Subject Code *"
                value={
                  form.subjectCode
                }
                onChange={(value) =>
                  updateField(
                    "subjectCode",
                    value.toUpperCase()
                  )
                }
                placeholder="BCA204"
              />

            </div>
          </FormSection>

          <FormSection
            title="Examination Schedule"
            description="Set the date, time and duration."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <Input
                label="Exam Date *"
                type="date"
                value={
                  form.examDate
                }
                onChange={(value) =>
                  updateField(
                    "examDate",
                    value
                  )
                }
              />

              <Input
                label="Start Time *"
                type="time"
                value={
                  form.startTime
                }
                onChange={(value) =>
                  updateField(
                    "startTime",
                    value
                  )
                }
              />

              <Input
                label="End Time *"
                type="time"
                value={
                  form.endTime
                }
                onChange={(value) =>
                  updateField(
                    "endTime",
                    value
                  )
                }
              />

              <Input
                label="Duration"
                value={
                  form.duration
                }
                onChange={(value) =>
                  updateField(
                    "duration",
                    value
                  )
                }
                placeholder="3 Hours"
              />

            </div>
          </FormSection>

          <FormSection
            title="Venue & Faculty"
            description="Assign the examination room and invigilator."
          >
            <div className="grid gap-5 sm:grid-cols-2">

              <Input
                label="Room *"
                value={
                  form.room
                }
                onChange={(value) =>
                  updateField(
                    "room",
                    value
                  )
                }
                placeholder="Room 204 / Lab 1"
              />

              <Input
                label="Faculty / Invigilator"
                value={
                  form.faculty
                }
                onChange={(value) =>
                  updateField(
                    "faculty",
                    value
                  )
                }
                placeholder="Faculty Name"
              />

              <Input
                label="Faculty ID"
                value={
                  form.facultyId
                }
                onChange={(value) =>
                  updateField(
                    "facultyId",
                    value
                  )
                }
                placeholder="FAC001"
              />

            </div>
          </FormSection>

          <FormSection
            title="Marks & Status"
            description="Define marks and current examination status."
          >
            <div className="grid gap-5 sm:grid-cols-3">

              <Input
                label="Maximum Marks *"
                type="number"
                value={
                  form.maximumMarks
                }
                onChange={(value) =>
                  updateField(
                    "maximumMarks",
                    value
                  )
                }
                placeholder="100"
              />

              <Input
                label="Passing Marks *"
                type="number"
                value={
                  form.passingMarks
                }
                onChange={(value) =>
                  updateField(
                    "passingMarks",
                    value
                  )
                }
                placeholder="35"
              />

              <SelectInput
                label="Status"
                value={
                  form.status
                }
                onChange={(value) =>
                  updateField(
                    "status",
                    value
                  )
                }
                options={
                  examStatuses
                }
              />

            </div>
          </FormSection>

          <FormSection
            title="Instructions"
            description="Optional examination instructions for students and faculty."
          >
            <textarea
              value={
                form.instructions
              }
              onChange={(event) =>
                updateField(
                  "instructions",
                  event.target.value
                )
              }
              rows={5}
              placeholder="Enter examination instructions..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </FormSection>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                saving
              }
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >

              {saving && (
                <RefreshCw className="h-4 w-4 animate-spin" />
              )}

              {editing
                ? "Update Examination"
                : "Save Examination"}

            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

/* ============================================================
   INPUT
============================================================ */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={
          placeholder
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />

    </div>
  );
}

/* ============================================================
   SELECT INPUT
============================================================ */

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  options: string[];
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}
      </select>

    </div>
  );
}

/* ============================================================
   DETAILS MODAL
============================================================ */

function ExamDetailsModal({
  exam,
  onClose,
  onEdit,
}: {
  exam: ExamRecord;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">

          <div className="flex items-center gap-3">

            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
              <Eye className="h-5 w-5" />
            </div>

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-600">
                Examination Details
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                {exam.examName}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {exam.subject} ·{" "}
                {exam.subjectCode}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        <div className="space-y-6 p-6">

          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 text-white">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-4">

                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10">
                  <GraduationCap className="h-7 w-7" />
                </div>

                <div>

                  <div className="flex flex-wrap items-center gap-2">
                    <ExamTypeBadge
                      type={
                        exam.examType
                      }
                    />

                    <span className="text-xs font-semibold text-blue-200">
                      {
                        exam.academicYear
                      }
                    </span>
                  </div>

                  <p className="mt-2 text-lg font-black">
                    {exam.subject}
                  </p>

                  <p className="mt-1 text-xs text-blue-200">
                    {exam.course} ·{" "}
                    {
                      exam.semester
                    }
                  </p>

                </div>

              </div>

              <StatusBadge
                status={
                  exam.status
                }
              />

            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <Detail
              label="Exam Date"
              value={formatDate(
                exam.examDate
              )}
            />

            <Detail
              label="Time"
              value={`${exam.startTime || "--"} - ${
                exam.endTime || "--"
              }`}
            />

            <Detail
              label="Duration"
              value={
                exam.duration ||
                "Not specified"
              }
            />

            <Detail
              label="Department"
              value={
                exam.department ||
                "Not specified"
              }
            />

            <Detail
              label="Course"
              value={
                exam.course ||
                "Not specified"
              }
            />

            <Detail
              label="Semester"
              value={
                exam.semester ||
                "Not specified"
              }
            />

            <Detail
              label="Room"
              value={
                exam.room ||
                "Not specified"
              }
            />

            <Detail
              label="Faculty"
              value={
                exam.faculty ||
                "Not assigned"
              }
            />

            <Detail
              label="Faculty ID"
              value={
                exam.facultyId ||
                "Not assigned"
              }
            />

            <Detail
              label="Academic Year"
              value={
                exam.academicYear ||
                "Not specified"
              }
            />

            <Detail
              label="Maximum Marks"
              value={String(
                exam.maximumMarks
              )}
            />

            <Detail
              label="Passing Marks"
              value={String(
                exam.passingMarks
              )}
            />

          </div>

          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">

            <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">
              Examination Instructions
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-blue-950">
              {exam.instructions ||
                "No instructions provided."}
            </p>

          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={
                onClose
              }
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>

            <button
              type="button"
              onClick={
                onEdit
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Edit3 className="h-4 w-4" />
              Edit Examination
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DETAIL
============================================================ */

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-bold text-slate-700">
        {value}
      </p>

    </div>
  );
}