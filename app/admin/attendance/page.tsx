
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
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Edit3,
  Filter,
  GraduationCap,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  UserX,
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

type AttendanceStatus =
  | "Present"
  | "Absent"
  | "Late";

type AttendanceRecord = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  course: string;
  department: string;
  semester: string;
  subject: string;
  subjectCode: string;
  faculty: string;
  facultyId: string;
  date: string;
  time: string;
  status: AttendanceStatus;
  remarks: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

type AttendanceForm = {
  studentId: string;
  studentName: string;
  studentEmail: string;
  course: string;
  department: string;
  semester: string;
  subject: string;
  subjectCode: string;
  faculty: string;
  facultyId: string;
  date: string;
  time: string;
  status: AttendanceStatus;
  remarks: string;
};

function getCurrentDate() {
  return new Date()
    .toISOString()
    .split("T")[0];
}

function getCurrentTime() {
  return new Date()
    .toTimeString()
    .slice(0, 5);
}

const emptyForm: AttendanceForm = {
  studentId: "",
  studentName: "",
  studentEmail: "",
  course: "",
  department: "",
  semester: "",
  subject: "",
  subjectCode: "",
  faculty: "",
  facultyId: "",
  date: getCurrentDate(),
  time: getCurrentTime(),
  status: "Present",
  remarks: "",
};

/*
============================================================
PAGE
============================================================
*/

