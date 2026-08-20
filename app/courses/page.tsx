"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  Code2,
  Database,
  GraduationCap,
  Laptop,
  Monitor,
  Sparkles,
  Target,
} from "lucide-react";

import PublicShell from "@/components/public/PublicShell";
import SectionTitle from "@/components/ui/SectionTitle";

const highlights = [
  {
    icon: Code2,
    title: "Programming",
    text: "Build strong foundations in programming and problem solving.",
  },
  {
    icon: Database,
    title: "Databases",
    text: "Understand data management, SQL and database concepts.",
  },
  {
    icon: Laptop,
    title: "Web Technology",
    text: "Learn modern web development and application concepts.",
  },
  {
    icon: Monitor,
    title: "Computer Applications",
    text: "Develop practical skills for software and digital systems.",
  },
];

const semesters = [
  {
    number: "01",
    title: "Foundation",
    text: "Build core knowledge in programming, mathematics and computer fundamentals.",
  },
  {
    number: "02",
    title: "Application",
    text: "Develop practical skills through databases, web technologies and software tools.",
  },
  {
    number: "03",
    title: "Development",
    text: "Strengthen programming, project development and application design skills.",
  },
];

const subjects = [
  "Programming Fundamentals",
  "Data Structures",
  "Database Management",
  "Web Technologies",
  "Computer Networks",
  "Software Engineering",
  "Object-Oriented Programming",
  "Operating Systems",
];

