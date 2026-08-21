
"use client";

import {
  CheckCheck,
  Clock3,
  Mail,
  MailOpen,
  MessageSquare,
  Plus,
  RefreshCw,
  Reply,
  Search,
  Send,
  Trash2,
  User,
  X,
  XCircle,
} from "lucide-react";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
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

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";

/* ============================================================
   TYPES
============================================================ */

type MessageRecord = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  type?: string;
  category?: string;
  status?: string;
  priority?: string;
  read?: boolean;
  replied?: boolean;
  reply?: string;
  replyMessage?: string;
  senderId?: string;
  recipientId?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  repliedAt?: unknown;
  readAt?: unknown;
  [key: string]: unknown;
};

type MessageFilter =
  | "all"
  | "unread"
  | "read"
  | "replied"
  | "pending";

type ComposeForm = {
  recipient: string;
  subject: string;
  message: string;
};

const emptyComposeForm: ComposeForm = {
  recipient: "",
  subject: "",
  message: "",
};

/* ============================================================
   PAGE
============================================================ */

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageRecord[]>(
    []
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<MessageFilter>("all");

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedMessage, setSelectedMessage] =
    useState<MessageRecord | null>(null);

  const [showCompose, setShowCompose] =
    useState(false);

  const [showReply, setShowReply] =
    useState(false);

  const [replyText, setReplyText] =
    useState("");

  const [composeForm, setComposeForm] =
    useState<ComposeForm>({
      ...emptyComposeForm,
    });

  /* ==========================================================
     REAL-TIME FIRESTORE LISTENER
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

    const messagesQuery = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const records: MessageRecord[] =
          snapshot.docs.map((item) => {
            const data = item.data();

            return {
              id: item.id,
              name: String(data.name ?? ""),
              email: String(data.email ?? ""),
              phone: String(data.phone ?? ""),
              subject: String(data.subject ?? ""),
              message: String(data.message ?? ""),
              type: String(data.type ?? "General"),
              category: String(
                data.category ?? "General"
              ),
              status: String(
                data.status ?? "unread"
              ),
              priority: String(
                data.priority ?? "normal"
              ),
              read: Boolean(
                data.read ?? false
              ),
              replied: Boolean(
                data.replied ?? false
              ),
              reply: String(
                data.reply ??
                  data.replyMessage ??
                  ""
              ),
              replyMessage: String(
                data.replyMessage ?? ""
              ),
              senderId: String(
                data.senderId ?? ""
              ),
              recipientId: String(
                data.recipientId ?? ""
              ),
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              repliedAt: data.repliedAt,
              readAt: data.readAt,
              ...data,
            };
          });

        records.sort(
          (a, b) =>
            getTimestampValue(b.createdAt) -
            getTimestampValue(a.createdAt)
        );

        setMessages(records);
        setLoading(false);
        setError("");
      },
      (listenerError) => {
        console.error(
          "Messages listener error:",
          listenerError
        );

        setError(
          listenerError instanceof Error
            ? listenerError.message
            : "Unable to load messages."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ==========================================================
     FILTERED MESSAGES
  ========================================================== */

  const filteredMessages = useMemo(() => {
    const term = search.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesSearch =
        !term ||
        [
          message.name,
          message.email,
          message.phone,
          message.subject,
          message.message,
          message.category,
          message.type,
          message.priority,
          message.reply,
          message.replyMessage,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const isRead =
        message.read === true ||
        String(message.status).toLowerCase() ===
          "read" ||
        String(message.status).toLowerCase() ===
          "replied";

      const isReplied =
        message.replied === true ||
        Boolean(
          message.reply ||
            message.replyMessage
        );

      let matchesFilter = true;

      if (filter === "unread") {
        matchesFilter = !isRead;
      } else if (filter === "read") {
        matchesFilter = isRead;
      } else if (filter === "replied") {
        matchesFilter = isReplied;
      } else if (filter === "pending") {
        matchesFilter = !isReplied;
      }

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [messages, search, filter]);

  /* ==========================================================
     COUNTS
  ========================================================== */

  const unreadCount = messages.filter(
    (message) =>
      !(
        message.read === true ||
        String(message.status).toLowerCase() ===
          "read" ||
        String(message.status).toLowerCase() ===
          "replied"
      )
  ).length;

  const readCount =
    messages.length - unreadCount;

  const repliedCount = messages.filter(
    (message) =>
      message.replied === true ||
      Boolean(
        message.reply ||
          message.replyMessage
      )
  ).length;

  const pendingCount =
    messages.length - repliedCount;

  /* ==========================================================
     OPEN MESSAGE
  ========================================================== */

  async function openMessage(
    message: MessageRecord
  ) {
    const db = firestoreDb;

    if (!db) {
      setError(
        "Firestore is not initialized."
      );
      return;
    }

    setSelectedMessage(message);
    setError("");
    setSuccess("");

    const alreadyRead =
      message.read === true ||
      String(message.status).toLowerCase() ===
        "read" ||
      String(message.status).toLowerCase() ===
        "replied";

    if (alreadyRead) {
      return;
    }

    try {
      await updateDoc(
        doc(
          db,
          "messages",
          message.id
        ),
        {
          read: true,
          status: "read",
          readAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );
    } catch (err) {
      console.error(
        "Mark message as read error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to mark message as read."
      );
    }
  }

  /* ==========================================================
     MARK UNREAD
  ========================================================== */

  async function markUnread(
    message: MessageRecord
  ) {
    const db = firestoreDb;

    if (!db) {
      setError(
        "Firestore is not initialized."
      );
      return;
    }

    try {
      setProcessingId(message.id);
      setError("");
      setSuccess("");

      await updateDoc(
        doc(
          db,
          "messages",
          message.id
        ),
        {
          read: false,
          status: "unread",
          updatedAt: serverTimestamp(),
        }
      );

      setSuccess(
        "Message marked as unread."
      );
    } catch (err) {
      console.error(
        "Mark unread error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to mark message as unread."
      );
    } finally {
      setProcessingId(null);
    }
  }

  /* ==========================================================
     REPLY
  ========================================================== */

  function openReply(
    message: MessageRecord
  ) {
    setSelectedMessage(message);

    setReplyText(
      String(
        message.reply ??
          message.replyMessage ??
          ""
      )
    );

    setShowReply(true);
    setError("");
    setSuccess("");
  }

  async function submitReply(
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

    if (!selectedMessage) {
      return;
    }

    const trimmedReply =
      replyText.trim();

    if (!trimmedReply) {
      setError(
        "Please enter a reply message."
      );
      return;
    }

    try {
      setProcessingId(
        selectedMessage.id
      );

      setError("");
      setSuccess("");

      await updateDoc(
        doc(
          db,
          "messages",
          selectedMessage.id
        ),
        {
          reply: trimmedReply,
          replyMessage: trimmedReply,
          replied: true,
          repliedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          read: true,
          status: "replied",
        }
      );

      setSuccess(
        "Reply saved successfully."
      );

      setShowReply(false);
      setReplyText("");
    } catch (err) {
      console.error(
        "Reply error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save reply."
      );
    } finally {
      setProcessingId(null);
    }
  }

  /* ==========================================================
     DELETE MESSAGE
  ========================================================== */

  async function handleDelete(
    message: MessageRecord
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
        `Delete message from "${
          message.name ||
          "Unknown sender"
        }"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(message.id);
      setError("");
      setSuccess("");

      await deleteDoc(
        doc(
          db,
          "messages",
          message.id
        )
      );

      if (
        selectedMessage?.id ===
        message.id
      ) {
        setSelectedMessage(null);
        setShowReply(false);
      }

      setSuccess(
        "Message deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete message error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete message."
      );
    } finally {
      setProcessingId(null);
    }
  }

  /* ==========================================================
     COMPOSE MESSAGE
  ========================================================== */

  function openCompose() {
    setComposeForm({
      ...emptyComposeForm,
    });

    setShowCompose(true);
    setError("");
    setSuccess("");
  }

  async function submitCompose(
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

    const recipient =
      composeForm.recipient.trim();

    const subject =
      composeForm.subject.trim();

    const message =
      composeForm.message.trim();

    if (!recipient) {
      setError(
        "Please enter the recipient email or user ID."
      );
      return;
    }

    if (!subject) {
      setError(
        "Please enter a subject."
      );
      return;
    }

    if (!message) {
      setError(
        "Please enter a message."
      );
      return;
    }

    try {
      setProcessingId("compose");
      setError("");
      setSuccess("");

      await addDoc(
        collection(db, "messages"),
        {
          name: "Administrator",
          email: recipient,
          subject,
          message,
          type: "admin",
          category: "Administrative",
          priority: "normal",
          status: "sent",
          read: true,
          replied: false,
          recipientId: recipient,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      setSuccess(
        "Message sent successfully."
      );

      setShowCompose(false);

      setComposeForm({
        ...emptyComposeForm,
      });
    } catch (err) {
      console.error(
        "Compose message error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to send message."
      );
    } finally {
      setProcessingId(null);
    }
  }

  /* ==========================================================
     FORMAT DATE
  ========================================================== */

  function formatTimestamp(
    value: unknown
  ) {
    if (!value) {
      return "Recently";
    }

    try {
      if (
        typeof value === "object" &&
        value !== null &&
        "toDate" in value &&
        typeof (
          value as {
            toDate?: unknown;
          }
        ).toDate ===
          "function"
      ) {
        return (
          value as {
            toDate: () => Date;
          }
        )
          .toDate()
          .toLocaleString(
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
        return String(value);
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
    } catch {
      return "Recently";
    }
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <PortalShell
      role="admin"
      title="Messages"
    >
      <main className="space-y-8 pb-10">
        <PageHeading
          eyebrow="Communication center"
          title="Messages"
          description="Manage incoming messages, enquiries and administrative communication in real time."
        />

        {/* ERROR */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                <div className="min-w-0">
                  <p className="font-black text-red-800">
                    Message operation failed
                  </p>

                  <p className="mt-1 break-words text-sm leading-6 text-red-700">
                    {error}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                className="rounded-lg p-1 text-red-500 transition hover:bg-red-100 hover:text-red-700"
                aria-label="Close error"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCheck className="h-5 w-5 shrink-0 text-emerald-600" />

              <p className="text-sm font-bold text-emerald-800">
                {success}
              </p>

              <button
                type="button"
                onClick={() =>
                  setSuccess("")
                }
                className="ml-auto rounded-lg p-1 text-emerald-500 transition hover:bg-emerald-100"
                aria-label="Close success message"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* =====================================================
            STATISTICS
        ====================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Mail}
            label="Total Messages"
            value={messages.length}
            gradient="from-blue-600 to-cyan-500"
          />

          <StatCard
            icon={MailOpen}
            label="Unread"
            value={unreadCount}
            gradient="from-orange-500 to-amber-500"
          />

          <StatCard
            icon={Reply}
            label="Replied"
            value={repliedCount}
            gradient="from-emerald-600 to-teal-500"
          />

          <StatCard
            icon={Clock3}
            label="Pending"
            value={pendingCount}
            gradient="from-purple-600 to-violet-500"
          />
        </section>

        {/* =====================================================
            SEARCH + ACTIONS
        ====================================================== */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                  Live communication
                </p>

                <h2 className="mt-1 text-xl font-black text-[var(--navy)]">
                  Message Inbox
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Messages update automatically from Firestore.
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
                    placeholder="Search messages..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:w-72"
                  />
                </div>

                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(
                      event.target
                        .value as MessageFilter
                    )
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  aria-label="Message filter"
                >
                  <option value="all">
                    All messages
                  </option>
                  <option value="unread">
                    Unread
                  </option>
                  <option value="read">
                    Read
                  </option>
                  <option value="replied">
                    Replied
                  </option>
                  <option value="pending">
                    Pending reply
                  </option>
                </select>

                <button
                  type="button"
                  onClick={
                    openCompose
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                  New Message
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-blue-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-70" />
                  <span className="relative h-2 w-2 rounded-full bg-blue-500" />
                </span>
                Real-time inbox
              </span>

              <span className="text-xs font-semibold text-slate-400">
                Showing{" "}
                {filteredMessages.length}{" "}
                of {messages.length}
              </span>

              {(search ||
                filter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            MESSAGE LIST
        ====================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <LoadingState />
          ) : filteredMessages.length === 0 ? (
            <div className="p-14 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                <MessageSquare className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-700">
                No messages found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                No messages match your current search or filter.
              </p>

              {(search ||
                filter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredMessages.map(
                (message) => {
                  const isRead =
                    message.read === true ||
                    String(
                      message.status
                    ).toLowerCase() ===
                      "read" ||
                    String(
                      message.status
                    ).toLowerCase() ===
                      "replied";

                  const isReplied =
                    message.replied ===
                      true ||
                    Boolean(
                      message.reply ||
                        message.replyMessage
                    );

                  const isProcessing =
                    processingId ===
                    message.id;

                  const priority =
                    String(
                      message.priority ??
                        "normal"
                    ).toLowerCase();

                  return (
                    <article
                      key={message.id}
                      className={`group p-5 transition hover:bg-slate-50 ${
                        !isRead
                          ? "border-l-4 border-l-blue-500 bg-blue-50/40"
                          : ""
                      }`}
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        {/* SENDER */}

                        <div className="flex min-w-0 gap-4">
                          <div
                            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl font-black shadow-sm ${
                              !isRead
                                ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {message.name
                              ?.charAt(0)
                              .toUpperCase() ||
                              "U"}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-black text-slate-900">
                                {message.name ||
                                  "Unknown sender"}
                              </h3>

                              {!isRead && (
                                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700">
                                  Unread
                                </span>
                              )}

                              {isReplied && (
                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                                  Replied
                                </span>
                              )}
                            </div>

                            <p className="mt-1 break-all text-xs text-slate-400">
                              {message.email ||
                                "No email"}
                            </p>

                            {message.phone && (
                              <p className="mt-1 text-xs text-slate-400">
                                {message.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* ACTIONS */}

                        <div className="flex shrink-0 flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              void openMessage(
                                message
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                          >
                            <MailOpen className="h-4 w-4" />
                            Open
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openReply(
                                message
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <Reply className="h-4 w-4" />
                            Reply
                          </button>

                          {!isRead ? (
                            <button
                              type="button"
                              disabled={
                                isProcessing
                              }
                              onClick={() =>
                                void openMessage(
                                  message
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
                            >
                              <CheckCheck className="h-4 w-4" />
                              Mark Read
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={
                                isProcessing
                              }
                              onClick={() =>
                                void markUnread(
                                  message
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
                            >
                              <Mail className="h-4 w-4" />
                              Unread
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={
                              isProcessing
                            }
                            onClick={() =>
                              void handleDelete(
                                message
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* MESSAGE */}

                      <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600">
                            {message.category ||
                              message.type ||
                              "General"}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                              priority ===
                              "urgent"
                                ? "bg-red-50 text-red-700"
                                : priority ===
                                    "important"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {message.priority ||
                              "normal"}
                          </span>
                        </div>

                        <h4 className="mt-3 text-base font-black text-slate-800">
                          {message.subject ||
                            "No subject"}
                        </h4>

                        <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-slate-500">
                          {message.message ||
                            "No message content."}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" />
                            {formatTimestamp(
                              message.createdAt
                            )}
                          </span>

                          {message.senderId && (
                            <span className="inline-flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5" />
                              <span className="max-w-[240px] truncate">
                                {
                                  message.senderId
                                }
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      {isReplied && (
                        <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                            Admin Reply
                          </p>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-emerald-900">
                            {message.reply ||
                              message.replyMessage}
                          </p>
                        </div>
                      )}
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* =====================================================
            SELECTED MESSAGE MODAL
        ====================================================== */}

        {selectedMessage &&
          !showReply &&
          !showCompose && (
            <MessageModal
              message={selectedMessage}
              onClose={() =>
                setSelectedMessage(
                  null
                )
              }
              onReply={() =>
                openReply(
                  selectedMessage
                )
              }
              onDelete={() =>
                void handleDelete(
                  selectedMessage
                )
              }
              formatTimestamp={
                formatTimestamp
              }
            />
          )}

        {/* =====================================================
            REPLY MODAL
        ====================================================== */}

        {showReply &&
          selectedMessage && (
            <ReplyModal
              message={selectedMessage}
              value={replyText}
              setValue={
                setReplyText
              }
              processing={
                processingId ===
                selectedMessage.id
              }
              onClose={() => {
                if (
                  processingId ===
                  selectedMessage.id
                ) {
                  return;
                }

                setShowReply(false);
              }}
              onSubmit={
                submitReply
              }
            />
          )}

        {/* =====================================================
            COMPOSE MODAL
        ====================================================== */}

        {showCompose && (
          <ComposeModal
            form={composeForm}
            setForm={
              setComposeForm
            }
            processing={
              processingId ===
              "compose"
            }
            onClose={() => {
              if (
                processingId ===
                "compose"
              ) {
                return;
              }

              setShowCompose(false);
            }}
            onSubmit={
              submitCompose
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
  gradient,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl">
      <div
        className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition duration-500 group-hover:scale-150`}
      />

      <div className="relative">
        <div
          className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          <Icon className="h-6 w-6" />
        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-wider text-slate-400">
          {label}
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
   MESSAGE MODAL
============================================================ */

function MessageModal({
  message,
  onClose,
  onReply,
  onDelete,
  formatTimestamp,
}: {
  message: MessageRecord;
  onClose: () => void;
  onReply: () => void;
  onDelete: () => void;
  formatTimestamp: (
    value: unknown
  ) => string;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Message Details
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-900">
              {message.subject ||
                "No subject"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="Close message details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
                <User className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h3 className="font-black text-slate-900">
                  {message.name ||
                    "Unknown sender"}
                </h3>

                <p className="mt-1 break-all text-sm text-slate-500">
                  {message.email ||
                    "No email"}
                </p>

                {message.phone && (
                  <p className="mt-1 text-sm text-slate-500">
                    {message.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              Message
            </p>

            <div className="mt-2 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-700 shadow-sm">
              {message.message ||
                "No message content."}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <DetailBox
              label="Category"
              value={
                message.category ||
                message.type ||
                "General"
              }
            />

            <DetailBox
              label="Priority"
              value={
                message.priority ||
                "Normal"
              }
            />

            <DetailBox
              label="Status"
              value={
                message.replied
                  ? "Replied"
                  : message.read
                    ? "Read"
                    : "Unread"
              }
            />

            <DetailBox
              label="Received"
              value={formatTimestamp(
                message.createdAt
              )}
            />
          </div>

          {(message.reply ||
            message.replyMessage) && (
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-600">
                Admin Reply
              </p>

              <div className="mt-2 whitespace-pre-wrap rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-7 text-emerald-900">
                {message.reply ||
                  message.replyMessage}
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
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
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>

            <button
              type="button"
              onClick={onReply}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:from-blue-700 hover:to-indigo-700"
            >
              <Reply className="h-4 w-4" />
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   REPLY MODAL
============================================================ */

function ReplyModal({
  message,
  value,
  setValue,
  processing,
  onClose,
  onSubmit,
}: {
  message: MessageRecord;
  value: string;
  setValue: (value: string) => void;
  processing: boolean;
  onClose: () => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Communication
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-900">
              Reply to Message
            </h2>

            <p className="mt-1 break-all text-sm text-slate-500">
              {message.email ||
                "Unknown recipient"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
            aria-label="Close reply dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-5 p-6"
        >
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              Original subject
            </p>

            <p className="mt-1 font-bold text-slate-800">
              {message.subject ||
                "No subject"}
            </p>
          </div>

          <div>
            <label
              htmlFor="reply-message"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Reply
            </label>

            <textarea
              id="reply-message"
              value={value}
              onChange={(event) =>
                setValue(
                  event.target.value
                )
              }
              rows={7}
              placeholder="Write your reply..."
              disabled={processing}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}

              {processing
                ? "Saving..."
                : "Send Reply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   COMPOSE MODAL
============================================================ */

function ComposeModal({
  form,
  setForm,
  processing,
  onClose,
  onSubmit,
}: {
  form: ComposeForm;
  setForm: React.Dispatch<
    React.SetStateAction<ComposeForm>
  >;
  processing: boolean;
  onClose: () => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              New communication
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-900">
              New Message
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
            aria-label="Close compose dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-5 p-6"
        >
          <Input
            label="Recipient *"
            value={form.recipient}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                recipient: value,
              }))
            }
            placeholder="user@example.com"
            type="email"
            disabled={processing}
          />

          <Input
            label="Subject *"
            value={form.subject}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                subject: value,
              }))
            }
            placeholder="Message subject"
            disabled={processing}
          />

          <div>
            <label
              htmlFor="compose-message"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Message *
            </label>

            <textarea
              id="compose-message"
              value={form.message}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  message:
                    event.target.value,
                }))
              }
              rows={7}
              placeholder="Write your message..."
              disabled={processing}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}

              {processing
                ? "Sending..."
                : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   DETAIL BOX
============================================================ */

function DetailBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
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
   INPUT
============================================================ */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label
        className="mb-2 block text-sm font-bold text-slate-700"
      >
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
        disabled={disabled}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

/* ============================================================
   LOADING STATE
============================================================ */

function LoadingState() {
  return (
    <div className="divide-y divide-slate-100">
      {[1, 2, 3, 4, 5].map(
        (item) => (
          <div
            key={item}
            className="animate-pulse p-5"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-slate-100" />

              <div className="min-w-0 flex-1">
                <div className="h-4 w-48 rounded bg-slate-100" />

                <div className="mt-3 h-3 w-64 rounded bg-slate-100" />

                <div className="mt-5 h-20 rounded-2xl bg-slate-100" />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

/* ============================================================
   TIMESTAMP
============================================================ */

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

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (
      value as {
        toDate?: unknown;
      }
    ).toDate === "function"
  ) {
    return (
      value as {
        toDate: () => Date;
      }
    )
      .toDate()
      .getTime();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  const parsed = new Date(
    String(value)
  ).getTime();

  return Number.isNaN(parsed)
    ? 0
    : parsed;
}

