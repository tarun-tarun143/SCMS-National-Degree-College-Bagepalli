"use client";

import {
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  Globe2,
  Lock,
  Mail,
  Palette,
  RefreshCw,
  Save,
  ShieldCheck,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  UserCog,
  X,
  XCircle,
} from "lucide-react";

import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type ElementType,
} from "react";

import PortalShell from "@/components/portal/PortalShell";
import PageHeading from "@/components/portal/PageHeading";
import { firestoreDb } from "@/lib/firebase/client";

/* ============================================================
   TYPES
============================================================ */

type SettingsData = {
  collegeName: string;
  shortName: string;
  principalName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  website: string;

  academicYear: string;
  currentSemester: string;

  maintenanceMode: boolean;
  registrationEnabled: boolean;
  studentPortalEnabled: boolean;
  facultyPortalEnabled: boolean;

  emailNotifications: boolean;
  pushNotifications: boolean;
  approvalNotifications: boolean;
  noticeNotifications: boolean;

  requireAdminApproval: boolean;
  allowGoogleLogin: boolean;
  allowEmailLogin: boolean;

  theme: "light" | "dark" | "system";

  updatedAt?: unknown;
};

type SectionKey =
  | "institution"
  | "academic"
  | "portal"
  | "notifications"
  | "security"
  | "appearance";

/* ============================================================
   DEFAULT SETTINGS
============================================================ */

const defaultSettings: SettingsData = {
  collegeName:
    "The National Degree College, Bagepalli",

  shortName: "NDC Bagepalli",

  principalName: "",

  email: "",

  phone: "",

  alternatePhone: "",

  address:
    "Bagepalli, Chikkaballapur District, Karnataka, India",

  website: "",

  academicYear: "2026-27",

  currentSemester: "2nd Semester",

  maintenanceMode: false,

  registrationEnabled: true,

  studentPortalEnabled: true,

  facultyPortalEnabled: true,

  emailNotifications: true,

  pushNotifications: true,

  approvalNotifications: true,

  noticeNotifications: true,

  requireAdminApproval: true,

  allowGoogleLogin: true,

  allowEmailLogin: true,

  theme: "light",
};

/* ============================================================
   PAGE
============================================================ */

