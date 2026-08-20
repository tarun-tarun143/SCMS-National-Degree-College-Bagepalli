
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
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
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import PublicShell from "@/components/public/PublicShell";
import { firestoreDb } from "@/lib/firebase/client";
import { useLiveCollection } from "@/hooks/useLiveCollection";

/* =========================================================
   TYPES
========================================================= */

type Course = {
  id: string;
  code?: string;
  name?: string;
  duration?: string;
  description?: string;
  status?: string;
};

type LearningTone =
  | "blue"
  | "purple"
  | "gold"
  | "green";

type LearningAreaItem = {
  icon: typeof Code2;
  title: string;
  description: string;
  tone: LearningTone;
};

type CareerTone =
  | "blue"
  | "purple"
  | "gold"
  | "green"
  | "cyan"
  | "rose";

type CareerPathItem = {
  icon: typeof Code2;
  title: string;
  description: string;
  tone: CareerTone;
};

/* =========================================================
   LEARNING AREAS
========================================================= */

const learningAreas: LearningAreaItem[] = [
  {
    icon: Code2,
    title: "Programming",
    description:
      "Develop logical thinking, programming fundamentals and the ability to turn problems into software solutions.",
    tone: "blue",
  },
  {
    icon: Database,
    title: "Database Systems",
    description:
      "Understand how information is designed, stored, queried and managed using database technologies.",
    tone: "purple",
  },
  {
    icon: Laptop,
    title: "Web Development",
    description:
      "Build knowledge of websites, user interfaces and modern web application development.",
    tone: "gold",
  },
  {
    icon: Network,
    title: "Networks & Systems",
    description:
      "Explore computer networks, operating systems and the foundations of connected computing.",
    tone: "green",
  },
];

/* =========================================================
   CAREER PATHS
========================================================= */

const careerPaths: CareerPathItem[] = [
  {
    icon: Code2,
    title: "Software Developer",
    description:
      "Create and maintain software applications using programming and development skills.",
    tone: "blue",
  },
  {
    icon: Laptop,
    title: "Web Developer",
    description:
      "Design and develop responsive websites and web applications.",
    tone: "purple",
  },
  {
    icon: Database,
    title: "Database Professional",
    description:
      "Work with data, SQL, database systems and information management.",
    tone: "gold",
  },
  {
    icon: Monitor,
    title: "IT Support Specialist",
    description:
      "Help users and organizations maintain computer systems and applications.",
    tone: "green",
  },
  {
    icon: Network,
    title: "Network / Systems Roles",
    description:
      "Build foundations for networking, infrastructure and system administration.",
    tone: "cyan",
  },
  {
    icon: Rocket,
    title: "Technology Entrepreneur",
    description:
      "Use technical and business skills to create digital products and services.",
    tone: "rose",
  },
];

/* =========================================================
   SKILLS
========================================================= */

const skillGroups = [
  "Programming and problem solving",
  "Database and SQL concepts",
  "Web application development",
  "Object-oriented programming",
  "Software engineering",
  "Computer networks",
  "Project development",
  "Professional communication",
];

/* =========================================================
   TEXTBOOK IMAGES
========================================================= */