export default function AttendancePage() {
  const [records, setRecords] =
    useState<AttendanceRecord[]>([]);

  const [form, setForm] =
    useState<AttendanceForm>({
      ...emptyForm,
    });

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [dateFilter, setDateFilter] =
    useState("");

  const [courseFilter, setCourseFilter] =
    useState("All");

  const [semesterFilter, setSemesterFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState<
      "All" | AttendanceStatus
    >("All");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

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

    const unsubscribe = onSnapshot(
      collection(db, "attendance"),
      (snapshot) => {
        const loadedRecords: AttendanceRecord[] =
          snapshot.docs.map((item) => {
            const data =
              item.data();

            return {
              id: item.id,

              studentId: String(
                data.studentId ?? ""
              ),

              studentName: String(
                data.studentName ?? ""
              ),

              studentEmail: String(
                data.studentEmail ?? ""
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

              subject: String(
                data.subject ?? ""
              ),

              subjectCode: String(
                data.subjectCode ?? ""
              ),

              faculty: String(
                data.faculty ?? ""
              ),

              facultyId: String(
                data.facultyId ?? ""
              ),

              date: String(
                data.date ?? ""
              ),

              time: String(
                data.time ?? ""
              ),

              status:
                data.status ===
                "Absent"
                  ? "Absent"
                  : data.status ===
                    "Late"
                    ? "Late"
                    : "Present",

              remarks: String(
                data.remarks ?? ""
              ),

              createdAt:
                data.createdAt,

              updatedAt:
                data.updatedAt,
            };
          });

        loadedRecords.sort(
          (a, b) => {
            const aKey =
              `${a.date} ${a.time}`;

            const bKey =
              `${b.date} ${b.time}`;

            return bKey.localeCompare(
              aKey
            );
          }
        );

        setRecords(
          loadedRecords
        );

        setLoading(false);
        setError("");
      },
      (listenerError) => {
        console.error(
          "Attendance realtime listener error:",
          listenerError
        );

        setError(
          listenerError instanceof Error
            ? listenerError.message
            : "Unable to load attendance records."
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

  const courseOptions =
    useMemo(
      () => [
        "All",
        ...Array.from(
          new Set(
            records
              .map((item) =>
                item.course.trim()
              )
              .filter(Boolean)
          )
        ).sort(),
      ],
      [records]
    );

  const semesterOptions =
    useMemo(
      () => [
        "All",
        ...Array.from(
          new Set(
            records
              .map((item) =>
                item.semester.trim()
              )
              .filter(Boolean)
          )
        ).sort(),
      ],
      [records]
    );

  /*
  ==========================================================
  FILTERED RECORDS
  ==========================================================
  */

  const filteredRecords =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      return records.filter(
        (record) => {
          const matchesSearch =
            !term ||
            [
              record.studentId,
              record.studentName,
              record.studentEmail,
              record.course,
              record.department,
              record.semester,
              record.subject,
              record.subjectCode,
              record.faculty,
              record.facultyId,
              record.status,
              record.remarks,
            ]
              .join(" ")
              .toLowerCase()
              .includes(term);

          const matchesDate =
            !dateFilter ||
            record.date ===
              dateFilter;

          const matchesCourse =
            courseFilter ===
              "All" ||
            record.course ===
              courseFilter;

          const matchesSemester =
            semesterFilter ===
              "All" ||
            record.semester ===
              semesterFilter;

          const matchesStatus =
            statusFilter ===
              "All" ||
            record.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesDate &&
            matchesCourse &&
            matchesSemester &&
            matchesStatus
          );
        }
      );
    }, [
      records,
      search,
      dateFilter,
      courseFilter,
      semesterFilter,
      statusFilter,
    ]);

  /*
  ==========================================================
  STATISTICS
  ==========================================================
  */

  const totalRecords =
    filteredRecords.length;

  const presentCount =
    filteredRecords.filter(
      (item) =>
        item.status ===
        "Present"
    ).length;

  const absentCount =
    filteredRecords.filter(
      (item) =>
        item.status ===
        "Absent"
    ).length;

  const lateCount =
    filteredRecords.filter(
      (item) =>
        item.status ===
        "Late"
    ).length;

  const attendanceRate =
    totalRecords > 0
      ? Math.round(
          (presentCount /
            totalRecords) *
            100
        )
      : 0;

  /*
  ==========================================================
  FORM HELPERS
  ==========================================================
  */

  function openAddForm() {
    setEditingId(null);

    setForm({
      ...emptyForm,
      date: getCurrentDate(),
      time: getCurrentTime(),
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditForm(
    record: AttendanceRecord
  ) {
    setEditingId(
      record.id
    );

    setForm({
      studentId:
        record.studentId,

      studentName:
        record.studentName,

      studentEmail:
        record.studentEmail,

      course:
        record.course,

      department:
        record.department,

      semester:
        record.semester,

      subject:
        record.subject,

      subjectCode:
        record.subjectCode,

      faculty:
        record.faculty,

      facultyId:
        record.facultyId,

      date:
        record.date,

      time:
        record.time,

      status:
        record.status,

      remarks:
        record.remarks,
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
      date: getCurrentDate(),
      time: getCurrentTime(),
    });
  }

  function clearFilters() {
    setSearch("");
    setDateFilter("");
    setCourseFilter("All");
    setSemesterFilter("All");
    setStatusFilter("All");
  }

  /*
  ==========================================================
  SAVE ATTENDANCE
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

    const studentId =
      form.studentId.trim();

    const studentName =
      form.studentName.trim();

    const studentEmail =
      form.studentEmail.trim();

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

    const faculty =
      form.faculty.trim();

    const facultyId =
      form.facultyId.trim();

    const date =
      form.date.trim();

    const time =
      form.time.trim();

    const remarks =
      form.remarks.trim();

    if (!studentId) {
      setError(
        "Student ID is required."
      );
      return;
    }

    if (!studentName) {
      setError(
        "Student name is required."
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

    if (!date) {
      setError(
        "Attendance date is required."
      );
      return;
    }

    try {
      setSaving(true);

      const attendanceData = {
        studentId,
        studentName,
        studentEmail,
        course,
        department,
        semester,
        subject,
        subjectCode,
        faculty,
        facultyId,
        date,
        time,
        status:
          form.status,
        remarks,
        updatedAt:
          serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(
          doc(
            db,
            "attendance",
            editingId
          ),
          attendanceData
        );

        setSuccess(
          `Attendance for ${studentName} was updated successfully.`
        );
      } else {
        await addDoc(
          collection(
            db,
            "attendance"
          ),
          {
            ...attendanceData,
            createdAt:
              serverTimestamp(),
          }
        );

        setSuccess(
          `Attendance for ${studentName} was recorded successfully.`
        );
      }

      setShowForm(false);
      setEditingId(null);

      setForm({
        ...emptyForm,
        date: getCurrentDate(),
        time: getCurrentTime(),
      });
    } catch (saveError) {
      console.error(
        "Attendance save error:",
        saveError
      );

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save attendance."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  ==========================================================
  DELETE
  ==========================================================
  */

  async function handleDelete(
    record: AttendanceRecord
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
        `Delete attendance for "${record.studentName}" on ${formatDate(record.date)}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        record.id
      );

      setError("");
      setSuccess("");

      await deleteDoc(
        doc(
          db,
          "attendance",
          record.id
        )
      );

      setSuccess(
        `Attendance for ${record.studentName} was deleted successfully.`
      );
    } catch (deleteError) {
      console.error(
        "Attendance delete error:",
        deleteError
      );

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete attendance."
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
      title="Attendance"
    >
      <main className="space-y-8 pb-10">

        <PageHeading
          eyebrow="Academic administration"
          title="Attendance Management"
          description="Monitor, record and manage student attendance with real-time Firestore synchronization."
        />

        {/* LIVE STATUS */}

        <div className="flex flex-wrap items-center gap-3">

          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 shadow-sm">

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            Real-time attendance
          </span>

          <span className="text-xs font-semibold text-slate-400">
            Changes appear automatically on connected admin pages.
          </span>

        </div>

        {/* ALERTS */}

        {error && (
          <AlertBox
            type="error"
            message={error}
            onClose={() =>
              setError("")
            }
          />
        )}

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

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <ColorStatCard
            label="Total Records"
            value={totalRecords}
            icon={ClipboardCheck}
            iconClass="bg-blue-100 text-blue-700"
            glow="bg-blue-500/10"
            progress="from-blue-500 to-cyan-400"
          />

          <ColorStatCard
            label="Present"
            value={presentCount}
            icon={UserCheck}
            iconClass="bg-emerald-100 text-emerald-700"
            glow="bg-emerald-500/10"
            progress="from-emerald-500 to-teal-400"
          />

          <ColorStatCard
            label="Absent"
            value={absentCount}
            icon={UserX}
            iconClass="bg-red-100 text-red-700"
            glow="bg-red-500/10"
            progress="from-red-500 to-rose-400"
          />

          <ColorStatCard
            label="Late"
            value={lateCount}
            icon={Clock3}
            iconClass="bg-amber-100 text-amber-700"
            glow="bg-amber-500/10"
            progress="from-amber-500 to-orange-400"
          />

          <ColorStatCard
            label="Attendance Rate"
            value={attendanceRate}
            icon={CheckCircle2}
            suffix="%"
            iconClass="bg-violet-100 text-violet-700"
            glow="bg-violet-500/10"
            progress="from-violet-500 to-purple-400"
          />

        </section>

        {/* RECORD CONTROLS */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-5">

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
                  Attendance Records
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredRecords.length} of{" "}
                  {records.length} records shown
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
                Mark Attendance
              </button>

            </div>

            <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto]">

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
                  placeholder="Search student, subject, faculty..."
                  aria-label="Search attendance"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

              {/* DATE */}

              <div className="relative">

                <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="date"
                  value={
                    dateFilter
                  }
                  onChange={(event) =>
                    setDateFilter(
                      event.target.value
                    )
                  }
                  aria-label="Filter by date"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
                label="Course"
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
                label="Semester"
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
                      | "All"
                      | AttendanceStatus
                  )
                }
                options={[
                  "All",
                  "Present",
                  "Absent",
                  "Late",
                ]}
                label="Status"
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
          ) : filteredRecords.length ===
            0 ? (
            <EmptyState
              hasRecords={
                records.length >
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

              <table className="w-full min-w-[1450px]">

                <thead>
                  <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-blue-50/40 to-violet-50/30">

                    <TableHeader>
                      Student
                    </TableHeader>

                    <TableHeader>
                      Course
                    </TableHeader>

                    <TableHeader>
                      Subject
                    </TableHeader>

                    <TableHeader>
                      Semester
                    </TableHeader>

                    <TableHeader>
                      Faculty
                    </TableHeader>

                    <TableHeader>
                      Date
                    </TableHeader>

                    <TableHeader>
                      Time
                    </TableHeader>

                    <TableHeader>
                      Status
                    </TableHeader>

                    <TableHeader>
                      Remarks
                    </TableHeader>

                    <TableHeader align="right">
                      Actions
                    </TableHeader>

                  </tr>
                </thead>

                <tbody>

                  {filteredRecords.map(
                    (record) => {
                      const deleting =
                        deletingId ===
                        record.id;

                      return (
                        <tr
                          key={
                            record.id
                          }
                          className="border-b border-slate-100 transition hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-white hover:to-violet-50/20"
                        >

                          {/* STUDENT */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 shadow-sm">
                                <Users className="h-5 w-5" />
                              </div>

                              <div className="min-w-0">

                                <p className="truncate font-black text-slate-800">
                                  {record.studentName ||
                                    "Unnamed Student"}
                                </p>

                                <p className="mt-1 text-xs font-bold text-slate-400">
                                  {record.studentId ||
                                    "No Student ID"}
                                </p>

                                {record.studentEmail && (
                                  <p className="mt-0.5 max-w-[200px] truncate text-[10px] text-slate-400">
                                    {
                                      record.studentEmail
                                    }
                                  </p>
                                )}

                              </div>

                            </div>

                          </td>

                          {/* COURSE */}

                          <td className="px-5 py-4">

                            <p className="text-sm font-black text-slate-700">
                              {record.course ||
                                "—"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {record.department ||
                                "—"}
                            </p>

                          </td>

                          {/* SUBJECT */}

                          <td className="px-5 py-4">

                            <p className="text-sm font-black text-slate-700">
                              {record.subject ||
                                "—"}
                            </p>

                            {record.subjectCode && (
                              <span className="mt-1 inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700">
                                {
                                  record.subjectCode
                                }
                              </span>
                            )}

                          </td>

                          {/* SEMESTER */}

                          <td className="px-5 py-4">

                            <span className="inline-flex rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                              {record.semester ||
                                "—"}
                            </span>

                          </td>

                          {/* FACULTY */}

                          <td className="px-5 py-4">

                            <div className="min-w-[150px]">

                              <p className="text-sm font-bold text-slate-700">
                                {record.faculty ||
                                  "Not assigned"}
                              </p>

                              {record.facultyId && (
                                <p className="mt-1 text-[10px] font-medium text-slate-400">
                                  {
                                    record.facultyId
                                  }
                                </p>
                              )}

                            </div>

                          </td>

                          {/* DATE */}

                          <td className="px-5 py-4">

                            <span className="inline-flex rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700">
                              {formatDate(
                                record.date
                              )}
                            </span>

                          </td>

                          {/* TIME */}

                          <td className="px-5 py-4 text-sm font-semibold text-slate-600">

                            <span className="inline-flex items-center gap-1.5">

                              <Clock3 className="h-3.5 w-3.5 text-slate-400" />

                              {record.time ||
                                "—"}

                            </span>

                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">

                            <AttendanceBadge
                              status={
                                record.status
                              }
                            />

                          </td>

                          {/* REMARKS */}

                          <td className="px-5 py-4">

                            <p
                              title={
                                record.remarks ||
                                ""
                              }
                              className="max-w-[180px] truncate text-xs font-medium text-slate-500"
                            >
                              {record.remarks ||
                                "—"}
                            </p>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-2">

                              <ActionButton
                                title="Edit attendance"
                                onClick={() =>
                                  openEditForm(
                                    record
                                  )
                                }
                                disabled={
                                  deleting
                                }
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                              >
                                <Edit3 className="h-4 w-4" />
                              </ActionButton>

                              <ActionButton
                                title="Delete attendance"
                                onClick={() =>
                                  void handleDelete(
                                    record
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

        {/* MODAL */}

        {showForm && (
          <AttendanceModal
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
  suffix = "",
}: {
  label: string;
  value: number;
  icon: ElementType;
  iconClass: string;
  glow: string;
  progress: string;
  suffix?: string;
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
          {suffix}
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
  label,
}: {
  value: string;
  onChange: (
    value: string
  ) => void;
  options: string[];
  label: string;
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
        aria-label={label}
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
                ? `All ${label.toLowerCase()}s`
                : option}
            </option>
          )
        )}
      </select>

      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
        ▾
      </span>

    </div>
  );
}

/*
============================================================
ATTENDANCE BADGE
============================================================
*/

function AttendanceBadge({
  status,
}: {
  status: AttendanceStatus;
}) {
  if (
    status ===
    "Present"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1 text-xs font-black text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Present
      </span>
    );
  }

  if (
    status ===
    "Absent"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 px-3 py-1 text-xs font-black text-red-700">
        <XCircle className="h-3.5 w-3.5" />
        Absent
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1 text-xs font-black text-amber-700">
      <Clock3 className="h-3.5 w-3.5" />
      Late
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
    type ===
    "success";

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
      aria-label="Loading attendance records"
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

              <div className="h-4 w-64 animate-pulse rounded bg-slate-200" />

              <div className="h-3 w-96 max-w-full animate-pulse rounded bg-slate-100" />

            </div>

            <div className="hidden h-8 w-24 animate-pulse rounded-full bg-slate-100 sm:block" />

            <div className="hidden h-9 w-20 animate-pulse rounded-xl bg-slate-100 md:block" />

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
  hasRecords,
  onAdd,
  onClear,
}: {
  hasRecords: boolean;
  onAdd: () => void;
  onClear: () => void;
}) {
  return (
    <div className="p-14 text-center">

      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600">
        <ClipboardCheck className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-xl font-black text-[var(--navy)]">
        {hasRecords
          ? "No matching attendance records"
          : "No attendance records yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasRecords
          ? "Try changing the search or filters."
          : "Start recording attendance to create live Firestore attendance records."}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">

        {hasRecords && (
          <button
            type="button"
            onClick={
              onClear
            }
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
          Mark Attendance
        </button>

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
ATTENDANCE MODAL
============================================================
*/

function AttendanceModal({
  form,
  setForm,
  editing,
  saving,
  onClose,
  onSubmit,
}: {
  form: AttendanceForm;
  setForm: Dispatch<
    SetStateAction<AttendanceForm>
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
      aria-labelledby="attendance-modal-title"
    >
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">

          <div>

            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700">
              <ClipboardCheck className="h-3.5 w-3.5" />
              Attendance Record
            </div>

            <h2
              id="attendance-modal-title"
              className="text-xl font-black text-slate-900"
            >
              {editing
                ? "Edit Attendance"
                : "Mark Attendance"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Save attendance directly to the live Firestore database.
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close attendance form"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-7 p-6"
        >

          {/* STUDENT */}

          <FormSection
            icon={Users}
            iconClass="bg-blue-100 text-blue-700"
            title="Student Information"
          >
            <Input
              label="Student ID / USN *"
              value={
                form.studentId
              }
              onChange={(
                value
              ) =>
                setForm(
                  (current) => ({
                    ...current,
                    studentId:
                      value,
                  })
                )
              }
              placeholder="U19CK25S0083"
            />

            <Input
              label="Student Name *"
              value={
                form.studentName
              }
              onChange={(
                value
              ) =>
                setForm(
                  (current) => ({
                    ...current,
                    studentName:
                      value,
                  })
                )
              }
              placeholder="Student full name"
            />

            <Input
              label="Student Email"
              type="email"
              value={
                form.studentEmail
              }
              onChange={(
                value
              ) =>
                setForm(
                  (current) => ({
                    ...current,
                    studentEmail:
                      value,
                  })
                )
              }
              placeholder="student@example.com"
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

            <Input
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
              placeholder="2nd Semester"
            />
          </FormSection>

          {/* SUBJECT */}

          <FormSection
            icon={GraduationCap}
            iconClass="bg-violet-100 text-violet-700"
            title="Subject Information"
          >
            <Input
              label="Subject *"
              value={
                form.subject
              }
              onChange={(
                value
              ) =>
                setForm(
                  (current) => ({
                    ...current,
                    subject:
                      value,
                  })
                )
              }
              placeholder="Data Structures"
            />

            <Input
              label="Subject Code"
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
                      value.toUpperCase(),
                  })
                )
              }
              placeholder="BCA201"
            />

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
          </FormSection>

          {/* ATTENDANCE */}

          <FormSection
            icon={CalendarDays}
            iconClass="bg-emerald-100 text-emerald-700"
            title="Attendance Details"
            columns="sm:grid-cols-3"
          >
            <DateInput
              label="Date *"
              value={
                form.date
              }
              onChange={(
                value
              ) =>
                setForm(
                  (current) => ({
                    ...current,
                    date:
                      value,
                  })
                )
              }
            />

            <TimeInput
              label="Time"
              value={
                form.time
              }
              onChange={(
                value
              ) =>
                setForm(
                  (current) => ({
                    ...current,
                    time:
                      value,
                  })
                )
              }
            />

            <div>
              <label
                htmlFor="attendance-status"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Attendance Status *
              </label>

              <select
                id="attendance-status"
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
                          .value as AttendanceStatus,
                    })
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="Present">
                  Present
                </option>

                <option value="Absent">
                  Absent
                </option>

                <option value="Late">
                  Late
                </option>
              </select>
            </div>
          </FormSection>

          {/* REMARKS */}

          <div>

            <label
              htmlFor="attendance-remarks"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Remarks
            </label>

            <textarea
              id="attendance-remarks"
              value={
                form.remarks
              }
              onChange={(
                event
              ) =>
                setForm(
                  (current) => ({
                    ...current,
                    remarks:
                      event
                        .target
                        .value,
                  })
                )
              }
              rows={4}
              placeholder="Optional attendance remarks..."
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
                  <Check className="h-4 w-4" />
                  {editing
                    ? "Update Attendance"
                    : "Save Attendance"}
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
FORM SECTION
============================================================
*/

function FormSection({
  icon: Icon,
  iconClass,
  title,
  children,
  columns = "sm:grid-cols-2",
}: {
  icon: ElementType;
  iconClass: string;
  title: string;
  children: React.ReactNode;
  columns?: string;
}) {
  return (
    <section>

      <div className="mb-4 flex items-center gap-3">

        <div
          className={`grid h-10 w-10 place-items-center rounded-xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <h3 className="font-black text-slate-800">
          {title}
        </h3>

      </div>

      <div
        className={`grid gap-5 ${columns}`}
      >
        {children}
      </div>

    </section>
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
DATE INPUT
============================================================
*/

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type="date"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
      />

    </div>
  );
}

/*
============================================================
TIME INPUT
============================================================
*/

function TimeInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type="time"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
      />

    </div>
  );
}

/*
============================================================
HELPERS
============================================================
*/

function formatDate(
  value: string
) {
  if (!value) {
    return "—";
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

