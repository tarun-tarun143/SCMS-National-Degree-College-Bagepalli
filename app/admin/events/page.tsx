
"use client";

import { useState } from "react";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { firestoreDb } from "@/lib/firebase/client";
import { useLiveCollection } from "@/hooks/useLiveCollection";

type EventItem = {
  id: string;
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  venue?: string;
  category?: string;
  tag?: string;
  status?: string;
  imageUrl?: string;
  organizer?: string;
  capacity?: number;
};

type EventForm = {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
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
  category: "College Event",
  status: "published",
  imageUrl: "",
  organizer: "",
  capacity: "",
};

export default function EventsAdminPage() {
  const events = useLiveCollection<EventItem>(
    firestoreDb,
    "events",
    {
      limit: 100,
    }
  );

  const [form, setForm] =
    useState<EventForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [saving, setSaving] = useState(false);

  const updateField = (
    field: keyof EventForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (event: EventItem) => {
    setEditingId(event.id);

    setForm({
      title: event.title || "",
      description: event.description || "",
      date: event.date || "",
      time: event.time || "",
      venue: event.venue || "",
      category:
        event.category ||
        event.tag ||
        "College Event",
      status: event.status || "published",
      imageUrl: event.imageUrl || "",
      organizer: event.organizer || "",
      capacity:
        event.capacity != null
          ? String(event.capacity)
          : "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const saveEvent = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter an event title.");
      return;
    }

    if (!form.date) {
      alert("Please select an event date.");
      return;
    }

    try {
      setSaving(true);

      /*
       * firestoreDb is nullable in the Firebase client.
       * Narrow it once, then use the local db variable.
       */
      const db = firestoreDb;

      if (db === null) {
        throw new Error(
          "Firestore is not initialized. Check your Firebase configuration."
        );
      }

      const eventData = {
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date,
        time: form.time.trim(),
        venue: form.venue.trim(),
        category: form.category,
        status: form.status,
        imageUrl: form.imageUrl.trim(),
        organizer: form.organizer.trim(),
        capacity: form.capacity
          ? Number(form.capacity)
          : 0,
        updatedAt: new Date().toISOString(),
      };

      if (editingId) {
        await updateDoc(
          doc(db, "events", editingId),
          eventData
        );
      } else {
        await addDoc(
          collection(db, "events"),
          {
            ...eventData,
            createdAt: new Date().toISOString(),
          }
        );
      }

      closeForm();
    } catch (error) {
      console.error(
        "Failed to save event:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to save event. Check your Firebase permissions."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const db = firestoreDb;

      if (db === null) {
        throw new Error(
          "Firestore is not initialized. Check your Firebase configuration."
        );
      }

      await deleteDoc(
        doc(db, "events", id)
      );
    } catch (error) {
      console.error(
        "Failed to delete event:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete event. Check your Firebase permissions."
      );
    }
  };

  return (
    <main className="space-y-6">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
            Administration
          </div>

          <h1 className="mt-1 text-3xl font-black text-[var(--navy)]">
            Events
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage campus events and publish updates
            to the public website in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </button>
      </div>

      {/* =====================================================
          LIVE STATUS
      ====================================================== */}

      <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
        </span>

        <div>
          <p className="text-sm font-bold text-emerald-800">
            Real-time event management
          </p>

          <p className="text-xs text-emerald-700">
            Changes are automatically reflected on
            the public Events page.
          </p>
        </div>
      </div>

      {/* =====================================================
          FORM
      ====================================================== */}

      {showForm && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[var(--navy)]">
                {editingId
                  ? "Edit Event"
                  : "Create Event"}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Publish an event to the college website.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={saveEvent}
            className="grid gap-5 md:grid-cols-2"
          >
            {/* Title */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Event Title *
              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  updateField(
                    "title",
                    e.target.value
                  )
                }
                placeholder="Annual College Fest 2026"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Description */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  updateField(
                    "description",
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Describe the event..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Date */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Date *
              </label>

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  updateField(
                    "date",
                    e.target.value
                  )
                }
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Time */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Time
              </label>

              <input
                type="text"
                value={form.time}
                onChange={(e) =>
                  updateField(
                    "time",
                    e.target.value
                  )
                }
                placeholder="10:00 AM - 4:00 PM"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Venue */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Venue
              </label>

              <input
                type="text"
                value={form.venue}
                onChange={(e) =>
                  updateField(
                    "venue",
                    e.target.value
                  )
                }
                placeholder="College Auditorium"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Category */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Category
              </label>

              <select
                value={form.category}
                onChange={(e) =>
                  updateField(
                    "category",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
              >
                <option value="College Event">
                  College Event
                </option>
                <option value="Academic">
                  Academic
                </option>
                <option value="Cultural">
                  Cultural
                </option>
                <option value="Sports">
                  Sports
                </option>
                <option value="Workshop">
                  Workshop
                </option>
                <option value="Seminar">
                  Seminar
                </option>
                <option value="Competition">
                  Competition
                </option>
                <option value="Celebration">
                  Celebration
                </option>
              </select>
            </div>

            {/* Organizer */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Organizer
              </label>

              <input
                type="text"
                value={form.organizer}
                onChange={(e) =>
                  updateField(
                    "organizer",
                    e.target.value
                  )
                }
                placeholder="Department of Computer Applications"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Capacity */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Capacity
              </label>

              <input
                type="number"
                min="0"
                value={form.capacity}
                onChange={(e) =>
                  updateField(
                    "capacity",
                    e.target.value
                  )
                }
                placeholder="200"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Status */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  updateField(
                    "status",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
              >
                <option value="published">
                  Published
                </option>

                <option value="draft">
                  Draft
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            {/* Image */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Event Image URL
              </label>

              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) =>
                  updateField(
                    "imageUrl",
                    e.target.value
                  )
                }
                placeholder="https://example.com/event-image.jpg"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Use an external image URL. Firebase
                Storage is not required.
              </p>
            </div>

            {/* Buttons */}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row md:col-span-2 md:justify-end">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[var(--blue)] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Event"
                  : "Publish Event"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================
          EVENTS LIST
      ====================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-[var(--navy)]">
              All Events
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {events.loading
                ? "Loading..."
                : `${events.data.length} event${
                    events.data.length === 1
                      ? ""
                      : "s"
                  } in Firestore`}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Real-time
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {events.loading && (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading events...
            </div>
          )}

          {events.error && !events.loading && (
            <div className="p-6">
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {events.error}
              </div>
            </div>
          )}

          {!events.loading &&
            !events.error &&
            events.data.length === 0 && (
              <div className="p-12 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-[var(--blue)]">
                  <CalendarDays className="h-8 w-8" />
                </div>

                <h3 className="mt-4 font-black text-[var(--navy)]">
                  No events yet
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Create your first college event.
                </p>
              </div>
            )}

          {!events.loading &&
            events.data.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-5 p-6 transition hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex min-w-0 gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[var(--blue)]">
                    <CalendarDays className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-[var(--navy)]">
                        {event.title ||
                          "Untitled Event"}
                      </h3>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-600">
                        {event.category ||
                          "College Event"}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                          event.status ===
                          "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : event.status ===
                              "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {event.status ||
                          "draft"}
                      </span>
                    </div>

                    {event.description && (
                      <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-slate-500">
                        {event.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {event.date ||
                          "Date not set"}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        {event.time ||
                          "Time not set"}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.venue ||
                          "Venue not set"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openEdit(event)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[var(--blue)]"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteEvent(event.id)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}

