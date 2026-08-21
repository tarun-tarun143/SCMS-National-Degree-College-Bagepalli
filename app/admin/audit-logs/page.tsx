
"use client";

import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  User,
  X,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
  type ElementType,
} from "react";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";

/* ============================================================
   TYPES
============================================================ */

type AuditLog = {
  id: string;
  action: string;
  module?: string;
  description?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  targetId?: string;
  targetName?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: unknown;
  metadata?: Record<string, unknown>;
};

type FilterType =
  | "all"
  | "create"
  | "update"
  | "delete"
  | "approve"
  | "reject"
  | "login"
  | "logout"
  | "publish"
  | "archive";

/* ============================================================
   ACTION LABELS
============================================================ */

const actionLabels: Record<string, string> = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
  approve: "Approved",
  reject: "Rejected",
  login: "Login",
  logout: "Logout",
  publish: "Published",
  archive: "Archived",
  other: "Activity",
};

/* ============================================================
   ACTION STYLE
============================================================ */

function getActionStyle(action: string) {
  const value = action.toLowerCase();

  if (value === "create") {
    return {
      wrapper:
        "bg-blue-50 text-blue-700 border-blue-100",
      badge:
        "bg-blue-50 text-blue-700",
    };
  }

  if (value === "update") {
    return {
      wrapper:
        "bg-purple-50 text-purple-700 border-purple-100",
      badge:
        "bg-purple-50 text-purple-700",
    };
  }

  if (value === "delete") {
    return {
      wrapper:
        "bg-red-50 text-red-700 border-red-100",
      badge:
        "bg-red-50 text-red-700",
    };
  }

  if (value === "approve") {
    return {
      wrapper:
        "bg-emerald-50 text-emerald-700 border-emerald-100",
      badge:
        "bg-emerald-50 text-emerald-700",
    };
  }

  if (value === "reject") {
    return {
      wrapper:
        "bg-orange-50 text-orange-700 border-orange-100",
      badge:
        "bg-orange-50 text-orange-700",
    };
  }

  if (value === "login") {
    return {
      wrapper:
        "bg-cyan-50 text-cyan-700 border-cyan-100",
      badge:
        "bg-cyan-50 text-cyan-700",
    };
  }

  if (value === "logout") {
    return {
      wrapper:
        "bg-slate-100 text-slate-700 border-slate-200",
      badge:
        "bg-slate-100 text-slate-700",
    };
  }

  if (value === "publish") {
    return {
      wrapper:
        "bg-indigo-50 text-indigo-700 border-indigo-100",
      badge:
        "bg-indigo-50 text-indigo-700",
    };
  }

  if (value === "archive") {
    return {
      wrapper:
        "bg-amber-50 text-amber-700 border-amber-100",
      badge:
        "bg-amber-50 text-amber-700",
    };
  }

  return {
    wrapper:
      "bg-slate-100 text-slate-700 border-slate-200",
    badge:
      "bg-slate-100 text-slate-700",
  };
}

