"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, AlertCircle, Eye, EyeOff, Mail, ShieldCheck, Zap } from "lucide-react";
import { useAdminTheme } from "@/components/providers/AdminTheme";
import { auth } from "@/lib/firebase";

interface SettingsForm {
  business_name: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  brand_color: string;
  instagram: string;
  facebook: string;
  youtube: string;
  monday_hours: string;
  tuesday_hours: string;
  wednesday_hours: string;
  thursday_hours: string;
  friday_hours: string;
  saturday_hours: string;
  sunday_hours: string;
}

interface BrevoForm {
  api_key: string;
  api_key_display: string;
  sender_email: string;
  is_editing_key: boolean;
  show_key: boolean;
}

const defaultSettings: SettingsForm = {
  business_name: "Hyderabad Flower Decorators",
  phone: "+91 98765 43210",
  email: "info@hydflowerdecorators.com",
  whatsapp: "+91 98765 43210",
  address: "Hyderabad, Telangana, India",
  brand_color: "#B8935F",
  instagram: "https://instagram.com/hydflowerdecorators",
  facebook: "https://facebook.com/hydflowerdecorators",
  youtube: "",
  monday_hours: "9:00 AM - 9:00 PM",
  tuesday_hours: "9:00 AM - 9:00 PM",
  wednesday_hours: "9:00 AM - 9:00 PM",
  thursday_hours: "9:00 AM - 9:00 PM",
  friday_hours: "9:00 AM - 9:00 PM",
  saturday_hours: "9:00 AM - 9:00 PM",
  sunday_hours: "9:00 AM - 9:00 PM",
};

