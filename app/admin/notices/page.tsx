"use client";

import { useState } from "react";
import {
  Bell,
  CalendarDays,
  Edit3,
  Megaphone,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { firestoreDb } from "@/lib/firebase/client";
import { useLiveCollection } from "@/hooks/useLiveCollection";
import { useScmsSession } from "@/lib/auth/session";

type Notice = {
  id: string;
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  priority?: string;
  status?: string;
  publishedAt?: string;
  date?: string;
  author?: string;
};

const categories = [
  "General",
  "Academic",
  "Examination",
  "Admission",
  "Holiday",
  "Placement",
  "Event",
];

const priorities = ["Normal", "Important", "Urgent"];

export default function AdminNoticesPage() {
  const { user } = useScmsSession("admin");

  const notices = useLiveCollection<Notice>(
    firestoreDb,
    "notices",
    {
      limit: 100,
    }
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Normal");
  const [status, setStatus] = useState("published");

  const [saving, setSaving] = useState(false);

  const filteredNotices = notices.data.filter((notice) => {
    const value = `${notice.title ?? ""} ${
      notice.description ?? notice.content ?? ""
    } ${notice.category ?? ""}`.toLowerCase();

    return value.includes(search.toLowerCase());
  });

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("General");
    setPriority("Normal");
    setStatus("published");
    setEditingId(null);
  }

  function openCreate() {
    resetForm();
    setShowForm(true);
  }

  function openEdit(notice: Notice) {
    setEditingId(notice.id);
    setTitle(notice.title ?? "");
    setDescription(
      notice.description ?? notice.content ?? ""
    );
    setCategory(notice.category ?? "General");
    setPriority(notice.priority ?? "Normal");
    setStatus(notice.status ?? "published");
    setShowForm(true);
  }

  async function saveNotice() {
    if (!firestoreDb) {
      alert("Firebase is not configured.");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a notice title.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateDoc(
          doc(firestoreDb, "notices", editingId),
          {
            title: title.trim(),
            description: description.trim(),
            content: description.trim(),
            category,
            priority,
            status,
            updatedAt: serverTimestamp(),
          }
        );
      } else {
        await addDoc(
          collection(firestoreDb, "notices"),
          {
            title: title.trim(),
            description: description.trim(),
            content: description.trim(),
            category,
            priority,
            status,
            author: user?.name ?? "Administrator",
            publishedAt:
              status === "published"
                ? new Date().toISOString()
                : "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );
      }

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Notice save failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to save notice."
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeNotice(id: string) {
    if (!firestoreDb) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(firestoreDb, "notices", id));
    } catch (error) {
      console.error("Notice deletion failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete notice."
      );
    }
  }

  async function toggleStatus(notice: Notice) {
    if (!firestoreDb) return;

    const nextStatus =
      notice.status === "published"
        ? "draft"
        : "published";

    try {
      await updateDoc(
        doc(firestoreDb, "notices", notice.id),
        {
          status: nextStatus,
          publishedAt:
            nextStatus === "published"
              ? new Date().toISOString()
              : "",
          updatedAt: serverTimestamp(),
        }
      );
    } catch (error) {
      console.error("Notice status update failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to update notice."
      );
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="container-page py-8">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl bg-[var(--navy)] p-8 text-white shadow-xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-[var(--gold)]/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
                <Bell className="h-4 w-4" />
                Live Notice Management
              </div>

              <h1 className="text-3xl font-black sm:text-4xl">
                Notices
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                Publish official college announcements and
                deliver updates to the public website in
                real time.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-3 font-bold text-[var(--navy)] shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <Plus className="h-5 w-5 transition group-hover:rotate-90" />
              New Notice
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            icon={Bell}
            label="Total Notices"
            value={notices.data.length}
          />

          <Stat
            icon={Megaphone}
            label="Published"
            value={
              notices.data.filter(
                (item) => item.status === "published"
              ).length
            }
          />

          <Stat
            icon={CalendarDays}
            label="Drafts"
            value={
              notices.data.filter(
                (item) => item.status !== "published"
              ).length
            }
          />

          <Stat
            icon={Bell}
            label="Urgent"
            value={
              notices.data.filter(
                (item) => item.priority === "Urgent"
              ).length
            }
          />
        </section>

        {/* Search */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search notices..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </section>

        {/* Realtime indicator */}
        <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-600">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          Live Firestore connection
        </div>

        {/* Notices */}
        <section className="mt-4">
          {notices.loading && (
            <div className="grid gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-2xl bg-slate-200"
                />
              ))}
            </div>
          )}

          {!notices.loading &&
            !filteredNotices.length && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <Bell className="mx-auto h-10 w-10 text-slate-300" />

                <h3 className="mt-4 text-lg font-black text-[var(--navy)]">
                  No notices found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Create your first official college notice.
                </p>
              </div>
            )}

          <div className="grid gap-4">
            {filteredNotices.map((notice) => (
              <article
                key={notice.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-[var(--gold)]" />

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {notice.category || "General"}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          notice.priority === "Urgent"
                            ? "bg-red-50 text-red-700"
                            : notice.priority === "Important"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {notice.priority || "Normal"}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          toggleStatus(notice)
                        }
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          notice.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {notice.status === "published"
                          ? "Published"
                          : "Draft"}
                      </button>
                    </div>

                    <h2 className="mt-4 text-xl font-black text-[var(--navy)]">
                      {notice.title || "Untitled Notice"}
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                      {notice.description ||
                        notice.content ||
                        "No description provided."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
                      <span>
                        Published:{" "}
                        {notice.publishedAt
                          ? new Date(
                              notice.publishedAt
                            ).toLocaleDateString("en-IN")
                          : "Not published"}
                      </span>

                      <span>
                        Author:{" "}
                        {notice.author ||
                          "Administrator"}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(notice)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        removeNotice(notice.id)
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="bg-[var(--navy)] p-6 text-white">
              <h2 className="text-2xl font-black">
                {editingId
                  ? "Edit Notice"
                  : "Create Notice"}
              </h2>

              <p className="mt-1 text-sm text-blue-100">
                This notice will update through the live
                Firestore connection.
              </p>
            </div>

            <div className="grid gap-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Notice Title
                </label>

                <input
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Enter notice title"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={5}
                  placeholder="Write the official announcement..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <SelectField
                  label="Category"
                  value={category}
                  onChange={setCategory}
                  options={categories}
                />

                <SelectField
                  label="Priority"
                  value={priority}
                  onChange={setPriority}
                  options={priorities}
                />

                <SelectField
                  label="Status"
                  value={status}
                  onChange={setStatus}
                  options={["published", "draft"]}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={saveNotice}
                  className="rounded-xl bg-[var(--blue)] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Notice"
                    : "Publish Notice"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Bell;
  label: string;
  value: number;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-[var(--blue)] transition group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </div>

        <span className="text-2xl font-black text-[var(--navy)]">
          {value}
        </span>
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}