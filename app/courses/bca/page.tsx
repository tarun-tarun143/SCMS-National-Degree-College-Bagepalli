
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Database,
  GraduationCap,
  Laptop,
  Monitor,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import PublicShell from "@/components/public/PublicShell";

const semesterGroups = [
  {
    semester: "Semester 1",
    subtitle: "Computer Foundations",
    subjects: [
      "Programming Fundamentals",
      "Computer Fundamentals",
      "Mathematics",
      "Communication Skills",
      "Digital Fundamentals",
    ],
  },
  {
    semester: "Semester 2",
    subtitle: "Programming & Data",
    subjects: [
      "Data Structures",
      "Object-Oriented Programming",
      "Database Fundamentals",
      "Web Fundamentals",
      "Operating Systems",
    ],
  },
  {
    semester: "Semester 3",
    subtitle: "Application Development",
    subjects: [
      "Database Management Systems",
      "Web Technologies",
      "Computer Networks",
      "Software Engineering",
      "Advanced Programming",
    ],
  },
  {
    semester: "Semester 4",
    subtitle: "Systems & Development",
    subjects: [
      "Advanced Web Development",
      "System Analysis",
      "Application Development",
      "Network Technologies",
      "Software Project Management",
    ],
  },
  {
    semester: "Semester 5",
    subtitle: "Practical Specialization",
    subjects: [
      "Advanced Programming",
      "Cloud & Modern Computing",
      "Project Development",
      "Programming Applications",
      "Technical Elective",
    ],
  },
  {
    semester: "Semester 6",
    subtitle: "Project & Career Readiness",
    subjects: [
      "Major Project",
      "Application Design",
      "Professional Skills",
      "Project Documentation",
      "Presentation & Viva",
    ],
  },
];

const skills = [
  "Programming and logical thinking",
  "Database design and SQL",
  "Web application development",
  "Software development concepts",
  "Problem solving",
  "Project development",
  "Computer system fundamentals",
  "Professional communication",
];

const careers = [
  {
    icon: Code2,
    title: "Software Developer",
    text: "Build software applications and digital solutions.",
  },
  {
    icon: Laptop,
    title: "Web Developer",
    text: "Create modern websites and web applications.",
  },
  {
    icon: Database,
    title: "Database Professional",
    text: "Work with data systems, databases and information management.",
  },
  {
    icon: Monitor,
    title: "Application Support",
    text: "Support, maintain and improve technology applications.",
  },
];

