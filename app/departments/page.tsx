"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Database,
  GraduationCap,
  Laptop,
  Monitor,
  Users,
} from "lucide-react";

import PublicShell from "@/components/public/PublicShell";

const areas = [
  {
    icon: Code2,
    title: "Programming",
    text: "Develop programming fundamentals, logical thinking and problem-solving ability.",
  },
  {
    icon: Database,
    title: "Database Systems",
    text: "Understand data storage, SQL, database design and information management.",
  },
  {
    icon: Laptop,
    title: "Web Technology",
    text: "Build knowledge of websites, web applications and modern digital technologies.",
  },
  {
    icon: Monitor,
    title: "Software Applications",
    text: "Learn how software systems are designed, developed and maintained.",
  },
];

const facilities = [
  "Computer-based practical learning",
  "Programming and application practice",
  "Database and web technology learning",
  "Project-oriented academic work",
];

export default function DepartmentsPage() {
  return (
    <PublicShell>
      <main className="departments-page">

        {/* HERO */}
        <section className="department-hero">
          <div className="department-grid" />
          <div className="department-glow department-glow-one" />
          <div className="department-glow department-glow-two" />

          <div className="container-page relative z-10 py-20 sm:py-24 lg:py-28">
            <div className="max-w-5xl">

              <div className="department-eyebrow">
                <span />
                Academic Department
              </div>

              <div className="mt-5 flex items-center gap-3 text-sm font-bold text-blue-200">
                <span>BCA</span>
                <span className="h-1 w-1 rounded-full bg-blue-300" />
                <span>Computer Applications</span>
              </div>

              <h1 className="department-title">
                Department of{" "}
                <span>Computer Applications</span>
              </h1>

              <p className="department-lead">
                A focused academic environment for students who
                want to build strong foundations in programming,
                databases, web technology and computer applications.
              </p>

              <div className="department-actions">
                <Link
                  href="/courses/bca"
                  className="department-primary"
                >
                  Explore BCA Programme
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contact"
                  className="department-secondary"
                >
                  Contact Department
                </Link>
              </div>

              <div className="department-meta">

                <Meta
                  icon={GraduationCap}
                  label="Programme"
                  value="Bachelor of Computer Applications"
                />

                <Meta
                  icon={BookOpen}
                  label="Focus"
                  value="Computer Applications"
                />

                <Meta
                  icon={Users}
                  label="Learning"
                  value="Academic + Practical"
                />

              </div>
            </div>
          </div>
        </section>

        {/* ABOUT DEPARTMENT */}
        <section className="section-space bg-white">
          <div className="container-page">

            <div className="department-intro">

              <div>
                <div className="section-eyebrow">
                  About the Department
                </div>

                <h2 className="section-title">
                  Building practical computing knowledge.
                </h2>

                <p className="section-text">
                  The Department of Computer Applications is
                  centered on helping students develop the
                  knowledge and skills needed to understand
                  computer systems and software applications.
                </p>

                <p className="section-text">
                  Through a combination of academic concepts and
                  practical learning, students can progressively
                  develop programming, database, web and software
                  development skills.
                </p>
              </div>

              <div className="department-profile-card">
                <div className="profile-icon">
                  <Code2 className="h-6 w-6" />
                </div>

                <div className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
                  Department Focus
                </div>

                <h3>
                  Learn technology.
                  <br />
                  Build solutions.
                </h3>

                <div className="profile-points">
                  <ProfilePoint text="Programming fundamentals" />
                  <ProfilePoint text="Database technologies" />
                  <ProfilePoint text="Web development" />
                  <ProfilePoint text="Application development" />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* AREAS */}
        <section className="department-soft-section">
          <div className="container-page">

            <div className="max-w-3xl">
              <div className="section-eyebrow">
                Areas of Learning
              </div>

              <h2 className="section-title">
                Core areas of the department.
              </h2>

              <p className="section-text">
                The department can provide students with a
                progressive foundation across important areas of
                computer applications.
              </p>
            </div>

            <div className="areas-grid">
              {areas.map(
                ({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="area-card"
                  >
                    <div className="area-icon">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3>{title}</h3>

                    <p>{text}</p>

                    <div className="area-arrow">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ACADEMIC EXPERIENCE */}
        <section className="section-space bg-white">
          <div className="container-page">

            <div className="experience-grid">

              <div>
                <div className="section-eyebrow">
                  Academic Experience
                </div>

                <h2 className="section-title">
                  From classroom concepts to practical skills.
                </h2>

                <p className="section-text">
                  Students can strengthen their technical
                  understanding through guided learning,
                  practical activities and project-oriented work.
                </p>

                <div className="check-list">
                  {facilities.map((item) => (
                    <div
                      key={item}
                      className="check-item"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="experience-visual">
                <div className="visual-ring visual-ring-one" />
                <div className="visual-ring visual-ring-two" />

                <div className="visual-center">
                  <Laptop className="h-8 w-8 text-[var(--gold)]" />

                  <div className="mt-3 text-3xl font-black text-white">
                    BCA
                  </div>

                  <div className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-200">
                    Computer Applications
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CAREER CTA */}
        <section className="department-cta">
          <div className="container-page">

            <div className="cta-content">

              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                  Explore the Programme
                </div>

                <h2>
                  Discover where BCA can take you.
                </h2>

                <p>
                  Explore the full programme structure, subjects,
                  skills, career opportunities and student
                  experience.
                </p>
              </div>

              <div className="cta-actions">
                <Link
                  href="/courses/bca"
                  className="department-primary"
                >
                  View BCA Details
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contact"
                  className="cta-secondary"
                >
                  Contact Us
                </Link>
              </div>

            </div>
          </div>
        </section>

      </main>

      <style jsx global>{`
        .departments-page {
          overflow: hidden;
          background: #f8fafc;
        }

        .department-hero {
          position: relative;
          overflow: hidden;
          color: white;
          background:
            radial-gradient(
              circle at 84% 18%,
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

        .department-grid {
          position: absolute;
          inset: 0;
          opacity: 0.13;
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

        .department-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(60px);
          pointer-events: none;
        }

        .department-glow-one {
          width: 360px;
          height: 360px;
          right: -120px;
          top: -120px;
          background: rgba(59, 130, 246, 0.24);
          animation: departmentFloatOne 9s ease-in-out infinite;
        }

        .department-glow-two {
          width: 250px;
          height: 250px;
          left: 10%;
          bottom: -150px;
          background: rgba(212, 175, 55, 0.10);
          animation: departmentFloatTwo 11s ease-in-out infinite;
        }

        .department-eyebrow,
        .section-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--gold);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .department-eyebrow span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 14px rgba(52, 211, 153, 0.8);
          animation: departmentPulse 2s ease-in-out infinite;
        }

        .department-title {
          max-width: 850px;
          margin-top: 14px;
          font-size: clamp(44px, 6vw, 76px);
          line-height: 0.98;
          letter-spacing: -0.05em;
          font-weight: 950;
        }

        .department-title span {
          color: var(--gold);
        }

        .department-lead {
          max-width: 760px;
          margin-top: 23px;
          color: rgba(219, 234, 254, 0.84);
          font-size: 17px;
          line-height: 1.85;
        }

        .department-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 29px;
        }

        .department-primary {
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

        .department-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.16);
        }

        .department-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 18px;
          border-radius: 13px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.06);
          color: white;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .department-meta {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          max-width: 760px;
          margin-top: 42px;
          padding-top: 23px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .department-meta-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-right: 17px;
        }

        .department-meta-item + .department-meta-item {
          padding-left: 17px;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
        }

        .department-meta-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.08);
          color: var(--gold);
        }

        .department-meta-label {
          color: #93c5fd;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .department-meta-value {
          margin-top: 3px;
          color: white;
          font-size: 12px;
          font-weight: 800;
        }

        .department-intro {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(340px, 0.95fr);
          gap: 55px;
          align-items: center;
        }

        .section-title {
          margin-top: 10px;
          color: var(--navy);
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .section-text {
          max-width: 690px;
          margin-top: 17px;
          color: #64748b;
          font-size: 15px;
          line-height: 1.85;
        }

        .department-profile-card {
          position: relative;
          overflow: hidden;
          padding: 29px;
          border-radius: 28px;
          color: white;
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

        .profile-icon {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.09);
          color: var(--gold);
        }

        .department-profile-card h3 {
          margin-top: 10px;
          font-size: 28px;
          line-height: 1.1;
          font-weight: 950;
        }

        .profile-points {
          display: grid;
          gap: 9px;
          margin-top: 24px;
        }

        .profile-point {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 12px;
          border-radius: 13px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          color: #dbeafe;
          font-size: 11px;
          font-weight: 700;
        }

        .profile-point svg {
          color: #34d399;
        }

        .department-soft-section {
          padding: 95px 0;
          background: linear-gradient(
            180deg,
            #f8fafc,
            #edf4fb
          );
        }

        .areas-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 17px;
          margin-top: 40px;
        }

        .area-card {
          position: relative;
          overflow: hidden;
          padding: 24px;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          background: white;
          transition:
            transform 0.24s ease,
            box-shadow 0.24s ease,
            border-color 0.24s ease;
        }

        .area-card:hover {
          transform: translateY(-6px);
          border-color: #bfdbfe;
          box-shadow: 0 20px 40px rgba(15, 61, 145, 0.09);
        }

        .area-icon {
          width: 49px;
          height: 49px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #eff6ff;
          color: var(--blue);
        }

        .area-card h3 {
          margin-top: 17px;
          color: var(--navy);
          font-size: 17px;
          font-weight: 900;
        }

        .area-card p {
          margin-top: 8px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.75;
        }

        .area-arrow {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          margin-top: 18px;
          border-radius: 10px;
          background: #f8fafc;
          color: var(--blue);
        }

        .experience-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(340px, 0.9fr);
          gap: 55px;
          align-items: center;
        }

        .check-list {
          display: grid;
          gap: 10px;
          margin-top: 25px;
        }

        .check-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #334155;
          font-size: 12px;
          font-weight: 800;
        }

        .check-item svg {
          color: #16a34a;
          flex-shrink: 0;
        }

        .experience-visual {
          position: relative;
          min-height: 340px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 28px;
          background:
            radial-gradient(
              circle at center,
              rgba(59, 130, 246, 0.32),
              transparent 48%
            ),
            linear-gradient(
              145deg,
              #10499b,
              #0a326f
            );
        }

        .visual-ring {
          position: absolute;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 50%;
          animation: rotateDepartment 20s linear infinite;
        }

        .visual-ring-one {
          width: 230px;
          height: 230px;
        }

        .visual-ring-two {
          width: 310px;
          height: 310px;
          animation-direction: reverse;
          animation-duration: 26s;
        }

        .visual-center {
          position: relative;
          z-index: 2;
          width: 165px;
          height: 165px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.13);
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(12px);
          text-align: center;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.18);
        }

        .department-cta {
          padding: 75px 0;
          color: white;
          background: #071b40;
        }

        .cta-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 35px;
        }

        .cta-content h2 {
          margin-top: 10px;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .cta-content p {
          max-width: 620px;
          margin-top: 12px;
          color: #bfdbfe;
          font-size: 14px;
          line-height: 1.75;
        }

        .cta-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          flex-shrink: 0;
        }

        .cta-secondary {
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

        @keyframes departmentPulse {
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

        @keyframes departmentFloatOne {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(-30px, 25px) scale(1.08);
          }
        }

        @keyframes departmentFloatTwo {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(25px, -20px) scale(1.08);
          }
        }

        @keyframes rotateDepartment {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1024px) {
          .department-intro,
          .experience-grid {
            grid-template-columns: 1fr;
          }

          .areas-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .cta-content {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .department-title {
            font-size: 42px;
          }

          .department-lead {
            font-size: 15px;
          }

          .department-meta {
            grid-template-columns: 1fr;
            gap: 13px;
          }

          .department-meta-item,
          .department-meta-item + .department-meta-item {
            padding: 0;
            border-left: 0;
          }

          .areas-grid {
            grid-template-columns: 1fr;
          }

          .experience-visual {
            min-height: 280px;
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
    <div className="department-meta-item">
      <div className="department-meta-icon">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <div className="department-meta-label">
          {label}
        </div>

        <div className="department-meta-value">
          {value}
        </div>
      </div>
    </div>
  );
}

function ProfilePoint({
  text,
}: {
  text: string;
}) {
  return (
    <div className="profile-point">
      <CheckCircle2 className="h-4 w-4" />
      {text}
    </div>
  );
}
