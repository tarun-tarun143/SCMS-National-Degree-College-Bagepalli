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
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  Award,
  BookOpen,
  CheckCircle2,
  Edit3,
  GraduationCap,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Trophy,
  User,
  X,
  XCircle,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";

/* ============================================================
   TYPES
============================================================ */

type ResultStatus = "Pass" | "Fail";

type ResultRecord = {
  id: string;

  studentUid: string;
  studentName: string;
  studentId: string;
  email: string;

  course: string;
  department: string;
  semester: string;
  academicYear: string;

  examId: string;
  examName: string;

  subject: string;
  subjectCode: string;

  maximumMarks: number;
  marksObtained: number;
  passingMarks: number;

  percentage: number;
  grade: string;
  resultStatus: ResultStatus;

  published: boolean;

  remarks: string;

  createdAt?: unknown;
  updatedAt?: unknown;
};

type ResultForm = {
  studentUid: string;
  studentName: string;
  studentId: string;
  email: string;

  course: string;
  department: string;
  semester: string;
  academicYear: string;

  examId: string;
  examName: string;

  subject: string;
  subjectCode: string;

  maximumMarks: string;
  marksObtained: string;
  passingMarks: string;

  published: boolean;

  remarks: string;
};

const emptyForm: ResultForm = {
  studentUid: "",
  studentName: "",
  studentId: "",
  email: "",

  course: "",
  department: "",
  semester: "",
  academicYear: "",

  examId: "",
  examName: "",

  subject: "",
  subjectCode: "",

  maximumMarks: "100",
  marksObtained: "",
  passingMarks: "40",

  published: false,

  remarks: "",
};

/* ============================================================
   CALCULATIONS
============================================================ */

function calculatePercentage(
  marksObtained: number,
  maximumMarks: number
): number {
  if (
    !Number.isFinite(marksObtained) ||
    !Number.isFinite(maximumMarks) ||
    maximumMarks <= 0
  ) {
    return 0;
  }

  return Number(
    ((marksObtained / maximumMarks) * 100).toFixed(2)
  );
}

function calculateGrade(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";

  return "F";
}

function calculateResultStatus(
  marksObtained: number,
  passingMarks: number
): ResultStatus {
  return marksObtained >= passingMarks
    ? "Pass"
    : "Fail";
}

function formatNumber(value: number): string {
  return Number.isFinite(value)
    ? value.toLocaleString("en-IN")
    : "0";
}

/* ============================================================
   PAGE
============================================================ */

