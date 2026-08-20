"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  GraduationCap,
  Laptop,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Wifi,
} from "lucide-react";
import { motion } from "framer-motion";

import PublicShell from "@/components/public/PublicShell";
import SectionTitle from "@/components/ui/SectionTitle";

const facilities = [
  {
    icon: Laptop,
    title: "Modern Computer Labs",
    text: "Well-equipped computer laboratories designed for programming, practical sessions and project development.",
  },
  {
    icon: Code2,
    title: "Programming Practice",
    text: "Students gain hands-on experience with programming concepts, algorithms, software development and problem solving.",
  },
  {
    icon: Database,
    title: "Database Learning",
    text: "Practical exposure to database design, SQL, data management and modern information systems.",
  },
  {
    icon: Network,
    title: "Networking",
    text: "Learn computer networks, communication technologies, internet fundamentals and network security concepts.",
  },
  {
    icon: BrainCircuit,
    title: "Emerging Technology",
    text: "Introduction to AI, machine learning, cloud computing and other technologies shaping the digital world.",
  },
  {
    icon: Wifi,
    title: "Connected Campus",
    text: "Digital resources and internet connectivity support academic learning, research and project work.",
  },
];

const technologies = [
  "C / C++",
  "Java",
  "Python",
  "HTML & CSS",
  "JavaScript",
  "React",
  "SQL",
  "Database Systems",
  "Computer Networks",
  "Operating Systems",
  "Cloud Computing",
  "Artificial Intelligence",
];

const careers = [
  {
    title: "Software Developer",
    text: "Build applications, websites and software solutions for organizations and technology companies.",
    icon: Code2,
  },
  {
    title: "Web Developer",
    text: "Create modern responsive websites and web applications using frontend and backend technologies.",
    icon: Laptop,
  },
  {
    title: "Database Professional",
    text: "Work with databases, SQL, data management and information systems.",
    icon: Database,
  },
  {
    title: "System & Network Support",
    text: "Support computer systems, networks, servers and digital infrastructure.",
    icon: Network,
  },
  {
    title: "IT Support Specialist",
    text: "Help organizations maintain their computers, applications and technology infrastructure.",
    icon: ShieldCheck,
  },
  {
    title: "Entrepreneur",
    text: "Use technical and business knowledge to create software products, services and startups.",
    icon: Rocket,
  },
];

const stats = [
  { value: "3+", label: "Years of Study" },
  { value: "100%", label: "Practical Focus" },
  { value: "12+", label: "Technology Areas" },
  { value: "∞", label: "Career Possibilities" },
];

