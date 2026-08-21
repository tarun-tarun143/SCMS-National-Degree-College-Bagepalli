"use client";

import { useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Download,
  FileText,
  GraduationCap,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";

import {
  collection,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type Firestore,
  type Unsubscribe,
} from "firebase/firestore";

/* ============================================================
   TYPES
============================================================ */

type ReportCounts = {
  students: number;
  faculty: number;
  attendance: number;
  fees: number;
  exams: number;
  results: number;
  notices: number;
  events: number;
  pendingApprovals: number;
};

type ReportType =
  | "overview"
  | "students"
  | "faculty"
  | "attendance"
  | "fees"
  | "exams"
  | "results"
  | "notices"
  | "events";

type ReportTypeDefinition = {
  value: ReportType;
  label: string;
  description: string;
  icon: React.ElementType;
};

const emptyCounts: ReportCounts = {
  students: 0,
  faculty: 0,
  attendance: 0,
  fees: 0,
  exams: 0,
  results: 0,
  notices: 0,
  events: 0,
  pendingApprovals: 0,
};

const reportTypes: ReportTypeDefinition[] = [
  {
    value: "overview",
    label: "Overview",
    description: "Institution-wide summary",
    icon: BarChart3,
  },
  {
    value: "students",
    label: "Students",
    description: "Student records",
    icon: Users,
  },
  {
    value: "faculty",
    label: "Faculty",
    description: "Faculty records",
    icon: GraduationCap,
  },
  {
    value: "attendance",
    label: "Attendance",
    description: "Attendance records",
    icon: ClipboardCheck,
  },
  {
    value: "fees",
    label: "Fees",
    description: "Fee records",
    icon: CreditCard,
  },
  {
    value: "exams",
    label: "Exams",
    description: "Examination records",
    icon: CalendarDays,
  },
  {
    value: "results",
    label: "Results",
    description: "Academic results",
    icon: FileText,
  },
  {
    value: "notices",
    label: "Notices",
    description: "Published notices",
    icon: Bell,
  },
  {
    value: "events",
    label: "Events",
    description: "College events",
    icon: CalendarDays,
  },
];

/* ============================================================
   PAGE
============================================================ */

export default function ReportsPage() {
  const [counts, setCounts] =
    useState<ReportCounts>(emptyCounts);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const [search, setSearch] =
    useState("");

  const [selectedReport, setSelectedReport] =
    useState<ReportType>("overview");

  const [studentStatuses, setStudentStatuses] =
    useState<Record<string, number>>({});

  const [facultyStatuses, setFacultyStatuses] =
    useState<Record<string, number>>({});

  /* ==========================================================
     REAL-TIME FIRESTORE LISTENERS
  ========================================================== */

  useEffect(() => {
    const db = firestoreDb;

    if (!db) {
      setError(
        "Firestore is not initialized. Check your Firebase configuration."
      );
      setLoading(false);
      return;
    }

    let mounted = true;
    let completedListeners = 0;
    let activeListeners = 0;

    const unsubscribers: Unsubscribe[] = [];

    const markLoaded = () => {
      completedListeners += 1;

      if (
        mounted &&
        completedListeners >= activeListeners
      ) {
        setLoading(false);
      }
    };

    const listenToCollection = (
      collectionName: string,
      callback: (
        snapshot: {
          size: number;
          docs: Array<{
            data: () => DocumentData;
          }>;
        }
      ) => void,
      errorMessage: string
    ) => {
      activeListeners += 1;

      const unsubscribe = onSnapshot(
        collection(db, collectionName),
        (snapshot) => {
          if (!mounted) {
            return;
          }

          callback(snapshot);
          setLastUpdated(new Date());
          markLoaded();
        },
        (listenerError) => {
          console.error(
            `${collectionName} report listener error:`,
            listenerError
          );

          if (mounted) {
            setError(
              listenerError instanceof Error
                ? listenerError.message
                : errorMessage
            );

            markLoaded();
          }
        }
      );

      unsubscribers.push(unsubscribe);
    };

    setLoading(true);
    setError("");

    /* Students */

    listenToCollection(
      "students",
      (snapshot) => {
        const statusCounts: Record<string, number> =
          {};

        snapshot.docs.forEach((item) => {
          const data = item.data();

          const status = String(
            data.status ?? "Unknown"
          );

          statusCounts[status] =
            (statusCounts[status] ?? 0) + 1;
        });

        setStudentStatuses(statusCounts);

        setCounts((current) => ({
          ...current,
          students: snapshot.size,
        }));
      },
      "Unable to read student reports."
    );

    /* Faculty */

    listenToCollection(
      "faculty",
      (snapshot) => {
        const statusCounts: Record<string, number> =
          {};

        snapshot.docs.forEach((item) => {
          const data = item.data();

          const status = String(
            data.status ?? "Unknown"
          );

          statusCounts[status] =
            (statusCounts[status] ?? 0) + 1;
        });

        setFacultyStatuses(statusCounts);

        setCounts((current) => ({
          ...current,
          faculty: snapshot.size,
        }));
      },
      "Unable to read faculty reports."
    );

    /* Attendance */

    listenToCollection(
      "attendance",
      (snapshot) => {
        setCounts((current) => ({
          ...current,
          attendance: snapshot.size,
        }));
      },
      "Unable to read attendance reports."
    );

    /* Fees */

    listenToCollection(
      "fees",
      (snapshot) => {
        setCounts((current) => ({
          ...current,
          fees: snapshot.size,
        }));
      },
      "Unable to read fee reports."
    );

    /* Exams */

    listenToCollection(
      "exams",
      (snapshot) => {
        setCounts((current) => ({
          ...current,
          exams: snapshot.size,
        }));
      },
      "Unable to read examination reports."
    );

    /* Results */

    listenToCollection(
      "results",
      (snapshot) => {
        setCounts((current) => ({
          ...current,
          results: snapshot.size,
        }));
      },
      "Unable to read result reports."
    );

    /* Published Notices */

    activeListeners += 1;

    const noticesQuery = query(
      collection(db, "notices"),
      where("status", "==", "published")
    );

    const unsubscribeNotices = onSnapshot(
      noticesQuery,
      (snapshot) => {
        if (!mounted) {
          return;
        }

        setCounts((current) => ({
          ...current,
          notices: snapshot.size,
        }));

        setLastUpdated(new Date());
        markLoaded();
      },
      (listenerError) => {
        console.error(
          "Notices report listener error:",
          listenerError
        );

        if (mounted) {
          setError(
            listenerError instanceof Error
              ? listenerError.message
              : "Unable to read notice reports."
          );

          markLoaded();
        }
      }
    );

    unsubscribers.push(unsubscribeNotices);

    /* Events */

    listenToCollection(
      "events",
      (snapshot) => {
        setCounts((current) => ({
          ...current,
          events: snapshot.size,
        }));
      },
      "Unable to read event reports."
    );

    /* Pending approvals */

    activeListeners += 1;

    const unsubscribeUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        if (!mounted) {
          return;
        }

        let pending = 0;

        snapshot.docs.forEach((item) => {
          const data = item.data();

          const role = String(
            data.role ?? ""
          ).toLowerCase();

          const status = String(
            data.status ?? ""
          ).toLowerCase();

          const approvalStatus = String(
            data.approvalStatus ?? ""
          ).toLowerCase();

          const isPending =
            status === "pending" ||
            approvalStatus === "pending";

          const isStudentOrFaculty =
            role === "student" ||
            role === "faculty";

          if (
            isPending &&
            isStudentOrFaculty
          ) {
            pending += 1;
          }
        });

        setCounts((current) => ({
          ...current,
          pendingApprovals: pending,
        }));

        setLastUpdated(new Date());
        markLoaded();
      },
      (listenerError) => {
        console.error(
          "Users approval report listener error:",
          listenerError
        );

        if (mounted) {
          setError(
            listenerError instanceof Error
              ? listenerError.message
              : "Unable to read approval reports."
          );

          markLoaded();
        }
      }
    );

    unsubscribers.push(unsubscribeUsers);

    return () => {
      mounted = false;

      unsubscribers.forEach(
        (unsubscribe) => unsubscribe()
      );
    };
  }, []);

  /* ==========================================================
     DERIVED DATA
  ========================================================== */

  const totalRecords = useMemo(
    () =>
      counts.students +
      counts.faculty +
      counts.attendance +
      counts.fees +
      counts.exams +
      counts.results +
      counts.notices +
      counts.events,
    [counts]
  );

  const reportCards = useMemo(
    () => [
      {
        key: "students" as ReportType,
        label: "Students",
        description:
          "Registered student records",
        value: counts.students,
        icon: Users,
        gradient:
          "from-blue-600 to-cyan-500",
      },
      {
        key: "faculty" as ReportType,
        label: "Faculty",
        description:
          "Registered faculty records",
        value: counts.faculty,
        icon: GraduationCap,
        gradient:
          "from-violet-600 to-purple-500",
      },
      {
        key: "attendance" as ReportType,
        label: "Attendance",
        description:
          "Attendance records",
        value: counts.attendance,
        icon: ClipboardCheck,
        gradient:
          "from-emerald-600 to-teal-500",
      },
      {
        key: "fees" as ReportType,
        label: "Fees",
        description:
          "Fee records",
        value: counts.fees,
        icon: CreditCard,
        gradient:
          "from-orange-500 to-amber-500",
      },
      {
        key: "exams" as ReportType,
        label: "Exams",
        description:
          "Configured examinations",
        value: counts.exams,
        icon: CalendarDays,
        gradient:
          "from-pink-600 to-rose-500",
      },
      {
        key: "results" as ReportType,
        label: "Results",
        description:
          "Academic result records",
        value: counts.results,
        icon: FileText,
        gradient:
          "from-indigo-600 to-blue-500",
      },
      {
        key: "notices" as ReportType,
        label: "Notices",
        description:
          "Published notices",
        value: counts.notices,
        icon: Bell,
        gradient:
          "from-fuchsia-600 to-pink-500",
      },
      {
        key: "events" as ReportType,
        label: "Events",
        description:
          "College event records",
        value: counts.events,
        icon: CalendarDays,
        gradient:
          "from-cyan-600 to-sky-500",
      },
    ],
    [counts]
  );

  const filteredReports = useMemo(() => {
    const term = search
      .trim()
      .toLowerCase();

    if (!term) {
      return reportTypes;
    }

    return reportTypes.filter(
      (item) =>
        item.label
          .toLowerCase()
          .includes(term) ||
        item.description
          .toLowerCase()
          .includes(term)
    );
  }, [search]);

  const selectedReportInfo =
    reportTypes.find(
      (item) =>
        item.value === selectedReport
    );

  /* ==========================================================
     ACTIONS
  ========================================================== */

  function handlePrint() {
    window.print();
  }

  function handleExportCSV() {
    const rows = [
      [
        "Report",
        "Total Records",
        "Description",
      ],
      [
        "Students",
        counts.students,
        "Registered student records",
      ],
      [
        "Faculty",
        counts.faculty,
        "Registered faculty records",
      ],
      [
        "Attendance",
        counts.attendance,
        "Attendance records",
      ],
      [
        "Fees",
        counts.fees,
        "Fee records",
      ],
      [
        "Exams",
        counts.exams,
        "Configured examinations",
      ],
      [
        "Results",
        counts.results,
        "Academic result records",
      ],
      [
        "Published Notices",
        counts.notices,
        "Published notice records",
      ],
      [
        "Events",
        counts.events,
        "College event records",
      ],
      [
        "Pending Approvals",
        counts.pendingApprovals,
        "Pending student/faculty registrations",
      ],
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = `scms-report-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  }

  function handleRefresh() {
    /*
     * Firestore listeners already keep the page live.
     * This only gives the user visual feedback.
     */

    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
      setLastUpdated(new Date());
    }, 450);
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <PortalShell
      role="admin"
      title="Reports"
    >
      <main className="space-y-8 pb-10 print:bg-white">
        <PageHeading
          eyebrow="Administration"
          title="Institutional Reports"
          description="Monitor live college data and generate professional administrative reports from one centralized reporting workspace."
        />

        {/* ERROR */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div className="min-w-0 flex-1">
                <p className="font-black text-red-800">
                  Report data could not be loaded
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* REAL-TIME STATUS */}

        <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>

              <span className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">
                Real-time reporting
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              All report totals update automatically from Firestore.
            </p>

            {lastUpdated && (
              <p className="mt-1 text-[11px] font-semibold text-slate-400">
                Last update:{" "}
                {lastUpdated.toLocaleTimeString(
                  "en-IN"
                )}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </section>

        {/* STAT CARDS */}

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {reportCards.map((card) => (
            <ReportStatCard
              key={card.key}
              label={card.label}
              description={card.description}
              value={card.value}
              icon={card.icon}
              gradient={card.gradient}
              loading={loading}
              active={
                selectedReport ===
                card.key
              }
              onClick={() =>
                setSelectedReport(
                  card.key
                )
              }
            />
          ))}
        </section>

        {/* REPORT CENTER */}

        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                  Report center
                </p>

                <h2 className="mt-2 text-2xl font-black text-[var(--navy)]">
                  Report Types
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select a report category to inspect its live summary.
                </p>
              </div>

              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>

            <div className="relative mt-5">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search report types..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="mt-5 grid gap-2">
              {filteredReports.map(
                (item) => {
                  const Icon =
                    item.icon;

                  const active =
                    selectedReport ===
                    item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        setSelectedReport(
                          item.value
                        )
                      }
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                        active
                          ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200 hover:bg-white"
                      }`}
                    >
                      <div
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                          active
                            ? "bg-blue-600 text-white"
                            : "bg-white text-slate-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-black">
                          {item.label}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* SELECTED REPORT */}

          <div
            id="report-print-area"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-600">
                  Selected report
                </p>

                <h2 className="mt-2 text-2xl font-black text-[var(--navy)]">
                  {selectedReportInfo?.label ??
                    "Overview"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedReportInfo?.description ??
                    "Institution-wide summary"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 px-4 py-3 text-right">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Total records
                </p>

                <p className="mt-1 text-2xl font-black text-[var(--navy)]">
                  {getSelectedValue(
                    selectedReport,
                    counts
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <SummaryPanel
                title="Institutional Total"
                value={totalRecords}
                description="Combined records across the reporting system."
                icon={DatabaseIcon}
              />

              <SummaryPanel
                title="Pending Approvals"
                value={
                  counts.pendingApprovals
                }
                description="Student and faculty registrations awaiting approval."
                icon={ShieldCheck}
              />
            </div>

            {selectedReport ===
              "students" && (
              <StatusSection
                title="Student Status"
                data={studentStatuses}
                emptyText="No student status records available."
              />
            )}

            {selectedReport ===
              "faculty" && (
              <StatusSection
                title="Faculty Status"
                data={facultyStatuses}
                emptyText="No faculty status records available."
              />
            )}

            {selectedReport ===
              "overview" && (
              <div className="mt-6">
                <p className="text-sm font-black text-[var(--navy)]">
                  Report distribution
                </p>

                <div className="mt-4 space-y-3">
                  {reportCards.map(
                    (card) => (
                      <DistributionRow
                        key={card.key}
                        label={
                          card.label
                        }
                        value={
                          card.value
                        }
                        total={Math.max(
                          totalRecords,
                          1
                        )}
                        gradient={
                          card.gradient
                        }
                      />
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* LIVE REPORT TABLE */}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-purple-600">
                Administrative intelligence
              </p>

              <h2 className="mt-1 text-2xl font-black text-[var(--navy)]">
                Live Reporting Summary
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                A compact snapshot of your college database.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Reporting active
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Report
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Records
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {reportCards.map(
                  (card) => {
                    const Icon =
                      card.icon;

                    return (
                      <tr
                        key={card.key}
                        className="border-b border-slate-100 transition hover:bg-slate-50"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600">
                              <Icon className="h-4 w-4" />
                            </div>

                            <div>
                              <p className="text-sm font-bold text-slate-800">
                                {card.label}
                              </p>

                              <p className="text-[11px] text-slate-400">
                                {
                                  card.description
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm font-black text-[var(--navy)]">
                          {loading ? (
                            <span className="inline-block h-5 w-14 animate-pulse rounded bg-slate-200" />
                          ) : (
                            card.value.toLocaleString()
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Live
                          </span>
                        </td>

                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedReport(
                                card.key
                              )
                            }
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 transition hover:bg-blue-100"
                          >
                            View Report
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          header,
          aside,
          footer,
          nav,
          button {
            display: none !important;
          }

          #report-print-area {
            box-shadow: none !important;
            border: 1px solid #e2e8f0 !important;
          }
        }
      `}</style>
    </PortalShell>
  );
}

/* ============================================================
   REPORT STAT CARD
============================================================ */

function ReportStatCard({
  label,
  value,
  description,
  icon: Icon,
  gradient,
  loading,
  active,
  onClick,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
  gradient: string;
  loading: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl border bg-white p-5 text-left shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
        active
          ? "border-blue-300 ring-4 ring-blue-100"
          : "border-slate-200"
      }`}
    >
      <div
        className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-20`}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div
            className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg transition duration-500 group-hover:scale-110 group-hover:rotate-3`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600">
            Live
          </span>
        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-wider text-slate-400">
          {label}
        </p>

        {loading ? (
          <div className="mt-2 h-10 w-24 animate-pulse rounded-lg bg-slate-200" />
        ) : (
          <p className="mt-1 text-4xl font-black tracking-tight text-[var(--navy)]">
            {value.toLocaleString()}
          </p>
        )}

        <p className="mt-2 text-xs font-medium text-slate-400">
          {description}
        </p>
      </div>
    </button>
  );
}

/* ============================================================
   SUMMARY PANEL
============================================================ */

function SummaryPanel({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-black text-[var(--navy)]">
            {value.toLocaleString()}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STATUS SECTION
============================================================ */

function StatusSection({
  title,
  data,
  emptyText,
}: {
  title: string;
  data: Record<string, number>;
  emptyText: string;
}) {
  const entries =
    Object.entries(data);

  return (
    <div className="mt-6">
      <p className="text-sm font-black text-[var(--navy)]">
        {title}
      </p>

      {!entries.length ? (
        <div className="mt-4 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
          {emptyText}
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {entries.map(
            ([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <span className="text-sm font-bold text-slate-600">
                  {label}
                </span>

                <span className="text-lg font-black text-[var(--navy)]">
                  {value.toLocaleString()}
                </span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   DISTRIBUTION ROW
============================================================ */

function DistributionRow({
  label,
  value,
  total,
  gradient,
}: {
  label: string;
  value: number;
  total: number;
  gradient: string;
}) {
  const percentage =
    total > 0
      ? Math.min(
          100,
          Math.round(
            (value / total) * 100
          )
        )
      : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-bold text-slate-600">
          {label}
        </span>

        <span className="text-xs font-black text-slate-500">
          {value.toLocaleString()} ·{" "}
          {percentage}%
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   SELECTED REPORT VALUE
============================================================ */

function getSelectedValue(
  selectedReport: ReportType,
  counts: ReportCounts
): number {
  switch (selectedReport) {
    case "students":
      return counts.students;

    case "faculty":
      return counts.faculty;

    case "attendance":
      return counts.attendance;

    case "fees":
      return counts.fees;

    case "exams":
      return counts.exams;

    case "results":
      return counts.results;

    case "notices":
      return counts.notices;

    case "events":
      return counts.events;

    default:
      return (
        counts.students +
        counts.faculty +
        counts.attendance +
        counts.fees +
        counts.exams +
        counts.results +
        counts.notices +
        counts.events
      );
  }
}

/* ============================================================
   DATABASE ICON
============================================================ */

function DatabaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <ellipse
        cx="12"
        cy="5"
        rx="8"
        ry="3"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M4 5v7c0 1.657 3.582 3 8 3s8-1.343 8-3V5"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M4 12v7c0 1.657 3.582 3 8 3s8-1.343 8-3v-7"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}