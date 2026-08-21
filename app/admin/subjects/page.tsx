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
  BookOpen,
  CheckCircle2,
  Eye,
  Filter,
  GraduationCap,
  Layers3,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";

/*
============================================================
TYPES
============================================================
*/

type SubjectStatus =
  | "Active"
  | "Inactive";

type SubjectType =
  | "Core"
  | "Elective"
  | "Practical"
  | "Language"
  | "Skill Enhancement"
  | "Project"
  | "Other";

type Subject = {
  id: string;
  subjectCode: string;
  subjectName: string;
  course: string;
  department: string;
  semester: string;
  subjectType: SubjectType;
  credits: number;
  faculty: string;
  facultyId: string;
  academicYear: string;
  status: SubjectStatus;
  description: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

type SubjectForm = {
  subjectCode: string;
  subjectName: string;
  course: string;
  department: string;
  semester: string;
  subjectType: SubjectType;
  credits: string;
  faculty: string;
  facultyId: string;
  academicYear: string;
  status: SubjectStatus;
  description: string;
};

const emptyForm: SubjectForm = {
  subjectCode: "",
  subjectName: "",
  course: "",
  department: "",
  semester: "",
  subjectType: "Core",
  credits: "3",
  faculty: "",
  facultyId: "",
  academicYear: "",
  status: "Active",
  description: "",
};

const subjectTypes: SubjectType[] = [
  "Core",
  "Elective",
  "Practical",
  "Language",
  "Skill Enhancement",
  "Project",
  "Other",
];

const semesters = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
];

/*
============================================================
PAGE
============================================================
*/