export default function DepartmentsPage() {
  return (
    <PublicShell>
      <main className="overflow-hidden bg-[var(--bg)]">
        {/* HERO */}
        <section className="relative isolate overflow-hidden bg-[var(--navy)]">
          {/* Animated background */}
          <motion.div
            className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"
            animate={{
              x: [0, 80, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl"
            animate={{
              x: [0, -70, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />

          <div className="container-page relative py-20 lg:py-28">
            <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">
              <motion.div
                initial={{ opacity: 0, x: -35 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100 backdrop-blur">
                  <Sparkles className="h-4 w-4 text-[var(--gold)]" />
                  Academic Departments
                </div>

                <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                  Learn.
                  <span className="text-[var(--gold)]"> Build.</span>
                  <br />
                  <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent">
                    Innovate.
                  </span>
                </h1>

                <p className="mt-7 max-w-2xl text-lg leading-8 text-blue-100">
                  Explore the academic departments of The National Degree
                  College, Bagepalli, with a strong focus on practical
                  education, technology, innovation and career development.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/courses/bca"
                    className="group inline-flex items-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-3 font-bold text-[var(--navy)] shadow-lg shadow-yellow-500/10 transition hover:-translate-y-1"
                  >
                    Explore BCA
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/admissions"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
                  >
                    Admissions
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-5 text-sm text-blue-100">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    Practical learning
                  </span>

                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    Technology focused
                  </span>

                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    Career oriented
                  </span>
                </div>
              </motion.div>

              {/* Hero image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 blur-2xl" />

                <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                    <Image
                      src="/images/computer-lab.jpg"
                      alt="Computer laboratory"
                      fill
                      priority
                      className="object-cover transition duration-700 hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/80 via-transparent to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/15 backdrop-blur">
                          <Cpu className="h-6 w-6 text-cyan-200" />
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-cyan-200">
                            Technology
                          </p>
                          <h2 className="text-xl font-black text-white">
                            Computer Science & Applications
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-white/10 bg-white p-4 shadow-2xl sm:block"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-[var(--blue)]">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400">
                        Learning
                      </p>
                      <p className="font-black text-[var(--navy)]">
                        Future Ready
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="border-b border-slate-200 bg-white">
          <div className="container-page grid grid-cols-2 divide-x divide-slate-200 py-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="px-4 text-center first:pl-0 last:pr-0"
              >
                <div className="text-3xl font-black text-[var(--blue)]">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* DEPARTMENT INTRO */}
        <section className="section-space">
          <div className="container-page">
            <SectionTitle
              eyebrow="Technology Education"
              title="Building skills for the digital future"
              description="Our technology-focused academic environment combines classroom knowledge with practical experience to help students understand how modern technology is designed, developed and used."
            />

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-3xl"
              >
                <Image
                  src="/images/bca-students.jpg"
                  alt="BCA students learning computer technology"
                  width={1000}
                  height={700}
                  className="h-full min-h-[350px] w-full object-cover transition duration-700 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur">
                    <Users className="h-3.5 w-3.5" />
                    Student Learning
                  </div>

                  <h3 className="mt-3 text-2xl font-black">
                    Learn by doing
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">
                    Practical sessions, projects and technology-based learning
                    help students turn concepts into real-world skills.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-[var(--blue)]">
                  <GraduationCap className="h-7 w-7" />
                </div>

                <h3 className="mt-6 text-2xl font-black text-[var(--navy)]">
                  Bachelor of Computer Applications
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  BCA is a technology-oriented undergraduate program designed
                  for students who want to build a strong foundation in
                  computer applications, programming, databases, networking,
                  software development and modern digital technologies.
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Students develop analytical thinking and practical skills
                  through programming exercises, laboratory sessions,
                  assignments and academic projects.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    "Programming fundamentals",
                    "Web technologies",
                    "Database systems",
                    "Computer networks",
                    "Software development",
                    "Project development",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FACILITIES */}
        <section className="relative overflow-hidden bg-white py-20">
          <div className="container-page">
            <SectionTitle
              eyebrow="Department Facilities"
              title="A practical environment for technology learning"
              description="Students need more than textbooks. Our department focuses on practical exposure, experimentation and technology-based learning."
            />

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {facilities.map((facility, index) => {
                const Icon = facility.icon;

                return (
                  <motion.article
                    key={facility.title}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07 }}
                    whileHover={{ y: -7 }}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-xl"
                  >
                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-50 opacity-0 blur-2xl transition group-hover:opacity-100" />

                    <div className="relative">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 text-[var(--blue)] transition group-hover:scale-110">
                        <Icon className="h-6 w-6" />
                      </div>

                      <h3 className="mt-5 text-lg font-black text-[var(--navy)]">
                        {facility.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {facility.text}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* COMPUTER LAB */}
        <section className="section-space">
          <div className="container-page">
            <div className="grid items-center gap-10 lg:grid-cols-[.85fr_1.15fr]">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--blue)]">
                  <Laptop className="h-4 w-4" />
                  Computer Laboratory
                </div>

                <h2 className="mt-5 text-3xl font-black tracking-tight text-[var(--navy)] sm:text-4xl">
                  Where concepts become practical skills.
                </h2>

                <p className="mt-5 text-sm leading-7 text-slate-600">
                  Computer laboratory sessions provide students with an
                  environment to practice programming, database management,
                  web development, networking concepts and software projects.
                </p>

                <div className="mt-7 space-y-4">
                  {[
                    "Hands-on programming practice",
                    "Web and application development",
                    "Database and SQL exercises",
                    "Academic project development",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-500/10 via-cyan-400/10 to-purple-500/10 blur-2xl" />

                <div className="relative grid gap-4 sm:grid-cols-2">
                  <Image
                    src="/images/computer-lab.jpg"
                    alt="College computer laboratory"
                    width={800}
                    height={600}
                    className="h-64 w-full rounded-2xl object-cover shadow-lg sm:h-72"
                  />

                  <Image
                    src="/images/computer-class.jpg"
                    alt="Computer science classroom"
                    width={800}
                    height={600}
                    className="h-64 w-full rounded-2xl object-cover shadow-lg sm:mt-8 sm:h-72"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* TECHNOLOGIES */}
        <section className="bg-[var(--navy)] py-20 text-white">
          <div className="container-page">
            <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-100">
                  <Code2 className="h-4 w-4 text-cyan-300" />
                  Technology Stack
                </div>

                <h2 className="mt-5 text-3xl font-black sm:text-4xl">
                  Explore the technologies behind modern software.
                </h2>

                <p className="mt-5 text-sm leading-7 text-blue-100">
                  A strong technology foundation gives students the confidence
                  to understand existing systems and build new digital
                  solutions.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {technologies.map((technology, index) => (
                  <motion.div
                    key={technology}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04 }}
                    whileHover={{ scale: 1.04 }}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center text-sm font-bold text-blue-50 backdrop-blur transition hover:border-cyan-300/30 hover:bg-white/10"
                  >
                    {technology}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CAREERS */}
        <section className="section-space">
          <div className="container-page">
            <SectionTitle
              eyebrow="Career Opportunities"
              title="Where can a BCA education take you?"
              description="Technology skills can open opportunities across software development, web technologies, databases, IT infrastructure, support services and entrepreneurship."
            />

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {careers.map((career, index) => {
                const Icon = career.icon;

                return (
                  <motion.article
                    key={career.title}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    whileHover={{ y: -6 }}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-[var(--blue)] transition group-hover:bg-[var(--blue)] group-hover:text-white">
                        <Icon className="h-6 w-6" />
                      </div>

                      <Award className="h-5 w-5 text-slate-200 transition group-hover:text-[var(--gold)]" />
                    </div>

                    <h3 className="mt-5 text-lg font-black text-[var(--navy)]">
                      {career.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {career.text}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-[var(--navy)] to-slate-950 py-20 text-white">
          <motion.div
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="container-page relative">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/10 backdrop-blur">
                <GraduationCap className="h-8 w-8 text-[var(--gold)]" />
              </div>

              <h2 className="mt-6 text-3xl font-black sm:text-5xl">
                Start building your future with technology.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-blue-100">
                Discover the BCA program, explore academic opportunities and
                take the next step toward a technology-focused career.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/courses/bca"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--gold)] px-6 py-3 font-bold text-[var(--navy)] transition hover:-translate-y-1"
                >
                  Explore BCA Course
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Contact College
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}