import PublicShell from "@/components/public/PublicShell";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  CheckCircle2,
  FileText,
  ClipboardCheck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

const admissionSteps: {
  icon: LucideIcon;
  title: string;
  text: string;
}[] = [
  {
    icon: FileText,
    title: "Application",
    text: "Submit applicant details and course preference.",
  },
  {
    icon: ClipboardCheck,
    title: "Verification",
    text: "Review application and documents.",
  },
  {
    icon: UserCheck,
    title: "Decision",
    text: "Approve or return for corrections.",
  },
  {
    icon: CheckCircle2,
    title: "Enrollment",
    text: "Create student record and portal access.",
  },
];

export default function Admissions() {
  return (
    <PublicShell>
      <main>
        <section className="bg-slate-50 py-16">
          <div className="container-page">
            <SectionTitle
              eyebrow="Admissions"
              title="A clearer path from enquiry to enrollment"
              description="The admission module is designed to help applicants move through application, document verification and approval in a structured way."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-4">
              {admissionSteps.map(
                ({ icon: Icon, title, text }, index) => (
                  <div
                    className="card p-6"
                    key={index}
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-[var(--blue)]">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h2 className="mt-5 font-extrabold text-[var(--navy)]">
                      {title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {text}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}