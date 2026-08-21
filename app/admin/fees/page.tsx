"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ElementType,
  type SetStateAction,
} from "react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Edit3,
  FileText,
  IndianRupee,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";

/* ============================================================
   TYPES
============================================================ */

type PaymentStatus =
  | "Paid"
  | "Partial"
  | "Pending"
  | "Overdue";

type FeeRecord = {
  id: string;

  userId: string;
  studentId: string;
  studentName: string;
  email: string;
  phone: string;

  course: string;
  department: string;
  semester: string;
  academicYear: string;

  feeType: string;
  description: string;

  totalAmount: number;
  paidAmount: number;
  balance: number;

  dueDate: string;
  paymentDate: string;
  paymentMode: string;
  transactionId: string;

  paymentStatus: PaymentStatus;

  remarks: string;

  createdAt?: unknown;
  updatedAt?: unknown;
};

type FeeForm = {
  userId: string;
  studentId: string;
  studentName: string;
  email: string;
  phone: string;

  course: string;
  department: string;
  semester: string;
  academicYear: string;

  feeType: string;
  description: string;

  totalAmount: string;
  paidAmount: string;

  dueDate: string;
  paymentDate: string;

  paymentMode: string;
  transactionId: string;

  remarks: string;
};

const emptyForm: FeeForm = {
  userId: "",
  studentId: "",
  studentName: "",
  email: "",
  phone: "",

  course: "",
  department: "",
  semester: "",
  academicYear: "",

  feeType: "",
  description: "",

  totalAmount: "",
  paidAmount: "0",

  dueDate: "",
  paymentDate: "",

  paymentMode: "",
  transactionId: "",

  remarks: "",
};

/* ============================================================
   HELPERS
============================================================ */

function calculateBalance(
  totalAmount: number,
  paidAmount: number
): number {
  return Number(
    Math.max(
      0,
      totalAmount - paidAmount
    ).toFixed(2)
  );
}

function calculatePaymentStatus(
  totalAmount: number,
  paidAmount: number,
  dueDate: string
): PaymentStatus {
  const balance =
    calculateBalance(
      totalAmount,
      paidAmount
    );

  if (balance <= 0) {
    return "Paid";
  }

  if (paidAmount > 0) {
    return "Partial";
  }

  if (dueDate) {
    const today = new Date();

    const due = new Date(
      `${dueDate}T23:59:59`
    );

    if (due < today) {
      return "Overdue";
    }
  }

  return "Pending";
}

