
"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Megaphone,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import PublicShell from "@/components/public/PublicShell";
import SectionTitle from "@/components/ui/SectionTitle";
import { firestoreDb } from "@/lib/firebase/client";
import { useLiveCollection } from "@/hooks/useLiveCollection";

type Notice = {
  id: string;
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  priority?: string;
  status?: string;
  publishedAt?: string;
  expiresAt?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
};

const categories = [
  "All",
  "General",
  "Examination",
  "Academic",
  "Admission",
  "Event",
  "Placement",
  "Scholarship",
  "Holiday",
];

const priorities = ["All", "urgent", "important", "normal"];

export default function NoticesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priority, setPriority] = useState("All");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const notices = useLiveCollection<Notice>(
    firestoreDb,
    "notices",
    {
      filters: [
        {
          field: "status",
          op: "==",
          value: "published",
        },
      ],
      limit: 50,
    }
  );

  const filteredNotices = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return notices.data.filter((notice) => {
      const matchesSearch =
        !searchText ||
        notice.title?.toLowerCase().includes(searchText) ||
        notice.description?.toLowerCase().includes(searchText) ||
        notice.content?.toLowerCase().includes(searchText) ||
        notice.category?.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" ||
        notice.category?.toLowerCase() === category.toLowerCase();

      const noticePriority =
        notice.priority?.toLowerCase() || "normal";

      const matchesPriority =
        priority === "All" || noticePriority === priority;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPriority
      );
    });
  }, [notices.data, search, category, priority]);

  const featuredNotice =
    filteredNotices.find(
      (notice) =>
        notice.priority?.toLowerCase() === "urgent"
    ) ||
    filteredNotices.find(
      (notice) =>
        notice.priority?.toLowerCase() === "important"
    ) ||
    filteredNotices[0];

  const remainingNotices = filteredNotices.filter(
    (notice) => notice.id !== featuredNotice?.id
  );

  return (
    <PublicShell>
      <main className="min-h-screen overflow-hidden bg-[var(--bg)]">

        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="relative overflow-hidden bg-[var(--navy)] py-20 text-white">

          {/* Animated background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-10 h-72 w-72 animate-pulse rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute right-0 top-0 h-96 w-96 animate-pulse rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[var(--gold)]/10 blur-3xl" />
          </div>

          {/* Floating particles */}
          <div className="pointer-events-none absolute left-[8%] top-20 h-2 w-2 animate-bounce rounded-full bg-blue-300/70" />
          <div className="pointer-events-none absolute left-[22%] top-40 h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" />
          <div className="pointer-events-none absolute right-[18%] top-24 h-2 w-2 animate-ping rounded-full bg-[var(--gold)]/70" />
          <div className="pointer-events-none absolute bottom-20 right-[30%] h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300/70" />

          <div className="container-page relative">

            <div className="mx-auto max-w-4xl text-center">

              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-100 shadow-lg backdrop-blur">
                <Bell className="h-4 w-4 text-[var(--gold)]" />
                Official College Notices
              </div>

              <h1 className="mt-7 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Stay informed.
                <span className="block bg-gradient-to-r from-[var(--gold)] via-yellow-200 to-white bg-clip-text text-transparent">
                  Never miss an update.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
                Get the latest academic announcements, examination
                updates, admissions information, scholarships, events,
                holidays and official college communications.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">

                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-200 backdrop-blur">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Live updates enabled
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-blue-100 backdrop-blur">
                  <ShieldCheck className="h-4 w-4" />
                  Official information
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-blue-100 backdrop-blur">
                  <Sparkles className="h-4 w-4 text-[var(--gold)]" />
                  Real-time campus portal
                </div>

              </div>
            </div>
          </div>

          {/* Bottom light sweep */}
          <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--gold)]/70 to-transparent" />
        </section>

        {/* =====================================================
            LIVE STATUS
        ====================================================== */}
        <section className="border-b border-slate-200 bg-white">
          <div className="container-page py-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[var(--blue)]">
                  <Megaphone className="h-5 w-5" />
                </div>

                <div>
                  <div className="text-sm font-extrabold text-[var(--navy)]">
                    Live Notice Board
                  </div>

                  <div className="text-xs text-slate-500">
                    Official announcements from the college
                  </div>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  {notices.data.length} published notices
                </div>

                <div className="hidden text-xs font-semibold text-slate-400 sm:block">
                  Updates automatically
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            CONTENT
        ====================================================== */}
        <section className="section-space">
          <div className="container-page">

            <SectionTitle
              eyebrow="Campus updates"
              title="Latest notices"
              description="Official announcements published by The National Degree College, Bagepalli."
            />

            {/* =================================================
                SEARCH & FILTERS
            ================================================== */}
            <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                {/* Search */}
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search notices..."
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Category */}
                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                {/* Priority */}
                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value)
                  }
                  className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold capitalize text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  {priorities.map((item) => (
                    <option key={item} value={item}>
                      {item === "All"
                        ? "All priorities"
                        : `${item} priority`}
                    </option>
                  ))}
                </select>

              </div>

              {(search || category !== "All" || priority !== "All") && (
                <div className="mt-4 flex flex-wrap items-center gap-2">

                  <span className="text-xs font-bold text-slate-400">
                    Active filters:
                  </span>

                  {search && (
                    <FilterBadge
                      text={`Search: ${search}`}
                      onRemove={() => setSearch("")}
                    />
                  )}

                  {category !== "All" && (
                    <FilterBadge
                      text={`Category: ${category}`}
                      onRemove={() => setCategory("All")}
                    />
                  )}

                  {priority !== "All" && (
                    <FilterBadge
                      text={`Priority: ${priority}`}
                      onRemove={() => setPriority("All")}
                    />
                  )}

                </div>
              )}

            </div>

            {/* =================================================
                ERROR
            ================================================== */}
            {notices.error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <div className="font-extrabold">
                      Unable to load notices
                    </div>
                    <p className="mt-1 text-red-600">
                      {notices.error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                LOADING
            ================================================== */}
            {notices.loading && (
              <div className="mt-10 grid gap-5 lg:grid-cols-2">

                {[1, 2, 3, 4].map((item) => (
                  <NoticeSkeleton key={item} />
                ))}

              </div>
            )}

            {/* =================================================
                EMPTY
            ================================================== */}
            {!notices.loading &&
              !notices.error &&
              !filteredNotices.length && (
                <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-[var(--blue)]">
                    <FileText className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-xl font-black text-[var(--navy)]">
                    No notices found
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    There are currently no published notices matching
                    your search or selected filters.
                  </p>

                  {(search ||
                    category !== "All" ||
                    priority !== "All") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setCategory("All");
                        setPriority("All");
                      }}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--blue)] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      Clear filters
                    </button>
                  )}

                </div>
              )}

            {/* =================================================
                FEATURED NOTICE
            ================================================== */}
            {!notices.loading &&
              featuredNotice && (
                <div className="mt-10">

                  <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    <Sparkles className="h-4 w-4 text-[var(--gold)]" />
                    Featured announcement
                  </div>

                  <FeaturedNotice
                    notice={featuredNotice}
                    onOpen={() =>
                      setSelectedNotice(featuredNotice)
                    }
                  />

                </div>
              )}

            {/* =================================================
                NOTICE GRID
            ================================================== */}
            {!notices.loading &&
              remainingNotices.length > 0 && (
                <div className="mt-10 grid gap-5 md:grid-cols-2">

                  {remainingNotices.map((notice, index) => (
                    <NoticeCard
                      key={notice.id}
                      notice={notice}
                      index={index}
                      onOpen={() =>
                        setSelectedNotice(notice)
                      }
                    />
                  ))}

                </div>
              )}

          </div>
        </section>

        {/* =====================================================
            CTA
        ====================================================== */}
        <section className="relative overflow-hidden bg-[var(--navy)] py-16 text-white">

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="container-page relative">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">
                  Stay connected
                </div>

                <h2 className="mt-2 max-w-2xl text-3xl font-black sm:text-4xl">
                  Keep up with every important college announcement.
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100">
                  Check the official notice board regularly for
                  examinations, admissions, academic updates,
                  scholarships, holidays and campus activities.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-3 font-bold text-[var(--navy)] shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                Contact College
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>
          </div>
        </section>

      </main>

      {/* =======================================================
          NOTICE MODAL
      ======================================================== */}
      {selectedNotice && (
        <NoticeModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}
    </PublicShell>
  );
}

