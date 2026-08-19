"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Database,
  GraduationCap,
  Laptop,
  Network,
  ShieldCheck,
} from "lucide-react";

import PublicShell from "@/components/public/PublicShell";

const highlights = [
  {
    icon: Code2,
    title: "Programming",
    text: "Build strong foundations in programming, algorithms and problem solving.",
  },
  {
    icon: Database,
    title: "Database Systems",
    text: "Learn database concepts, SQL, data modelling and practical data management.",
  },
  {
    icon: Laptop,
    title: "Web Technologies",
    text: "Develop responsive websites and modern web applications.",
  },
  {
    icon: Network,
    title: "Computer Networks",
    text: "Understand networking, communication systems and internet technologies.",
  },
  {
    icon: ShieldCheck,
    title: "Cyber Security",
    text: "Learn the fundamentals of secure computing and digital protection.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Career Skills",
    text: "Develop practical skills for technology careers and higher studies.",
  },
];

const semesters = [
  {
    title: "Semester 1",
    subjects: [
      "Programming Fundamentals",
      "Computer Fundamentals",
      "Mathematics",
      "Digital Fundamentals",
      "Communication Skills",
    ],
  },
  {
    title: "Semester 2",
    subjects: [
      "Object-Oriented Programming",
      "Data Structures",
      "Database Fundamentals",
      "Web Fundamentals",
      "Communication",
    ],
  },
  {
    title: "Semester 3",
    subjects: [
      "Advanced Data Structures",
      "Database Management Systems",
      "Operating Systems",
      "Web Technologies",
      "Computer Networks",
    ],
  },
  {
    title: "Semester 4",
    subjects: [
      "Java Programming",
      "Software Engineering",
      "Computer Architecture",
      "Web Application Development",
      "Data Communication",
    ],
  },
  {
    title: "Semester 5",
    subjects: [
      "Advanced Web Technologies",
      "Python Programming",
      "Cloud Computing",
      "Cyber Security",
      "Project Work",
    ],
  },
  {
    title: "Semester 6",
    subjects: [
      "Artificial Intelligence",
      "Mobile Application Development",
      "Emerging Technologies",
      "Project Development",
      "Professional Skills",
    ],
  },
];

const careers = [
  "Software Developer",
  "Web Developer",
  "Frontend Developer",
  "Backend Developer",
  "Database Developer",
  "Software Tester",
  "IT Support Specialist",
  "Junior Data Analyst",
  "System Support Executive",
  "Higher Studies / MCA",
];