const textbookImages = [
  {
    title: "Programming in C",
    subtitle: "Programming Foundations",
    image:
      "https://www.tatapublicationsbooks.com/storage/programming-in-c-copy.jpg",
  },
  {
    title: "Computer Fundamentals",
    subtitle: "Computer & Office Automation",
    image:
      "https://www.tppl.org.in/2020/13289-large_default/computer-fundamental-office-automation-.jpg",
  },
  {
    title: "Computers & Programming",
    subtitle: "BCA Foundation",
    image:
      "https://prashantpublications.com/wp-content/uploads/2024/11/BCA-111_Essential-of-Computers-and-Programming_cnvt-1.jpg",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function CoursesPage() {
  const courses = useLiveCollection<Course>(
    firestoreDb,
    "courses",
    {
      limit: 8,
    }
  );

  const activeCourses = courses.data.filter(
    (course) => course.status !== "inactive"
  );

  return (
    <PublicShell>
      <main className="premium-courses">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="courses-premium-hero">
          <div className="courses-grid-bg" />

          <div className="courses-glow courses-glow-blue" />
          <div className="courses-glow courses-glow-purple" />
          <div className="courses-glow courses-glow-gold" />

          <div className="courses-particle cp-1" />
          <div className="courses-particle cp-2" />
          <div className="courses-particle cp-3" />
          <div className="courses-particle cp-4" />
          <div className="courses-particle cp-5" />

          <div className="container-page relative z-10 py-20 sm:py-24 lg:py-28">
            <div className="courses-hero-layout">

              {/* HERO COPY */}

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="courses-premium-pill">
                  <span className="courses-live-dot" />

                  <Sparkles className="h-3.5 w-3.5 text-[var(--gold)]" />

                  Academic Programmes
                </div>

                <div className="courses-hero-label">
                  THE NATIONAL DEGREE COLLEGE • BAGEPALLI
                </div>

                <h1 className="courses-premium-title">
                  Learn technology.
                  <span> Build your future.</span>
                </h1>

                <p className="courses-premium-description">
                  Explore academic pathways designed to build
                  computer knowledge, programming ability,
                  practical skills and career-ready confidence.
                </p>

                <div className="courses-hero-actions">
                  <Link
                    href="/courses/bca"
                    className="courses-primary-button"
                  >
                    Explore BCA
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/contact"
                    className="courses-secondary-button"
                  >
                    Enquire Now
                  </Link>
                </div>

                <div className="courses-trust-row">
                  <TrustItem
                    icon={GraduationCap}
                    text="Academic focused"
                  />

                  <TrustItem
                    icon={Laptop}
                    text="Technology oriented"
                  />

                  <TrustItem
                    icon={Rocket}
                    text="Career minded"
                  />
                </div>
              </motion.div>

              {/* HERO IMAGE */}

              <motion.div
                className="courses-hero-visual"
                initial={{
                  opacity: 0,
                  x: 35,
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
                <div className="courses-orbit orbit-1" />
                <div className="courses-orbit orbit-2" />

                <div className="courses-hero-image-card">
                  <div className="courses-hero-image">
                    <img
                      src="https://cmr.edu.in/blog/wp-content/uploads/2024/11/What-are-the-most-recent-technologies-being-explored-in-the-BCA-program_.webp"
                      alt="Students working in a computer laboratory"
                    />

                    <div className="courses-image-overlay" />

                    <div className="courses-image-badge">
                      <Code2 className="h-4 w-4" />
                      <span>
                        COMPUTING • CODING • PRACTICAL LEARNING
                      </span>
                    </div>
                  </div>

                  <div className="courses-image-footer">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                        BACHELOR OF COMPUTER APPLICATIONS
                      </div>

                      <div className="mt-1 text-xl font-black text-[var(--navy)]">
                        BUILD. CREATE. SOLVE.
                      </div>
                    </div>

                    <div className="courses-image-icon">
                      <Laptop className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <FloatingInfo
                  className="floating-info-top"
                  icon={GraduationCap}
                  value="BCA"
                  label="Computer Applications"
                />

                <FloatingInfo
                  className="floating-info-bottom"
                  icon={Award}
                  value="CAREER"
                  label="Technology pathways"
                />
              </motion.div>
            </div>

            {/* HERO METRICS */}

            <div className="courses-metrics">
              <Metric
                number="6"
                label="Academic semesters"
              />

              <Metric
                number="4+"
                label="Core technology areas"
              />

              <Metric
                number="∞"
                label="Opportunities to build"
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            PROGRAMME INTRO
        ====================================================== */}

        <section className="section-space bg-white">
          <div className="container-page">
            <div className="programme-intro-grid">

              <Reveal>
                <div className="section-eyebrow">
                  BCA PROGRAMME
                </div>

                <h2 className="courses-section-title">
                  A strong foundation for the
                  <span> digital world.</span>
                </h2>

                <p className="courses-section-text">
                  Bachelor of Computer Applications is a
                  technology-focused undergraduate pathway for
                  students interested in computers, programming,
                  software and digital applications.
                </p>

                <p className="courses-section-text">
                  The programme can help students move from basic
                  computer concepts into programming, databases,
                  web technologies, software systems and practical
                  project development.
                </p>

                <div className="programme-actions">
                  <Link
                    href="/courses/bca"
                    className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--blue)]"
                  >
                    View detailed BCA programme
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="programme-side-card">
                  <div className="programme-side-icon">
                    <GraduationCap className="h-6 w-6" />
                  </div>

                  <div className="mt-4 text-[10px] font-black uppercase tracking-[0.16em] text-blue-200">
                    STUDENT JOURNEY
                  </div>

                  <h3>
                    Learn.
                    <br />
                    Practice.
                    <br />
                    Build.
                  </h3>

                  <div className="programme-side-points">
                    <SidePoint
                      number="01"
                      title="Learn"
                      text="Develop core computing knowledge."
                    />

                    <SidePoint
                      number="02"
                      title="Practice"
                      text="Apply concepts through practical work."
                    />

                    <SidePoint
                      number="03"
                      title="Build"
                      text="Create projects and solve problems."
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* =====================================================
            LEARNING AREAS
        ====================================================== */}

        <section className="courses-tech-section">
          <div className="container-page">
            <Reveal>
              <div className="max-w-3xl">
                <div className="section-eyebrow light">
                  WHAT YOU CAN LEARN
                </div>

                <h2 className="courses-dark-title">
                  Technology skills with real-world relevance.
                </h2>

                <p className="courses-dark-text">
                  Build a broad foundation across the areas that
                  support modern software and digital applications.
                </p>
              </div>
            </Reveal>

            <div className="learning-area-grid">
              {learningAreas.map((area, index) => (
                <Reveal
                  key={area.title}
                  delay={index * 0.06}
                >
                  <LearningArea
                    {...area}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            TEXTBOOK SECTION
        ====================================================== */}

        <section className="section-space bg-white">
          <div className="container-page">
            <Reveal>
              <div className="textbook-header">
                <div>
                  <div className="section-eyebrow">
                    LEARNING RESOURCES
                  </div>

                  <h2 className="courses-section-title">
                    Build your foundation,
                    <span> one concept at a time.</span>
                  </h2>

                  <p className="courses-section-text">
                    Computer applications programmes commonly
                    involve programming, computer fundamentals
                    and database-oriented learning. Reference
                    materials can help students strengthen
                    concepts beyond the classroom.
                  </p>
                </div>

                <div className="book-header-badge">
                  <BookOpen className="h-5 w-5" />

                  <span>
                    TEXTBOOKS & REFERENCES
                  </span>
                </div>
              </div>
            </Reveal>

            <div className="textbook-grid">
              {textbookImages.map((book, index) => (
                <Reveal
                  key={book.title}
                  delay={index * 0.08}
                >
                  <div className="textbook-card">
                    <div className="textbook-image-wrap">
                      <img
                        src={book.image}
                        alt={book.title}
                        loading="lazy"
                      />

                      <div className="textbook-image-shine" />

                      <div className="textbook-tag">
                        BCA
                      </div>
                    </div>

                    <div className="textbook-content">
                      <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--blue)]">
                        {book.subtitle}
                      </div>

                      <h3>
                        {book.title}
                      </h3>

                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <BookOpen className="h-3.5 w-3.5" />
                        Academic reference
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="textbook-note">
              <ShieldCheck className="h-4 w-4" />

              <span>
                Textbook examples shown on this page are illustrative.
                Use your college or university prescribed syllabus and
                official reading list for academic requirements.
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            SKILLS
        ====================================================== */}

        <section className="skills-section">
          <div className="container-page">
            <div className="skills-layout">

              <Reveal>
                <div>
                  <div className="section-eyebrow light">
                    SKILLS & OUTCOMES
                  </div>

                  <h2 className="courses-dark-title">
                    Turn academic learning into
                    <span className="gold-text">
                      {" "}practical ability.
                    </span>
                  </h2>

                  <p className="courses-dark-text">
                    A successful technology student continually
                    combines conceptual learning with practice,
                    projects, communication and problem solving.
                  </p>

                  <div className="skills-check-grid">
                    {skillGroups.map((skill) => (
                      <div
                        key={skill}
                        className="skills-check"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="skills-visual-card">
                  <img
                    src="https://www.tatapublicationsbooks.com/storage/programming-in-c-copy.jpg"
                    alt="Programming in C textbook"
                    loading="lazy"
                  />

                  <div className="skills-visual-overlay" />

                  <div className="skills-visual-content">
                    <Code2 className="h-7 w-7 text-[var(--gold)]" />

                    <div className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-blue-200">
                      PROGRAMMING FOUNDATION
                    </div>

                    <div className="mt-1 text-2xl font-black text-white">
                      THINK LIKE A DEVELOPER.
                    </div>

                    <p>
                      Strong programming fundamentals can support
                      further learning across many technology areas.
                    </p>
                  </div>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

        {/* =====================================================
            CAREER PATHS
        ====================================================== */}

        <section className="section-space bg-white">
          <div className="container-page">

            <Reveal>
              <div className="max-w-3xl">
                <div className="section-eyebrow">
                  CAREER PATHWAYS
                </div>

                <h2 className="courses-section-title">
                  What jobs can BCA lead toward?
                </h2>

                <p className="courses-section-text">
                  Career outcomes depend on individual skills,
                  projects, experience, interviews and further
                  learning. A BCA foundation can support several
                  technology-oriented directions.
                </p>
              </div>
            </Reveal>

            <div className="career-grid">
              {careerPaths.map((career, index) => (
                <Reveal
                  key={career.title}
                  delay={index * 0.05}
                >
                  <CareerCard
                    {...career}
                  />
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div className="career-advice-card">
                <div className="career-advice-icon">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>

                <div>
                  <div className="career-advice-title">
                    Build the skills employers actually see.
                  </div>

                  <p>
                    Projects, coding practice, communication,
                    internships, problem solving and a strong
                    portfolio can complement your academic degree.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="career-advice-link"
                >
                  Talk to the college
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* =====================================================
            FUTURE VISUAL
        ====================================================== */}

        <section className="courses-future-section">
          <div className="container-page">
            <div className="future-card">

              <img
                src="https://media.dotdevcloud.com/sbibca/2025/02/bca-program-4.jpg"
                alt="BCA students working in a computer laboratory"
                loading="lazy"
              />

              <div className="future-overlay" />

              <div className="future-content">
                <div className="section-eyebrow light">
                  THE DIGITAL FUTURE
                </div>

                <h2>
                  Learn with purpose.
                  <br />
                  Grow with technology.
                </h2>

                <p>
                  Explore the BCA pathway and discover how
                  computing knowledge can become the foundation
                  for your next opportunity.
                </p>

                <Link
                  href="/courses/bca"
                  className="courses-primary-button"
                >
                  View BCA Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            LIVE COURSES
        ====================================================== */}

        <section className="section-space bg-white">
          <div className="container-page">

            <Reveal>
              <div className="text-center">
                <div className="section-eyebrow">
                  LIVE ACADEMIC DATA
                </div>

                <h2 className="courses-section-title center">
                  Courses published by the college.
                </h2>

                <p className="courses-section-text center">
                  Course information below is loaded from the
                  live campus database.
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {courses.loading && (
                <LiveCourseCard
                  text="Loading courses..."
                />
              )}

              {!courses.loading &&
                !activeCourses.length && (
                  <LiveCourseCard
                    text="No courses published yet."
                  />
                )}

              {activeCourses.map((course, index) => (
                <motion.article
                  key={course.id}
                  className={`live-course-card live-course-${index % 3}`}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.06,
                  }}
                >
                  <div className="live-course-top">
                    <span className="live-course-code">
                      {course.code || "NDC"}
                    </span>

                    <span className="live-course-duration">
                      {course.duration || "Programme"}
                    </span>
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
                    className="live-course-link"
                  >
                    Explore programme
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            CTA
        ====================================================== */}

        <section className="courses-final-cta">
          <div className="final-cta-orb cta-orb-a" />
          <div className="final-cta-orb cta-orb-b" />

          <div className="container-page relative z-10">
            <Reveal>
              <div className="courses-final-inner">

                <div>
                  <div className="section-eyebrow light">
                    START YOUR JOURNEY
                  </div>

                  <h2>
                    Your skills can shape
                    <span> your future.</span>
                  </h2>

                  <p>
                    Explore the BCA programme, understand the
                    learning pathway and contact the college for
                    current admission information.
                  </p>
                </div>

                <div className="courses-final-actions">
                  <Link
                    href="/courses/bca"
                    className="courses-primary-button"
                  >
                    Explore BCA
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/contact"
                    className="courses-outline-button"
                  >
                    Contact College
                  </Link>
                </div>

              </div>
            </Reveal>
          </div>
        </section>

      </main>

      <style jsx global>{`
        .premium-courses {
          overflow: hidden;
          background: #f8fafc;
        }

        .courses-premium-hero {
          position: relative;
          overflow: hidden;
          color: white;
          background:
            radial-gradient(
              circle at 15% 18%,
              rgba(59, 130, 246, 0.19),
              transparent 25%
            ),
            radial-gradient(
              circle at 85% 10%,
              rgba(139, 92, 246, 0.2),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #061631,
              #0c2d69 48%,
              #174fa5
            );
        }

        .courses-premium-hero::before {
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
          animation: movingGradient 8s linear infinite;
        }

        .courses-grid-bg {
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

        .courses-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
        }

        .courses-glow-blue {
          width: 430px;
          height: 430px;
          right: -140px;
          top: -150px;
          background: rgba(59, 130, 246, 0.22);
          animation: glowMoveOne 9s ease-in-out infinite;
        }

        .courses-glow-purple {
          width: 320px;
          height: 320px;
          left: -110px;
          bottom: -130px;
          background: rgba(139, 92, 246, 0.14);
          animation: glowMoveTwo 11s ease-in-out infinite;
        }

        .courses-glow-gold {
          width: 180px;
          height: 180px;
          right: 31%;
          bottom: 9%;
          background: rgba(234, 179, 8, 0.08);
          animation: glowMoveThree 8s ease-in-out infinite;
        }

        .courses-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .cp-1 {
          width: 5px;
          height: 5px;
          left: 10%;
          top: 27%;
          background: #60a5fa;
          box-shadow: 0 0 14px rgba(96, 165, 250, 0.8);
          animation: cpFloatOne 5s ease-in-out infinite;
        }

        .cp-2 {
          width: 4px;
          height: 4px;
          right: 12%;
          top: 23%;
          background: #c4b5fd;
          box-shadow: 0 0 14px rgba(196, 181, 253, 0.8);
          animation: cpFloatTwo 6s ease-in-out infinite;
        }

        .cp-3 {
          width: 4px;
          height: 4px;
          left: 44%;
          top: 11%;
          background: #f6d66f;
          box-shadow: 0 0 13px rgba(246, 214, 111, 0.8);
          animation: cpFloatThree 4s ease-in-out infinite;
        }

        .cp-4 {
          width: 6px;
          height: 6px;
          right: 35%;
          bottom: 14%;
          background: #34d399;
          box-shadow: 0 0 14px rgba(52, 211, 153, 0.8);
          animation: cpFloatFour 7s ease-in-out infinite;
        }

        .cp-5 {
          width: 3px;
          height: 3px;
          left: 26%;
          bottom: 13%;
          background: #f472b6;
          box-shadow: 0 0 12px rgba(244, 114, 182, 0.8);
          animation: cpFloatFive 5s ease-in-out infinite;
        }

        .courses-hero-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(390px, 0.9fr);
          gap: 65px;
          align-items: center;
        }

        .courses-premium-pill {
          width: max-content;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          color: #dbeafe;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .courses-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow:
            0 0 14px rgba(52, 211, 153, 0.85);
          animation: pulseStatus 2s ease-in-out infinite;
        }

        .courses-hero-label {
          margin-top: 22px;
          color: #93c5fd;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        .courses-premium-title {
          max-width: 820px;
          margin-top: 15px;
          font-size: clamp(47px, 6vw, 78px);
          line-height: 0.98;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .courses-premium-title span {
          display: block;
          color: #f6d66f;
        }

        .courses-premium-description {
          max-width: 710px;
          margin-top: 24px;
          color: rgba(219, 234, 254, 0.84);
          font-size: 17px;
          line-height: 1.85;
        }

        .courses-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 30px;
        }

        .courses-primary-button {
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
            0 12px 28px rgba(0, 0, 0, 0.11);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .courses-primary-button:hover {
          transform: translateY(-3px);
          box-shadow:
            0 20px 38px rgba(0, 0, 0, 0.16);
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
        }

        .courses-trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 22px;
        }

        .courses-trust {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #bfdbfe;
          font-size: 10px;
          font-weight: 700;
        }

        .courses-trust svg {
          color: #f6d66f;
        }

        .courses-hero-visual {
          position: relative;
          min-height: 520px;
          display: grid;
          place-items: center;
        }

        .courses-orbit {
          position: absolute;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: orbitSpin 20s linear infinite;
        }

        .orbit-1 {
          width: 430px;
          height: 430px;
        }

        .orbit-2 {
          width: 305px;
          height: 305px;
          animation-duration: 28s;
          animation-direction: reverse;
        }

        .courses-hero-image-card {
          position: relative;
          z-index: 3;
          width: min(100%, 490px);
          overflow: hidden;
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          background: white;
          box-shadow:
            0 35px 90px rgba(0, 0, 0, 0.25);
          transform: rotate(1deg);
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease;
        }

        .courses-hero-image-card:hover {
          transform: rotate(0deg) translateY(-5px);
          box-shadow:
            0 45px 105px rgba(0, 0, 0, 0.29);
        }

        .courses-hero-image {
          position: relative;
          height: 315px;
          overflow: hidden;
        }

        .courses-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition:
            transform 0.8s cubic-bezier(.16,1,.3,1);
        }

        .courses-hero-image-card:hover img {
          transform: scale(1.06);
        }

        .courses-image-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              to top,
              rgba(7, 27, 64, 0.75),
              transparent 55%
            );
        }

        .courses-image-badge {
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

        .courses-image-badge svg {
          color: #f6d66f;
        }

        .courses-image-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px;
        }

        .courses-image-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 13px;
          background: #eff6ff;
          color: var(--blue);
        }

        .floating-info {
          position: absolute;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 13px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 14px;
          background: rgba(7, 27, 64, 0.76);
          color: white;
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(14px);
          animation:
            floatingInfo 5s ease-in-out infinite;
        }

        .floating-info-top {
          top: 25px;
          right: -8px;
        }

        .floating-info-bottom {
          left: -10px;
          bottom: 24px;
          animation-delay: 0.8s;
        }

        .floating-info-icon {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          color: #f6d66f;
        }

        .floating-info-value {
          font-size: 11px;
          font-weight: 950;
        }

        .floating-info-label {
          margin-top: 2px;
          color: #93c5fd;
          font-size: 8px;
        }

        .courses-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          max-width: 750px;
          margin-top: 50px;
          padding-top: 23px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .course-metric {
          padding-right: 18px;
        }

        .course-metric + .course-metric {
          padding-left: 18px;
          border-left: 1px solid rgba(255, 255, 255, 0.09);
        }

        .course-metric-number {
          color: white;
          font-size: 25px;
          font-weight: 950;
        }

        .course-metric-label {
          margin-top: 3px;
          color: #93c5fd;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .programme-intro-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(350px, 0.9fr);
          gap: 60px;
          align-items: center;
        }

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

        .courses-section-title {
          max-width: 760px;
          margin-top: 10px;
          color: var(--navy);
          font-size: clamp(31px, 4vw, 50px);
          line-height: 1.05;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .courses-section-title span {
          color: var(--blue);
        }

        .courses-section-title.center {
          margin-left: auto;
          margin-right: auto;
        }

        .courses-section-text {
          max-width: 700px;
          margin-top: 17px;
          color: #64748b;
          font-size: 15px;
          line-height: 1.85;
        }

        .courses-section-text.center {
          margin-left: auto;
          margin-right: auto;
        }

        .programme-actions {
          margin-top: 25px;
        }

        .programme-side-card {
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
          box-shadow:
            0 25px 60px rgba(15, 61, 145, 0.16);
        }

        .programme-side-icon {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.08);
          color: #f6d66f;
        }

        .programme-side-card h3 {
          max-width: 370px;
          margin-top: 10px;
          font-size: 32px;
          line-height: 1;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .programme-side-points {
          display: grid;
          gap: 9px;
          margin-top: 25px;
        }

        .side-point {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.04);
        }

        .side-point-number {
          width: 33px;
          height: 33px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          color: #f6d66f;
          font-size: 10px;
          font-weight: 950;
        }

        .side-point-title {
          color: white;
          font-size: 11px;
          font-weight: 900;
        }

        .side-point-text {
          margin-top: 2px;
          color: #bfdbfe;
          font-size: 9px;
        }

        .courses-tech-section {
          padding: 100px 0;
          color: white;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(59, 130, 246, 0.2),
              transparent 30%
            ),
            radial-gradient(
              circle at 10% 85%,
              rgba(139, 92, 246, 0.12),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #071b40,
              #103f88
            );
        }

        .courses-dark-title {
          max-width: 760px;
          margin-top: 10px;
          color: white;
          font-size: clamp(31px, 4vw, 50px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .courses-dark-title .gold-text,
        .gold-text {
          color: #f6d66f;
        }

        .courses-dark-text {
          max-width: 700px;
          margin-top: 17px;
          color: #bfdbfe;
          font-size: 15px;
          line-height: 1.85;
        }

        .learning-area-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-top: 40px;
        }

        .learning-area {
          height: 100%;
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

        .learning-area:hover {
          transform: translateY(-7px);
          background: rgba(255, 255, 255, 0.08);
          box-shadow:
            0 20px 45px rgba(0, 0, 0, 0.12);
        }

        .learning-icon {
          width: 47px;
          height: 47px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
        }

        .learning-blue .learning-icon {
          color: #60a5fa;
        }

        .learning-purple .learning-icon {
          color: #c4b5fd;
        }

        .learning-gold .learning-icon {
          color: #f6d66f;
        }

        .learning-green .learning-icon {
          color: #6ee7b7;
        }

        .learning-area h3 {
          margin-top: 16px;
          color: white;
          font-size: 17px;
          font-weight: 900;
        }

        .learning-area p {
          margin-top: 8px;
          color: #bfdbfe;
          font-size: 12px;
          line-height: 1.75;
        }

        .learning-line {
          width: 48px;
          height: 3px;
          margin-top: 18px;
          border-radius: 999px;
          background: #f6d66f;
        }

        .textbook-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
        }

        .book-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          background: #f8fafc;
          color: var(--blue);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.11em;
        }

        .textbook-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 17px;
          margin-top: 40px;
        }

        .textbook-card {
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 23px;
          background: white;
          box-shadow:
            0 8px 25px rgba(15, 23, 42, 0.04);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .textbook-card:hover {
          transform: translateY(-7px);
          border-color: #bfdbfe;
          box-shadow:
            0 22px 42px rgba(15, 61, 145, 0.1);
        }

        .textbook-image-wrap {
          position: relative;
          height: 350px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              135deg,
              #f8fafc,
              #eff6ff
            );
        }

        .textbook-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 20px;
          transition:
            transform 0.45s ease;
        }

        .textbook-card:hover img {
          transform: scale(1.035);
        }

        .textbook-image-shine {
          position: absolute;
          width: 45%;
          height: 120%;
          top: -10%;
          left: -50%;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.55),
              transparent
            );
          transform: skewX(-18deg);
          transition: left 0.7s ease;
        }

        .textbook-card:hover .textbook-image-shine {
          left: 115%;
        }

        .textbook-tag {
          position: absolute;
          top: 14px;
          right: 14px;
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(7, 27, 64, 0.82);
          color: white;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.12em;
          backdrop-filter: blur(8px);
        }

        .textbook-content {
          padding: 19px;
        }

        .textbook-content h3 {
          margin-top: 7px;
          color: var(--navy);
          font-size: 18px;
          font-weight: 900;
        }

        .textbook-note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 16px;
          padding: 12px;
          border: 1px solid #dbeafe;
          border-radius: 13px;
          background: #eff6ff;
          color: #475569;
          font-size: 10px;
          line-height: 1.6;
        }

        .textbook-note svg {
          color: #2563eb;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .skills-section {
          padding: 100px 0;
          color: white;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(59, 130, 246, 0.17),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #071b40,
              #103f88
            );
        }

        .skills-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(360px, 0.88fr);
          gap: 60px;
          align-items: center;
        }

        .skills-check-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
          margin-top: 27px;
        }

        .skills-check {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.04);
          color: #dbeafe;
          font-size: 11px;
          font-weight: 700;
        }

        .skills-check svg {
          color: #34d399;
          flex-shrink: 0;
        }

        .skills-visual-card {
          position: relative;
          overflow: hidden;
          min-height: 430px;
          border-radius: 28px;
          background: #071b40;
          box-shadow:
            0 25px 60px rgba(0, 0, 0, 0.18);
        }

        .skills-visual-card img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 30px;
          background:
            linear-gradient(
              145deg,
              #fff7ed,
              #f8fafc
            );
          transition:
            transform 0.8s cubic-bezier(.16,1,.3,1);
        }

        .skills-visual-card:hover img {
          transform: scale(1.035);
        }

        .skills-visual-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              145deg,
              rgba(7, 27, 64, 0.1),
              rgba(7, 27, 64, 0.76)
            );
        }

        .skills-visual-content {
          position: absolute;
          left: 25px;
          right: 25px;
          bottom: 25px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 17px;
          background: rgba(7, 27, 64, 0.76);
          backdrop-filter: blur(12px);
        }

        .skills-visual-content p {
          max-width: 500px;
          margin-top: 8px;
          color: #bfdbfe;
          font-size: 11px;
          line-height: 1.7;
        }

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

        .career-advice-card {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 13px;
          align-items: center;
          margin-top: 22px;
          padding: 17px;
          border: 1px solid #bfdbfe;
          border-radius: 18px;
          background:
            linear-gradient(
              135deg,
              #eff6ff,
              #f5f3ff
            );
        }

        .career-advice-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: white;
          color: var(--blue);
        }

        .career-advice-title {
          color: var(--navy);
          font-size: 13px;
          font-weight: 900;
        }

        .career-advice-card p {
          margin-top: 4px;
          color: #64748b;
          font-size: 11px;
          line-height: 1.65;
        }

        .career-advice-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--blue);
          font-size: 11px;
          font-weight: 900;
          text-decoration: none;
          white-space: nowrap;
        }

        .courses-future-section {
          padding: 90px 0;
          background: #f8fafc;
        }

        .future-card {
          position: relative;
          overflow: hidden;
          min-height: 470px;
          border-radius: 30px;
          background: #071b40;
          box-shadow:
            0 30px 70px rgba(15, 23, 42, 0.14);
        }

        .future-card img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition:
            transform 1s cubic-bezier(.16,1,.3,1);
        }

        .future-card:hover img {
          transform: scale(1.04);
        }

        .future-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(7, 27, 64, 0.93),
              rgba(7, 27, 64, 0.6) 52%,
              rgba(7, 27, 64, 0.22)
            );
        }

        .future-content {
          position: relative;
          z-index: 2;
          max-width: 680px;
          padding: 60px;
        }

        .future-content h2 {
          margin-top: 10px;
          color: white;
          font-size: clamp(37px, 5vw, 60px);
          line-height: 1.01;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .future-content p {
          max-width: 600px;
          margin-top: 16px;
          color: #bfdbfe;
          font-size: 14px;
          line-height: 1.8;
        }

        .future-content .courses-primary-button {
          margin-top: 25px;
        }

        .live-course-card {
          padding: 24px;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          background: white;
          box-shadow:
            0 8px 24px rgba(15, 23, 42, 0.04);
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease;
        }

        .live-course-card:hover {
          transform: translateY(-5px);
          box-shadow:
            0 18px 38px rgba(15, 23, 42, 0.08);
        }

        .live-course-0 {
          border-top: 4px solid #3b82f6;
        }

        .live-course-1 {
          border-top: 4px solid #8b5cf6;
        }

        .live-course-2 {
          border-top: 4px solid #eab308;
        }

        .live-course-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .live-course-code {
          display: grid;
          min-width: 42px;
          height: 38px;
          place-items: center;
          border-radius: 11px;
          background: #eff6ff;
          color: var(--blue);
          font-size: 10px;
          font-weight: 950;
        }

        .live-course-duration {
          border-radius: 999px;
          background: #f1f5f9;
          padding: 6px 9px;
          color: #64748b;
          font-size: 9px;
          font-weight: 800;
        }

        .live-course-card h3 {
          margin-top: 17px;
          color: var(--navy);
          font-size: 19px;
          font-weight: 900;
        }

        .live-course-card p {
          margin-top: 8px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.75;
        }

        .live-course-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 17px;
          color: var(--blue);
          font-size: 11px;
          font-weight: 900;
          text-decoration: none;
        }

        .courses-final-cta {
          position: relative;
          overflow: hidden;
          padding: 82px 0;
          color: white;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(59, 130, 246, 0.2),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #061632,
              #103f88
            );
        }

        .final-cta-orb {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          pointer-events: none;
          animation: orbitSpin 20s linear infinite;
        }

        .cta-orb-a {
          width: 340px;
          height: 340px;
          right: -120px;
          bottom: -160px;
        }

        .cta-orb-b {
          width: 210px;
          height: 210px;
          left: -70px;
          top: -90px;
          animation-direction: reverse;
          animation-duration: 15s;
        }

        .courses-final-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 35px;
        }

        .courses-final-inner h2 {
          max-width: 720px;
          margin-top: 10px;
          font-size: clamp(34px, 4vw, 54px);
          line-height: 1.04;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .courses-final-inner h2 span {
          color: #f6d66f;
        }

        .courses-final-inner p {
          max-width: 660px;
          margin-top: 14px;
          color: #bfdbfe;
          font-size: 14px;
          line-height: 1.8;
        }

        .courses-final-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          flex-shrink: 0;
        }

        .courses-outline-button {
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

        @keyframes movingGradient {
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

        @keyframes glowMoveOne {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(-32px, 24px)
              scale(1.08);
          }
        }

        @keyframes glowMoveTwo {
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

        @keyframes glowMoveThree {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(-15px, -12px)
              scale(1.1);
          }
        }

        @keyframes pulseStatus {
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

        @keyframes orbitSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes floatingInfo {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-9px);
          }
        }

        @keyframes cpFloatOne {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(16px, 10px)
              scale(1.3);
          }
        }

        @keyframes cpFloatTwo {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(-14px, 9px)
              scale(1.3);
          }
        }

        @keyframes cpFloatThree {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(11px);
          }
        }

        @keyframes cpFloatFour {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(11px, -13px)
              scale(1.25);
          }
        }

        @keyframes cpFloatFive {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(18px, -8px)
              scale(1.3);
          }
        }

        @media (max-width: 1100px) {
          .courses-hero-layout,
          .programme-intro-grid,
          .skills-layout {
            grid-template-columns: 1fr;
          }

          .learning-area-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .career-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .courses-final-inner {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 750px) {
          .courses-premium-title {
            font-size: 43px;
          }

          .courses-premium-description {
            font-size: 15px;
          }

          .courses-hero-visual {
            min-height: 420px;
          }

          .orbit-1 {
            width: 340px;
            height: 340px;
          }

          .orbit-2 {
            width: 245px;
            height: 245px;
          }

          .courses-hero-image {
            height: 255px;
          }

          .floating-info-top {
            right: 0;
            top: 10px;
          }

          .floating-info-bottom {
            left: 0;
            bottom: 10px;
          }

          .courses-metrics {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .course-metric,
          .course-metric + .course-metric {
            padding: 0;
            border-left: 0;
          }

          .learning-area-grid,
          .textbook-grid,
          .skills-check-grid,
          .career-grid {
            grid-template-columns: 1fr;
          }

          .textbook-image-wrap {
            height: 360px;
          }

          .career-advice-card {
            grid-template-columns: auto 1fr;
          }

          .career-advice-link {
            grid-column: 2;
          }

          .future-content {
            padding: 32px;
          }

          .future-content h2 {
            font-size: 38px;
          }

          .textbook-header {
            flex-direction: column;
            align-items: flex-start;
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

function Reveal({
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
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.16,
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

function TrustItem({
  icon: Icon,
  text,
}: {
  icon: typeof GraduationCap;
  text: string;
}) {
  return (
    <div className="courses-trust">
      <Icon className="h-4 w-4" />
      {text}
    </div>
  );
}

function FloatingInfo({
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
    <div className={`floating-info ${className}`}>
      <div className="floating-info-icon">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <div className="floating-info-value">
          {value}
        </div>

        <div className="floating-info-label">
          {label}
        </div>
      </div>
    </div>
  );
}

function Metric({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="course-metric">
      <div className="course-metric-number">
        {number}
      </div>

      <div className="course-metric-label">
        {label}
      </div>
    </div>
  );
}

function SidePoint({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="side-point">
      <div className="side-point-number">
        {number}
      </div>

      <div>
        <div className="side-point-title">
          {title}
        </div>

        <div className="side-point-text">
          {text}
        </div>
      </div>
    </div>
  );
}

function LearningArea({
  icon: Icon,
  title,
  description,
  tone,
}: LearningAreaItem) {
  return (
    <div className={`learning-area learning-${tone}`}>
      <div className="learning-icon">
        <Icon className="h-5 w-5" />
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <div className="learning-line" />
    </div>
  );
}

function CareerCard({
  icon: Icon,
  title,
  description,
  tone,
}: CareerPathItem) {
  return (
    <div className={`career-card career-${tone}`}>
      <div className="career-icon">
        <Icon className="h-5 w-5" />
      </div>

      <h3>{title}</h3>

      <p>{description}</p>
    </div>
  );
}

function LiveCourseCard({
  text,
}: {
  text: string;
}) {
  return (
    <div className="live-course-card">
      <div className="text-sm text-slate-500">
        {text}
      </div>
    </div>
  );
}