/* ============================================================
   PAGE
============================================================ */

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<FilterType>("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedLog, setSelectedLog] =
    useState<AuditLog | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  /* ==========================================================
     REAL-TIME LISTENER
  ========================================================== */

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

    const logsQuery = query(
      collection(db, "auditLogs"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      logsQuery,
      (snapshot) => {
        const records: AuditLog[] =
          snapshot.docs.map((item) => {
            const data = item.data();

            return {
              id: item.id,
              action: String(
                data.action ?? "other"
              ),
              module: data.module
                ? String(data.module)
                : "",
              description: data.description
                ? String(data.description)
                : "",
              userId: data.userId
                ? String(data.userId)
                : "",
              userName: data.userName
                ? String(data.userName)
                : "",
              userEmail: data.userEmail
                ? String(data.userEmail)
                : "",
              userRole: data.userRole
                ? String(data.userRole)
                : "",
              targetId: data.targetId
                ? String(data.targetId)
                : "",
              targetName: data.targetName
                ? String(data.targetName)
                : "",
              ipAddress: data.ipAddress
                ? String(data.ipAddress)
                : "",
              userAgent: data.userAgent
                ? String(data.userAgent)
                : "",
              createdAt: data.createdAt,
              metadata:
                data.metadata &&
                typeof data.metadata === "object"
                  ? (data.metadata as Record<
                      string,
                      unknown
                    >)
                  : undefined,
            };
          });

        setLogs(records);
        setLoading(false);
        setError("");
      },
      (listenerError) => {
        console.error(
          "Audit logs listener error:",
          listenerError
        );

        setError(
          listenerError instanceof Error
            ? listenerError.message
            : "Unable to load audit logs."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ==========================================================
     FILTERING
  ========================================================== */

  const filteredLogs = useMemo(() => {
    const term = search
      .trim()
      .toLowerCase();

    return logs.filter((log) => {
      const action =
        log.action.toLowerCase();

      const matchesFilter =
        filter === "all" ||
        action === filter;

      if (!matchesFilter) {
        return false;
      }

      if (!term) {
        return true;
      }

      return [
        log.action,
        log.module,
        log.description,
        log.userName,
        log.userEmail,
        log.userRole,
        log.targetId,
        log.targetName,
        log.ipAddress,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [logs, search, filter]);

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const todayCount = useMemo(() => {
    const today = new Date();

    return logs.filter((log) => {
      const date = getDateFromValue(
        log.createdAt
      );

      if (!date) {
        return false;
      }

      return (
        date.getFullYear() ===
          today.getFullYear() &&
        date.getMonth() ===
          today.getMonth() &&
        date.getDate() ===
          today.getDate()
      );
    }).length;
  }, [logs]);

  const securityCount = useMemo(() => {
    return logs.filter((log) => {
      const action =
        log.action.toLowerCase();

      return [
        "login",
        "logout",
        "approve",
        "reject",
      ].includes(action);
    }).length;
  }, [logs]);

  const adminActionCount = useMemo(() => {
    return logs.filter((log) =>
      [
        "create",
        "update",
        "delete",
        "approve",
        "reject",
        "publish",
        "archive",
      ].includes(
        log.action.toLowerCase()
      )
    ).length;
  }, [logs]);

  /* ==========================================================
     DELETE
  ========================================================== */

  async function handleDelete(log: AuditLog) {
    const db = firestoreDb;

    if (!db) {
      setError(
        "Firestore is not initialized."
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Delete this audit log permanently?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(log.id);
      setError("");
      setSuccess("");

      await deleteDoc(
        doc(
          db,
          "auditLogs",
          log.id
        )
      );

      if (
        selectedLog?.id ===
        log.id
      ) {
        setSelectedLog(null);
      }

      setSuccess(
        "Audit log deleted successfully."
      );
    } catch (err) {
      console.error(
        "Audit log delete error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete audit log."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function clearFilters() {
    setSearch("");
    setFilter("all");
  }

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <PortalShell
      role="admin"
      title="Audit Logs"
    >
      <main className="space-y-8 pb-10">

        <PageHeading
          eyebrow="Security & monitoring"
          title="Audit Logs"
          description="Monitor important administrative activity, account actions and changes across the SCMS platform in real time."
        />

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

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={ShieldCheck}
            label="Total Logs"
            value={logs.length}
            description="All recorded activity"
            gradient="from-blue-600 to-cyan-500"
          />

          <StatCard
            icon={Clock3}
            label="Today"
            value={todayCount}
            description="Activity recorded today"
            gradient="from-purple-600 to-violet-500"
          />

          <StatCard
            icon={Activity}
            label="Admin Actions"
            value={adminActionCount}
            description="Management activity"
            gradient="from-emerald-600 to-teal-500"
          />

          <StatCard
            icon={ShieldCheck}
            label="Security Events"
            value={securityCount}
            description="Login and approval activity"
            gradient="from-orange-500 to-amber-500"
          />

        </section>

        {/* SEARCH */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="flex items-center gap-2">

                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>

                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                  Live monitoring
                </span>

              </div>

              <h2 className="mt-1 text-xl font-black text-[var(--navy)]">
                Activity History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Every log is synchronized with Firestore in real time.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="relative">

                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search audit logs..."
                  aria-label="Search audit logs"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 sm:w-72"
                />

              </div>

              <div className="relative">

                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(
                      event.target.value as FilterType
                    )
                  }
                  aria-label="Filter audit logs"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:w-44"
                >
                  <option value="all">
                    All actions
                  </option>
                  <option value="create">
                    Created
                  </option>
                  <option value="update">
                    Updated
                  </option>
                  <option value="delete">
                    Deleted
                  </option>
                  <option value="approve">
                    Approved
                  </option>
                  <option value="reject">
                    Rejected
                  </option>
                  <option value="login">
                    Login
                  </option>
                  <option value="logout">
                    Logout
                  </option>
                  <option value="publish">
                    Published
                  </option>
                  <option value="archive">
                    Archived
                  </option>
                </select>

              </div>

              {(search ||
                filter !== "all") && (
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
              )}

            </div>

          </div>

        </section>

        {/* STATUS */}

        <div className="flex flex-wrap items-center gap-3">

          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            Real-time audit stream
          </span>

          <span className="text-[10px] font-semibold text-slate-400">
            {filteredLogs.length} visible logs
          </span>

        </div>

        {/* TABLE */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {loading ? (
            <LoadingState />
          ) : filteredLogs.length ===
            0 ? (
            <EmptyState
              hasFilters={
                Boolean(
                  search ||
                    filter !==
                      "all"
                )
              }
              onClear={
                clearFilters
              }
            />
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead>

                  <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-blue-50/40 to-violet-50/30">

                    <TableHeader>
                      Activity
                    </TableHeader>

                    <TableHeader>
                      User
                    </TableHeader>

                    <TableHeader>
                      Module
                    </TableHeader>

                    <TableHeader>
                      Target
                    </TableHeader>

                    <TableHeader>
                      Time
                    </TableHeader>

                    <TableHeader align="right">
                      Action
                    </TableHeader>

                  </tr>

                </thead>

                <tbody>

                  {filteredLogs.map(
                    (log) => {
                      const isDeleting =
                        deletingId ===
                        log.id;

                      const styles =
                        getActionStyle(
                          log.action
                        );

                      return (
                        <tr
                          key={log.id}
                          className="border-b border-slate-100 transition hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-white hover:to-violet-50/20"
                        >

                          {/* ACTIVITY */}

                          <td className="px-5 py-4">

                            <div className="flex items-start gap-3">

                              <div
                                className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border ${styles.wrapper}`}
                              >
                                <Activity className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                  <span
                                    className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${styles.badge}`}
                                  >
                                    {actionLabels[
                                      log.action.toLowerCase()
                                    ] ??
                                      log.action}
                                  </span>

                                  {log.module && (
                                    <span className="text-xs font-bold text-slate-400">
                                      {log.module}
                                    </span>
                                  )}

                                </div>

                                <p className="mt-2 max-w-md text-sm font-semibold text-slate-700">
                                  {log.description ||
                                    "System activity recorded."}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* USER */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-100 to-violet-100 text-blue-700">
                                <User className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">

                                <p className="truncate text-sm font-bold text-slate-800">
                                  {log.userName ||
                                    "Unknown user"}
                                </p>

                                <p className="max-w-[200px] truncate text-xs text-slate-400">
                                  {log.userEmail ||
                                    log.userId ||
                                    "No user information"}
                                </p>

                                {log.userRole && (
                                  <span className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-500">
                                    {log.userRole}
                                  </span>
                                )}

                              </div>

                            </div>

                          </td>

                          {/* MODULE */}

                          <td className="px-5 py-4">

                            <span className="inline-flex rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                              {log.module ||
                                "System"}
                            </span>

                          </td>

                          {/* TARGET */}

                          <td className="px-5 py-4">

                            <div>

                              <p className="text-sm font-bold text-slate-700">
                                {log.targetName ||
                                  "—"}
                              </p>

                              {log.targetId && (
                                <p className="mt-1 max-w-[180px] truncate font-mono text-[10px] text-slate-400">
                                  {log.targetId}
                                </p>
                              )}

                            </div>

                          </td>

                          {/* TIME */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

                              <Clock3 className="h-4 w-4 text-slate-400" />

                              {formatDate(
                                log.createdAt
                              )}

                            </div>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedLog(
                                    log
                                  )
                                }
                                className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 transition hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-sm"
                                title="View details"
                                aria-label="View audit log details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  void handleDelete(
                                    log
                                  )
                                }
                                disabled={
                                  isDeleting
                                }
                                className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600 transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                                title="Delete log"
                                aria-label="Delete audit log"
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

        {selectedLog && (
          <AuditLogModal
            log={selectedLog}
            onClose={() =>
              setSelectedLog(null)
            }
            onDelete={() =>
              void handleDelete(
                selectedLog
              )
            }
          />
        )}

      </main>
    </PortalShell>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  gradient,
}: {
  icon: ElementType;
  label: string;
  value: number;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl">

      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition duration-500 group-hover:scale-150`}
      />

      <div className="relative">

        <div
          className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg transition duration-300 group-hover:scale-110`}
        >
          <Icon className="h-6 w-6" />
        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-4xl font-black tracking-tight text-[var(--navy)]">
          {value.toLocaleString()}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>

        <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full w-1/2 rounded-full bg-gradient-to-r ${gradient} transition-all duration-500 group-hover:w-full`}
          />
        </div>

      </div>
    </div>
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
   ALERT
============================================================ */

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
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
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
          aria-label="Close message"
          className={`rounded-lg p-1 ${
            isSuccess
              ? "text-emerald-600 hover:bg-emerald-100"
              : "text-red-600 hover:bg-red-100"
          }`}
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

          </div>
        </div>
      ))}

    </div>
  );
}

/* ============================================================
   EMPTY
============================================================ */

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="p-14 text-center">

      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600">
        <ShieldCheck className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-800">
        No audit logs found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasFilters
          ? "No activity matches your current search or filter."
          : "No audit activity has been recorded yet."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <RefreshCw className="h-4 w-4" />
          Reset Filters
        </button>
      )}

    </div>
  );
}

/* ============================================================
   DETAILS MODAL
============================================================ */

function AuditLogModal({
  log,
  onClose,
  onDelete,
}: {
  log: AuditLog;
  onClose: () => void;
  onDelete: () => void;
}) {
  const styles =
    getActionStyle(
      log.action
    );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-log-modal-title"
      >

        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">

          <div>

            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Security activity
            </p>

            <h2
              id="audit-log-modal-title"
              className="mt-1 text-xl font-black text-slate-900"
            >
              Audit Log Details
            </h2>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="Close audit log details"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        <div className="space-y-6 p-6">

          {/* ACTION */}

          <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5">

            <div
              className={`grid h-12 w-12 place-items-center rounded-2xl border ${styles.wrapper}`}
            >
              <Activity className="h-5 w-5" />
            </div>

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${styles.badge}`}
                >
                  {actionLabels[
                    log.action.toLowerCase()
                  ] ??
                    log.action}
                </span>

                {log.module && (
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600">
                    {log.module}
                  </span>
                )}

              </div>

              <p className="mt-2 text-sm font-semibold text-slate-700">
                {log.description ||
                  "System activity recorded."}
              </p>

            </div>

          </div>

          {/* USER */}

          <div className="rounded-2xl border border-slate-200 p-5">

            <div className="flex items-center gap-3">

              <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-blue-100 to-violet-100 text-blue-700">
                <User className="h-5 w-5" />
              </div>

              <div>

                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  User
                </p>

                <p className="mt-1 text-sm font-black text-slate-800">
                  {log.userName ||
                    "Unknown user"}
                </p>

                {log.userEmail && (
                  <p className="mt-1 text-xs text-slate-500">
                    {log.userEmail}
                  </p>
                )}

              </div>

            </div>

          </div>

          {/* DETAILS */}

          <div className="grid gap-4 sm:grid-cols-2">

            <Detail
              label="Action"
              value={
                actionLabels[
                  log.action.toLowerCase()
                ] ??
                log.action
              }
            />

            <Detail
              label="Module"
              value={
                log.module ||
                "System"
              }
            />

            <Detail
              label="Role"
              value={
                log.userRole ||
                "Not available"
              }
            />

            <Detail
              label="Target"
              value={
                log.targetName ||
                "Not specified"
              }
            />

            <Detail
              label="Target ID"
              value={
                log.targetId ||
                "Not specified"
              }
            />

            <Detail
              label="IP Address"
              value={
                log.ipAddress ||
                "Not recorded"
              }
            />

            <Detail
              label="Created"
              value={formatDate(
                log.createdAt
              )}
            />

            <Detail
              label="User ID"
              value={
                log.userId ||
                "Not recorded"
              }
            />

          </div>

          {/* USER AGENT */}

          {log.userAgent && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                User Agent
              </p>

              <p className="mt-2 break-all font-mono text-xs leading-5 text-slate-600">
                {log.userAgent}
              </p>

            </div>
          )}

          {/* METADATA */}

          {log.metadata &&
            Object.keys(
              log.metadata
            ).length > 0 && (
              <div className="rounded-2xl border border-slate-200 p-5">

                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Metadata
                </p>

                <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-5 text-slate-200">
                  {JSON.stringify(
                    log.metadata,
                    null,
                    2
                  )}
                </pre>

              </div>
            )}

          {/* BUTTONS */}

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
              onClick={onDelete}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Trash2 className="h-4 w-4" />
              Delete Log
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
   DATE HELPERS
============================================================ */

function getDateFromValue(
  value: unknown
): Date | null {
  if (!value) {
    return null;
  }

  try {
    if (
      typeof value ===
        "object" &&
      value !== null &&
      "toDate" in value &&
      typeof (
        value as {
          toDate?: () => Date;
        }
      ).toDate ===
        "function"
    ) {
      return (
        value as {
          toDate: () => Date;
        }
      ).toDate();
    }

    const date =
      value instanceof Date
        ? value
        : new Date(
            String(value)
          );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return null;
    }

    return date;
  } catch {
    return null;
  }
}

function formatDate(
  value: unknown
): string {
  const date =
    getDateFromValue(value);

  if (!date) {
    return "Recently";
  }

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

