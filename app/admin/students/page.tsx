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
  CheckCircle2,
  Edit3,
  GraduationCap,
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

/*
============================================================
TYPES
============================================================
*/

type Student = {
  id: string;
  uid?: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  year: string;
  department: string;
  course: string;
  semester: string;
  admissionYear: string;
  status: string;
};

type StudentForm = {
  studentId: string;
  name: string;
  email: string;
  phone: string;
  year: string;
  department: string;
  course: string;
  semester: string;
  admissionYear: string;
  status: string;
};

const emptyForm: StudentForm = {
  studentId: "",
  name: "",
  email: "",
  phone: "",
  year: "",
  department: "",
  course: "",
  semester: "",
  admissionYear: "",
  status: "Active",
};

/*
============================================================
PAGE
============================================================
*/

export default function StudentsPage() {
  const [students, setStudents] =
    useState<Student[]>([]);

  const [form, setForm] =
    useState<StudentForm>({
      ...emptyForm,
    });

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

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

  /*
  ==========================================================
  REAL-TIME FIRESTORE LISTENER
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

    const studentsQuery = query(
      collection(db, "students"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      studentsQuery,
      (snapshot) => {
        const records: Student[] =
          snapshot.docs.map((item) => {
            const data = item.data();

            return {
              id: item.id,

              uid:
                typeof data.uid ===
                "string"
                  ? data.uid
                  : item.id,

              studentId: String(
                data.studentId ??
                  data.registerNumber ??
                  ""
              ),

              name: String(
                data.name ?? ""
              ),

              email: String(
                data.email ?? ""
              ),

              phone: String(
                data.phone ?? ""
              ),

              year: String(
                data.year ?? ""
              ),

              department: String(
                data.department ?? ""
              ),

              course: String(
                data.course ?? ""
              ),

              semester: String(
                data.semester ?? ""
              ),

              admissionYear: String(
                data.admissionYear ?? ""
              ),

              status: String(
                data.status ??
                  "Active"
              ),
            };
          });

        setStudents(records);
        setLoading(false);
        setError("");
      },
      (err) => {
        console.error(
          "Students listener error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load students."
        );

        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  /*
  ==========================================================
  SEARCH
  ==========================================================
  */

  const filteredStudents =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return students;
      }

      return students.filter(
        (student) =>
          [
            student.studentId,
            student.name,
            student.email,
            student.phone,
            student.year,
            student.department,
            student.course,
            student.semester,
            student.admissionYear,
            student.status,
          ]
            .join(" ")
            .toLowerCase()
            .includes(term)
      );
    }, [students, search]);

  /*
  ==========================================================
  STATISTICS
  ==========================================================
  */

  const activeStudents =
    students.filter(
      (student) =>
        student.status
          .trim()
          .toLowerCase() ===
        "active"
    ).length;

  const graduatedStudents =
    students.filter(
      (student) =>
        student.status
          .trim()
          .toLowerCase() ===
        "graduated"
    ).length;

  /*
  ==========================================================
  FORM ACTIONS
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
    student: Student
  ) {
    setEditingId(student.id);

    setForm({
      studentId:
        student.studentId,
      name: student.name,
      email: student.email,
      phone: student.phone,
      year: student.year,
      department:
        student.department,
      course: student.course,
      semester:
        student.semester,
      admissionYear:
        student.admissionYear,
      status: student.status,
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

  /*
  ==========================================================
  SAVE / UPDATE STUDENT
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

    /*
    ----------------------------------------------------------
    VALIDATION
    ----------------------------------------------------------
    */

    if (!form.name.trim()) {
      setError(
        "Student name is required."
      );
      return;
    }

    if (!form.email.trim()) {
      setError(
        "Student email is required."
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (
      form.phone.trim() &&
      !/^[0-9]{10}$/.test(
        form.phone.trim()
      )
    ) {
      setError(
        "Phone number must contain 10 digits."
      );
      return;
    }

    if (!form.department.trim()) {
      setError(
        "Department is required."
      );
      return;
    }

    if (!form.course.trim()) {
      setError(
        "Course is required."
      );
      return;
    }

    if (!form.semester.trim()) {
      setError(
        "Semester is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const studentData = {
        studentId:
          form.studentId
            .trim()
            .toUpperCase(),

        registerNumber:
          form.studentId
            .trim()
            .toUpperCase(),

        name:
          form.name.trim(),

        email:
          form.email
            .trim()
            .toLowerCase(),

        phone:
          form.phone.trim(),

        year:
          form.year.trim(),

        department:
          form.department.trim(),

        course:
          form.course.trim(),

        semester:
          form.semester.trim(),

        admissionYear:
          form.admissionYear.trim(),

        status:
          form.status.trim() ||
          "Active",

        updatedAt:
          serverTimestamp(),
      };

      /*
      ========================================================
      UPDATE
      ========================================================
      */

      if (editingId) {
        await updateDoc(
          doc(
            db,
            "students",
            editingId
          ),
          studentData
        );

        setSuccess(
          "Student updated successfully."
        );
      }

      /*
      ========================================================
      CREATE
      ========================================================
      */

      else {
        await addDoc(
          collection(
            db,
            "students"
          ),
          {
            ...studentData,
            createdAt:
              serverTimestamp(),
          }
        );

        setSuccess(
          "Student added successfully."
        );
      }

      setShowForm(false);
      setEditingId(null);

      setForm({
        ...emptyForm,
      });
    } catch (err) {
      console.error(
        "Student save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save student."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  ==========================================================
  DELETE STUDENT
  ==========================================================
  */

  async function handleDelete(
    student: Student
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
        `Delete student "${student.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        student.id
      );

      setError("");
      setSuccess("");

      await deleteDoc(
        doc(
          db,
          "students",
          student.id
        )
      );

      setSuccess(
        `Student "${student.name}" was deleted successfully.`
      );
    } catch (err) {
      console.error(
        "Student delete error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete student."
      );
    } finally {
      setDeletingId(null);
    }
  }

  /*
  ==========================================================
  CLEAR SEARCH
  ==========================================================
  */

  function clearSearch() {
    setSearch("");
  }

  /*
  ==========================================================
  RENDER
  ==========================================================
  */

  return (
    <PortalShell
      role="admin"
      title="Students"
    >
      <main className="space-y-8 pb-10">

        {/* PAGE HEADER */}

        <PageHeading
          eyebrow="Student administration"
          title="Student Management"
          description="Manage approved student records, enrollment, academic information and student status in real time."
        />

        {/* LIVE STATUS */}

        <div className="flex flex-wrap items-center gap-3">

          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 shadow-sm">

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            Real-time students

          </span>

          <span className="text-xs font-semibold text-slate-400">
            Student records update automatically from Firestore.
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
            label="Total Students"
            value={
              students.length
            }
            icon={Users}
            iconClass="bg-blue-100 text-blue-700"
            glow="bg-blue-500/10"
            progress="from-blue-500 to-cyan-400"
          />

          <ColorStatCard
            label="Active Students"
            value={
              activeStudents
            }
            icon={CheckCircle2}
            iconClass="bg-emerald-100 text-emerald-700"
            glow="bg-emerald-500/10"
            progress="from-emerald-500 to-teal-400"
          />

          <ColorStatCard
            label="Graduated"
            value={
              graduatedStudents
            }
            icon={GraduationCap}
            iconClass="bg-violet-100 text-violet-700"
            glow="bg-violet-500/10"
            progress="from-violet-500 to-purple-400"
          />

          <ColorStatCard
            label="Showing"
            value={
              filteredStudents.length
            }
            icon={Search}
            iconClass="bg-orange-100 text-orange-700"
            glow="bg-orange-500/10"
            progress="from-orange-500 to-amber-400"
          />

        </section>

        {/* STUDENT RECORD HEADER */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>

                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                  Live database
                </span>

              </div>

              <h2 className="mt-1 text-xl font-black text-[var(--navy)]">
                Student Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {students.length} student
                {students.length ===
                1
                  ? ""
                  : "s"} in Firestore
              </p>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* SEARCH */}

              <div className="relative">

                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search students..."
                  aria-label="Search students"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 sm:w-72"
                />

              </div>

              {/* CLEAR */}

              {search && (
                <button
                  type="button"
                  onClick={
                    clearSearch
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
              )}

              {/* ADD */}

              <button
                type="button"
                onClick={
                  openAddForm
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                Add Student
              </button>

            </div>

          </div>

        </section>

        {/* TABLE */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {loading ? (
            <LoadingState />
          ) : filteredStudents.length ===
            0 ? (
            <EmptyState
              hasStudents={
                students.length >
                0
              }
              onClear={
                clearSearch
              }
              onAdd={
                openAddForm
              }
            />
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1150px]">

                <thead>
                  <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-blue-50/40 to-violet-50/30">

                    <TableHeader>
                      Student
                    </TableHeader>

                    <TableHeader>
                      College ID
                    </TableHeader>

                    <TableHeader>
                      Year
                    </TableHeader>

                    <TableHeader>
                      Department
                    </TableHeader>

                    <TableHeader>
                      Course
                    </TableHeader>

                    <TableHeader>
                      Semester
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

                  {filteredStudents.map(
                    (student) => {
                      const isDeleting =
                        deletingId ===
                        student.id;

                      return (
                        <tr
                          key={
                            student.id
                          }
                          className="border-b border-slate-100 transition hover:bg-gradient-to-r hover:from-blue-50/40 hover:via-white hover:to-violet-50/30"
                        >

                          {/* STUDENT */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 font-black text-blue-700 shadow-sm">
                                {getInitial(
                                  student.name
                                )}
                              </div>

                              <div className="min-w-0">

                                <p className="truncate font-black text-slate-800">
                                  {student.name ||
                                    "Unnamed Student"}
                                </p>

                                <p className="max-w-[230px] truncate text-xs text-slate-400">
                                  {student.email ||
                                    "No email"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* COLLEGE ID */}

                          <td className="px-5 py-4">

                            {student.studentId ? (
                              <span className="inline-flex rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-1.5 text-xs font-black text-blue-700">
                                {
                                  student.studentId
                                }
                              </span>
                            ) : (
                              <span className="inline-flex rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                                Not assigned
                              </span>
                            )}

                          </td>

                          {/* YEAR */}

                          <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                            {student.year ||
                              "—"}
                          </td>

                          {/* DEPARTMENT */}

                          <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                            {student.department ||
                              "—"}
                          </td>

                          {/* COURSE */}

                          <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                            {student.course ||
                              "—"}
                          </td>

                          {/* SEMESTER */}

                          <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                            {student.semester ||
                              "—"}
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">
                            <StudentStatusBadge
                              status={
                                student.status
                              }
                            />
                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  openEditForm(
                                    student
                                  )
                                }
                                disabled={
                                  isDeleting
                                }
                                className="grid h-9 w-9 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                                title="Edit student"
                                aria-label={`Edit ${student.name}`}
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  void handleDelete(
                                    student
                                  )
                                }
                                disabled={
                                  isDeleting
                                }
                                className="grid h-9 w-9 place-items-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                                title="Delete student"
                                aria-label={`Delete ${student.name}`}
                              >
                                {isDeleting ? (
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

        {/* MODAL */}

        {showForm && (
          <StudentModal
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
STUDENT STATUS BADGE
============================================================
*/

function StudentStatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized =
    status
      .trim()
      .toLowerCase();

  if (
    normalized ===
    "active"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1 text-xs font-black text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    );
  }

  if (
    normalized ===
    "graduated"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-1 text-xs font-black text-blue-700">
        <GraduationCap className="h-3.5 w-3.5" />
        Graduated
      </span>
    );
  }

  if (
    normalized ===
    "inactive"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
        Inactive
      </span>
    );
  }

  if (
    normalized ===
    "transferred"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">
        Transferred
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
      {status || "Unknown"}
    </span>
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
      role={
        isError
          ? "alert"
          : "status"
      }
    >
      <div className="flex items-start gap-3">

        {isError ? (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        ) : (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        )}

        <p
          className={`min-w-0 flex-1 text-sm font-bold ${
            isError
              ? "text-red-800"
              : "text-emerald-800"
          }`}
        >
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className={`rounded-lg p-1 ${
            isError
              ? "text-red-500 hover:bg-red-100"
              : "text-emerald-600 hover:bg-emerald-100"
          }`}
          aria-label="Dismiss message"
        >
          <X className="h-4 w-4" />
        </button>

      </div>
    </div>
  );
}

/*
============================================================
LOADING STATE
============================================================
*/

function LoadingState() {
  return (
    <div
      className="space-y-3 p-5"
      aria-busy="true"
      aria-label="Loading students"
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
          className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
        >
          <div className="h-11 w-11 animate-pulse rounded-2xl bg-gradient-to-br from-blue-100 to-slate-100" />

          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />

            <div className="h-3 w-72 max-w-full animate-pulse rounded bg-slate-100" />
          </div>

          <div className="hidden h-9 w-20 animate-pulse rounded-full bg-slate-100 sm:block" />

          <div className="hidden h-9 w-20 animate-pulse rounded-xl bg-slate-100 md:block" />
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
  hasStudents,
  onClear,
  onAdd,
}: {
  hasStudents: boolean;
  onClear: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="p-12 text-center">

      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600">
        <Users className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-xl font-black text-[var(--navy)]">
        {hasStudents
          ? "No matching students"
          : "No students yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasStudents
          ? "Try a different search term."
          : "Approved student registrations and manually created student records will appear here."}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">

        {hasStudents && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <X className="h-4 w-4" />
            Clear Search
          </button>
        )}

        {!hasStudents && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Plus className="h-4 w-4" />
            Add Student
          </button>
        )}

      </div>
    </div>
  );
}

/*
============================================================
STUDENT MODAL
============================================================
*/

function StudentModal({
  form,
  setForm,
  editing,
  saving,
  onClose,
  onSubmit,
}: {
  form: StudentForm;
  setForm: Dispatch<
    SetStateAction<StudentForm>
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
      aria-labelledby="student-modal-title"
    >
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* MODAL HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">

          <div>

            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700">
              <Users className="h-3.5 w-3.5" />
              Student record
            </div>

            <h2
              id="student-modal-title"
              className="text-xl font-black text-slate-900"
            >
              {editing
                ? "Edit Student"
                : "Add Student"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editing
                ? "Update the student information below."
                : "Create a new student record in Firestore."}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close student form"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={onSubmit}
          className="space-y-6 p-6"
        >

          {/* COLLEGE ID INFO */}

          <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-4">

            <div className="flex gap-3">

              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div>

                <p className="font-black text-blue-800">
                  College ID
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  The college student ID is optional. You can assign or update it later.
                </p>

              </div>

            </div>

          </div>

          {/* BASIC INFORMATION */}

          <div>

            <div className="mb-4">

              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">
                Personal Information
              </h3>

            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              <Input
                label="College Student ID"
                value={
                  form.studentId
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      studentId:
                        value.toUpperCase(),
                    })
                  )
                }
                placeholder="NDCBCA001"
              />

              <Input
                label="Student Name *"
                value={
                  form.name
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      name: value,
                    })
                  )
                }
                placeholder="Student full name"
              />

              <Input
                label="Email *"
                type="email"
                value={
                  form.email
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      email: value,
                    })
                  )
                }
                placeholder="student@example.com"
              />

              <Input
                label="Phone"
                type="tel"
                value={
                  form.phone
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      phone: value
                        .replace(
                          /\D/g,
                          ""
                        )
                        .slice(
                          0,
                          10
                        ),
                    })
                  )
                }
                placeholder="9876543210"
              />

            </div>

          </div>

          {/* ACADEMIC INFORMATION */}

          <div>

            <div className="mb-4">

              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">
                Academic Information
              </h3>

            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="student-year"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Current Year
                </label>

                <select
                  id="student-year"
                  value={
                    form.year
                  }
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (
                        current
                      ) => ({
                        ...current,
                        year:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="">
                    Select year
                  </option>

                  <option value="1st Year">
                    1st Year
                  </option>

                  <option value="2nd Year">
                    2nd Year
                  </option>

                  <option value="3rd Year">
                    3rd Year
                  </option>
                </select>
              </div>

              <Input
                label="Department *"
                value={
                  form.department
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      department:
                        value,
                    })
                  )
                }
                placeholder="Computer Applications"
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
                    (
                      current
                    ) => ({
                      ...current,
                      course:
                        value,
                    })
                  )
                }
                placeholder="BCA"
              />

              <Input
                label="Semester *"
                value={
                  form.semester
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      semester:
                        value,
                    })
                  )
                }
                placeholder="2nd Semester"
              />

              <Input
                label="Admission Year"
                type="number"
                value={
                  form.admissionYear
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      admissionYear:
                        value,
                    })
                  )
                }
                placeholder="2026"
              />

              <div>
                <label
                  htmlFor="student-status"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Student Status
                </label>

                <select
                  id="student-status"
                  value={
                    form.status
                  }
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (
                        current
                      ) => ({
                        ...current,
                        status:
                          event
                            .target
                            .value,
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

                  <option value="Graduated">
                    Graduated
                  </option>

                  <option value="Transferred">
                    Transferred
                  </option>
                </select>
              </div>

            </div>

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
                    ? "Update Student"
                    : "Save Student"}
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
INPUT
============================================================
*/

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
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
      />

    </div>
  );
}

/*
============================================================
INITIAL
============================================================
*/

function getInitial(
  name: string
): string {
  return (
    name.trim().charAt(0).toUpperCase() ||
    "S"
  );
}