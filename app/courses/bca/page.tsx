
"use client";

import Link from "next/link";
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
  Target,
  Users,
} from "lucide-react";

import PublicShell from "@/components/public/PublicShell";

const semesters = [
  {
    semester: "Semester 1",
    subjects: [
      "Programming Fundamentals",
      "Computer Fundamentals",
      "Mathematics",
      "Digital Logic",
      "Communication Skills",
    ],
  },
  {
    semester: "Semester 2",
    subjects: [
      "Object Oriented Programming",
      "Data Structures",
      "Database Management Systems",
      "Operating Systems",
      "Web Technologies",
    ],
  },
  {
    semester: "Semester 3",
    subjects: [
      "Computer Networks",
      "Software Engineering",
      "Java Programming",
      "Python Programming",
      "Web Application Development",
    ],
  },
  {
    semester: "Semester 4",
    subjects: [
      "Advanced Database Systems",
      "Computer Architecture",
      "Cloud Computing",
      "Mobile Application Development",
      "Data Analytics",
    ],
  },
  {
    semester: "Semester 5",
    subjects: [
      "Artificial Intelligence",
      "Machine Learning Fundamentals",
      "Cyber Security",
      "Full Stack Development",
      "Project Development",
    ],
  },
  {
    semester: "Semester 6",
    subjects: [
      "Advanced Web Development",
      "Software Testing",
      "Emerging Technologies",
      "Project Management",
      "Final Year Project",
    ],
  },
];

const careers = [
  {
    icon: Code2,
    title: "Software Developer",
    text: "Build modern web, desktop and software applications.",
  },
  {
    icon: Laptop,
    title: "Web Developer",
    text: "Create responsive websites and full-stack applications.",
  },
  {
    icon: Database,
    title: "Database Developer",
    text: "Design, manage and optimize database systems.",
  },
  {
    icon: ShieldCheck,
    title: "Cyber Security",
    text: "Work with security, networks and information protection.",
  },
  {
    icon: Network,
    title: "Network Engineer",
    text: "Manage computer networks, infrastructure and connectivity.",
  },
  {
    icon: BriefcaseBusiness,
    title: "IT Support Specialist",
    text: "Provide technical support and maintain IT systems.",
  },
];

const skills = [
  "C / C++ Programming",
  "Java Programming",
  "Python",
  "HTML, CSS & JavaScript",
  "React & Modern Web Development",
  "Database Management",
  "SQL",
  "Computer Networks",
  "Operating Systems",
  "Cyber Security",
  "Cloud Computing",
  "Software Engineering",
];

