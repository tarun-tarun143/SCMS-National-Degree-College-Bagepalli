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

import { firestoreDb, firebaseAuth } from "@/lib/firebase/client";
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

export default function AdminQueriesPage() {
  const { user } = useScmsSession("admin");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

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
      .filter((query) => {
        if (
          statusFilter !== "all" &&
          query.status !== statusFilter
        ) {
          return false;
        }

        if (!searchValue) {
          return true;
        }

        return [
          query.name,
          query.email,
          query.subject,
          query.category,
          query.message,
          query.id,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(searchValue)
          );
      })
      .sort((a, b) => {
        return (
          getTimestampSeconds(b.createdAt) -
          getTimestampSeconds(a.createdAt)
        );
      });
  }, [
    queries.data,
    search,
    statusFilter,
  ]);

  const counts = useMemo(() => {
    return {
      total: queries.data.length,

      new: queries.data.filter(
        (query) =>
          query.status === "new" ||
          !query.status
      ).length,

      progress: queries.data.filter(
        (query) =>
          query.status === "in_progress"
      ).length,

      resolved: queries.data.filter(
        (query) =>
          query.status === "resolved" ||
          query.status === "closed"
      ).length,
    };
  }, [queries.data]);

  function formatDate(value: unknown) {
    const seconds =
      getTimestampSeconds(value);

    if (seconds) {
      return new Date(
        seconds * 1000
      ).toLocaleString();
    }

    if (typeof value === "string") {
      const parsed = new Date(value);

      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleString();
      }
    }

    return "Recently submitted";
  }

  function openReply(query: QueryRecord) {
    setReplyOpen(query.id);
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

  async function sendReply(query: QueryRecord) {
  const text = replyText.trim();

  setReplyError("");
  setReplySuccess("");

  if (!text) {
    setReplyError("Please enter a reply.");
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

  if (!query.email) {
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

    if (!firebaseAuth?.currentUser) {
      throw new Error(
        "Your admin session has expired. Please sign in again."
      );
    }

    const idToken =
      await firebaseAuth.currentUser.getIdToken();

    const response = await fetch(
      `/api/queries/${encodeURIComponent(query.id)}/reply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          reply: text,
          adminName:
            user.name || "SCMS Administration",
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
      data = JSON.parse(responseText);
    } catch {
      console.error(
        "Reply API returned non-JSON:",
        responseText
      );

      throw new Error(
        `Reply request failed (${response.status}).`
      );
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Unable to send reply."
      );
    }

    setReplySuccess(
      "Reply sent successfully to the user's Gmail."
    );

    setReplyText("");

    setTimeout(() => {
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
  query: QueryRecord
) {
  const confirmed = window.confirm(
    `Delete this query permanently?\n\nFrom: ${
      query.name || "Unknown user"
    }\nSubject: ${
      query.subject || "No subject"
    }\n\nThis action cannot be undone.`
  );

  if (!confirmed) {
    return;
  }

  try {
    setDeleteLoading(query.id);

    if (!firebaseAuth?.currentUser) {
      throw new Error(
        "Your admin session has expired. Please sign in again."
      );
    }

    const idToken =
      await firebaseAuth.currentUser.getIdToken();

    const response = await fetch(
      `/api/queries/${encodeURIComponent(query.id)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    const data =
      (await response.json()) as {
        success?: boolean;
        message?: string;
      };

    if (!response.ok || !data.success) {
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
      <PageHeading
        eyebrow="Administration"
        title="Contact Queries"
        description="Monitor enquiries and respond directly to users from the admin portal."
      />

      {/* Live status */}
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-700">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>

        <span>Live query stream connected</span>

        <span className="ml-auto hidden text-xs font-medium text-emerald-600 sm:block">
          Updates automatically
        </span>
      </div>

      {/* Summary */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Queries"
          value={counts.total}
          icon={MessageSquare}
        />

        <SummaryCard
          title="New"
          value={counts.new}
          icon={Clock3}
        />

        <SummaryCard
          title="In Progress"
          value={counts.progress}
          icon={Mail}
        />

        <SummaryCard
          title="Resolved"
          value={counts.resolved}
          icon={CheckCircle2}
        />
      </div>

      {/* Search + filter */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_190px]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search name, email, subject or query ID..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--blue)] focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--blue)] focus:bg-white"
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

      {/* Query list */}
      <div className="mt-6 grid gap-5">
        {queries.loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
            Loading live queries…
          </div>
        )}

        {queries.error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-sm font-semibold text-red-700">
            {queries.error}
          </div>
        )}

        {!queries.loading &&
          !queries.error &&
          !filteredQueries.length && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                <MessageSquare className="h-6 w-6" />
              </div>

              <h3 className="mt-5 font-extrabold text-[var(--navy)]">
                No queries found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                New enquiries submitted through the
                public website will appear here
                automatically.
              </p>
            </div>
          )}

        {filteredQueries.map((query) => (
          <article
            key={query.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:shadow-md"
          >
            {/* Header */}
            <div className="border-b border-slate-100 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      {query.category ||
                        "General"}
                    </span>

                    <StatusBadge
                      status={query.status}
                    />

                    {query.replyEmailSent && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Reply sent
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-lg font-extrabold text-[var(--navy)]">
                    {query.subject ||
                      "Untitled query"}
                  </h3>

                  <div className="mt-2 text-xs text-slate-400">
                    Query ID: {query.id}
                  </div>
                </div>

                <div className="text-xs text-slate-500 lg:text-right">
                  {formatDate(
                    query.createdAt
                  )}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="grid gap-6 p-5 lg:grid-cols-[220px_1fr]">
              {/* User information */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
                    <User className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Sender
                    </div>

                    <div className="mt-1 text-sm font-bold text-[var(--navy)]">
                      {query.name ||
                        "Unknown"}
                    </div>

                    <div className="mt-1 break-all text-xs text-slate-500">
                      {query.email ||
                        "No email"}
                    </div>
                  </div>
                </div>

                {query.phone && (
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Phone
                    </div>

                    <div className="mt-1 text-sm font-semibold text-slate-700">
                      {query.phone}
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Initial Email
                  </div>

                  <div className="mt-1 text-sm font-semibold">
                    {query.emailSent ? (
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
              </div>

              {/* Main message */}
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Message
                </div>

                <div className="mt-2 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                  {query.message ||
                    "No message provided."}
                </div>

                {/* Existing reply */}
                {query.reply && (
                  <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        Admin Reply
                      </div>

                      {query.replyEmailSent && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                          <Mail className="h-3.5 w-3.5" />
                          Email sent
                        </span>
                      )}
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-emerald-950">
                      {query.reply}
                    </p>

                    {query.repliedBy && (
                      <div className="mt-3 border-t border-emerald-100 pt-3 text-xs text-emerald-700/70">
                        Replied by{" "}
                        <span className="font-semibold">
                          {query.repliedBy}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Professional actions */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {replyOpen !== query.id && (
                    <button
                      type="button"
                      onClick={() =>
                        openReply(query)
                      }
                      className="group inline-flex items-center gap-2 rounded-xl bg-[var(--blue)] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/15">
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>

                      <span>
                        {query.reply
                          ? "Reply Again"
                          : "Reply to User"}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteQuery(query)
                    }
                    disabled={
                      deleteLoading ===
                      query.id
                    }
                    className="group inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleteLoading ===
                    query.id ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                        <span>
                          Deleting...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-red-50 group-hover:bg-red-100">
                          <Trash2 className="h-4 w-4" />
                        </span>

                        <span>
                          Delete Query
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Reply composer */}
                {replyOpen === query.id && (
                  <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-extrabold text-[var(--navy)]">
                          Reply to{" "}
                          {query.name ||
                            "User"}
                        </div>

                        <div className="mt-1 break-all text-xs text-slate-500">
                          {query.email}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={
                          closeReply
                        }
                        disabled={
                          replyLoading
                        }
                        className="rounded-lg px-2 py-1 text-xs font-bold text-slate-500 transition hover:bg-white hover:text-[var(--navy)] disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>

                    <textarea
                      value={replyText}
                      onChange={(event) =>
                        setReplyText(
                          event.target.value
                        )
                      }
                      rows={6}
                      maxLength={5000}
                      placeholder="Write a clear response to the user..."
                      className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-50"
                    />

                    <div className="mt-2 flex justify-between text-xs text-slate-400">
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
                          closeReply
                        }
                        disabled={
                          replyLoading
                        }
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          sendReply(
                            query
                          )
                        }
                        disabled={
                          replyLoading
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
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
        ))}
      </div>
    </PortalShell>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: typeof MessageSquare;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </div>

          <div className="mt-2 text-3xl font-black text-[var(--navy)]">
            {value}
          </div>
        </div>

        <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-[var(--blue)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

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

function getTimestampSeconds(
  value: unknown
): number {
  if (
    value &&
    typeof value === "object" &&
    "seconds" in value
  ) {
    return Number(
      (value as { seconds?: number })
        .seconds ?? 0
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