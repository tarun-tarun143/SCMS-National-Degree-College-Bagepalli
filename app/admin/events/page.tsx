"use client";

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  Users,
  X,
} from "lucide-react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";

type EventRecord = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  tag: string;
  status: string;
  imageUrl: string;
  organizer: string;
  capacity: number;
  createdAt?: unknown;
  updatedAt?: unknown;
};

type EventForm = {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  tag: string;
  status: string;
  imageUrl: string;
  organizer: string;
  capacity: string;
};

const emptyForm: EventForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  venue: "",
  category: "General",
  tag: "",
  status: "draft",
  imageUrl: "",
  organizer: "",
  capacity: "",
};

const categories = [
  "General",
  "Academic",
  "Cultural",
  "Sports",
  "Workshop",
  "Seminar",
  "Competition",
  "Placement",
  "Celebration",
  "Other",
];

export default function AdminEventsPage() {
  const [events, setEvents] =
    useState<EventRecord[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<EventForm>({
      ...emptyForm,
    });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * ============================================================
   * REAL-TIME FIRESTORE LISTENER
   * ============================================================
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

    const unsubscribe = onSnapshot(
      collection(db, "events"),
      (snapshot) => {
        const records: EventRecord[] =
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
              date: String(
                data.date ?? ""
              ),
              time: String(
                data.time ?? ""
              ),
              venue: String(
                data.venue ?? ""
              ),
              category: String(
                data.category ?? "General"
              ),
              tag: String(
                data.tag ?? ""
              ),
              status: String(
                data.status ?? "draft"
              ),
              imageUrl: String(
                data.imageUrl ?? ""
              ),
              organizer: String(
                data.organizer ?? ""
              ),
              capacity: Number(
                data.capacity ?? 0
              ),
              createdAt:
                data.createdAt,
              updatedAt:
                data.updatedAt,
            };
          });

        records.sort(
          (a, b) =>
            getTimestamp(b.createdAt) -
            getTimestamp(a.createdAt)
        );

        setEvents(records);
        setLoading(false);
        setError("");
      },
      (listenerError) => {
        console.error(
          "Admin events listener error:",
          listenerError
        );

        setError(
          listenerError instanceof Error
            ? listenerError.message
            : "Unable to load events."
        );

        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  /*
   * ============================================================
   * SEARCH
   * ============================================================
   */

  const filteredEvents = useMemo(() => {
    const term = search
      .trim()
      .toLowerCase();

    if (!term) {
      return events;
    }

    return events.filter((event) =>
      [
        event.title,
        event.description,
        event.date,
        event.time,
        event.venue,
        event.category,
        event.tag,
        event.status,
        event.organizer,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [events, search]);

  /*
   * ============================================================
   * STATISTICS
   * ============================================================
   */

  const publishedCount =
    events.filter(
      (event) =>
        event.status === "published"
    ).length;

  const draftCount =
    events.filter(
      (event) =>
        event.status === "draft"
    ).length;

  const totalCapacity =
    events.reduce(
      (sum, event) =>
        sum + Number(event.capacity || 0),
      0
    );

  /*
   * ============================================================
   * OPEN ADD
   * ============================================================
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
   * ============================================================
   * OPEN EDIT
   * ============================================================
   */

  function openEditForm(
    event: EventRecord
  ) {
    setEditingId(event.id);

    setForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      venue: event.venue,
      category: event.category,
      tag: event.tag,
      status: event.status,
      imageUrl: event.imageUrl,
      organizer: event.organizer,
      capacity:
        event.capacity > 0
          ? String(event.capacity)
          : "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  /*
   * ============================================================
   * CLOSE FORM
   * ============================================================
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
   * ============================================================
   * SAVE / UPDATE EVENT
   * ============================================================
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

    if (!form.title.trim()) {
      setError(
        "Event title is required."
      );
      return;
    }

    if (!form.description.trim()) {
      setError(
        "Event description is required."
      );
      return;
    }

    if (!form.date) {
      setError(
        "Event date is required."
      );
      return;
    }

    if (!form.time.trim()) {
      setError(
        "Event time is required."
      );
      return;
    }

    if (!form.venue.trim()) {
      setError(
        "Event venue is required."
      );
      return;
    }

    const capacityText =
      form.capacity.trim();

    const capacity = capacityText
      ? Number(capacityText)
      : 0;

    if (
      capacityText &&
      (!Number.isFinite(capacity) ||
        capacity < 0)
    ) {
      setError(
        "Capacity must be a valid non-negative number."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const eventData = {
        title:
          form.title.trim(),

        description:
          form.description.trim(),

        date:
          form.date,

        time:
          form.time.trim(),

        venue:
          form.venue.trim(),

        category:
          form.category,

        tag:
          form.tag.trim(),

        status:
          form.status,

        imageUrl:
          form.imageUrl.trim(),

        organizer:
          form.organizer.trim(),

        capacity,

        updatedAt:
          serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(
          doc(
            db,
            "events",
            editingId
          ),
          eventData
        );

        setSuccess(
          "Event updated successfully."
        );
      } else {
        await addDoc(
          collection(
            db,
            "events"
          ),
          {
            ...eventData,
            createdAt:
              serverTimestamp(),
          }
        );

        setSuccess(
          "Event created successfully."
        );
      }

      setShowForm(false);
      setEditingId(null);

      setForm({
        ...emptyForm,
      });
    } catch (err) {
      console.error(
        "Event save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save event."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * ============================================================
   * DELETE EVENT
   * ============================================================
   */

  async function handleDelete(
    event: EventRecord
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
        `Delete event "${event.title}"? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(event.id);
      setError("");
      setSuccess("");

      await deleteDoc(
        doc(
          db,
          "events",
          event.id
        )
      );

      setSuccess(
        `"${event.title}" was deleted successfully.`
      );
    } catch (err) {
      console.error(
        "Event delete error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete event."
      );
    } finally {
      setDeletingId(null);
    }
  }

  /*
   * ============================================================
   * TOGGLE PUBLISH / DRAFT
   * ============================================================
   */

  async function toggleStatus(
    event: EventRecord
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
        event.status === "published"
          ? "draft"
          : "published";

      await updateDoc(
        doc(
          db,
          "events",
          event.id
        ),
        {
          status:
            nextStatus,

          updatedAt:
            serverTimestamp(),
        }
      );

      setSuccess(
        nextStatus === "published"
          ? "Event published successfully."
          : "Event moved to draft."
      );
    } catch (err) {
      console.error(
        "Event status error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update event status."
      );
    }
  }

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  return (
    <PortalShell
      role="admin"
      title="Events"
    >
      <main className="space-y-8 pb-10">

        {/* PAGE HEADER */}

        <PageHeading
          eyebrow="Administration"
          title="Event Management"
          description="Create, edit, publish and manage college events in real time."
        />

        {/* ERROR */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">

            <div className="flex items-start gap-3">

              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div className="min-w-0 flex-1">

                <p className="font-black text-red-800">
                  Event operation failed
                </p>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  {error}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                className="text-red-500 hover:text-red-700"
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
                className="ml-auto text-emerald-600 hover:text-emerald-800"
                aria-label="Close success message"
              >
                <X className="h-4 w-4" />
              </button>

            </div>

          </div>
        )}

        {/* REAL-TIME STATUS */}

        <div className="flex flex-wrap items-center gap-3">

          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            Real-time event system

          </span>

          <span className="text-xs text-slate-400">
            Firestore changes appear automatically.
          </span>

        </div>

        {/* STATISTICS */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={CalendarDays}
            label="Total Events"
            value={events.length}
          />

          <StatCard
            icon={Send}
            label="Published"
            value={publishedCount}
          />

          <StatCard
            icon={RefreshCw}
            label="Drafts"
            value={draftCount}
          />

          <StatCard
            icon={Users}
            label="Total Capacity"
            value={totalCapacity}
          />

        </section>

        {/* SEARCH + ADD */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h2 className="text-xl font-black text-[var(--navy)]">
                College Events
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {events.length} event
                {events.length === 1
                  ? ""
                  : "s"} in Firestore
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
                  placeholder="Search events..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white sm:w-72"
                />

              </div>

              <button
                type="button"
                onClick={
                  openAddForm
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Event
              </button>

            </div>

          </div>

        </section>

        {/* TABLE */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {loading ? (
            <div className="flex items-center justify-center p-12">

              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />

              <span className="ml-3 text-sm font-semibold text-slate-500">
                Loading events...
              </span>

            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-12 text-center">

              <CalendarDays className="mx-auto h-12 w-12 text-slate-300" />

              <h3 className="mt-4 text-lg font-black text-slate-700">
                {events.length === 0
                  ? "No events yet"
                  : "No matching events"}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {events.length === 0
                  ? "Create your first college event."
                  : "Try another search term."}
              </p>

              {events.length === 0 && (
                <button
                  type="button"
                  onClick={
                    openAddForm
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Event
                </button>
              )}

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1250px]">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50">

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Event
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Date / Time
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Venue
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredEvents.map(
                    (event) => {
                      const deleting =
                        deletingId ===
                        event.id;

                      const isPublished =
                        event.status ===
                        "published";

                      return (
                        <tr
                          key={
                            event.id
                          }
                          className="border-b border-slate-100 transition hover:bg-slate-50"
                        >

                          {/* EVENT */}

                          <td className="px-5 py-4">

                            <div className="flex items-start gap-3">

                              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">

                                <CalendarDays className="h-5 w-5" />

                              </div>

                              <div className="max-w-[400px]">

                                <p className="font-bold text-slate-800">
                                  {event.title ||
                                    "Untitled Event"}
                                </p>

                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                  {event.description ||
                                    "No description"}
                                </p>

                                {event.organizer && (
                                  <p className="mt-1 text-[11px] font-semibold text-slate-400">
                                    {event.organizer}
                                  </p>
                                )}

                              </div>

                            </div>

                          </td>

                          {/* DATE/TIME */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">

                              <CalendarDays className="h-4 w-4 text-blue-500" />

                              {event.date ||
                                "Not set"}

                            </div>

                            <div className="mt-1 text-xs text-slate-500">
                              {event.time ||
                                "Time not set"}
                            </div>

                          </td>

                          {/* VENUE */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2 text-sm text-slate-600">

                              <MapPin className="h-4 w-4 text-amber-500" />

                              <span>
                                {event.venue ||
                                  "Not assigned"}
                              </span>

                            </div>

                          </td>

                          {/* CATEGORY */}

                          <td className="px-5 py-4">

                            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-black text-purple-700">
                              {event.category ||
                                "General"}
                            </span>

                            {event.tag && (
                              <p className="mt-1 text-[10px] text-slate-400">
                                #{event.tag}
                              </p>
                            )}

                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">

                            <button
                              type="button"
                              onClick={() =>
                                void toggleStatus(
                                  event
                                )
                              }
                              className={`rounded-full px-3 py-1 text-xs font-black transition ${
                                isPublished
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  : event.status ===
                                      "cancelled"
                                    ? "bg-red-50 text-red-700"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                              title="Click to change status"
                            >
                              {isPublished
                                ? "Published"
                                : event.status ===
                                    "cancelled"
                                  ? "Cancelled"
                                  : "Draft"}
                            </button>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-2">

                              {/* EDIT */}

                              <button
                                type="button"
                                onClick={() =>
                                  openEditForm(
                                    event
                                  )
                                }
                                disabled={
                                  deleting
                                }
                                className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                                title="Edit event"
                                aria-label={`Edit ${event.title}`}
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>

                              {/* DELETE */}

                              <button
                                type="button"
                                disabled={
                                  deleting
                                }
                                onClick={() =>
                                  void handleDelete(
                                    event
                                  )
                                }
                                className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                title="Delete event"
                                aria-label={`Delete ${event.title}`}
                              >
                                {deleting ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
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
          <EventModal
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

/*
============================================================
EVENT MODAL
============================================================
*/

function EventModal({
  form,
  setForm,
  editing,
  saving,
  onClose,
  onSubmit,
}: {
  form: EventForm;
  setForm: React.Dispatch<
    React.SetStateAction<EventForm>
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
      aria-labelledby="event-modal-title"
    >
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

          <div>

            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Administration
            </p>

            <h2
              id="event-modal-title"
              className="mt-1 text-xl font-black text-slate-900"
            >
              {editing
                ? "Edit Event"
                : "Create Event"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editing
                ? "Update the event information."
                : "Create a new college event."}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close event form"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={onSubmit}
          className="space-y-5 p-6"
        >

          {/* TITLE / ORGANIZER */}

          <div className="grid gap-5 sm:grid-cols-2">

            <Input
              label="Event Title *"
              value={
                form.title
              }
              onChange={(value) =>
                setForm(
                  (current) => ({
                    ...current,
                    title:
                      value,
                  })
                )
              }
              placeholder="Annual College Cultural Fest"
              required
            />

            <Input
              label="Organizer"
              value={
                form.organizer
              }
              onChange={(value) =>
                setForm(
                  (current) => ({
                    ...current,
                    organizer:
                      value,
                  })
                )
              }
              placeholder="Student Activities Committee"
            />

          </div>

          {/* DESCRIPTION */}

          <div>

            <label className="mb-2 block text-sm font-bold text-slate-700">
              Description *
            </label>

            <textarea
              value={
                form.description
              }
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    description:
                      event.target
                        .value,
                  })
                )
              }
              rows={5}
              required
              placeholder="Describe the event..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />

          </div>

          {/* DATE / TIME / VENUE */}

          <div className="grid gap-5 sm:grid-cols-3">

            <Input
              label="Date *"
              type="date"
              value={
                form.date
              }
              onChange={(value) =>
                setForm(
                  (current) => ({
                    ...current,
                    date:
                      value,
                  })
                )
              }
              required
            />

            <Input
              label="Time *"
              type="time"
              value={
                form.time
              }
              onChange={(value) =>
                setForm(
                  (current) => ({
                    ...current,
                    time:
                      value,
                  })
                )
              }
              required
            />

            <Input
              label="Venue *"
              value={
                form.venue
              }
              onChange={(value) =>
                setForm(
                  (current) => ({
                    ...current,
                    venue:
                      value,
                  })
                )
              }
              placeholder="College Auditorium"
              required
            />

          </div>

          {/* CATEGORY / TAG / STATUS / CAPACITY */}

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
              options={
                categories
              }
            />

            <Input
              label="Tag"
              value={
                form.tag
              }
              onChange={(value) =>
                setForm(
                  (current) => ({
                    ...current,
                    tag:
                      value,
                  })
                )
              }
              placeholder="Campus Life"
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
                "cancelled",
              ]}
            />

            <Input
              label="Capacity"
              type="number"
              min="0"
              value={
                form.capacity
              }
              onChange={(value) =>
                setForm(
                  (current) => ({
                    ...current,
                    capacity:
                      value,
                  })
                )
              }
              placeholder="500"
            />

          </div>

          {/* IMAGE URL */}

          <Input
            label="Image URL"
            value={
              form.imageUrl
            }
            onChange={(value) =>
              setForm(
                (current) => ({
                  ...current,
                  imageUrl:
                    value,
                })
              )
            }
            placeholder="https://example.com/event-image.jpg"
          />

          {/* REAL-TIME INFO */}

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">

            <div className="flex gap-3">

              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

              <div>

                <p className="font-bold text-blue-900">
                  Real-time event publishing
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  Published events use the same
                  <strong> events </strong>
                  Firestore collection that your public Events page reads. Changes appear automatically through the real-time listener.
                </p>

              </div>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}

              {editing
                ? "Update Event"
                : "Save Event"}

            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

/*
============================================================
INPUT
============================================================
*/

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  min,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: string;
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
        required={required}
        min={min}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
      />

    </div>
  );
}

/*
============================================================
SELECT
============================================================
*/

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
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
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

/*
============================================================
STAT CARD
============================================================
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black text-[var(--navy)]">
        {value.toLocaleString()}
      </p>

    </div>
  );
}

/*
============================================================
TIMESTAMP HELPER
============================================================
*/

function getTimestamp(
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
    value instanceof Date
  ) {
    return value.getTime();
  }

  if (
    typeof value ===
    "string"
  ) {
    const parsed =
      new Date(
        value
      ).getTime();

    return Number.isNaN(parsed)
      ? 0
      : parsed;
  }

  return 0;
}