export default function SubjectsPage() {
  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [form, setForm] =
    useState<SubjectForm>({
      ...emptyForm,
    });

  const [search, setSearch] =
    useState("");

  const [courseFilter, setCourseFilter] =
    useState("All");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [semesterFilter, setSemesterFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

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

  const [showDetails, setShowDetails] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [viewingSubject, setViewingSubject] =
    useState<Subject | null>(null);

  /*
  ==========================================================
  REAL-TIME FIRESTORE
  ==========================================================
  */

  useEffect(() => {
    const db = firestoreDb;

    if (!db) {
      setError(
        "Firestore is not initialized."
      );

      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const unsubscribe = onSnapshot(
      collection(db, "subjects"),
      (snapshot) => {
        const records: Subject[] =
          snapshot.docs.map((item) => {
            const data =
              item.data();

            const rawSubjectType =
              String(
                data.subjectType ??
                  "Core"
              ) as SubjectType;

            const subjectType =
              subjectTypes.includes(
                rawSubjectType
              )
                ? rawSubjectType
                : "Other";

            const rawStatus =
              String(
                data.status ??
                  "Active"
              ) as SubjectStatus;

            const status: SubjectStatus =
              rawStatus ===
              "Inactive"
                ? "Inactive"
                : "Active";

            return {
              id: item.id,

              subjectCode: String(
                data.subjectCode ?? ""
              ),

              subjectName: String(
                data.subjectName ?? ""
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

              subjectType,

              credits: Number(
                data.credits ?? 0
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

              status,

              description: String(
                data.description ?? ""
              ),

              createdAt:
                data.createdAt,

              updatedAt:
                data.updatedAt,
            };
          });

        records.sort((a, b) =>
          a.subjectName.localeCompare(
            b.subjectName
          )
        );

        setSubjects(records);
        setLoading(false);
        setError("");
      },
      (listenerError) => {
        console.error(
          "Subjects realtime listener error:",
          listenerError
        );

        setError(
          listenerError instanceof Error
            ? listenerError.message
            : "Unable to load subjects."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /*
  ==========================================================
  FILTER OPTIONS
  ==========================================================
  */

  const courseOptions = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          subjects
            .map((subject) =>
              subject.course.trim()
            )
            .filter(Boolean)
        )
      ).sort(),
    ],
    [subjects]
  );

  const departmentOptions = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          subjects
            .map((subject) =>
              subject.department.trim()
            )
            .filter(Boolean)
        )
      ).sort(),
    ],
    [subjects]
  );

  const semesterOptions = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          subjects
            .map((subject) =>
              subject.semester.trim()
            )
            .filter(Boolean)
        )
      ).sort(),
    ],
    [subjects]
  );

  /*
  ==========================================================
  FILTERED SUBJECTS
  ==========================================================
  */

  const filteredSubjects =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      return subjects.filter(
        (subject) => {
          const matchesSearch =
            !term ||
            [
              subject.subjectCode,
              subject.subjectName,
              subject.course,
              subject.department,
              subject.semester,
              subject.subjectType,
              subject.faculty,
              subject.facultyId,
              subject.academicYear,
              subject.status,
              subject.description,
            ]
              .join(" ")
              .toLowerCase()
              .includes(term);

          const matchesCourse =
            courseFilter === "All" ||
            subject.course ===
              courseFilter;

          const matchesDepartment =
            departmentFilter ===
              "All" ||
            subject.department ===
              departmentFilter;

          const matchesSemester =
            semesterFilter ===
              "All" ||
            subject.semester ===
              semesterFilter;

          const matchesStatus =
            statusFilter ===
              "All" ||
            subject.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesCourse &&
            matchesDepartment &&
            matchesSemester &&
            matchesStatus
          );
        }
      );
    }, [
      subjects,
      search,
      courseFilter,
      departmentFilter,
      semesterFilter,
      statusFilter,
    ]);

  /*
  ==========================================================
  STATISTICS
  ==========================================================
  */

  const totalSubjects =
    subjects.length;

  const activeSubjects =
    subjects.filter(
      (subject) =>
        subject.status ===
        "Active"
    ).length;

  const inactiveSubjects =
    subjects.filter(
      (subject) =>
        subject.status ===
        "Inactive"
    ).length;

  const totalCredits =
    subjects.reduce(
      (sum, subject) =>
        sum +
        (Number.isFinite(
          subject.credits
        )
          ? subject.credits
          : 0),
      0
    );

  /*
  ==========================================================
  FORM HELPERS
  ==========================================================
  */

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
    subject: Subject
  ) {
    setEditingId(subject.id);

    setForm({
      subjectCode:
        subject.subjectCode,

      subjectName:
        subject.subjectName,

      course:
        subject.course,

      department:
        subject.department,

      semester:
        subject.semester,

      subjectType:
        subject.subjectType,

      credits:
        String(subject.credits),

      faculty:
        subject.faculty,

      facultyId:
        subject.facultyId,

      academicYear:
        subject.academicYear,

      status:
        subject.status,

      description:
        subject.description,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingId(null);

    setForm({
      ...emptyForm,
    });
  }

  function openDetails(
    subject: Subject
  ) {
    setViewingSubject(subject);
    setShowDetails(true);
  }

  function closeDetails() {
    setShowDetails(false);
    setViewingSubject(null);
  }

  function clearFilters() {
    setSearch("");
    setCourseFilter("All");
    setDepartmentFilter("All");
    setSemesterFilter("All");
    setStatusFilter("All");
  }

  /*
  ==========================================================
  SAVE SUBJECT
  ==========================================================
  */

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

    setError("");
    setSuccess("");

    const subjectCode =
      form.subjectCode
        .trim()
        .toUpperCase();

    const subjectName =
      form.subjectName.trim();

    const course =
      form.course.trim();

    const department =
      form.department.trim();

    const semester =
      form.semester.trim();

    const credits =
      Number(form.credits);

    const academicYear =
      form.academicYear.trim();

    const faculty =
      form.faculty.trim();

    const facultyId =
      form.facultyId.trim();

    const description =
      form.description.trim();

    if (!subjectCode) {
      setError(
        "Subject code is required."
      );
      return;
    }

    if (subjectCode.length < 2) {
      setError(
        "Please enter a valid subject code."
      );
      return;
    }

    if (!subjectName) {
      setError(
        "Subject name is required."
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

    if (
      !Number.isFinite(
        credits
      ) ||
      credits < 0 ||
      credits > 20
    ) {
      setError(
        "Credits must be between 0 and 20."
      );
      return;
    }

    if (!academicYear) {
      setError(
        "Academic year is required."
      );
      return;
    }

    try {
      setSaving(true);

      const subjectData = {
        subjectCode,
        subjectName,
        course,
        department,
        semester,
        subjectType:
          form.subjectType,
        credits,
        faculty,
        facultyId,
        academicYear,
        status: form.status,
        description,
        updatedAt:
          serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(
          doc(
            db,
            "subjects",
            editingId
          ),
          subjectData
        );

        setSuccess(
          `${subjectName} was updated successfully.`
        );
      } else {
        await addDoc(
          collection(
            db,
            "subjects"
          ),
          {
            ...subjectData,
            createdAt:
              serverTimestamp(),
          }
        );

        setSuccess(
          `${subjectName} was added successfully.`
        );
      }

      setShowForm(false);
      setEditingId(null);

      setForm({
        ...emptyForm,
      });
    } catch (saveError) {
      console.error(
        "Subject save error:",
        saveError
      );

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save subject."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  ==========================================================
  DELETE SUBJECT
  ==========================================================
  */

  async function handleDelete(
    subject: Subject
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
        `Delete subject "${subject.subjectName}" (${subject.subjectCode})?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(subject.id);
      setError("");
      setSuccess("");

      await deleteDoc(
        doc(
          db,
          "subjects",
          subject.id
        )
      );

      setSuccess(
        `${subject.subjectName} was deleted successfully.`
      );
    } catch (deleteError) {
      console.error(
        "Subject delete error:",
        deleteError
      );

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete subject."
      );
    } finally {
      setDeletingId(null);
    }
  }

  /*
  ==========================================================
  RENDER
  ==========================================================
  */

  return (
    <PortalShell
      role="admin"
      title="Subjects"
    >
      <main className="space-y-8 pb-10">

        <PageHeading
          eyebrow="Academic administration"
          title="Subject Management"
          description="Create, manage and monitor subjects across courses, departments and semesters in real time."
        />

        {/* LIVE STATUS */}

        <div className="flex flex-wrap items-center gap-3">

          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-blue-700 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-blue-500" />
            </span>
            Real-time subjects
          </span>

          <span className="text-xs font-semibold text-slate-400">
            Subject changes appear automatically from Firestore.
          </span>

        </div>

        {/* ERROR */}

        {error && (
          <AlertBox
            type="error"
            message={error}
            onClose={() =>
              setError("")
            }
          />
        )}

        {/* SUCCESS */}

        {success && (
          <AlertBox
            type="success"
            message={success}
            onClose={() =>
              setSuccess("")
            }
          />
        )}

        {/* STATISTICS */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <ColorStatCard
            label="Total Subjects"
            value={
              totalSubjects
            }
            icon={BookOpen}
            iconClass="bg-blue-100 text-blue-700"
            glow="bg-blue-500/10"
            progress="from-blue-500 to-cyan-400"
          />

          <ColorStatCard
            label="Active Subjects"
            value={
              activeSubjects
            }
            icon={CheckCircle2}
            iconClass="bg-emerald-100 text-emerald-700"
            glow="bg-emerald-500/10"
            progress="from-emerald-500 to-teal-400"
          />

          <ColorStatCard
            label="Inactive Subjects"
            value={
              inactiveSubjects
            }
            icon={XCircle}
            iconClass="bg-red-100 text-red-700"
            glow="bg-red-500/10"
            progress="from-red-500 to-orange-400"
          />

          <ColorStatCard
            label="Total Credits"
            value={totalCredits}
            icon={GraduationCap}
            iconClass="bg-violet-100 text-violet-700"
            glow="bg-violet-500/10"
            progress="from-violet-500 to-purple-400"
          />

        </section>

        {/* SEARCH & FILTERS */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-blue-500" />
                  </span>

                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                    Live database
                  </span>

                </div>

                <h2 className="mt-1 text-xl font-black text-[var(--navy)]">
                  Subject Records
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredSubjects.length} of{" "}
                  {subjects.length} subjects shown
                </p>

              </div>

              <button
                type="button"
                onClick={
                  openAddForm
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                Add Subject
              </button>

            </div>

            <div className="grid gap-3 xl:grid-cols-[1.5fr_repeat(4,1fr)_auto]">

              {/* SEARCH */}

              <div className="relative">

                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search subject, code, faculty..."
                  aria-label="Search subjects"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

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
                onChange={
                  setStatusFilter
                }
                options={[
                  "All",
                  "Active",
                  "Inactive",
                ]}
                placeholder="Status"
              />

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <RefreshCw className="h-4 w-4" />
                Clear
              </button>

            </div>

          </div>

        </section>

        {/* TABLE */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {loading ? (
            <LoadingState />
          ) : filteredSubjects.length ===
            0 ? (
            <EmptyState
              hasSubjects={
                subjects.length >
                0
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

              <table className="w-full min-w-[1300px]">

                <thead>
                  <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-blue-50/40 to-violet-50/30">

                    <TableHeader>
                      Subject
                    </TableHeader>

                    <TableHeader>
                      Code
                    </TableHeader>

                    <TableHeader>
                      Course
                    </TableHeader>

                    <TableHeader>
                      Department
                    </TableHeader>

                    <TableHeader>
                      Semester
                    </TableHeader>

                    <TableHeader>
                      Type
                    </TableHeader>

                    <TableHeader>
                      Credits
                    </TableHeader>

                    <TableHeader>
                      Faculty
                    </TableHeader>

                    <TableHeader>
                      Academic Year
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

                  {filteredSubjects.map(
                    (subject) => {
                      const deleting =
                        deletingId ===
                        subject.id;

                      return (
                        <tr
                          key={
                            subject.id
                          }
                          className="border-b border-slate-100 transition hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-white hover:to-violet-50/30"
                        >

                          {/* SUBJECT */}

                          <td className="px-5 py-4">

                            <div className="flex min-w-[230px] items-center gap-3">

                              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 shadow-sm">
                                <BookOpen className="h-5 w-5" />
                              </div>

                              <div className="min-w-0">

                                <p className="truncate font-black text-slate-800">
                                  {subject.subjectName ||
                                    "Unnamed Subject"}
                                </p>

                                {subject.description && (
                                  <p className="mt-1 max-w-[260px] truncate text-xs text-slate-400">
                                    {
                                      subject.description
                                    }
                                  </p>
                                )}

                              </div>

                            </div>

                          </td>

                          {/* CODE */}

                          <td className="px-5 py-4">

                            <span className="inline-flex rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-1.5 text-xs font-black text-blue-700">
                              {subject.subjectCode ||
                                "—"}
                            </span>

                          </td>

                          {/* COURSE */}

                          <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                            {subject.course ||
                              "—"}
                          </td>

                          {/* DEPARTMENT */}

                          <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                            {subject.department ||
                              "—"}
                          </td>

                          {/* SEMESTER */}

                          <td className="px-5 py-4">

                            <span className="inline-flex rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                              {subject.semester ||
                                "—"}
                            </span>

                          </td>

                          {/* TYPE */}

                          <td className="px-5 py-4">

                            <SubjectTypeBadge
                              type={
                                subject.subjectType
                              }
                            />

                          </td>

                          {/* CREDITS */}

                          <td className="px-5 py-4">

                            <span className="inline-flex min-w-9 justify-center rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-black text-amber-700">
                              {subject.credits}
                            </span>

                          </td>

                          {/* FACULTY */}

                          <td className="px-5 py-4">

                            <div className="min-w-[150px]">

                              <p className="text-sm font-bold text-slate-700">
                                {subject.faculty ||
                                  "Not assigned"}
                              </p>

                              {subject.facultyId && (
                                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                                  {
                                    subject.facultyId
                                  }
                                </p>
                              )}

                            </div>

                          </td>

                          {/* ACADEMIC YEAR */}

                          <td className="px-5 py-4">

                            <span className="inline-flex rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700">
                              {subject.academicYear ||
                                "—"}
                            </span>

                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">

                            <StatusBadge
                              status={
                                subject.status
                              }
                            />

                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-2">

                              <ActionButton
                                title="View subject"
                                onClick={() =>
                                  openDetails(
                                    subject
                                  )
                                }
                                className="bg-slate-50 text-slate-600 hover:bg-slate-100"
                              >
                                <Eye className="h-4 w-4" />
                              </ActionButton>

                              <ActionButton
                                title="Edit subject"
                                onClick={() =>
                                  openEditForm(
                                    subject
                                  )
                                }
                                disabled={
                                  deleting
                                }
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                              >
                                <Pencil className="h-4 w-4" />
                              </ActionButton>

                              <ActionButton
                                title="Delete subject"
                                onClick={() =>
                                  void handleDelete(
                                    subject
                                  )
                                }
                                disabled={
                                  deleting
                                }
                                className="bg-red-50 text-red-600 hover:bg-red-100"
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

        {/* ADD / EDIT MODAL */}

        {showForm && (
          <SubjectModal
            form={form}
            setForm={setForm}
            editing={
              Boolean(editingId)
            }
            saving={saving}
            onClose={
              closeForm
            }
            onSubmit={
              handleSubmit
            }
          />
        )}

        {/* DETAILS MODAL */}

        {showDetails &&
          viewingSubject && (
            <SubjectDetailsModal
              subject={
                viewingSubject
              }
              onClose={
                closeDetails
              }
              onEdit={() => {
                closeDetails();
                openEditForm(
                  viewingSubject
                );
              }}
            />
          )}

      </main>
    </PortalShell>
  );
}

/*
============================================================
COLOR STAT CARD
============================================================
*/

function ColorStatCard({
  label,
  value,
  icon: Icon,
  iconClass,
  glow,
  progress,
}: {
  label: string;
  value: number;
  icon: ElementType;
  iconClass: string;
  glow: string;
  progress: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition duration-500 group-hover:scale-150 ${glow}`}
      />

      <div className="relative">

        <div
          className={`grid h-12 w-12 place-items-center rounded-2xl shadow-sm transition duration-300 group-hover:scale-110 ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <p className="mt-4 text-xs font-black uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-3xl font-black tracking-tight text-[var(--navy)]">
          {value.toLocaleString()}
        </p>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full w-1/2 rounded-full bg-gradient-to-r transition-all duration-700 group-hover:w-full ${progress}`}
          />
        </div>

      </div>
    </div>
  );
}

/*
============================================================
FILTER SELECT
============================================================
*/

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
    <div className="relative">

      <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        aria-label={
          placeholder
        }
        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm font-semibold text-slate-700 outline-none transition hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option ===
              "All"
                ? `All ${placeholder.toLowerCase()}s`
                : option}
            </option>
          )
        )}
      </select>

      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
        ▾
      </div>

    </div>
  );
}

