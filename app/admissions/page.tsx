
"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  GraduationCap,
  Laptop,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";

import PublicShell from "@/components/public/PublicShell";

const admissionSteps = [
  {
    number: "01",
    icon: FileText,
    title: "Check Eligibility",
    text: "Review the eligibility requirements for the course you want to join.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Prepare Documents",
    text: "Keep your academic certificates, identity proof and photographs ready.",
  },
  {
    number: "03",
    icon: UserCheck,
    title: "Submit Application",
    text: "Complete the admission enquiry or application process with accurate details.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Complete Admission",
    text: "After verification, complete the required admission formalities.",
  },
];

const documents = [
  "SSLC / 10th standard marks card",
  "PUC / 12th standard marks card",
  "Transfer Certificate, if applicable",
  "Aadhaar / valid identity proof",
  "Recent passport-size photographs",
  "Caste / category certificate, if applicable",
  "Migration certificate, if applicable",
  "Other documents requested by the college",
];

const careers = [
  "Software Developer",
  "Web Developer",
  "Frontend Developer",
  "Backend Developer",
  "Database Administrator",
  "System Administrator",
  "IT Support Executive",
  "Software Testing / QA",
  "Data & Business Support",
  "Higher studies in MCA / related programs",
];

export default function AdmissionsPage() {
  return (
    <PublicShell>
      <main className="overflow-hidden bg-[var(--bg)]">
        {/* HERO */}
        <section className="relative isolate overflow-hidden bg-[var(--navy)] text-white">
          <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[var(--gold)]/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="container-page relative grid min-h-[520px] items-center gap-12 py-20 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-100 backdrop-blur">
                <Sparkles className="h-4 w-4 text-[var(--gold)]" />
                Admissions 2026
              </div>

              <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">
                Start your journey toward a{" "}
                <span className="text-[var(--gold)]">brighter future.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
                Explore academic opportunities at The National Degree College,
                Bagepalli and take the next step toward building your knowledge,
                skills and career.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/courses/bca"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-6 py-3.5 font-black text-[var(--navy)] shadow-lg transition hover:-translate-y-1"
                >
                  Explore BCA
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Admission Enquiry
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-5 text-sm text-blue-100">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[var(--gold)]" />
                  Secure digital portal
                </span>
                <span className="inline-flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-[var(--gold)]" />
                  Career-focused education
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-blue-500/40 via-cyan-400/30 to-[var(--gold)]/40 blur-xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-2 backdrop-blur-xl">
                <div className="rounded-[1.6rem] bg-white p-7 text-[var(--navy)] shadow-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Admission Portal
                      </p>
                      <h2 className="mt-2 text-2xl font-black">
                        Begin your application
                      </h2>
                    </div>

                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[var(--blue)]">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-7 grid gap-3">
                    <InfoCard
                      icon={BookOpen}
                      title="Academic Programs"
                      text="Explore available undergraduate courses."
                    />
                    <InfoCard
                      icon={Laptop}
                      title="BCA Program"
                      text="Build practical skills for the technology industry."
                    />
                    <InfoCard
                      icon={Users}
                      title="Student Support"
                      text="Guidance throughout your academic journey."
                    />
                  </div>

                  <Link
                    href="/contact"
                    className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-5 py-3 font-bold text-white transition hover:-translate-y-0.5"
                  >
                    Contact Admissions
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="border-b border-slate-200 bg-white">
          <div className="container-page grid gap-8 py-12 md:grid-cols-3">
            <Highlight
              icon={GraduationCap}
              title="Academic Growth"
              text="Develop strong academic foundations and practical knowledge."
            />
            <Highlight
              icon={Laptop}
              title="Technology Skills"
              text="Gain exposure to modern computing and digital technologies."
            />
            <Highlight
              icon={Users}
              title="Student Community"
              text="Learn, collaborate and grow alongside your peers."
            />
          </div>
        </section>

        {/* ADMISSION PROCESS */}
        <section className="section-space">
          <div className="container-page">
            <SectionHeading
              eyebrow="How it works"
              title="Simple admission process"
              description="Follow these steps to understand the admission journey from enquiry to enrolment."
            />

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {admissionSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.number}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-blue-50 transition group-hover:bg-blue-100" />

                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-[var(--blue)] transition group-hover:bg-[var(--blue)] group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </div>

                        <span className="text-3xl font-black text-slate-100">
                          {step.number}
                        </span>
                      </div>

                      <h3 className="mt-6 text-lg font-black text-[var(--navy)]">
                        {step.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        {step.text}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* BCA */}
        <section className="bg-white py-20">
          <div className="container-page grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div className="relative">
              <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-blue-100 via-cyan-50 to-yellow-50 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-8 shadow-xl">
                <div className="grid h-64 place-items-center rounded-2xl bg-[var(--navy)] text-white">
                  <div className="text-center">
                    <Laptop className="mx-auto h-16 w-16 text-[var(--gold)]" />
                    <div className="mt-5 text-4xl font-black">BCA</div>
                    <div className="mt-2 text-sm text-blue-200">
                      Bachelor of Computer Applications
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <MiniStat value="3 Years" label="Program duration" />
                  <MiniStat value="IT Focus" label="Career pathway" />
                  <MiniStat value="Practical" label="Learning approach" />
                  <MiniStat value="UG" label="Degree program" />
                </div>
              </div>
            </div>

            <div>
              <div className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--blue)]">
                Featured program
              </div>

              <h2 className="mt-5 text-4xl font-black tracking-tight text-[var(--navy)] sm:text-5xl">
                Build your future with BCA
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                Bachelor of Computer Applications is designed for students who
                want to develop a strong foundation in computer applications,
                programming, databases, web technologies and modern digital
                systems.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Programming fundamentals",
                  "Web development",
                  "Database technologies",
                  "Computer networks",
                  "Software development",
                  "Problem solving",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>

              <Link
                href="/courses/bca"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--blue)] px-5 py-3 font-bold text-white transition hover:-translate-y-0.5"
              >
                View BCA Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ELIGIBILITY */}
        <section className="section-space">
          <div className="container-page grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-[var(--blue)]">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Requirements
                  </p>
                  <h2 className="text-2xl font-black text-[var(--navy)]">
                    Eligibility
                  </h2>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                Eligibility requirements may vary by course and applicable
                university or regulatory guidelines. Students should verify
                the latest admission requirements with the college before
                completing admission.
              </div>

              <div className="mt-5 space-y-3">
                <Requirement text="Completed the required qualifying examination." />
                <Requirement text="Meet the applicable course eligibility criteria." />
                <Requirement text="Submit valid academic and identity documents." />
                <Requirement text="Complete the admission formalities within the specified timeline." />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-50 text-amber-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Checklist
                  </p>
                  <h2 className="text-2xl font-black text-[var(--navy)]">
                    Documents required
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {documents.map((document) => (
                  <div
                    key={document}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {document}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CAREERS */}
        <section className="bg-slate-950 py-20 text-white">
          <div className="container-page">
            <SectionHeading
              eyebrow="Your future"
              title="Where can BCA take you?"
              description="A computer applications degree can provide a foundation for technology careers, further studies and a wide range of digital roles."
              dark
            />

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {careers.map((career) => (
                <div
                  key={career}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:-translate-y-1 hover:bg-white/10"
                >
                  <CheckCircle2 className="h-5 w-5 text-[var(--gold)] transition group-hover:scale-110" />
                  <div className="mt-3 text-sm font-bold text-blue-50">
                    {career}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IMPORTANT INFORMATION */}
        <section className="section-space">
          <div className="container-page">
            <SectionHeading
              eyebrow="Plan ahead"
              title="Important admission information"
              description="Keep these points in mind while planning your admission."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <InfoPanel
                icon={CalendarDays}
                title="Admission Dates"
                text="Admission schedules, deadlines and important dates should be confirmed with the college."
              />
              <InfoPanel
                icon={Clock3}
                title="Timely Submission"
                text="Submit applications and supporting documents within the announced admission timeline."
              />
              <InfoPanel
                icon={ShieldCheck}
                title="Official Information"
                text="Always verify course, fee and eligibility information through the college before making decisions."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[var(--blue)] to-[var(--navy)] py-20 text-white">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="container-page relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-blue-200">
                <Sparkles className="h-4 w-4 text-[var(--gold)]" />
                Take the next step
              </div>

              <h2 className="mt-3 max-w-3xl text-3xl font-black sm:text-4xl">
                Ready to begin your college journey?
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100">
                Explore courses, ask your admission questions and connect with
                The National Degree College, Bagepalli.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-[var(--navy)] transition hover:-translate-y-1"
              >
                Explore Courses
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-3 font-black text-[var(--navy)] transition hover:-translate-y-1"
              >
                Contact College
                <Phone className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CONTACT STRIP */}
        <section className="border-t border-slate-200 bg-white">
          <div className="container-page flex flex-col gap-4 py-7 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-[var(--blue)]" />
              <span>For admission enquiries, contact the college.</span>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-black text-[var(--blue)]"
            >
              Contact Admissions
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof GraduationCap;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[var(--blue)] shadow-sm">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3 className="text-sm font-black text-[var(--navy)]">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
      </div>
    </div>
  );
}

function Highlight({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof GraduationCap;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-[var(--blue)]">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3 className="font-black text-[var(--navy)]">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
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
        className={`mt-3 text-3xl font-black tracking-tight sm:text-4xl ${
          dark ? "text-white" : "text-[var(--navy)]"
        }`}
      >
        {title}
      </h2>

      <p
        className={`mt-4 text-sm leading-7 ${
          dark ? "text-blue-100" : "text-slate-500"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function Requirement({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
      <span className="text-sm leading-6 text-slate-600">{text}</span>
    </div>
  );
}

function MiniStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <div className="text-sm font-black text-[var(--navy)]">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </div>
  );
}

function InfoPanel({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof CalendarDays;
  title: string;
  text: string;
}) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-[var(--blue)] transition group-hover:bg-[var(--blue)] group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-5 text-lg font-black text-[var(--navy)]">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-slate-500">{text}</p>
    </article>
  );
}

