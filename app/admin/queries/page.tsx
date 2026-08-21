"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Mail,
  MessageSquare,
  Search,
  Send,
  Trash2,
  User,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import Badge from "@/components/ui/Badge";
import {
  firestoreDb,
  firebaseAuth,
} from "@/lib/firebase/client";
import { useScmsSession } from "@/lib/auth/session";
import { useLiveCollection } from "@/hooks/useLiveCollection";

type QueryStatus =
  | "new"
  | "in_progress"
  | "resolved"
  | "closed";

type QueryRecord = {
  id: string;
  name?: string;
  email?: string;
  phone?: string | null;
  category?: string;
  subject?: string;
  message?: string;
  status?: QueryStatus;
  emailSent?: boolean;
  reply?: string;
  repliedBy?: string;
  replyEmailSent?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
  repliedAt?: unknown;
};

type StatusFilter = "all" | QueryStatus;

export default function AdminQueriesPage() {
  const { user } = useScmsSession("admin");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [replyOpen, setReplyOpen] =
    useState<string | null>(null);

  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] =
    useState(false);

  const [replyError, setReplyError] =
    useState("");
  const [replySuccess, setReplySuccess] =
    useState("");

  const [deleteLoading, setDeleteLoading] =
    useState<string | null>(null);

  const queries =
    useLiveCollection<QueryRecord>(
      firestoreDb,
      "queries",
      {
        limit: 500,
      }
    );

  const filteredQueries = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return [...queries.data]
      .filter((queryRecord) => {
        if (
          statusFilter !== "all" &&
          (queryRecord.status ?? "new") !==
            statusFilter
        ) {
          return false;
        }

        if (!searchValue) {
          return true;
        }

        const values = [
          queryRecord.name,
          queryRecord.email,
          queryRecord.subject,
          queryRecord.category,
          queryRecord.message,
          queryRecord.id,
        ];

        return values
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(searchValue)
          );
      })
      .sort(
        (a, b) =>
          getTimestampSeconds(b.createdAt) -
          getTimestampSeconds(a.createdAt)
      );
  }, [
    queries.data,
    search,
    statusFilter,
  ]);

  const counts = useMemo(() => {
    const total = queries.data.length;

    const newCount = queries.data.filter(
      (queryRecord) =>
        !queryRecord.status ||
        queryRecord.status === "new"
    ).length;

    const progressCount =
      queries.data.filter(
        (queryRecord) =>
          queryRecord.status ===
          "in_progress"
      ).length;

    const resolvedCount =
      queries.data.filter(
        (queryRecord) =>
          queryRecord.status ===
            "resolved" ||
          queryRecord.status ===
            "closed"
      ).length;

    return {
      total,
      newCount,
      progressCount,
      resolvedCount,
    };
  }, [queries.data]);

  function formatDate(value: unknown) {
    const seconds =
      getTimestampSeconds(value);

    if (seconds > 0) {
      return new Date(
        seconds * 1000
      ).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (typeof value === "string") {
      const parsed = new Date(value);

      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleString(
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
    }

    return "Recently submitted";
  }

  function openReply(
    queryRecord: QueryRecord
  ) {
    setReplyOpen(queryRecord.id);
    setReplyText("");
    setReplyError("");
    setReplySuccess("");
  }

  function closeReply() {
    if (replyLoading) {
      return;
    }

    setReplyOpen(null);
    setReplyText("");
    setReplyError("");
    setReplySuccess("");
  }

  async function sendReply(
    queryRecord: QueryRecord
  ) {
    const text = replyText.trim();

    setReplyError("");
    setReplySuccess("");

    if (!text) {
      setReplyError(
        "Please enter a reply."
      );
      return;
    }

    if (text.length < 2) {
      setReplyError(
        "Reply must contain at least 2 characters."
      );
      return;
    }

    if (text.length > 5000) {
      setReplyError(
        "Reply cannot exceed 5000 characters."
      );
      return;
    }

    if (!queryRecord.email) {
      setReplyError(
        "This query does not contain a valid email address."
      );
      return;
    }

    if (!user) {
      setReplyError(
        "Your admin session could not be verified."
      );
      return;
    }

    try {
      setReplyLoading(true);

      const currentUser =
        firebaseAuth?.currentUser;

      if (!currentUser) {
        throw new Error(
          "Your admin session has expired. Please sign in again."
        );
      }

      const idToken =
        await currentUser.getIdToken();

      const response = await fetch(
        `/api/queries/${encodeURIComponent(
          queryRecord.id
        )}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            reply: text,
            adminName:
              user.name ||
              "SCMS Administration",
          }),
        }
      );

      const responseText =
        await response.text();

      let data: {
        success?: boolean;
        message?: string;
        emailSent?: boolean;
      };

      try {
        data = JSON.parse(
          responseText
        );
      } catch {
        console.error(
          "Reply API returned non-JSON:",
          responseText
        );

        throw new Error(
          `Reply request failed (${response.status}).`
        );
      }

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to send reply."
        );
      }

      setReplySuccess(
        data.emailSent === false
          ? "Reply was saved, but the email could not be delivered."
          : "Reply sent successfully to the user's Gmail."
      );

      setReplyText("");

      window.setTimeout(() => {
        setReplyOpen(null);
        setReplySuccess("");
      }, 1200);
    } catch (error) {
      console.error(
        "Admin reply failed:",
        error
      );

      setReplyError(
        error instanceof Error
          ? error.message
          : "Unable to send reply."
      );
    } finally {
      setReplyLoading(false);
    }
  }

  async function handleDeleteQuery(
    queryRecord: QueryRecord
  ) {
    const confirmed =
      window.confirm(
        `Delete this query permanently?\n\nFrom: ${
          queryRecord.name ||
          "Unknown user"
        }\nSubject: ${
          queryRecord.subject ||
          "No subject"
        }\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(
        queryRecord.id
      );

      const currentUser =
        firebaseAuth?.currentUser;

      if (!currentUser) {
        throw new Error(
          "Your admin session has expired. Please sign in again."
        );
      }

      const idToken =
        await currentUser.getIdToken();

      const response = await fetch(
        `/api/queries/${encodeURIComponent(
          queryRecord.id
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      const responseText =
        await response.text();

      let data: {
        success?: boolean;
        message?: string;
      };

      try {
        data = JSON.parse(
          responseText
        );
      } catch {
        throw new Error(
          `Delete request failed (${response.status}).`
        );
      }

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to delete query."
        );
      }
    } catch (error) {
      console.error(
        "Delete query failed:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to delete query."
      );
    } finally {
      setDeleteLoading(null);
    }
  }

  return (
    <PortalShell
      role="admin"
      title="Queries"
    >
      <main className="space-y-8 pb-10">
        <PageHeading
          eyebrow="Administration"
          title="Contact Queries"
          description="Monitor enquiries and respond directly to users from the admin portal."
        />

        {/* Live status */}
        <div className="flex items-center gap-3 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-cyan-50 px-5 py-3.5 text-sm font-semibold text-emerald-700 shadow-sm">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>

          <span>
            Live query stream connected
          </span>

          <span className="ml-auto hidden text-xs font-medium text-emerald-600 sm:block">
            Updates automatically
          </span>
        </div>

        {/* Summary */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Queries"
            value={counts.total}
            icon={MessageSquare}
            gradient="from-blue-600 to-cyan-500"
          />

          <SummaryCard
            title="New"
            value={counts.newCount}
            icon={Clock3}
            gradient="from-orange-500 to-amber-500"
          />

          <SummaryCard
            title="In Progress"
            value={counts.progressCount}
            icon={Mail}
            gradient="from-violet-600 to-purple-500"
          />

          <SummaryCard
            title="Resolved"
            value={counts.resolvedCount}
            icon={CheckCircle2}
            gradient="from-emerald-600 to-teal-500"
          />
        </section>

        {/* Search + filter */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                Communication center
              </p>

              <h2 className="mt-1 text-xl font-black text-[var(--navy)]">
                Incoming Queries
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredQueries.length} of{" "}
                {queries.data.length} queries shown
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(280px,1fr)_190px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search name, email, subject or query ID..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as StatusFilter
                  )
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                <option value="all">
                  All statuses
                </option>

                <option value="new">
                  New
                </option>

                <option value="in_progress">
                  In Progress
                </option>

                <option value="resolved">
                  Resolved
                </option>

                <option value="closed">
                  Closed
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* Query list */}
        <section className="space-y-5">
          {queries.loading && (
            <LoadingState />
          )}

          {queries.error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold leading-6 text-red-700">
              {queries.error}
            </div>
          )}

          {!queries.loading &&
            !queries.error &&
            !filteredQueries.length && (
              <EmptyState />
            )}

          {!queries.loading &&
            !queries.error &&
            filteredQueries.map(
              (queryRecord) => (
                <QueryCard
                  key={queryRecord.id}
                  queryRecord={queryRecord}
                  replyOpen={
                    replyOpen ===
                    queryRecord.id
                  }
                  replyText={replyText}
                  replyLoading={
                    replyLoading
                  }
                  replyError={replyError}
                  replySuccess={
                    replySuccess
                  }
                  deleteLoading={
                    deleteLoading ===
                    queryRecord.id
                  }
                  onOpenReply={() =>
                    openReply(
                      queryRecord
                    )
                  }
                  onCloseReply={
                    closeReply
                  }
                  onReplyChange={
                    setReplyText
                  }
                  onSendReply={() =>
                    void sendReply(
                      queryRecord
                    )
                  }
                  onDelete={() =>
                    void handleDeleteQuery(
                      queryRecord
                    )
                  }
                  formatDate={
                    formatDate
                  }
                />
              )
            )}
        </section>
      </main>
    </PortalShell>
  );
}

/* ============================================================
   QUERY CARD
============================================================ */

function QueryCard({
  queryRecord,
  replyOpen,
  replyText,
  replyLoading,
  replyError,
  replySuccess,
  deleteLoading,
  onOpenReply,
  onCloseReply,
  onReplyChange,
  onSendReply,
  onDelete,
  formatDate,
}: {
  queryRecord: QueryRecord;
  replyOpen: boolean;
  replyText: string;
  replyLoading: boolean;
  replyError: string;
  replySuccess: string;
  deleteLoading: boolean;
  onOpenReply: () => void;
  onCloseReply: () => void;
  onReplyChange: (value: string) => void;
  onSendReply: () => void;
  onDelete: () => void;
  formatDate: (value: unknown) => string;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      {/* Header */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-white via-white to-blue-50/40 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                {queryRecord.category ||
                  "General"}
              </span>

              <StatusBadge
                status={
                  queryRecord.status
                }
              />

              {queryRecord.replyEmailSent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Reply sent
                </span>
              )}
            </div>

            <h3 className="mt-3 text-lg font-black text-[var(--navy)]">
              {queryRecord.subject ||
                "Untitled query"}
            </h3>

            <div className="mt-2 break-all text-xs font-medium text-slate-400">
              Query ID: {queryRecord.id}
            </div>
          </div>

          <div className="shrink-0 text-xs font-semibold text-slate-500 lg:text-right">
            {formatDate(
              queryRecord.createdAt
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="grid gap-6 p-5 lg:grid-cols-[240px_1fr]">
        {/* Sender */}
        <aside className="space-y-4">
          <div className="flex gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-sm">
              <User className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Sender
              </div>

              <div className="mt-1 font-bold text-[var(--navy)]">
                {queryRecord.name ||
                  "Unknown"}
              </div>

              <div className="mt-1 break-all text-xs leading-5 text-slate-500">
                {queryRecord.email ||
                  "No email"}
              </div>
            </div>
          </div>

          {queryRecord.phone && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Phone
              </div>

              <div className="mt-1 text-sm font-semibold text-slate-700">
                {queryRecord.phone}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Initial Email
            </div>

            <div className="mt-1 text-sm font-semibold">
              {queryRecord.emailSent ? (
                <span className="text-emerald-600">
                  Notification sent
                </span>
              ) : (
                <span className="text-amber-600">
                  Not sent
                </span>
              )}
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Message
          </div>

          <div className="mt-2 whitespace-pre-wrap rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
            {queryRecord.message ||
              "No message provided."}
          </div>

          {/* Existing reply */}
          {queryRecord.reply && (
            <div className="mt-5 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-black uppercase tracking-wider text-emerald-700">
                  Admin Reply
                </div>

                {queryRecord.replyEmailSent && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                    <Mail className="h-3.5 w-3.5" />
                    Email sent
                  </span>
                )}
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-emerald-950">
                {queryRecord.reply}
              </p>

              {queryRecord.repliedBy && (
                <div className="mt-3 border-t border-emerald-100 pt-3 text-xs text-emerald-700/70">
                  Replied by{" "}
                  <span className="font-semibold">
                    {queryRecord.repliedBy}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {!replyOpen && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenReply}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/15">
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>

                {queryRecord.reply
                  ? "Reply Again"
                  : "Reply to User"}
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={deleteLoading}
                className="group inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-red-50 group-hover:bg-red-100">
                      <Trash2 className="h-4 w-4" />
                    </span>
                    Delete Query
                  </>
                )}
              </button>
            </div>
          )}

          {/* Reply composer */}
          {replyOpen && (
            <div className="mt-5 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-black text-[var(--navy)]">
                    Reply to{" "}
                    {queryRecord.name ||
                      "User"}
                  </div>

                  <div className="mt-1 break-all text-xs text-slate-500">
                    {queryRecord.email ||
                      "No email"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    onCloseReply
                  }
                  disabled={replyLoading}
                  className="rounded-lg px-2 py-1 text-xs font-bold text-slate-500 transition hover:bg-white hover:text-[var(--navy)] disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>

              <textarea
                value={replyText}
                onChange={(event) =>
                  onReplyChange(
                    event.target.value
                  )
                }
                rows={6}
                maxLength={5000}
                placeholder="Write a clear response to the user..."
                disabled={replyLoading}
                className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
              />

              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  Response will be sent to Gmail
                </span>

                <span>
                  {replyText.length}/5000
                </span>
              </div>

              {replyError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {replyError}
                </div>
              )}

              {replySuccess && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {replySuccess}
                </div>
              )}

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    onCloseReply
                  }
                  disabled={replyLoading}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={onSendReply}
                  disabled={replyLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {replyLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   SUMMARY CARD
============================================================ */

function SummaryCard({
  title,
  value,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition duration-500 group-hover:scale-150`}
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div
            className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
          >
            <Icon className="h-5 w-5" />
          </div>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500">
            Live
          </span>
        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-wider text-slate-400">
          {title}
        </p>

        <p className="mt-1 text-4xl font-black text-[var(--navy)]">
          {value.toLocaleString()}
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
   STATUS BADGE
============================================================ */

function StatusBadge({
  status,
}: {
  status?: QueryStatus;
}) {
  if (status === "resolved") {
    return (
      <Badge tone="green">
        Resolved
      </Badge>
    );
  }

  if (status === "closed") {
    return (
      <Badge tone="blue">
        Closed
      </Badge>
    );
  }

  if (status === "in_progress") {
    return (
      <Badge tone="blue">
        In Progress
      </Badge>
    );
  }

  return (
    <Badge tone="amber">
      New
    </Badge>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-14 text-center shadow-sm">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600">
        <MessageSquare className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-xl font-black text-[var(--navy)]">
        No queries found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        New enquiries submitted through
        the public website will appear here
        automatically.
      </p>
    </div>
  );
}

/* ============================================================
   LOADING STATE
============================================================ */

function LoadingState() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="animate-pulse">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="h-5 w-24 rounded-full bg-slate-100" />
                <div className="h-5 w-72 rounded bg-slate-100" />
                <div className="h-3 w-48 rounded bg-slate-100" />
              </div>

              <div className="h-4 w-28 rounded bg-slate-100" />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
              <div className="space-y-4">
                <div className="h-16 rounded-xl bg-slate-100" />
                <div className="h-16 rounded-xl bg-slate-100" />
              </div>

              <div>
                <div className="h-28 rounded-2xl bg-slate-100" />
                <div className="mt-4 h-10 w-32 rounded-xl bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   TIMESTAMP
============================================================ */

function getTimestampSeconds(
  value: unknown
): number {
  if (!value) {
    return 0;
  }

  if (
    typeof value === "object" &&
    value !== null
  ) {
    const timestamp = value as {
      seconds?: number;
      nanoseconds?: number;
      toMillis?: () => number;
      toDate?: () => Date;
    };

    if (
      typeof timestamp.toMillis ===
      "function"
    ) {
      return Math.floor(
        timestamp.toMillis() / 1000
      );
    }

    if (
      typeof timestamp.toDate ===
      "function"
    ) {
      return Math.floor(
        timestamp.toDate().getTime() /
          1000
      );
    }

    if (
      typeof timestamp.seconds ===
      "number"
    ) {
      return timestamp.seconds;
    }
  }

  if (value instanceof Date) {
    return Math.floor(
      value.getTime() / 1000
    );
  }

  if (typeof value === "string") {
    const parsed = new Date(value);

    if (!Number.isNaN(parsed.getTime())) {
      return Math.floor(
        parsed.getTime() / 1000
      );
    }
  }

  return 0;
}