export default function BCACoursePage() {
  return (
    <PublicShell>
      <main className="overflow-hidden bg-[var(--bg)]">

        {/* HERO */}
        <section className="relative overflow-hidden bg-[var(--navy)] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,.35),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(234,179,8,.22),transparent_30%)]" />

          <div className="absolute left-[8%] top-24 h-2 w-2 animate-ping rounded-full bg-blue-300" />
          <div className="absolute right-[15%] top-40 h-3 w-3 animate-pulse rounded-full bg-yellow-300" />
          <div className="absolute bottom-20 left-[45%] h-2 w-2 animate-bounce rounded-full bg-white/60" />

          <div className="container-page relative grid min-h-[680px] items-center gap-12 py-20 lg:grid-cols-[1.1fr_.9fr]">

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-200">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                Bachelor of Computer Applications
              </div>

              <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Build your future with
                <span className="block bg-gradient-to-r from-blue-300 via-white to-yellow-300 bg-clip-text text-transparent">
                  BCA & Technology.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-blue-100">
                Develop practical programming, software development,
                database, networking and modern technology skills through
                a career-focused Bachelor of Computer Applications program.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/admissions"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-6 py-3.5 font-black text-[var(--navy)] shadow-lg shadow-yellow-500/20 transition duration-300 hover:-translate-y-1 hover:shadow-yellow-500/40"
                >
                  Apply for Admission
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href="#career"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Explore Career Options
                </a>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
                <HeroStat value="3 Years" label="Duration" />
                <HeroStat value="6" label="Semesters" />
                <HeroStat value="100%" label="Tech Focus" />
                <HeroStat value="Career" label="Oriented" />
              </div>
            </div>

            {/* COMPUTER VISUAL */}
            <div className="relative">
              <div className="absolute -inset-5 animate-pulse rounded-[2rem] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-yellow-400/20 blur-2xl" />

              <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
                <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950">

                  <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                    <span className="ml-3 text-xs text-slate-500">
                      bca-learning-platform
                    </span>
                  </div>

                  <div className="grid min-h-[360px] place-items-center p-8">
                    <div className="text-center">
                      <div className="mx-auto grid h-28 w-28 place-items-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-2xl shadow-blue-500/30">
                        <Monitor className="h-14 w-14 text-white" />
                      </div>

                      <h2 className="mt-7 text-3xl font-black">
                        Learn. Build. Innovate.
                      </h2>

                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        Programming • Web Development • Databases •
                        Networks • AI • Cyber Security
                      </p>

                      <div className="mt-7 flex flex-wrap justify-center gap-2">
                        {["C", "Java", "Python", "SQL", "React"].map(
                          (tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-blue-200"
                            >
                              {tech}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* INTRO */}
        <section className="section-space bg-white">
          <div className="container-page grid gap-10 lg:grid-cols-[1fr_1fr]">

            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--blue)]">
                About BCA
              </div>

              <h2 className="mt-3 text-4xl font-black tracking-tight text-[var(--navy)]">
                A strong foundation for a career in technology.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                Bachelor of Computer Applications is an undergraduate
                program designed for students who want to build a career
                in computer applications, software development and
                information technology.
              </p>

              <p className="mt-4 text-base leading-8 text-slate-600">
                The program combines programming fundamentals with
                practical development, databases, networking, software
                engineering and emerging technologies.
              </p>

              <div className="mt-7 grid gap-3">
                {[
                  "Industry-oriented technical learning",
                  "Strong programming fundamentals",
                  "Practical project development",
                  "Modern web and software technologies",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="text-sm font-bold text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-950 p-8 text-white shadow-xl">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />

              <div className="relative">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10">
                  <GraduationCap className="h-7 w-7 text-yellow-300" />
                </div>

                <h3 className="mt-6 text-2xl font-black">
                  Why choose BCA?
                </h3>

                <div className="mt-6 grid gap-4">
                  <Feature
                    icon={Code2}
                    title="Programming"
                    text="Learn how software is designed and developed."
                  />
                  <Feature
                    icon={Laptop}
                    title="Practical Technology"
                    text="Build real applications and academic projects."
                  />
                  <Feature
                    icon={Rocket}
                    title="Career Growth"
                    text="Prepare for software and IT industry opportunities."
                  />
                  <Feature
                    icon={Award}
                    title="Higher Education"
                    text="Create a foundation for MCA and advanced studies."
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SKILLS */}
        <section className="section-space bg-slate-50">
          <div className="container-page">

            <SectionHeading
              eyebrow="Technology Stack"
              title="Skills you can develop"
              text="Build a broad technical foundation that can be applied to software, web and IT careers."
            />

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {skills.map((skill, index) => (
                <div
                  key={skill}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-xs font-black text-[var(--blue)] transition group-hover:bg-[var(--blue)] group-hover:text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-sm font-extrabold text-[var(--navy)]">
                      {skill}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* SYLLABUS */}
        <section className="section-space bg-white">
          <div className="container-page">

            <SectionHeading
              eyebrow="Academic Structure"
              title="BCA semester roadmap"
              text="A progressive curriculum designed to move from fundamentals to advanced technology and project development."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {semesters.map((semester, index) => (
                <article
                  key={semester.semester}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 font-black text-[var(--blue)]">
                      {index + 1}
                    </div>

                    <BookOpen className="h-5 w-5 text-slate-300 transition group-hover:text-[var(--blue)]" />
                  </div>

                  <h3 className="mt-5 text-xl font-black text-[var(--navy)]">
                    {semester.semester}
                  </h3>

                  <div className="mt-5 space-y-3">
                    {semester.subjects.map((subject) => (
                      <div
                        key={subject}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {subject}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>

        {/* CAREERS */}
        <section id="career" className="section-space bg-slate-950 text-white">
          <div className="container-page">

            <SectionHeading
              dark
              eyebrow="Career Opportunities"
              title="Where can BCA take you?"
              text="BCA can open pathways into software development, web technologies, databases, networking, support and further higher education."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {careers.map((career) => {
                const Icon = career.icon;

                return (
                  <article
                    key={career.title}
                    className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/10"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/10 text-blue-300">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="mt-5 text-xl font-black">
                      {career.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {career.text}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-10 rounded-3xl border border-yellow-400/20 bg-gradient-to-r from-yellow-400/10 to-blue-500/10 p-7">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-black">
                    Continue your education
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    After BCA, students can explore higher studies such as
                    MCA, MBA, postgraduate programs, certifications and
                    specialized technology courses.
                  </p>
                </div>

                <GraduationCap className="hidden h-14 w-14 text-yellow-300 md:block" />
              </div>
            </div>

          </div>
        </section>

        {/* JOB ROLES */}
        <section className="section-space bg-white">
          <div className="container-page">

            <SectionHeading
              eyebrow="Career Direction"
              title="Potential job roles"
              text="Depending on your skills, experience and specialization, BCA graduates can explore multiple technology career paths."
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Software Developer",
                "Frontend Developer",
                "Backend Developer",
                "Full Stack Developer",
                "Web Developer",
                "Database Administrator",
                "IT Support Engineer",
                "Network Engineer",
                "QA / Software Tester",
                "Junior Data Analyst",
                "System Administrator",
                "Cyber Security Associate",
              ].map((job) => (
                <div
                  key={job}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <BriefcaseBusiness className="h-5 w-5 shrink-0 text-[var(--blue)]" />
                  <span className="text-sm font-bold text-slate-700">
                    {job}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ADMISSION */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-[var(--navy)] py-20 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-blue-300 blur-3xl" />
            <div className="absolute bottom-0 right-10 h-52 w-52 rounded-full bg-yellow-300 blur-3xl" />
          </div>

          <div className="container-page relative text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10">
              <Target className="h-7 w-7 text-yellow-300" />
            </div>

            <h2 className="mt-6 text-4xl font-black sm:text-5xl">
              Ready to start your technology journey?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-blue-100">
              Take the first step toward building your skills and creating
              a future in computer applications and information technology.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/admissions"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-7 py-3.5 font-black text-[var(--navy)] shadow-xl transition hover:-translate-y-1"
              >
                Start Admission
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 font-bold transition hover:bg-white/15"
              >
                Contact College
              </Link>
            </div>
          </div>
        </section>

      </main>
    </PublicShell>
  );
}

function HeroStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="text-xl font-black">{value}</div>
      <div className="mt-1 text-xs font-bold text-blue-200">{label}</div>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Code2;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10">
        <Icon className="h-5 w-5 text-blue-200" />
      </div>

      <div>
        <h4 className="font-extrabold">{title}</h4>
        <p className="mt-1 text-xs leading-5 text-blue-100/70">
          {text}
        </p>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  text: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <div
        className={`text-xs font-black uppercase tracking-[0.18em] ${
          dark ? "text-blue-300" : "text-[var(--blue)]"
        }`}
      >
        {eyebrow}
      </div>

      <h2
        className={`mt-3 text-4xl font-black tracking-tight sm:text-5xl ${
          dark ? "text-white" : "text-[var(--navy)]"
        }`}
      >
        {title}
      </h2>

      <p
        className={`mt-4 text-base leading-7 ${
          dark ? "text-slate-400" : "text-slate-600"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

