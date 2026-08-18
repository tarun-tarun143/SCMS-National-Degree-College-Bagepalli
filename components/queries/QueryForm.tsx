"use client";

import { FormEvent, useState } from "react";

const categories = [
  "General Enquiry",
  "Admission",
  "Courses",
  "Fees",
  "Examination",
  "Scholarship",
  "Documents",
  "Attendance",
  "Faculty",
  "Student Services",
  "Technical Support",
  "Other",
];

export default function QueryForm() {
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "General Enquiry",
    subject: "",
    message: "",
  });

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/queries", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to submit your query."
        );
      }

      if (!data.success) {
        throw new Error(
          data?.message || "Unable to submit your query."
        );
      }

      setSuccess(
        `${data.message} Your Query ID is ${data.queryId}.`
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        category: "General Enquiry",
        subject: "",
        message: "",
      });
    } catch (submitError) {
      console.error("QUERY SUBMISSION ERROR:", submitError);

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">

      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700">
          Smart College Management System
        </p>

        <h2 className="text-3xl font-bold text-slate-900">
          Send Your Query
        </h2>

        <p className="mt-2 text-slate-600">
          Contact The National Degree College, Bagepalli.
          Your query will be forwarded to the appropriate
          college administration or faculty member.
        </p>
      </div>

      {success && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          <strong>Submitted successfully.</strong>
          <br />
          {success}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <strong>Submission failed.</strong>
          <br />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Full Name *
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={100}
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email Address *
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              maxLength={20}
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Query Category *
            </label>

            <select
              id="category"
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div>
          <label
            htmlFor="subject"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Subject *
          </label>

          <input
            id="subject"
            name="subject"
            type="text"
            required
            maxLength={200}
            value={form.subject}
            onChange={handleChange}
            placeholder="What is your query about?"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Your Query *
          </label>

          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={7}
            value={form.message}
            onChange={handleChange}
            placeholder="Write your query here..."
            className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

          <p className="mt-2 text-right text-xs text-slate-500">
            {form.message.length}/5000
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-700 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Submitting Query..." : "Submit Query"}
        </button>

      </form>
    </div>
  );
}