/* ============================================================
   FEATURED NOTICE
============================================================ */

function FeaturedNotice({
  notice,
  onOpen,
}: {
  notice: Notice;
  onOpen: () => void;
}) {
  const priority = getPriority(notice.priority);

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border bg-white shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-2xl ${
        priority === "urgent"
          ? "border-red-200"
          : priority === "important"
            ? "border-amber-200"
            : "border-slate-200"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--blue)] via-[var(--gold)] to-cyan-400" />

      <div className="p-7 sm:p-9">

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

          <div className="flex gap-5">

            <div className="hidden h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[var(--blue)] sm:grid">
              <Megaphone className="h-6 w-6" />
            </div>

            <div>

              <div className="flex flex-wrap items-center gap-2">
                <PriorityBadge priority={notice.priority} />

                <CategoryBadge category={notice.category} />

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Published
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-black leading-tight text-[var(--navy)] sm:text-3xl">
                {notice.title || "College Announcement"}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                {notice.description ||
                  notice.content ||
                  "Official college announcement. Please check the complete notice for more information."}
              </p>

            </div>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--blue)] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Read notice
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
          </div>

        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-100 pt-5 text-xs font-semibold text-slate-500">

          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[var(--blue)]" />
            {formatDate(notice.publishedAt || notice.createdAt)}
          </span>

          {notice.author && (
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[var(--blue)]" />
              {notice.author}
            </span>
          )}

          <span className="inline-flex items-center gap-2 text-emerald-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>

        </div>

      </div>
    </article>
  );
}

