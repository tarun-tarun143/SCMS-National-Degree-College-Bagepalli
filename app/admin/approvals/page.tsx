"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import {
  CheckCircle2,
  Clock3,
  GraduationCap,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  XCircle,
  CalendarDays,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";

/* ============================================================
   TYPES
============================================================ */

type RegistrationRole =
  | "student"
  | "faculty"
  | "pending";

type PendingUser = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  photoURL: string;
  role: RegistrationRole;
  status: string;
  approvalStatus: string;
  year: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

type FilterType =
  | "all"
  | "student"
  | "faculty";

/* ============================================================
   ROLE NORMALIZER
============================================================ */

function normalizeRegistrationRole(
  value: unknown
): RegistrationRole {
  if (typeof value !== "string") {
    return "pending";
  }

  const role = value.trim().toLowerCase();

  if (role === "student") {
    return "student";
  }

  if (role === "faculty") {
    return "faculty";
  }

  return "pending";
}

/* ============================================================
   PAGE
============================================================ */

export default function ApprovalsPage() {
  const [users, setUsers] =
    useState<PendingUser[]>([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<FilterType>("all");

  const [loading, setLoading] =
    useState(true);

  const [processingUid, setProcessingUid] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* ==========================================================
     REAL-TIME PENDING REGISTRATIONS
  ========================================================== */

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
      collection(db, "users"),

      (snapshot) => {
        const pendingUsers: PendingUser[] =
          snapshot.docs
            .map((item): PendingUser => {
              const data = item.data();

              const role =
                normalizeRegistrationRole(
                  data.role
                );

              return {
                uid: item.id,

                name:
                  typeof data.name ===
                  "string"
                    ? data.name
                    : "",

                email:
                  typeof data.email ===
                  "string"
                    ? data.email
                    : "",

                phone:
                  typeof data.phone ===
                  "string"
                    ? data.phone
                    : "",

                photoURL:
                  typeof data.photoURL ===
                  "string"
                    ? data.photoURL
                    : "",

                role,

                status:
                  typeof data.status ===
                  "string"
                    ? data.status
                    : "pending",

                approvalStatus:
                  typeof data.approvalStatus ===
                  "string"
                    ? data.approvalStatus
                    : "pending",

                year:
                  typeof data.year ===
                  "string"
                    ? data.year
                    : "",

                createdAt:
                  data.createdAt,

                updatedAt:
                  data.updatedAt,
              };
            })
            .filter((user) => {
              const status =
                user.status
                  .trim()
                  .toLowerCase();

              const approval =
                user.approvalStatus
                  .trim()
                  .toLowerCase();

              return (
                status === "pending" ||
                approval === "pending"
              );
            });

        pendingUsers.sort(
          (a, b) =>
            getTime(b.createdAt) -
            getTime(a.createdAt)
        );

        setUsers(pendingUsers);
        setLoading(false);
      },

      (listenerError) => {
        console.error(
          "Approval listener error:",
          listenerError
        );

        setError(
          listenerError instanceof Error
            ? listenerError.message
            : "Unable to load pending registrations."
        );

        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  /* ==========================================================
     FILTER
  ========================================================== */

  const filteredUsers = useMemo(() => {
    const term = search
      .trim()
      .toLowerCase();

    return users.filter((user) => {
      const matchesRole =
        filter === "all" ||
        user.role === filter;

      if (!matchesRole) {
        return false;
      }

      if (!term) {
        return true;
      }

      return [
        user.name,
        user.email,
        user.phone,
        user.year,
        user.role,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [
    users,
    search,
    filter,
  ]);

  /* ==========================================================
     COUNTS
  ========================================================== */

  const studentPendingCount =
    users.filter(
      (user) =>
        user.role === "student"
    ).length;

  const facultyPendingCount =
    users.filter(
      (user) =>
        user.role === "faculty"
    ).length;

  /* ==========================================================
     APPROVE
  ========================================================== */

  async function approveUser(
    user: PendingUser
  ) {
    const db = firestoreDb;

    if (!db) {
      setError(
        "Firestore is not initialized."
      );
      return;
    }

    if (
      user.role !== "student" &&
      user.role !== "faculty"
    ) {
      setError(
        "Invalid registration role."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Approve ${
          user.name || "this user"
        } as ${
          user.role === "student"
            ? "Student"
            : "Faculty"
        }?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingUid(user.uid);
      setError("");
      setSuccess("");

      const now =
        serverTimestamp();

      /* ======================================================
         STUDENT
      ====================================================== */

      if (user.role === "student") {
        await setDoc(
          doc(
            db,
            "students",
            user.uid
          ),
          {
            uid: user.uid,
            name: user.name,
            email: user.email,
            phone: user.phone,
            photoURL:
              user.photoURL || "",

            year:
              user.year || "",

            studentId: "",
            registerNumber: "",
            department: "",
            course: "",
            semester: "",
            admissionYear: "",

            status: "Active",

            approvedAt: now,
            createdAt: now,
            updatedAt: now,
          },
          {
            merge: true,
          }
        );

        await updateDoc(
          doc(
            db,
            "users",
            user.uid
          ),
          {
            role: "student",
            status: "active",
            approvalStatus:
              "approved",
            approvedAt:
              serverTimestamp(),
            updatedAt:
              serverTimestamp(),
          }
        );

        setSuccess(
          `${
            user.name || "Student"
          } has been approved successfully.`
        );

        return;
      }

      /* ======================================================
         FACULTY
      ====================================================== */

      if (user.role === "faculty") {
        await setDoc(
          doc(
            db,
            "faculty",
            user.uid
          ),
          {
            uid: user.uid,
            name: user.name,
            email: user.email,
            phone: user.phone,
            photoURL:
              user.photoURL || "",

            department: "",
            designation: "",
            qualification: "",
            joiningDate: "",

            status: "Active",

            approvedAt: now,
            createdAt: now,
            updatedAt: now,
          },
          {
            merge: true,
          }
        );

        await updateDoc(
          doc(
            db,
            "users",
            user.uid
          ),
          {
            role: "faculty",
            status: "active",
            approvalStatus:
              "approved",
            approvedAt:
              serverTimestamp(),
            updatedAt:
              serverTimestamp(),
          }
        );

        setSuccess(
          `${
            user.name ||
            "Faculty member"
          } has been approved successfully.`
        );
      }
    } catch (err) {
      console.error(
        "Approval error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to approve registration."
      );
    } finally {
      setProcessingUid(null);
    }
  }

  /* ==========================================================
     REJECT
  ========================================================== */

  async function rejectUser(
    user: PendingUser
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
        `Reject the registration of ${
          user.name || "this user"
        }?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingUid(user.uid);
      setError("");
      setSuccess("");

      await updateDoc(
        doc(
          db,
          "users",
          user.uid
        ),
        {
          status: "rejected",
          approvalStatus:
            "rejected",
          rejectedAt:
            serverTimestamp(),
          updatedAt:
            serverTimestamp(),
        }
      );

      setSuccess(
        `${
          user.name || "User"
        }'s registration has been rejected.`
      );
    } catch (err) {
      console.error(
        "Rejection error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to reject registration."
      );
    } finally {
      setProcessingUid(null);
    }
  }

  /* ==========================================================
     REFRESH VISUAL STATE
  ========================================================== */

  function handleRefresh() {
    setError("");
    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
    }, 300);
  }

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <PortalShell
      role="admin"
      title="Approvals"
    >
      <main className="space-y-8 pb-10">
        <PageHeading
          eyebrow="Administration"
          title="Registration Approvals"
          description="Review and approve new student and faculty registration requests in real time."
        />

        {/* ==================================================
            MESSAGES
        ================================================== */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-red-800">
                  Approval error
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <p className="text-sm font-bold text-emerald-800">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* ==================================================
            STATISTICS
        ================================================== */}

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={Clock3}
            label="Pending Requests"
            value={users.length}
            color="amber"
          />

          <StatCard
            icon={GraduationCap}
            label="Student Requests"
            value={
              studentPendingCount
            }
            color="blue"
          />

          <StatCard
            icon={Users}
            label="Faculty Requests"
            value={
              facultyPendingCount
            }
            color="emerald"
          />
        </section>

        {/* ==================================================
            TOOLBAR
        ================================================== */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>

                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                  Live
                </span>
              </div>

              <h2 className="mt-2 text-xl font-black text-[var(--navy)]">
                Pending Registrations
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                New registration requests appear automatically.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
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
                  placeholder="Search registrations..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white sm:w-72"
                />
              </div>

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(
                    event.target
                      .value as FilterType
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="all">
                  All
                </option>

                <option value="student">
                  Students
                </option>

                <option value="faculty">
                  Faculty
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* ==================================================
            REQUESTS
        ================================================== */}

        <section className="space-y-4">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
              <div className="flex items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />

                <span className="ml-3 text-sm font-semibold text-slate-500">
                  Loading registration requests...
                </span>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <ShieldCheck className="mx-auto h-14 w-14 text-emerald-300" />

              <h3 className="mt-4 text-xl font-black text-slate-700">
                No pending registrations
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                New student and faculty registration requests will automatically appear here.
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <ApprovalCard
                key={user.uid}
                user={user}
                processing={
                  processingUid ===
                  user.uid
                }
                onApprove={() =>
                  void approveUser(
                    user
                  )
                }
                onReject={() =>
                  void rejectUser(
                    user
                  )
                }
              />
            ))
          )}
        </section>
      </main>
    </PortalShell>
  );
}

