"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Database,
  GraduationCap,
  Laptop,
  Layers3,
  Monitor,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import PublicShell from "@/components/public/PublicShell";

const bcaSkills = [
  "Programming fundamentals",
  "Object-oriented programming",
  "Database management",
  "Web development",
  "Computer networks",
  "Software engineering",
  "Problem solving",
  "Project development",
];

const careerPaths = [
  {
    icon: Code2,
    title: "Software Developer",
    text: "Develop applications, websites and software solutions using programming skills.",
    tone: "blue",
  },
  {
    icon: Laptop,
    title: "Web Developer",
    text: "Build responsive websites and modern web applications for businesses and organizations.",
    tone: "purple",
  },
  {
    icon: Database,
    title: "Database Professional",
    text: "Work with data, SQL, database systems and information management.",
    tone: "gold",
  },
  {
    icon: Monitor,
    title: "IT Support",
    text: "Support computer systems, applications, users and technology infrastructure.",
    tone: "green",
  },
  {
    icon: Network,
    title: "Network & Systems",
    text: "Develop a foundation for computer networks, operating systems and system administration.",
    tone: "cyan",
  },
  {
    icon: Rocket,
    title: "Technology Entrepreneur",
    text: "Use technical knowledge to develop products, services and digital solutions.",
    tone: "rose",
  },
];

const learningStages = [
  {
    number: "01",
    title: "Foundation",
    text: "Build strong fundamentals in computers, mathematics, programming and communication.",
  },
  {
    number: "02",
    title: "Technology",
    text: "Progress into databases, web technologies, software systems and application development.",
  },
  {
    number: "03",
    title: "Practical Work",
    text: "Apply learning through assignments, practical activities and project-oriented work.",
  },
  {
    number: "04",
    title: "Career Readiness",
    text: "Develop technical confidence, project experience and professional problem-solving skills.",
  },
];

const stats = [
  {
    number: "BCA",
    label: "Computer Applications",
  },
  {
    number: "6",
    label: "Academic Semesters",
  },
  {
    number: "∞",
    label: "Learning Opportunities",
  },
];

