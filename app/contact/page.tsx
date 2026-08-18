import QueryForm from "@/components/queries/QueryForm";

export const metadata = {
  title: "Contact | The National Degree College, Bagepalli",
  description:
    "Contact The National Degree College, Bagepalli and submit your enquiry.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
            THE NATIONAL DEGREE COLLEGE, BAGEPALLI
          </span>

          <h1 className="mt-5 text-4xl font-extrabold text-slate-900 sm:text-5xl">
            Contact Us
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Have a question about admissions, courses, fees,
            examinations or student services? Send us your query.
          </p>
        </div>
      </section>

      {/* Contact + Query */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          
          {/* College Information */}
          <div className="rounded-2xl bg-slate-900 p-8 text-white shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">
              College Contact
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              The National Degree College
            </h2>

            <p className="mt-2 text-slate-300">
              Bagepalli
            </p>

            <div className="mt-10 space-y-6">
              <div>
                <p className="text-sm text-slate-400">
                  Email
                </p>

                <p className="mt-1 font-medium">
                  Contact the college administration
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Query Response
                </p>

                <p className="mt-1 font-medium">
                  Your query is forwarded to the configured
                  Admin and Faculty email accounts.
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Availability
                </p>

                <p className="mt-1 font-medium">
                  Submit your query anytime through SCMS.
                </p>
              </div>
            </div>
          </div>

          {/* Client Component */}
          <QueryForm />
        </div>
      </section>
    </main>
  );
}