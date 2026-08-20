
"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  GraduationCap,
  Mail,
  Monitor,
  UserRound,
} from "lucide-react";

import PublicShell from "@/components/public/PublicShell";
import { firestoreDb } from "@/lib/firebase/client";
import { useLiveCollection } from "@/hooks/useLiveCollection";

type FacultyMember = {
  id: string;
  name?: string;
  designation?: string;
  department?: string;
  qualification?: string;
  specialization?: string;
  email?: string;
  status?: string;
};

export default function FacultyPage() {
  const faculty =
    useLiveCollection<FacultyMember>(
      firestoreDb,
      "faculty",
      {
        limit: 30,
      }
    );

  const visibleFaculty = faculty.data.filter(
    (member) =>
      member.status !== "inactive" &&
      (!member.department ||
        member.department.toLowerCase().includes("computer") ||
        member.department.toLowerCase().includes("bca"))
  );

  return (
    <PublicShell>
      <main className="faculty-page">

        {/* HERO */}
        <section className="faculty-hero">
          <div className="faculty-grid" />
          <div className="faculty-glow faculty-glow-one" />
          <div className="faculty-glow faculty-glow-two" />

          <div className="container-page relative z-10 py-20 sm:py-24 lg:py-28">
            <div className="max-w-5xl">

              <div className="faculty-eyebrow">
                <span />
                Academic Team
              </div>

              <div className="mt-5 flex items-center gap-3 text-sm font-bold text-blue-200">
                <span>BCA</span>
                <span className="h-1 w-1 rounded-full bg-blue-300" />
                <span>Computer Applications</span>
              </div>

              <h1 className="faculty-title">
                Meet the people behind
                <span> the learning.</span>
              </h1>

              <p className="faculty-lead">
                Explore the academic team supporting the BCA
                programme through teaching, mentoring, practical
                learning and student guidance.
              </p>

              <div className="faculty-actions">
                <Link
                  href="/courses/bca"
                  className="faculty-primary"
                >
                  Explore BCA
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contact"
                  className="faculty-secondary"
                >
                  Contact College
                </Link>
              </div>

              <div className="faculty-meta">

                <Meta
                  icon={GraduationCap}
                  label="Programme"
                  value="BCA"
                />

                <Meta
                  icon={BookOpen}
                  label="Approach"
                  value="Academic + Practical"
                />

                <Meta
                  icon={UserRound}
                  label="Focus"
                  value="Student Development"
                />

              </div>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="section-space bg-white">
          <div className="container-page">

            <div className="faculty-intro-grid">

              <div>
                <div className="section-eyebrow">
                  Academic Team
                </div>

                <h2 className="section-title">
                  Guidance that connects concepts with practice.
                </h2>

                <p className="section-text">
                  Faculty members play an important role in
                  helping students understand concepts, develop
                  practical skills, complete projects and prepare
                  for future academic or professional opportunities.
                </p>

                <div className="faculty-check-list">
                  <CheckPoint text="Concept-focused teaching" />
                  <CheckPoint text="Practical learning support" />
                  <CheckPoint text="Project guidance" />
                  <CheckPoint text="Student mentoring" />
                </div>
              </div>

              <div className="faculty-profile-card">
                <div className="profile-icon">
                  <BriefcaseBusiness className="h-6 w-6" />
                </div>

                <div className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
                  Department of Computer Applications
                </div>

                <h3>
                  Learn from an academic team focused on
                  student growth.
                </h3>

                <div className="profile-stats">
                  <Stat
                    icon={Code2}
                    text="Programming"
                  />

                  <Stat
                    icon={Monitor}
                    text="Technology"
                  />

                  <Stat
                    icon={GraduationCap}
                    text="Mentoring"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FACULTY LIST */}
        <section className="faculty-soft-section">
          <div className="container-page">

            <div className="max-w-3xl">
              <div className="section-eyebrow">
                Our Faculty
              </div>

              <h2 className="section-title">
                BCA faculty and academic mentors.
              </h2>

              <p className="section-text">
                Faculty information shown here is loaded from the
                college's live academic database.
              </p>
            </div>

            <div className="mt-10">

              {faculty.loading && (
                <div className="faculty-empty-card">
                  Loading faculty information…
                </div>
              )}

              {faculty.error && (
                <div className="faculty-error-card">
                  Unable to load faculty information.
                </div>
              )}

              {!faculty.loading &&
                !faculty.error &&
                visibleFaculty.length === 0 && (
                  <div className="faculty-empty-card">
                    <div className="empty-icon">
                      <UserRound className="h-6 w-6" />
                    </div>

                    <h3>
                      Faculty information is being updated.
                    </h3>

                    <p>
                      The college can publish faculty details
                      from the administration portal.
                    </p>
                  </div>
                )}

              <div className="faculty-grid-list">
                {visibleFaculty.map((member) => (
                  <FacultyCard
                    key={member.id}
                    member={member}
                  />
                ))}
              </div>

            </div>

          </div>
        </section>

        {/* AREAS */}
        <section className="section-space bg-white">
          <div className="container-page">

            <div className="max-w-3xl">
              <div className="section-eyebrow">
                Academic Support
              </div>

              <h2 className="section-title">
                More than classroom teaching.
              </h2>

              <p className="section-text">
                A strong academic environment combines classroom
                instruction with mentoring, practical work and
                project support.
              </p>
            </div>

            <div className="faculty-support-grid">

              <SupportCard
                icon={BookOpen}
                title="Academic Guidance"
                text="Support students in understanding concepts and building strong academic foundations."
              />

              <SupportCard
                icon={Code2}
                title="Practical Learning"
                text="Encourage hands-on learning in programming, web technology and computer applications."
              />

              <SupportCard
                icon={BriefcaseBusiness}
                title="Project Mentoring"
                text="Guide students through project planning, development, documentation and presentation."
              />

              <SupportCard
                icon={UserRound}
                title="Student Mentoring"
                text="Support students with academic direction, progress and future opportunities."
              />

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="faculty-cta">
          <div className="container-page">

            <div className="faculty-cta-content">

              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                  Department of Computer Applications
                </div>

                <h2>
                  Explore the BCA academic experience.
                </h2>

                <p>
                  Learn more about the programme, subjects,
                  skills and opportunities available to students.
                </p>
              </div>

              <div className="faculty-cta-actions">

                <Link
                  href="/courses/bca"
                  className="faculty-primary"
                >
                  View BCA Details
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contact"
                  className="faculty-cta-secondary"
                >
                  Contact Us
                </Link>

              </div>

            </div>

          </div>
        </section>

      </main>

      <style jsx global>{`
        .faculty-page {
          overflow: hidden;
          background: #f8fafc;
        }

        .faculty-hero {
          position: relative;
          overflow: hidden;
          color: white;
          background:
            radial-gradient(
              circle at 85% 18%,
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

        .faculty-grid {
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

        .faculty-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(60px);
          pointer-events: none;
        }

        .faculty-glow-one {
          width: 360px;
          height: 360px;
          right: -120px;
          top: -120px;
          background: rgba(59, 130, 246, 0.24);
          animation: facultyFloatOne 9s ease-in-out infinite;
        }

        .faculty-glow-two {
          width: 260px;
          height: 260px;
          left: 10%;
          bottom: -150px;
          background: rgba(212, 175, 55, 0.10);
          animation: facultyFloatTwo 11s ease-in-out infinite;
        }

        .faculty-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--gold);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .faculty-eyebrow span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 14px rgba(52, 211, 153, 0.8);
          animation: facultyPulse 2s ease-in-out infinite;
        }

        .faculty-title {
          max-width: 850px;
          margin-top: 14px;
          font-size: clamp(44px, 6vw, 76px);
          line-height: 0.98;
          letter-spacing: -0.05em;
          font-weight: 950;
        }

        .faculty-title span {
          color: var(--gold);
        }

        .faculty-lead {
          max-width: 750px;
          margin-top: 23px;
          color: rgba(219, 234, 254, 0.84);
          font-size: 17px;
          line-height: 1.85;
        }

        .faculty-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 29px;
        }

        .faculty-primary {
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

        .faculty-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.16);
        }

        .faculty-secondary {
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

        .faculty-meta {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          max-width: 760px;
          margin-top: 42px;
          padding-top: 23px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .faculty-meta-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-right: 17px;
        }

        .faculty-meta-item + .faculty-meta-item {
          padding-left: 17px;
          border-left: 1px solid rgba(255, 255, 255, 0.10);
        }

        .faculty-meta-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.08);
          color: var(--gold);
        }

        .faculty-meta-label {
          color: #93c5fd;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .faculty-meta-value {
          margin-top: 3px;
          color: white;
          font-size: 12px;
          font-weight: 800;
        }

        .faculty-intro-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(340px, 0.95fr);
          gap: 55px;
          align-items: center;
        }

        .section-eyebrow {
          color: var(--blue);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.17em;
          text-transform: uppercase;
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

        .faculty-check-list {
          display: grid;
          gap: 10px;
          margin-top: 25px;
        }

        .faculty-check {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #334155;
          font-size: 12px;
          font-weight: 800;
        }

        .faculty-check svg {
          color: #16a34a;
        }

        .faculty-profile-card {
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
          color: var(--gold);
          background: rgba(255, 255, 255, 0.09);
        }

        .faculty-profile-card h3 {
          margin-top: 10px;
          font-size: 27px;
          line-height: 1.12;
          font-weight: 950;
        }

        .profile-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
          margin-top: 25px;
        }

        .profile-stat {
          padding: 12px 9px;
          border-radius: 13px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          text-align: center;
          color: #dbeafe;
          font-size: 10px;
          font-weight: 800;
        }

        .profile-stat svg {
          margin: 0 auto 7px;
          color: var(--gold);
        }

        .faculty-soft-section {
          padding: 95px 0;
          background: linear-gradient(
            180deg,
            #f8fafc,
            #edf4fb
          );
        }

        .faculty-grid-list {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 17px;
          margin-top: 18px;
        }

        .faculty-card {
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          background: white;
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.04);
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease,
            border-color 0.22s ease;
        }

        .faculty-card:hover {
          transform: translateY(-6px);
          border-color: #bfdbfe;
          box-shadow: 0 20px 42px rgba(15, 61, 145, 0.09);
        }

        .faculty-card-cover {
          position: relative;
          height: 115px;
          background:
            radial-gradient(
              circle at 85% 20%,
              rgba(59, 130, 246, 0.24),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              #071b40,
              #1457af
            );
        }

        .faculty-avatar {
          position: absolute;
          left: 22px;
          bottom: -26px;
          width: 68px;
          height: 68px;
          display: grid;
          place-items: center;
          border-radius: 21px;
          border: 4px solid white;
          background: #eff6ff;
          color: var(--blue);
          font-size: 20px;
          font-weight: 950;
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.10);
        }

        .faculty-card-body {
          padding: 39px 21px 21px;
        }

        .faculty-card-body h3 {
          color: var(--navy);
          font-size: 18px;
          font-weight: 900;
        }

        .faculty-designation {
          margin-top: 4px;
          color: var(--blue);
          font-size: 11px;
          font-weight: 800;
        }

        .faculty-detail {
          margin-top: 13px;
          color: #64748b;
          font-size: 11px;
          line-height: 1.7;
        }

        .faculty-detail strong {
          color: #334155;
        }

        .faculty-email {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 14px;
          color: var(--blue);
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
          word-break: break-all;
        }

        .faculty-empty-card,
        .faculty-error-card {
          padding: 40px 24px;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          background: white;
          text-align: center;
          color: #64748b;
          font-size: 13px;
        }

        .faculty-error-card {
          border-color: #fecaca;
          background: #fef2f2;
          color: #b91c1c;
          font-weight: 700;
        }

        .empty-icon {
          width: 53px;
          height: 53px;
          display: grid;
          place-items: center;
          margin: 0 auto;
          border-radius: 15px;
          background: #f1f5f9;
          color: #94a3b8;
        }

        .faculty-empty-card h3 {
          margin-top: 14px;
          color: var(--navy);
          font-size: 17px;
          font-weight: 900;
        }

        .faculty-empty-card p {
          margin-top: 7px;
        }

        .faculty-support-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 17px;
          margin-top: 40px;
        }

        .support-card {
          padding: 24px;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          background: white;
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease;
        }

        .support-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 38px rgba(15, 23, 42, 0.07);
        }

        .support-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #eff6ff;
          color: var(--blue);
        }

        .support-card h3 {
          margin-top: 16px;
          color: var(--navy);
          font-size: 17px;
          font-weight: 900;
        }

        .support-card p {
          margin-top: 8px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.75;
        }

        .faculty-cta {
          padding: 75px 0;
          color: white;
          background: #071b40;
        }

        .faculty-cta-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 35px;
        }

        .faculty-cta-content h2 {
          margin-top: 10px;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .faculty-cta-content p {
          max-width: 620px;
          margin-top: 12px;
          color: #bfdbfe;
          font-size: 14px;
          line-height: 1.75;
        }

        .faculty-cta-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          flex-shrink: 0;
        }

        .faculty-cta-secondary {
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

        @keyframes facultyPulse {
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

        @keyframes facultyFloatOne {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(-30px, 25px) scale(1.08);
          }
        }

        @keyframes facultyFloatTwo {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(25px, -20px) scale(1.08);
          }
        }

        @media (max-width: 1024px) {
          .faculty-intro-grid {
            grid-template-columns: 1fr;
          }

          .faculty-grid-list,
          .faculty-support-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .faculty-cta-content {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .faculty-title {
            font-size: 42px;
          }

          .faculty-lead {
            font-size: 15px;
          }

          .faculty-meta {
            grid-template-columns: 1fr;
            gap: 13px;
          }

          .faculty-meta-item,
          .faculty-meta-item + .faculty-meta-item {
            padding: 0;
            border-left: 0;
          }

          .profile-stats,
          .faculty-grid-list,
          .faculty-support-grid {
            grid-template-columns: 1fr;
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
    <div className="faculty-meta-item">
      <div className="faculty-meta-icon">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <div className="faculty-meta-label">
          {label}
        </div>

        <div className="faculty-meta-value">
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
    <div className="faculty-check">
      <CheckCircle2 className="h-4 w-4" />
      {text}
    </div>
  );
}

function Stat({
  icon: Icon,
  text,
}: {
  icon: typeof Code2;
  text: string;
}) {
  return (
    <div className="profile-stat">
      <Icon className="h-4 w-4" />
      {text}
    </div>
  );
}

function SupportCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof BookOpen;
  title: string;
  text: string;
}) {
  return (
    <div className="support-card">
      <div className="support-icon">
        <Icon className="h-5 w-5" />
      </div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

function FacultyCard({
  member,
}: {
  member: FacultyMember;
}) {
  const initials = getInitials(
    member.name || "Faculty"
  );

  return (
    <article className="faculty-card">

      <div className="faculty-card-cover">
        <div className="faculty-avatar">
          {initials}
        </div>
      </div>

      <div className="faculty-card-body">

        <h3>
          {member.name || "Faculty Member"}
        </h3>

        <div className="faculty-designation">
          {member.designation ||
            "Faculty"}
        </div>

        {member.qualification && (
          <div className="faculty-detail">
            <strong>Qualification:</strong>{" "}
            {member.qualification}
          </div>
        )}

        {member.specialization && (
          <div className="faculty-detail">
            <strong>Specialization:</strong>{" "}
            {member.specialization}
          </div>
        )}

        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="faculty-email"
          >
            <Mail className="h-3.5 w-3.5" />
            {member.email}
          </a>
        )}

      </div>
    </article>
  );
}

function getInitials(
  name: string
) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return "FM";
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

