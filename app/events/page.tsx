"use client";

import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import PublicShell from "@/components/public/PublicShell";
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

function formatDate(date?: string) {
  if (!date) {
    return {
      day: "--",
      month: "DATE",
      year: "",
    };
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return {
      day: date.slice(0, 2),
      month: "",
      year: "",
    };
  }

  return {
    day: parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
    }),
    month: parsed.toLocaleDateString("en-IN", {
      month: "short",
    }),
    year: parsed.toLocaleDateString("en-IN", {
      year: "numeric",
    }),
  };
}

function getCategoryClass(category?: string) {
  const value = category?.toLowerCase();

  if (value?.includes("academic")) {
    return "bg-blue-100 text-blue-700 border-blue-200";
  }

  if (value?.includes("cultural")) {
    return "bg-purple-100 text-purple-700 border-purple-200";
  }

  if (value?.includes("sports")) {
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }

  if (value?.includes("workshop")) {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

export default function EventsPage() {
  const events = useLiveCollection<EventItem>(
    firestoreDb,
    "events",
    {
      limit: 50,
    }
  );

  const visibleEvents = events.data.filter(
    (event) => event.status?.toLowerCase() !== "cancelled"
  );

  return (
    <PublicShell>
      <main className="min-h-screen overflow-hidden bg-[var(--bg)]">
        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="relative overflow-hidden bg-[var(--navy)]">
          {/* Animated background glow */}
          <motion.div
            className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
            animate={{
              x: [0, 80, 0],
              y: [0, 50, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute right-[-100px] top-20 h-96 w-96 rounded-full bg-[var(--gold)]/15 blur-3xl"
            animate={{
              x: [0, -70, 0],
              y: [0, 60, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating particles */}
          {[...Array(12)].map((_, index) => (
            <motion.span
              key={index}
              className="absolute h-1.5 w-1.5 rounded-full bg-white/30"
              style={{
                left: `${8 + ((index * 17) % 85)}%`,
                top: `${12 + ((index * 23) % 70)}%`,
              }}
              animate={{
                y: [-10, 15, -10],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + (index % 4),
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}

          <div className="container-page relative py-20 sm:py-24 lg:py-28">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur"
              >
                <Sparkles className="h-4 w-4 text-[var(--gold)]" />
                Campus Life
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mt-6 text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
              >
                Events that
                <span className="block bg-gradient-to-r from-[var(--gold)] via-yellow-200 to-white bg-clip-text text-transparent">
                  bring campus alive.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-6 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg"
              >
                Discover academic activities, cultural celebrations,
                workshops, competitions, sports and other memorable events
                happening at The National Degree College, Bagepalli.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur">
                  <CalendarDays className="h-4 w-4 text-[var(--gold)]" />
                  Live Events
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur">
                  <Users className="h-4 w-4 text-[var(--gold)]" />
                  Student Activities
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur">
                  <Sparkles className="h-4 w-4 text-[var(--gold)]" />
                  Campus Experience
                </div>
              </motion.div>
            </div>
          </div>

          {/* Light sweep */}
          <motion.div
            className="pointer-events-none absolute left-[-20%] top-0 h-full w-[25%] bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{
              x: ["0%", "550%"],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut",
            }}
          />
        </section>

        {/* =========================================================
            LIVE STATUS BAR
        ========================================================= */}
        <section className="border-b border-slate-200 bg-white">
          <div className="container-page flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <motion.span
                className="relative flex h-3 w-3"
                animate={{ scale: [1, 1.25, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </motion.span>

              <div>
                <p className="text-sm font-extrabold text-[var(--navy)]">
                  Live campus events
                </p>
                <p className="text-xs text-slate-500">
                  Automatically updated from the college event database.
                </p>
              </div>
            </div>

            <div className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
              {events.loading
                ? "Updating events..."
                : `${visibleEvents.length} event${
                    visibleEvents.length === 1 ? "" : "s"
                  } available`}
            </div>
          </div>
        </section>

        {/* =========================================================
            EVENTS
        ========================================================= */}
        <section className="section-space">
          <div className="container-page">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
                What's happening
              </div>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--navy)] sm:text-4xl">
                Upcoming campus events
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                Stay connected with everything happening around our campus.
                New events published by the administration appear here
                automatically.
              </p>
            </motion.div>

            {/* Loading */}
            {events.loading && (
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
                  >
                    <div className="h-44 animate-pulse bg-slate-200" />
                    <div className="space-y-4 p-6">
                      <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                      <div className="h-7 w-3/4 animate-pulse rounded bg-slate-200" />
                      <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!events.loading && visibleEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"
              >
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-[var(--blue)]">
                  <CalendarDays className="h-8 w-8" />
                </div>

                <h3 className="mt-5 text-xl font-black text-[var(--navy)]">
                  No upcoming events
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  There are currently no public events scheduled. Please
                  check again later for new college activities.
                </p>
              </motion.div>
            )}

            {/* Event cards */}
            {!events.loading && visibleEvents.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.08 }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.12,
                    },
                  },
                }}
                className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {visibleEvents.map((event) => {
                  const date = formatDate(event.date);

                  return (
                    <motion.article
                      key={event.id}
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 35,
                        },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.6,
                            ease: "easeOut",
                          },
                        },
                      }}
                      whileHover={{
                        y: -8,
                        transition: {
                          duration: 0.25,
                        },
                      }}
                      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-2xl"
                    >
                      {/* Animated gradient border */}
                      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-[var(--gold)]/0 opacity-0 transition duration-500 group-hover:opacity-100" />

                      {/* Image / visual */}
                      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[var(--navy)] via-blue-900 to-blue-600">
                        {event.imageUrl ? (
                          <img
                            src={event.imageUrl}
                            alt={event.title || "College event"}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <>
                            <motion.div
                              className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--gold)]/20 blur-2xl"
                              animate={{
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                              }}
                            />

                            <motion.div
                              className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-blue-400/20 blur-3xl"
                              animate={{
                                scale: [1, 1.25, 1],
                              }}
                              transition={{
                                duration: 5,
                                repeat: Infinity,
                              }}
                            />

                            <div className="absolute inset-0 flex items-center justify-center">
                              <CalendarDays className="h-20 w-20 text-white/15" />
                            </div>
                          </>
                        )}

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                        {/* Date */}
                        <div className="absolute left-5 top-5 overflow-hidden rounded-2xl border border-white/30 bg-white/95 text-center shadow-xl backdrop-blur">
                          <div className="px-4 py-2">
                            <div className="text-2xl font-black leading-none text-[var(--navy)]">
                              {date.day}
                            </div>
                            <div className="mt-1 text-[10px] font-black uppercase tracking-wider text-[var(--blue)]">
                              {date.month}
                            </div>
                          </div>
                        </div>

                        {/* Live badge */}
                        <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Live
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative p-6">
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${getCategoryClass(
                              event.category || event.tag
                            )}`}
                          >
                            {event.category ||
                              event.tag ||
                              "College Event"}
                          </span>

                          {event.status === "published" && (
                            <span className="text-[10px] font-bold text-emerald-600">
                              Published
                            </span>
                          )}
                        </div>

                        <h3 className="mt-4 line-clamp-2 text-xl font-black leading-tight text-[var(--navy)] transition-colors group-hover:text-[var(--blue)]">
                          {event.title || "College Event"}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                          {event.description ||
                            "Join the college community for an exciting event, activity or academic programme."}
                        </p>

                        <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-[var(--blue)]">
                              <Clock3 className="h-4 w-4" />
                            </div>
                            <span>
                              {event.time || "Time to be announced"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-600">
                              <MapPin className="h-4 w-4" />
                            </div>
                            <span>
                              {event.venue || "Venue to be announced"}
                            </span>
                          </div>

                          {event.organizer && (
                            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-purple-50 text-purple-600">
                                <Users className="h-4 w-4" />
                              </div>
                              <span>{event.organizer}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <Ticket className="h-4 w-4" />
                            {event.capacity
                              ? `${event.capacity} seats`
                              : "College event"}
                          </div>

                          <motion.div
                            whileHover={{ x: 4 }}
                            className="flex items-center gap-1 text-sm font-black text-[var(--blue)]"
                          >
                            Details
                            <ArrowRight className="h-4 w-4" />
                          </motion.div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>

        {/* =========================================================
            CTA
        ========================================================= */}
        <section className="relative overflow-hidden bg-[var(--navy)] py-20 text-white">
          <motion.div
            className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
          />

          <div className="container-page relative">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur sm:p-10 lg:flex lg:items-center lg:justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--gold)]">
                  <Sparkles className="h-4 w-4" />
                  Stay connected
                </div>

                <h2 className="mt-3 max-w-2xl text-3xl font-black sm:text-4xl">
                  Be part of the next campus experience.
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100">
                  Keep checking this page for new academic programmes,
                  workshops, cultural activities, competitions and college
                  events.
                </p>
              </div>

              <Link
                href="/contact"
                className="mt-7 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-6 py-3 font-black text-[var(--navy)] transition hover:-translate-y-1 hover:shadow-xl lg:mt-0"
              >
                Contact College
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}