export default function AboutPage() {
  return (
    <PublicShell>
      <main className="premium-about">

        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="about-premium-hero">

          <div className="about-hero-grid" />
          <div className="about-hero-glow glow-blue" />
          <div className="about-hero-glow glow-purple" />
          <div className="about-hero-glow glow-gold" />

          <div className="about-particle particle-1" />
          <div className="about-particle particle-2" />
          <div className="about-particle particle-3" />
          <div className="about-particle particle-4" />
          <div className="about-particle particle-5" />

          <div className="container-page relative z-10 py-20 sm:py-24 lg:py-28">

            <div className="about-hero-layout">

              {/* HERO COPY */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >

                <div className="about-premium-pill">
                  <span className="premium-live-dot" />
                  <Sparkles className="h-3.5 w-3.5" />
                  THE NATIONAL DEGREE COLLEGE • BAGEPALLI
                </div>

                <div className="about-hero-label">
                  ABOUT • DIGITAL CAMPUS • BCA
                </div>

                <h1 className="about-premium-title">
                  Learning with purpose.
                  <span> Growing with technology.</span>
                </h1>

                <p className="about-premium-description">
                  The National Degree College, Bagepalli is building
                  a modern academic environment where students can
                  develop knowledge, practical computer skills,
                  confidence and the ability to solve real-world
                  problems.
                </p>

                <div className="about-hero-actions">

                  <Link
                    href="/courses/bca"
                    className="about-primary-button"
                  >
                    Explore BCA
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/contact"
                    className="about-secondary-button"
                  >
                    Contact College
                  </Link>

                </div>

                <div className="about-trust-row">

                  <TrustBadge
                    icon={ShieldCheck}
                    text="Secure digital campus"
                  />

                  <TrustBadge
                    icon={GraduationCap}
                    text="Student focused"
                  />

                  <TrustBadge
                    icon={Sparkles}
                    text="Modern learning"
                  />

                </div>

              </motion.div>

              {/* HERO VISUAL */}
              <motion.div
                className="about-hero-visual"
                initial={{
                  opacity: 0,
                  x: 40,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >

                <div className="hero-image-orbit orbit-a" />
                <div className="hero-image-orbit orbit-b" />

                <div className="about-main-image-card">

                  <div className="about-main-image">
                    <img
                      src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1100&q=85"
                      alt="Computer technology and programming workspace"
                      loading="eager"
                    />

                    <div className="image-overlay" />

                    <div className="image-floating-label">
                      <Code2 className="h-4 w-4" />
                      <span>COMPUTING • PROGRAMMING • TECHNOLOGY</span>
                    </div>
                  </div>

                  <div className="image-card-bottom">

                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                        BCA Programme
                      </div>

                      <div className="mt-1 text-2xl font-black text-[var(--navy)]">
                        BUILD YOUR DIGITAL FUTURE
                      </div>
                    </div>

                    <div className="image-card-icon">
                      <Laptop className="h-5 w-5" />
                    </div>

                  </div>

                </div>

                <FloatingStat
                  className="floating-stat-top"
                  icon={GraduationCap}
                  value="BCA"
                  label="Academic pathway"
                />

                <FloatingStat
                  className="floating-stat-bottom"
                  icon={Rocket}
                  value="CAREER"
                  label="Future focused"
                />

              </motion.div>
            </div>

            {/* HERO STATS */}
            <div className="about-stats-row">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="about-stat-item"
                  initial={{
                    opacity: 0,
                    y: 18,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.45 + index * 0.08,
                  }}
                >
                  <div className="about-stat-number">
                    {stat.number}
                  </div>

                  <div className="about-stat-label">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* =====================================================
            INTRO
        ====================================================== */}
        <section className="section-space bg-white">
          <div className="container-page">

            <div className="about-intro-layout">

              <RevealBlock>

                <div className="section-eyebrow">
                  OUR ACADEMIC APPROACH
                </div>

                <h2 className="about-section-title">
                  A modern academic environment built for
                  <span> tomorrow's opportunities.</span>
                </h2>

                <p className="about-section-text">
                  Education is more than completing a syllabus.
                  It is about developing curiosity, discipline,
                  communication, technical ability and confidence.
                </p>

                <p className="about-section-text">
                  The digital campus connects important college
                  information with an accessible online experience,
                  while the BCA programme creates a pathway into
                  programming, databases, web technologies,
                  software development and practical computing.
                </p>

              </RevealBlock>

              <RevealBlock delay={0.12}>
                <div className="about-intro-image-card">

                  <div className="intro-image-wrap">
                    <img
                      src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=85"
                      alt="Students collaborating around technology"
                      loading="lazy"
                    />

                    <div className="intro-image-overlay" />
                  </div>

                  <div className="intro-image-content">

                    <div className="intro-icon">
                      <Users className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.15em] text-blue-200">
                        Student Experience
                      </div>

                      <div className="mt-1 text-xl font-black text-white">
                        Learn together. Build together.
                      </div>
                    </div>

                  </div>
                </div>
              </RevealBlock>

            </div>
          </div>
        </section>

        {/* =====================================================
            BCA FEATURE SECTION
        ====================================================== */}
        <section className="about-tech-section">

          <div className="container-page">

            <RevealBlock>

              <div className="max-w-3xl">

                <div className="section-eyebrow light">
                  WHY BCA
                </div>

                <h2 className="about-dark-title">
                  Learn the technologies behind the digital world.
                </h2>

                <p className="about-dark-text">
                  BCA can provide a strong foundation for students
                  who want to understand how software, websites,
                  databases and computer systems are designed and
                  built.
                </p>

              </div>

            </RevealBlock>

            <div className="tech-feature-grid">

              <TechFeature
                icon={Code2}
                title="Programming"
                text="Develop logical thinking and write programs that solve real problems."
                tone="blue"
              />

              <TechFeature
                icon={Database}
                title="Databases"
                text="Learn how information is stored, managed, queried and organized."
                tone="purple"
              />

              <TechFeature
                icon={Laptop}
                title="Web Technology"
                text="Build knowledge of websites, interfaces and modern web applications."
                tone="gold"
              />

              <TechFeature
                icon={Layers3}
                title="Software Engineering"
                text="Understand how software is planned, developed, tested and maintained."
                tone="green"
              />

            </div>
          </div>
        </section>

        {/* =====================================================
            SKILLS
        ====================================================== */}
        <section className="section-space bg-white">

          <div className="container-page">

            <div className="skills-layout">

              <RevealBlock>

                <div className="section-eyebrow">
                  SKILLS YOU CAN DEVELOP
                </div>

                <h2 className="about-section-title">
                  Turn classroom learning into
                  <span> practical capability.</span>
                </h2>

                <p className="about-section-text">
                  A balanced BCA education can help students
                  develop technical knowledge together with
                  problem-solving and project skills.
                </p>

                <div className="skills-list">
                  {bcaSkills.map((skill) => (
                    <div
                      key={skill}
                      className="skill-check"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {skill}
                    </div>
                  ))}
                </div>

              </RevealBlock>

              <RevealBlock delay={0.14}>
                <div className="skills-image-card">

                  <div className="skills-image">
                    <img
                      src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1100&q=85"
                      alt="Laptop showing software development and coding"
                      loading="lazy"
                    />

                    <div className="skills-image-overlay" />

                    <div className="code-window">
                      <div className="code-window-top">
                        <span />
                        <span />
                        <span />
                      </div>

                      <div className="code-lines">
                        <div className="code-line short" />
                        <div className="code-line long" />
                        <div className="code-line medium" />
                        <div className="code-line long" />
                        <div className="code-line short" />
                        <div className="code-line medium" />
                      </div>
                    </div>

                  </div>

                </div>
              </RevealBlock>

            </div>
          </div>
        </section>

        {/* =====================================================
            LEARNING JOURNEY
        ====================================================== */}
        <section className="about-journey-section">

          <div className="container-page">

            <RevealBlock>

              <div className="text-center">

                <div className="section-eyebrow">
                  LEARNING JOURNEY
                </div>

                <h2 className="about-section-title center">
                  From fundamentals to future-ready skills.
                </h2>

                <p className="about-section-text center">
                  A progressive academic path can help students
                  move from computing basics toward practical
                  development and career readiness.
                </p>

              </div>

            </RevealBlock>

            <div className="journey-grid">

              {learningStages.map(
                (stage, index) => (
                  <RevealBlock
                    key={stage.number}
                    delay={index * 0.08}
                  >
                    <div className="journey-card">

                      <div className="journey-number">
                        {stage.number}
                      </div>

                      <div className="journey-content">

                        <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--blue)]">
                          Stage {stage.number}
                        </div>

                        <h3>{stage.title}</h3>

                        <p>
                          {stage.text}
                        </p>

                      </div>
                    </div>
                  </RevealBlock>
                )
              )}

            </div>
          </div>
        </section>

        {/* =====================================================
            CAREER OPPORTUNITIES
        ====================================================== */}
        <section className="section-space bg-white">

          <div className="container-page">

            <RevealBlock>

              <div className="max-w-3xl">

                <div className="section-eyebrow">
                  CAREER PATHWAYS
                </div>

                <h2 className="about-section-title">
                  Where can BCA take you?
                </h2>

                <p className="about-section-text">
                  Depending on your skills, projects,
                  experience and further studies, BCA can open
                  several technology-oriented career directions.
                </p>

              </div>

            </RevealBlock>

            <div className="career-grid">

              {careerPaths.map(
                (career, index) => (
                  <RevealBlock
                    key={career.title}
                    delay={index * 0.06}
                  >
                    <CareerCard
                      icon={career.icon}
                      title={career.title}
                      text={career.text}
                      tone={career.tone}
                    />
                  </RevealBlock>
                )
              )}

            </div>

            <div className="career-note">

              <div className="career-note-icon">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

              <div>
                <div className="career-note-title">
                  Career growth depends on skills.
                </div>

                <p>
                  Build projects, strengthen programming,
                  improve communication, gain practical
                  experience and continue learning to increase
                  your opportunities.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            SECOND VISUAL
        ====================================================== */}
        <section className="about-visual-section">

          <div className="container-page">

            <div className="big-visual-card">

              <div className="big-visual-image">

                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=85"
                  alt="Students learning and collaborating with technology"
                  loading="lazy"
                />

                <div className="big-visual-overlay" />

                <div className="big-visual-content">

                  <div className="section-eyebrow light">
                    THE DIGITAL FUTURE
                  </div>

                  <h2>
                    LEARN WITH PURPOSE.
                    <br />
                    BUILD WITH TECHNOLOGY.
                  </h2>

                  <p>
                    Computer applications are changing the way
                    organisations learn, communicate and work.
                    Build the knowledge to be part of that future.
                  </p>

                  <Link
                    href="/courses/bca"
                    className="about-primary-button"
                  >
                    Explore BCA Programme
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}
        <section className="about-final-cta">

          <div className="cta-orb orb-one" />
          <div className="cta-orb orb-two" />

          <div className="container-page relative z-10">

            <RevealBlock>

              <div className="about-cta-inner">

                <div>

                  <div className="section-eyebrow light">
                    DISCOVER MORE
                  </div>

                  <h2>
                    Your college.
                    <span> Your skills.</span>
                    <br />
                    Your future.
                  </h2>

                  <p>
                    Explore the BCA programme, discover academic
                    information and connect with the college.
                  </p>

                </div>

                <div className="about-cta-actions">

                  <Link
                    href="/courses/bca"
                    className="about-primary-button"
                  >
                    Explore BCA
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/contact"
                    className="about-cta-secondary"
                  >
                    Contact College
                  </Link>

                </div>

              </div>

            </RevealBlock>

          </div>
        </section>

      </main>

      <style jsx global>{`
        .premium-about {
          overflow: hidden;
          background: #f8fafc;
        }

        /* ==================================================
           HERO
        ================================================== */

        .about-premium-hero {
          position: relative;
          overflow: hidden;
          color: white;
          background:
            radial-gradient(
              circle at 15% 20%,
              rgba(59, 130, 246, 0.20),
              transparent 25%
            ),
            radial-gradient(
              circle at 82% 10%,
              rgba(139, 92, 246, 0.20),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #061631 0%,
              #0b2860 45%,
              #174da1 100%
            );
        }

        .about-premium-hero::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background:
            linear-gradient(
              90deg,
              #2563eb,
              #7c3aed,
              #ec4899,
              #eab308,
              #2563eb
            );
          background-size: 300% 100%;
          animation: premiumGradient 8s linear infinite;
        }

        .about-hero-grid {
          position: absolute;
          inset: 0;
          opacity: 0.12;
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
          background-size: 46px 46px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 92%
          );
        }

        .about-hero-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
        }

        .glow-blue {
          width: 420px;
          height: 420px;
          right: -140px;
          top: -140px;
          background: rgba(59, 130, 246, 0.24);
          animation: glowFloatA 9s ease-in-out infinite;
        }

        .glow-purple {
          width: 320px;
          height: 320px;
          left: -110px;
          bottom: -140px;
          background: rgba(139, 92, 246, 0.14);
          animation: glowFloatB 11s ease-in-out infinite;
        }

        .glow-gold {
          width: 190px;
          height: 190px;
          right: 32%;
          bottom: 10%;
          background: rgba(234, 179, 8, 0.09);
          animation: glowFloatC 7s ease-in-out infinite;
        }

        .about-particle {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          pointer-events: none;
        }

        .particle-1 {
          left: 10%;
          top: 23%;
          background: #60a5fa;
          box-shadow: 0 0 14px rgba(96, 165, 250, 0.8);
          animation: particleOne 5s ease-in-out infinite;
        }

        .particle-2 {
          right: 12%;
          top: 20%;
          background: #c4b5fd;
          box-shadow: 0 0 14px rgba(196, 181, 253, 0.8);
          animation: particleTwo 6s ease-in-out infinite;
        }

        .particle-3 {
          left: 44%;
          top: 12%;
          width: 4px;
          height: 4px;
          background: #f6d66f;
          box-shadow: 0 0 14px rgba(246, 214, 111, 0.8);
          animation: particleThree 4s ease-in-out infinite;
        }

        .particle-4 {
          right: 38%;
          bottom: 15%;
          width: 6px;
          height: 6px;
          background: #34d399;
          box-shadow: 0 0 15px rgba(52, 211, 153, 0.8);
          animation: particleFour 7s ease-in-out infinite;
        }

        .particle-5 {
          left: 26%;
          bottom: 12%;
          width: 3px;
          height: 3px;
          background: #f472b6;
          box-shadow: 0 0 12px rgba(244, 114, 182, 0.8);
          animation: particleFive 5s ease-in-out infinite;
        }

        .about-hero-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(400px, 0.9fr);
          gap: 70px;
          align-items: center;
        }

        .about-premium-pill {
          width: max-content;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          color: #dbeafe;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .premium-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow:
            0 0 14px rgba(52, 211, 153, 0.85);
          animation: statusPulse 2s ease-in-out infinite;
        }

        .about-hero-label {
          margin-top: 22px;
          color: #93c5fd;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        .about-premium-title {
          max-width: 850px;
          margin-top: 15px;
          font-size: clamp(46px, 6vw, 78px);
          line-height: 0.98;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .about-premium-title span {
          display: block;
          color: #f6d66f;
        }

        .about-premium-description {
          max-width: 720px;
          margin-top: 24px;
          color: rgba(219, 234, 254, 0.84);
          font-size: 17px;
          line-height: 1.85;
        }

        .about-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 30px;
        }

        .about-primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 18px;
          border-radius: 13px;
          background: #f6d66f;
          color: #071b40;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          box-shadow:
            0 12px 28px rgba(0, 0, 0, 0.10);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .about-primary-button:hover {
          transform: translateY(-3px);
          box-shadow:
            0 20px 36px rgba(0, 0, 0, 0.15);
        }

        .about-secondary-button {
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
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .about-secondary-button:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.11);
        }

        .about-trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 22px;
        }

        .trust-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #bfdbfe;
          font-size: 10px;
          font-weight: 700;
        }

        .trust-badge svg {
          color: #f6d66f;
        }

        /* HERO VISUAL */

        .about-hero-visual {
          position: relative;
          min-height: 520px;
          display: grid;
          place-items: center;
        }

        .hero-image-orbit {
          position: absolute;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 50%;
          animation: orbitRotate 20s linear infinite;
        }

        .orbit-a {
          width: 430px;
          height: 430px;
        }

        .orbit-b {
          width: 310px;
          height: 310px;
          animation-duration: 27s;
          animation-direction: reverse;
        }

        .about-main-image-card {
          position: relative;
          z-index: 3;
          width: min(100%, 490px);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 30px;
          background: white;
          box-shadow:
            0 35px 90px rgba(0, 0, 0, 0.24);
          transform: rotate(1deg);
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease;
        }

        .about-main-image-card:hover {
          transform: rotate(0deg) translateY(-5px);
          box-shadow:
            0 45px 100px rgba(0, 0, 0, 0.28);
        }

        .about-main-image {
          position: relative;
          height: 315px;
          overflow: hidden;
        }

        .about-main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition:
            transform 0.7s cubic-bezier(.16,1,.3,1);
        }

        .about-main-image-card:hover img {
          transform: scale(1.06);
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              to top,
              rgba(7, 27, 64, 0.72),
              transparent 55%
            );
        }

        .image-floating-label {
          position: absolute;
          left: 18px;
          bottom: 18px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 11px;
          border-radius: 11px;
          background: rgba(7, 27, 64, 0.75);
          color: white;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          backdrop-filter: blur(8px);
        }

        .image-floating-label svg {
          color: #f6d66f;
        }

        .image-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px;
        }

        .image-card-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #eff6ff;
          color: var(--blue);
        }

        .floating-stat {
          position: absolute;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 13px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 14px;
          background: rgba(7, 27, 64, 0.75);
          box-shadow:
            0 15px 35px rgba(0, 0, 0, 0.18);
          backdrop-filter: blur(13px);
          color: white;
          animation: floatingCard 5s ease-in-out infinite;
        }

        .floating-stat-top {
          top: 24px;
          right: -8px;
        }

        .floating-stat-bottom {
          left: -10px;
          bottom: 25px;
          animation-delay: 0.8s;
        }

        .floating-stat-icon {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          color: #f6d66f;
        }

        .floating-stat-value {
          font-size: 11px;
          font-weight: 950;
        }

        .floating-stat-label {
          margin-top: 2px;
          color: #93c5fd;
          font-size: 8px;
        }

        .about-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          max-width: 720px;
          margin-top: 50px;
          padding-top: 23px;
          border-top: 1px solid rgba(255, 255, 255, 0.11);
        }

        .about-stat-item {
          padding-right: 18px;
        }

        .about-stat-item + .about-stat-item {
          padding-left: 18px;
          border-left: 1px solid rgba(255, 255, 255, 0.10);
        }

        .about-stat-number {
          color: white;
          font-size: 25px;
          font-weight: 950;
        }

        .about-stat-label {
          margin-top: 3px;
          color: #93c5fd;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* ==================================================
           STANDARD SECTIONS
        ================================================== */

        .section-eyebrow {
          color: var(--blue);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .section-eyebrow.light {
          color: #f6d66f;
        }

        .about-intro-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(360px, 0.9fr);
          gap: 65px;
          align-items: center;
        }

        .about-section-title {
          max-width: 760px;
          margin-top: 10px;
          color: var(--navy);
          font-size: clamp(31px, 4vw, 50px);
          line-height: 1.05;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .about-section-title span {
          color: var(--blue);
        }

        .about-section-title.center,
        .about-section-text.center {
          margin-left: auto;
          margin-right: auto;
        }

        .about-section-text {
          max-width: 700px;
          margin-top: 17px;
          color: #64748b;
          font-size: 15px;
          line-height: 1.85;
        }

        .about-intro-image-card {
          overflow: hidden;
          border-radius: 27px;
          background:
            linear-gradient(
              145deg,
              #071b40,
              #104a9d
            );
          box-shadow:
            0 25px 60px rgba(15, 61, 145, 0.16);
        }

        .intro-image-wrap {
          height: 275px;
          overflow: hidden;
        }

        .intro-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition:
            transform 0.7s cubic-bezier(.16,1,.3,1);
        }

        .about-intro-image-card:hover img {
          transform: scale(1.06);
        }

        .intro-image-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              to top,
              rgba(7, 27, 64, 0.65),
              transparent
            );
        }

        .intro-image-wrap {
          position: relative;
        }

        .intro-image-content {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          color: white;
        }

        .intro-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.09);
          color: #f6d66f;
        }

        /* ==================================================
           TECH SECTION
        ================================================== */

        .about-tech-section {
          padding: 100px 0;
          color: white;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(59, 130, 246, 0.19),
              transparent 28%
            ),
            radial-gradient(
              circle at 10% 80%,
              rgba(139, 92, 246, 0.12),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #071b40,
              #103f88
            );
        }

        .about-dark-title {
          max-width: 720px;
          margin-top: 10px;
          font-size: clamp(31px, 4vw, 50px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .about-dark-text {
          max-width: 700px;
          margin-top: 17px;
          color: #bfdbfe;
          font-size: 15px;
          line-height: 1.85;
        }

        .tech-feature-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-top: 40px;
        }

        .tech-feature {
          position: relative;
          overflow: hidden;
          padding: 23px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 21px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          transition:
            transform 0.25s ease,
            background 0.25s ease,
            box-shadow 0.25s ease;
        }

        .tech-feature:hover {
          transform: translateY(-7px);
          background: rgba(255, 255, 255, 0.08);
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .tech-feature-icon {
          width: 47px;
          height: 47px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
        }

        .tech-blue .tech-feature-icon {
          color: #60a5fa;
        }

        .tech-purple .tech-feature-icon {
          color: #c4b5fd;
        }

        .tech-gold .tech-feature-icon {
          color: #f6d66f;
        }

        .tech-green .tech-feature-icon {
          color: #6ee7b7;
        }

        .tech-feature h3 {
          margin-top: 16px;
          color: white;
          font-size: 17px;
          font-weight: 900;
        }

        .tech-feature p {
          margin-top: 8px;
          color: #bfdbfe;
          font-size: 12px;
          line-height: 1.75;
        }

        .tech-feature-line {
          width: 50px;
          height: 3px;
          margin-top: 18px;
          border-radius: 999px;
          background: #f6d66f;
        }

        /* ==================================================
           SKILLS
        ================================================== */

        .skills-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(360px, 0.9fr);
          gap: 60px;
          align-items: center;
        }

        .skills-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 28px;
        }

        .skill-check {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 13px;
          background: #f8fafc;
          color: #334155;
          font-size: 11px;
          font-weight: 800;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease;
        }

        .skill-check:hover {
          transform: translateY(-2px);
          border-color: #bfdbfe;
        }

        .skill-check svg {
          color: #16a34a;
          flex-shrink: 0;
        }

        .skills-image-card {
          overflow: hidden;
          border-radius: 27px;
          background: #071b40;
          box-shadow:
            0 25px 55px rgba(15, 23, 42, 0.13);
        }

        .skills-image {
          position: relative;
          height: 390px;
          overflow: hidden;
        }

        .skills-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition:
            transform 0.8s cubic-bezier(.16,1,.3,1);
        }

        .skills-image-card:hover img {
          transform: scale(1.05);
        }

        .skills-image-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              140deg,
              rgba(7, 27, 64, 0.18),
              rgba(7, 27, 64, 0.76)
            );
        }

        .code-window {
          position: absolute;
          right: 24px;
          bottom: 24px;
          width: 210px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 15px;
          background: rgba(7, 27, 64, 0.79);
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.23);
          backdrop-filter: blur(10px);
        }

        .code-window-top {
          display: flex;
          gap: 5px;
          padding: 9px 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .code-window-top span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.28);
        }

        .code-lines {
          display: grid;
          gap: 7px;
          padding: 13px;
        }

        .code-line {
          height: 4px;
          border-radius: 999px;
          background:
            linear-gradient(
              90deg,
              rgba(96, 165, 250, 0.85),
              rgba(196, 181, 253, 0.60)
            );
          animation: codePulse 3s ease-in-out infinite;
        }

        .code-line.short {
          width: 38%;
        }

        .code-line.medium {
          width: 65%;
        }

        .code-line.long {
          width: 88%;
        }

        .code-line:nth-child(2) {
          animation-delay: 0.3s;
        }

        .code-line:nth-child(3) {
          animation-delay: 0.5s;
        }

        .code-line:nth-child(4) {
          animation-delay: 0.7s;
        }

        .code-line:nth-child(5) {
          animation-delay: 0.9s;
        }

        .code-line:nth-child(6) {
          animation-delay: 1.1s;
        }

        /* ==================================================
           JOURNEY
        ================================================== */

        .about-journey-section {
          padding: 100px 0;
          background:
            linear-gradient(
              180deg,
              #f8fafc,
              #edf4ff
            );
        }

        .journey-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-top: 42px;
        }

        .journey-card {
          height: 100%;
          padding: 24px;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          background: white;
          box-shadow:
            0 8px 25px rgba(15, 23, 42, 0.04);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .journey-card:hover {
          transform: translateY(-6px);
          box-shadow:
            0 20px 40px rgba(15, 61, 145, 0.09);
        }

        .journey-number {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background:
            linear-gradient(
              135deg,
              #eff6ff,
              #f5f3ff
            );
          color: var(--blue);
          font-size: 11px;
          font-weight: 950;
        }

        .journey-content h3 {
          margin-top: 16px;
          color: var(--navy);
          font-size: 18px;
          font-weight: 900;
        }

        .journey-content p {
          margin-top: 8px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.75;
        }

        /* ==================================================
           CAREER
        ================================================== */

        .career-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 42px;
        }

        .career-card {
          height: 100%;
          padding: 23px;
          border: 1px solid #e2e8f0;
          border-radius: 21px;
          background: white;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .career-card:hover {
          transform: translateY(-6px);
          border-color: #bfdbfe;
          box-shadow:
            0 20px 40px rgba(15, 61, 145, 0.09);
        }

        .career-icon {
          width: 47px;
          height: 47px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #eff6ff;
          color: var(--blue);
        }

        .career-blue .career-icon {
          color: #2563eb;
          background: #eff6ff;
        }

        .career-purple .career-icon {
          color: #7c3aed;
          background: #f5f3ff;
        }

        .career-gold .career-icon {
          color: #b45309;
          background: #fffbeb;
        }

        .career-green .career-icon {
          color: #059669;
          background: #ecfdf5;
        }

        .career-cyan .career-icon {
          color: #0891b2;
          background: #ecfeff;
        }

        .career-rose .career-icon {
          color: #db2777;
          background: #fdf2f8;
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

        .career-note {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-top: 22px;
          padding: 17px;
          border: 1px solid #bfdbfe;
          border-radius: 17px;
          background:
            linear-gradient(
              135deg,
              #eff6ff,
              #f5f3ff
            );
        }

        .career-note-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 12px;
          background: white;
          color: var(--blue);
        }

        .career-note-title {
          color: var(--navy);
          font-size: 13px;
          font-weight: 900;
        }

        .career-note p {
          margin-top: 4px;
          color: #64748b;
          font-size: 11px;
          line-height: 1.7;
        }

        /* ==================================================
           BIG VISUAL
        ================================================== */

        .about-visual-section {
          padding: 90px 0;
          background: #f8fafc;
        }

        .big-visual-card {
          overflow: hidden;
          border-radius: 30px;
          background: #071b40;
          box-shadow:
            0 30px 70px rgba(15, 23, 42, 0.14);
        }

        .big-visual-image {
          position: relative;
          min-height: 460px;
          display: flex;
          align-items: center;
        }

        .big-visual-image img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition:
            transform 1s cubic-bezier(.16,1,.3,1);
        }

        .big-visual-card:hover img {
          transform: scale(1.035);
        }

        .big-visual-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(7, 27, 64, 0.92) 0%,
              rgba(7, 27, 64, 0.70) 48%,
              rgba(7, 27, 64, 0.20) 100%
            );
        }

        .big-visual-content {
          position: relative;
          z-index: 2;
          max-width: 680px;
          padding: 55px;
        }

        .big-visual-content h2 {
          margin-top: 10px;
          color: white;
          font-size: clamp(35px, 5vw, 58px);
          line-height: 1.02;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .big-visual-content p {
          max-width: 620px;
          margin-top: 17px;
          color: #bfdbfe;
          font-size: 14px;
          line-height: 1.8;
        }

        .big-visual-content .about-primary-button {
          margin-top: 25px;
        }

        /* ==================================================
           CTA
        ================================================== */

        .about-final-cta {
          position: relative;
          overflow: hidden;
          padding: 80px 0;
          color: white;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(59, 130, 246, 0.20),
              transparent 30%
            ),
            radial-gradient(
              circle at 12% 85%,
              rgba(139, 92, 246, 0.13),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #061632,
              #103f88
            );
        }

        .cta-orb {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.10);
          pointer-events: none;
        }

        .orb-one {
          width: 330px;
          height: 330px;
          right: -110px;
          bottom: -150px;
          animation:
            orbitRotate
            22s
            linear
            infinite;
        }

        .orb-two {
          width: 220px;
          height: 220px;
          left: -80px;
          top: -100px;
          animation:
            orbitRotateReverse
            17s
            linear
            infinite;
        }

        .about-cta-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 35px;
        }

        .about-cta-inner h2 {
          max-width: 720px;
          margin-top: 10px;
          color: white;
          font-size: clamp(34px, 4vw, 54px);
          line-height: 1.04;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .about-cta-inner h2 span {
          color: #f6d66f;
        }

        .about-cta-inner p {
          max-width: 650px;
          margin-top: 14px;
          color: #bfdbfe;
          font-size: 14px;
          line-height: 1.8;
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
          padding: 13px 18px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.06);
          color: white;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        /* ==================================================
           ANIMATIONS
        ================================================== */

        @keyframes premiumGradient {
          0% {
            background-position: 0% 50%;
          }

          50% {
            background-position: 100% 50%;
          }

          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes glowFloatA {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(-35px, 25px)
              scale(1.08);
          }
        }

        @keyframes glowFloatB {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(28px, -20px)
              scale(1.08);
          }
        }

        @keyframes glowFloatC {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(-15px, -15px)
              scale(1.10);
          }
        }

        @keyframes statusPulse {
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

        @keyframes particleOne {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(16px, 12px)
              scale(1.35);
          }
        }

        @keyframes particleTwo {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(-15px, 10px)
              scale(1.3);
          }
        }

        @keyframes particleThree {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(12px);
          }
        }

        @keyframes particleFour {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(11px, -14px)
              scale(1.25);
          }
        }

        @keyframes particleFive {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(18px, -9px)
              scale(1.3);
          }
        }

        @keyframes orbitRotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes orbitRotateReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        @keyframes floatingCard {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-9px);
          }
        }

        @keyframes codePulse {
          0%,
          100% {
            opacity: 0.55;
          }

          50% {
            opacity: 1;
          }
        }

        /* ==================================================
           RESPONSIVE
        ================================================== */

        @media (max-width: 1100px) {
          .about-hero-layout,
          .about-intro-layout,
          .skills-layout {
            grid-template-columns: 1fr;
          }

          .about-hero-visual {
            min-height: 500px;
          }

          .tech-feature-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .journey-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .career-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .about-cta-inner {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 700px) {
          .about-premium-title {
            font-size: 43px;
          }

          .about-premium-description {
            font-size: 15px;
          }

          .about-hero-visual {
            min-height: 400px;
          }

          .orbit-a {
            width: 340px;
            height: 340px;
          }

          .orbit-b {
            width: 245px;
            height: 245px;
          }

          .about-main-image {
            height: 245px;
          }

          .floating-stat-top {
            right: 0;
            top: 10px;
          }

          .floating-stat-bottom {
            left: 0;
            bottom: 12px;
          }

          .about-stats-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .about-stat-item,
          .about-stat-item + .about-stat-item {
            padding: 0;
            border-left: 0;
          }

          .tech-feature-grid,
          .skills-list,
          .journey-grid,
          .career-grid {
            grid-template-columns: 1fr;
          }

          .big-visual-image {
            min-height: 480px;
          }

          .big-visual-overlay {
            background:
              linear-gradient(
                180deg,
                rgba(7, 27, 64, 0.34),
                rgba(7, 27, 64, 0.88)
              );
          }

          .big-visual-content {
            padding: 30px;
          }

          .big-visual-content h2 {
            font-size: 36px;
          }

          .code-window {
            right: 15px;
            bottom: 15px;
            width: 180px;
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

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function RevealBlock({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.18,
      }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function TrustBadge({
  icon: Icon,
  text,
}: {
  icon: typeof ShieldCheck;
  text: string;
}) {
  return (
    <div className="trust-badge">
      <Icon className="h-4 w-4" />
      {text}
    </div>
  );
}

function FloatingStat({
  icon: Icon,
  value,
  label,
  className,
}: {
  icon: typeof GraduationCap;
  value: string;
  label: string;
  className: string;
}) {
  return (
    <div className={`floating-stat ${className}`}>
      <div className="floating-stat-icon">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <div className="floating-stat-value">
          {value}
        </div>

        <div className="floating-stat-label">
          {label}
        </div>
      </div>
    </div>
  );
}

function TechFeature({
  icon: Icon,
  title,
  text,
  tone,
}: {
  icon: typeof Code2;
  title: string;
  text: string;
  tone: "blue" | "purple" | "gold" | "green";
}) {
  return (
    <div className={`tech-feature tech-${tone}`}>
      <div className="tech-feature-icon">
        <Icon className="h-5 w-5" />
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <div className="tech-feature-line" />
    </div>
  );
}

function CareerCard({
  icon: Icon,
  title,
  text,
  tone,
}: {
  icon: typeof Code2;
  title: string;
  text: string;
  tone:
    | "blue"
    | "purple"
    | "gold"
    | "green"
    | "cyan"
    | "rose";
}) {
  return (
    <div className={`career-card career-${tone}`}>
      <div className="career-icon">
        <Icon className="h-5 w-5" />
      </div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}
