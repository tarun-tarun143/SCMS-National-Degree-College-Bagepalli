"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
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
  Clock3,
  Edit3,
  Filter,
  GraduationCap,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";

type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

type TimetableStatus =
  | "Active"
  | "Inactive";

type TimetableRecord = {
  id: string;

  course: string;
  department: string;
  semester: string;
  section: string;

  subject: string;
  subjectCode: string;

  faculty: string;
  facultyId: string;

  room: string;

  day: Day;
  date: string;

  startTime: string;
  endTime: string;

  academicYear: string;

  status: TimetableStatus;

  notes: string;

  createdAt?: unknown;
  updatedAt?: unknown;
};

type TimetableForm = {
  course: string;
  department: string;
  semester: string;
  section: string;

  subject: string;
  subjectCode: string;

  faculty: string;
  facultyId: string;

  room: string;

  day: Day;
  date: string;

  startTime: string;
  endTime: string;

  academicYear: string;

  status: TimetableStatus;

  notes: string;
};

const days: Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const emptyForm: TimetableForm = {
  course: "",
  department: "",
  semester: "",
  section: "",

  subject: "",
  subjectCode: "",

  faculty: "",
  facultyId: "",

  room: "",

  day: "Monday",
  date: "",

  startTime: "09:00",
  endTime: "10:00",

  academicYear: "2026-27",

  status: "Active",

  notes: "",
};

