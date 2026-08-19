"use client";

import { FormEvent, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";

import PublicShell from "@/components/public/PublicShell";

const categories = [
  "General",
  "Admissions",
  "BCA Course",
  "Fees",
  "Academic",
  "Student Support",
  "Faculty",
  "Technical Support",
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  category: "General",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [queryId, setQueryId] = useState("");

  function updateField(
    field: keyof typeof initialForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setSuccess(false);
    setError("");
    setQueryId("");

    try {
      const response = await fetch("/api/queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to submit your query."
        );
      }

      setSuccess(true);
      setQueryId(data.queryId || "");
      setForm(initialForm);
    } catch (submitError) {
      console.error("Contact form error:", submitError);

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit your query. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicShell>
      <main className="bg-[var(--bg)]">

        {/* HERO */}
        <section className="gradient-academic">
          <div className="container-page py-16 lg:py-20">
            <div className="max-w-3xl text-white">

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
                <Mail className="h-4 w-4 text-[var(--gold)]" />
                Contact Us
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
                We are here to help.
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
                Have a question about BCA admissions, academics,
                fees, student services or the college? Send us
                your query and our team will get back to you.
              </p>

            </div>
          </div>
        </section>

        {/* CONTACT CONTENT */}
        <section className="-mt-8 relative z-10 pb-20">
          <div className="container-page">

            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">

              {/* LEFT */}
              <div className="space-y-5">

                <ContactCard
                  icon={MapPin}
                  title="Visit the College"
                  text="The National Degree College, Bagepalli"
                  detail="Bagepalli, Karnataka"
                />

                <ContactCard
                  icon={Phone}
                  title="Phone"
                  text="Contact the college office"
                  detail="Use the official college contact number"
                />

                <ContactCard
                  icon={Mail}
                  title="Email"
                  text="General enquiries"
                  detail="Use the official college email address"
                />

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                  <div className="flex items-start gap-3">

                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm">
                      <Clock3 className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-extrabold text-emerald-900">
                        Live Query Support
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-emerald-800/80">
                        Your message is saved securely and
                        forwarded to the configured college
                        administration email.
                      </p>
                    </div>

                  </div>
                </div>

              </div>

              {/* FORM */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--blue)]">
                      Online Enquiry
                    </div>

                    <h2 className="mt-2 text-2xl font-black text-[var(--navy)]">
                      Send us your query
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Complete the form and submit your message
                      securely.
                    </p>
                  </div>

                  <div className="hidden h-11 w-11 place-items-center rounded-xl bg-blue-50 text-[var(--blue)] sm:grid">
                    <Send className="h-5 w-5" />
                  </div>

                </div>

                {/* SUCCESS */}
                {success && (
                  <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

                    <div className="flex items-start gap-3">

                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />

                      <div>
                        <h3 className="font-extrabold text-emerald-900">
                          Query submitted successfully
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-emerald-800/80">
                          Your query has been saved. The college
                          administration has been notified.
                        </p>

                        {queryId && (
                          <div className="mt-3 inline-flex rounded-lg bg-white px-3 py-2 font-mono text-xs font-bold text-emerald-700">
                            Query ID: {queryId}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* ERROR */}
                {error && (
                  <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700">
                    {error}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="mt-7 space-y-5"
                >

                  <div className="grid gap-5 sm:grid-cols-2">

                    <Field
                      label="Full Name"
                      required
                      value={form.name}
                      onChange={(value) =>
                        updateField("name", value)
                      }
                      placeholder="Enter your full name"
                    />

                    <Field
                      label="Email Address"
                      required
                      type="email"
                      value={form.email}
                      onChange={(value) =>
                        updateField("email", value)
                      }
                      placeholder="you@example.com"
                    />

                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">

                    <Field
                      label="Phone Number"
                      value={form.phone}
                      onChange={(value) =>
                        updateField("phone", value)
                      }
                      placeholder="Optional"
                    />

                    <div>
                      <label className="text-sm font-bold text-slate-700">
                        Category
                      </label>

                      <select
                        value={form.category}
                        onChange={(event) =>
                          updateField(
                            "category",
                            event.target.value
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-50"
                      >
                        {categories.map((category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>

                  <Field
                    label="Subject"
                    required
                    value={form.subject}
                    onChange={(value) =>
                      updateField("subject", value)
                    }
                    placeholder="What is your query about?"
                  />

                  <div>
                    <label className="text-sm font-bold text-slate-700">
                      Your Message
                    </label>

                    <textarea
                      required
                      rows={7}
                      maxLength={5000}
                      value={form.message}
                      onChange={(event) =>
                        updateField(
                          "message",
                          event.target.value
                        )
                      }
                      placeholder="Write your question or message..."
                      className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-50"
                    />

                    <div className="mt-1 text-right text-xs text-slate-400">
                      {form.message.length}/5000
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--blue)]" />

                    <p className="text-xs leading-5 text-slate-500">
                      Your information is submitted securely
                      through the SCMS query system and is used
                      only for handling your enquiry.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending Query...
                      </>
                    ) : (
                      <>
                        Submit Query
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>

                </form>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM INFO */}
        <section className="border-t border-slate-200 bg-white py-12">
          <div className="container-page text-center">

            <h2 className="text-2xl font-black text-[var(--navy)]">
              Need information about BCA?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Ask about admissions, curriculum, eligibility,
              student services or any other BCA-related
              information.
            </p>

          </div>
        </section>

      </main>
    </PublicShell>
  );
}

function ContactCard({
  icon: Icon,
  title,
  text,
  detail,
}: {
  icon: typeof MapPin;
  title: string;
  text: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">

        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[var(--blue)]">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-extrabold text-[var(--navy)]">
            {title}
          </h3>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {text}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {detail}
          </p>
        </div>

      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-50"
      />
    </div>
  );
}