function formatCurrency(
  value: number
): string {
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function uniqueValues(
  values: string[]
): string[] {
  return Array.from(
    new Set(
      values
        .map((value) =>
          value.trim()
        )
        .filter(Boolean)
    )
  ).sort((a, b) =>
    a.localeCompare(b)
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function FeesPage() {
  const [fees, setFees] =
    useState<FeeRecord[]>([]);

  const [form, setForm] =
    useState<FeeForm>({
      ...emptyForm,
    });

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [courseFilter, setCourseFilter] =
    useState("all");

  const [
    departmentFilter,
    setDepartmentFilter,
  ] = useState("all");

  const [
    semesterFilter,
    setSemesterFilter,
  ] = useState("all");

  const [
    paymentStatusFilter,
    setPaymentStatusFilter,
  ] = useState<
    "all" | PaymentStatus
  >("all");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    processingId,
    setProcessingId,
  ] = useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  /* ============================================================
     REAL-TIME FIRESTORE
  ============================================================ */

  useEffect(() => {
    const db = firestoreDb;

    if (!db) {
      setError(
        "Firestore is not initialized."
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const feesQuery = query(
      collection(db, "fees"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      feesQuery,
      (snapshot) => {
        const records: FeeRecord[] =
          snapshot.docs.map(
            (item) => {
              const data =
                item.data();

              const total =
                Number(
                  data.totalAmount ??
                    data.amount ??
                    0
                );

              const paid =
                Number(
                  data.paidAmount ??
                    0
                );

              const balance =
                Number(
                  data.balance ??
                    calculateBalance(
                      total,
                      paid
                    )
                );

              const rawStatus =
                data.paymentStatus;

              const paymentStatus: PaymentStatus =
                rawStatus === "Paid" ||
                rawStatus ===
                  "Partial" ||
                rawStatus ===
                  "Overdue"
                  ? rawStatus
                  : "Pending";

              return {
                id: item.id,

                userId: String(
                  data.userId ?? ""
                ),

                studentId:
                  String(
                    data.studentId ??
                      data.collegeRegisterUid ??
                      ""
                  ),

                studentName:
                  String(
                    data.studentName ??
                      data.name ??
                      ""
                  ),

                email: String(
                  data.email ?? ""
                ),

                phone: String(
                  data.phone ?? ""
                ),

                course: String(
                  data.course ?? ""
                ),

                department:
                  String(
                    data.department ??
                      ""
                  ),

                semester:
                  String(
                    data.semester ??
                      ""
                  ),

                academicYear:
                  String(
                    data.academicYear ??
                      ""
                  ),

                feeType:
                  String(
                    data.feeType ?? ""
                  ),

                description:
                  String(
                    data.description ??
                      ""
                  ),

                totalAmount: total,
                paidAmount: paid,
                balance,

                dueDate:
                  String(
                    data.dueDate ?? ""
                  ),

                paymentDate:
                  String(
                    data.paymentDate ??
                      ""
                  ),

                paymentMode:
                  String(
                    data.paymentMode ??
                      ""
                  ),

                transactionId:
                  String(
                    data.transactionId ??
                      ""
                  ),

                paymentStatus,

                remarks:
                  String(
                    data.remarks ?? ""
                  ),

                createdAt:
                  data.createdAt,

                updatedAt:
                  data.updatedAt,
              };
            }
          );

        setFees(records);
        setLoading(false);
        setError("");
      },
      (listenerError) => {
        console.error(
          "Fees listener error:",
          listenerError
        );

        setError(
          listenerError instanceof
            Error
            ? listenerError.message
            : "Unable to load fee records."
        );

        setLoading(false);
      }
    );

    return () =>
      unsubscribe();
  }, []);

  /* ============================================================
     FILTER OPTIONS
  ============================================================ */

  const courses = useMemo(
    () =>
      uniqueValues(
        fees.map(
          (fee) => fee.course
        )
      ),
    [fees]
  );

  const departments =
    useMemo(
      () =>
        uniqueValues(
          fees.map(
            (fee) =>
              fee.department
          )
        ),
      [fees]
    );

  const semesters = useMemo(
    () =>
      uniqueValues(
        fees.map(
          (fee) =>
            fee.semester
        )
      ),
    [fees]
  );

  /* ============================================================
     FILTERED FEES
  ============================================================ */

  const filteredFees = useMemo(() => {
    const term =
      search
        .trim()
        .toLowerCase();

    return fees.filter(
      (fee) => {
        const matchesSearch =
          !term ||
          [
            fee.studentName,
            fee.studentId,
            fee.email,
            fee.phone,
            fee.course,
            fee.department,
            fee.semester,
            fee.academicYear,
            fee.feeType,
            fee.description,
            fee.paymentMode,
            fee.transactionId,
            fee.paymentStatus,
            fee.remarks,
          ]
            .join(" ")
            .toLowerCase()
            .includes(term);

        const matchesCourse =
          courseFilter ===
            "all" ||
          fee.course ===
            courseFilter;

        const matchesDepartment =
          departmentFilter ===
            "all" ||
          fee.department ===
            departmentFilter;

        const matchesSemester =
          semesterFilter ===
            "all" ||
          fee.semester ===
            semesterFilter;

        const matchesStatus =
          paymentStatusFilter ===
            "all" ||
          fee.paymentStatus ===
            paymentStatusFilter;

        return (
          matchesSearch &&
          matchesCourse &&
          matchesDepartment &&
          matchesSemester &&
          matchesStatus
        );
      }
    );
  }, [
    fees,
    search,
    courseFilter,
    departmentFilter,
    semesterFilter,
    paymentStatusFilter,
  ]);

  /* ============================================================
     STATISTICS
  ============================================================ */

  const totalRecords =
    fees.length;

  const totalAmount =
    fees.reduce(
      (sum, fee) =>
        sum + fee.totalAmount,
      0
    );

  const totalPaid =
    fees.reduce(
      (sum, fee) =>
        sum + fee.paidAmount,
      0
    );

  const totalBalance =
    fees.reduce(
      (sum, fee) =>
        sum + fee.balance,
      0
    );

  const paidCount =
    fees.filter(
      (fee) =>
        fee.paymentStatus ===
        "Paid"
    ).length;

  const pendingCount =
    fees.filter(
      (fee) =>
        fee.paymentStatus ===
        "Pending"
    ).length;

  const partialCount =
    fees.filter(
      (fee) =>
        fee.paymentStatus ===
        "Partial"
    ).length;

  const overdueCount =
    fees.filter(
      (fee) =>
        fee.paymentStatus ===
        "Overdue"
    ).length;

  /* ============================================================
     FORM
  ============================================================ */

  function openAddForm() {
    setEditingId(null);

    setForm({
      ...emptyForm,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditForm(
    fee: FeeRecord
  ) {
    setEditingId(fee.id);

    setForm({
      userId: fee.userId,

      studentId:
        fee.studentId,

      studentName:
        fee.studentName,

      email: fee.email,

      phone: fee.phone,

      course: fee.course,

      department:
        fee.department,

      semester:
        fee.semester,

      academicYear:
        fee.academicYear,

      feeType:
        fee.feeType,

      description:
        fee.description,

      totalAmount:
        String(
          fee.totalAmount
        ),

      paidAmount:
        String(
          fee.paidAmount
        ),

      dueDate:
        fee.dueDate,

      paymentDate:
        fee.paymentDate,

      paymentMode:
        fee.paymentMode,

      transactionId:
        fee.transactionId,

      remarks:
        fee.remarks,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingId(null);

    setForm({
      ...emptyForm,
    });
  }

  /* ============================================================
     SAVE FEE
  ============================================================ */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const db = firestoreDb;

    if (!db) {
      setError(
        "Firestore is not initialized."
      );
      return;
    }

    const studentId =
      form.studentId.trim();

    const studentName =
      form.studentName.trim();

    const email =
      form.email
        .trim()
        .toLowerCase();

    const phone =
      form.phone.trim();

    const course =
      form.course.trim();

    const department =
      form.department.trim();

    const semester =
      form.semester.trim();

    const academicYear =
      form.academicYear.trim();

    const feeType =
      form.feeType.trim();

    const description =
      form.description.trim();

    const totalAmount =
      Number(
        form.totalAmount
      );

    const paidAmount =
      Number(
        form.paidAmount
      );

    const dueDate =
      form.dueDate.trim();

    const paymentDate =
      form.paymentDate.trim();

    const paymentMode =
      form.paymentMode.trim();

    const transactionId =
      form.transactionId.trim();

    /* VALIDATION */

    if (!studentName) {
      setError(
        "Student name is required."
      );
      return;
    }

    if (!studentId) {
      setError(
        "Student ID / College Register UID is required."
      );
      return;
    }

    if (
      email &&
      !email.includes("@")
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (!course) {
      setError(
        "Course is required."
      );
      return;
    }

    if (!department) {
      setError(
        "Department is required."
      );
      return;
    }

    if (!semester) {
      setError(
        "Semester is required."
      );
      return;
    }

    if (!academicYear) {
      setError(
        "Academic year is required."
      );
      return;
    }

    if (!feeType) {
      setError(
        "Fee type is required."
      );
      return;
    }

    if (
      !Number.isFinite(
        totalAmount
      ) ||
      totalAmount <= 0
    ) {
      setError(
        "Total amount must be greater than zero."
      );
      return;
    }

    if (
      !Number.isFinite(
        paidAmount
      ) ||
      paidAmount < 0
    ) {
      setError(
        "Paid amount cannot be negative."
      );
      return;
    }

    if (
      paidAmount >
      totalAmount
    ) {
      setError(
        "Paid amount cannot be greater than total amount."
      );
      return;
    }

    const balance =
      calculateBalance(
        totalAmount,
        paidAmount
      );

    const paymentStatus =
      calculatePaymentStatus(
        totalAmount,
        paidAmount,
        dueDate
      );

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const feeData = {
        userId:
          form.userId.trim(),

        studentId,
        studentName,

        email,
        phone,

        course,
        department,
        semester,
        academicYear,

        feeType,
        description,

        totalAmount,
        paidAmount,
        balance,

        dueDate,
        paymentDate,

        paymentMode,
        transactionId,

        paymentStatus,

        remarks:
          form.remarks.trim(),

        updatedAt:
          serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(
          doc(
            db,
            "fees",
            editingId
          ),
          feeData
        );

        setSuccess(
          "Fee record updated successfully."
        );
      } else {
        await addDoc(
          collection(
            db,
            "fees"
          ),
          {
            ...feeData,

            createdAt:
              serverTimestamp(),
          }
        );

        setSuccess(
          "Fee record added successfully."
        );
      }

      setShowForm(false);
      setEditingId(null);

      setForm({
        ...emptyForm,
      });
    } catch (err) {
      console.error(
        "Fee save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save fee record."
      );
    } finally {
      setSaving(false);
    }
  }

  /* ============================================================
     DELETE
  ============================================================ */

  async function handleDelete(
    fee: FeeRecord
  ) {
    const db = firestoreDb;

    if (!db) {
      setError(
        "Firestore is not initialized."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete fee record for "${fee.studentName}" - ${fee.feeType}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(
        fee.id
      );

      setError("");
      setSuccess("");

      await deleteDoc(
        doc(
          db,
          "fees",
          fee.id
        )
      );

      setSuccess(
        "Fee record deleted successfully."
      );
    } catch (err) {
      console.error(
        "Fee delete error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete fee record."
      );
    } finally {
      setProcessingId(null);
    }
  }

  /* ============================================================
     FILTER CLEAR
  ============================================================ */

  function clearFilters() {
    setSearch("");
    setCourseFilter("all");
    setDepartmentFilter("all");
    setSemesterFilter("all");

    setPaymentStatusFilter(
      "all"
    );
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <PortalShell
      role="admin"
      title="Fees"
    >
      <main className="space-y-8 pb-10">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-600 p-6 text-white shadow-xl sm:p-8">

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

              <div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] backdrop-blur">

                  <IndianRupee className="h-3.5 w-3.5 text-emerald-200" />

                  Financial Administration

                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Fee & Payment Control Center
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-100 sm:text-base">
                  Manage student fees, payments, outstanding balances and financial records from one centralized dashboard.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  openAddForm
                }
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-emerald-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                Add Fee Record
              </button>

            </div>

            <div className="mt-7 flex flex-wrap gap-3">

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">

                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />

                Live Firestore

              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">

                <CheckCircle2 className="h-4 w-4 text-emerald-300" />

                {paidCount} paid

              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">

                <CreditCard className="h-4 w-4 text-cyan-200" />

                {pendingCount + partialCount} active balances

              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">

                <XCircle className="h-4 w-4 text-red-200" />

                {overdueCount} overdue

              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            PAGE HEADING
        ====================================================== */}

        <PageHeading
          eyebrow="Financial administration"
          title="Fee Management"
          description="Manage student fee records, payments, balances and financial status with real-time Firestore updates."
        />

        {/* =====================================================
            ALERTS
        ====================================================== */}

        {error && (
          <MessageBox
            type="error"
            message={error}
            onClose={() =>
              setError("")
            }
          />
        )}

        {success && (
          <MessageBox
            type="success"
            message={success}
            onClose={() =>
              setSuccess("")
            }
          />
        )}

        {/* =====================================================
            FINANCIAL STATISTICS
        ====================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            icon={FileText}
            label="Fee Records"
            value={
              totalRecords
            }
            tone="blue"
          />

          <StatCard
            icon={IndianRupee}
            label="Total Amount"
            value={formatCurrency(
              totalAmount
            )}
            tone="purple"
          />

          <StatCard
            icon={CheckCircle2}
            label="Total Collected"
            value={formatCurrency(
              totalPaid
            )}
            tone="green"
          />

          <StatCard
            icon={CreditCard}
            label="Outstanding"
            value={formatCurrency(
              totalBalance
            )}
            tone="orange"
          />

        </section>

        {/* =====================================================
            PAYMENT STATUS
        ====================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatusSummary
            icon={CheckCircle2}
            label="Paid"
            value={paidCount}
            description="Fully paid fee records"
            tone="green"
          />

          <StatusSummary
            icon={CreditCard}
            label="Partial"
            value={partialCount}
            description="Partially paid records"
            tone="blue"
          />

          <StatusSummary
            icon={RefreshCw}
            label="Pending"
            value={pendingCount}
            description="Payment still pending"
            tone="amber"
          />

          <StatusSummary
            icon={XCircle}
            label="Overdue"
            value={overdueCount}
            description="Past the due date"
            tone="red"
          />

        </section>

        {/* =====================================================
            SEARCH & FILTERS
        ====================================================== */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <span className="relative flex h-2.5 w-2.5">

                    <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                    <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />

                  </span>

                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                    Real-time
                  </span>

                </div>

                <h2 className="mt-1 text-xl font-black text-[var(--navy)]">
                  Fee Records
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-black text-slate-700">
                    {
                      filteredFees.length
                    }
                  </span>{" "}
                  of{" "}
                  <span className="font-black text-slate-700">
                    {fees.length}
                  </span>{" "}
                  records
                </p>

              </div>

              <div className="relative">

                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search students, fee type..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 lg:w-80"
                />

              </div>

            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <FilterSelect
                label="Course"
                value={
                  courseFilter
                }
                onChange={
                  setCourseFilter
                }
                options={
                  courses
                }
              />

              <FilterSelect
                label="Department"
                value={
                  departmentFilter
                }
                onChange={
                  setDepartmentFilter
                }
                options={
                  departments
                }
              />

              <FilterSelect
                label="Semester"
                value={
                  semesterFilter
                }
                onChange={
                  setSemesterFilter
                }
                options={
                  semesters
                }
              />

              <FilterSelect
                label="Payment Status"
                value={
                  paymentStatusFilter
                }
                onChange={(
                  value
                ) =>
                  setPaymentStatusFilter(
                    value as
                      | "all"
                      | PaymentStatus
                  )
                }
                options={[
                  "Paid",
                  "Partial",
                  "Pending",
                  "Overdue",
                ]}
              />

            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex flex-wrap items-center gap-3">

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  Live financial data
                </span>

                <span className="text-xs font-semibold text-slate-400">
                  Firestore updates automatically
                </span>

              </div>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
                Clear Filters
              </button>

            </div>

          </div>
        </section>

        {/* =====================================================
            TABLE
        ====================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {loading ? (
            <LoadingState />
          ) : filteredFees.length ===
            0 ? (
            <EmptyState
              hasFilters={
                Boolean(
                  search.trim()
                ) ||
                courseFilter !==
                  "all" ||
                departmentFilter !==
                  "all" ||
                semesterFilter !==
                  "all" ||
                paymentStatusFilter !==
                  "all"
              }
              onAdd={
                openAddForm
              }
              onClear={
                clearFilters
              }
            />
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1550px]">

                <thead>
                  <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50">

                    <TableHeader>
                      Student
                    </TableHeader>

                    <TableHeader>
                      Fee Type
                    </TableHeader>

                    <TableHeader>
                      Academic
                    </TableHeader>

                    <TableHeader>
                      Total
                    </TableHeader>

                    <TableHeader>
                      Paid
                    </TableHeader>

                    <TableHeader>
                      Balance
                    </TableHeader>

                    <TableHeader>
                      Due Date
                    </TableHeader>

                    <TableHeader>
                      Payment
                    </TableHeader>

                    <TableHeader>
                      Status
                    </TableHeader>

                    <TableHeader align="right">
                      Actions
                    </TableHeader>

                  </tr>
                </thead>

                <tbody>

                  {filteredFees.map(
                    (fee) => {
                      const processing =
                        processingId ===
                        fee.id;

                      return (
                        <tr
                          key={
                            fee.id
                          }
                          className="group border-b border-slate-100 transition hover:bg-blue-50/30"
                        >

                          {/* STUDENT */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-black text-white shadow-md">
                                {fee.studentName
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase() ||
                                  "S"}
                              </div>

                              <div className="min-w-0">

                                <p className="max-w-[220px] truncate font-black text-slate-800">
                                  {
                                    fee.studentName
                                  }
                                </p>

                                <p className="mt-1 text-xs font-black text-blue-600">
                                  {
                                    fee.studentId
                                  }
                                </p>

                                <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-400">
                                  {
                                    fee.email ||
                                    "No email"
                                  }
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* FEE TYPE */}

                          <td className="px-5 py-4">

                            <span className="inline-flex rounded-xl bg-purple-50 px-3 py-2 text-xs font-black text-purple-700">
                              {
                                fee.feeType ||
                                "Fee"
                              }
                            </span>

                            <p className="mt-2 max-w-[190px] truncate text-xs text-slate-400">
                              {
                                fee.description ||
                                "No description"
                              }
                            </p>

                          </td>

                          {/* ACADEMIC */}

                          <td className="px-5 py-4">

                            <p className="text-sm font-bold text-slate-700">
                              {
                                fee.course ||
                                "—"
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {
                                fee.semester ||
                                "—"
                              }{" "}
                              ·{" "}
                              {
                                fee.academicYear ||
                                "—"
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {
                                fee.department ||
                                "—"
                              }
                            </p>

                          </td>

                          {/* TOTAL */}

                          <td className="px-5 py-4">

                            <span className="text-sm font-black text-slate-800">
                              {formatCurrency(
                                fee.totalAmount
                              )}
                            </span>

                          </td>

                          {/* PAID */}

                          <td className="px-5 py-4">

                            <span className="text-sm font-black text-emerald-600">
                              {formatCurrency(
                                fee.paidAmount
                              )}
                            </span>

                          </td>

                          {/* BALANCE */}

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex rounded-xl px-3 py-2 text-sm font-black ${
                                fee.balance >
                                0
                                  ? "bg-red-50 text-red-600"
                                  : "bg-emerald-50 text-emerald-600"
                              }`}
                            >
                              {formatCurrency(
                                fee.balance
                              )}
                            </span>

                          </td>

                          {/* DUE DATE */}

                          <td className="px-5 py-4">

                            <p className="text-sm font-bold text-slate-700">
                              {
                                fee.dueDate ||
                                "Not set"
                              }
                            </p>

                            {fee.paymentDate && (
                              <p className="mt-1 text-xs text-emerald-600">
                                Paid:{" "}
                                {
                                  fee.paymentDate
                                }
                              </p>
                            )}

                          </td>

                          {/* PAYMENT */}

                          <td className="px-5 py-4">

                            <p className="text-sm font-bold text-slate-600">
                              {
                                fee.paymentMode ||
                                "Not recorded"
                              }
                            </p>

                            {fee.transactionId && (
                              <p className="mt-1 max-w-[150px] truncate font-mono text-[10px] text-slate-400">
                                {
                                  fee.transactionId
                                }
                              </p>
                            )}

                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">

                            <PaymentStatusBadge
                              status={
                                fee.paymentStatus
                              }
                            />

                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-2">

                              <ActionButton
                                title="Edit Fee"
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                                onClick={() =>
                                  openEditForm(
                                    fee
                                  )
                                }
                                disabled={
                                  processing
                                }
                              >
                                <Edit3 className="h-4 w-4" />
                              </ActionButton>

                              <ActionButton
                                title="Delete Fee"
                                className="bg-red-50 text-red-600 hover:bg-red-100"
                                onClick={() =>
                                  void handleDelete(
                                    fee
                                  )
                                }
                                disabled={
                                  processing
                                }
                              >
                                {processing ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </ActionButton>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>
              </table>

            </div>
          )}

        </section>

        {/* =====================================================
            MODAL
        ====================================================== */}

        {showForm && (
          <FeeModal
            form={form}
            setForm={setForm}
            editing={
              Boolean(
                editingId
              )
            }
            saving={saving}
            onClose={
              closeForm
            }
            onSubmit={
              handleSubmit
            }
          />
        )}

      </main>
    </PortalShell>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: ElementType;
  label: string;
  value: number | string;
  tone:
    | "blue"
    | "purple"
    | "green"
    | "orange";
}) {
  const styles = {
    blue: {
      icon:
        "bg-gradient-to-br from-blue-600 to-cyan-500 text-white",
      glow:
        "bg-blue-500",
    },

    purple: {
      icon:
        "bg-gradient-to-br from-purple-600 to-violet-500 text-white",
      glow:
        "bg-purple-500",
    },

    green: {
      icon:
        "bg-gradient-to-br from-emerald-600 to-teal-500 text-white",
      glow:
        "bg-emerald-500",
    },

    orange: {
      icon:
        "bg-gradient-to-br from-orange-500 to-amber-500 text-white",
      glow:
        "bg-orange-500",
    },
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full ${styles[tone].glow} opacity-10 blur-3xl transition duration-500 group-hover:scale-150`}
      />

      <div className="relative">

        <div
          className={`grid h-12 w-12 place-items-center rounded-2xl shadow-lg ${styles[tone].icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <p className="mt-4 text-xs font-black uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-2xl font-black tracking-tight text-[var(--navy)] sm:text-3xl">
          {value}
        </p>

        <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full w-1/2 rounded-full bg-gradient-to-r ${
              tone === "blue"
                ? "from-blue-500 to-cyan-400"
                : tone === "purple"
                  ? "from-purple-500 to-violet-400"
                  : tone === "green"
                    ? "from-emerald-500 to-teal-400"
                    : "from-orange-500 to-amber-400"
            } transition-all duration-500 group-hover:w-full`}
          />
        </div>

      </div>
    </div>
  );
}

/* ============================================================
   STATUS SUMMARY
============================================================ */

function StatusSummary({
  icon: Icon,
  label,
  value,
  description,
  tone,
}: {
  icon: ElementType;
  label: string;
  value: number;
  description: string;
  tone:
    | "green"
    | "blue"
    | "amber"
    | "red";
}) {
  const styles = {
    green:
      "border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700",

    blue:
      "border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700",

    amber:
      "border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700",

    red:
      "border-red-100 bg-gradient-to-br from-red-50 to-rose-50 text-red-700",
  };

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${styles[tone]}`}
    >

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-black uppercase tracking-wider opacity-70">
            {label}
          </p>

          <p className="mt-1 text-3xl font-black">
            {value.toLocaleString()}
          </p>

          <p className="mt-1 text-xs font-semibold opacity-70">
            {description}
          </p>

        </div>

        <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/70 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>

      </div>

    </div>
  );
}

/* ============================================================
   FILTER SELECT
============================================================ */

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  options: string[];
}) {
  return (
    <div>

      <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      >
        <option value="all">
          All {label}
        </option>

        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}
      </select>

    </div>
  );
}

/* ============================================================
   PAYMENT STATUS
============================================================ */

function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  if (
    status === "Paid"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Paid
      </span>
    );
  }

  if (
    status === "Partial"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700">
        <CreditCard className="h-3.5 w-3.5" />
        Partial
      </span>
    );
  }

  if (
    status === "Overdue"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-black text-red-700">
        <XCircle className="h-3.5 w-3.5" />
        Overdue
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700">
      <RefreshCw className="h-3.5 w-3.5" />
      Pending
    </span>
  );
}

/* ============================================================
   ACTION BUTTON
============================================================ */

function ActionButton({
  title,
  className,
  onClick,
  disabled,
  children,
}: {
  title: string;
  className: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-9 w-9 place-items-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

/* ============================================================
   TABLE HEADER
============================================================ */

function TableHeader({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-4 text-${align} text-xs font-black uppercase tracking-wider text-slate-500`}
    >
      {children}
    </th>
  );
}

/* ============================================================
   MESSAGE
============================================================ */

function MessageBox({
  type,
  message,
  onClose,
}: {
  type: "error" | "success";
  message: string;
  onClose: () => void;
}) {
  const isError =
    type === "error";

  return (
    <div
      className={`rounded-2xl border p-4 ${
        isError
          ? "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
          : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">

        <div className="flex items-start gap-3">

          <div
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
              isError
                ? "bg-red-100 text-red-600"
                : "bg-emerald-100 text-emerald-600"
            }`}
          >
            {isError ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )}
          </div>

          <div>

            <p
              className={`text-sm font-black ${
                isError
                  ? "text-red-800"
                  : "text-emerald-800"
              }`}
            >
              {isError
                ? "Fee operation failed"
                : "Success"}
            </p>

            <p
              className={`mt-1 text-xs leading-6 ${
                isError
                  ? "text-red-700"
                  : "text-emerald-700"
              }`}
            >
              {message}
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={onClose}
          className={`rounded-lg p-2 ${
            isError
              ? "text-red-600 hover:bg-red-100"
              : "text-emerald-600 hover:bg-emerald-100"
          }`}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

      </div>
    </div>
  );
}

/* ============================================================
   LOADING
============================================================ */

function LoadingState() {
  return (
    <div className="divide-y divide-slate-100">

      {[1, 2, 3, 4, 5].map(
        (item) => (
          <div
            key={item}
            className="animate-pulse p-5"
          >

            <div className="flex items-center gap-4">

              <div className="h-11 w-11 rounded-full bg-slate-100" />

              <div className="flex-1">

                <div className="h-4 w-56 rounded bg-slate-100" />

                <div className="mt-3 h-3 w-80 rounded bg-slate-100" />

              </div>

              <div className="hidden h-8 w-24 rounded bg-slate-100 md:block" />

              <div className="hidden h-8 w-20 rounded bg-slate-100 md:block" />

            </div>

          </div>
        )
      )}

    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  hasFilters,
  onAdd,
  onClear,
}: {
  hasFilters: boolean;
  onAdd: () => void;
  onClear: () => void;
}) {
  return (
    <div className="p-14 text-center">

      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600">
        <CreditCard className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-800">
        {hasFilters
          ? "No matching fee records"
          : "No fee records yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasFilters
          ? "Try changing your search or filters."
          : "Add your first student fee record to begin managing college payments."}
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-3">

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Clear Filters
          </button>
        )}

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          Add Fee Record
        </button>

      </div>

    </div>
  );
}

/* ============================================================
   INPUT
============================================================ */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={
          placeholder
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />

    </div>
  );
}

/* ============================================================
   NUMBER INPUT
============================================================ */

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  min?: string;
  max?: string;
  step?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        min={min}
        max={max}
        step={step}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />

    </div>
  );
}

/* ============================================================
   FEE MODAL
============================================================ */

function FeeModal({
  form,
  setForm,
  editing,
  saving,
  onClose,
  onSubmit,
}: {
  form: FeeForm;
  setForm: Dispatch<
    SetStateAction<FeeForm>
  >;
  editing: boolean;
  saving: boolean;
  onClose: () => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
}) {
  const totalAmount =
    Number(
      form.totalAmount
    );

  const paidAmount =
    Number(
      form.paidAmount
    );

  const balance =
    Number.isFinite(
      totalAmount
    ) &&
    Number.isFinite(
      paidAmount
    )
      ? calculateBalance(
          totalAmount,
          paidAmount
        )
      : 0;

  const previewStatus =
    Number.isFinite(
      totalAmount
    ) &&
    totalAmount > 0 &&
    Number.isFinite(
      paidAmount
    )
      ? calculatePaymentStatus(
          totalAmount,
          paidAmount,
          form.dueDate
        )
      : "Pending";

  function updateField(
    field: keyof FeeForm,
    value: string
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">

          <div className="flex items-center gap-3">

            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-emerald-600 to-cyan-500 text-white shadow-lg">
              <IndianRupee className="h-5 w-5" />
            </div>

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                Financial Administration
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                {editing
                  ? "Edit Fee Record"
                  : "Add Fee Record"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Record student fees, payments and outstanding balances.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              saving
            }
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-6 p-6"
        >

          {/* STUDENT */}

          <FormSection
            icon={Users}
            color="blue"
            title="Student Information"
            description="Student identity and academic details."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <Input
                label="Student Name *"
                value={
                  form.studentName
                }
                onChange={(value) =>
                  updateField(
                    "studentName",
                    value
                  )
                }
                placeholder="Student full name"
              />

              <Input
                label="College Register UID / Student ID *"
                value={
                  form.studentId
                }
                onChange={(value) =>
                  updateField(
                    "studentId",
                    value
                  )
                }
                placeholder="NDCBCA001"
              />

              <Input
                label="Internal User UID"
                value={
                  form.userId
                }
                onChange={(value) =>
                  updateField(
                    "userId",
                    value
                  )
                }
                placeholder="Firebase user UID"
              />

              <Input
                label="Gmail"
                type="email"
                value={
                  form.email
                }
                onChange={(value) =>
                  updateField(
                    "email",
                    value
                  )
                }
                placeholder="student@gmail.com"
              />

              <Input
                label="Phone"
                type="tel"
                value={
                  form.phone
                }
                onChange={(value) =>
                  updateField(
                    "phone",
                    value
                  )
                }
                placeholder="9876543210"
              />

              <Input
                label="Course *"
                value={
                  form.course
                }
                onChange={(value) =>
                  updateField(
                    "course",
                    value
                  )
                }
                placeholder="BCA"
              />

              <Input
                label="Department *"
                value={
                  form.department
                }
                onChange={(value) =>
                  updateField(
                    "department",
                    value
                  )
                }
                placeholder="Computer Applications"
              />

              <Input
                label="Semester *"
                value={
                  form.semester
                }
                onChange={(value) =>
                  updateField(
                    "semester",
                    value
                  )
                }
                placeholder="2nd Semester"
              />

              <Input
                label="Academic Year *"
                value={
                  form.academicYear
                }
                onChange={(value) =>
                  updateField(
                    "academicYear",
                    value
                  )
                }
                placeholder="2026-27"
              />

            </div>
          </FormSection>

          {/* FEE */}

          <FormSection
            icon={CreditCard}
            color="orange"
            title="Fee Details"
            description="Define the fee amount and payment information."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <Input
                label="Fee Type *"
                value={
                  form.feeType
                }
                onChange={(value) =>
                  updateField(
                    "feeType",
                    value
                  )
                }
                placeholder="Tuition Fee"
              />

              <Input
                label="Description"
                value={
                  form.description
                }
                onChange={(value) =>
                  updateField(
                    "description",
                    value
                  )
                }
                placeholder="Semester tuition fee"
              />

              <NumberInput
                label="Total Amount *"
                value={
                  form.totalAmount
                }
                onChange={(value) =>
                  updateField(
                    "totalAmount",
                    value
                  )
                }
                min="1"
                step="0.01"
              />

              <NumberInput
                label="Paid Amount"
                value={
                  form.paidAmount
                }
                onChange={(value) =>
                  updateField(
                    "paidAmount",
                    value
                  )
                }
                min="0"
                step="0.01"
              />

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Balance
                </label>

                <div className="flex h-[46px] items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-red-600">
                  {formatCurrency(
                    balance
                  )}
                </div>

              </div>

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Payment Status
                </label>

                <div className="flex h-[46px] items-center">
                  <PaymentStatusBadge
                    status={
                      previewStatus
                    }
                  />
                </div>

              </div>

              <DateInput
                label="Due Date"
                value={
                  form.dueDate
                }
                onChange={(value) =>
                  updateField(
                    "dueDate",
                    value
                  )
                }
              />

              <DateInput
                label="Payment Date"
                value={
                  form.paymentDate
                }
                onChange={(value) =>
                  updateField(
                    "paymentDate",
                    value
                  )
                }
              />

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Payment Mode
                </label>

                <select
                  value={
                    form.paymentMode
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "paymentMode",
                      event
                        .target
                        .value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="">
                    Select payment mode
                  </option>

                  <option value="Cash">
                    Cash
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>

                  <option value="Online">
                    Online
                  </option>

                  <option value="Cheque">
                    Cheque
                  </option>

                  <option value="Card">
                    Card
                  </option>
                </select>

              </div>

              <Input
                label="Transaction ID"
                value={
                  form.transactionId
                }
                onChange={(value) =>
                  updateField(
                    "transactionId",
                    value
                  )
                }
                placeholder="TXN123456789"
              />

            </div>
          </FormSection>

          {/* REMARKS */}

          <FormSection
            icon={FileText}
            color="purple"
            title="Remarks"
            description="Additional financial notes."
          >
            <textarea
              value={
                form.remarks
              }
              onChange={(event) =>
                updateField(
                  "remarks",
                  event.target.value
                )
              }
              rows={4}
              placeholder="Optional financial remarks..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </FormSection>

          {/* SUMMARY */}

          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-5 text-white shadow-xl">

            <div className="flex items-center gap-3">

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
                <IndianRupee className="h-5 w-5" />
              </div>

              <div>

                <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
                  Payment Summary
                </p>

                <p className="mt-1 text-sm text-blue-100">
                  Automatically calculated before saving.
                </p>

              </div>

            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">

              <SummaryValue
                label="Total"
                value={formatCurrency(
                  Number.isFinite(
                    totalAmount
                  )
                    ? totalAmount
                    : 0
                )}
              />

              <SummaryValue
                label="Paid"
                value={formatCurrency(
                  Number.isFinite(
                    paidAmount
                  )
                    ? paidAmount
                    : 0
                )}
              />

              <SummaryValue
                label="Balance"
                value={formatCurrency(
                  balance
                )}
              />

            </div>

          </div>

          {/* BUTTONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                saving
              }
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >

              {saving && (
                <RefreshCw className="h-4 w-4 animate-spin" />
              )}

              {editing
                ? "Update Fee Record"
                : "Save Fee Record"}

            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

/* ============================================================
   FORM SECTION
============================================================ */

function FormSection({
  icon: Icon,
  color,
  title,
  description,
  children,
}: {
  icon?: ElementType;
  color:
    | "blue"
    | "orange"
    | "purple";
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const styles = {
    blue:
      "bg-blue-50 text-blue-600",

    orange:
      "bg-orange-50 text-orange-600",

    purple:
      "bg-purple-50 text-purple-600",
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50/80 to-white p-5">

      <div className="mb-5 flex items-center gap-3">

        {Icon && (
          <div
            className={`grid h-10 w-10 place-items-center rounded-xl ${styles[color]}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}

        <div>

          <h3 className="font-black text-slate-900">
            {title}
          </h3>

          <p className="text-xs leading-5 text-slate-500">
            {description}
          </p>

        </div>

      </div>

      {children}

    </section>
  );
}

/* ============================================================
   DATE INPUT
============================================================ */

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type="date"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />

    </div>
  );
}

/* ============================================================
   SUMMARY VALUE
============================================================ */

function SummaryValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

      <p className="text-[10px] font-black uppercase tracking-wider text-blue-200">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-white">
        {value}
      </p>

    </div>
  );
}