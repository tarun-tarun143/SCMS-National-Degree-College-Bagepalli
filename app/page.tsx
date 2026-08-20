
"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Laptop,
  LibraryBig,
  MapPin,
  ShieldCheck,
  Sparkles,
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

const colorfulFeatures = [
  {
    icon: GraduationCap,
    title: "Student Services",
    text: "Academic information and essential college services in one connected place.",
    className: "feature-blue",
  },
  {
    icon: Laptop,
    title: "Digital Learning",
    text: "A modern digital experience for everyday academic engagement.",
    className: "feature-purple",
  },
  {
    icon: LibraryBig,
    title: "Academic Resources",
    text: "Course, notice and campus information available online.",
    className: "feature-gold",
  },
];

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
      <main className="home-page">

        {/* ==================================================
            HERO
        ================================================== */}
        <section className="home-hero">

          <div className="hero-grid" />
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />
          <div className="hero-glow hero-glow-three" />

          <div className="hero-floating floating-one" />
          <div className="hero-floating floating-two" />
          <div className="hero-floating floating-three" />

          <div className="container-page relative z-10 grid min-h-[680px] items-center gap-14 py-20 lg:grid-cols-[1.08fr_.92fr] lg:py-24">

            {/* HERO CONTENT */}
            <div className="hero-copy text-white">

              <div className="hero-pill">
                <span className="hero-live-dot" />
                <Sparkles className="h-3.5 w-3.5 text-[var(--gold)]" />
                Smart College Management System
              </div>

              <div className="hero-location">
                THE NATIONAL DEGREE COLLEGE • BAGEPALLI
              </div>

              <h1 className="hero-title">
                Learn.
                <span> Grow.</span>
                <br />
                <span className="hero-accent">
                  Lead the future.
                </span>
              </h1>

              <p className="hero-description">
                A modern digital campus connecting students,
                academics, college information and essential
                services in one secure and beautiful experience.
              </p>

              <div className="hero-actions">

                <Link
                  href="/courses/bca"
                  className="hero-primary"
                >
                  Explore BCA
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/login"
                  className="hero-secondary"
                >
                  Open Secure Portal
                </Link>

              </div>

              <div className="hero-trust-row">

                <TrustItem
                  icon={ShieldCheck}
                  text="Secure"
                />

                <TrustItem
                  icon={CheckCircle2}
                  text="Real-time"
                />

                <TrustItem
                  icon={GraduationCap}
                  text="Student focused"
                />

              </div>

            </div>

            {/* HERO VISUAL */}
            <div className="hero-visual-wrap">

              <div className="hero-orbit orbit-one" />
              <div className="hero-orbit orbit-two" />

              <div className="hero-main-card">

                <div className="hero-card-top">

                  <div>
                    <div className="hero-card-eyebrow">
                      DIGITAL CAMPUS
                    </div>

                    <h2>
                      Everything connected.
                    </h2>

                    <p>
                      A smarter way to experience college.
                    </p>
                  </div>

                  <div className="hero-card-icon">
                    <GraduationCap className="h-6 w-6" />
                  </div>

                </div>

                <div className="hero-stat-strip">

                  <MiniStat
                    number="BCA"
                    label="Programme"
                  />

                  <MiniStat
                    number="24/7"
                    label="Access"
                  />

                  <MiniStat
                    number="LIVE"
                    label="Updates"
                  />

                </div>

                <div className="hero-campus-list">

                  <CampusCard
                    icon={GraduationCap}
                    title="Students"
                    text="Academic portal"
                    tone="blue"
                  />

                  <CampusCard
                    icon={ShieldCheck}
                    title="Administration"
                    text="Central management"
                    tone="purple"
                  />

                  <CampusCard
                    icon={CalendarDays}
                    title="College"
                    text="Events & notices"
                    tone="gold"
                  />

                </div>

                <div className="hero-card-footer">

                  <span className="online-status">
                    <span />
                    Platform online
                  </span>

                  <Link
                    href="/login"
                    className="hero-enter-link"
                  >
                    Enter portal
                    <ChevronRight className="h-4 w-4" />
                  </Link>

                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            COLORFUL FEATURES
        ================================================== */}
        <section className="colorful-feature-section">
          <div className="container-page">

            <div className="feature-grid">
              {colorfulFeatures.map(
                ({
                  icon: Icon,
                  title,
                  text,
                  className,
                }) => (
                  <div
                    key={title}
                    className={`feature-card ${className}`}
                  >
                    <div className="feature-icon">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3>{title}</h3>

                    <p>{text}</p>

                    <div className="feature-shine" />
                  </div>
                )
              )}
            </div>

          </div>
        </section>

        {/* ==================================================
            WELCOME
        ================================================== */}
        <section className="section-space bg-white">
          <div className="container-page">

            <div className="welcome-grid">

              <div>
                <div className="section-eyebrow">
                  Welcome to the Digital Campus
                </div>

                <h2 className="home-section-title">
                  A college experience designed for
                  <span> today’s students.</span>
                </h2>

                <p className="home-section-text">
                  The National Degree College, Bagepalli's
                  digital campus brings important academic
                  information and college services together
                  in a clear, accessible and connected platform.
                </p>

                <div className="welcome-points">

                  <WelcomePoint
                    number="01"
                    title="Simple"
                    text="Clear information and easy navigation."
                  />

                  <WelcomePoint
                    number="02"
                    title="Connected"
                    text="Academic and campus information in one place."
                  />

                  <WelcomePoint
                    number="03"
                    title="Secure"
                    text="Role-based access for college users."
                  />

                </div>

                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--blue)]"
                >
                  Discover the college
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="welcome-visual">

                <div className="welcome-circle welcome-circle-one" />
                <div className="welcome-circle welcome-circle-two" />

                <div className="welcome-center">
                  <Award className="h-8 w-8 text-[var(--gold)]" />

                  <div className="mt-4 text-3xl font-black text-white">
                    NDC
                  </div>

                  <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                    Bagepalli
                  </div>

                  <div className="welcome-location">
                    <MapPin className="h-3.5 w-3.5" />
                    Karnataka
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ==================================================
            ACADEMICS
        ================================================== */}
        <section className="home-academics-section">
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
                .map((course, index) => (
                  <article
                    key={course.id}
                    className={`course-card course-card-${index % 3}`}
                  >
                    <div className="course-card-top">

                      <span className="course-code">
                        {course.code || "NDC"}
                      </span>

                      <span className="course-duration">
                        {course.duration || "Course"}
                      </span>

                    </div>

                    <div className="course-card-icon">
                      <GraduationCap className="h-5 w-5" />
                    </div>

                    <h3>
                      {course.name || "Course"}
                    </h3>

                    <p>
                      {course.description ||
                        "Course details will be published by the college."}
                    </p>

                    <Link
                      href="/courses/bca"
                      className="course-link"
                    >
                      Explore course
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </article>
                ))}

            </div>
          </div>
        </section>

        {/* ==================================================
            NOTICES
        ================================================== */}
        <section className="section-space bg-white">
          <div className="container-page">

            <div className="notice-layout">

              <div>
                <SectionTitle
                  eyebrow="Campus Updates"
                  title="Latest notices"
                  description="Official announcements published by the college."
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

                {notices.data.map((notice, index) => (
                  <article
                    key={notice.id}
                    className={`notice-card notice-${index % 3}`}
                  >
                    <div className="notice-marker">
                      <span />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--blue)]">
                        {notice.category || "General"}
                      </div>

                      <h3>
                        {notice.title || "Notice"}
                      </h3>

                      <p>
                        {notice.publishedAt ||
                          "Recently published"}
                      </p>

                    </div>

                    <span className="notice-priority">
                      {notice.priority || "Normal"}
                    </span>
                  </article>
                ))}

              </div>
            </div>

          </div>
        </section>

        {/* ==================================================
            EVENTS
        ================================================== */}
        <section className="home-events-section">
          <div className="container-page">

            <SectionTitle
              eyebrow="Campus Life"
              title="What's happening at college"
              description="Discover activities, events and experiences happening across campus."
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
                .map((event, index) => (
                  <article
                    key={event.id}
                    className={`event-card event-card-${index % 3}`}
                  >
                    <div className="event-icon">
                      <CalendarDays className="h-5 w-5" />
                    </div>

                    <div className="mt-6 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      {event.category ||
                        event.tag ||
                        "College Event"}
                    </div>

                    <h3>
                      {event.title || "Event"}
                    </h3>

                    <div className="mt-4 grid gap-2 text-sm">

                      <div className="flex items-center gap-2 text-slate-600">
                        <CalendarDays className="h-4 w-4 text-[var(--blue)]" />
                        {event.date ||
                          "Date to be announced"}
                      </div>

                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="h-4 w-4 text-[var(--purple)]" />
                        {event.venue ||
                          "Venue to be announced"}
                      </div>

                    </div>
                  </article>
                ))}

            </div>
          </div>
        </section>

        {/* ==================================================
            FINAL CTA
        ================================================== */}
        <section className="final-cta">

          <div className="final-cta-glow" />

          <div className="container-page relative z-10">

            <div className="final-cta-inner">

              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                  SCMS DIGITAL CAMPUS
                </div>

                <h2>
                  Your college.
                  <span> Your future.</span>
                </h2>

                <p>
                  Explore programmes, discover campus information
                  and access the secure college portal.
                </p>
              </div>

              <div className="final-actions">

                <Link
                  href="/courses/bca"
                  className="hero-primary"
                >
                  Explore BCA
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/login"
                  className="final-outline-button"
                >
                  Open Portal
                </Link>

              </div>

            </div>
          </div>
        </section>

      </main>

      <style jsx global>{`
        .home-page {
          overflow: hidden;
          background: #f8fafc;
        }

        /* ==================================================
           HERO
        ================================================== */

        .home-hero {
          position: relative;
          overflow: hidden;
          color: white;
          background:
            radial-gradient(
              circle at 18% 20%,
              rgba(59, 130, 246, 0.18),
              transparent 24%
            ),
            radial-gradient(
              circle at 82% 8%,
              rgba(168, 85, 247, 0.20),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #071636 0%,
              #0b2861 45%,
              #174fa5 100%
            );
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          opacity: 0.14;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.12) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.12) 1px,
              transparent 1px
            );
          background-size: 44px 44px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 90%
          );
        }

        .hero-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(70px);
          pointer-events: none;
        }

        .hero-glow-one {
          width: 420px;
          height: 420px;
          right: -140px;
          top: -150px;
          background: rgba(59, 130, 246, 0.22);
          animation: floatBlue 9s ease-in-out infinite;
        }

        .hero-glow-two {
          width: 340px;
          height: 340px;
          left: -130px;
          bottom: -160px;
          background: rgba(168, 85, 247, 0.15);
          animation: floatPurple 11s ease-in-out infinite;
        }

        .hero-glow-three {
          width: 210px;
          height: 210px;
          right: 35%;
          bottom: 7%;
          background: rgba(212, 175, 55, 0.09);
          animation: floatGold 8s ease-in-out infinite;
        }

        .hero-floating {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.10);
          pointer-events: none;
        }

        .floating-one {
          width: 180px;
          height: 180px;
          right: 6%;
          top: 22%;
          animation: spinSlow 20s linear infinite;
        }

        .floating-two {
          width: 100px;
          height: 100px;
          left: 5%;
          bottom: 25%;
          animation: spinSlowReverse 15s linear infinite;
        }

        .floating-three {
          width: 7px;
          height: 7px;
          right: 21%;
          top: 27%;
          background: #34d399;
          border: 0;
          box-shadow: 0 0 18px rgba(52, 211, 153, 0.8);
          animation: pulseDot 2s ease-in-out infinite;
        }

        .hero-pill {
          width: max-content;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          color: #dbeafe;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          animation: revealUp 0.7s ease both;
        }

        .hero-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 14px rgba(52, 211, 153, 0.8);
          animation: pulseDot 2s ease-in-out infinite;
        }

        .hero-location {
          margin-top: 24px;
          color: #93c5fd;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.17em;
          animation: revealUp 0.7s ease 0.08s both;
        }

        .hero-title {
          max-width: 760px;
          margin-top: 16px;
          font-size: clamp(48px, 6vw, 79px);
          line-height: 0.97;
          letter-spacing: -0.055em;
          font-weight: 950;
          animation: revealUp 0.8s ease 0.16s both;
        }

        .hero-title span {
          color: #f6d66f;
        }

        .hero-title .hero-accent {
          color: #c4b5fd;
        }

        .hero-description {
          max-width: 720px;
          margin-top: 24px;
          color: rgba(219, 234, 254, 0.84);
          font-size: 17px;
          line-height: 1.85;
          animation: revealUp 0.8s ease 0.26s both;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 31px;
          animation: revealUp 0.8s ease 0.36s both;
        }

        .hero-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 13px;
          padding: 13px 18px;
          background: #f6d66f;
          color: #071b40;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .hero-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 35px rgba(0, 0, 0, 0.16);
        }

        .hero-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 18px;
          border: 1px solid rgba(255, 255, 255, 0.17);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.06);
          color: white;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          backdrop-filter: blur(8px);
          transition: background 0.2s ease;
        }

        .hero-secondary:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .hero-trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 22px;
          color: #bfdbfe;
          font-size: 11px;
          font-weight: 700;
          animation: revealUp 0.8s ease 0.46s both;
        }

        .trust-item {
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .trust-item svg {
          color: #f6d66f;
        }

        .hero-visual-wrap {
          position: relative;
          min-height: 510px;
          display: grid;
          place-items: center;
          animation: revealRight 0.9s cubic-bezier(.16,1,.3,1) 0.16s both;
        }

        .hero-orbit {
          position: absolute;
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 50%;
          animation: spinSlow 18s linear infinite;
        }

        .orbit-one {
          width: 380px;
          height: 380px;
        }

        .orbit-two {
          width: 280px;
          height: 280px;
          animation-direction: reverse;
          animation-duration: 14s;
        }

        .hero-main-card {
          position: relative;
          z-index: 2;
          width: min(100%, 450px);
          padding: 25px;
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.09);
          box-shadow:
            0 35px 90px rgba(0, 0, 0, 0.20),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(18px);
          transform: rotate(1.2deg);
          transition: transform 0.3s ease;
        }

        .hero-main-card:hover {
          transform: rotate(0deg) translateY(-5px);
        }

        .hero-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .hero-card-eyebrow {
          color: #93c5fd;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .hero-card-top h2 {
          margin-top: 7px;
          color: white;
          font-size: 27px;
          line-height: 1.05;
          font-weight: 950;
        }

        .hero-card-top p {
          margin-top: 6px;
          color: #bfdbfe;
          font-size: 11px;
        }

        .hero-card-icon {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.09);
          color: #f6d66f;
        }

        .hero-stat-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 22px;
        }

        .mini-stat {
          padding: 12px 8px;
          border-radius: 13px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.05);
          text-align: center;
        }

        .mini-stat-number {
          color: white;
          font-size: 16px;
          font-weight: 950;
        }

        .mini-stat-label {
          margin-top: 3px;
          color: #93c5fd;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .hero-campus-list {
          display: grid;
          gap: 9px;
          margin-top: 20px;
        }

        .campus-card {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 12px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.045);
          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .campus-card:hover {
          transform: translateX(4px);
          background: rgba(255, 255, 255, 0.08);
        }

        .campus-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 11px;
        }

        .tone-blue .campus-icon {
          color: #60a5fa;
          background: rgba(59, 130, 246, 0.15);
        }

        .tone-purple .campus-icon {
          color: #c4b5fd;
          background: rgba(139, 92, 246, 0.15);
        }

        .tone-gold .campus-icon {
          color: #f6d66f;
          background: rgba(234, 179, 8, 0.13);
        }

        .campus-title {
          color: white;
          font-size: 12px;
          font-weight: 900;
        }

        .campus-text {
          margin-top: 2px;
          color: #94a3b8;
          font-size: 10px;
        }

        .hero-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 19px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.09);
        }

        .online-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #86efac;
          font-size: 10px;
          font-weight: 800;
        }

        .online-status span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 12px rgba(34, 197, 94, 0.7);
        }

        .hero-enter-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #dbeafe;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
          transition: gap 0.2s ease;
        }

        .hero-enter-link:hover {
          gap: 8px;
        }

        /* ==================================================
           FEATURE CARDS
        ================================================== */

        .colorful-feature-section {
          position: relative;
          z-index: 3;
          margin-top: -35px;
          padding-bottom: 20px;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .feature-card {
          position: relative;
          overflow: hidden;
          padding: 21px;
          border-radius: 21px;
          border: 1px solid transparent;
          box-shadow: 0 15px 35px rgba(15, 23, 42, 0.07);
          transition:
            transform 0.24s ease,
            box-shadow 0.24s ease;
        }

        .feature-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 25px 45px rgba(15, 23, 42, 0.10);
        }

        .feature-blue {
          background: linear-gradient(
            135deg,
            #eff6ff,
            #dbeafe
          );
          border-color: #bfdbfe;
        }

        .feature-purple {
          background: linear-gradient(
            135deg,
            #f5f3ff,
            #ede9fe
          );
          border-color: #ddd6fe;
        }

        .feature-gold {
          background: linear-gradient(
            135deg,
            #fffbeb,
            #fef3c7
          );
          border-color: #fde68a;
        }

        .feature-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: white;
          color: var(--blue);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
        }

        .feature-purple .feature-icon {
          color: #7c3aed;
        }

        .feature-gold .feature-icon {
          color: #b45309;
        }

        .feature-card h3 {
          margin-top: 15px;
          color: var(--navy);
          font-size: 16px;
          font-weight: 900;
        }

        .feature-card p {
          max-width: 320px;
          margin-top: 7px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.7;
        }

        .feature-shine {
          position: absolute;
          width: 120px;
          height: 120px;
          right: -45px;
          top: -45px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.28);
        }

        /* ==================================================
           WELCOME
        ================================================== */

        .welcome-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(340px, 0.9fr);
          gap: 60px;
          align-items: center;
        }

        .section-eyebrow {
          color: var(--blue);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .home-section-title {
          max-width: 720px;
          margin-top: 10px;
          color: var(--navy);
          font-size: clamp(32px, 4vw, 50px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .home-section-title span {
          color: var(--blue);
        }

        .home-section-text {
          max-width: 680px;
          margin-top: 17px;
          color: #64748b;
          font-size: 15px;
          line-height: 1.85;
        }

        .welcome-points {
          display: grid;
          gap: 12px;
          margin: 27px 0;
        }

        .welcome-point {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .welcome-point-number {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 10px;
          background: #eff6ff;
          color: var(--blue);
          font-size: 10px;
          font-weight: 950;
        }

        .welcome-point-title {
          color: var(--navy);
          font-size: 13px;
          font-weight: 900;
        }

        .welcome-point-text {
          margin-top: 2px;
          color: #64748b;
          font-size: 11px;
          line-height: 1.6;
        }

        .welcome-visual {
          position: relative;
          min-height: 390px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 30px;
          background:
            radial-gradient(
              circle at center,
              rgba(59, 130, 246, 0.28),
              transparent 45%
            ),
            linear-gradient(
              145deg,
              #0a2b63,
              #174fa5
            );
          box-shadow: 0 25px 55px rgba(15, 61, 145, 0.14);
        }

        .welcome-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.12);
          animation: spinSlow 20s linear infinite;
        }

        .welcome-circle-one {
          width: 240px;
          height: 240px;
        }

        .welcome-circle-two {
          width: 320px;
          height: 320px;
          animation-direction: reverse;
          animation-duration: 28s;
        }

        .welcome-center {
          position: relative;
          z-index: 2;
          width: 170px;
          height: 170px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(13px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
        }

        .welcome-location {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 11px;
          color: #bfdbfe;
          font-size: 10px;
          font-weight: 700;
        }

        /* ==================================================
           ACADEMICS
        ================================================== */

        .home-academics-section {
          padding: 95px 0;
          background:
            linear-gradient(
              180deg,
              #f8fafc 0%,
              #eef4ff 100%
            );
        }

        .course-card {
          position: relative;
          overflow: hidden;
          padding: 25px;
          border: 1px solid #e2e8f0;
          border-radius: 23px;
          background: white;
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.04);
          transition:
            transform 0.24s ease,
            box-shadow 0.24s ease;
        }

        .course-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 22px 42px rgba(15, 61, 145, 0.10);
        }

        .course-card-0 {
          border-top: 4px solid #3b82f6;
        }

        .course-card-1 {
          border-top: 4px solid #8b5cf6;
        }

        .course-card-2 {
          border-top: 4px solid #eab308;
        }

        .course-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .course-code {
          display: grid;
          height: 38px;
          min-width: 38px;
          place-items: center;
          border-radius: 11px;
          background: #eff6ff;
          color: var(--blue);
          font-size: 10px;
          font-weight: 950;
        }

        .course-duration {
          border-radius: 999px;
          background: #f1f5f9;
          padding: 6px 9px;
          color: #64748b;
          font-size: 9px;
          font-weight: 800;
        }

        .course-card-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          margin-top: 18px;
          border-radius: 13px;
          background: #f8fafc;
          color: var(--blue);
        }

        .course-card h3 {
          margin-top: 15px;
          color: var(--navy);
          font-size: 19px;
          font-weight: 900;
        }

        .course-card p {
          margin-top: 8px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.75;
        }

        .course-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 18px;
          color: var(--blue);
          font-size: 11px;
          font-weight: 900;
          text-decoration: none;
        }

        /* ==================================================
           NOTICES
        ================================================== */

        .notice-layout {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 55px;
        }

        .notice-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 17px;
          border-radius: 18px;
          border: 1px solid #e2e8f0;
          background: white;
          box-shadow: 0 7px 20px rgba(15, 23, 42, 0.04);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .notice-card:hover {
          transform: translateX(4px);
          box-shadow: 0 15px 30px rgba(15, 23, 42, 0.07);
        }

        .notice-marker {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 11px;
          background: #eff6ff;
        }

        .notice-marker span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--blue);
        }

        .notice-1 .notice-marker {
          background: #f5f3ff;
        }

        .notice-1 .notice-marker span {
          background: #8b5cf6;
        }

        .notice-2 .notice-marker {
          background: #fffbeb;
        }

        .notice-2 .notice-marker span {
          background: #eab308;
        }

        .notice-card h3 {
          margin-top: 4px;
          color: var(--navy);
          font-size: 13px;
          font-weight: 900;
        }

        .notice-card p {
          margin-top: 4px;
          color: #94a3b8;
          font-size: 10px;
        }

        .notice-priority {
          flex-shrink: 0;
          border-radius: 999px;
          background: #eff6ff;
          padding: 6px 9px;
          color: #1d4ed8;
          font-size: 9px;
          font-weight: 900;
        }

        /* ==================================================
           EVENTS
        ================================================== */

        .home-events-section {
          padding: 95px 0;
          background: #f8fafc;
        }

        .event-card {
          padding: 25px;
          border: 1px solid #e2e8f0;
          border-radius: 23px;
          background: white;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
          transition:
            transform 0.24s ease,
            box-shadow 0.24s ease;
        }

        .event-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 22px 42px rgba(15, 61, 145, 0.09);
        }

        .event-card-0 {
          border-top: 4px solid #3b82f6;
        }

        .event-card-1 {
          border-top: 4px solid #8b5cf6;
        }

        .event-card-2 {
          border-top: 4px solid #eab308;
        }

        .event-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #eff6ff;
          color: var(--blue);
        }

        .event-card h3 {
          margin-top: 8px;
          color: var(--navy);
          font-size: 20px;
          font-weight: 900;
        }

        /* ==================================================
           FINAL CTA
        ================================================== */

        .final-cta {
          position: relative;
          overflow: hidden;
          padding: 80px 0;
          color: white;
          background:
            radial-gradient(
              circle at 90% 15%,
              rgba(59, 130, 246, 0.20),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #071b40,
              #0e3d86
            );
        }

        .final-cta-glow {
          position: absolute;
          width: 260px;
          height: 260px;
          right: -90px;
          bottom: -120px;
          border-radius: 50%;
          background: rgba(168, 85, 247, 0.12);
          filter: blur(50px);
        }

        .final-cta-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 35px;
        }

        .final-cta h2 {
          max-width: 700px;
          margin-top: 10px;
          font-size: clamp(32px, 4vw, 52px);
          line-height: 1.04;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .final-cta h2 span {
          color: var(--gold);
        }

        .final-cta p {
          max-width: 650px;
          margin-top: 13px;
          color: #bfdbfe;
          font-size: 14px;
          line-height: 1.8;
        }

        .final-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          flex-shrink: 0;
        }

        .final-outline-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 18px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.06);
          color: white;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        /* ==================================================
           HELPERS
        ================================================== */

        .live-card {
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          background: white;
          padding: 24px;
          color: #64748b;
          font-size: 13px;
        }

        @keyframes revealUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes revealRight {
          from {
            opacity: 0;
            transform: translateX(30px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes floatBlue {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(-30px, 25px) scale(1.08);
          }
        }

        @keyframes floatPurple {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(25px, -22px) scale(1.08);
          }
        }

        @keyframes floatGold {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(-18px, -18px) scale(1.10);
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spinSlowReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        @keyframes pulseDot {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.35);
            opacity: 0.65;
          }
        }

        @media (max-width: 1024px) {
          .welcome-grid,
          .notice-layout,
          .final-cta-inner {
            grid-template-columns: 1fr;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }

          .hero-visual-wrap {
            min-height: 430px;
          }

          .welcome-grid {
            display: grid;
          }

          .notice-layout {
            display: grid;
          }

          .final-cta-inner {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .hero-title {
            font-size: 42px;
          }

          .hero-description {
            font-size: 15px;
          }

          .hero-visual-wrap {
            min-height: 390px;
          }

          .hero-main-card {
            padding: 20px;
          }

          .orbit-one {
            width: 300px;
            height: 300px;
          }

          .orbit-two {
            width: 220px;
            height: 220px;
          }

          .welcome-visual {
            min-height: 300px;
          }

          .home-section-title {
            font-size: 33px;
          }

          .notice-layout {
            gap: 35px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </PublicShell>
  );
}

function TrustItem({
  icon: Icon,
  text,
}: {
  icon: typeof ShieldCheck;
  text: string;
}) {
  return (
    <span className="trust-item">
      <Icon className="h-4 w-4" />
      {text}
    </span>
  );
}

function MiniStat({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="mini-stat">
      <div className="mini-stat-number">
        {number}
      </div>

      <div className="mini-stat-label">
        {label}
      </div>
    </div>
  );
}

function CampusCard({
  icon: Icon,
  title,
  text,
  tone,
}: {
  icon: typeof GraduationCap;
  title: string;
  text: string;
  tone: "blue" | "purple" | "gold";
}) {
  return (
    <div className={`campus-card tone-${tone}`}>
      <div className="campus-icon">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <div className="campus-title">
          {title}
        </div>

        <div className="campus-text">
          {text}
        </div>
      </div>
    </div>
  );
}

function WelcomePoint({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="welcome-point">
      <div className="welcome-point-number">
        {number}
      </div>

      <div>
        <div className="welcome-point-title">
          {title}
        </div>

        <div className="welcome-point-text">
          {text}
        </div>
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
    <div className="live-card">
      {text}
    </div>
  );
}

