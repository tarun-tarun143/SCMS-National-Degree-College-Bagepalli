"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Code2,
  Cpu,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
  Monitor,
  Phone,
  Send,
  Server,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react";
import { FormEvent, useState } from "react";

import PublicShell from "@/components/public/PublicShell";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to send your message."
        );
      }

      setSuccess(
        data?.message ||
          "Your enquiry has been sent successfully. The college administration will contact you soon."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (submitError) {
      console.error("Contact form error:", submitError);

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to send your message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PublicShell>
      <main className="overflow-hidden bg-[var(--bg)]">
        {/* =========================================================
            HERO
        ========================================================== */}
        <section className="relative isolate overflow-hidden bg-[var(--navy)] py-20 text-white sm:py-24">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl animate-[blobMove_9s_ease-in-out_infinite]" />

            <div className="absolute -right-40 top-10 h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl animate-[blobMove_11s_ease-in-out_infinite_reverse]" />

            <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[var(--gold)]/10 blur-3xl animate-pulse" />

            <FloatingParticle
              className="left-[8%] top-[25%]"
              delay="0s"
            />

            <FloatingParticle
              className="left-[18%] top-[70%]"
              delay="1s"
            />

            <FloatingParticle
              className="left-[43%] top-[20%]"
              delay="2s"
            />

            <FloatingParticle
              className="right-[28%] top-[32%]"
              delay="1.5s"
            />

            <FloatingParticle
              className="right-[10%] top-[65%]"
              delay="0.5s"
            />

            <FloatingParticle
              className="bottom-[15%] right-[45%]"
              delay="2.5s"
            />
          </div>

          <div className="container-page relative">
            <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.85fr]">
              {/* Hero text */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-100 shadow-lg backdrop-blur-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>

                  College Support • Online
                </div>

                <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                  Let&apos;s connect
                  <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-[var(--gold)] bg-clip-text text-transparent">
                    & build the future.
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
                  Have a question about admissions, courses, academics,
                  events or the Smart College Management System? Send us a
                  message and our college team will help you.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <ContactBadge
                    icon={ShieldCheck}
                    text="Secure communication"
                  />

                  <ContactBadge
                    icon={Wifi}
                    text="Live digital campus"
                  />

                  <ContactBadge
                    icon={Cpu}
                    text="Technology enabled"
                  />
                </div>
              </div>

              {/* Animated computer */}
              <div className="relative mx-auto w-full max-w-xl">
                <div className="absolute inset-0 rounded-[2rem] bg-blue-500/20 blur-3xl animate-pulse" />

                <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-xl">
                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
                    {/* Browser bar */}
                    <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                      <span className="h-3 w-3 rounded-full bg-red-400/80" />
                      <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                      <span className="h-3 w-3 rounded-full bg-emerald-400/80" />

                      <div className="ml-3 flex-1 rounded-lg bg-white/5 px-3 py-1.5 text-[10px] text-slate-500">
                        scms.nationaldegreecollege.edu
                      </div>
                    </div>

                    {/* Terminal */}
                    <div className="relative mt-5 min-h-[280px] overflow-hidden rounded-2xl border border-blue-400/10 bg-[#07101f] p-5">
                      <div className="absolute right-5 top-5">
                        <Monitor className="h-10 w-10 animate-pulse text-blue-400/40" />
                      </div>

                      <div className="font-mono text-xs leading-7 sm:text-sm">
                        <div className="text-emerald-400">
                          $ connect --college
                        </div>

                        <div className="text-slate-500">
                          Initializing secure campus network...
                        </div>

                        <div className="text-blue-300">
                          ✓ Authentication service ready
                        </div>

                        <div className="text-blue-300">
                          ✓ Student services connected
                        </div>

                        <div className="text-blue-300">
                          ✓ Academic database connected
                        </div>

                        <div className="text-blue-300">
                          ✓ Administration online
                        </div>

                        <div className="mt-3 text-[var(--gold)]">
                          &gt; Waiting for your message...
                          <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-[var(--gold)] align-middle" />
                        </div>
                      </div>

                      {/* Scanning line */}
                      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px animate-[scan_4s_linear_infinite] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70" />
                    </div>

                    {/* Computer footer */}
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <TechStatus
                        icon={Server}
                        text="Server"
                      />

                      <TechStatus
                        icon={Code2}
                        text="Software"
                      />

                      <TechStatus
                        icon={Wifi}
                        text="Network"
                      />
                    </div>
                  </div>
                </div>

                {/* Floating icons */}
                <FloatingIcon
                  icon={Cpu}
                  className="-left-5 top-16"
                  delay="0s"
                />

                <FloatingIcon
                  icon={Code2}
                  className="-right-5 bottom-20"
                  delay="1.2s"
                />

                <FloatingIcon
                  icon={Sparkles}
                  className="right-10 -top-7"
                  delay="2s"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CONTACT INFORMATION
        ========================================================== */}
        <section className="relative bg-white py-16 sm:py-20">
          <div className="container-page">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <ContactCard
                icon={MapPin}
                title="Visit us"
                text="The National Degree College, Bagepalli, Karnataka"
                href="https://www.google.com/maps/search/The+National+Degree+College+Bagepalli"
              />

              <ContactCard
                icon={Phone}
                title="Call us"
                text="Contact the college office for assistance."
              />

              <ContactCard
                icon={Mail}
                title="Email"
                text="Send an enquiry through the secure contact form."
              />

              <ContactCard
                icon={Clock3}
                title="Office hours"
                text="Monday – Saturday • College working hours"
              />
            </div>
          </div>
        </section>

        {/* =========================================================
            CONTACT FORM
        ========================================================== */}
        <section className="relative overflow-hidden py-20 sm:py-24">
          {/* Animated background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl animate-[blobMove_8s_ease-in-out_infinite]" />

            <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl animate-[blobMove_10s_ease-in-out_infinite_reverse]" />

            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-3xl animate-pulse" />

            {/* Tiny decorative particles */}
            <span className="absolute left-[10%] top-[20%] h-2 w-2 rounded-full bg-blue-400/50 animate-[particleFloat_5s_ease-in-out_infinite]" />

            <span className="absolute right-[15%] top-[30%] h-1.5 w-1.5 rounded-full bg-violet-400/60 animate-[particleFloat_4s_ease-in-out_infinite]" />

            <span className="absolute bottom-[20%] left-[35%] h-2 w-2 rounded-full bg-cyan-400/50 animate-[particleFloat_6s_ease-in-out_infinite]" />
          </div>

          <div className="container-page relative">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              {/* LEFT INFORMATION */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-blue-700 shadow-sm">
                  <MessageSquare className="h-4 w-4" />
                  Contact support
                </div>

                <h2 className="mt-5 text-4xl font-black tracking-tight text-[var(--navy)] sm:text-5xl">
                  We&apos;re here to
                  <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent">
                    help you.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
                  Send your question directly through our college enquiry
                  system. Your message is securely processed and forwarded
                  to the administration team.
                </p>

                <div className="mt-8 space-y-4">
                  <InfoRow
                    icon={GraduationCap}
                    title="Academic enquiries"
                    text="Courses, departments, subjects and student services."
                  />

                  <InfoRow
                    icon={Monitor}
                    title="Digital campus"
                    text="Help with the Smart College Management System."
                  />

                  <InfoRow
                    icon={ShieldCheck}
                    title="Secure communication"
                    text="Your enquiry is handled through the college system."
                  />
                </div>

                {/* Support card */}
                <div className="relative mt-8 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-cyan-50 to-violet-50 p-5 shadow-sm">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl" />

                  <div className="relative flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                    <div>
                      <h3 className="font-black text-[var(--navy)]">
                        Fast & professional support
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Please provide accurate contact details so the
                        college team can respond to your enquiry.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FORM */}
              <div className="relative">
                {/* Animated border */}
                <div className="absolute -inset-[2px] rounded-[2rem] bg-[linear-gradient(120deg,#2563eb,#06b6d4,#8b5cf6,#f59e0b,#2563eb)] bg-[length:300%_300%] opacity-70 blur-[2px] animate-[gradientMove_6s_ease_infinite]" />

                <div className="relative rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8">
                  {/* Form header */}
                  <div className="mb-6 flex items-center gap-3">
                    <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-violet-600 text-white shadow-lg shadow-blue-500/25">
                      <Send className="relative z-10 h-6 w-6" />

                      <span className="absolute inset-0 animate-ping rounded-2xl bg-blue-400/20" />
                    </div>

                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                        Digital Support
                      </div>

                      <h3 className="mt-1 text-2xl font-black text-[var(--navy)]">
                        Send us a message
                      </h3>
                    </div>
                  </div>

                  <p className="mb-7 text-sm text-slate-500">
                    Fill in the details below and our college team will
                    get back to you.
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* Name + Email */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <AnimatedInput
                        label="Full name"
                        value={form.name}
                        placeholder="Your name"
                        required
                        onChange={(value) =>
                          setForm((current) => ({
                            ...current,
                            name: value,
                          }))
                        }
                      />

                      <AnimatedInput
                        label="Email address"
                        type="email"
                        value={form.email}
                        placeholder="you@example.com"
                        required
                        onChange={(value) =>
                          setForm((current) => ({
                            ...current,
                            email: value,
                          }))
                        }
                      />
                    </div>

                    {/* Phone + Subject */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <AnimatedInput
                        label="Phone number"
                        type="tel"
                        value={form.phone}
                        placeholder="Your phone number"
                        onChange={(value) =>
                          setForm((current) => ({
                            ...current,
                            phone: value,
                          }))
                        }
                      />

                      <AnimatedInput
                        label="Subject"
                        value={form.subject}
                        placeholder="What is your enquiry about?"
                        required
                        onChange={(value) =>
                          setForm((current) => ({
                            ...current,
                            subject: value,
                          }))
                        }
                      />
                    </div>

                    {/* Message */}
                    <div className="group relative">
                      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                        Message
                        <span className="text-xs font-black text-rose-500">
                          *
                        </span>
                      </label>

                      <div className="relative">
                        <div className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 opacity-0 blur-sm transition duration-500 group-focus-within:opacity-60" />

                        <textarea
                          value={form.message}
                          required
                          maxLength={1000}
                          rows={6}
                          placeholder="Tell us how we can help you..."
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              message: event.target.value,
                            }))
                          }
                          className="relative z-10 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition-all duration-300 hover:border-blue-300 hover:bg-white focus:border-transparent focus:bg-white focus:ring-4 focus:ring-blue-100 focus:shadow-[0_12px_40px_rgba(37,99,235,0.12)]"
                        />

                        <span className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 transition-all duration-500 group-focus-within:w-[90%]" />
                      </div>

                      <div className="mt-2 flex justify-between">
                        <span className="text-[11px] text-slate-400">
                          Your message is securely processed.
                        </span>

                        <span className="text-[11px] font-medium text-slate-400">
                          {form.message.length}/1000
                        </span>
                      </div>
                    </div>

                    {/* Success */}
                    {success && (
                      <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-4 text-sm text-emerald-800 animate-[messageIn_0.4s_ease-out]">
                        <div className="flex items-start gap-3">
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          </div>

                          <div>
                            <p className="font-bold">
                              Enquiry sent successfully!
                            </p>

                            <p className="mt-1 leading-6">
                              {success}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Error */}
                    {error && (
                      <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-4 text-sm text-red-700 animate-[messageIn_0.4s_ease-out]">
                        <div className="flex items-start gap-3">
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-red-100">
                            !
                          </div>

                          <div>
                            <p className="font-bold">
                              Unable to send enquiry
                            </p>

                            <p className="mt-1 leading-6">
                              {error}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 px-6 py-4 font-black text-white shadow-[0_12px_35px_rgba(37,99,235,0.25)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(37,99,235,0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {/* Shine */}
                      <span className="pointer-events-none absolute inset-y-0 -left-24 w-20 rotate-12 bg-white/30 blur-md transition-all duration-1000 group-hover:left-[120%]" />

                      {/* Glow */}
                      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition duration-300 group-hover:opacity-100" />

                      {submitting ? (
                        <>
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                          <span className="animate-pulse">
                            Sending enquiry...
                          </span>
                        </>
                      ) : (
                        <>
                          <Send className="relative h-5 w-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />

                          <span className="relative">
                            Send Enquiry
                          </span>

                          <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs leading-5 text-slate-400">
                      By submitting this form, you agree that the college
                      may use the provided information to respond to your
                      enquiry.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            FINAL CTA
        ========================================================== */}
        <section className="relative overflow-hidden bg-[var(--navy)] py-16 text-white">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          </div>

          <div className="container-page relative">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                  <MapPin className="h-4 w-4 text-[var(--gold)]" />

                  The National Degree College, Bagepalli
                </div>

                <h2 className="mt-3 max-w-2xl text-3xl font-black sm:text-4xl">
                  Your next step starts with a conversation.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100">
                  Explore our courses, learn about admissions or connect
                  with the college through the SCMS digital campus.
                </p>
              </div>

              <Link
                href="/courses"
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-6 py-3 font-black text-[var(--navy)] shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Explore Courses

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================
          ANIMATIONS
      ========================================================== */}
      <style jsx global>{`
        @keyframes gradientMove {
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

        @keyframes scan {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          85% {
            opacity: 1;
          }

          100% {
            transform: translateY(300px);
            opacity: 0;
          }
        }

        @keyframes floatTech {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }

          50% {
            transform: translateY(-12px) rotate(4deg);
          }
        }

        @keyframes particleFloat {
          0%,
          100% {
            transform: translateY(0px);
            opacity: 0.25;
          }

          50% {
            transform: translateY(-18px);
            opacity: 0.9;
          }
        }

        @keyframes blobMove {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }

          25% {
            transform: translate(30px, -20px) scale(1.08);
          }

          50% {
            transform: translate(-20px, 30px) scale(0.95);
          }

          75% {
            transform: translate(20px, 20px) scale(1.05);
          }
        }

        @keyframes messageIn {
          0% {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </PublicShell>
  );
}

/* =========================================================
   CONTACT BADGE
========================================================= */

function ContactBadge({
  icon: Icon,
  text,
}: {
  icon: typeof ShieldCheck;
  text: string;
}) {
  return (
    <div className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-blue-100 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-500/10">
      <Icon className="h-4 w-4 text-[var(--gold)] transition-transform duration-300 group-hover:scale-110" />

      {text}
    </div>
  );
}

/* =========================================================
   TECH STATUS
========================================================= */

function TechStatus({
  icon: Icon,
  text,
}: {
  icon: typeof Server;
  text: string;
}) {
  return (
    <div className="group flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-[10px] font-semibold text-slate-400 transition duration-300 hover:border-cyan-400/20 hover:bg-white/[0.06]">
      <Icon className="h-3.5 w-3.5 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />

      <span>{text}</span>

      <span className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
    </div>
  );
}

/* =========================================================
   FLOATING PARTICLE
========================================================= */

function FloatingParticle({
  className,
  delay,
}: {
  className: string;
  delay: string;
}) {
  return (
    <span
      className={`absolute h-1.5 w-1.5 rounded-full bg-cyan-300/60 ${className}`}
      style={{
        animation: "particleFloat 4s ease-in-out infinite",
        animationDelay: delay,
      }}
    />
  );
}

/* =========================================================
   FLOATING ICON
========================================================= */

function FloatingIcon({
  icon: Icon,
  className,
  delay,
}: {
  icon: typeof Cpu;
  className: string;
  delay: string;
}) {
  return (
    <div
      className={`absolute z-10 grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/10 text-cyan-300 shadow-xl backdrop-blur ${className}`}
      style={{
        animation: "floatTech 4s ease-in-out infinite",
        animationDelay: delay,
      }}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}

/* =========================================================
   CONTACT CARD
========================================================= */

function ContactCard({
  icon: Icon,
  title,
  text,
  href,
}: {
  icon: typeof MapPin;
  title: string;
  text: string;
  href?: string;
}) {
  const content = (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl">
      {/* Glow */}
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-50 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-cyan-100" />

      {/* Gradient line */}
      <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 transition-transform duration-500 group-hover:scale-x-100" />

      <div className="relative">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-[var(--blue)] transition duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-cyan-500 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>

        <h3 className="mt-4 font-black text-[var(--navy)]">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof GraduationCap;
  title: string;
  text: string;
}) {
  return (
    <div className="group flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-md">
      <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[var(--blue)] transition duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-cyan-500 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3 className="font-black text-[var(--navy)]">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   ANIMATED INPUT
========================================================= */

function AnimatedInput({
  label,
  value,
  placeholder,
  type = "text",
  required = false,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="group relative">
      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
        <span>{label}</span>

        {required && (
          <span className="text-xs font-black text-rose-500">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {/* Focus glow */}
        <div className="pointer-events-none absolute -inset-[1px] rounded-xl bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 opacity-0 blur-sm transition duration-500 group-focus-within:opacity-60" />

        <input
          type={type}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="relative z-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white focus:-translate-y-1 focus:border-transparent focus:bg-white focus:ring-4 focus:ring-blue-100 focus:shadow-[0_10px_35px_rgba(37,99,235,0.12)]"
        />

        {/* Focus line */}
        <span className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 transition-all duration-500 group-focus-within:w-[90%]" />
      </div>
    </div>
  );
}