"use client";

import {
  AlertCircle,
  Bell,
  CalendarDays,
  CheckCircle2,
  Edit3,
  FileText,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
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
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";

/* ============================================================
   TYPES
============================================================ */

type Notice = {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  priority: string;
  status: string;
  publishedAt: string;
  expiresAt: string;
  author: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

type NoticeForm = {
  title: string;
  description: string;
  content: string;
  category: string;
  priority: string;
  status: string;
  publishedAt: string;
  expiresAt: string;
  author: string;
};

const emptyForm: NoticeForm = {
  title: "",
  description: "",
  content: "",
  category: "General",
  priority: "normal",
  status: "draft",
  publishedAt: "",
  expiresAt: "",
  author: "",
};

/* ============================================================
   PAGE
============================================================ */

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<NoticeForm>({
      ...emptyForm,
    });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ==========================================================
     REAL-TIME FIRESTORE
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

    const unsubscribe = onSnapshot(
      collection(db, "notices"),
      (snapshot) => {
        const records: Notice[] =
          snapshot.docs.map((item) => {
            const data = item.data();

            return {
              id: item.id,

              title: String(
                data.title ?? ""
              ),

              description: String(
                data.description ?? ""
              ),

              content: String(
                data.content ?? ""
              ),

              category: String(
                data.category ??
                  "General"
              ),

              priority: String(
                data.priority ??
                  "normal"
              ),

              status: String(
                data.status ?? "draft"
              ),

              publishedAt: String(
                data.publishedAt ??
                  ""
              ),

              expiresAt: String(
                data.expiresAt ?? ""
              ),

              author: String(
                data.author ?? ""
              ),

              createdAt:
                data.createdAt,

              updatedAt:
                data.updatedAt,
            };
          });

        records.sort(
          (a, b) =>
            getTime(b.createdAt) -
            getTime(a.createdAt)
        );

        setNotices(records);
        setLoading(false);
        setError("");
      },
      (listenerError) => {
        console.error(
          "Admin notices listener error:",
          listenerError
        );

        setError(
          listenerError instanceof Error
            ? listenerError.message
            : "Unable to load notices."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ==========================================================
     SEARCH
  ========================================================== */

  const filteredNotices = useMemo(() => {
    const term = search
      .trim()
      .toLowerCase();

    if (!term) {
      return notices;
    }

    return notices.filter((notice) =>
      [
        notice.title,
        notice.description,
        notice.content,
        notice.category,
        notice.priority,
        notice.status,
        notice.author,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [notices, search]);

  /* ==========================================================
     COUNTS
  ========================================================== */

  const publishedCount =
    notices.filter(
      (notice) =>
        notice.status === "published"
    ).length;

  const draftCount =
    notices.length - publishedCount;

  const urgentCount =
    notices.filter(
      (notice) =>
        notice.priority === "urgent"
    ).length;

  const importantCount =
    notices.filter(
      (notice) =>
        notice.priority === "important"
    ).length;

  /* ==========================================================
     ADD FORM
  ========================================================== */

  function openAddForm() {
    setEditingId(null);

    setForm({
      ...emptyForm,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  /* ==========================================================
     EDIT FORM
  ========================================================== */

  function openEditForm(
    notice: Notice
  ) {
    setEditingId(notice.id);

    setForm({
      title: notice.title,
      description:
        notice.description,
      content: notice.content,
      category: notice.category,
      priority: notice.priority,
      status: notice.status,
      publishedAt:
        notice.publishedAt,
      expiresAt:
        notice.expiresAt,
      author: notice.author,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  /* ==========================================================
     CLOSE
  ========================================================== */

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

  /* ==========================================================
     SAVE
  ========================================================== */

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

    const title = form.title.trim();
    const description =
      form.description.trim();
    const content =
      form.content.trim();
    const author =
      form.author.trim();

    if (!title) {
      setError(
        "Notice title is required."
      );
      return;
    }

    if (!description) {
      setError(
        "Notice description is required."
      );
      return;
    }

    if (!content) {
      setError(
        "Notice content is required."
      );
      return;
    }

    if (
      form.status ===
        "published" &&
      !form.publishedAt
    ) {
      setError(
        "Please select a publish date for a published notice."
      );
      return;
    }

    if (
      form.publishedAt &&
      form.expiresAt &&
      form.expiresAt <
        form.publishedAt
    ) {
      setError(
        "Expiry date cannot be earlier than the publish date."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const noticeData = {
        title,
        description,
        content,

        category:
          form.category.trim() ||
          "General",

        priority:
          form.priority.trim() ||
          "normal",

        status:
          form.status.trim() ||
          "draft",

        publishedAt:
          form.status ===
          "published"
            ? form.publishedAt ||
              new Date()
                .toISOString()
                .slice(0, 10)
            : "",

        expiresAt:
          form.expiresAt,

        author:
          author ||
          "College Administration",

        updatedAt:
          serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(
          doc(
            db,
            "notices",
            editingId
          ),
          noticeData
        );

        setSuccess(
          "Notice updated successfully."
        );
      } else {
        await addDoc(
          collection(
            db,
            "notices"
          ),
          {
            ...noticeData,
            createdAt:
              serverTimestamp(),
          }
        );

        setSuccess(
          "Notice created successfully."
        );
      }

      setShowForm(false);
      setEditingId(null);

      setForm({
        ...emptyForm,
      });
    } catch (err) {
      console.error(
        "Notice save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save notice."
      );
    } finally {
      setSaving(false);
    }
  }

  /* ==========================================================
     DELETE
  ========================================================== */

  async function handleDelete(
    notice: Notice
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
        `Delete notice "${notice.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(notice.id);
      setError("");
      setSuccess("");

      await deleteDoc(
        doc(
          db,
          "notices",
          notice.id
        )
      );

      setSuccess(
        "Notice deleted successfully."
      );
    } catch (err) {
      console.error(
        "Notice delete error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete notice."
      );
    } finally {
      setDeletingId(null);
    }
  }

  /* ==========================================================
     TOGGLE STATUS
  ========================================================== */

  async function toggleStatus(
    notice: Notice
  ) {
    const db = firestoreDb;

    if (!db) {
      setError(
        "Firestore is not initialized."
      );
      return;
    }

    try {
      setError("");
      setSuccess("");

      const nextStatus =
        notice.status ===
        "published"
          ? "draft"
          : "published";

      await updateDoc(
        doc(
          db,
          "notices",
          notice.id
        ),
        {
          status: nextStatus,

          publishedAt:
            nextStatus ===
            "published"
              ? notice.publishedAt ||
                new Date()
                  .toISOString()
                  .slice(0, 10)
              : "",

          updatedAt:
            serverTimestamp(),
        }
      );

      setSuccess(
        nextStatus ===
          "published"
          ? "Notice published successfully."
          : "Notice moved to draft."
      );
    } catch (err) {
      console.error(
        "Notice status error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update notice."
      );
    }
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <PortalShell
      role="admin"
      title="Notices"
    >
      <main className="space-y-8 pb-10">

        {/* HEADER */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 p-6 text-white shadow-xl lg:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-100">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Notice Management
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100 sm:text-base">
              Create, publish and manage official college announcements with real-time Firestore synchronization.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-300" />
                </span>
                Live
              </span>

              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur">
                {notices.length} Total Notices
              </span>
            </div>
          </div>
        </div>

        <PageHeading
          eyebrow="College communication"
          title="Official Notices"
          description="Manage announcements, academic updates, examination notices, events and important college communications."
        />

        {/* ERROR */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                <div>
                  <p className="font-black text-red-800">
                    Notice operation failed
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
                className="rounded-lg p-1 text-red-500 transition hover:bg-red-100"
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
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />

              <p className="text-sm font-bold text-emerald-800">
                {success}
              </p>

              <button
                type="button"
                onClick={() =>
                  setSuccess("")
                }
                className="ml-auto rounded-lg p-1 text-emerald-600 transition hover:bg-emerald-100"
                aria-label="Close success"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STATISTICS */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Bell}
            label="Total"
            value={
              notices.length
            }
            gradient="from-blue-600 to-cyan-500"
          />

          <StatCard
            icon={Send}
            label="Published"
            value={
              publishedCount
            }
            gradient="from-emerald-600 to-teal-500"
          />

          <StatCard
            icon={FileText}
            label="Drafts"
            value={draftCount}
            gradient="from-purple-600 to-violet-500"
          />

          <StatCard
            icon={AlertCircle}
            label="Urgent"
            value={urgentCount}
            gradient="from-red-500 to-orange-500"
          />
        </section>

        {/* SECONDARY SUMMARY */}

        <section className="grid gap-4 sm:grid-cols-3">
          <MiniStat
            label="Important"
            value={
              importantCount
            }
            description="Priority notices"
            className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-800"
          />

          <MiniStat
            label="Search Results"
            value={
              filteredNotices.length
            }
            description="Currently visible"
            className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-800"
          />

          <MiniStat
            label="Live Records"
            value={
              notices.length
            }
            description="Firestore synchronized"
            className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-800"
          />
        </section>

        {/* SEARCH */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                  Real-time Firestore
                </p>

                <h2 className="mt-1 text-xl font-black text-[var(--navy)]">
                  College Notices
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {notices.length} notice
                  {notices.length === 1
                    ? ""
                    : "s"} in Firestore
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
                    placeholder="Search notices..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:w-80"
                  />
                </div>

                <button
                  type="button"
                  onClick={
                    openAddForm
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Notice
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Real-time notice system
              </span>

              <span className="text-xs text-slate-400">
                Firestore changes appear automatically.
              </span>

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Clear Search
                </button>
              )}
            </div>
          </div>
        </section>

        {/* TABLE */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <LoadingState />
          ) : filteredNotices.length ===
            0 ? (
            <EmptyState
              hasNotices={
                notices.length > 0
              }
              onAdd={
                openAddForm
              }
              onClear={() =>
                setSearch("")
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/50">
                    <TableHeader>
                      Notice
                    </TableHeader>

                    <TableHeader>
                      Category
                    </TableHeader>

                    <TableHeader>
                      Priority
                    </TableHeader>

                    <TableHeader>
                      Status
                    </TableHeader>

                    <TableHeader>
                      Published
                    </TableHeader>

                    <TableHeader>
                      Expiry
                    </TableHeader>

                    <TableHeader align="right">
                      Actions
                    </TableHeader>
                  </tr>
                </thead>

                <tbody>
                  {filteredNotices.map(
                    (notice) => {
                      const deleting =
                        deletingId ===
                        notice.id;

                      return (
                        <tr
                          key={
                            notice.id
                          }
                          className="group border-b border-slate-100 transition hover:bg-blue-50/30"
                        >
                          {/* NOTICE */}

                          <td className="px-5 py-5">
                            <div className="flex items-start gap-3">
                              <div
                                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white shadow-md ${
                                  notice.priority ===
                                  "urgent"
                                    ? "bg-gradient-to-br from-red-500 to-orange-500"
                                    : notice.priority ===
                                        "important"
                                      ? "bg-gradient-to-br from-amber-500 to-orange-500"
                                      : "bg-gradient-to-br from-blue-600 to-indigo-600"
                                }`}
                              >
                                <Bell className="h-5 w-5" />
                              </div>

                              <div className="min-w-0 max-w-[420px]">
                                <p className="truncate font-black text-slate-800">
                                  {notice.title ||
                                    "Untitled Notice"}
                                </p>

                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                  {notice.description ||
                                    notice.content ||
                                    "No description"}
                                </p>

                                {notice.author && (
                                  <p className="mt-2 text-[10px] font-semibold text-slate-400">
                                    By{" "}
                                    {
                                      notice.author
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* CATEGORY */}

                          <td className="px-5 py-5">
                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700">
                              {
                                notice.category
                              }
                            </span>
                          </td>

                          {/* PRIORITY */}

                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black capitalize ${
                                notice.priority ===
                                "urgent"
                                  ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                                  : notice.priority ===
                                      "important"
                                    ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                                    : "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                              }`}
                            >
                              {
                                notice.priority
                              }
                            </span>
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-5">
                            <button
                              type="button"
                              onClick={() =>
                                void toggleStatus(
                                  notice
                                )
                              }
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black transition hover:scale-105 ${
                                notice.status ===
                                "published"
                                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                  : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                              }`}
                            >
                              {notice.status ===
                              "published" ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                <FileText className="h-3.5 w-3.5" />
                              )}

                              {notice.status ===
                              "published"
                                ? "Published"
                                : "Draft"}
                            </button>
                          </td>

                          {/* PUBLISHED */}

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                              <CalendarDays className="h-4 w-4 text-blue-500" />

                              {notice.publishedAt ||
                                "Not published"}
                            </div>
                          </td>

                          {/* EXPIRY */}

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                              <CalendarDays className="h-4 w-4 text-orange-500" />

                              {notice.expiresAt ||
                                "No expiry"}
                            </div>
                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-5">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openEditForm(
                                    notice
                                  )
                                }
                                disabled={
                                  deleting
                                }
                                className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600 transition hover:scale-105 hover:bg-blue-100 disabled:opacity-50"
                                title="Edit notice"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                disabled={
                                  deleting
                                }
                                onClick={() =>
                                  void handleDelete(
                                    notice
                                  )
                                }
                                className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600 transition hover:scale-105 hover:bg-red-100 disabled:opacity-50"
                                title="Delete notice"
                              >
                                {deleting ? (
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
          <NoticeModal
            form={form}
            setForm={setForm}
            editing={Boolean(
              editingId
            )}
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
          className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg transition duration-300 group-hover:scale-110`}
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
   MINI STAT
============================================================ */

function MiniStat({
  label,
  value,
  description,
  className,
}: {
  label: string;
  value: number;
  description: string;
  className: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${className}`}
    >
      <p className="text-xs font-black uppercase tracking-wider opacity-70">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black">
        {value.toLocaleString()}
      </p>

      <p className="mt-1 text-xs font-semibold opacity-70">
        {description}
      </p>
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
   EMPTY STATE
============================================================ */

function EmptyState({
  hasNotices,
  onAdd,
  onClear,
}: {
  hasNotices: boolean;
  onAdd: () => void;
  onClear: () => void;
}) {
  return (
    <div className="p-14 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600">
        <Bell className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-800">
        {hasNotices
          ? "No matching notices"
          : "No notices yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasNotices
          ? "Try another search term."
          : "Create your first official college notice."}
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {hasNotices && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Clear Search
          </button>
        )}

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Notice
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   MODAL
============================================================ */

function NoticeModal({
  form,
  setForm,
  editing,
  saving,
  onClose,
  onSubmit,
}: {
  form: NoticeForm;
  setForm: React.Dispatch<
    React.SetStateAction<NoticeForm>
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-modal-title"
    >
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              College Administration
            </p>

            <h2
              id="notice-modal-title"
              className="mt-1 text-2xl font-black text-slate-900"
            >
              {editing
                ? "Edit Notice"
                : "Create Notice"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Publish official communication to students, faculty and visitors.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-500 shadow-sm transition hover:bg-slate-100 disabled:opacity-50"
            aria-label="Close notice modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-6 p-6"
        >
          {/* BASIC */}

          <FormSection
            title="Notice Information"
            description="Enter the main details of the college notice."
            icon={Bell}
            gradient="from-blue-600 to-indigo-600"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Notice Title *"
                value={
                  form.title
                }
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

              <Input
                label="Author"
                value={
                  form.author
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      author: value,
                    })
                  )
                }
                placeholder="College Administration"
              />
            </div>

            <div className="mt-5">
              <Input
                label="Short Description *"
                value={
                  form.description
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      description:
                        value,
                    })
                  )
                }
                placeholder="Short summary of the notice"
              />
            </div>
          </FormSection>

          {/* CONTENT */}

          <FormSection
            title="Notice Content"
            description="Write the complete announcement."
            icon={FileText}
            gradient="from-violet-600 to-purple-600"
          >
            <textarea
              value={form.content}
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    content:
                      event.target
                        .value,
                  })
                )
              }
              rows={8}
              placeholder="Write the complete notice here..."
              required
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />

            <p className="mt-2 text-xs text-slate-400">
              Use clear and professional language for official college communication.
            </p>
          </FormSection>

          {/* CATEGORY */}

          <FormSection
            title="Classification"
            description="Choose how the notice should be categorized and prioritized."
            icon={AlertCircle}
            gradient="from-orange-500 to-amber-500"
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <SelectField
                label="Category"
                value={
                  form.category
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      category:
                        value,
                    })
                  )
                }
                options={[
                  "General",
                  "Academic",
                  "Examination",
                  "Admission",
                  "Event",
                  "Placement",
                  "Scholarship",
                  "Holiday",
                ]}
              />

              <SelectField
                label="Priority"
                value={
                  form.priority
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      priority:
                        value,
                    })
                  )
                }
                options={[
                  "normal",
                  "important",
                  "urgent",
                ]}
              />

              <SelectField
                label="Status"
                value={
                  form.status
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      status:
                        value,
                    })
                  )
                }
                options={[
                  "draft",
                  "published",
                ]}
              />

              <Input
                label="Publish Date"
                type="date"
                value={
                  form.publishedAt
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      publishedAt:
                        value,
                    })
                  )
                }
              />
            </div>
          </FormSection>

          {/* DATES */}

          <FormSection
            title="Visibility Period"
            description="Define when the notice becomes visible and when it expires."
            icon={CalendarDays}
            gradient="from-emerald-600 to-teal-500"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Publish Date"
                type="date"
                value={
                  form.publishedAt
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      publishedAt:
                        value,
                    })
                  )
                }
              />

              <Input
                label="Expiry Date"
                type="date"
                value={
                  form.expiresAt
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      expiresAt:
                        value,
                    })
                  )
                }
              />
            </div>
          </FormSection>

          {/* PREVIEW */}

          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
            <div className="border-b border-blue-100 px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-600">
                Live Preview
              </p>
            </div>

            <div className="p-5">
              <div className="flex items-start gap-3">
                <div
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white ${
                    form.priority ===
                    "urgent"
                      ? "bg-gradient-to-br from-red-500 to-orange-500"
                      : form.priority ===
                          "important"
                        ? "bg-gradient-to-br from-amber-500 to-orange-500"
                        : "bg-gradient-to-br from-blue-600 to-indigo-600"
                  }`}
                >
                  <Bell className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-slate-700 shadow-sm">
                      {form.category}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-black capitalize ${
                        form.priority ===
                        "urgent"
                          ? "bg-red-100 text-red-700"
                          : form.priority ===
                              "important"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {form.priority}
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-black text-slate-900">
                    {form.title ||
                      "Notice title"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    {form.description ||
                      "Notice description"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                onClose
              }
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}

              {editing
                ? "Update Notice"
                : "Publish / Save Notice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   FORM SECTION
============================================================ */

function FormSection({
  title,
  description,
  icon: Icon,
  gradient,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50/60 p-5">
      <div className="mb-5 flex items-start gap-3">
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-black text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
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
        placeholder={
          placeholder
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}

/* ============================================================
   SELECT
============================================================ */

function SelectField({
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
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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

/* ============================================================
   LOADING
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
              <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-100" />

              <div className="flex-1">
                <div className="h-4 w-64 rounded bg-slate-100" />

                <div className="mt-3 h-3 w-96 rounded bg-slate-100" />

                <div className="mt-3 h-3 w-48 rounded bg-slate-100" />
              </div>

              <div className="hidden h-9 w-24 rounded-lg bg-slate-100 md:block" />
            </div>
          </div>
        )
      )}
    </div>
  );
}

/* ============================================================
   TIME
============================================================ */

function getTime(
  value: unknown
): number {
  if (!value) {
    return 0;
  }

  if (
    typeof value ===
      "object" &&
    value !== null &&
    "toMillis" in value &&
    typeof (
      value as {
        toMillis?: unknown;
      }
    ).toMillis ===
      "function"
  ) {
    return (
      value as {
        toMillis: () => number;
      }
    ).toMillis();
  }

  if (
    typeof value ===
      "object" &&
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
      .getTime();
  }

  if (
    value instanceof Date
  ) {
    return value.getTime();
  }

  if (
    typeof value ===
    "string"
  ) {
    const time = new Date(
      value
    ).getTime();

    return Number.isNaN(time)
      ? 0
      : time;
  }

  return 0;
}