/* ============================================================
   NOTICE CARD
============================================================ */

function NoticeCard({
  notice,
  index,
  onOpen,
}: {
  notice: Notice;
  index: number;
  onOpen: () => void;
}) {
  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
      style={{
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Animated top line */}
      <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-[var(--blue)] to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />

      <div className="flex items-start justify-between gap-4">

        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[var(--blue)] transition duration-500 group-hover:scale-110 group-hover:rotate-3">
          <Bell className="h-5 w-5" />
        </div>

        <PriorityBadge priority={notice.priority} />

      </div>

      <div className="mt-5">
        <CategoryBadge category={notice.category} />

        <h3 className="mt-3 line-clamp-2 text-xl font-black leading-tight text-[var(--navy)]">
          {notice.title || "College Notice"}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
          {notice.description ||
            notice.content ||
            "Please open this notice to view the complete announcement."}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Clock3 className="h-4 w-4" />
          {formatDate(notice.publishedAt || notice.createdAt)}
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-1.5 text-xs font-black text-[var(--blue)] transition group-hover:gap-2.5"
        >
          Read more
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

      </div>
    </article>
  );
}

/* ============================================================
   MODAL
============================================================ */

function NoticeModal({
  notice,
  onClose,
}: {
  notice: Notice;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Official Notice
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close notice"
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-7 sm:p-9">

          <div className="flex flex-wrap gap-2">
            <PriorityBadge priority={notice.priority} />
            <CategoryBadge category={notice.category} />
          </div>

          <h2 className="mt-5 text-3xl font-black leading-tight text-[var(--navy)]">
            {notice.title || "College Notice"}
          </h2>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-400">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {formatDate(notice.publishedAt || notice.createdAt)}
            </span>

            {notice.author && (
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                {notice.author}
              </span>
            )}
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm leading-8 text-slate-700">
            {notice.content ||
              notice.description ||
              "No additional information is available for this notice."}
          </div>

          {notice.expiresAt && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs font-bold text-amber-700">
              <Clock3 className="h-4 w-4" />
              Notice validity: {formatDate(notice.expiresAt)}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ============================================================
   BADGES
============================================================ */

function PriorityBadge({
  priority,
}: {
  priority?: string;
}) {
  const value = getPriority(priority);

  const styles = {
    urgent:
      "bg-red-50 text-red-700 border-red-100",
    important:
      "bg-amber-50 text-amber-700 border-amber-100",
    normal:
      "bg-blue-50 text-blue-700 border-blue-100",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${styles[value]}`}
    >
      {value === "urgent" && (
        <AlertCircle className="h-3 w-3" />
      )}

      {value === "important" && (
        <Sparkles className="h-3 w-3" />
      )}

      {value === "normal" && (
        <CheckCircle2 className="h-3 w-3" />
      )}

      {value}
    </span>
  );
}

function CategoryBadge({
  category,
}: {
  category?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600">
      <Tag className="h-3 w-3" />
      {category || "General"}
    </span>
  );
}

function FilterBadge({
  text,
  onRemove,
}: {
  text: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
    >
      {text}
      <X className="h-3 w-3" />
    </button>
  );
}

/* ============================================================
   SKELETON
============================================================ */

function NoticeSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex justify-between">
        <div className="h-11 w-11 rounded-xl bg-slate-200" />
        <div className="h-6 w-20 rounded-full bg-slate-200" />
      </div>

      <div className="mt-5 h-4 w-24 rounded bg-slate-200" />
      <div className="mt-4 h-7 w-4/5 rounded bg-slate-200" />

      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-5/6 rounded bg-slate-100" />
        <div className="h-3 w-2/3 rounded bg-slate-100" />
      </div>

      <div className="mt-6 h-px bg-slate-100" />

      <div className="mt-4 h-4 w-32 rounded bg-slate-100" />
    </div>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function getPriority(
  priority?: string
): "urgent" | "important" | "normal" {
  const value = priority?.toLowerCase();

  if (value === "urgent") return "urgent";
  if (value === "important") return "important";

  return "normal";
}

function formatDate(value?: string) {
  if (!value) return "Recently published";

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