/*
============================================================
TABLE HEADER
============================================================
*/

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

/*
============================================================
STATUS BADGE
============================================================
*/

function StatusBadge({
  status,
}: {
  status: SubjectStatus;
}) {
  if (
    status === "Active"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1 text-xs font-black text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      Inactive
    </span>
  );
}

/*
============================================================
SUBJECT TYPE BADGE
============================================================
*/

function SubjectTypeBadge({
  type,
}: {
  type: SubjectType;
}) {
  const classes: Record<
    SubjectType,
    string
  > = {
    Core:
      "border-blue-200 bg-blue-50 text-blue-700",

    Elective:
      "border-purple-200 bg-purple-50 text-purple-700",

    Practical:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    Language:
      "border-amber-200 bg-amber-50 text-amber-700",

    "Skill Enhancement":
      "border-cyan-200 bg-cyan-50 text-cyan-700",

    Project:
      "border-pink-200 bg-pink-50 text-pink-700",

    Other:
      "border-slate-200 bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${classes[type]}`}
    >
      {type}
    </span>
  );
}

/*
============================================================
ACTION BUTTON
============================================================
*/

function ActionButton({
  title,
  onClick,
  disabled,
  className,
  children,
}: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-9 w-9 place-items-center rounded-xl border border-transparent transition hover:-translate-y-0.5 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

/*
============================================================
ALERT
============================================================
*/

function AlertBox({
  type,
  message,
  onClose,
}: {
  type:
    | "error"
    | "success";
  message: string;
  onClose: () => void;
}) {
  const isSuccess =
    type === "success";

  return (
    <div
      className={`rounded-2xl border p-4 ${
        isSuccess
          ? "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50"
          : "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
      }`}
      role={
        isSuccess
          ? "status"
          : "alert"
      }
    >
      <div className="flex items-start gap-3">

        {isSuccess ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        ) : (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        )}

        <p
          className={`min-w-0 flex-1 text-sm font-bold ${
            isSuccess
              ? "text-emerald-800"
              : "text-red-800"
          }`}
        >
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className={`rounded-lg p-1 ${
            isSuccess
              ? "text-emerald-600 hover:bg-emerald-100"
              : "text-red-600 hover:bg-red-100"
          }`}
          aria-label="Close message"
        >
          <X className="h-4 w-4" />
        </button>

      </div>
    </div>
  );
}