export default function BCADetailsPage() {
  return (
    <PublicShell>
      <main className="bca-page">

        {/* HERO */}
        <section className="bca-hero">
          <div className="bca-hero-grid" />
          <div className="bca-glow bca-glow-one" />
          <div className="bca-glow bca-glow-two" />

          <div className="container-page relative z-10 py-16 sm:py-20 lg:py-24">

            <Link
              href="/courses"
              className="bca-back-link"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Link>

            <div className="mt-10 max-w-5xl">

              <div className="bca-eyebrow">
                <span />
                Bachelor of Computer Applications
              </div>

              <div className="bca-code-row">
                <span>BCA</span>
                <span className="dot" />
                <span>Undergraduate Programme</span>
              </div>

              <h1 className="bca-title">
                Build skills.
                <span> Create solutions.</span>
              </h1>

              <p className="bca-lead">
                A focused computer applications programme designed
                to develop programming knowledge, technical skills,
                problem-solving ability and practical project
                experience.
              </p>

              <div className="bca-action-row">
                <Link
                  href="/contact"
                  className="bca-primary-button"
                >
                  Enquire About BCA
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="#overview"
                  className="bca-secondary-button"
                >
                  View Programme
                </a>
              </div>

              <div className="bca-quick-info">

                <QuickInfo
                  icon={GraduationCap}
                  label="Programme"
                  value="BCA"
                />

                <QuickInfo
                  icon={BookOpen}
                  label="Study Focus"
                  value="Computer Applications"
                />

                <QuickInfo
                  icon={Target}
                  label="Learning"
                  value="Theory + Practical"
                />

              </div>

            </div>
          </div>
        </section>

        {/* OVERVIEW */}
        <section
          id="overview"
          className="section-space bg-white"
        >
          <div className="container-page">

            <div className="bca-overview-grid">

              <div>
                <div className="bca-section-eyebrow">
                  Programme Overview
                </div>

                <h2 className="bca-section-title">
                  A strong foundation for the digital world.
                </h2>

                <p className="bca-paragraph">
                  The BCA programme introduces students to the
                  concepts, technologies and practices used in
                  computer applications and software development.
                </p>

                <p className="bca-paragraph">
                  Students progressively develop knowledge in
                  programming, databases, web technologies,
                  software systems and project development.
                </p>

                <div className="bca-check-grid">
                  <CheckPoint text="Programming foundations" />
                  <CheckPoint text="Database technologies" />
                  <CheckPoint text="Web development" />
                  <CheckPoint text="Software concepts" />
                  <CheckPoint text="Practical projects" />
                  <CheckPoint text="Career-oriented skills" />
                </div>
              </div>

              <div className="bca-overview-card">

                <div className="overview-icon">
                  <GraduationCap className="h-7 w-7" />
                </div>

                <div className="text-xs font-bold uppercase tracking-[0.17em] text-blue-200">
                  BCA Programme
                </div>

                <div className="mt-2 text-3xl font-black text-white">
                  Learn. Practice. Build.
                </div>

                <div className="mt-5 grid gap-3">
                  <OverviewPoint
                    title="Learn"
                    text="Develop conceptual computer knowledge."
                  />

                  <OverviewPoint
                    title="Practice"
                    text="Apply concepts through practical activities."
                  />

                  <OverviewPoint
                    title="Build"
                    text="Create projects using learned technologies."
                  />
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* WHY BCA */}
        <section className="bca-soft-section">
          <div className="container-page">

            <div className="max-w-3xl">

              <div className="bca-section-eyebrow">
                Why BCA
              </div>

              <h2 className="bca-section-title">
                Learn the fundamentals behind modern computing.
              </h2>

              <p className="bca-paragraph">
                The programme combines core computer concepts with
                application-focused learning so students can build
                both technical understanding and practical ability.
              </p>

            </div>

            <div className="bca-feature-grid">

              <FeatureCard
                icon={Code2}
                title="Programming"
                text="Develop logical thinking and programming skills for building solutions."
              />

              <FeatureCard
                icon={Database}
                title="Data & Databases"
                text="Understand how data is organized, stored, managed and accessed."
              />

              <FeatureCard
                icon={Laptop}
                title="Web Technology"
                text="Learn the foundations used to create modern web applications."
              />

              <FeatureCard
                icon={ShieldCheck}
                title="Software Systems"
                text="Understand software development, systems and engineering practices."
              />

            </div>
          </div>
        </section>

        {/* SEMESTERS */}
        <section className="section-space bg-white">
          <div className="container-page">

            <div className="max-w-3xl">
              <div className="bca-section-eyebrow">
                Academic Structure
              </div>

              <h2 className="bca-section-title">
                A structured journey across six semesters.
              </h2>

              <p className="bca-paragraph">
                The programme can progressively move from
                foundations to application development and major
                project work.
              </p>
            </div>

            <div className="semester-grid">
              {semesterGroups.map((group, index) => (
                <div
                  key={group.semester}
                  className="semester-card"
                >
                  <div className="semester-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="semester-content">

                    <div className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--blue)]">
                      {group.semester}
                    </div>

                    <h3>
                      {group.subtitle}
                    </h3>

                    <div className="semester-subjects">
                      {group.subjects.map((subject) => (
                        <div
                          key={subject}
                          className="semester-subject"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {subject}
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section className="bca-dark-section">
          <div className="container-page">

            <div className="bca-skills-layout">

              <div>
                <div className="bca-section-eyebrow light">
                  Skills You Can Develop
                </div>

                <h2 className="bca-dark-title">
                  Turn academic learning into practical capability.
                </h2>

                <p className="bca-dark-text">
                  Students can build a broad technical foundation
                  that supports future employment, internships,
                  projects and higher studies.
                </p>
              </div>

              <div className="skills-list">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="skill-item"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {skill}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* CAREERS */}
        <section className="section-space bg-white">
          <div className="container-page">

            <div className="max-w-3xl">
              <div className="bca-section-eyebrow">
                Career Opportunities
              </div>

              <h2 className="bca-section-title">
                Where can your computing skills take you?
              </h2>

              <p className="bca-paragraph">
                A BCA foundation can support a range of technology,
                software, web and application-oriented career paths.
              </p>
            </div>

            <div className="careers-grid">
              {careers.map(
                ({
                  icon: Icon,
                  title,
                  text,
                }) => (
                  <div
                    key={title}
                    className="career-card"
                  >
                    <div className="career-icon">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3>{title}</h3>

                    <p>{text}</p>

                    <ArrowRight className="career-arrow h-4 w-4" />
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* STUDENT EXPERIENCE */}
        <section className="bca-experience-section">
          <div className="container-page">

            <div className="experience-card">

              <div className="experience-icon">
                <Users className="h-7 w-7" />
              </div>

              <div className="experience-content">

                <div className="bca-section-eyebrow light">
                  Student Experience
                </div>

                <h2>
                  Learn in a connected academic environment.
                </h2>

                <p>
                  The SCMS digital campus connects students with
                  academic information, notices, events, attendance,
                  results and other college services.
                </p>

                <div className="experience-points">
                  <ExperiencePoint text="Academic information" />
                  <ExperiencePoint text="Live notices and events" />
                  <ExperiencePoint text="Student portal access" />
                  <ExperiencePoint text="Connected college services" />
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="bca-cta">

          <div className="container-page">

            <div className="bca-cta-content">

              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                  Interested in BCA?
                </div>

                <h2>
                  Take the next step toward your digital future.
                </h2>

                <p>
                  Contact the college for current admission,
                  eligibility, fees and programme information.
                </p>
              </div>

              <div className="bca-cta-actions">

                <Link
                  href="/contact"
                  className="bca-primary-button"
                >
                  Contact College
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/courses"
                  className="bca-cta-secondary"
                >
                  Back to Courses
                </Link>

              </div>

            </div>

          </div>

        </section>

      </main>

      <style jsx global>{`
        .bca-page {
          overflow: hidden;
          background: #f8fafc;
        }

        .bca-hero {
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
              #071b40,
              #0b316f 48%,
              #1457af
            );
        }

        .bca-hero-grid {
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

        .bca-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(60px);
        }

        .bca-glow-one {
          width: 350px;
          height: 350px;
          right: -100px;
          top: -110px;
          background: rgba(59, 130, 246, 0.24);
          animation: bcaFloatOne 9s ease-in-out infinite;
        }

        .bca-glow-two {
          width: 250px;
          height: 250px;
          left: 10%;
          bottom: -130px;
          background: rgba(212, 175, 55, 0.10);
          animation: bcaFloatTwo 11s ease-in-out infinite;
        }

        .bca-back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #dbeafe;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .bca-back-link:hover {
          color: white;
        }

        .bca-eyebrow {
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
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .bca-eyebrow span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 14px rgba(52, 211, 153, 0.8);
          animation: bcaPulse 2s ease-in-out infinite;
        }

        .bca-code-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 18px;
          color: #bfdbfe;
          font-size: 13px;
          font-weight: 800;
        }

        .bca-code-row > span:first-child {
          color: var(--gold);
        }

        .bca-code-row .dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #93c5fd;
        }

        .bca-title {
          max-width: 850px;
          margin-top: 15px;
          font-size: clamp(45px, 6vw, 78px);
          line-height: 0.98;
          letter-spacing: -0.05em;
          font-weight: 950;
        }

        .bca-title span {
          color: var(--gold);
        }

        .bca-lead {
          max-width: 760px;
          margin-top: 23px;
          color: rgba(219, 234, 254, 0.84);
          font-size: 17px;
          line-height: 1.85;
        }

        .bca-action-row {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 28px;
        }

        .bca-primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 18px;
          border-radius: 13px;
          background: var(--gold);
          color: var(--navy);
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .bca-primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.17);
        }

        .bca-secondary-button {
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

        .bca-quick-info {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          max-width: 760px;
          margin-top: 42px;
          padding-top: 23px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .quick-info {
          display: flex;
          align-items: center;
          gap: 11px;
          padding-right: 17px;
        }

        .quick-info + .quick-info {
          padding-left: 17px;
          border-left: 1px solid rgba(255, 255, 255, 0.10);
        }

        .quick-info-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: var(--gold);
          background: rgba(255, 255, 255, 0.08);
        }

        .quick-info-label {
          color: #93c5fd;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .quick-info-value {
          margin-top: 3px;
          color: white;
          font-size: 12px;
          font-weight: 800;
        }

        /* OVERVIEW */
        .bca-overview-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(340px, 0.92fr);
          gap: 55px;
          align-items: center;
        }

        .bca-section-eyebrow {
          color: var(--blue);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .bca-section-eyebrow.light {
          color: var(--gold);
        }

        .bca-section-title {
          margin-top: 10px;
          color: var(--navy);
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .bca-paragraph {
          max-width: 680px;
          margin-top: 17px;
          color: #64748b;
          font-size: 15px;
          line-height: 1.85;
        }

        .bca-check-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 24px;
        }

        .check-point {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #334155;
          font-size: 12px;
          font-weight: 800;
        }

        .check-point svg {
          color: #16a34a;
          flex-shrink: 0;
        }

        .bca-overview-card {
          position: relative;
          overflow: hidden;
          padding: 29px;
          border-radius: 28px;
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

        .overview-icon {
          width: 53px;
          height: 53px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          color: var(--gold);
          background: rgba(255, 255, 255, 0.09);
        }

        .overview-point {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 12px;
          border-radius: 13px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
        }

        .overview-point-number {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          color: var(--gold);
          font-size: 11px;
          font-weight: 950;
        }

        .overview-point-title {
          color: white;
          font-size: 12px;
          font-weight: 800;
        }

        .overview-point-text {
          margin-top: 2px;
          color: #bfdbfe;
          font-size: 10px;
          line-height: 1.5;
        }

        /* FEATURES */
        .bca-soft-section {
          padding: 95px 0;
          background: linear-gradient(
            180deg,
            #f8fafc,
            #edf4fb
          );
        }

        .bca-feature-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 17px;
          margin-top: 40px;
        }

        .bca-feature-card {
          padding: 24px;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          background: white;
          transition:
            transform 0.24s ease,
            box-shadow 0.24s ease,
            border-color 0.24s ease;
        }

        .bca-feature-card:hover {
          transform: translateY(-6px);
          border-color: #bfdbfe;
          box-shadow: 0 20px 40px rgba(15, 61, 145, 0.09);
        }

        .bca-feature-icon {
          width: 49px;
          height: 49px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #eff6ff;
          color: var(--blue);
        }

        .bca-feature-card h3 {
          margin-top: 17px;
          color: var(--navy);
          font-size: 17px;
          font-weight: 900;
        }

        .bca-feature-card p {
          margin-top: 8px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.75;
        }

        /* SEMESTERS */
        .semester-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 17px;
          margin-top: 40px;
        }

        .semester-card {
          display: flex;
          gap: 15px;
          padding: 23px;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          background: white;
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease;
        }

        .semester-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 35px rgba(15, 23, 42, 0.07);
        }

        .semester-number {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 14px;
          color: #a16207;
          background: #fff7df;
          font-size: 12px;
          font-weight: 950;
        }

        .semester-content h3 {
          margin-top: 7px;
          color: var(--navy);
          font-size: 19px;
          font-weight: 900;
        }

        .semester-subjects {
          display: grid;
          gap: 7px;
          margin-top: 14px;
        }

        .semester-subject {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #64748b;
          font-size: 11px;
          line-height: 1.5;
        }

        .semester-subject svg {
          color: #16a34a;
          flex-shrink: 0;
        }

        /* DARK */
        .bca-dark-section {
          padding: 95px 0;
          color: white;
          background:
            radial-gradient(
              circle at 82% 15%,
              rgba(59, 130, 246, 0.18),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #071b40,
              #103f88
            );
        }

        .bca-skills-layout {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 65px;
          align-items: center;
        }

        .bca-dark-title {
          max-width: 560px;
          margin-top: 10px;
          font-size: clamp(32px, 4vw, 50px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .bca-dark-text {
          max-width: 550px;
          margin-top: 16px;
          color: #bfdbfe;
          font-size: 14px;
          line-height: 1.8;
        }

        .skills-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .skill-item {
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

        .skill-item:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.09);
        }

        .skill-item svg {
          color: #34d399;
          flex-shrink: 0;
        }

        /* CAREERS */
        .careers-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 17px;
          margin-top: 40px;
        }

        .career-card {
          position: relative;
          padding: 24px;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          background: white;
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease;
        }

        .career-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 38px rgba(15, 23, 42, 0.07);
        }

        .career-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #eff6ff;
          color: var(--blue);
        }

        .career-card h3 {
          margin-top: 16px;
          color: var(--navy);
          font-size: 17px;
          font-weight: 900;
        }

        .career-card p {
          margin-top: 8px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.75;
        }

        .career-arrow {
          margin-top: 18px;
          color: var(--blue);
        }

        /* EXPERIENCE */
        .bca-experience-section {
          padding: 95px 0;
          background: #f8fafc;
        }

        .experience-card {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 24px;
          align-items: start;
          padding: 38px;
          border-radius: 28px;
          color: white;
          background:
            radial-gradient(
              circle at 90% 10%,
              rgba(59, 130, 246, 0.18),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              #071b40,
              #104a9d
            );
          box-shadow: 0 25px 60px rgba(15, 61, 145, 0.13);
        }

        .experience-icon {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          border-radius: 17px;
          color: var(--gold);
          background: rgba(255, 255, 255, 0.08);
        }

        .experience-content h2 {
          margin-top: 10px;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.06;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .experience-content p {
          max-width: 700px;
          margin-top: 15px;
          color: #bfdbfe;
          font-size: 14px;
          line-height: 1.8;
        }

        .experience-points {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
          margin-top: 22px;
        }

        .experience-point {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          color: #dbeafe;
          font-size: 11px;
          font-weight: 700;
        }

        .experience-point svg {
          color: #34d399;
        }

        /* CTA */
        .bca-cta {
          padding: 75px 0;
          color: white;
          background: #071b40;
        }

        .bca-cta-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 35px;
        }

        .bca-cta-content h2 {
          margin-top: 10px;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .bca-cta-content p {
          max-width: 620px;
          margin-top: 12px;
          color: #bfdbfe;
          font-size: 14px;
          line-height: 1.75;
        }

        .bca-cta-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          flex-shrink: 0;
        }

        .bca-cta-secondary {
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

        @keyframes bcaPulse {
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

        @keyframes bcaFloatOne {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(-30px, 22px) scale(1.08);
          }
        }

        @keyframes bcaFloatTwo {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(28px, -20px) scale(1.08);
          }
        }

        @media (max-width: 1024px) {
          .bca-overview-grid,
          .bca-skills-layout,
          .experience-card {
            grid-template-columns: 1fr;
          }

          .bca-feature-grid,
          .careers-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .bca-cta-content {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .bca-title {
            font-size: 42px;
          }

          .bca-lead {
            font-size: 15px;
          }

          .bca-quick-info {
            grid-template-columns: 1fr;
            gap: 13px;
          }

          .quick-info,
          .quick-info + .quick-info {
            padding: 0;
            border-left: 0;
          }

          .bca-check-grid,
          .bca-feature-grid,
          .semester-grid,
          .skills-list,
          .careers-grid,
          .experience-points {
            grid-template-columns: 1fr;
          }

          .experience-card {
            padding: 27px;
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

function QuickInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof GraduationCap;
  label: string;
  value: string;
}) {
  return (
    <div className="quick-info">
      <div className="quick-info-icon">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <div className="quick-info-label">
          {label}
        </div>

        <div className="quick-info-value">
          {value}
        </div>
      </div>
    </div>
  );
}

function CheckPoint({
  text,
}: {
  text: string;
}) {
  return (
    <div className="check-point">
      <CheckCircle2 className="h-4 w-4" />
      {text}
    </div>
  );
}

function OverviewPoint({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="overview-point">
      <div className="overview-point-number">
        ✓
      </div>

      <div>
        <div className="overview-point-title">
          {title}
        </div>

        <div className="overview-point-text">
          {text}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Code2;
  title: string;
  text: string;
}) {
  return (
    <div className="bca-feature-card">
      <div className="bca-feature-icon">
        <Icon className="h-5 w-5" />
      </div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

function ExperiencePoint({
  text,
}: {
  text: string;
}) {
  return (
    <div className="experience-point">
      <CheckCircle2 className="h-4 w-4" />
      {text}
    </div>
  );
}

