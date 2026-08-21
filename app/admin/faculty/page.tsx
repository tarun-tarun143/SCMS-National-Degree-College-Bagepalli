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

type Faculty = {
  id: string;
  uid?: string;
  facultyId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  qualification: string;
  joiningDate: string;
  status: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  approvedAt?: unknown;
};

type FacultyForm = {
  facultyId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  qualification: string;
  joiningDate: string;
  status: string;
};

const emptyForm: FacultyForm = {
  facultyId: "",
  name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  qualification: "",
  joiningDate: "",
  status: "Active",
};

/*
============================================================
PAGE
============================================================
*/

export default function FacultyPage() {
  const [faculty, setFaculty] =
    useState<Faculty[]>([]);

  const [form, setForm] =
    useState<FacultyForm>({
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

    const facultyQuery = query(
      collection(db, "faculty"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      facultyQuery,
      (snapshot) => {
        const records: Faculty[] =
          snapshot.docs.map((item) => {
            const data = item.data();

            return {
              id: item.id,

              uid:
                typeof data.uid === "string"
                  ? data.uid
                  : item.id,

              facultyId: String(
                data.facultyId ?? ""
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

              department: String(
                data.department ?? ""
              ),

              designation: String(
                data.designation ?? ""
              ),

              qualification: String(
                data.qualification ?? ""
              ),

              joiningDate: String(
                data.joiningDate ?? ""
              ),

              status: String(
                data.status ?? "Active"
              ),

              createdAt:
                data.createdAt,

              updatedAt:
                data.updatedAt,

              approvedAt:
                data.approvedAt,
            };
          });

        setFaculty(records);
        setLoading(false);
        setError("");
      },
      (err) => {
        console.error(
          "Faculty listener error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load faculty records."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /*
  ==========================================================
  SEARCH
  ==========================================================
  */

  const filteredFaculty =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return faculty;
      }

      return faculty.filter(
        (member) =>
          [
            member.facultyId,
            member.name,
            member.email,
            member.phone,
            member.department,
            member.designation,
            member.qualification,
            member.joiningDate,
            member.status,
          ]
            .join(" ")
            .toLowerCase()
            .includes(term)
      );
    }, [faculty, search]);

  /*
  ==========================================================
  STATISTICS
  ==========================================================
  */

  const totalFaculty =
    faculty.length;

  const activeFaculty =
    faculty.filter(
      (member) =>
        member.status
          .trim()
          .toLowerCase() === "active"
    ).length;

  const inactiveFaculty =
    faculty.filter(
      (member) =>
        member.status
          .trim()
          .toLowerCase() === "inactive"
    ).length;

  const onLeaveFaculty =
    faculty.filter(
      (member) =>
        member.status
          .trim()
          .toLowerCase() ===
        "on leave"
    ).length;

  /*
  ==========================================================
  ADD
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

  /*
  ==========================================================
  EDIT
  ==========================================================
  */

  function openEditForm(
    member: Faculty
  ) {
    setEditingId(member.id);

    setForm({
      facultyId:
        member.facultyId,
      name: member.name,
      email: member.email,
      phone: member.phone,
      department:
        member.department,
      designation:
        member.designation,
      qualification:
        member.qualification,
      joiningDate:
        member.joiningDate,
      status:
        member.status,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  /*
  ==========================================================
  CLOSE
  ==========================================================
  */

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
  SAVE / UPDATE
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

    if (!form.name.trim()) {
      setError(
        "Faculty name is required."
      );
      return;
    }

    if (!form.email.trim()) {
      setError(
        "Faculty email is required."
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

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const facultyData = {
        facultyId:
          form.facultyId
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

        department:
          form.department.trim(),

        designation:
          form.designation.trim(),

        qualification:
          form.qualification.trim(),

        joiningDate:
          form.joiningDate.trim(),

        status:
          form.status.trim() ||
          "Active",

        updatedAt:
          serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(
          doc(
            db,
            "faculty",
            editingId
          ),
          facultyData
        );

        setSuccess(
          "Faculty record updated successfully."
        );
      } else {
        await addDoc(
          collection(
            db,
            "faculty"
          ),
          {
            ...facultyData,
            createdAt:
              serverTimestamp(),
          }
        );

        setSuccess(
          "Faculty record added successfully."
        );
      }

      setShowForm(false);
      setEditingId(null);

      setForm({
        ...emptyForm,
      });
    } catch (err) {
      console.error(
        "Faculty save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save faculty."
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
    member: Faculty
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
        `Delete faculty member "${member.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        member.id
      );

      setError("");
      setSuccess("");

      await deleteDoc(
        doc(
          db,
          "faculty",
          member.id
        )
      );

      setSuccess(
        `${member.name} was deleted successfully.`
      );
    } catch (err) {
      console.error(
        "Faculty delete error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete faculty."
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
      title="Faculty"
    >
      <main className="space-y-8 pb-10">

        {/* PAGE HEADER */}

        <PageHeading
          eyebrow="Faculty administration"
          title="Faculty Management"
          description="Manage approved faculty members, departments, designations and academic information in real time."
        />

        {/* LIVE STATUS */}

        <div className="flex flex-wrap items-center gap-3">

          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 shadow-sm">

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            Real-time faculty
          </span>

          <span className="text-xs font-semibold text-slate-400">
            Faculty records update automatically from Firestore.
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
            label="Total Faculty"
            value={totalFaculty}
            icon={Users}
            iconClass="bg-emerald-100 text-emerald-700"
            glow="bg-emerald-500/10"
            progress="from-emerald-500 to-teal-400"
          />

          <ColorStatCard
            label="Active Faculty"
            value={activeFaculty}
            icon={CheckCircle2}
            iconClass="bg-blue-100 text-blue-700"
            glow="bg-blue-500/10"
            progress="from-blue-500 to-cyan-400"
          />

          <ColorStatCard
            label="On Leave"
            value={onLeaveFaculty}
            icon={RefreshCw}
            iconClass="bg-amber-100 text-amber-700"
            glow="bg-amber-500/10"
            progress="from-amber-500 to-orange-400"
          />

          <ColorStatCard
            label="Inactive"
            value={inactiveFaculty}
            icon={GraduationCap}
            iconClass="bg-violet-100 text-violet-700"
            glow="bg-violet-500/10"
            progress="from-violet-500 to-purple-400"
          />

        </section>

        {/* FACULTY RECORD HEADER */}

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
                Faculty Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {faculty.length} faculty record
                {faculty.length ===
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
                  placeholder="Search faculty..."
                  aria-label="Search faculty"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 sm:w-72"
                />

              </div>

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
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
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                Add Faculty
              </button>

            </div>

          </div>

        </section>

        {/* TABLE */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {loading ? (
            <LoadingState />
          ) : filteredFaculty.length ===
            0 ? (
            <EmptyState
              hasFaculty={
                faculty.length >
                0
              }
              onClear={() =>
                setSearch("")
              }
              onAdd={
                openAddForm
              }
            />
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px]">

                <thead>
                  <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-emerald-50/40 to-teal-50/30">

                    <TableHeader>
                      Faculty
                    </TableHeader>

                    <TableHeader>
                      Faculty ID
                    </TableHeader>

                    <TableHeader>
                      Department
                    </TableHeader>

                    <TableHeader>
                      Designation
                    </TableHeader>

                    <TableHeader>
                      Qualification
                    </TableHeader>

                    <TableHeader>
                      Joining Date
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

                  {filteredFaculty.map(
                    (member) => {
                      const isDeleting =
                        deletingId ===
                        member.id;

                      return (
                        <tr
                          key={
                            member.id
                          }
                          className="border-b border-slate-100 transition hover:bg-gradient-to-r hover:from-emerald-50/40 hover:via-white hover:to-teal-50/30"
                        >

                          {/* FACULTY */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 font-black text-emerald-700 shadow-sm">
                                {getInitial(
                                  member.name
                                )}
                              </div>

                              <div className="min-w-0">

                                <p className="truncate font-black text-slate-800">
                                  {member.name ||
                                    "Unnamed Faculty"}
                                </p>

                                <p className="max-w-[240px] truncate text-xs text-slate-400">
                                  {member.email ||
                                    "No email"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* FACULTY ID */}

                          <td className="px-5 py-4">

                            {member.facultyId ? (
                              <span className="inline-flex rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                                {
                                  member.facultyId
                                }
                              </span>
                            ) : (
                              <span className="inline-flex rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                                Not assigned
                              </span>
                            )}

                          </td>

                          {/* DEPARTMENT */}

                          <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                            {member.department ||
                              "—"}
                          </td>

                          {/* DESIGNATION */}

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                              {member.designation ||
                                "Not assigned"}
                            </span>
                          </td>

                          {/* QUALIFICATION */}

                          <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                            {member.qualification ||
                              "—"}
                          </td>

                          {/* JOINING DATE */}

                          <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                            {formatDate(
                              member.joiningDate
                            )}
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">

                            <FacultyStatusBadge
                              status={
                                member.status
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
                                    member
                                  )
                                }
                                disabled={
                                  isDeleting
                                }
                                className="grid h-9 w-9 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                                title="Edit faculty"
                                aria-label={`Edit ${member.name}`}
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  void handleDelete(
                                    member
                                  )
                                }
                                disabled={
                                  isDeleting
                                }
                                className="grid h-9 w-9 place-items-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                                title="Delete faculty"
                                aria-label={`Delete ${member.name}`}
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
          <FacultyModal
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
STATUS BADGE
============================================================
*/

function FacultyStatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized =
    status
      .trim()
      .toLowerCase();

  if (
    normalized === "active"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1 text-xs font-black text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    );
  }

  if (
    normalized === "on leave"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1 text-xs font-black text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        On Leave
      </span>
    );
  }

  if (
    normalized === "retired"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 px-3 py-1 text-xs font-black text-violet-700">
        Retired
      </span>
    );
  }

  if (
    normalized === "inactive"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
        Inactive
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
LOADING
============================================================
*/

function LoadingState() {
  return (
    <div
      className="space-y-3 p-5"
      aria-busy="true"
      aria-label="Loading faculty"
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
          <div className="h-11 w-11 animate-pulse rounded-2xl bg-gradient-to-br from-emerald-100 to-slate-100" />

          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-72 max-w-full animate-pulse rounded bg-slate-100" />
          </div>

          <div className="hidden h-9 w-24 animate-pulse rounded-full bg-slate-100 sm:block" />

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
  hasFaculty,
  onClear,
  onAdd,
}: {
  hasFaculty: boolean;
  onClear: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="p-12 text-center">

      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600">
        <GraduationCap className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-xl font-black text-[var(--navy)]">
        {hasFaculty
          ? "No matching faculty"
          : "No faculty yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasFaculty
          ? "Try a different search term."
          : "Approved faculty registrations and manually created faculty records will appear here."}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">

        {hasFaculty && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <X className="h-4 w-4" />
            Clear Search
          </button>
        )}

        {!hasFaculty && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Plus className="h-4 w-4" />
            Add Faculty
          </button>
        )}

      </div>
    </div>
  );
}

/*
============================================================
FACULTY MODAL
============================================================
*/

function FacultyModal({
  form,
  setForm,
  editing,
  saving,
  onClose,
  onSubmit,
}: {
  form: FacultyForm;
  setForm: Dispatch<
    SetStateAction<FacultyForm>
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
      aria-labelledby="faculty-modal-title"
    >
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">

          <div>

            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
              <GraduationCap className="h-3.5 w-3.5" />
              Faculty Administration
            </div>

            <h2
              id="faculty-modal-title"
              className="text-xl font-black text-slate-900"
            >
              {editing
                ? "Edit Faculty"
                : "Add Faculty"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editing
                ? "Update the faculty information below."
                : "Create a new faculty record in Firestore."}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close faculty form"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={onSubmit}
          className="space-y-6 p-6"
        >

          {/* INFO */}

          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4">

            <div className="flex gap-3">

              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div>

                <p className="font-black text-emerald-800">
                  Faculty Account
                </p>

                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  Faculty Google registrations are approved from the Approvals page. This form manages faculty records.
                </p>

              </div>

            </div>

          </div>

          {/* PERSONAL INFORMATION */}

          <div>

            <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-slate-400">
              Personal Information
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">

              <Input
                label="Faculty ID"
                value={
                  form.facultyId
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      facultyId:
                        value.toUpperCase(),
                    })
                  )
                }
                placeholder="FAC001"
              />

              <Input
                label="Faculty Name *"
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
                placeholder="Faculty full name"
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
                      email:
                        value,
                    })
                  )
                }
                placeholder="faculty@example.com"
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
                      phone:
                        value
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

            <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-slate-400">
              Professional Information
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">

              <Input
                label="Department"
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
                label="Designation"
                value={
                  form.designation
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      designation:
                        value,
                    })
                  )
                }
                placeholder="Assistant Professor"
              />

              <Input
                label="Qualification"
                value={
                  form.qualification
                }
                onChange={(
                  value
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      qualification:
                        value,
                    })
                  )
                }
                placeholder="MCA, NET"
              />

              <div>
                <label
                  htmlFor="faculty-joining-date"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Joining Date
                </label>

                <input
                  id="faculty-joining-date"
                  type="date"
                  value={
                    form.joiningDate
                  }
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (
                        current
                      ) => ({
                        ...current,
                        joiningDate:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="faculty-status"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Employment Status
                </label>

                <select
                  id="faculty-status"
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                  <option value="On Leave">
                    On Leave
                  </option>

                  <option value="Retired">
                    Retired
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
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
                    ? "Update Faculty"
                    : "Save Faculty"}
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
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
      />

    </div>
  );
}

/*
============================================================
HELPERS
============================================================
*/

function getInitial(
  name: string
): string {
  return (
    name
      .trim()
      .charAt(0)
      .toUpperCase() ||
    "F"
  );
}

function formatDate(
  value: string
): string {
  if (!value) {
    return "Not assigned";
  }

  const date = new Date(value);

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