export default function AdminSettings() {
  const { theme } = useAdminTheme();
  const [settings, setSettings] = useState<SettingsForm>(defaultSettings);
  const [brevo, setBrevo] = useState<BrevoForm>({
    api_key: "",
    api_key_display: "",
    sender_email: "",
    is_editing_key: false,
    show_key: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dbReady, setDbReady] = useState(true);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        const s = data.settings;
        const hours = (s.business_hours || {}) as Record<string, string>;
        const social = (s.social_links || {}) as Record<string, string>;
        setSettings({
          business_name: s.business_name || "",
          phone: s.phone || "",
          email: s.email || "",
          whatsapp: s.whatsapp || "",
          address: s.address || "",
          brand_color: s.brand_color || "#B8935F",
          instagram: social.instagram || "",
          facebook: social.facebook || "",
          youtube: social.youtube || "",
          monday_hours: hours.monday || "9:00 AM - 9:00 PM",
          tuesday_hours: hours.tuesday || "9:00 AM - 9:00 PM",
          wednesday_hours: hours.wednesday || "9:00 AM - 9:00 PM",
          thursday_hours: hours.thursday || "9:00 AM - 9:00 PM",
          friday_hours: hours.friday || "9:00 AM - 9:00 PM",
          saturday_hours: hours.saturday || "9:00 AM - 9:00 PM",
          sunday_hours: hours.sunday || "9:00 AM - 9:00 PM",
        });
        setBrevo({
          api_key: "",
          api_key_display: s.brevo_api_key || "",
          sender_email: s.brevo_sender_email || "",
          is_editing_key: false,
          show_key: false,
        });
      }
      setDbReady(true);
    } catch {
      setDbReady(false);
    } finally {
      setIsLoaded(true);
    }
  };

  const handleChange = (field: keyof SettingsForm, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("You must be logged in as admin to save settings.");
        setIsSaving(false);
        return;
      }
      const idToken = await currentUser.getIdToken();

      const brevoApiKey = brevo.is_editing_key ? brevo.api_key : brevo.api_key_display;

      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          business_name: settings.business_name,
          phone: settings.phone,
          email: settings.email,
          whatsapp: settings.whatsapp,
          address: settings.address,
          brand_color: settings.brand_color,
          business_hours: {
            monday: settings.monday_hours,
            tuesday: settings.tuesday_hours,
            wednesday: settings.wednesday_hours,
            thursday: settings.thursday_hours,
            friday: settings.friday_hours,
            saturday: settings.saturday_hours,
            sunday: settings.sunday_hours,
          },
          social_links: {
            instagram: settings.instagram,
            facebook: settings.facebook,
            youtube: settings.youtube,
          },
          brevo_api_key: brevoApiKey,
          brevo_sender_email: brevo.sender_email,
        }),
      });

      await fetchSettings();
      setBrevo((prev) => ({ ...prev, is_editing_key: false }));
      alert("Settings saved successfully!");
    } catch {
      alert("Failed to save settings. Check your database connection and make sure you're logged in as admin.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestBrevo = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setTestResult({ success: false, message: "You must be logged in as admin to test." });
        setIsTesting(false);
        return;
      }
      const idToken = await currentUser.getIdToken();

      const apiKey = brevo.is_editing_key ? brevo.api_key : "";
      const res = await fetch("/api/admin/settings/test-brevo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          api_key: apiKey,
          sender_email: brevo.sender_email,
          test_email: currentUser.email,
        }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch {
      setTestResult({ success: false, message: "Network error — could not reach the server." });
    } finally {
      setIsTesting(false);
    }
  };

  // Card style helper
  const cardStyle = { background: theme.bgCard, border: `1px solid ${theme.borderColor}` };
  const inputStyle = { background: theme.bgInput, color: theme.textPrimary, borderColor: theme.borderColor };

  if (!isLoaded) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4" style={{ background: theme.bgPrimary }}>
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-body" style={{ color: theme.textSecondary }}>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ background: theme.bgPrimary }}>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold" style={{ color: theme.textPrimary }}>Settings</h1>
          <p className="text-sm font-body mt-1" style={{ color: theme.textSecondary }}>Manage your business information, preferences, and email configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || !dbReady}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body font-semibold transition-colors disabled:opacity-50"
          style={{ background: "#B8935F", color: "#1A1A1A" }}
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {!dbReady && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ background: "rgba(184,147,95,0.05)", border: "1px solid rgba(184,147,95,0.2)" }}>
          <AlertCircle className="w-5 h-5 text-gold shrink-0" />
          <p className="text-sm font-body" style={{ color: theme.textPrimary }}>Database connection issue. Check your database connection to save settings.</p>
        </div>
      )}

      <div className="space-y-6">

        {/* ─── Email Configuration (Brevo) ─────────────── */}
        <div className="rounded-2xl p-6" style={cardStyle}>
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-5 h-5 text-gold" />
            <h3 className="font-heading font-semibold" style={{ color: theme.textPrimary }}>Email Configuration</h3>
          </div>
          <p className="text-sm font-body mt-1 mb-5" style={{ color: theme.textSecondary }}>
            Configure Brevo (formerly Sendinblue) to send booking confirmation emails to customers and notifications to you.
          </p>

          <div className="space-y-5">
            {/* Security notice */}
            <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "rgba(91,117,83,0.05)", border: "1px solid rgba(91,117,83,0.15)" }}>
              <ShieldCheck className="w-5 h-5 text-sage shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-body" style={{ color: theme.textPrimary }}>
                  Your API key is stored securely in the database and is never exposed in the source code or visible to non-admin users.
                  When displayed here, only the last 4 characters are shown.
                </p>
              </div>
            </div>

            {/* Brevo API Key */}
            <div>
              <label className="block label-uppercase mb-2" style={{ color: theme.textSecondary }}>Brevo API Key</label>
              {brevo.is_editing_key ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type={brevo.show_key ? "text" : "password"}
                        value={brevo.api_key}
                        onChange={(e) => setBrevo((prev) => ({ ...prev, api_key: e.target.value }))}
                        placeholder="Paste your Brevo API key here"
                        className="w-full h-11 px-4 rounded-xl border text-sm font-body focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                        style={inputStyle}
                        autoComplete="off"
                      />
                      <button
                        onClick={() => setBrevo((prev) => ({ ...prev, show_key: !prev.show_key }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color: theme.textSecondary }}
                        type="button"
                      >
                        {brevo.show_key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      onClick={() => setBrevo((prev) => ({ ...prev, is_editing_key: false, api_key: "" }))}
                      className="h-11 px-4 rounded-xl text-sm font-body border transition-colors"
                      style={{ background: theme.bgHover, color: theme.textSecondary, borderColor: theme.borderColor }}
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-xs font-body" style={{ color: theme.textMuted }}>
                    Find your API key at <span className="text-gold">brevo.com → SMTP &amp; API → API Keys</span>. Create a new key with <strong>Transactional Email</strong> permissions.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-11 px-4 rounded-xl border font-body text-sm flex items-center" style={{ background: theme.bgHover, borderColor: theme.borderColor }}>
                    {brevo.api_key_display ? (
                      <span style={{ color: theme.textPrimary }}>{brevo.api_key_display}</span>
                    ) : (
                      <span className="italic" style={{ color: theme.textMuted }}>No API key configured — click "Change" to add one</span>
                    )}
                  </div>
                  <button
                    onClick={() => setBrevo((prev) => ({ ...prev, is_editing_key: true, api_key: "", show_key: false }))}
                    className="h-11 px-4 rounded-xl text-sm font-body border transition-colors"
                    style={{ background: theme.bgHover, color: theme.textSecondary, borderColor: theme.borderColor }}
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Sender Email */}
            <div>
              <label className="block label-uppercase mb-2" style={{ color: theme.textSecondary }}>Sender Email</label>
              <input
                type="email"
                value={brevo.sender_email}
                onChange={(e) => setBrevo((prev) => ({ ...prev, sender_email: e.target.value }))}
                placeholder="e.g. hydflowerdecorators@gmail.com"
                className="flex h-11 w-full rounded-xl border px-4 text-sm font-body focus:outline-none focus:border-gold transition-all"
                style={inputStyle}
              />
              <p className="text-xs font-body mt-2" style={{ color: theme.textMuted }}>
                This must be a <strong>verified sender email</strong> in your Brevo dashboard. Go to <span className="text-gold">brevo.com → Settings → Senders</span> to verify.
              </p>
            </div>

            {/* Test Connection */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleTestBrevo}
                disabled={isTesting || (!brevo.api_key_display && !brevo.api_key)}
                className="flex items-center gap-2 h-11 px-4 rounded-xl text-sm font-body border transition-colors disabled:opacity-50"
                style={{ background: theme.bgHover, color: theme.textSecondary, borderColor: theme.borderColor }}
              >
                {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Test Connection
              </button>
              {testResult && (
                <div className={`flex items-center gap-2 text-sm font-body ${testResult.success ? "text-sage" : "text-red-500"}`}>
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>

            {/* Setup Steps */}
            <div className="pt-3" style={{ borderTop: `1px solid ${theme.borderColor}` }}>
              <p className="text-xs font-body leading-relaxed" style={{ color: theme.textMuted }}>
                <strong style={{ color: theme.textPrimary }}>Setup Steps:</strong><br />
                1. Create a free Brevo account at <span className="text-gold">brevo.com</span><br />
                2. Verify your sender email in Brevo dashboard → Settings → Senders<br />
                3. Generate an API key in Brevo → SMTP & API → API Keys (Transactional Email scope)<br />
                4. Paste the API key and enter your verified sender email above<br />
                5. Click "Test Connection" to verify everything works<br />
                6. Save settings
              </p>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="rounded-2xl p-6" style={cardStyle}>
          <h3 className="font-heading font-semibold mb-5" style={{ color: theme.textPrimary }}>Business Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { key: "business_name", label: "Business Name" },
              { key: "phone", label: "Phone Number" },
              { key: "email", label: "Email Address", type: "email" },
              { key: "whatsapp", label: "WhatsApp Number" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block label-uppercase mb-2" style={{ color: theme.textSecondary }}>{label}</label>
                <input
                  type={type || "text"}
                  value={settings[key as keyof SettingsForm]}
                  onChange={(e) => handleChange(key as keyof SettingsForm, e.target.value)}
                  className="flex h-11 w-full rounded-xl border px-4 text-sm font-body focus:outline-none focus:border-gold transition-all"
                  style={inputStyle}
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block label-uppercase mb-2" style={{ color: theme.textSecondary }}>Address</label>
              <input
                value={settings.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="flex h-11 w-full rounded-xl border px-4 text-sm font-body focus:outline-none focus:border-gold transition-all"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block label-uppercase mb-2" style={{ color: theme.textSecondary }}>Brand Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={settings.brand_color} onChange={(e) => handleChange("brand_color", e.target.value)} className="w-11 h-11 rounded-lg border cursor-pointer" style={{ borderColor: theme.borderColor }} />
                <input
                  value={settings.brand_color}
                  onChange={(e) => handleChange("brand_color", e.target.value)}
                  className="flex h-11 rounded-xl border px-4 text-sm font-body focus:outline-none focus:border-gold flex-1 transition-all"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-2xl p-6" style={cardStyle}>
          <h3 className="font-heading font-semibold mb-5" style={{ color: theme.textPrimary }}>Social Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
              { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
              { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/..." },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block label-uppercase mb-2" style={{ color: theme.textSecondary }}>{label}</label>
                <input
                  value={settings[key as keyof SettingsForm]}
                  onChange={(e) => handleChange(key as keyof SettingsForm, e.target.value)}
                  placeholder={placeholder}
                  className="flex h-11 w-full rounded-xl border px-4 text-sm font-body focus:outline-none focus:border-gold transition-all"
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Business Hours */}
        <div className="rounded-2xl p-6" style={cardStyle}>
          <h3 className="font-heading font-semibold mb-5" style={{ color: theme.textPrimary }}>Business Hours</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: "monday_hours", label: "Monday" },
              { key: "tuesday_hours", label: "Tuesday" },
              { key: "wednesday_hours", label: "Wednesday" },
              { key: "thursday_hours", label: "Thursday" },
              { key: "friday_hours", label: "Friday" },
              { key: "saturday_hours", label: "Saturday" },
              { key: "sunday_hours", label: "Sunday" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block label-uppercase mb-2" style={{ color: theme.textSecondary }}>{label}</label>
                <input
                  value={settings[key as keyof SettingsForm]}
                  onChange={(e) => handleChange(key as keyof SettingsForm, e.target.value)}
                  placeholder="9:00 AM - 9:00 PM"
                  className="flex h-11 w-full rounded-xl border px-4 text-sm font-body focus:outline-none focus:border-gold transition-all"
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