/*
============================================================
LOADING
============================================================
*/

function LoadingState() {
  return (
    <div
      className="divide-y divide-slate-100"
      aria-busy="true"
      aria-label="Loading subjects"
    >
      {[
        1,
        2,
        3,
        4,
        5,
      ].map((item) => (
        <div
          key={item}
          className="p-5"
        >
          <div className="flex items-center gap-4">

            <div className="h-11 w-11 animate-pulse rounded-2xl bg-gradient-to-br from-blue-100 to-slate-100" />

            <div className="flex-1 space-y-2">

              <div className="h-4 w-56 animate-pulse rounded bg-slate-200" />

              <div className="h-3 w-80 max-w-full animate-pulse rounded bg-slate-100" />

            </div>

            <div className="hidden h-8 w-24 animate-pulse rounded-full bg-slate-100 sm:block" />

            <div className="hidden h-9 w-28 animate-pulse rounded-xl bg-slate-100 md:block" />

          </div>
        </div>
      ))}
    </div>
  );
}

/*
============================================================
EMPTY STATE
============================================================
*/

function EmptyState({
  hasSubjects,
  onAdd,
  onClear,
}: {
  hasSubjects: boolean;
  onAdd: () => void;
  onClear: () => void;
}) {
  return (
    <div className="p-14 text-center">

      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600">
        <Layers3 className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-xl font-black text-[var(--navy)]">
        {hasSubjects
          ? "No matching subjects"
          : "No subjects yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasSubjects
          ? "No subject matches your current search or filters."
          : "Create your first subject to start managing the academic subject database."}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">

        {hasSubjects && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </button>
        )}

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Plus className="h-4 w-4" />
          Add Subject
        </button>

      </div>
    </div>
  );
}

