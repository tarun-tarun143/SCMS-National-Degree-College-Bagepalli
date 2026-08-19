"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";

import PublicShell from "@/components/public/PublicShell";
import SectionTitle from "@/components/ui/SectionTitle";
import { firestoreDb } from "@/lib/firebase/client";
import { useLiveCollection } from "@/hooks/useLiveCollection";

type Course = {
  id: string;
  code?: string;
  name?: string;
  duration?: string;
  description?: string;
  status?: string;
};

type Notice = {
  id: string;
  title?: string;
  category?: string;
  priority?: string;
  publishedAt?: string;
};

type EventItem = {
  id: string;
  title?: string;
  date?: string;
  venue?: string;
  category?: string;
  tag?: string;
  status?: string;
};

export default function Home() {
  const courses = useLiveCollection<Course>(
    firestoreDb,
    "courses",
    {
      limit: 6,
    }
  );

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
      limit: 3,
    }
  );

  const events = useLiveCollection<EventItem>(
    firestoreDb,
    "events",
    {
      limit: 3,
    }
  );

  return (
    <PublicShell>
      <main className="bg-[var(--bg)]">

        {/* HERO */}
        <section className="gradient-academic">
          <div className="container-page grid min-h-[560px] items-center gap-12 py-20 lg:grid-cols-[1.15fr_.85fr]">

            <div className="text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
                <CheckCircle2 className="h-4 w-4 text-[var(--gold)]" />
                Smart College Management System
              </div>

              <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl">
                A smarter digital campus for{" "}
                <span className="text-[var(--gold)]">
                  modern education.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
                The National Degree College, Bagepalli
                brings academic information, student
                services, faculty operations and
                administration together in one secure
                digital platform.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
               <Link
  href="/courses/bca"
  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-3 font-bold text-[var(--navy)] transition hover:-translate-y-0.5"
>
  Explore BCA Course
  <ArrowRight className="h-4 w-4" />
</Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/15"
                >
                  Student & Faculty Login
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-blue-100">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[var(--gold)]" />
                  Secure access
                </span>

                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--gold)]" />
                  Real-time information
                </span>

                <span className="inline-flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-[var(--gold)]" />
                  Mobile friendly
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-2 backdrop-blur">
              <div className="rounded-[1.35rem] bg-white p-7 shadow-xl">

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Digital Campus
                    </div>

                    <h2 className="mt-2 text-2xl font-black text-[var(--navy)]">
                      One connected experience
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Everything your college community
                      needs in one place.
                    </p>
                  </div>

                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[var(--blue)]">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <CampusCard
                    icon={GraduationCap}
                    title="Students"
                    text="Academic portal"
                  />

                  <CampusCard
                    icon={Users}
                    title="Faculty"
                    text="Class operations"
                  />

                  <CampusCard
                    icon={ShieldCheck}
                    title="Administration"
                    text="Central management"
                  />

                  <CampusCard
                    icon={CalendarDays}
                    title="College"
                    text="Live information"
                  />
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Platform online
                  </span>

                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[var(--blue)] hover:gap-3"
                  >
                    Enter Portal
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* QUICK BENEFITS */}
        <section className="border-b border-slate-200 bg-white">
          <div className="container-page grid gap-6 py-8 md:grid-cols-3">

            <Benefit
              icon={GraduationCap}
              title="For Students"
              text="Attendance, timetable, assignments, results, fees and notices."
            />

            <Benefit
              icon={Users}
              title="For Faculty"
              text="Manage classes, attendance, assignments, materials and marks."
            />

            <Benefit
              icon={ShieldCheck}
              title="For Administration"
              text="Central control of academic and institutional operations."
            />

          </div>
        </section>

        {/* ACADEMICS */}
        <section className="section-space">
          <div className="container-page">

            <SectionTitle
              eyebrow="Academics"
              title="Explore our academic pathways"
              description="Courses published by the college are updated directly from the live campus database."
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-3">

              {courses.loading && (
                <LiveCard text="Loading courses…" />
              )}

              {!courses.loading &&
                !courses.data.length && (
                  <LiveCard text="No courses published yet." />
                )}

              {courses.data
                .filter(
                  (course) =>
                    course.status !== "inactive"
                )
                .map((course) => (
                  <article
                    key={course.id}
                    className="card p-6 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between gap-4">

                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-xs font-black text-[var(--blue)]">
                        {course.code || "NDC"}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {course.duration || "Course"}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-extrabold text-[var(--navy)]">
                      {course.name || "Course"}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {course.description ||
                        "Course details will be published by the college."}
                    </p>

                    <Link
                      href="/courses"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--blue)]"
                    >
                      View details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </article>
                ))}
            </div>
          </div>
        </section>

        {/* NOTICES */}
        <section className="bg-white py-20">
          <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">

            <div>
              <SectionTitle
                eyebrow="Campus updates"
                title="Latest notices"
                description="Stay updated with official announcements published by the college."
              />

              <Link
                href="/notices"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--blue)]"
              >
                View all notices
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4">

              {notices.loading && (
                <LiveCard text="Loading notices…" />
              )}

              {!notices.loading &&
                !notices.data.length && (
                  <LiveCard text="No published notices yet." />
                )}

              {notices.data.map((notice) => (
                <article
                  key={notice.id}
                  className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                      {notice.category || "General"}
                    </div>

                    <h3 className="mt-1 font-bold text-[var(--navy)]">
                      {notice.title || "Notice"}
                    </h3>

                    <p className="mt-2 text-xs text-slate-500">
                      {notice.publishedAt ||
                        "Recently published"}
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {notice.priority || "Normal"}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section className="section-space">
          <div className="container-page">

            <SectionTitle
              eyebrow="Campus life"
              title="Upcoming events"
              description="Discover activities and events happening across the college."
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-3">

              {events.loading && (
                <LiveCard text="Loading events…" />
              )}

              {!events.loading &&
                !events.data.length && (
                  <LiveCard text="No public events scheduled yet." />
                )}

              {events.data
                .filter(
                  (event) =>
                    event.status !== "cancelled"
                )
                .map((event) => (
                  <article
                    key={event.id}
                    className="card p-6 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <CalendarDays className="h-6 w-6 text-[var(--blue)]" />

                    <div className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                      {event.category ||
                        event.tag ||
                        "College Event"}
                    </div>

                    <h3 className="mt-2 text-xl font-extrabold text-[var(--navy)]">
                      {event.title || "Event"}
                    </h3>

                    <p className="mt-4 text-sm text-slate-600">
                      {event.date ||
                        "Date to be announced"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {event.venue ||
                        "Venue to be announced"}
                    </p>
                  </article>
                ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-[var(--navy)] py-20 text-white">
          <div className="container-page flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                SCMS Portal
              </div>

              <h2 className="mt-2 max-w-2xl text-3xl font-black sm:text-4xl">
                Everything your college community needs, connected in one place.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100">
                Access academic services, college information and secure role-based portals from anywhere.
              </p>
            </div>

            <Link
              href="/login"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-3 font-bold text-[var(--navy)] transition hover:-translate-y-0.5"
            >
              Open Secure Portal
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>
        </section>

      </main>
    </PublicShell>
  );
}

function CampusCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof GraduationCap;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-blue-50">
      <div className="flex items-center gap-3">

        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[var(--blue)] shadow-sm">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-extrabold text-[var(--navy)]">
            {title}
          </h3>

          <p className="mt-0.5 text-xs text-slate-500">
            {text}
          </p>
        </div>

      </div>
    </div>
  );
}

function Benefit({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof GraduationCap;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">

      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[var(--blue)]">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3 className="font-extrabold text-[var(--navy)]">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {text}
        </p>
      </div>

    </div>
  );
}

function LiveCard({
  text,
}: {
  text: string;
}) {
  return (
    <div className="card p-6 text-sm text-slate-500">
      {text}
    </div>
  );
}
