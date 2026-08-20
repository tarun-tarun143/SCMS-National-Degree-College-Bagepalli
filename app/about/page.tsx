"use client";

import PublicShell from "@/components/public/PublicShell";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Eye,
  HeartHandshake,
  Target,
  Users,
} from "lucide-react";

const highlights = [
  {
    icon: BookOpen,
    title: "Academic Focus",
    text: "A learning environment designed to build strong academic foundations and practical knowledge.",
  },
  {
    icon: Users,
    title: "Student-Centered",
    text: "Focused on creating accessible academic information and useful student services.",
  },
  {
    icon: Award,
    title: "Continuous Growth",
    text: "Encouraging curiosity, responsible technology use and continuous improvement.",
  },
];

const values = [
  "Academic responsibility",
  "Integrity and discipline",
  "Student support",
  "Responsible technology",
  "Continuous improvement",
  "Professional development",
];

export default function About() {
  return (
    <PublicShell>
      <main className="about-page">

        {/* HERO */}
        <section className="about-hero">
          <div className="about-hero-glow about-glow-one" />
          <div className="about-hero-glow about-glow-two" />

          <div className="about-grid" />

          <div className="container-page relative z-10 py-20 sm:py-24 lg:py-28">
            <div className="max-w-5xl">

              <div className="about-eyebrow">
                <span className="about-pulse" />
                About The National Degree College
              </div>

              <h1 className="about-title">
                Learning with purpose.
                <span> Growing with technology.</span>
              </h1>

              <p className="about-lead">
                The National Degree College, Bagepalli is committed
                to creating a focused academic environment where
                students can develop knowledge, confidence,
                discipline and practical skills for the future.
              </p>

              <div className="about-actions">
                <a
                  href="/courses/bca"
                  className="about-primary-button"
                >
                  Explore BCA
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="/contact"
                  className="about-secondary-button"
                >
                  Contact College
                </a>
              </div>

              <div className="about-stats">
                <Stat
                  number="BCA"
                  label="Programme Focus"
                />

                <Stat
                  number="SCMS"
                  label="Digital Campus"
                />

                <Stat
                  number="24/7"
                  label="Online Access"
                />
              </div>
            </div>
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="section-space bg-white">
          <div className="container-page">
            <div className="about-intro-grid">

              <div className="about-intro-copy">
                <div className="section-eyebrow">
                  Our Approach
                </div>

                <h2>
                  A modern academic experience built around students.
                </h2>

                <p>
                  Education is more than attending classes. It is
                  about building the ability to think clearly,
                  communicate confidently, solve problems and use
                  technology responsibly.
                </p>

                <p>
                  The college's digital campus approach brings
                  academic information, student services, notices,
                  events and role-based portals into one connected
                  experience.
                </p>
              </div>

              <div className="about-highlight-panel">
                <div className="highlight-panel-top">
                  <div className="highlight-icon">
                    <BookOpen className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
                      Digital Academic Campus
                    </div>

                    <div className="mt-1 text-xl font-black text-white">
                      One connected experience
                    </div>
                  </div>
                </div>

                <div className="highlight-list">
                  <HighlightItem text="Academic information" />
                  <HighlightItem text="Student services" />
                  <HighlightItem text="Faculty operations" />
                  <HighlightItem text="College announcements" />
                  <HighlightItem text="Secure role-based access" />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className="about-soft-section">
          <div className="container-page">

            <div className="max-w-3xl">
              <div className="section-eyebrow">
                What We Focus On
              </div>

              <h2 className="section-main-title">
                Building a stronger learning experience.
              </h2>

              <p className="section-description">
                Our academic environment aims to combine
                disciplined learning with practical skills and
                responsible use of technology.
              </p>
            </div>

            <div className="about-highlight-grid">
              {highlights.map(
                ({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="about-feature-card"
                  >
                    <div className="feature-icon">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3>{title}</h3>

                    <p>{text}</p>

                    <div className="feature-line" />
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* VISION MISSION VALUES */}
        <section className="section-space bg-white">
          <div className="container-page">

            <div className="max-w-3xl">
              <div className="section-eyebrow">
                Vision • Mission • Values
              </div>

              <h2 className="section-main-title">
                Principles that guide the institution.
              </h2>
            </div>

            <div className="vision-grid">
              <Info
                icon={Eye}
                title="Vision"
                text="Create a strong learning environment that encourages knowledge, confidence, responsible technology use and meaningful personal growth."
              />

              <Info
                icon={Target}
                title="Mission"
                text="Support academic excellence through accessible information, disciplined operations, practical learning and student-centered services."
              />

              <Info
                icon={HeartHandshake}
                title="Values"
                text="Promote integrity, inclusion, academic responsibility, service, discipline and continuous improvement in every part of college life."
              />
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="about-values-section">
          <div className="container-page">

            <div className="values-layout">

              <div>
                <div className="section-eyebrow light">
                  Our Values
                </div>

                <h2 className="values-title">
                  A culture of responsibility and growth.
                </h2>

                <p className="values-description">
                  Every student experience should encourage
                  curiosity, responsibility and confidence.
                </p>
              </div>

              <div className="values-grid">
                {values.map((value) => (
                  <div
                    key={value}
                    className="value-item"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {value}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* BCA SECTION */}
        <section className="section-space bg-white">
          <div className="container-page">

            <div className="about-bca-card">

              <div className="bca-content">
                <div className="section-eyebrow">
                  BCA Programme
                </div>

                <h2>
                  Preparing students for the digital future.
                </h2>

                <p>
                  The Bachelor of Computer Applications
                  programme focuses on programming, databases,
                  web technologies, software development and
                  practical computing skills.
                </p>

                <a
                  href="/courses/bca"
                  className="bca-link"
                >
                  Explore BCA Programme
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="bca-visual">
                <div className="bca-circle bca-circle-one" />
                <div className="bca-circle bca-circle-two" />

                <div className="bca-center">
                  <BookOpen className="h-8 w-8 text-[var(--gold)]" />

                  <div className="mt-3 text-2xl font-black text-white">
                    BCA
                  </div>

                  <div className="mt-1 text-xs font-bold uppercase tracking-widest text-blue-200">
                    Computer Applications
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <div className="container-page">
            <div className="about-cta-content">

              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                  Discover More
                </div>

                <h2>
                  Explore the college digital campus.
                </h2>

                <p>
                  Browse the BCA programme, view college
                  information or contact the institution.
                </p>
              </div>

              <div className="about-cta-actions">
                <a
                  href="/courses/bca"
                  className="about-primary-button"
                >
                  Explore BCA
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="/contact"
                  className="about-cta-secondary"
                >
                  Contact Us
                </a>
              </div>

            </div>
          </div>
        </section>

      </main>

      <style jsx global>{`
        .about-page {
          overflow: hidden;
          background: #f8fafc;
        }

        .about-hero {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 85% 20%,
              rgba(59, 130, 246, 0.22),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #071b40 0%,
              #0b2f6c 48%,
              #1457af 100%
            );
          color: white;
        }

        .about-grid {
          position: absolute;
          inset: 0;
          opacity: 0.15;
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
          background-size: 45px 45px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 85%
          );
        }

        .about-hero-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(50px);
          pointer-events: none;
        }

        .about-glow-one {
          width: 330px;
          height: 330px;
          right: -100px;
          top: -100px;
          background: rgba(59, 130, 246, 0.22);
          animation: aboutFloatOne 9s ease-in-out infinite;
        }

        .about-glow-two {
          width: 250px;
          height: 250px;
          left: 20%;
          bottom: -150px;
          background: rgba(212, 175, 55, 0.10);
          animation: aboutFloatTwo 11s ease-in-out infinite;
        }

        .about-eyebrow,
        .section-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--gold);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .about-pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 15px rgba(52, 211, 153, 0.8);
          animation: aboutPulse 2s ease-in-out infinite;
        }

        .about-title {
          max-width: 900px;
          margin-top: 18px;
          font-size: clamp(42px, 6vw, 78px);
          line-height: 0.98;
          letter-spacing: -0.05em;
          font-weight: 950;
          animation: aboutReveal 0.8s ease both;
        }

        .about-title span {
          color: var(--gold);
        }

        .about-lead {
          max-width: 760px;
          margin-top: 25px;
          color: rgba(219, 234, 254, 0.84);
          font-size: 17px;
          line-height: 1.85;
          animation: aboutReveal 0.8s ease 0.12s both;
        }

        .about-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
          animation: aboutReveal 0.8s ease 0.24s both;
        }

        .about-primary-button {
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

        .about-primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.16);
        }

        .about-secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.17);
          border-radius: 13px;
          padding: 13px 18px;
          background: rgba(255, 255, 255, 0.07);
          color: white;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          backdrop-filter: blur(8px);
          transition: background 0.2s ease;
        }

        .about-secondary-button:hover {
          background: rgba(255, 255, 255, 0.13);
        }

        .about-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          max-width: 680px;
          margin-top: 42px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          padding-top: 24px;
          animation: aboutReveal 0.8s ease 0.38s both;
        }

        .about-stat {
          padding-right: 20px;
        }

        .about-stat + .about-stat {
          padding-left: 20px;
          border-left: 1px solid rgba(255, 255, 255, 0.10);
        }

        .about-stat-number {
          color: white;
          font-size: 24px;
          font-weight: 950;
        }

        .about-stat-label {
          margin-top: 5px;
          color: rgba(191, 219, 254, 0.65);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.11em;
        }

        .about-intro-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(340px, 0.9fr);
          gap: 55px;
          align-items: center;
        }

        .about-intro-copy h2,
        .section-main-title {
          margin-top: 10px;
          color: var(--navy);
          font-size: clamp(30px, 4vw, 47px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .about-intro-copy p {
          margin-top: 18px;
          color: #64748b;
          font-size: 15px;
          line-height: 1.85;
        }

        .about-highlight-panel {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          padding: 28px;
          background: linear-gradient(
            145deg,
            #071b40,
            #10499b
          );
          box-shadow: 0 25px 60px rgba(15, 61, 145, 0.16);
        }

        .about-highlight-panel::before {
          content: "";
          position: absolute;
          width: 220px;
          height: 220px;
          right: -100px;
          top: -100px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.20);
          filter: blur(30px);
        }

        .highlight-panel-top {
          position: relative;
          display: flex;
          gap: 13px;
          align-items: center;
        }

        .highlight-icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.09);
          color: var(--gold);
        }

        .highlight-list {
          position: relative;
          display: grid;
          gap: 10px;
          margin-top: 25px;
        }

        .highlight-item {
          display: flex;
          gap: 9px;
          align-items: center;
          padding: 11px 12px;
          border-radius: 13px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          color: #dbeafe;
          font-size: 12px;
          font-weight: 700;
        }

        .highlight-item svg {
          color: var(--gold);
        }

        .about-soft-section {
          padding: 95px 0;
          background:
            linear-gradient(
              180deg,
              #f8fafc 0%,
              #eef4fb 100%
            );
        }

        .section-description {
          max-width: 700px;
          margin-top: 16px;
          color: #64748b;
          font-size: 15px;
          line-height: 1.8;
        }

        .about-highlight-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-top: 40px;
        }

        .about-feature-card {
          position: relative;
          overflow: hidden;
          padding: 25px;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          background: white;
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.04);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .about-feature-card:hover {
          transform: translateY(-6px);
          border-color: #bfdbfe;
          box-shadow: 0 20px 40px rgba(15, 61, 145, 0.09);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #eff6ff;
          color: var(--blue);
        }

        .about-feature-card h3 {
          margin-top: 17px;
          color: var(--navy);
          font-size: 18px;
          font-weight: 900;
        }

        .about-feature-card p {
          margin-top: 9px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.75;
        }

        .feature-line {
          width: 55px;
          height: 3px;
          margin-top: 20px;
          border-radius: 99px;
          background: var(--gold);
        }

        .vision-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-top: 40px;
        }

        .about-info-card {
          padding: 26px;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          background: white;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .about-info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.07);
        }

        .about-info-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #fff7df;
          color: #a16207;
        }

        .about-info-card h3 {
          margin-top: 18px;
          color: var(--navy);
          font-size: 20px;
          font-weight: 900;
        }

        .about-info-card p {
          margin-top: 10px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.8;
        }

        .about-values-section {
          padding: 95px 0;
          color: white;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(59, 130, 246, 0.18),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #071b40,
              #103f88
            );
        }

        .values-layout {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 65px;
          align-items: center;
        }

        .section-eyebrow.light {
          color: #f6d66f;
        }

        .values-title {
          max-width: 500px;
          margin-top: 11px;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .values-description {
          max-width: 500px;
          margin-top: 16px;
          color: #bfdbfe;
          font-size: 15px;
          line-height: 1.8;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .value-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 13px 14px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.05);
          color: #dbeafe;
          font-size: 12px;
          font-weight: 700;
          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .value-item:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.09);
        }

        .value-item svg {
          flex-shrink: 0;
          color: #34d399;
        }

        .about-bca-card {
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          border-radius: 28px;
          background: #071b40;
          box-shadow: 0 25px 65px rgba(15, 23, 42, 0.12);
        }

        .bca-content {
          padding: 42px;
          color: white;
        }

        .bca-content h2 {
          margin-top: 10px;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.06;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .bca-content p {
          max-width: 600px;
          margin-top: 16px;
          color: #bfdbfe;
          font-size: 14px;
          line-height: 1.8;
        }

        .bca-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 24px;
          color: var(--gold);
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .bca-visual {
          position: relative;
          min-height: 330px;
          overflow: hidden;
          display: grid;
          place-items: center;
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

        .bca-circle {
          position: absolute;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 50%;
          animation: aboutRotate 18s linear infinite;
        }

        .bca-circle-one {
          width: 240px;
          height: 240px;
        }

        .bca-circle-two {
          width: 320px;
          height: 320px;
          animation-direction: reverse;
          animation-duration: 24s;
        }

        .bca-center {
          position: relative;
          z-index: 2;
          width: 170px;
          height: 170px;
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

        .about-cta {
          padding: 75px 0;
          color: white;
          background: #071b40;
        }

        .about-cta-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 35px;
        }

        .about-cta h2 {
          margin-top: 10px;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .about-cta p {
          max-width: 600px;
          margin-top: 12px;
          color: #bfdbfe;
          font-size: 14px;
          line-height: 1.75;
        }

        .about-cta-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          flex-shrink: 0;
        }

        .about-cta-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 13px;
          padding: 13px 18px;
          color: white;
          background: rgba(255, 255, 255, 0.06);
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        @keyframes aboutReveal {
          from {
            opacity: 0;
            transform: translateY(22px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes aboutPulse {
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

        @keyframes aboutFloatOne {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(-30px, 25px) scale(1.08);
          }
        }

        @keyframes aboutFloatTwo {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(25px, -20px) scale(1.08);
          }
        }

        @keyframes aboutRotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1024px) {
          .about-intro-grid,
          .values-layout,
          .about-bca-card {
            grid-template-columns: 1fr;
          }

          .about-highlight-grid,
          .vision-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .about-bca-card {
            grid-template-columns: 1fr;
          }

          .bca-visual {
            min-height: 300px;
          }

          .about-cta-content {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .about-title {
            font-size: 40px;
          }

          .about-lead {
            font-size: 15px;
          }

          .about-stats {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .about-stat,
          .about-stat + .about-stat {
            padding: 0;
            border: 0;
          }

          .about-highlight-grid,
          .vision-grid,
          .values-grid {
            grid-template-columns: 1fr;
          }

          .bca-content {
            padding: 28px;
          }

          .bca-visual {
            min-height: 270px;
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

function Stat({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="about-stat">
      <div className="about-stat-number">
        {number}
      </div>

      <div className="about-stat-label">
        {label}
      </div>
    </div>
  );
}

function HighlightItem({
  text,
}: {
  text: string;
}) {
  return (
    <div className="highlight-item">
      <CheckCircle2 className="h-4 w-4" />
      {text}
    </div>
  );
}

function Info({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Eye;
  title: string;
  text: string;
}) {
  return (
    <div className="about-info-card">
      <div className="about-info-icon">
        <Icon className="h-5 w-5" />
      </div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}
