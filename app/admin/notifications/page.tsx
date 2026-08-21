"use client";

import {
  Bell,
  BellRing,
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  Filter,
  Mail,
  Megaphone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";

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

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";

/* ============================================================
   TYPES
============================================================ */

type NotificationStatus =
  | "draft"
  | "published"
  | "archived";

type NotificationPriority =
  | "normal"
  | "important"
  | "urgent";

type NotificationTarget =
  | "all"
  | "students"
  | "faculty"
  | "admins"
  | "specific";

type NotificationRecord = {
  id: string;

  title: string;
  message: string;

  category: string;
  priority: NotificationPriority;
  status: NotificationStatus;

  target: NotificationTarget;

  recipientId?: string;
  recipientEmail?: string;

  senderId?: string;
  senderName?: string;

  read?: boolean;

  actionLabel?: string;
  actionUrl?: string;

  createdAt?: unknown;
  updatedAt?: unknown;
  publishedAt?: unknown;
};

type NotificationForm = {
  title: string;
  message: string;
  category: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  target: NotificationTarget;
  recipientEmail: string;
  actionLabel: string;
  actionUrl: string;
};

type FilterType =
  | "all"
  | "published"
  | "draft"
  | "archived"
  | "urgent"
  | "important";

/* ============================================================
   CONSTANTS
============================================================ */

const emptyForm: NotificationForm = {
  title: "",
  message: "",
  category: "General",
  priority: "normal",
  status: "draft",
  target: "all",
  recipientEmail: "",
  actionLabel: "",
  actionUrl: "",
};

const categories = [
  "General",
  "Academic",
  "Examination",
  "Attendance",
  "Fees",
  "Admission",
  "Event",
  "Placement",
  "Scholarship",
  "Holiday",
  "System",
];

const targetLabels: Record<
  NotificationTarget,
  string
> = {
  all: "Everyone",
  students: "Students",
  faculty: "Faculty",
  admins: "Administrators",
  specific: "Specific User",
};

/* ============================================================
   PAGE
============================================================ */

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<NotificationRecord[]>([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<FilterType>("all");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<NotificationForm>({
      ...emptyForm,
    });

  const [selectedNotification, setSelectedNotification] =
    useState<NotificationRecord | null>(null);

  /*
   * ==========================================================
   * REAL-TIME FIRESTORE LISTENER
   * ==========================================================
   */

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

    const notificationsQuery = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const records: NotificationRecord[] =
          snapshot.docs.map((item) => {
            const data = item.data();

            const rawPriority =
              String(
                data.priority ?? "normal"
              ).toLowerCase();

            const rawStatus =
              String(
                data.status ?? "draft"
              ).toLowerCase();

            const rawTarget =
              String(
                data.target ?? "all"
              ).toLowerCase();

            const priority: NotificationPriority =
              rawPriority === "urgent"
                ? "urgent"
                : rawPriority === "important"
                  ? "important"
                  : "normal";

            const status: NotificationStatus =
              rawStatus === "published"
                ? "published"
                : rawStatus === "archived"
                  ? "archived"
                  : "draft";

            const target: NotificationTarget =
              rawTarget === "students"
                ? "students"
                : rawTarget === "faculty"
                  ? "faculty"
                  : rawTarget === "admins"
                    ? "admins"
                    : rawTarget ===
                        "specific"
                      ? "specific"
                      : "all";

            return {
              id: item.id,
              title: String(
                data.title ?? ""
              ),
              message: String(
                data.message ?? ""
              ),
              category: String(
                data.category ?? "General"
              ),
              priority,
              status,
              target,

              recipientId:
                data.recipientId
                  ? String(
                      data.recipientId
                    )
                  : undefined,

              recipientEmail:
                data.recipientEmail
                  ? String(
                      data.recipientEmail
                    )
                  : undefined,

              senderId:
                data.senderId
                  ? String(
                      data.senderId
                    )
                  : undefined,

              senderName:
                data.senderName
                  ? String(
                      data.senderName
                    )
                  : undefined,

              read: Boolean(
                data.read ?? false
              ),

              actionLabel:
                data.actionLabel
                  ? String(
                      data.actionLabel
                    )
                  : undefined,

              actionUrl:
                data.actionUrl
                  ? String(
                      data.actionUrl
                    )
                  : undefined,

              createdAt:
                data.createdAt,

              updatedAt:
                data.updatedAt,

              publishedAt:
                data.publishedAt,
            };
          });

        setNotifications(records);
        setLoading(false);
        setError("");
      },
      (listenerError) => {
        console.error(
          "Notifications listener error:",
          listenerError
        );

        setError(
          listenerError instanceof Error
            ? listenerError.message
            : "Unable to load notifications."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /*
   * ==========================================================
   * FILTERED DATA
   * ==========================================================
   */

  const filteredNotifications =
    useMemo(() => {
      const term = search
        .trim()
        .toLowerCase();

      return notifications.filter(
        (notification) => {
          const matchesSearch =
            !term ||
            [
              notification.title,
              notification.message,
              notification.category,
              notification.priority,
              notification.status,
              notification.target,
              notification.recipientEmail,
              notification.senderName,
            ]
              .join(" ")
              .toLowerCase()
              .includes(term);

          let matchesFilter = true;

          if (filter === "published") {
            matchesFilter =
              notification.status ===
              "published";
          }

          if (filter === "draft") {
            matchesFilter =
              notification.status ===
              "draft";
          }

          if (filter === "archived") {
            matchesFilter =
              notification.status ===
              "archived";
          }

          if (filter === "urgent") {
            matchesFilter =
              notification.priority ===
              "urgent";
          }

          if (filter === "important") {
            matchesFilter =
              notification.priority ===
              "important";
          }

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      notifications,
      search,
      filter,
    ]);

  /*
   * ==========================================================
   * COUNTS
   * ==========================================================
   */

  const publishedCount =
    notifications.filter(
      (item) =>
        item.status === "published"
    ).length;

  const draftCount =
    notifications.filter(
      (item) => item.status === "draft"
    ).length;

  const urgentCount =
    notifications.filter(
      (item) =>
        item.priority === "urgent"
    ).length;

  const unreadCount =
    notifications.filter(
      (item) => !item.read
    ).length;

  /*
   * ==========================================================
   * OPEN ADD FORM
   * ==========================================================
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
   * ==========================================================
   * OPEN EDIT FORM
   * ==========================================================
   */

  function openEditForm(
    notification: NotificationRecord
  ) {
    setEditingId(
      notification.id
    );

    setForm({
      title: notification.title,
      message: notification.message,
      category:
        notification.category ||
        "General",
      priority:
        notification.priority,
      status:
        notification.status,
      target:
        notification.target,
      recipientEmail:
        notification.recipientEmail ||
        "",
      actionLabel:
        notification.actionLabel ||
        "",
      actionUrl:
        notification.actionUrl ||
        "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  /*
   * ==========================================================
   * CLOSE FORM
   * ==========================================================
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
   * ==========================================================
   * SAVE NOTIFICATION
   * ==========================================================
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

    const title =
      form.title.trim();

    const message =
      form.message.trim();

    const category =
      form.category.trim() ||
      "General";

    if (!title) {
      setError(
        "Notification title is required."
      );
      return;
    }

    if (!message) {
      setError(
        "Notification message is required."
      );
      return;
    }

    if (
      form.target ===
        "specific" &&
      !form.recipientEmail.trim()
    ) {
      setError(
        "Enter the recipient email for a specific-user notification."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const notificationData = {
        title,
        message,
        category,
        priority: form.priority,
        status: form.status,
        target: form.target,

        recipientEmail:
          form.recipientEmail
            .trim()
            .toLowerCase(),

        actionLabel:
          form.actionLabel.trim(),

        actionUrl:
          form.actionUrl.trim(),

        updatedAt:
          serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(
          doc(
            db,
            "notifications",
            editingId
          ),
          notificationData
        );

        setSuccess(
          "Notification updated successfully."
        );
      } else {
        await addDoc(
          collection(
            db,
            "notifications"
          ),
          {
            ...notificationData,
            read: false,
            createdAt:
              serverTimestamp(),
            publishedAt:
              form.status ===
              "published"
                ? serverTimestamp()
                : null,
          }
        );

        setSuccess(
          form.status === "published"
            ? "Notification published successfully."
            : "Notification saved as draft."
        );
      }

      closeForm();
    } catch (err) {
      console.error(
        "Notification save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save notification."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * ==========================================================
   * PUBLISH / UNPUBLISH
   * ==========================================================
   */

  async function togglePublish(
    notification: NotificationRecord
  ) {
    const db = firestoreDb;

    if (!db) {
      setError(
        "Firestore is not initialized."
      );
      return;
    }

    try {
      setProcessingId(
        notification.id
      );

      setError("");
      setSuccess("");

      if (
        notification.status ===
        "published"
      ) {
        await updateDoc(
          doc(
            db,
            "notifications",
            notification.id
          ),
          {
            status: "draft",
            updatedAt:
              serverTimestamp(),
          }
        );

        setSuccess(
          "Notification moved back to draft."
        );
      } else {
        await updateDoc(
          doc(
            db,
            "notifications",
            notification.id
          ),
          {
            status: "published",
            publishedAt:
              serverTimestamp(),
            updatedAt:
              serverTimestamp(),
          }
        );

        setSuccess(
          "Notification published successfully."
        );
      }
    } catch (err) {
      console.error(
        "Notification publish error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update notification status."
      );
    } finally {
      setProcessingId(null);
    }
  }

  /*
   * ==========================================================
   * ARCHIVE
   * ==========================================================
   */

  async function archiveNotification(
    notification: NotificationRecord
  ) {
    const db = firestoreDb;

    if (!db) {
      setError(
        "Firestore is not initialized."
      );
      return;
    }

    try {
      setProcessingId(
        notification.id
      );

      setError("");
      setSuccess("");

      await updateDoc(
        doc(
          db,
          "notifications",
          notification.id
        ),
        {
          status: "archived",
          updatedAt:
            serverTimestamp(),
        }
      );

      setSuccess(
        "Notification archived."
      );
    } catch (err) {
      console.error(
        "Archive notification error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to archive notification."
      );
    } finally {
      setProcessingId(null);
    }
  }

  /*
   * ==========================================================
   * DELETE
   * ==========================================================
   */

  async function handleDelete(
    notification: NotificationRecord
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
        `Delete "${notification.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(
        notification.id
      );

      setError("");
      setSuccess("");

      await deleteDoc(
        doc(
          db,
          "notifications",
          notification.id
        )
      );

      if (
        selectedNotification?.id ===
        notification.id
      ) {
        setSelectedNotification(null);
      }

      setSuccess(
        "Notification deleted successfully."
      );
    } catch (err) {
      console.error(
        "Notification delete error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete notification."
      );
    } finally {
      setProcessingId(null);
    }
  }

  /*
   * ==========================================================
   * DATE FORMAT
   * ==========================================================
   */

  function formatDate(
    value: unknown
  ): string {
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
            toDate?: () => Date;
          }
        ).toDate === "function"
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

  /*
   * ==========================================================
   * PAGE UI
   * ==========================================================
   */

  return (
    <PortalShell
      role="admin"
      title="Notifications"
    >
      <main className="space-y-8 pb-10">

        <PageHeading
          eyebrow="Communication center"
          title="Notification Management"
          description="Create, publish and manage real-time notifications for students, faculty and administrators."
        />

        {/* ====================================================
            ALERTS
        ===================================================== */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div>
                <p className="font-black text-red-800">
                  Notification operation failed
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />

              <p className="text-sm font-bold text-emerald-800">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* ====================================================
            STATISTICS
        ===================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={Bell}
            label="Total"
            value={
              notifications.length
            }
            gradient="from-blue-600 to-cyan-500"
          />

          <StatCard
            icon={Send}
            label="Published"
            value={publishedCount}
            gradient="from-emerald-600 to-teal-500"
          />

          <StatCard
            icon={Edit3}
            label="Drafts"
            value={draftCount}
            gradient="from-purple-600 to-violet-500"
          />

          <StatCard
            icon={BellRing}
            label="Urgent"
            value={urgentCount}
            gradient="from-red-600 to-rose-500"
          />

        </section>

        {/* ====================================================
            SEARCH + FILTER
        ===================================================== */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-xl font-black text-[var(--navy)]">
                Notification Center
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Firestore changes appear here automatically.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search notifications..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white sm:w-72"
                />
              </div>

              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(
                      event.target
                        .value as FilterType
                    )
                  }
                  className="rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="all">
                    All notifications
                  </option>

                  <option value="published">
                    Published
                  </option>

                  <option value="draft">
                    Drafts
                  </option>

                  <option value="archived">
                    Archived
                  </option>

                  <option value="urgent">
                    Urgent
                  </option>

                  <option value="important">
                    Important
                  </option>
                </select>
              </div>

              <button
                type="button"
                onClick={openAddForm}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                New Notification
              </button>

            </div>
          </div>
        </section>

        {/* ====================================================
            LIVE STATUS
        ===================================================== */}

        <div className="flex flex-wrap items-center gap-3">

          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            Real-time notifications
          </span>

          <span className="text-[10px] font-semibold text-slate-400">
            {unreadCount} unread
          </span>

        </div>

        {/* ====================================================
            LIST
        ===================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {loading ? (
            <div className="flex items-center justify-center p-14">

              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />

              <span className="ml-3 text-sm font-semibold text-slate-500">
                Loading notifications...
              </span>

            </div>
          ) : filteredNotifications.length ===
            0 ? (
            <div className="p-14 text-center">

              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                <Bell className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-700">
                No notifications found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Create a notification or change your current filters.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white"
              >
                <Plus className="h-4 w-4" />
                Create Notification
              </button>

            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {filteredNotifications.map(
                (notification) => {
                  const processing =
                    processingId ===
                    notification.id;

                  return (
                    <article
                      key={notification.id}
                      className="group p-5 transition hover:bg-slate-50"
                    >

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                        <div className="flex min-w-0 gap-4">

                          <div
                            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                              notification.priority ===
                              "urgent"
                                ? "bg-red-100 text-red-700"
                                : notification.priority ===
                                  "important"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            <Bell className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <h3 className="text-base font-black text-slate-900">
                                {notification.title ||
                                  "Untitled Notification"}
                              </h3>

                              <StatusBadge
                                status={
                                  notification.status
                                }
                              />

                              <PriorityBadge
                                priority={
                                  notification.priority
                                }
                              />

                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-2">

                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600">
                                {
                                  notification.category
                                }
                              </span>

                              <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-700">
                                {
                                  targetLabels[
                                    notification
                                      .target
                                  ]
                                }
                              </span>

                            </div>

                            <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-slate-500">
                              {
                                notification.message
                              }
                            </p>

                            <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-slate-400">

                              <span>
                                {
                                  formatDate(
                                    notification.createdAt
                                  )
                                }
                              </span>

                              {notification.recipientEmail && (
                                <span className="inline-flex items-center gap-1.5">
                                  <Mail className="h-3.5 w-3.5" />
                                  {
                                    notification.recipientEmail
                                  }
                                </span>
                              )}

                              {notification.actionUrl && (
                                <span className="inline-flex items-center gap-1.5">
                                  <Eye className="h-3.5 w-3.5" />
                                  Action link
                                </span>
                              )}

                            </div>

                          </div>
                        </div>

                        {/* ACTIONS */}

                        <div className="flex shrink-0 flex-wrap gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedNotification(
                                notification
                              )
                            }
                            className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(
                                notification
                              )
                            }
                            disabled={
                              processing
                            }
                            className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void togglePublish(
                                notification
                              )
                            }
                            disabled={
                              processing
                            }
                            className={`grid h-9 w-9 place-items-center rounded-lg transition disabled:opacity-50 ${
                              notification.status ===
                              "published"
                                ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            }`}
                            title={
                              notification.status ===
                              "published"
                                ? "Move to Draft"
                                : "Publish"
                            }
                          >
                            {processing ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : notification.status ===
                              "published" ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void archiveNotification(
                                notification
                              )
                            }
                            disabled={
                              processing ||
                              notification.status ===
                                "archived"
                            }
                            className="grid h-9 w-9 place-items-center rounded-lg bg-purple-50 text-purple-600 transition hover:bg-purple-100 disabled:opacity-50"
                            title="Archive"
                          >
                            <Megaphone className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void handleDelete(
                                notification
                              )
                            }
                            disabled={
                              processing
                            }
                            className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                            title="Delete"
                          >
                            {processing ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* ====================================================
            ADD / EDIT MODAL
        ===================================================== */}

        {showForm && (
          <NotificationModal
            form={form}
            setForm={setForm}
            editing={Boolean(
              editingId
            )}
            saving={saving}
            onClose={closeForm}
            onSubmit={handleSubmit}
          />
        )}

        {/* ====================================================
            DETAILS MODAL
        ===================================================== */}

        {selectedNotification && (
          <NotificationDetailsModal
            notification={
              selectedNotification
            }
            onClose={() =>
              setSelectedNotification(
                null
              )
            }
            onEdit={() => {
              const item =
                selectedNotification;

              setSelectedNotification(
                null
              );

              openEditForm(item);
            }}
            onPublish={() => {
              void togglePublish(
                selectedNotification
              );
            }}
            onDelete={() => {
              void handleDelete(
                selectedNotification
              );
            }}
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
  icon: ElementType;
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
   STATUS BADGE
============================================================ */

function StatusBadge({
  status,
}: {
  status: NotificationStatus;
}) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
        <CheckCircle2 className="h-3 w-3" />
        Published
      </span>
    );
  }

  if (status === "archived") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600">
        Archived
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
      Draft
    </span>
  );
}

/* ============================================================
   PRIORITY BADGE
============================================================ */

function PriorityBadge({
  priority,
}: {
  priority: NotificationPriority;
}) {
  const styles = {
    urgent:
      "bg-red-50 text-red-700",
    important:
      "bg-amber-50 text-amber-700",
    normal:
      "bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

/* ============================================================
   NOTIFICATION FORM MODAL
============================================================ */

function NotificationModal({
  form,
  setForm,
  editing,
  saving,
  onClose,
  onSubmit,
}: {
  form: NotificationForm;
  setForm: Dispatch<
    SetStateAction<NotificationForm>
  >;
  editing: boolean;
  saving: boolean;
  onClose: () => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Notification center
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-900">
              {editing
                ? "Edit Notification"
                : "Create Notification"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create an official notification for the SCMS portal.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-5 p-6"
        >

          <div className="grid gap-5 sm:grid-cols-2">

            <Input
              label="Notification Title *"
              value={form.title}
              onChange={(value) =>
                setForm(
                  (current) => ({
                    ...current,
                    title: value,
                  })
                )
              }
              placeholder="Important college announcement"
            />

            <SelectInput
              label="Category"
              value={form.category}
              onChange={(value) =>
                setForm(
                  (current) => ({
                    ...current,
                    category: value,
                  })
                )
              }
              options={categories}
            />

            <SelectInput
              label="Priority"
              value={form.priority}
              onChange={(value) =>
                setForm(
                  (current) => ({
                    ...current,
                    priority:
                      value as NotificationPriority,
                  })
                )
              }
              options={[
                "normal",
                "important",
                "urgent",
              ]}
            />

            <SelectInput
              label="Status"
              value={form.status}
              onChange={(value) =>
                setForm(
                  (current) => ({
                    ...current,
                    status:
                      value as NotificationStatus,
                  })
                )
              }
              options={[
                "draft",
                "published",
                "archived",
              ]}
            />

            <SelectInput
              label="Target Audience"
              value={form.target}
              onChange={(value) =>
                setForm(
                  (current) => ({
                    ...current,
                    target:
                      value as NotificationTarget,
                  })
                )
              }
              options={[
                "all",
                "students",
                "faculty",
                "admins",
                "specific",
              ]}
              displayLabels={{
                all: "Everyone",
                students: "Students",
                faculty: "Faculty",
                admins:
                  "Administrators",
                specific:
                  "Specific User",
              }}
            />

            {form.target ===
              "specific" && (
              <Input
                label="Recipient Email *"
                type="email"
                value={
                  form.recipientEmail
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      recipientEmail:
                        value,
                    })
                  )
                }
                placeholder="student@example.com"
              />
            )}

          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Notification Message *
            </label>

            <textarea
              value={form.message}
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    message:
                      event.target.value,
                  })
                )
              }
              rows={7}
              placeholder="Write the notification message..."
              disabled={saving}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:bg-white disabled:opacity-60"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">

            <Input
              label="Action Button Label"
              value={
                form.actionLabel
              }
              onChange={(value) =>
                setForm(
                  (current) => ({
                    ...current,
                    actionLabel:
                      value,
                  })
                )
              }
              placeholder="View Details"
            />

            <Input
              label="Action URL"
              value={form.actionUrl}
              onChange={(value) =>
                setForm(
                  (current) => ({
                    ...current,
                    actionUrl:
                      value,
                  })
                )
              }
              placeholder="/student/exams"
            />

          </div>

          {form.status ===
            "published" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

              <div className="flex gap-3">

                <Send className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="font-bold text-emerald-800">
                    This notification will be published
                  </p>

                  <p className="mt-1 text-sm text-emerald-700">
                    It will immediately become visible to the selected audience.
                  </p>
                </div>

              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Bell className="h-4 w-4" />
              )}

              {saving
                ? "Saving..."
                : editing
                  ? "Update Notification"
                  : "Save Notification"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

/* ============================================================
   DETAILS MODAL
============================================================ */

function NotificationDetailsModal({
  notification,
  onClose,
  onEdit,
  onPublish,
  onDelete,
}: {
  notification: NotificationRecord;
  onClose: () => void;
  onEdit: () => void;
  onPublish: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
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
              Notification details
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-900">
              {notification.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        <div className="space-y-6 p-6">

          <div className="flex flex-wrap gap-2">

            <StatusBadge
              status={
                notification.status
              }
            />

            <PriorityBadge
              priority={
                notification.priority
              }
            />

            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600">
              {
                notification.category
              }
            </span>

            <span className="rounded-full bg-cyan-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-700">
              {
                targetLabels[
                  notification.target
                ]
              }
            </span>

          </div>

          <div className="rounded-2xl bg-slate-50 p-5">

            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {
                notification.message
              }
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <DetailItem
              label="Audience"
              value={
                targetLabels[
                  notification.target
                ]
              }
            />

            <DetailItem
              label="Category"
              value={
                notification.category
              }
            />

            <DetailItem
              label="Created"
              value={formatDetailDate(
                notification.createdAt
              )}
            />

            <DetailItem
              label="Status"
              value={
                notification.status
              }
            />

          </div>

          {notification.recipientEmail && (
            <DetailItem
              label="Recipient"
              value={
                notification.recipientEmail
              }
            />
          )}

          {notification.actionUrl && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

              <p className="text-[10px] font-black uppercase tracking-wider text-blue-500">
                Action
              </p>

              <p className="mt-1 break-all text-sm font-bold text-blue-800">
                {notification.actionLabel ||
                  "Open"}
                {" · "}
                {
                  notification.actionUrl
                }
              </p>

            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Close
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>

            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-900"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>

            <button
              type="button"
              onClick={onPublish}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              {notification.status ===
              "published" ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}

              {notification.status ===
              "published"
                ? "Unpublish"
                : "Publish"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DETAIL ITEM
============================================================ */

function DetailItem({
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
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
      />

    </div>
  );
}

/* ============================================================
   SELECT
============================================================ */

function SelectInput({
  label,
  value,
  onChange,
  options,
  displayLabels,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  options: string[];
  displayLabels?: Record<
    string,
    string
  >;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {displayLabels?.[
                option
              ] ??
                option}
            </option>
          )
        )}
      </select>

    </div>
  );
}

/* ============================================================
   DATE HELPER
============================================================ */

function formatDetailDate(
  value: unknown
): string {
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
          toDate?: () => Date;
        }
      ).toDate === "function"
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