/* ============================================================
   APPROVAL CARD
============================================================ */

function ApprovalCard({
  user,
  processing,
  onApprove,
  onReject,
}: {
  user: PendingUser;
  processing: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isStudent =
    user.role === "student";

  const displayName =
    user.name.trim() ||
    "Unnamed User";

  const initial =
    displayName
      .charAt(0)
      .toUpperCase() || "U";

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
      <div className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* USER */}

          <div className="flex min-w-0 gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-2 ring-slate-100"
              />
            ) : (
              <div
                className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-lg font-black ${
                  isStudent
                    ? "bg-blue-100 text-blue-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {initial}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-lg font-black text-slate-900">
                  {displayName}
                </h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    isStudent
                      ? "bg-blue-50 text-blue-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {isStudent
                    ? "Student"
                    : "Faculty"}
                </span>

                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                  Pending
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  {user.email ||
                    "No email"}
                </span>

                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  {user.phone ||
                    "No phone"}
                </span>

                {isStudent && (
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    {user.year ||
                      "Year not provided"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ACTIONS */}

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              disabled={processing}
              onClick={onReject}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </button>

            <button
              type="button"
              disabled={processing}
              onClick={onApprove}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isStudent
                  ? "bg-blue-600 shadow-blue-600/20 hover:bg-blue-700"
                  : "bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700"
              }`}
            >
              {processing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}

              {processing
                ? "Processing..."
                : "Approve"}
            </button>
          </div>
        </div>

        {/* DETAILS */}

        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <Detail
            label="Email"
            value={
              user.email ||
              "Not provided"
            }
          />

          <Detail
            label="Phone"
            value={
              user.phone ||
              "Not provided"
            }
          />

          {isStudent && (
            <Detail
              label="Current Year"
              value={
                user.year ||
                "Not provided"
              }
            />
          )}

          <Detail
            label="Account Role"
            value={
              isStudent
                ? "Student"
                : "Faculty"
            }
          />

          <Detail
            label="Approval Status"
            value="Pending"
          />

          <Detail
            label="College ID"
            value="Will be assigned by administrator"
          />
        </div>
      </div>
    </article>
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
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon: Icon,
  label,
  value,
  color = "blue",
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color?:
    | "blue"
    | "emerald"
    | "amber";
}) {
  const colorClasses = {
    blue:
      "bg-blue-50 text-blue-600",
    emerald:
      "bg-emerald-50 text-emerald-600",
    amber:
      "bg-amber-50 text-amber-600",
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-3xl font-black text-[var(--navy)]">
            {value.toLocaleString()}
          </p>
        </div>

        <div
          className={`grid h-11 w-11 place-items-center rounded-xl transition group-hover:scale-110 ${colorClasses[color]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FIRESTORE TIME HELPER
============================================================ */

function getTime(
  value: unknown
): number {
  if (!value) {
    return 0;
  }

  if (
    typeof value === "object" &&
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
    typeof value === "object" &&
    value !== null &&
    "seconds" in value
  ) {
    const seconds = Number(
      (
        value as {
          seconds?: unknown;
        }
      ).seconds ?? 0
    );

    return Number.isFinite(seconds)
      ? seconds * 1000
      : 0;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "string") {
    const time =
      new Date(value).getTime();

    return Number.isNaN(time)
      ? 0
      : time;
  }

  return 0;
}