/*
============================================================
SUBJECT MODAL
============================================================
*/

function SubjectModal({
  form,
  setForm,
  editing,
  saving,
  onClose,
  onSubmit,
}: {
  form: SubjectForm;
  setForm: Dispatch<
    SetStateAction<SubjectForm>
  >;
  editing: boolean;
  saving: boolean;
  onClose: () => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subject-modal-title"
    >
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">

          <div>

            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700">
              <BookOpen className="h-3.5 w-3.5" />
              Academic Subject
            </div>

            <h2
              id="subject-modal-title"
              className="text-xl font-black text-slate-900"
            >
              {editing
                ? "Edit Subject"
                : "Add Subject"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editing
                ? "Update the subject information."
                : "Create a new subject record in Firestore."}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close subject form"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={onSubmit}
          className="space-y-6 p-6"
        >

          {/* BASIC */}

          <div>

            <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-slate-400">
              Subject Information
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">

              <Input
                label="Subject Code *"
                value={
                  form.subjectCode
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (current) => ({
                      ...current,
                      subjectCode:
                        value
                          .toUpperCase()
                          .replace(
                            /\s/g,
                            ""
                          ),
                    })
                  )
                }
                placeholder="BCA201"
              />

              <Input
                label="Subject Name *"
                value={
                  form.subjectName
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (current) => ({
                      ...current,
                      subjectName:
                        value,
                    })
                  )
                }
                placeholder="Data Structures"
              />

              <Input
                label="Course *"
                value={
                  form.course
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (current) => ({
                      ...current,
                      course:
                        value,
                    })
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
                  setForm(
                    (current) => ({
                      ...current,
                      department:
                        value,
                    })
                  )
                }
                placeholder="Computer Applications"
              />

              <SelectInput
                label="Semester *"
                value={
                  form.semester
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (current) => ({
                      ...current,
                      semester:
                        value,
                    })
                  )
                }
                options={
                  semesters
                }
                placeholder="Select semester"
              />

              <SelectInput
                label="Subject Type *"
                value={
                  form.subjectType
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (current) => ({
                      ...current,
                      subjectType:
                        value as SubjectType,
                    })
                  )
                }
                options={
                  subjectTypes
                }
                placeholder="Select subject type"
              />

              <Input
                label="Credits *"
                value={
                  form.credits
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (current) => ({
                      ...current,
                      credits:
                        value
                          .replace(
                            /[^\d.]/g,
                            ""
                          )
                          .slice(
                            0,
                            4
                          ),
                    })
                  )
                }
                placeholder="3"
                type="number"
                min="0"
                max="20"
              />

              <Input
                label="Academic Year *"
                value={
                  form.academicYear
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (current) => ({
                      ...current,
                      academicYear:
                        value,
                    })
                  )
                }
                placeholder="2026-27"
              />

            </div>

          </div>

          {/* FACULTY */}

          <div>

            <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-slate-400">
              Faculty Assignment
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">

              <Input
                label="Faculty"
                value={
                  form.faculty
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (current) => ({
                      ...current,
                      faculty:
                        value,
                    })
                  )
                }
                placeholder="Faculty Name"
              />

              <Input
                label="Faculty ID"
                value={
                  form.facultyId
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (current) => ({
                      ...current,
                      facultyId:
                        value,
                    })
                  )
                }
                placeholder="FAC001"
              />

              <div>
                <label
                  htmlFor="subject-status"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Status
                </label>

                <select
                  id="subject-status"
                  value={
                    form.status
                  }
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (current) => ({
                        ...current,
                        status:
                          event
                            .target
                            .value as SubjectStatus,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div>

            <label
              htmlFor="subject-description"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Description
            </label>

            <textarea
              id="subject-description"
              value={
                form.description
              }
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    description:
                      event.target
                        .value,
                  })
                )
              }
              rows={5}
              placeholder="Enter subject description..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />

          </div>

          {/* BUTTONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {editing
                    ? "Update Subject"
                    : "Save Subject"}
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

/*
============================================================
DETAILS MODAL
============================================================
*/

function SubjectDetailsModal({
  subject,
  onClose,
  onEdit,
}: {
  subject: Subject;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subject-details-title"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-white via-blue-50/40 to-violet-50/30 px-6 py-5">

          <div>

            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700">
              <Eye className="h-3.5 w-3.5" />
              Subject Details
            </div>

            <h2
              id="subject-details-title"
              className="text-xl font-black text-slate-900"
            >
              {subject.subjectName ||
                "Subject"}
            </h2>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        <div className="space-y-6 p-6">

          <div className="flex flex-wrap items-center gap-2">

            <span className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700">
              {subject.subjectCode ||
                "No code"}
            </span>

            <SubjectTypeBadge
              type={
                subject.subjectType
              }
            />

            <StatusBadge
              status={
                subject.status
              }
            />

          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <DetailBox
              label="Course"
              value={
                subject.course
              }
            />

            <DetailBox
              label="Department"
              value={
                subject.department
              }
            />

            <DetailBox
              label="Semester"
              value={
                subject.semester
              }
            />

            <DetailBox
              label="Credits"
              value={String(
                subject.credits
              )}
            />

            <DetailBox
              label="Faculty"
              value={
                subject.faculty ||
                "Not assigned"
              }
            />

            <DetailBox
              label="Faculty ID"
              value={
                subject.facultyId ||
                "Not assigned"
              }
            />

            <DetailBox
              label="Academic Year"
              value={
                subject.academicYear ||
                "Not assigned"
              }
            />

            <DetailBox
              label="Status"
              value={
                subject.status
              }
            />

          </div>

          <div>

            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              Description
            </p>

            <div className="mt-2 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
              {subject.description ||
                "No description provided."}
            </div>

          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>

            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Pencil className="h-4 w-4" />
              Edit Subject
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

/*
============================================================
DETAIL BOX
============================================================
*/

function DetailBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">

      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-bold text-slate-700">
        {value || "Not provided"}
      </p>

    </div>
  );
}

/*
============================================================
INPUT
============================================================
*/

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  type?: string;
  min?: string;
  max?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        min={min}
        max={max}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={
          placeholder
        }
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
      />

    </div>
  );
}

/*
============================================================
SELECT INPUT
============================================================
*/

function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  options: string[];
  placeholder: string;
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
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      >
        <option value="">
          {placeholder}
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