export default function AdminSettingsPage() {
  const [settings, setSettings] =
    useState<SettingsData>({
      ...defaultSettings,
    });

  const [savedSettings, setSavedSettings] =
    useState<SettingsData>({
      ...defaultSettings,
    });

  const [activeSection, setActiveSection] =
    useState<SectionKey>("institution");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* ==========================================================
     REAL-TIME FIRESTORE LISTENER
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

    setLoading(true);
    setError("");

    const settingsRef = doc(
      db,
      "settings",
      "admin"
    );

    const unsubscribe = onSnapshot(
      settingsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setSettings({
            ...defaultSettings,
          });

          setSavedSettings({
            ...defaultSettings,
          });

          setLoading(false);

          return;
        }

        const data = snapshot.data();

        const incoming: SettingsData = {
          ...defaultSettings,

          ...data,

          collegeName: String(
            data.collegeName ??
              defaultSettings.collegeName
          ),

          shortName: String(
            data.shortName ??
              defaultSettings.shortName
          ),

          principalName: String(
            data.principalName ?? ""
          ),

          email: String(
            data.email ?? ""
          ),

          phone: String(
            data.phone ?? ""
          ),

          alternatePhone: String(
            data.alternatePhone ?? ""
          ),

          address: String(
            data.address ??
              defaultSettings.address
          ),

          website: String(
            data.website ?? ""
          ),

          academicYear: String(
            data.academicYear ??
              defaultSettings.academicYear
          ),

          currentSemester: String(
            data.currentSemester ??
              defaultSettings.currentSemester
          ),

          maintenanceMode:
            Boolean(
              data.maintenanceMode ??
                defaultSettings.maintenanceMode
            ),

          registrationEnabled:
            Boolean(
              data.registrationEnabled ??
                defaultSettings.registrationEnabled
            ),

          studentPortalEnabled:
            Boolean(
              data.studentPortalEnabled ??
                defaultSettings.studentPortalEnabled
            ),

          facultyPortalEnabled:
            Boolean(
              data.facultyPortalEnabled ??
                defaultSettings.facultyPortalEnabled
            ),

          emailNotifications:
            Boolean(
              data.emailNotifications ??
                defaultSettings.emailNotifications
            ),

          pushNotifications:
            Boolean(
              data.pushNotifications ??
                defaultSettings.pushNotifications
            ),

          approvalNotifications:
            Boolean(
              data.approvalNotifications ??
                defaultSettings.approvalNotifications
            ),

          noticeNotifications:
            Boolean(
              data.noticeNotifications ??
                defaultSettings.noticeNotifications
            ),

          requireAdminApproval:
            Boolean(
              data.requireAdminApproval ??
                defaultSettings.requireAdminApproval
            ),

          allowGoogleLogin:
            Boolean(
              data.allowGoogleLogin ??
                defaultSettings.allowGoogleLogin
            ),

          allowEmailLogin:
            Boolean(
              data.allowEmailLogin ??
                defaultSettings.allowEmailLogin
            ),

          theme:
            data.theme === "dark" ||
            data.theme === "system"
              ? data.theme
              : "light",
        };

        setSettings(incoming);

        setSavedSettings(incoming);

        setLoading(false);

        setError("");
      },
      (listenerError) => {
        console.error(
          "Settings listener error:",
          listenerError
        );

        setError(
          listenerError instanceof Error
            ? listenerError.message
            : "Unable to load settings."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ==========================================================
     FIELD UPDATE
  ========================================================== */

  function updateField<
    K extends keyof SettingsData
  >(
    field: K,
    value: SettingsData[K]
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));

    setSuccess("");
    setError("");
  }

  function handleTextChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
    field:
      | "collegeName"
      | "shortName"
      | "principalName"
      | "email"
      | "phone"
      | "alternatePhone"
      | "address"
      | "website"
      | "academicYear"
  ) {
    updateField(
      field,
      event.target.value
    );
  }

  /* ==========================================================
     SAVE
  ========================================================== */

  async function handleSave() {
    const db = firestoreDb;

    if (!db) {
      setError(
        "Firestore is not initialized."
      );

      return;
    }

    try {
      setSaving(true);

      setError("");
      setSuccess("");

      const settingsRef = doc(
        db,
        "settings",
        "admin"
      );

      await setDoc(
        settingsRef,
        {
          ...settings,
          updatedAt:
            serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      setSavedSettings({
        ...settings,
      });

      setSuccess(
        "Settings saved successfully. Changes are now live."
      );
    } catch (err) {
      console.error(
        "Settings save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  /* ==========================================================
     RESET
  ========================================================== */

  function handleReset() {
    setSettings({
      ...savedSettings,
    });

    setError("");

    setSuccess(
      "Unsaved changes were discarded."
    );
  }

  /* ==========================================================
     RESTORE DEFAULT
  ========================================================== */

  function restoreDefaults() {
    const confirmed =
      window.confirm(
        "Restore all settings to the default SCMS configuration?"
      );

    if (!confirmed) {
      return;
    }

    setSettings({
      ...defaultSettings,
    });

    setError("");

    setSuccess(
      "Default values restored locally. Click Save Changes to apply them."
    );
  }

  /* ==========================================================
     MENU
  ========================================================== */

  const menuItems: Array<{
    key: SectionKey;
    label: string;
    description: string;
    icon: ElementType;
    color: string;
  }> = [
    {
      key: "institution",
      label: "Institution",
      description:
        "College identity and contact details",
      icon: Building2,
      color:
        "from-blue-600 to-cyan-500",
    },

    {
      key: "academic",
      label: "Academic",
      description:
        "Academic year and semester settings",
      icon: UserCog,
      color:
        "from-violet-600 to-fuchsia-500",
    },

    {
      key: "portal",
      label: "Portal",
      description:
        "Student and faculty portal controls",
      icon: Globe2,
      color:
        "from-emerald-500 to-teal-500",
    },

    {
      key: "notifications",
      label: "Notifications",
      description:
        "System notification preferences",
      icon: Bell,
      color:
        "from-orange-500 to-amber-500",
    },

    {
      key: "security",
      label: "Security",
      description:
        "Authentication and approval controls",
      icon: ShieldCheck,
      color:
        "from-red-500 to-rose-500",
    },

    {
      key: "appearance",
      label: "Appearance",
      description:
        "SCMS interface preferences",
      icon: Palette,
      color:
        "from-pink-500 to-purple-500",
    },
  ];

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <PortalShell
      role="admin"
      title="Settings"
    >
      <main className="space-y-8 pb-10">
        <PageHeading
          eyebrow="System administration"
          title="SCMS Settings"
          description="Configure institution details, academic settings, portal access, notifications, security and system appearance."
        />

        {/* ==================================================
            ALERTS
        ================================================== */}

        {error && (
          <AlertBox
            type="error"
            message={error}
            onClose={() =>
              setError("")
            }
          />
        )}

        {success && (
          <AlertBox
            type="success"
            message={success}
            onClose={() =>
              setSuccess("")
            }
          />
        )}

        {/* ==================================================
            LIVE STATUS
        ================================================== */}

        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-[1px] shadow-xl">
          <div className="rounded-[23px] bg-white/95 px-5 py-4 backdrop-blur">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-700">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>

                Real-time settings
              </span>

              <span className="text-xs font-medium text-slate-500">
                Configuration is synchronized with Firestore automatically.
              </span>

              <div className="ml-auto hidden items-center gap-2 text-xs font-bold text-slate-400 md:flex">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Admin protected
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            MAIN LAYOUT
        ================================================== */}

        <section className="grid gap-6 xl:grid-cols-[300px_1fr]">
          {/* ================================================
              SIDEBAR
          ================================================= */}

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/50 xl:sticky xl:top-6">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-5 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">
                Configuration
              </p>

              <h2 className="mt-1 text-xl font-black">
                System Settings
              </h2>

              <p className="mt-2 text-xs leading-5 text-blue-100">
                Manage your complete SCMS application configuration.
              </p>
            </div>

            <div className="mt-3 grid gap-1">
              {menuItems.map(
                (item) => {
                  const Icon =
                    item.icon;

                  const active =
                    activeSection ===
                    item.key;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        setActiveSection(
                          item.key
                        )
                      }
                      className={`group relative flex w-full items-start gap-3 overflow-hidden rounded-2xl p-3 text-left transition-all duration-300 ${
                        active
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {active && (
                        <span
                          className={`absolute inset-y-2 left-0 w-1 rounded-r-full bg-gradient-to-b ${item.color}`}
                        />
                      )}

                      <div
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition ${
                          active
                            ? `bg-gradient-to-br ${item.color} text-white shadow-lg`
                            : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm"
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-black">
                          {item.label}
                        </p>

                        <p className="mt-0.5 text-[10px] leading-4 text-slate-400">
                          {
                            item.description
                          }
                        </p>
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-cyan-600 shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-black text-cyan-900">
                    Administrator only
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-cyan-700">
                    These settings can affect the complete college management system.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* ================================================
              CONTENT
          ================================================= */}

          <div className="space-y-6">
            {loading ? (
              <LoadingState />
            ) : (
              <>
                {activeSection ===
                  "institution" && (
                  <InstitutionSection
                    settings={
                      settings
                    }
                    onChange={
                      handleTextChange
                    }
                  />
                )}

                {activeSection ===
                  "academic" && (
                  <AcademicSection
                    settings={
                      settings
                    }
                    updateField={
                      updateField
                    }
                  />
                )}

                {activeSection ===
                  "portal" && (
                  <PortalSection
                    settings={
                      settings
                    }
                    updateField={
                      updateField
                    }
                  />
                )}

                {activeSection ===
                  "notifications" && (
                  <NotificationsSection
                    settings={
                      settings
                    }
                    updateField={
                      updateField
                    }
                  />
                )}

                {activeSection ===
                  "security" && (
                  <SecuritySection
                    settings={
                      settings
                    }
                    updateField={
                      updateField
                    }
                  />
                )}

                {activeSection ===
                  "appearance" && (
                  <AppearanceSection
                    settings={
                      settings
                    }
                    updateField={
                      updateField
                    }
                  />
                )}

                {/* ======================================
                    SAVE BAR
                ======================================= */}

                <section className="sticky bottom-4 z-30 overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl">
                  <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-500" />

                  <div className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                          <Save className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="text-sm font-black text-slate-800">
                            Save your configuration
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Changes are applied globally after saving.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={
                            restoreDefaults
                          }
                          disabled={
                            saving
                          }
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                          Restore Defaults
                        </button>

                        <button
                          type="button"
                          onClick={
                            handleReset
                          }
                          disabled={
                            saving
                          }
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                          Reset Changes
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void handleSave()
                          }
                          disabled={
                            saving
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {saving ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}

                          {saving
                            ? "Saving..."
                            : "Save Changes"}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </section>
      </main>
    </PortalShell>
  );
}

/* ============================================================
   INSTITUTION
============================================================ */

function InstitutionSection({
  settings,
  onChange,
}: {
  settings: SettingsData;
  onChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
    field:
      | "collegeName"
      | "shortName"
      | "principalName"
      | "email"
      | "phone"
      | "alternatePhone"
      | "address"
      | "website"
      | "academicYear"
  ) => void;
}) {
  return (
    <SettingsCard
      eyebrow="Institution"
      title="College Information"
      description="Manage the official identity and contact information displayed throughout the SCMS."
      icon={Building2}
      gradient="from-blue-600 via-indigo-600 to-cyan-500"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <InputField
          label="College Name"
          value={
            settings.collegeName
          }
          onChange={(event) =>
            onChange(
              event,
              "collegeName"
            )
          }
          placeholder="The National Degree College, Bagepalli"
        />

        <InputField
          label="Short Name"
          value={
            settings.shortName
          }
          onChange={(event) =>
            onChange(
              event,
              "shortName"
            )
          }
          placeholder="NDC Bagepalli"
        />

        <InputField
          label="Principal Name"
          value={
            settings.principalName
          }
          onChange={(event) =>
            onChange(
              event,
              "principalName"
            )
          }
          placeholder="Principal name"
        />

        <InputField
          label="Official Email"
          type="email"
          value={
            settings.email
          }
          onChange={(event) =>
            onChange(
              event,
              "email"
            )
          }
          placeholder="college@example.com"
        />

        <InputField
          label="Primary Phone"
          type="tel"
          value={
            settings.phone
          }
          onChange={(event) =>
            onChange(
              event,
              "phone"
            )
          }
          placeholder="9876543210"
        />

        <InputField
          label="Alternate Phone"
          type="tel"
          value={
            settings.alternatePhone
          }
          onChange={(event) =>
            onChange(
              event,
              "alternatePhone"
            )
          }
          placeholder="Optional contact number"
        />

        <InputField
          label="Website"
          type="url"
          value={
            settings.website
          }
          onChange={(event) =>
            onChange(
              event,
              "website"
            )
          }
          placeholder="https://college.example.com"
        />

        <div className="md:col-span-2">
          <TextAreaField
            label="College Address"
            value={
              settings.address
            }
            onChange={(event) =>
              onChange(
                event,
                "address"
              )
            }
            placeholder="College full address"
          />
        </div>
      </div>
    </SettingsCard>
  );
}

/* ============================================================
   ACADEMIC
============================================================ */

function AcademicSection({
  settings,
  updateField,
}: {
  settings: SettingsData;
  updateField: <
    K extends keyof SettingsData
  >(
    field: K,
    value: SettingsData[K]
  ) => void;
}) {
  return (
    <SettingsCard
      eyebrow="Academic configuration"
      title="Academic Settings"
      description="Set the current academic year and semester used across the college portal."
      icon={UserCog}
      gradient="from-violet-600 via-fuchsia-500 to-pink-500"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <InputField
          label="Academic Year"
          value={
            settings.academicYear
          }
          onChange={(event) =>
            updateField(
              "academicYear",
              event.target.value
            )
          }
          placeholder="2026-27"
        />

        <SelectField
          label="Current Semester"
          value={
            settings.currentSemester
          }
          onChange={(value) =>
            updateField(
              "currentSemester",
              value
            )
          }
          options={[
            "1st Semester",
            "2nd Semester",
            "3rd Semester",
            "4th Semester",
            "5th Semester",
            "6th Semester",
          ]}
        />
      </div>

      <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-[1px]">
        <div className="rounded-[15px] bg-white p-5">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-black text-slate-900">
                Current academic configuration
              </p>

              <p className="mt-1 text-sm font-bold text-transparent bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text">
                {settings.academicYear} ·{" "}
                {
                  settings.currentSemester
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}

/* ============================================================
   PORTAL
============================================================ */

function PortalSection({
  settings,
  updateField,
}: {
  settings: SettingsData;
  updateField: <
    K extends keyof SettingsData
  >(
    field: K,
    value: SettingsData[K]
  ) => void;
}) {
  return (
    <SettingsCard
      eyebrow="Portal controls"
      title="Portal Access"
      description="Control availability of registration and individual SCMS portals."
      icon={Globe2}
      gradient="from-emerald-500 via-teal-500 to-cyan-500"
    >
      <div className="grid gap-4">
        <ToggleRow
          label="Student Portal"
          description="Allow active students to access the student portal."
          enabled={
            settings.studentPortalEnabled
          }
          onChange={(value) =>
            updateField(
              "studentPortalEnabled",
              value
            )
          }
        />

        <ToggleRow
          label="Faculty Portal"
          description="Allow active faculty members to access the faculty portal."
          enabled={
            settings.facultyPortalEnabled
          }
          onChange={(value) =>
            updateField(
              "facultyPortalEnabled",
              value
            )
          }
        />

        <ToggleRow
          label="New Registration"
          description="Allow new users to submit student or faculty registration requests."
          enabled={
            settings.registrationEnabled
          }
          onChange={(value) =>
            updateField(
              "registrationEnabled",
              value
            )
          }
        />

        <ToggleRow
          label="Maintenance Mode"
          description="Temporarily display a maintenance state for the college system."
          enabled={
            settings.maintenanceMode
          }
          onChange={(value) =>
            updateField(
              "maintenanceMode",
              value
            )
          }
          danger
        />
      </div>
    </SettingsCard>
  );
}

/* ============================================================
   NOTIFICATIONS
============================================================ */

function NotificationsSection({
  settings,
  updateField,
}: {
  settings: SettingsData;
  updateField: <
    K extends keyof SettingsData
  >(
    field: K,
    value: SettingsData[K]
  ) => void;
}) {
  return (
    <SettingsCard
      eyebrow="Communication"
      title="Notification Preferences"
      description="Configure system-wide notification behavior for administrative events."
      icon={Bell}
      gradient="from-orange-500 via-amber-500 to-yellow-500"
    >
      <div className="grid gap-4">
        <ToggleRow
          label="Email Notifications"
          description="Enable system notifications through email."
          enabled={
            settings.emailNotifications
          }
          onChange={(value) =>
            updateField(
              "emailNotifications",
              value
            )
          }
        />

        <ToggleRow
          label="Push Notifications"
          description="Allow browser or application push notifications."
          enabled={
            settings.pushNotifications
          }
          onChange={(value) =>
            updateField(
              "pushNotifications",
              value
            )
          }
        />

        <ToggleRow
          label="Approval Notifications"
          description="Notify administrators about student and faculty approval requests."
          enabled={
            settings.approvalNotifications
          }
          onChange={(value) =>
            updateField(
              "approvalNotifications",
              value
            )
          }
        />

        <ToggleRow
          label="Notice Notifications"
          description="Notify users when new official college notices are published."
          enabled={
            settings.noticeNotifications
          }
          onChange={(value) =>
            updateField(
              "noticeNotifications",
              value
            )
          }
        />
      </div>
    </SettingsCard>
  );
}

/* ============================================================
   SECURITY
============================================================ */

function SecuritySection({
  settings,
  updateField,
}: {
  settings: SettingsData;
  updateField: <
    K extends keyof SettingsData
  >(
    field: K,
    value: SettingsData[K]
  ) => void;
}) {
  return (
    <SettingsCard
      eyebrow="Access control"
      title="Security & Authentication"
      description="Configure how users authenticate and whether registrations require administrator approval."
      icon={ShieldCheck}
      gradient="from-red-500 via-rose-500 to-pink-500"
    >
      <div className="grid gap-4">
        <ToggleRow
          label="Administrator Approval"
          description="Require administrator approval before new student or faculty accounts become active."
          enabled={
            settings.requireAdminApproval
          }
          onChange={(value) =>
            updateField(
              "requireAdminApproval",
              value
            )
          }
        />

        <ToggleRow
          label="Google Authentication"
          description="Allow users to sign in through Google authentication."
          enabled={
            settings.allowGoogleLogin
          }
          onChange={(value) =>
            updateField(
              "allowGoogleLogin",
              value
            )
          }
        />

        <ToggleRow
          label="Email & Password Authentication"
          description="Allow registered users to sign in with email and password."
          enabled={
            settings.allowEmailLogin
          }
          onChange={(value) =>
            updateField(
              "allowEmailLogin",
              value
            )
          }
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-[1px]">
        <div className="rounded-[15px] bg-white/60 p-5">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600">
              <Lock className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-black text-amber-900">
                Security note
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                These settings are application preferences. Firebase Authentication and Firestore Security Rules still determine actual access permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}

/* ============================================================
   APPEARANCE
============================================================ */

function AppearanceSection({
  settings,
  updateField,
}: {
  settings: SettingsData;
  updateField: <
    K extends keyof SettingsData
  >(
    field: K,
    value: SettingsData[K]
  ) => void;
}) {
  return (
    <SettingsCard
      eyebrow="Interface"
      title="Appearance"
      description="Choose the preferred visual theme for the SCMS interface."
      icon={Palette}
      gradient="from-pink-500 via-purple-500 to-indigo-600"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <ThemeCard
          value="light"
          title="Light"
          description="Bright professional interface"
          active={
            settings.theme ===
            "light"
          }
          onClick={() =>
            updateField(
              "theme",
              "light"
            )
          }
        />

        <ThemeCard
          value="dark"
          title="Dark"
          description="Dark interface for low-light environments"
          active={
            settings.theme ===
            "dark"
          }
          onClick={() =>
            updateField(
              "theme",
              "dark"
            )
          }
        />

        <ThemeCard
          value="system"
          title="System"
          description="Follow the device appearance"
          active={
            settings.theme ===
            "system"
          }
          onClick={() =>
            updateField(
              "theme",
              "system"
            )
          }
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <InfoCard
          icon={Smartphone}
          title="Responsive interface"
          text="SCMS settings are designed for desktop, tablet and mobile devices."
          gradient="from-blue-500 to-cyan-500"
        />

        <InfoCard
          icon={Palette}
          title="Unified design"
          text="All administrative sections use the same professional academic visual language."
          gradient="from-purple-500 to-pink-500"
        />
      </div>
    </SettingsCard>
  );
}

/* ============================================================
   SETTINGS CARD
============================================================ */

function SettingsCard({
  eyebrow,
  title,
  description,
  icon: Icon,
  gradient,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: ElementType;
  gradient: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
      <div
        className={`h-1 bg-gradient-to-r ${gradient}`}
      />

      <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-6 py-6">
        <div className="flex items-start gap-4">
          <div
            className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-xl`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">
              {eyebrow}
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-900">
              {title}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}

/* ============================================================
   INPUT
============================================================ */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
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
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
      />
    </div>
  );
}

/* ============================================================
   TEXTAREA
============================================================ */

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
      />
    </div>
  );
}

/* ============================================================
   SELECT
============================================================ */

function SelectField({
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
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      >
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
   TOGGLE
============================================================ */

function ToggleRow({
  label,
  description,
  enabled,
  onChange,
  danger = false,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (
    value: boolean
  ) => void;
  danger?: boolean;
}) {
  return (
    <div
      className={`group flex items-center justify-between gap-4 rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
        danger && enabled
          ? "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
          : "border-slate-200 bg-slate-50 hover:bg-white"
      }`}
    >
      <div className="flex min-w-0 items-start gap-4">
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
            danger && enabled
              ? "bg-red-100 text-red-600"
              : enabled
                ? "bg-emerald-100 text-emerald-600"
                : "bg-slate-100 text-slate-400"
          }`}
        >
          {enabled ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
        </div>

        <div className="min-w-0">
          <p
            className={`text-sm font-black ${
              danger && enabled
                ? "text-red-700"
                : "text-slate-800"
            }`}
          >
            {label}
          </p>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange(!enabled)
        }
        aria-pressed={enabled}
        className="shrink-0 transition hover:scale-105"
        title={
          enabled
            ? "Disable"
            : "Enable"
        }
      >
        {enabled ? (
          <ToggleRight
            className={`h-10 w-10 ${
              danger
                ? "text-red-600"
                : "text-emerald-600"
            }`}
          />
        ) : (
          <ToggleLeft className="h-10 w-10 text-slate-400" />
        )}
      </button>
    </div>
  );
}

/* ============================================================
   THEME CARD
============================================================ */

function ThemeCard({
  value,
  title,
  description,
  active,
  onClick,
}: {
  value:
    | "light"
    | "dark"
    | "system";
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  const themeGradient =
    value === "light"
      ? "from-blue-500 to-cyan-400"
      : value === "dark"
        ? "from-slate-800 to-slate-950"
        : "from-violet-500 to-fuchsia-500";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
        active
          ? "border-indigo-400 bg-indigo-50 shadow-lg shadow-indigo-500/10 ring-4 ring-indigo-100"
          : "border-slate-200 bg-white hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
      }`}
    >
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${themeGradient} opacity-10 blur-2xl transition group-hover:scale-150`}
      />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-xl bg-gradient-to-br ${themeGradient} shadow-lg`}
          />

          <span className="text-sm font-black text-slate-800">
            {title}
          </span>
        </div>

        {active && (
          <CheckCircle2 className="h-5 w-5 text-indigo-600" />
        )}
      </div>

      <p className="relative mt-3 text-xs leading-5 text-slate-500">
        {description}
      </p>

      <div className="relative mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white p-3">
        {value === "dark" ? (
          <div className="rounded-lg bg-slate-950 p-3">
            <div className="h-2 w-1/2 rounded-full bg-blue-400" />
            <div className="mt-2 h-2 w-3/4 rounded-full bg-slate-700" />
            <div className="mt-2 h-2 w-2/5 rounded-full bg-slate-800" />
          </div>
        ) : value === "system" ? (
          <div className="grid grid-cols-2 overflow-hidden rounded-lg">
            <div className="bg-white p-3">
              <div className="h-2 w-1/2 rounded-full bg-blue-400" />
              <div className="mt-2 h-2 w-3/4 rounded-full bg-slate-200" />
            </div>

            <div className="bg-slate-900 p-3">
              <div className="h-2 w-1/2 rounded-full bg-violet-400" />
              <div className="mt-2 h-2 w-3/4 rounded-full bg-slate-700" />
            </div>
          </div>
        ) : (
          <div className="bg-white p-3">
            <div className="h-2 w-1/2 rounded-full bg-blue-500" />
            <div className="mt-2 h-2 w-3/4 rounded-full bg-slate-200" />
            <div className="mt-2 h-2 w-2/5 rounded-full bg-slate-100" />
          </div>
        )}
      </div>
    </button>
  );
}

/* ============================================================
   INFO CARD
============================================================ */

function InfoCard({
  icon: Icon,
  title,
  text,
  gradient,
}: {
  icon: ElementType;
  title: string;
  text: string;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md">
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition group-hover:scale-150`}
      />

      <div className="relative flex items-start gap-3">
        <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-black text-slate-800">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ALERT
============================================================ */

function AlertBox({
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
      className={`overflow-hidden rounded-2xl border p-4 shadow-sm ${
        isError
          ? "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
          : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`grid h-9 w-9 place-items-center rounded-xl ${
              isError
                ? "bg-red-100 text-red-600"
                : "bg-emerald-100 text-emerald-600"
            }`}
          >
            {isError ? (
              <XCircle className="h-5 w-5" />
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
                ? "Settings operation failed"
                : "Success"}
            </p>

            <p
              className={`mt-1 text-sm leading-6 ${
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
          className={`rounded-lg p-1 transition ${
            isError
              ? "text-red-500 hover:bg-red-100"
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
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-500" />

      <div className="p-14">
        <div className="flex flex-col items-center justify-center">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-blue-50 to-violet-50">
            <RefreshCw className="h-7 w-7 animate-spin text-indigo-600" />
          </div>

          <p className="mt-5 text-sm font-black text-slate-700">
            Loading SCMS settings...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Synchronizing configuration from Firestore.
          </p>
        </div>
      </div>
    </div>
  );
}