"use client";

import {
  CheckCircle2,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCog,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";
import { useLiveCollection } from "@/hooks/useLiveCollection";

type UserRole =
  | "pending"
  | "student"
  | "faculty"
  | "admin";

type UserStatus =
  | "pending"
  | "active"
  | "inactive";

type Account = {
  id: string;
  uid?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  photoURL?: string;
  phone?: string;
  approvalStatus?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

type FilterRole = "all" | UserRole;

type FilterStatus = "all" | UserStatus;

type RoleStatusValue = {
  role: UserRole;
  status: UserStatus;
};

export default function AdminUsers() {
  return (
    <PortalShell
      role="admin"
      title="User & Role Management"
    >
      <UsersManager />
    </PortalShell>
  );
}

function UsersManager() {
  const {
    data,
    loading,
    error,
  } = useLiveCollection<Account>(
    firestoreDb,
    "users",
    {
      limit: 200,
    }
  );

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState<FilterRole>("all");

  const [statusFilter, setStatusFilter] =
    useState<FilterStatus>("all");

  const [saving, setSaving] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState("");

  const [actionError, setActionError] =
    useState("");

  const normalizedAccounts = useMemo(() => {
    return data.map((account) => ({
      ...account,
      role: normalizeRole(account.role),
      status: normalizeStatus(account.status),
    }));
  }, [data]);

  const filteredAccounts = useMemo(() => {
    const term =
      search.trim().toLowerCase();

    return normalizedAccounts.filter(
      (account) => {
        const matchesSearch =
          !term ||
          [
            account.name,
            account.email,
            account.uid,
            account.phone,
            account.role,
            account.status,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(term);

        const matchesRole =
          roleFilter === "all" ||
          account.role === roleFilter;

        const matchesStatus =
          statusFilter === "all" ||
          account.status === statusFilter;

        return (
          matchesSearch &&
          matchesRole &&
          matchesStatus
        );
      }
    );
  }, [
    normalizedAccounts,
    roleFilter,
    search,
    statusFilter,
  ]);

  const totalUsers =
    normalizedAccounts.length;

  const activeUsers =
    normalizedAccounts.filter(
      (account) =>
        account.status === "active"
    ).length;

  const pendingUsers =
    normalizedAccounts.filter(
      (account) =>
        account.status === "pending"
    ).length;

  const inactiveUsers =
    normalizedAccounts.filter(
      (account) =>
        account.status === "inactive"
    ).length;

  const adminUsers =
    normalizedAccounts.filter(
      (account) =>
        account.role === "admin"
    ).length;

  const studentUsers =
    normalizedAccounts.filter(
      (account) =>
        account.role === "student"
    ).length;

  const facultyUsers =
    normalizedAccounts.filter(
      (account) =>
        account.role === "faculty"
    ).length;

  async function updateAccountAccess(
    account: Account,
    value: string
  ) {
    const db = firestoreDb;

    if (!db) {
      setActionError(
        "Firestore is not initialized."
      );
      return;
    }

    const parsed =
      parseRoleStatusValue(value);

    if (!parsed) {
      setActionError(
        "Invalid role or account status."
      );
      return;
    }

    const currentRole =
      normalizeRole(account.role);

    const currentStatus =
      normalizeStatus(account.status);

    if (
      currentRole === parsed.role &&
      currentStatus === parsed.status
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Change ${
          account.name || "this user"
        } to ${roleLabel(
          parsed.role
        )} · ${statusLabel(
          parsed.status
        )}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(account.id);
      setActionError("");
      setSuccess("");

      await updateDoc(
        doc(
          db,
          "users",
          account.id
        ),
        {
          role: parsed.role,
          status: parsed.status,
          approvalStatus:
            parsed.status === "active"
              ? "approved"
              : parsed.status ===
                  "pending"
                ? "pending"
                : "rejected",
          updatedAt:
            new Date().toISOString(),
        }
      );

      setSuccess(
        `${
          account.name || "User"
        } updated successfully.`
      );
    } catch (err) {
      console.error(
        "User role update failed:",
        err
      );

      setActionError(
        err instanceof Error
          ? err.message
          : "Unable to update this account."
      );
    } finally {
      setSaving(null);
    }
  }

  function clearFilters() {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
  }

  return (
    <main className="space-y-8 pb-10">

      {/* HEADER */}

      <PageHeading
        eyebrow="Central administration"
        title="User & Role Management"
        description="Manage registered accounts, assign portal roles and control account access in real time."
      />

      {/* LIVE STATUS */}

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Real-time users
        </span>

        <span className="text-xs font-semibold text-slate-400">
          Firestore changes appear automatically.
        </span>
      </div>

      {/* ERROR */}

      {(error || actionError) && (
        <AlertBox
          type="error"
          message={
            actionError ||
            error ||
            "Unable to load users."
          }
          onClose={() =>
            setActionError("")
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

      {/* TOP STATISTICS */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ColorStatCard
          label="Total Users"
          value={totalUsers}
          icon={Users}
          iconClass="bg-blue-100 text-blue-700"
          glow="bg-blue-500/10"
          progress="from-blue-500 to-cyan-400"
        />

        <ColorStatCard
          label="Active Users"
          value={activeUsers}
          icon={CheckCircle2}
          iconClass="bg-emerald-100 text-emerald-700"
          glow="bg-emerald-500/10"
          progress="from-emerald-500 to-teal-400"
        />

        <ColorStatCard
          label="Pending Users"
          value={pendingUsers}
          icon={RefreshCw}
          iconClass="bg-amber-100 text-amber-700"
          glow="bg-amber-500/10"
          progress="from-amber-500 to-orange-400"
        />

        <ColorStatCard
          label="Inactive Users"
          value={inactiveUsers}
          icon={ShieldCheck}
          iconClass="bg-violet-100 text-violet-700"
          glow="bg-violet-500/10"
          progress="from-violet-500 to-purple-400"
        />
      </section>

      {/* ROLE SUMMARY */}

      <section className="grid gap-4 sm:grid-cols-3">
        <RoleSummaryCard
          label="Students"
          value={studentUsers}
          icon={Users}
          className="from-blue-50 to-cyan-50"
          iconClass="bg-blue-100 text-blue-700"
        />

        <RoleSummaryCard
          label="Faculty"
          value={facultyUsers}
          icon={UserCog}
          className="from-violet-50 to-purple-50"
          iconClass="bg-violet-100 text-violet-700"
        />

        <RoleSummaryCard
          label="Administrators"
          value={adminUsers}
          icon={ShieldCheck}
          className="from-fuchsia-50 to-pink-50"
          iconClass="bg-fuchsia-100 text-fuchsia-700"
        />
      </section>

      {/* USER DIRECTORY */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        {/* DIRECTORY HEADER */}

        <div className="border-b border-slate-100 bg-gradient-to-r from-white via-blue-50/30 to-violet-50/30 p-5">

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            <div>
              <div className="flex items-center gap-3">

                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/20">
                  <UserCog className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-[var(--navy)]">
                    Live User Directory
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {filteredAccounts.length} of{" "}
                    {totalUsers} accounts shown
                  </p>
                </div>

              </div>
            </div>

            {/* SEARCH */}

            <div className="relative w-full xl:max-w-md">

              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search name, email, UID..."
                aria-label="Search users"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>

          </div>

          {/* FILTERS */}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(
                  event.target
                    .value as FilterRole
                )
              }
              aria-label="Filter by role"
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm outline-none transition hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="all">
                All roles
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="student">
                Student
              </option>

              <option value="faculty">
                Faculty
              </option>

              <option value="admin">
                Administrator
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as FilterStatus
                )
              }
              aria-label="Filter by status"
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm outline-none transition hover:border-violet-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            >
              <option value="all">
                All statuses
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>

            {(search ||
              roleFilter !== "all" ||
              statusFilter !== "all") && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Clear filters
              </button>
            )}

          </div>
        </div>

        {/* LOADING */}

        {loading && (
          <LoadingState />
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          filteredAccounts.length ===
            0 && (
            <EmptyState
              hasUsers={
                totalUsers > 0
              }
              onClear={
                clearFilters
              }
            />
          )}

        {/* USER LIST */}

        {!loading &&
          !error &&
          filteredAccounts.length >
            0 && (
            <div className="divide-y divide-slate-100">

              {filteredAccounts.map(
                (account) => (
                  <UserRow
                    key={account.id}
                    account={
                      account
                    }
                    saving={
                      saving ===
                      account.id
                    }
                    onUpdate={
                      updateAccountAccess
                    }
                  />
                )
              )}

            </div>
          )}
      </section>

    </main>
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
  icon: React.ElementType;
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
ROLE SUMMARY CARD
============================================================
*/

function RoleSummaryCard({
  label,
  value,
  icon: Icon,
  className,
  iconClass,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  className: string;
  iconClass: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black text-[var(--navy)]">
            {value.toLocaleString()}
          </p>
        </div>

        <div
          className={`grid h-12 w-12 place-items-center rounded-2xl shadow-sm transition group-hover:scale-110 ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>

      </div>
    </div>
  );
}

/*
============================================================
USER ROW
============================================================
*/

function UserRow({
  account,
  saving,
  onUpdate,
}: {
  account: Account & {
    role: UserRole;
    status: UserStatus;
  };
  saving: boolean;
  onUpdate: (
    account: Account,
    value: string
  ) => Promise<void>;
}) {
  const currentValue =
    `${account.role}:${account.status}`;

  return (
    <article className="group p-5 transition hover:bg-gradient-to-r hover:from-blue-50/40 hover:via-white hover:to-violet-50/30">

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        {/* USER INFO */}

        <div className="flex min-w-0 items-start gap-4">

          {/* AVATAR */}

          {account.photoURL ? (
            <img
              src={account.photoURL}
              alt=""
              className="h-12 w-12 shrink-0 rounded-2xl object-cover shadow-sm ring-2 ring-white"
            />
          ) : (
            <div
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-sm font-black shadow-sm ${
                account.role ===
                "admin"
                  ? "bg-gradient-to-br from-fuchsia-100 to-pink-100 text-fuchsia-700"
                  : account.role ===
                      "faculty"
                    ? "bg-gradient-to-br from-violet-100 to-purple-100 text-violet-700"
                    : account.role ===
                        "student"
                      ? "bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700"
                      : "bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700"
              }`}
            >
              {getInitial(
                account.name
              )}
            </div>
          )}

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="truncate text-sm font-black text-slate-900">
                {account.name ||
                  "Unnamed user"}
              </h3>

              <RoleBadge
                role={
                  account.role
                }
              />

              <StatusBadge
                status={
                  account.status
                }
              />

            </div>

            <p className="mt-1 truncate text-xs font-medium text-slate-500">
              {account.email ||
                "No email address"}
            </p>

            {account.phone && (
              <p className="mt-1 text-xs text-slate-400">
                {account.phone}
              </p>
            )}

            {account.uid && (
              <p className="mt-2 break-all font-mono text-[10px] text-slate-400">
                UID:{" "}
                {account.uid}
              </p>
            )}

          </div>
        </div>

        {/* CONTROLS */}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

          <label
            htmlFor={`user-role-${account.id}`}
            className="sr-only"
          >
            Change role and status for{" "}
            {account.name ||
              "user"}
          </label>

          <select
            id={`user-role-${account.id}`}
            value={currentValue}
            disabled={saving}
            onChange={(event) =>
              void onUpdate(
                account,
                event.target
                  .value
              )
            }
            className="h-11 min-w-[230px] rounded-xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 px-3 text-xs font-bold text-slate-700 shadow-sm outline-none transition hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="pending:pending">
              Pending
            </option>

            <option value="student:active">
              Student · Active
            </option>

            <option value="faculty:active">
              Faculty · Active
            </option>

            <option value="admin:active">
              Administrator · Active
            </option>

            <option value="student:inactive">
              Student · Inactive
            </option>

            <option value="faculty:inactive">
              Faculty · Inactive
            </option>

            <option value="admin:inactive">
              Administrator · Inactive
            </option>

            <option value="student:pending">
              Student · Pending
            </option>

            <option value="faculty:pending">
              Faculty · Pending
            </option>
          </select>

          <div
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-black shadow-sm ${
              saving
                ? "bg-blue-50 text-blue-600"
                : account.status ===
                    "active"
                  ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700"
                  : account.status ===
                      "inactive"
                    ? "bg-slate-100 text-slate-600"
                    : "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700"
            }`}
          >
            {saving ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5" />
                {statusLabel(
                  account.status
                )}
              </>
            )}
          </div>

        </div>

      </div>
    </article>
  );
}

/*
============================================================
ROLE BADGE
============================================================
*/

function RoleBadge({
  role,
}: {
  role: UserRole;
}) {
  const styles: Record<
    UserRole,
    string
  > = {
    pending:
      "border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700",

    student:
      "border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700",

    faculty:
      "border border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700",

    admin:
      "border border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 to-pink-50 text-fuchsia-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm ${styles[role]}`}
    >
      {roleLabel(role)}
    </span>
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
  status: UserStatus;
}) {
  const styles: Record<
    UserStatus,
    string
  > = {
    pending:
      "border border-amber-200 bg-amber-50 text-amber-700",

    active:
      "border border-emerald-200 bg-emerald-50 text-emerald-700",

    inactive:
      "border border-slate-200 bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${styles[status]}`}
    >
      {statusLabel(status)}
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
      aria-label="Loading users"
      aria-busy="true"
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
          <div className="h-12 w-12 animate-pulse rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100" />

          <div className="flex-1 space-y-2">
            <div className="h-4 w-44 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-64 max-w-full animate-pulse rounded bg-slate-100" />
          </div>

          <div className="hidden h-11 w-56 animate-pulse rounded-xl bg-slate-100 sm:block" />
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
  hasUsers,
  onClear,
}: {
  hasUsers: boolean;
  onClear: () => void;
}) {
  return (
    <div className="p-12 text-center">

      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600">
        <Users className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-xl font-black text-[var(--navy)]">
        {hasUsers
          ? "No matching users"
          : "No registered users"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasUsers
          ? "Try changing your search or filters."
          : "Google accounts will appear here automatically after registration."}
      </p>

      {hasUsers && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          Clear filters
        </button>
      )}

    </div>
  );
}

/*
============================================================
HELPERS
============================================================
*/

function normalizeRole(
  value?: string
): UserRole {
  const normalized =
    value
      ?.trim()
      .toLowerCase();

  if (
    normalized ===
    "student"
  ) {
    return "student";
  }

  if (
    normalized ===
    "faculty"
  ) {
    return "faculty";
  }

  if (
    normalized ===
    "admin"
  ) {
    return "admin";
  }

  return "pending";
}

function normalizeStatus(
  value?: string
): UserStatus {
  const normalized =
    value
      ?.trim()
      .toLowerCase();

  if (
    normalized ===
    "active"
  ) {
    return "active";
  }

  if (
    normalized ===
    "inactive"
  ) {
    return "inactive";
  }

  return "pending";
}

function roleLabel(
  role: UserRole
): string {
  switch (role) {
    case "student":
      return "Student";

    case "faculty":
      return "Faculty";

    case "admin":
      return "Administrator";

    default:
      return "Pending";
  }
}

function statusLabel(
  status: UserStatus
): string {
  switch (status) {
    case "active":
      return "Active";

    case "inactive":
      return "Inactive";

    default:
      return "Pending";
  }
}

function parseRoleStatusValue(
  value: string
): RoleStatusValue | null {
  const [
    role,
    status,
  ] = value.split(":");

  if (
    !isUserRole(role) ||
    !isUserStatus(status)
  ) {
    return null;
  }

  return {
    role,
    status,
  };
}

function isUserRole(
  value: string
): value is UserRole {
  return (
    value === "pending" ||
    value === "student" ||
    value === "faculty" ||
    value === "admin"
  );
}

function isUserStatus(
  value: string
): value is UserStatus {
  return (
    value === "pending" ||
    value === "active" ||
    value === "inactive"
  );
}

function getInitial(
  name?: string
): string {
  const initial =
    name?.trim().charAt(0);

  return initial
    ? initial.toUpperCase()
    : "U";
}