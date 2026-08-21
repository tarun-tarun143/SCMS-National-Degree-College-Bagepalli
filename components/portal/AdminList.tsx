"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  AlertCircle,
  Building2,
  CalendarDays,
  Database,
  GraduationCap,
  Hash,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Users,
  Briefcase,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";

import {
  firestoreDb,
  isFirebaseConfigured,
} from "@/lib/firebase/client";

interface AdminListProps {
  title: string;
  description: string;

  /**
   * Existing pages can still pass rows.
   * They are not required for displaying
   * database records.
   */
  rows?: string[];

  /**
   * Automatically determined from title
   * if type is omitted.
   */
  type?: "student" | "faculty";
}

interface UserRecord {
  uid: string;
  name: string;
  email: string;
  phone: string;
  photoURL: string;
  role: string;
  status: string;

  registerNumber?: string;
  facultyId?: string;
  academicYear?: string;
  department?: string;
  designation?: string;

  createdAt?: unknown;
  updatedAt?: unknown;
}

export default function AdminList({
  title,
  description,
  type,
}: AdminListProps) {
  const [records, setRecords] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Determine whether this page displays
   * students or faculty.
   */
  const recordType: "student" | "faculty" =
    type ??
    (title.toLowerCase().includes("faculty")
      ? "faculty"
      : "student");

  /**
   * ============================================================
   * LOAD USERS
   * ============================================================
   */
  const loadUsers = useCallback(
    async (isRefresh = false) => {
      if (!isFirebaseConfigured || !firestoreDb) {
        setError(
          "Firebase is not configured. Check your .env.local file."
        );
        setLoading(false);
        return;
      }

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        /**
         * Read records from:
         *
         * users
         *
         * Only records matching the current role
         * and active status are displayed.
         */
        const usersQuery = query(
          collection(firestoreDb, "users"),
          where("role", "==", recordType),
          where("status", "==", "active")
        );

        const snapshot = await getDocs(usersQuery);

        const loadedUsers: UserRecord[] =
          snapshot.docs.map((document) => {
            const data = document.data();

            return {
              uid: document.id,

              name:
                typeof data.name === "string"
                  ? data.name
                  : "Unnamed User",

              email:
                typeof data.email === "string"
                  ? data.email
                  : "",

              phone:
                typeof data.phone === "string"
                  ? data.phone
                  : "",

              photoURL:
                typeof data.photoURL === "string"
                  ? data.photoURL
                  : "",

              role:
                typeof data.role === "string"
                  ? data.role
                  : "",

              status:
                typeof data.status === "string"
                  ? data.status
                  : "",

              registerNumber:
                typeof data.registerNumber === "string"
                  ? data.registerNumber
                  : undefined,

              facultyId:
                typeof data.facultyId === "string"
                  ? data.facultyId
                  : undefined,

              academicYear:
                typeof data.academicYear === "string"
                  ? data.academicYear
                  : undefined,

              department:
                typeof data.department === "string"
                  ? data.department
                  : undefined,

              designation:
                typeof data.designation === "string"
                  ? data.designation
                  : undefined,

              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            };
          });

        /**
         * Sort newest records first.
         *
         * This is done on the client so we don't
         * need a Firestore composite index.
         */
        loadedUsers.sort((a, b) => {
          const aTime = getTimestampValue(a.createdAt);
          const bTime = getTimestampValue(b.createdAt);

          return bTime - aTime;
        });

        setRecords(loadedUsers);
      } catch (err) {
        console.error(
          "Admin users loading error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load users from Firestore."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [recordType]
  );

  /**
   * ============================================================
   * INITIAL LOAD
   * ============================================================
   */
  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  /**
   * ============================================================
   * SEARCH
   * ============================================================
   */
  const filteredRecords = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return records;
    }

    return records.filter((user) => {
      const searchable = [
        user.name,
        user.email,
        user.phone,
        user.registerNumber ?? "",
        user.facultyId ?? "",
        user.department ?? "",
        user.designation ?? "",
        user.academicYear ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(value);
    });
  }, [records, search]);

  /**
   * ============================================================
   * PAGE
   * ============================================================
   */
  return (
    <PortalShell
      role="admin"
      title={title}
    >
      <main className="space-y-6 pb-10">
        <PageHeading
          title={title}
          description={description}
        />

        {/* =====================================================
            STATISTICS
        ====================================================== */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={
              recordType === "student"
                ? GraduationCap
                : Users
            }
            label={
              recordType === "student"
                ? "Active Students"
                : "Active Faculty"
            }
            value={records.length}
          />

          <StatCard
            icon={Database}
            label="Database Records"
            value={records.length}
          />

          <StatCard
            icon={Search}
            label="Search Results"
            value={filteredRecords.length}
          />
        </section>

        {/* =====================================================
            ERROR
        ====================================================== */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div className="min-w-0">
                <p className="font-black text-red-800">
                  Unable to load records
                </p>

                <p className="mt-1 break-words text-sm leading-6 text-red-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => void loadUsers(true)}
                  disabled={refreshing}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />

                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            MAIN LIST
        ====================================================== */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                {recordType === "student"
                  ? "Student Records"
                  : "Faculty Records"}
              </p>

              <h2 className="mt-1 text-xl font-black text-[var(--navy)]">
                {records.length.toLocaleString()} active{" "}
                {recordType === "student"
                  ? records.length === 1
                    ? "student"
                    : "students"
                  : records.length === 1
                    ? "faculty member"
                    : "faculty members"}
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder={
                    recordType === "student"
                      ? "Search students..."
                      : "Search faculty..."
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-72"
                />
              </div>

              {/* Refresh */}
              <button
                type="button"
                disabled={refreshing}
                onClick={() => void loadUsers(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />

                Refresh
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && <LoadingState />}

          {/* Empty */}
          {!loading &&
            !error &&
            filteredRecords.length === 0 && (
              <EmptyState
                type={recordType}
                hasSearch={Boolean(search.trim())}
              />
            )}

          {/* Records */}
          {!loading &&
            !error &&
            filteredRecords.length > 0 && (
              <div className="divide-y divide-slate-100">
                {filteredRecords.map((user) => (
                  <UserRow
                    key={user.uid}
                    user={user}
                    type={recordType}
                  />
                ))}
              </div>
            )}
        </section>
      </main>
    </PortalShell>
  );
}

/**
 * ============================================================
 * USER ROW
 * ============================================================
 */
function UserRow({
  user,
  type,
}: {
  user: UserRecord;
  type: "student" | "faculty";
}) {
  const initials =
    user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join("") || "?";

  const identifier =
    type === "student"
      ? user.registerNumber
      : user.facultyId;

  return (
    <div className="group p-5 transition hover:bg-slate-50">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* User */}
        <div className="flex min-w-0 items-center gap-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={`${user.name} profile`}
              className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-2 ring-slate-100"
              loading="lazy"
            />
          ) : (
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-black text-white shadow-lg">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate text-base font-black text-[var(--navy)]">
              {user.name}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="break-all">
                  {user.email || "No email"}
                </span>
              </span>

              {user.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {user.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid gap-4 sm:grid-cols-2 lg:flex lg:items-center lg:gap-5">
          <Detail
            icon={Hash}
            label={
              type === "student"
                ? "Register No."
                : "Faculty ID"
            }
            value={identifier || "Not provided"}
          />

          <Detail
            icon={CalendarDays}
            label="Academic Year"
            value={
              user.academicYear ||
              "Not provided"
            }
          />

          {type === "faculty" && (
            <>
              <Detail
                icon={Building2}
                label="Department"
                value={
                  user.department ||
                  "Not provided"
                }
              />

              <Detail
                icon={Briefcase}
                label="Designation"
                value={
                  user.designation ||
                  "Not provided"
                }
              />
            </>
          )}

          <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================================
 * DETAIL
 * ============================================================
 */
function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-32">
      <p className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
        <Icon className="h-3 w-3" />
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}

/**
 * ============================================================
 * STAT CARD
 * ============================================================
 */
function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black text-[var(--navy)]">
            {value.toLocaleString()}
          </p>
        </div>

        <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================================
 * LOADING STATE
 * ============================================================
 */
function LoadingState() {
  return (
    <div className="divide-y divide-slate-100">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="animate-pulse p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-4">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-slate-100" />

              <div className="flex-1">
                <div className="h-4 w-48 rounded bg-slate-100" />

                <div className="mt-3 h-3 w-72 max-w-full rounded bg-slate-100" />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-10 w-24 rounded bg-slate-100" />
              <div className="h-10 w-24 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ============================================================
 * EMPTY STATE
 * ============================================================
 */
function EmptyState({
  type,
  hasSearch,
}: {
  type: "student" | "faculty";
  hasSearch: boolean;
}) {
  return (
    <div className="p-12 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-400">
        {type === "student" ? (
          <GraduationCap className="h-7 w-7" />
        ) : (
          <Users className="h-7 w-7" />
        )}
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-800">
        {hasSearch
          ? "No matching records"
          : `No active ${type} records`}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasSearch
          ? "Try searching with another name, email, ID, phone number or department."
          : `Approved ${type} registrations will automatically appear here.`}
      </p>
    </div>
  );
}

/**
 * ============================================================
 * FIRESTORE TIMESTAMP HELPER
 * ============================================================
 */
function getTimestampValue(
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

  if (typeof value === "string") {
    const time = new Date(value).getTime();

    return Number.isNaN(time)
      ? 0
      : time;
  }

  if (typeof value === "number") {
    return value;
  }

  return 0;
}