export default function CoursesPage() {
  return (
    <PublicShell>
      <main className="courses-page">

        {/* =========================================
            HERO
        ========================================= */}
        <section className="courses-hero">
          <div className="courses-hero-grid" />
          <div className="courses-glow courses-glow-one" />
          <div className="courses-glow courses-glow-two" />

          <div className="container-page relative z-10 py-20 sm:py-24 lg:py-28">

            <div className="max-w-4xl">

              <div className="courses-eyebrow">
                <span className="courses-live-dot" />
                Undergraduate Programme
              </div>

              <div className="mt-5 flex items-center gap-3 text-sm font-bold text-blue-200">
                <span>BCA</span>
                <span className="h-1 w-1 rounded-full bg-blue-300" />
                <span>Computer Applications</span>
              </div>

              <h1 className="courses-title">
                Build your future with{" "}
                <span>BCA.</span>
              </h1>

              <p className="courses-lead">
                Develop programming knowledge, practical computer
                skills and the confidence to solve real-world
                problems through a focused Bachelor of Computer
                Applications programme.
              </p>

              <div className="courses-actions">

                <Link
                  href="/contact"
                  className="courses-primary-button"
                >
                  Enquire About BCA
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="#programme"
                  className="courses-secondary-button"
                >
                  Explore Programme
                </a>

              </div>

              <div className="courses-meta">

                <Meta
                  icon={GraduationCap}
                  label="Programme"
                  value="BCA"
                />

                <Meta
                  icon={Clock3}
                  label="Mode"
                  value="Regular"
                />

                <Meta
                  icon={Award}
                  label="Focus"
                  value="Computer Applications"
                />

              </div>

            </div>
          </div>
        </section>

        {/* =========================================
            INTRO
        ========================================= */}
        <section
          id="programme"
          className="section-space bg-white"
        >
          <div className="container-page">

            <div className="programme-grid">

              <div>
                <div className="courses-section-eyebrow">
                  About the Programme
                </div>

                <h2 className="courses-section-title">
                  Learn technology.
                  <span> Build capability.</span>
                </h2>

                <p className="courses-paragraph">
                  The Bachelor of Computer Applications programme
                  is designed for students who want to develop a
                  strong understanding of computing and software
                  applications.
                </p>

                <p className="courses-paragraph">
                  Students can progressively build skills across
                  programming, databases, web technologies,
                  software engineering and practical project work.
                </p>

                <div className="mt-7">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--blue)]"
                  >
                    Ask about BCA admissions
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="programme-card">

                <div className="programme-card-top">
                  <div className="programme-symbol">
                    <GraduationCap className="h-6 w-6" />
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
                      Academic Pathway
                    </div>

                    <div className="mt-1 text-2xl font-black text-white">
                      BCA
                    </div>
                  </div>
                </div>

                <div className="programme-lines">
                  <ProgrammeLine text="Programming concepts" />
                  <ProgrammeLine text="Database systems" />
                  <ProgrammeLine text="Web technologies" />
                  <ProgrammeLine text="Software development" />
                  <ProgrammeLine text="Practical project work" />
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* =========================================
            HIGHLIGHTS
        ========================================= */}
        <section className="courses-soft-section">
          <div className="container-page">

            <div className="max-w-3xl">
              <div className="courses-section-eyebrow">
                What You Learn
              </div>

              <h2 className="courses-section-title">
                Core areas of the BCA programme.
              </h2>

              <p className="courses-paragraph">
                Build a balanced foundation of conceptual knowledge
                and practical computer application skills.
              </p>
            </div>

            <div className="courses-highlight-grid">
              {highlights.map(
                ({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="courses-highlight-card"
                  >
                    <div className="courses-highlight-icon">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3>{title}</h3>

                    <p>{text}</p>

                    <div className="courses-card-arrow">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                )
              )}
            </div>

          </div>
        </section>

        {/* =========================================
            LEARNING JOURNEY
        ========================================= */}
        <section className="section-space bg-white">
          <div className="container-page">

            <div className="max-w-3xl">
              <div className="courses-section-eyebrow">
                Learning Journey
              </div>

              <h2 className="courses-section-title">
                Progress from foundations to practical development.
              </h2>
            </div>

            <div className="journey-grid">

              {semesters.map((semester) => (
                <div
                  key={semester.number}
                  className="journey-card"
                >
                  <div className="journey-number">
                    {semester.number}
                  </div>

                  <div className="journey-content">
                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--blue)]">
                      Stage
                    </div>

                    <h3>{semester.title}</h3>

                    <p>{semester.text}</p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* =========================================
            SUBJECTS
        ========================================= */}
        <section className="subjects-section">
          <div className="container-page">

            <div className="subjects-layout">

              <div>
                <div className="courses-section-eyebrow light">
                  Key Subjects
                </div>

                <h2 className="subjects-title">
                  Knowledge that supports real-world computing.
                </h2>

                <p className="subjects-description">
                  The programme can cover a broad range of
                  computing concepts that help students develop
                  logical thinking, technical knowledge and
                  practical application skills.
                </p>

                <div className="subjects-badge">
                  <Sparkles className="h-4 w-4" />
                  Practical learning
                </div>
              </div>

              <div className="subjects-list">
                {subjects.map((subject) => (
                  <div
                    key={subject}
                    className="subject-item"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {subject}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* =========================================
            SKILLS
        ========================================= */}
        <section className="section-space bg-white">
          <div className="container-page">

            <div className="skills-card">

              <div className="skills-main">
                <div className="courses-section-eyebrow">
                  Skills & Outcomes
                </div>

                <h2>
                  Turn learning into practical capability.
                </h2>

                <p>
                  A strong BCA foundation can help students
                  prepare for software, web, database,
                  technology support and further academic
                  opportunities.
                </p>
              </div>

              <div className="skills-points">

                <Skill
                  icon={Code2}
                  text="Programming and problem solving"
                />

                <Skill
                  icon={Database}
                  text="Data and database concepts"
                />

                <Skill
                  icon={Laptop}
                  text="Web and application development"
                />

                <Skill
                  icon={Target}
                  text="Project and practical skills"
                />

              </div>

            </div>

          </div>
        </section>

        {/* =========================================
            CTA
        ========================================= */}
        <section className="courses-cta">

          <div className="container-page">

            <div className="courses-cta-content">

              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                  Interested in BCA?
                </div>

                <h2>
                  Start your journey into computer applications.
                </h2>

                <p>
                  Contact the college for current admission,
                  eligibility and programme information.
                </p>
              </div>

              <div className="courses-cta-actions">

                <Link
                  href="/contact"
                  className="courses-primary-button"
                >
                  Contact College
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/"
                  className="courses-cta-secondary"
                >
                  Back to Home
                </Link>

              </div>

            </div>

          </div>

        </section>

      </main>

      <style jsx global>{`
        .courses-page {
          overflow: hidden;
          background: #f8fafc;
        }

        /* HERO */
        .courses-hero {
          position: relative;
          overflow: hidden;
          color: white;
          background:
            radial-gradient(
              circle at 85% 20%,
              rgba(59, 130, 246, 0.24),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #071b40 0%,
              #0b2f6c 48%,
              #1457af 100%
            );
        }

        .courses-hero-grid {
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

        .courses-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(55px);
          pointer-events: none;
        }

        .courses-glow-one {
          width: 360px;
          height: 360px;
          right: -120px;
          top: -120px;
          background: rgba(59, 130, 246, 0.22);
          animation: coursesGlowOne 9s ease-in-out infinite;
        }

        .courses-glow-two {
          width: 280px;
          height: 280px;
          left: 12%;
          bottom: -170px;
          background: rgba(212, 175, 55, 0.10);
          animation: coursesGlowTwo 11s ease-in-out infinite;
        }

        .courses-eyebrow {
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
          letter-spacing: 0.16em;
          text-transform: uppercase;
          animation: coursesReveal 0.7s ease both;
        }

        .courses-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 14px rgba(52, 211, 153, 0.8);
          animation: coursesPulse 2s ease-in-out infinite;
        }

        .courses-title {
          max-width: 900px;
          margin-top: 18px;
          font-size: clamp(45px, 6vw, 78px);
          line-height: 0.98;
          letter-spacing: -0.05em;
          font-weight: 950;
          animation: coursesReveal 0.8s ease 0.1s both;
        }

        .courses-title span {
          color: var(--gold);
        }

        .courses-lead {
          max-width: 760px;
          margin-top: 24px;
          color: rgba(219, 234, 254, 0.84);
          font-size: 17px;
          line-height: 1.85;
          animation: coursesReveal 0.8s ease 0.2s both;
        }

        .courses-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
          animation: coursesReveal 0.8s ease 0.3s both;
        }

        .courses-primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 13px;
          padding: 13px 18px;
          background: var(--gold);
          color: var(--navy);
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .courses-primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.17);
        }

        .courses-secondary-button {
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
          backdrop-filter: blur(8px);
          transition: background 0.2s ease;
        }

        .courses-secondary-button:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .courses-meta {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          max-width: 720px;
          margin-top: 42px;
          padding-top: 23px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          animation: coursesReveal 0.8s ease 0.4s both;
        }

        .courses-meta-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding-right: 18px;
        }

        .courses-meta-item + .courses-meta-item {
          padding-left: 18px;
          border-left: 1px solid rgba(255, 255, 255, 0.10);
        }

        .courses-meta-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: var(--gold);
          background: rgba(255, 255, 255, 0.08);
        }

        .courses-meta-label {
          color: #93c5fd;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .courses-meta-value {
          margin-top: 3px;
          color: white;
          font-size: 12px;
          font-weight: 800;
        }

        /* INTRO */
        .programme-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(340px, 0.95fr);
          gap: 55px;
          align-items: center;
        }

        .courses-section-eyebrow {
          color: var(--blue);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .courses-section-eyebrow.light {
          color: var(--gold);
        }

        .courses-section-title {
          margin-top: 10px;
          color: var(--navy);
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .courses-section-title span {
          color: var(--blue);
        }

        .courses-paragraph {
          max-width: 680px;
          margin-top: 17px;
          color: #64748b;
          font-size: 15px;
          line-height: 1.85;
        }

        .programme-card {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          padding: 28px;
          background:
            radial-gradient(
              circle at 90% 10%,
              rgba(59, 130, 246, 0.22),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              #071b40,
              #104a9d
            );
          box-shadow: 0 25px 60px rgba(15, 61, 145, 0.16);
        }

        .programme-card-top {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .programme-symbol {
          width: 49px;
          height: 49px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          color: var(--gold);
          background: rgba(255, 255, 255, 0.09);
        }

        .programme-lines {
          display: grid;
          gap: 10px;
          margin-top: 25px;
        }

        .programme-line {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.04);
          color: #dbeafe;
          font-size: 12px;
          font-weight: 700;
        }

        .programme-line svg {
          color: var(--gold);
        }

        /* HIGHLIGHTS */
        .courses-soft-section {
          padding: 95px 0;
          background: linear-gradient(
            180deg,
            #f8fafc,
            #edf4fb
          );
        }

        .courses-highlight-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 17px;
          margin-top: 40px;
        }

        .courses-highlight-card {
          position: relative;
          overflow: hidden;
          padding: 24px;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          background: white;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .courses-highlight-card:hover {
          transform: translateY(-7px);
          border-color: #bfdbfe;
          box-shadow: 0 20px 42px rgba(15, 61, 145, 0.09);
        }

        .courses-highlight-icon {
          width: 49px;
          height: 49px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #eff6ff;
          color: var(--blue);
        }

        .courses-highlight-card h3 {
          margin-top: 17px;
          color: var(--navy);
          font-size: 17px;
          font-weight: 900;
        }

        .courses-highlight-card p {
          margin-top: 8px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.75;
        }

        .courses-card-arrow {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          margin-top: 18px;
          border-radius: 10px;
          background: #f8fafc;
          color: var(--blue);
        }

        /* JOURNEY */
        .journey-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 17px;
          margin-top: 40px;
        }

        .journey-card {
          display: flex;
          gap: 15px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          background: white;
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease;
        }

        .journey-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 35px rgba(15, 23, 42, 0.07);
        }

        .journey-number {
          width: 45px;
          height: 45px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #fff7df;
          color: #a16207;
          font-size: 12px;
          font-weight: 950;
        }

        .journey-content h3 {
          margin-top: 7px;
          color: var(--navy);
          font-size: 19px;
          font-weight: 900;
        }

        .journey-content p {
          margin-top: 8px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.75;
        }

        /* SUBJECTS */
        .subjects-section {
          padding: 95px 0;
          color: white;
          background:
            radial-gradient(
              circle at 80% 15%,
              rgba(59, 130, 246, 0.17),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #071b40,
              #103f88
            );
        }

        .subjects-layout {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 65px;
          align-items: center;
        }

        .subjects-title {
          max-width: 560px;
          margin-top: 10px;
          font-size: clamp(32px, 4vw, 50px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .subjects-description {
          max-width: 550px;
          margin-top: 16px;
          color: #bfdbfe;
          font-size: 14px;
          line-height: 1.8;
        }

        .subjects-badge {
          width: max-content;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 22px;
          padding: 9px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(255, 255, 255, 0.06);
          color: #dbeafe;
          font-size: 10px;
          font-weight: 800;
        }

        .subjects-badge svg {
          color: var(--gold);
        }

        .subjects-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .subject-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 13px 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.05);
          color: #dbeafe;
          font-size: 12px;
          font-weight: 700;
          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .subject-item:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.09);
        }

        .subject-item svg {
          flex-shrink: 0;
          color: #34d399;
        }

        /* SKILLS */
        .skills-card {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 40px;
          padding: 32px;
          border-radius: 26px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .skills-main h2 {
          margin-top: 10px;
          color: var(--navy);
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1.06;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .skills-main p {
          max-width: 560px;
          margin-top: 14px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.8;
        }

        .skills-points {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .skill-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          border-radius: 14px;
          background: white;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 12px;
          font-weight: 800;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .skill-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
        }

        .skill-icon {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 10px;
          color: var(--blue);
          background: #eff6ff;
        }

        /* CTA */
        .courses-cta {
          padding: 75px 0;
          color: white;
          background: #071b40;
        }

        .courses-cta-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 35px;
        }

        .courses-cta h2 {
          margin-top: 9px;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .courses-cta p {
          max-width: 620px;
          margin-top: 12px;
          color: #bfdbfe;
          font-size: 14px;
          line-height: 1.75;
        }

        .courses-cta-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          flex-shrink: 0;
        }

        .courses-cta-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 18px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.06);
          color: white;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        @keyframes coursesReveal {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes coursesPulse {
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

        @keyframes coursesGlowOne {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(-30px, 25px) scale(1.08);
          }
        }

        @keyframes coursesGlowTwo {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(28px, -20px) scale(1.08);
          }
        }

        @media (max-width: 1024px) {
          .programme-grid,
          .subjects-layout,
          .skills-card {
            grid-template-columns: 1fr;
          }

          .courses-highlight-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .journey-grid {
            grid-template-columns: 1fr;
          }

          .courses-cta-content {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .courses-title {
            font-size: 42px;
          }

          .courses-lead {
            font-size: 15px;
          }

          .courses-meta {
            grid-template-columns: 1fr;
            gap: 13px;
          }

          .courses-meta-item,
          .courses-meta-item + .courses-meta-item {
            padding: 0;
            border-left: 0;
          }

          .courses-highlight-grid,
          .subjects-list,
          .skills-points {
            grid-template-columns: 1fr;
          }

          .skills-card {
            padding: 24px;
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

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof GraduationCap;
  label: string;
  value: string;
}) {
  return (
    <div className="courses-meta-item">
      <div className="courses-meta-icon">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <div className="courses-meta-label">
          {label}
        </div>

        <div className="courses-meta-value">
          {value}
        </div>
      </div>
    </div>
  );
}

function ProgrammeLine({
  text,
}: {
  text: string;
}) {
  return (
    <div className="programme-line">
      <CheckCircle2 className="h-4 w-4" />
      {text}
    </div>
  );
}

function Skill({
  icon: Icon,
  text,
}: {
  icon: typeof Code2;
  text: string;
}) {
  return (
    <div className="skill-item">
      <div className="skill-icon">
        <Icon className="h-4 w-4" />
      </div>

      {text}
    </div>
  );
}