export default function BcaPage() {
  return (
    <PublicShell>
      <main className="bg-[var(--bg)]">

        {/* HERO */}
        <section className="gradient-academic relative overflow-hidden">
          <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[var(--gold)]/10 blur-3xl" />

          <div className="container-page relative py-20 lg:py-24">

            <div className="max-w-4xl text-white">

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
                <GraduationCap className="h-4 w-4 text-[var(--gold)]" />
                Undergraduate Programme
              </div>

              <h1 className="mt-7 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                Bachelor of{" "}
                <span className="text-[var(--gold)]">
                  Computer Applications
                </span>
              </h1>

              <div className="mt-4 text-xl font-bold tracking-wide text-blue-100">
                BCA · Technology · Innovation · Career
              </div>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100/90">
                Build a strong foundation in software development,
                programming, databases, web technologies and modern
                computing through a practical and career-focused
                Bachelor of Computer Applications programme.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-6 py-3.5 font-bold text-[var(--navy)] shadow-lg transition hover:-translate-y-0.5"
                >
                  Enquire About BCA
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-bold text-white transition hover:bg-white/15"
                >
                  Student Portal
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-3 text-sm text-blue-100">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  3-Year Undergraduate Programme
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Practical Learning
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Technology Focus
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* PROGRAM SNAPSHOT */}
        <section className="-mt-8 relative z-10 pb-8">
          <div className="container-page">

            <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-4">

              <Info
                label="Programme"
                value="BCA"
              />

              <Info
                label="Duration"
                value="3 Years"
              />

              <Info
                label="Level"
                value="Undergraduate"
              />

              <Info
                label="Focus"
                value="Computer Applications"
              />

            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="section-space">
          <div className="container-page grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">

            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--blue)]">
                About the Programme
              </div>

              <h2 className="mt-3 text-3xl font-black text-[var(--navy)] sm:text-4xl">
                Learn technology. Build solutions. Shape your future.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                The Bachelor of Computer Applications programme is
                designed for students who want to develop strong
                foundations in computer applications, programming
                and information technology.
              </p>

              <p className="mt-4 text-base leading-8 text-slate-600">
                Through a combination of academic learning, laboratory
                practice, projects and technology-focused study,
                students develop the knowledge and skills required
                to progress into software, web, data and other
                technology-oriented careers.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-[var(--blue)]">
                  Programming
                </span>
                <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-[var(--blue)]">
                  Web Development
                </span>
                <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-[var(--blue)]">
                  Databases
                </span>
                <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-[var(--blue)]">
                  Software Development
                </span>
              </div>
            </div>

            <div className="rounded-3xl bg-[var(--navy)] p-7 text-white shadow-xl">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/10">
                  <GraduationCap className="h-6 w-6 text-[var(--gold)]" />
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                    BCA at a Glance
                  </div>

                  <div className="mt-1 text-xl font-black">
                    A foundation for the digital world
                  </div>
                </div>
              </div>

              <div className="mt-7 grid gap-3">
                <QuickPoint text="Strong programming fundamentals" />
                <QuickPoint text="Practical laboratory learning" />
                <QuickPoint text="Modern web and database concepts" />
                <QuickPoint text="Project and application development" />
                <QuickPoint text="Preparation for higher studies and careers" />
              </div>
            </div>

          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className="bg-white py-20">
          <div className="container-page">

            <SectionHeader
              eyebrow="Programme Highlights"
              title="What you will learn"
              description="Build practical and conceptual knowledge across the major areas of computing."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {highlights.map(
                ({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-[var(--blue)] transition group-hover:bg-[var(--blue)] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 text-lg font-extrabold text-[var(--navy)]">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {text}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ELIGIBILITY + LEARNING */}
        <section className="section-space">
          <div className="container-page grid gap-6 lg:grid-cols-2">

            <div className="card p-7">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-[var(--blue)]" />

                <h2 className="text-2xl font-black text-[var(--navy)]">
                  Eligibility
                </h2>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                Eligibility and admission requirements should always
                be confirmed from the latest official college and
                university notification for the relevant academic year.
              </p>

              <div className="mt-6 grid gap-3">
                <CheckItem text="Meet the applicable qualifying examination requirements." />
                <CheckItem text="Satisfy current admission criteria." />
                <CheckItem text="Submit the required academic and identity documents." />
              </div>
            </div>

            <div className="card p-7">
              <div className="flex items-center gap-3">
                <Laptop className="h-6 w-6 text-[var(--blue)]" />

                <h2 className="text-2xl font-black text-[var(--navy)]">
                  Learning Experience
                </h2>
              </div>

              <div className="mt-6 grid gap-3">
                <CheckItem text="Concept-based classroom learning." />
                <CheckItem text="Programming and laboratory practice." />
                <CheckItem text="Project and application-oriented learning." />
                <CheckItem text="Technology-focused practical exposure." />
              </div>
            </div>

          </div>
        </section>

        {/* CURRICULUM */}
        <section className="bg-white py-20">
          <div className="container-page">

            <SectionHeader
              eyebrow="Curriculum"
              title="Semester-wise BCA learning"
              description="A clean overview of the major academic areas across the programme."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {semesters.map((semester) => (
                <div
                  key={semester.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-[var(--navy)]">
                      {semester.title}
                    </h3>

                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      BCA
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {semester.subjects.map(
                      (subject) => (
                        <div
                          key={subject}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span>{subject}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CAREERS */}
        <section className="section-space">
          <div className="container-page">

            <SectionHeader
              eyebrow="Career Pathways"
              title="Where your BCA journey can lead"
              description="Build a foundation for technology roles, entrepreneurship and higher education."
            />

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {careers.map((career) => (
                <div
                  key={career}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {career}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[var(--navy)] py-20 text-white">
          <div className="container-page flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-3xl">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                BCA Programme
              </div>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Begin your journey into computer applications.
              </h2>

              <p className="mt-4 text-sm leading-7 text-blue-100">
                Explore the BCA programme, contact the college for
                current admission information, or access the secure
                student portal.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-6 py-3.5 font-bold text-[var(--navy)]"
              >
                Enquire Now
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-6 py-3.5 font-bold text-white"
              >
                Student Portal
              </Link>
            </div>

          </div>
        </section>

      </main>
    </PublicShell>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-slate-100 p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </div>

      <div className="mt-2 text-sm font-extrabold text-[var(--navy)]">
        {value}
      </div>
    </div>
  );
}

function QuickPoint({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-blue-100">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
      <span>{text}</span>
    </div>
  );
}

function CheckItem({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
      <span>{text}</span>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--blue)]">
        {eyebrow}
      </div>

      <h2 className="mt-3 text-3xl font-black text-[var(--navy)] sm:text-4xl">
        {title}
      </h2>

      <p className="mt-4 text-base leading-7 text-slate-600">
        {description}
      </p>
    </div>
  );
}