export default function ResultsPage() {
  const [results, setResults] = useState<ResultRecord[]>([]);

  const [form, setForm] = useState<ResultForm>({
    ...emptyForm,
  });

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [courseFilter, setCourseFilter] =
    useState("all");

  const [departmentFilter, setDepartmentFilter] =
    useState("all");

  const [semesterFilter, setSemesterFilter] =
    useState("all");

  const [examFilter, setExamFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState<"all" | "Pass" | "Fail">("all");

  const [publishedFilter, setPublishedFilter] =
    useState<
      "all" | "published" | "unpublished"
    >("all");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  /* ==========================================================
     REAL-TIME FIRESTORE
  ========================================================== */

  useEffect(() => {
    const db = firestoreDb;

    if (!db) {
      setError("Firestore is not initialized.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const resultsQuery = query(
      collection(db, "results"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      resultsQuery,
      (snapshot) => {
        const records: ResultRecord[] =
          snapshot.docs.map((item) => {
            const data = item.data();

            return {
              id: item.id,

              studentUid: String(
                data.studentUid ?? ""
              ),

              studentName: String(
                data.studentName ?? ""
              ),

              studentId: String(
                data.studentId ??
                  data.collegeRegisterUid ??
                  ""
              ),

              email: String(
                data.email ?? ""
              ),

              course: String(
                data.course ?? ""
              ),

              department: String(
                data.department ?? ""
              ),

              semester: String(
                data.semester ?? ""
              ),

              academicYear: String(
                data.academicYear ?? ""
              ),

              examId: String(
                data.examId ?? ""
              ),

              examName: String(
                data.examName ?? ""
              ),

              subject: String(
                data.subject ?? ""
              ),

              subjectCode: String(
                data.subjectCode ?? ""
              ),

              maximumMarks: Number(
                data.maximumMarks ?? 0
              ),

              marksObtained: Number(
                data.marksObtained ?? 0
              ),

              passingMarks: Number(
                data.passingMarks ?? 40
              ),

              percentage: Number(
                data.percentage ?? 0
              ),

              grade: String(
                data.grade ?? "F"
              ),

              resultStatus:
                data.resultStatus === "Fail"
                  ? "Fail"
                  : "Pass",

              published: Boolean(
                data.published ?? false
              ),

              remarks: String(
                data.remarks ?? ""
              ),

              createdAt:
                data.createdAt,

              updatedAt:
                data.updatedAt,
            };
          });

        setResults(records);
        setLoading(false);
        setError("");
      },
      (listenerError) => {
        console.error(
          "Results listener error:",
          listenerError
        );

        setError(
          listenerError instanceof Error
            ? listenerError.message
            : "Unable to load result records."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ==========================================================
     FILTER OPTIONS
  ========================================================== */

  const courses = useMemo(
    () =>
      uniqueValues(
        results.map(
          (result) => result.course
        )
      ),
    [results]
  );

  const departments = useMemo(
    () =>
      uniqueValues(
        results.map(
          (result) =>
            result.department
        )
      ),
    [results]
  );

  const semesters = useMemo(
    () =>
      uniqueValues(
        results.map(
          (result) =>
            result.semester
        )
      ),
    [results]
  );

  const exams = useMemo(
    () =>
      uniqueValues(
        results.map(
          (result) =>
            result.examName
        )
      ),
    [results]
  );

  /* ==========================================================
     FILTERING
  ========================================================== */

  const filteredResults = useMemo(() => {
    const term =
      search.trim().toLowerCase();

    return results.filter((result) => {
      const matchesSearch =
        !term ||
        [
          result.studentName,
          result.studentId,
          result.email,
          result.course,
          result.department,
          result.semester,
          result.academicYear,
          result.examName,
          result.subject,
          result.subjectCode,
          result.grade,
          result.resultStatus,
          result.remarks,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesCourse =
        courseFilter === "all" ||
        result.course ===
          courseFilter;

      const matchesDepartment =
        departmentFilter === "all" ||
        result.department ===
          departmentFilter;

      const matchesSemester =
        semesterFilter === "all" ||
        result.semester ===
          semesterFilter;

      const matchesExam =
        examFilter === "all" ||
        result.examName ===
          examFilter;

      const matchesStatus =
        statusFilter === "all" ||
        result.resultStatus ===
          statusFilter;

      const matchesPublished =
        publishedFilter === "all" ||
        (publishedFilter ===
        "published"
          ? result.published
          : !result.published);

      return (
        matchesSearch &&
        matchesCourse &&
        matchesDepartment &&
        matchesSemester &&
        matchesExam &&
        matchesStatus &&
        matchesPublished
      );
    });
  }, [
    results,
    search,
    courseFilter,
    departmentFilter,
    semesterFilter,
    examFilter,
    statusFilter,
    publishedFilter,
  ]);

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const totalResults =
    results.length;

  const publishedResults =
    results.filter(
      (result) => result.published
    ).length;

  const passResults =
    results.filter(
      (result) =>
        result.resultStatus ===
        "Pass"
    ).length;

  const failResults =
    results.filter(
      (result) =>
        result.resultStatus ===
        "Fail"
    ).length;

  const passPercentage =
    totalResults > 0
      ? Number(
          (
            (passResults /
              totalResults) *
            100
          ).toFixed(1)
        )
      : 0;

  /* ==========================================================
     FORM
  ========================================================== */

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
    result: ResultRecord
  ) {
    setEditingId(result.id);

    setForm({
      studentUid:
        result.studentUid,

      studentName:
        result.studentName,

      studentId:
        result.studentId,

      email:
        result.email,

      course:
        result.course,

      department:
        result.department,

      semester:
        result.semester,

      academicYear:
        result.academicYear,

      examId:
        result.examId,

      examName:
        result.examName,

      subject:
        result.subject,

      subjectCode:
        result.subjectCode,

      maximumMarks:
        String(result.maximumMarks),

      marksObtained:
        String(result.marksObtained),

      passingMarks:
        String(result.passingMarks),

      published:
        result.published,

      remarks:
        result.remarks,
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

  /* ==========================================================
     SAVE RESULT
  ========================================================== */

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

    const studentName =
      form.studentName.trim();

    const studentId =
      form.studentId.trim();

    const email =
      form.email
        .trim()
        .toLowerCase();

    const course =
      form.course.trim();

    const department =
      form.department.trim();

    const semester =
      form.semester.trim();

    const academicYear =
      form.academicYear.trim();

    const examName =
      form.examName.trim();

    const subject =
      form.subject.trim();

    const subjectCode =
      form.subjectCode
        .trim()
        .toUpperCase();

    const maximumMarks =
      Number(form.maximumMarks);

    const marksObtained =
      Number(form.marksObtained);

    const passingMarks =
      Number(form.passingMarks);

    if (!studentName) {
      setError(
        "Student name is required."
      );
      return;
    }

    if (!studentId) {
      setError(
        "Student ID / College Register UID is required."
      );
      return;
    }

    if (
      !email ||
      !email.includes("@")
    ) {
      setError(
        "Please enter a valid student Gmail address."
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

    if (!academicYear) {
      setError(
        "Academic year is required."
      );
      return;
    }

    if (!examName) {
      setError(
        "Exam name is required."
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

    if (
      !Number.isFinite(
        maximumMarks
      ) ||
      maximumMarks <= 0
    ) {
      setError(
        "Maximum marks must be greater than zero."
      );
      return;
    }

    if (
      !Number.isFinite(
        marksObtained
      ) ||
      marksObtained < 0 ||
      marksObtained >
        maximumMarks
    ) {
      setError(
        "Marks obtained must be between 0 and maximum marks."
      );
      return;
    }

    if (
      !Number.isFinite(
        passingMarks
      ) ||
      passingMarks < 0 ||
      passingMarks >
        maximumMarks
    ) {
      setError(
        "Passing marks must be between 0 and maximum marks."
      );
      return;
    }

    const percentage =
      calculatePercentage(
        marksObtained,
        maximumMarks
      );

    const grade =
      calculateGrade(
        percentage
      );

    const resultStatus =
      calculateResultStatus(
        marksObtained,
        passingMarks
      );

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const resultData = {
        studentUid:
          form.studentUid.trim(),

        studentName,

        studentId,

        email,

        course,

        department,

        semester,

        academicYear,

        examId:
          form.examId.trim(),

        examName,

        subject,

        subjectCode,

        maximumMarks,

        marksObtained,

        passingMarks,

        percentage,

        grade,

        resultStatus,

        published:
          form.published,

        remarks:
          form.remarks.trim(),

        updatedAt:
          serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(
          doc(
            db,
            "results",
            editingId
          ),
          resultData
        );

        setSuccess(
          "Result updated successfully."
        );
      } else {
        await addDoc(
          collection(
            db,
            "results"
          ),
          {
            ...resultData,
            createdAt:
              serverTimestamp(),
          }
        );

        setSuccess(
          "Result added successfully."
        );
      }

      setShowForm(false);
      setEditingId(null);

      setForm({
        ...emptyForm,
      });
    } catch (err) {
      console.error(
        "Result save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save result."
      );
    } finally {
      setSaving(false);
    }
  }

  /* ==========================================================
     DELETE
  ========================================================== */

  async function handleDelete(
    result: ResultRecord
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
        `Delete result for "${result.studentName}" - ${result.subject}?`
      );

    if (!confirmed) return;

    try {
      setProcessingId(
        result.id
      );

      setError("");
      setSuccess("");

      await deleteDoc(
        doc(
          db,
          "results",
          result.id
        )
      );

      setSuccess(
        "Result deleted successfully."
      );
    } catch (err) {
      console.error(
        "Result delete error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete result."
      );
    } finally {
      setProcessingId(null);
    }
  }

  /* ==========================================================
     PUBLISH
  ========================================================== */

  async function togglePublished(
    result: ResultRecord
  ) {
    const db = firestoreDb;

    if (!db) {
      setError(
        "Firestore is not initialized."
      );
      return;
    }

    try {
      setProcessingId(
        result.id
      );

      setError("");
      setSuccess("");

      await updateDoc(
        doc(
          db,
          "results",
          result.id
        ),
        {
          published:
            !result.published,

          updatedAt:
            serverTimestamp(),
        }
      );

      setSuccess(
        result.published
          ? "Result unpublished successfully."
          : "Result published successfully."
      );
    } catch (err) {
      console.error(
        "Result publish error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update result publication status."
      );
    } finally {
      setProcessingId(null);
    }
  }

  /* ==========================================================
     FILTER CLEAR
  ========================================================== */

  function clearFilters() {
    setSearch("");
    setCourseFilter("all");
    setDepartmentFilter(
      "all"
    );
    setSemesterFilter("all");
    setExamFilter("all");
    setStatusFilter("all");
    setPublishedFilter("all");
  }

  const hasFilters =
    Boolean(search.trim()) ||
    courseFilter !== "all" ||
    departmentFilter !==
      "all" ||
    semesterFilter !== "all" ||
    examFilter !== "all" ||
    statusFilter !== "all" ||
    publishedFilter !==
      "all";

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <PortalShell
      role="admin"
      title="Results"
    >
      <main className="space-y-8 pb-10">
        <PageHeading
          eyebrow="Academic administration"
          title="Result Management"
          description="Create, manage, publish and monitor student examination results in real time."
        />

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
            COLORFUL STATISTICS
        ====================================================== */}

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <ColorStatCard
            icon={Trophy}
            label="Total Results"
            value={totalResults}
            gradient="from-blue-600 via-indigo-600 to-violet-600"
            glow="bg-blue-500/20"
          />

          <ColorStatCard
            icon={CheckCircle2}
            label="Passed"
            value={passResults}
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
            glow="bg-emerald-500/20"
          />

          <ColorStatCard
            icon={XCircle}
            label="Failed"
            value={failResults}
            gradient="from-red-500 via-rose-500 to-pink-500"
            glow="bg-red-500/20"
          />

          <ColorStatCard
            icon={Award}
            label="Published"
            value={publishedResults}
            gradient="from-purple-600 via-fuchsia-500 to-pink-500"
            glow="bg-purple-500/20"
          />
        </section>

        {/* =====================================================
            SUMMARY
        ====================================================== */}

        <section className="grid gap-5 md:grid-cols-3">
          <SummaryColorCard
            icon={BarChartIcon}
            title="Pass Percentage"
            value={`${passPercentage}%`}
            description="Overall result performance"
            gradient="from-blue-600 to-cyan-500"
          />

          <SummaryColorCard
            icon={GraduationCap}
            title="Courses"
            value={String(
              courses.length
            )}
            description="Courses represented in results"
            gradient="from-emerald-500 to-teal-500"
          />

          <SummaryColorCard
            icon={BookOpen}
            title="Examinations"
            value={String(
              exams.length
            )}
            description="Examinations represented"
            gradient="from-purple-600 to-fuchsia-500"
          />
        </section>

        {/* =====================================================
            FILTER PANEL
        ====================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-500" />

          <div className="space-y-5 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                  Real-time Firestore
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  Result Records
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {results.length}{" "}
                  result{" "}
                  {results.length ===
                  1
                    ? "record"
                    : "records"}{" "}
                  currently stored.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(
                      event
                    ) =>
                      setSearch(
                        event.target
                          .value
                      )
                    }
                    placeholder="Search student, subject, exam..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:w-80"
                  />
                </div>

                <button
                  type="button"
                  onClick={
                    openAddForm
                  }
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-white/15">
                    <Plus className="h-4 w-4 transition group-hover:rotate-90" />
                  </span>

                  Add Result
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <FilterSelect
                label="Course"
                value={
                  courseFilter
                }
                onChange={
                  setCourseFilter
                }
                options={
                  courses
                }
              />

              <FilterSelect
                label="Department"
                value={
                  departmentFilter
                }
                onChange={
                  setDepartmentFilter
                }
                options={
                  departments
                }
              />

              <FilterSelect
                label="Semester"
                value={
                  semesterFilter
                }
                onChange={
                  setSemesterFilter
                }
                options={
                  semesters
                }
              />

              <FilterSelect
                label="Exam"
                value={
                  examFilter
                }
                onChange={
                  setExamFilter
                }
                options={exams}
              />
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={
                    statusFilter ===
                    "all"
                  }
                  onClick={() =>
                    setStatusFilter(
                      "all"
                    )
                  }
                >
                  All Results
                </FilterButton>

                <FilterButton
                  active={
                    statusFilter ===
                    "Pass"
                  }
                  onClick={() =>
                    setStatusFilter(
                      "Pass"
                    )
                  }
                  activeClass="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20"
                >
                  Passed
                </FilterButton>

                <FilterButton
                  active={
                    statusFilter ===
                    "Fail"
                  }
                  onClick={() =>
                    setStatusFilter(
                      "Fail"
                    )
                  }
                  activeClass="bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-red-500/20"
                >
                  Failed
                </FilterButton>

                <FilterButton
                  active={
                    publishedFilter ===
                    "published"
                  }
                  onClick={() =>
                    setPublishedFilter(
                      publishedFilter ===
                        "published"
                        ? "all"
                        : "published"
                    )
                  }
                  activeClass="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-purple-500/20"
                >
                  Published
                </FilterButton>

                <FilterButton
                  active={
                    publishedFilter ===
                    "unpublished"
                  }
                  onClick={() =>
                    setPublishedFilter(
                      publishedFilter ===
                        "unpublished"
                        ? "all"
                        : "unpublished"
                    )
                  }
                >
                  Unpublished
                </FilterButton>
              </div>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                <RefreshCw className="h-4 w-4" />
                Clear Filters
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-400">
              <span>
                Showing{" "}
                {
                  filteredResults.length
                }{" "}
                of{" "}
                {results.length}{" "}
                results
              </span>

              <span className="hidden items-center gap-2 text-emerald-600 sm:flex">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Live database
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            TABLE
        ====================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
          <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-500" />

          {loading ? (
            <LoadingState />
          ) : filteredResults.length ===
            0 ? (
            <EmptyState
              hasFilters={
                hasFilters
              }
              onAdd={
                openAddForm
              }
              onClear={
                clearFilters
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1450px]">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950">
                    <TableHeader>
                      Student
                    </TableHeader>

                    <TableHeader>
                      Exam
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
                      Marks
                    </TableHeader>

                    <TableHeader>
                      Percentage
                    </TableHeader>

                    <TableHeader>
                      Grade
                    </TableHeader>

                    <TableHeader>
                      Result
                    </TableHeader>

                    <TableHeader>
                      Publication
                    </TableHeader>

                    <TableHeader align="right">
                      Actions
                    </TableHeader>
                  </tr>
                </thead>

                <tbody>
                  {filteredResults.map(
                    (result) => {
                      const processing =
                        processingId ===
                        result.id;

                      return (
                        <tr
                          key={
                            result.id
                          }
                          className="border-b border-slate-100 transition duration-200 hover:bg-blue-50/30"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 font-black text-white shadow-lg shadow-indigo-500/20">
                                {result.studentName
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase() ||
                                  "S"}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-black text-slate-800">
                                  {
                                    result.studentName
                                  }
                                </p>

                                <p className="mt-0.5 text-xs font-bold text-indigo-600">
                                  {
                                    result.studentId
                                  }
                                </p>

                                <p className="truncate text-xs text-slate-400">
                                  {
                                    result.email
                                  }
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-bold text-slate-700">
                              {
                                result.examName
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {
                                result.academicYear
                              }
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-bold text-slate-700">
                              {
                                result.subject
                              }
                            </p>

                            <p className="mt-1 text-xs font-semibold text-indigo-500">
                              {
                                result.subjectCode
                              }
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-slate-600">
                              {
                                result.course
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {
                                result.department
                              }
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                            {
                              result.semester
                            }
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-black text-slate-800">
                              {formatNumber(
                                result.marksObtained
                              )}{" "}
                              /{" "}
                              {formatNumber(
                                result.maximumMarks
                              )}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Pass:{" "}
                              {
                                result.passingMarks
                              }
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5">
                              <span className="text-sm font-black text-blue-700">
                                {
                                  result.percentage
                                }%
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <GradeBadge
                              grade={
                                result.grade
                              }
                            />
                          </td>

                          <td className="px-5 py-4">
                            <ResultBadge
                              status={
                                result.resultStatus
                              }
                            />
                          </td>

                          <td className="px-5 py-4">
                            <button
                              type="button"
                              disabled={
                                processing
                              }
                              onClick={() =>
                                void togglePublished(
                                  result
                                )
                              }
                              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                result.published
                                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20 hover:shadow-lg"
                                  : "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 hover:from-slate-200 hover:to-slate-300"
                              }`}
                            >
                              {processing ? (
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              ) : result.published ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5" />
                              )}

                              {result.published
                                ? "Published"
                                : "Unpublished"}
                            </button>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                disabled={
                                  processing
                                }
                                onClick={() =>
                                  openEditForm(
                                    result
                                  )
                                }
                                title="Edit Result"
                                className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                disabled={
                                  processing
                                }
                                onClick={() =>
                                  void handleDelete(
                                    result
                                  )
                                }
                                title="Delete Result"
                                className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {processing ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </button>
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

        {showForm && (
          <ResultModal
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
      </main>
    </PortalShell>
  );
}

/* ============================================================
   COLOR STAT CARD
============================================================ */

function ColorStatCard({
  icon: Icon,
  label,
  value,
  gradient,
  glow,
}: {
  icon: ElementType;
  label: string;
  value: number;
  gradient: string;
  glow: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white p-5 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      <div
        className={`absolute -right-14 -top-14 h-40 w-40 rounded-full ${glow} blur-3xl transition duration-700 group-hover:scale-150`}
      />

      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div
            className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-xl transition duration-500 group-hover:scale-110 group-hover:rotate-3`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
            Live
          </span>
        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-4xl font-black tracking-tight text-slate-900">
          {value.toLocaleString(
            "en-IN"
          )}
        </p>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full w-1/2 rounded-full bg-gradient-to-r ${gradient} transition-all duration-700 group-hover:w-full`}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SUMMARY CARD
============================================================ */

function SummaryColorCard({
  icon: Icon,
  title,
  value,
  description,
  gradient,
}: {
  icon: ElementType;
  title: string;
  value: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl">
      <div
        className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-3xl transition group-hover:scale-150`}
      />

      <div className="relative flex items-center gap-4">
        <div
          className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
            {title}
          </p>

          <p className="mt-1 text-3xl font-black text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   BAR CHART ICON
============================================================ */

function BarChartIcon() {
  return (
    <div className="flex items-end gap-1">
      <span className="h-3 w-1.5 rounded-t bg-current" />
      <span className="h-5 w-1.5 rounded-t bg-current" />
      <span className="h-7 w-1.5 rounded-t bg-current" />
    </div>
  );
}

/* ============================================================
   FILTER SELECT
============================================================ */

function FilterSelect({
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
      <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      >
        <option value="all">
          All {label}s
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
    </div>
  );
}

/* ============================================================
   FILTER BUTTON
============================================================ */

function FilterButton({
  active,
  onClick,
  children,
  activeClass = "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  activeClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-xs font-black shadow-sm transition ${
        active
          ? activeClass
          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

/* ============================================================
   GRADE BADGE
============================================================ */

function GradeBadge({
  grade,
}: {
  grade: string;
}) {
  const styles: Record<
    string,
    string
  > = {
    "A+":
      "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20",

    A:
      "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/20",

    "B+":
      "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/20",

    B:
      "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-indigo-500/20",

    C:
      "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-orange-500/20",

    D:
      "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-500/20",

    F:
      "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/20",
  };

  return (
    <span
      className={`inline-flex min-w-11 items-center justify-center rounded-xl px-3 py-1.5 text-xs font-black shadow-lg ${
        styles[grade] ??
        "bg-slate-500 text-white"
      }`}
    >
      {grade}
    </span>
  );
}

/* ============================================================
   RESULT BADGE
============================================================ */

function ResultBadge({
  status,
}: {
  status: ResultStatus;
}) {
  if (status === "Pass") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1.5 text-xs font-black text-white shadow-md shadow-emerald-500/20">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Pass
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-3 py-1.5 text-xs font-black text-white shadow-md shadow-red-500/20">
      <XCircle className="h-3.5 w-3.5" />
      Fail
    </span>
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
      className={`px-5 py-4 text-${align} text-[10px] font-black uppercase tracking-[0.16em] text-white/80`}
    >
      {children}
    </th>
  );
}

/* ============================================================
   MESSAGE BOX
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
      className={`rounded-2xl border p-4 shadow-sm ${
        isError
          ? "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
          : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {isError ? (
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
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
                ? "Result operation failed"
                : "Success"}
            </p>

            <p
              className={`mt-1 text-sm leading-6 ${
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
          className={
            isError
              ? "text-red-500 hover:text-red-700"
              : "text-emerald-600 hover:text-emerald-800"
          }
          aria-label="Close"
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

                <div className="mt-3 h-3 w-48 rounded bg-slate-100" />
              </div>

              <div className="hidden h-8 w-24 rounded bg-slate-100 md:block" />

              <div className="hidden h-8 w-20 rounded bg-slate-100 md:block" />
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
  onClear,
}: {
  hasFilters: boolean;
  onAdd: () => void;
  onClear: () => void;
}) {
  return (
    <div className="p-14 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600">
        <Trophy className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-800">
        {hasFilters
          ? "No matching results"
          : "No result records yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasFilters
          ? "Try changing the filters or search term."
          : "Add your first student examination result to begin managing academic results."}
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Clear Filters
          </button>
        )}

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Plus className="h-4 w-4" />
          Add Result
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   RESULT MODAL
============================================================ */

function ResultModal({
  form,
  setForm,
  editing,
  saving,
  onClose,
  onSubmit,
}: {
  form: ResultForm;
  setForm: Dispatch<
    SetStateAction<ResultForm>
  >;
  editing: boolean;
  saving: boolean;
  onClose: () => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
}) {
  const maximumMarks =
    Number(
      form.maximumMarks
    );

  const marksObtained =
    Number(
      form.marksObtained
    );

  const passingMarks =
    Number(
      form.passingMarks
    );

  const previewPercentage =
    Number.isFinite(
      maximumMarks
    ) &&
    maximumMarks > 0 &&
    Number.isFinite(
      marksObtained
    )
      ? calculatePercentage(
          marksObtained,
          maximumMarks
        )
      : 0;

  const previewGrade =
    calculateGrade(
      previewPercentage
    );

  const previewStatus =
    Number.isFinite(
      marksObtained
    ) &&
    Number.isFinite(
      passingMarks
    )
      ? calculateResultStatus(
          marksObtained,
          passingMarks
        )
      : "Fail";

  function updateField(
    field: keyof ResultForm,
    value: string
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-20 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-500" />

        <div className="sticky top-1 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-indigo-600">
              Academic Results
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-900">
              {editing
                ? "Edit Result"
                : "Add Result"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Percentage, grade and result status are calculated automatically.
            </p>
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
          onSubmit={
            onSubmit
          }
          className="space-y-6 p-6"
        >
          <FormSection
            icon={User}
            iconClass="bg-blue-50 text-blue-600"
            title="Student Information"
            description="Official student identity and academic details."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Student Name *"
                value={
                  form.studentName
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "studentName",
                    value
                  )
                }
                placeholder="Student full name"
              />

              <Input
                label="Student ID / College UID *"
                value={
                  form.studentId
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "studentId",
                    value
                  )
                }
                placeholder="College student ID"
              />

              <Input
                label="Student UID"
                value={
                  form.studentUid
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "studentUid",
                    value
                  )
                }
                placeholder="Internal user UID"
              />

              <Input
                label="Gmail *"
                type="email"
                value={
                  form.email
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "email",
                    value
                  )
                }
                placeholder="student@gmail.com"
              />

              <Input
                label="Course *"
                value={
                  form.course
                }
                onChange={(
                  value
                ) =>
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
                onChange={(
                  value
                ) =>
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
                onChange={(
                  value
                ) =>
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
                onChange={(
                  value
                ) =>
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
            icon={BookOpen}
            iconClass="bg-violet-50 text-violet-600"
            title="Examination Details"
            description="Examination and subject information."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Exam ID"
                value={
                  form.examId
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "examId",
                    value
                  )
                }
                placeholder="EXAM001"
              />

              <Input
                label="Exam Name *"
                value={
                  form.examName
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "examName",
                    value
                  )
                }
                placeholder="Semester II Examination"
              />

              <Input
                label="Subject *"
                value={
                  form.subject
                }
                onChange={(
                  value
                ) =>
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
                onChange={(
                  value
                ) =>
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
            icon={Trophy}
            iconClass="bg-emerald-50 text-emerald-600"
            title="Marks & Performance"
            description="Enter marks and review the automatic calculation."
          >
            <div className="grid gap-5 sm:grid-cols-3">
              <NumberInput
                label="Maximum Marks *"
                value={
                  form.maximumMarks
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "maximumMarks",
                    value
                  )
                }
                min="1"
              />

              <NumberInput
                label="Marks Obtained *"
                value={
                  form.marksObtained
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "marksObtained",
                    value
                  )
                }
                min="0"
                max={
                  Number.isFinite(
                    maximumMarks
                  )
                    ? String(
                        maximumMarks
                      )
                    : undefined
                }
                step="0.01"
              />

              <NumberInput
                label="Passing Marks *"
                value={
                  form.passingMarks
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "passingMarks",
                    value
                  )
                }
                min="0"
                max={
                  Number.isFinite(
                    maximumMarks
                  )
                    ? String(
                        maximumMarks
                      )
                    : undefined
                }
                step="0.01"
              />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <PreviewCard
                label="Percentage"
                value={`${previewPercentage}%`}
                className="border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700"
              />

              <PreviewCard
                label="Grade"
                value={
                  previewGrade
                }
                className="border border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50 text-violet-700"
              />

              <PreviewCard
                label="Result Status"
                value={
                  previewStatus
                }
                className={
                  previewStatus ===
                  "Pass"
                    ? "border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700"
                    : "border border-red-100 bg-gradient-to-br from-red-50 to-rose-50 text-red-700"
                }
              />
            </div>
          </FormSection>

          <section>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Remarks
            </label>

            <textarea
              value={
                form.remarks
              }
              onChange={(
                event
              ) =>
                updateField(
                  "remarks",
                  event.target
                    .value
                )
              }
              rows={4}
              placeholder="Optional remarks about the result..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-slate-900">
                  Publish Result
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Published results can be displayed to students in their result portal.
                </p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  setForm(
                    (current) => ({
                      ...current,
                      published:
                        !current.published,
                    })
                  )
                }
                className={`relative h-7 w-12 rounded-full transition ${
                  form.published
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                    : "bg-slate-300"
                }`}
                aria-label="Toggle published"
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                    form.published
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                onClose
              }
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && (
                <RefreshCw className="h-4 w-4 animate-spin" />
              )}

              {editing
                ? "Update Result"
                : "Save Result"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   FORM SECTION
============================================================ */

function FormSection({
  icon: Icon,
  iconClass,
  title,
  description,
  children,
}: {
  icon: ElementType;
  iconClass: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
      <div className="mb-5 flex items-center gap-3">
        <div
          className={`grid h-10 w-10 place-items-center rounded-xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-black text-slate-900">
            {title}
          </h3>

          <p className="text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

/* ============================================================
   PREVIEW CARD
============================================================ */

function PreviewCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className: string;
}) {
  return (
    <div
      className={`rounded-2xl p-4 ${className}`}
    >
      <p className="text-[10px] font-black uppercase tracking-wider opacity-70">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black">
        {value}
      </p>
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
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      />
    </div>
  );
}

/* ============================================================
   NUMBER INPUT
============================================================ */

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  min?: string;
  max?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        min={min}
        max={max}
        step={step}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      />
    </div>
  );
}

/* ============================================================
   UNIQUE VALUES
============================================================ */

function uniqueValues(
  values: string[]
): string[] {
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