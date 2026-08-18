import QueryForm from "@/components/queries/QueryForm";

export const metadata = {
  title: "Send Query | The National Degree College, Bagepalli",
  description:
    "Send your enquiry to The National Degree College, Bagepalli.",
};

export default function QueryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4 py-12 sm:px-6 lg:px-8">

      <div className="mx-auto mb-10 max-w-4xl text-center">

        <div className="mb-4 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
          THE NATIONAL DEGREE COLLEGE, BAGEPALLI
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          How Can We Help You?
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Submit your question to the college administration.
          Your query will be immediately notified to the
          configured Admin and Faculty Gmail accounts.
        </p>

      </div>

      <QueryForm />

    </main>
  );
}