export default function TimetablePage() {
  const [records, setRecords] = useState<
    TimetableRecord[]
  >([]);

  const [form, setForm] =
    useState<TimetableForm>({
      ...emptyForm,
    });

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [dayFilter, setDayFilter] =
    useState<"All" | Day>("All");

  const [courseFilter, setCourseFilter] =
    useState("All");

  const [semesterFilter, setSemesterFilter] =
    useState("All");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState<
      "All" | TimetableStatus
    >("All");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

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
      collection(db, "timetable"),
      (snapshot) => {
        const loaded: TimetableRecord[] =
          snapshot.docs.map((item) => {
            const data = item.data();

            const rawDay = String(
              data.day ?? "Monday"
            );

            const safeDay: Day =
              days.includes(rawDay as Day)
                ? (rawDay as Day)
                : "Monday";

            const rawStatus = String(
              data.status ?? "Active"
            );

            const safeStatus: TimetableStatus =
              rawStatus === "Inactive"
                ? "Inactive"
                : "Active";

            return {
              id: item.id,

              course: String(
                data.course ?? ""
              ),

              department: String(
                data.department ?? ""
              ),

              semester: String(
                data.semester ?? ""
              ),

              section: String(
                data.section ?? ""
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

              room: String(
                data.room ?? ""
              ),

              day: safeDay,

              date: String(
                data.date ?? ""
              ),

              startTime: String(
                data.startTime ?? ""
              ),

              endTime: String(
                data.endTime ?? ""
              ),

              academicYear: String(
                data.academicYear ?? ""
              ),

              status: safeStatus,

              notes: String(
                data.notes ?? ""
              ),

              createdAt:
                data.createdAt,

              updatedAt:
                data.updatedAt,
            };
          });

        loaded.sort((a, b) => {
          const dayDifference =
            days.indexOf(a.day) -
            days.indexOf(b.day);

          if (dayDifference !== 0) {
            return dayDifference;
          }

          return a.startTime.localeCompare(
            b.startTime
          );
        });

        setRecords(loaded);
        setLoading(false);
      },
      (listenerError) => {
        console.error(
          "Timetable listener error:",
          listenerError
        );

        setError(
          listenerError instanceof Error
            ? listenerError.message
            : "Unable to load timetable records."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const courseOptions = useMemo(
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

  const semesterOptions = useMemo(
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

  const departmentOptions =
    useMemo(
      () => [
        "All",
        ...Array.from(
          new Set(
            records
              .map((item) =>
                item.department.trim()
              )
              .filter(Boolean)
          )
        ).sort(),
      ],
      [records]
    );

  const filteredRecords =
    useMemo(() => {
      const term = search
        .trim()
        .toLowerCase();

      return records.filter(
        (record) => {
          const matchesSearch =
            !term ||
            [
              record.course,
              record.department,
              record.semester,
              record.section,
              record.subject,
              record.subjectCode,
              record.faculty,
              record.facultyId,
              record.room,
              record.day,
              record.academicYear,
              record.status,
              record.notes,
            ]
              .join(" ")
              .toLowerCase()
              .includes(term);

          const matchesDay =
            dayFilter === "All" ||
            record.day === dayFilter;

          const matchesCourse =
            courseFilter === "All" ||
            record.course ===
              courseFilter;

          const matchesSemester =
            semesterFilter === "All" ||
            record.semester ===
              semesterFilter;

          const matchesDepartment =
            departmentFilter === "All" ||
            record.department ===
              departmentFilter;

          const matchesStatus =
            statusFilter === "All" ||
            record.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesDay &&
            matchesCourse &&
            matchesSemester &&
            matchesDepartment &&
            matchesStatus
          );
        }
      );
    }, [
      records,
      search,
      dayFilter,
      courseFilter,
      semesterFilter,
      departmentFilter,
      statusFilter,
    ]);

  const totalClasses =
    filteredRecords.length;

  const activeClasses =
    filteredRecords.filter(
      (item) =>
        item.status === "Active"
    ).length;

  const inactiveClasses =
    filteredRecords.filter(
      (item) =>
        item.status === "Inactive"
    ).length;

  const uniqueFaculty =
    new Set(
      filteredRecords
        .map(
          (item) =>
            item.facultyId ||
            item.faculty
        )
        .filter(Boolean)
    ).size;

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
    record: TimetableRecord
  ) {
    setEditingId(record.id);

    setForm({
      course: record.course,
      department:
        record.department,
      semester: record.semester,
      section: record.section,

      subject: record.subject,
      subjectCode:
        record.subjectCode,

      faculty: record.faculty,
      facultyId:
        record.facultyId,

      room: record.room,

      day: record.day,
      date: record.date,

      startTime:
        record.startTime,
      endTime:
        record.endTime,

      academicYear:
        record.academicYear,

      status: record.status,

      notes: record.notes,
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

  function clearFilters() {
    setSearch("");
    setDayFilter("All");
    setCourseFilter("All");
    setSemesterFilter("All");
    setDepartmentFilter("All");
    setStatusFilter("All");
  }

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

    const course =
      form.course.trim();

    const department =
      form.department.trim();

    const semester =
      form.semester.trim();

    const section =
      form.section.trim();

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

    const room =
      form.room.trim();

    const date =
      form.date.trim();

    const academicYear =
      form.academicYear.trim();

    const notes =
      form.notes.trim();

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

    if (!section) {
      setError(
        "Section is required."
      );
      return;
    }

    if (!subject) {
      setError(
        "Subject is required."
      );
      return;
    }

    if (!faculty) {
      setError(
        "Faculty name is required."
      );
      return;
    }

    if (!room) {
      setError(
        "Room is required."
      );
      return;
    }

    if (
      !form.startTime ||
      !form.endTime
    ) {
      setError(
        "Start time and end time are required."
      );
      return;
    }

    if (
      form.startTime >=
      form.endTime
    ) {
      setError(
        "End time must be later than start time."
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

      const timetableData = {
        course,
        department,
        semester,
        section,

        subject,
        subjectCode,

        faculty,
        facultyId,

        room,

        day: form.day,
        date,

        startTime:
          form.startTime,

        endTime:
          form.endTime,

        academicYear,

        status:
          form.status,

        notes,

        updatedAt:
          serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(
          doc(
            db,
            "timetable",
            editingId
          ),
          timetableData
        );

        setSuccess(
          "Timetable entry updated successfully."
        );
      } else {
        await addDoc(
          collection(
            db,
            "timetable"
          ),
          {
            ...timetableData,
            createdAt:
              serverTimestamp(),
          }
        );

        setSuccess(
          "Timetable entry added successfully."
        );
      }

      setShowForm(false);
      setEditingId(null);

      setForm({
        ...emptyForm,
      });
    } catch (saveError) {
      console.error(
        "Timetable save error:",
        saveError
      );

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save timetable entry."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    record: TimetableRecord
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
        `Delete ${record.subject} timetable entry for ${record.course} - ${record.section}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(record.id);

      setError("");
      setSuccess("");

      await deleteDoc(
        doc(
          db,
          "timetable",
          record.id
        )
      );

      setSuccess(
        "Timetable entry deleted successfully."
      );
    } catch (deleteError) {
      console.error(
        "Timetable delete error:",
        deleteError
      );

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete timetable entry."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <PortalShell
      role="admin"
      title="Timetable"
    >
      <main className="space-y-8 pb-10">
        <PageHeading
          eyebrow="Academic administration"
          title="Timetable Management"
          description="Create, manage and monitor the college timetable with real-time Firestore synchronization."
        />

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

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Classes"
            value={totalClasses}
            icon={CalendarDays}
            gradient="from-blue-600 to-cyan-500"
          />

          <StatCard
            label="Active Classes"
            value={activeClasses}
            icon={Check}
            gradient="from-emerald-600 to-teal-500"
          />

          <StatCard
            label="Inactive"
            value={inactiveClasses}
            icon={XCircle}
            gradient="from-red-500 to-rose-500"
          />

          <StatCard
            label="Faculty Assigned"
            value={uniqueFaculty}
            icon={Users}
            gradient="from-violet-600 to-purple-500"
          />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                  Real-time Firestore
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                  Timetable Records
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {filteredRecords.length} of{" "}
                  {records.length} timetable
                  entries shown
                </p>
              </div>

              <button
                type="button"
                onClick={openAddForm}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add Timetable
              </button>
            </div>

            <div className="grid gap-3 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search subject, faculty, room..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
                />
              </div>

              <FilterSelect
                value={dayFilter}
                onChange={(value) =>
                  setDayFilter(
                    value as "All" | Day
                  )
                }
                options={[
                  "All",
                  ...days,
                ]}
                label="Day"
              />

              <FilterSelect
                value={courseFilter}
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
                  departmentFilter
                }
                onChange={
                  setDepartmentFilter
                }
                options={
                  departmentOptions
                }
                label="Department"
              />

              <FilterSelect
                value={
                  statusFilter
                }
                onChange={(value) =>
                  setStatusFilter(
                    value as
                      | "All"
                      | TimetableStatus
                  )
                }
                options={[
                  "All",
                  "Active",
                  "Inactive",
                ]}
                label="Status"
              />

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <RefreshCw className="h-4 w-4" />
                Clear
              </button>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            Real-time timetable
          </span>

          <span className="text-xs text-slate-400 dark:text-slate-500">
            Changes are synchronized automatically.
          </span>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {loading ? (
            <LoadingState />
          ) : filteredRecords.length ===
            0 ? (
            <EmptyState
              hasRecords={
                records.length > 0
              }
              onAdd={openAddForm}
              onClear={
                clearFilters
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1550px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                    <TableHeader>
                      Day / Time
                    </TableHeader>

                    <TableHeader>
                      Class
                    </TableHeader>

                    <TableHeader>
                      Subject
                    </TableHeader>

                    <TableHeader>
                      Faculty
                    </TableHeader>

                    <TableHeader>
                      Room
                    </TableHeader>

                    <TableHeader>
                      Course
                    </TableHeader>

                    <TableHeader>
                      Semester
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
                  {filteredRecords.map(
                    (record) => {
                      const deleting =
                        deletingId ===
                        record.id;

                      return (
                        <tr
                          key={record.id}
                          className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/70"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                                <CalendarDays className="h-5 w-5" />
                              </div>

                              <div>
                                <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                                  {record.day}
                                </p>

                                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                  <Clock3 className="h-3.5 w-3.5" />

                                  {record.startTime ||
                                    "—"}

                                  {" - "}

                                  {record.endTime ||
                                    "—"}
                                </div>

                                {record.date && (
                                  <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                                    {formatDate(
                                      record.date
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                              {record.section ||
                                "—"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                              {record.department ||
                                "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                              {record.subject ||
                                "—"}
                            </p>

                            {record.subjectCode && (
                              <span className="mt-1 inline-flex rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-black text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                                {
                                  record.subjectCode
                                }
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
                                <User className="h-4 w-4" />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                  {record.faculty ||
                                    "Not assigned"}
                                </p>

                                {record.facultyId && (
                                  <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                                    {
                                      record.facultyId
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              {record.room ||
                                "—"}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                              {record.course ||
                                "—"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                              {record.department}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                            {record.semester ||
                              "—"}
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                              {record.academicYear ||
                                "—"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge
                              status={
                                record.status
                              }
                            />
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <ActionButton
                                title="Edit timetable"
                                onClick={() =>
                                  openEditForm(
                                    record
                                  )
                                }
                                disabled={
                                  deleting
                                }
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/60"
                              >
                                <Edit3 className="h-4 w-4" />
                              </ActionButton>

                              <ActionButton
                                title="Delete timetable"
                                onClick={() =>
                                  void handleDelete(
                                    record
                                  )
                                }
                                disabled={
                                  deleting
                                }
                                className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-900/60"
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

        {showForm && (
          <TimetableModal
            form={form}
            setForm={setForm}
            editing={Boolean(
              editingId
            )}
            saving={saving}
            onClose={closeForm}
            onSubmit={
              handleSubmit
            }
          />
        )}
      </main>
    </PortalShell>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: number;
  icon: ElementType;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <div
        className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${gradient} opacity-15 blur-2xl transition duration-500 group-hover:scale-150`}
      />

      <div className="relative">
        <div
          className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <p className="mt-4 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
          {value.toLocaleString()}
        </p>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full w-2/3 rounded-full bg-gradient-to-r ${gradient} transition-all duration-500 group-hover:w-full`}
          />
        </div>
      </div>
    </div>
  );
}

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
        className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900"
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option === "All"
                ? `All ${label}s`
                : option}
            </option>
          )
        )}
      </select>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: TimetableStatus;
}) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
        <Check className="h-3.5 w-3.5" />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      <XCircle className="h-3.5 w-3.5" />
      Inactive
    </span>
  );
}

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
      className={`grid h-9 w-9 place-items-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

function AlertBox({
  type,
  message,
  onClose,
}: {
  type: "error" | "success";
  message: string;
  onClose: () => void;
}) {
  const success =
    type === "success";

  return (
    <div
      className={`rounded-2xl border p-4 ${
        success
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40"
          : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/40"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {success ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          )}

          <p
            className={`text-sm font-bold ${
              success
                ? "text-emerald-800 dark:text-emerald-200"
                : "text-red-800 dark:text-red-200"
            }`}
          >
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={
            success
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {[1, 2, 3, 4, 5].map(
        (item) => (
          <div
            key={item}
            className="animate-pulse p-5"
          >
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800" />

              <div className="flex-1">
                <div className="h-4 w-60 rounded bg-slate-100 dark:bg-slate-800" />

                <div className="mt-3 h-3 w-96 rounded bg-slate-100 dark:bg-slate-800" />
              </div>

              <div className="h-8 w-24 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        )
      )}
    </div>
  );
}

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
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <CalendarDays className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-800 dark:text-white">
        {hasRecords
          ? "No matching timetable entries"
          : "No timetable entries yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        {hasRecords
          ? "Try changing the search or filters."
          : "Add your first timetable entry to start managing the college schedule."}
      </p>

      <div className="mt-5 flex justify-center gap-3">
        {hasRecords && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Clear Filters
          </button>
        )}

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Timetable
        </button>
      </div>
    </div>
  );
}

function TableHeader({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-4 text-${align} text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400`}
    >
      {children}
    </th>
  );
}

function TimetableModal({
  form,
  setForm,
  editing,
  saving,
  onClose,
  onSubmit,
}: {
  form: TimetableForm;
  setForm: React.Dispatch<
    SetStateAction<TimetableForm>
  >;
  editing: boolean;
  saving: boolean;
  onClose: () => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
}) {
  function updateField(
    field: keyof TimetableForm,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-700 dark:bg-slate-900">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
              Timetable Management
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
              {editing
                ? "Edit Timetable Entry"
                : "Add Timetable Entry"}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Configure class schedule information and save it to Firestore.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-6 p-6"
        >
          <FormSection
            icon={GraduationCap}
            title="Academic Information"
            description="Define the class, department, semester and academic year."
            color="blue"
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                label="Course *"
                value={form.course}
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
                label="Section *"
                value={
                  form.section
                }
                onChange={(value) =>
                  updateField(
                    "section",
                    value
                  )
                }
                placeholder="A"
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
            icon={Users}
            title="Subject & Faculty"
            description="Assign the subject and responsible faculty member."
            color="violet"
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                label="Subject *"
                value={
                  form.subject
                }
                onChange={(value) =>
                  updateField(
                    "subject",
                    value
                  )
                }
                placeholder="Data Structures"
              />

              <Input
                label="Subject Code"
                value={
                  form.subjectCode
                }
                onChange={(value) =>
                  updateField(
                    "subjectCode",
                    value.toUpperCase()
                  )
                }
                placeholder="BCA201"
              />

              <Input
                label="Faculty *"
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
            icon={CalendarDays}
            title="Schedule"
            description="Set the day, time and classroom."
            color="emerald"
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              <SelectInput
                label="Day *"
                value={form.day}
                onChange={(value) =>
                  updateField(
                    "day",
                    value
                  )
                }
                options={days}
              />

              <Input
                label="Date"
                type="date"
                value={form.date}
                onChange={(value) =>
                  updateField(
                    "date",
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
                value={form.endTime}
                onChange={(value) =>
                  updateField(
                    "endTime",
                    value
                  )
                }
              />

              <Input
                label="Room *"
                value={form.room}
                onChange={(value) =>
                  updateField(
                    "room",
                    value
                  )
                }
                placeholder="Room 204"
              />
            </div>
          </FormSection>

          <FormSection
            icon={CheckCircle2}
            title="Status & Notes"
            description="Control the schedule state and add optional notes."
            color="orange"
          >
            <div className="grid gap-5 sm:grid-cols-2">
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
                options={[
                  "Active",
                  "Inactive",
                ]}
              />

              <Input
                label="Notes"
                value={
                  form.notes
                }
                onChange={(value) =>
                  updateField(
                    "notes",
                    value
                  )
                }
                placeholder="Optional schedule notes"
              />
            </div>
          </FormSection>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                    ? "Update Timetable"
                    : "Save Timetable"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormSection({
  icon: Icon,
  title,
  description,
  color,
  children,
}: {
  icon: ElementType;
  title: string;
  description: string;
  color:
    | "blue"
    | "violet"
    | "emerald"
    | "orange";
  children: React.ReactNode;
}) {
  const iconClasses = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
    violet:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
    orange:
      "bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-300",
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-700 dark:bg-slate-800/60">
      <div className="mb-5 flex items-center gap-3">
        <div
          className={`grid h-10 w-10 place-items-center rounded-xl ${iconClasses[color]}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-black text-slate-900 dark:text-white">
            {title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

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
      <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
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
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-950 dark:focus:ring-blue-900/40"
      />
    </div>
  );
}

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
      <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:bg-slate-950 dark:focus:ring-blue-900/40"
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

function formatDate(
  value: string
) {
  if (!value) {
    return "";
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