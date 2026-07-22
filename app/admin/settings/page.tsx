"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, AlertCircle, Eye, EyeOff, Mail, ShieldCheck, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
          api_key: "", // Keep empty — we only have the masked version
          api_key_display: s.brevo_api_key || "", // Masked version from API
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

      // Re-fetch to get updated masked key
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
      // If not editing, we don't have the full key locally — read from DB
      // The test endpoint can use the saved key from DB if api_key is empty
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

  if (!isLoaded) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-warm-gray font-body">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-charcoal">Settings</h1>
          <p className="text-sm text-warm-gray font-body mt-1">Manage your business information, preferences, and email configuration</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving || !dbReady} variant="default" className="gap-2">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      {!dbReady && (
        <div className="mb-6 p-4 rounded-xl bg-gold/5 border border-gold/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-gold shrink-0" />
          <p className="text-sm text-charcoal font-body">Database connection issue. Check your database connection to save settings.</p>
        </div>
      )}

      <div className="space-y-6">

        {/* ─── Email Configuration (Brevo) ─────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gold" />
              <CardTitle>Email Configuration</CardTitle>
            </div>
            <p className="text-sm text-warm-gray font-body mt-1">
              Configure Brevo (formerly Sendinblue) to send booking confirmation emails to customers and notifications to you.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {/* Security notice */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-sage/5 border border-sage/15">
                <ShieldCheck className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-charcoal font-body">
                    Your API key is stored securely in the database and is never exposed in the source code or visible to non-admin users.
                    When displayed here, only the last 4 characters are shown.
                  </p>
                </div>
              </div>

              {/* Brevo API Key */}
              <div>
                <label className="block label-uppercase text-stone mb-2">Brevo API Key</label>
                {brevo.is_editing_key ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type={brevo.show_key ? "text" : "password"}
                          value={brevo.api_key}
                          onChange={(e) => setBrevo((prev) => ({ ...prev, api_key: e.target.value }))}
                          placeholder="Paste your Brevo API key here"
                          className="w-full h-11 px-4 rounded-lg border border-border-light bg-ivory text-charcoal font-body text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                          autoComplete="off"
                        />
                        <button
                          onClick={() => setBrevo((prev) => ({ ...prev, show_key: !prev.show_key }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-charcoal transition-colors"
                          type="button"
                        >
                          {brevo.show_key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setBrevo((prev) => ({ ...prev, is_editing_key: false, api_key: "" }))}
                      >
                        Cancel
                      </Button>
                    </div>
                    <p className="text-xs text-warm-gray font-body">
                      Find your API key at <span className="text-gold">brevo.com → SMTP &amp; API → API Keys</span>. Create a new key with <strong>Transactional Email</strong> permissions.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-11 px-4 rounded-lg border border-border-light bg-ivory/50 text-stone font-body text-sm flex items-center">
                      {brevo.api_key_display ? (
                        <span className="text-charcoal">{brevo.api_key_display}</span>
                      ) : (
                        <span className="text-warm-gray italic">No API key configured — click "Change" to add one</span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBrevo((prev) => ({ ...prev, is_editing_key: true, api_key: "", show_key: false }))}
                    >
                      Change
                    </Button>
                  </div>
                )}
              </div>

              {/* Sender Email */}
              <div>
                <label className="block label-uppercase text-stone mb-2">Sender Email</label>
                <Input
                  label=""
                  value={brevo.sender_email}
                  onChange={(e) => setBrevo((prev) => ({ ...prev, sender_email: e.target.value }))}
                  placeholder="e.g. hydflowerdecorators@gmail.com"
                  type="email"
                />
                <p className="text-xs text-warm-gray font-body mt-2">
                  This must be a <strong>verified sender email</strong> in your Brevo dashboard. Go to <span className="text-gold">brevo.com → Settings → Senders</span> to verify.
                </p>
              </div>

              {/* Test Connection */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestBrevo}
                  disabled={isTesting || (!brevo.api_key_display && !brevo.api_key)}
                  className="gap-2"
                >
                  {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Test Connection
                </Button>
                {testResult && (
                  <div className={`flex items-center gap-2 text-sm font-body ${testResult.success ? "text-sage" : "text-red-500"}`}>
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>

              {/* Setup Steps */}
              <div className="pt-3 border-t border-border-light">
                <p className="text-xs text-warm-gray font-body leading-relaxed">
                  <strong className="text-charcoal">Setup Steps:</strong><br />
                  1. Create a free Brevo account at <span className="text-gold">brevo.com</span><br />
                  2. Verify your sender email in Brevo dashboard → Settings → Senders<br />
                  3. Generate an API key in Brevo → SMTP & API → API Keys (Transactional Email scope)<br />
                  4. Paste the API key and enter your verified sender email above<br />
                  5. Click "Test Connection" to verify everything works<br />
                  6. Save settings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Business Information</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input label="Business Name" value={settings.business_name} onChange={(e) => handleChange("business_name", e.target.value)} />
              <Input label="Phone Number" value={settings.phone} onChange={(e) => handleChange("phone", e.target.value)} />
              <Input label="Email Address" value={settings.email} onChange={(e) => handleChange("email", e.target.value)} type="email" />
              <Input label="WhatsApp Number" value={settings.whatsapp} onChange={(e) => handleChange("whatsapp", e.target.value)} />
              <div className="sm:col-span-2"><Input label="Address" value={settings.address} onChange={(e) => handleChange("address", e.target.value)} /></div>
              <div>
                <label className="block label-uppercase text-stone mb-2">Brand Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={settings.brand_color} onChange={(e) => handleChange("brand_color", e.target.value)} className="w-11 h-11 rounded-lg border border-border-light cursor-pointer" />
                  <Input value={settings.brand_color} onChange={(e) => handleChange("brand_color", e.target.value)} className="flex-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input label="Instagram" value={settings.instagram} onChange={(e) => handleChange("instagram", e.target.value)} placeholder="https://instagram.com/..." />
              <Input label="Facebook" value={settings.facebook} onChange={(e) => handleChange("facebook", e.target.value)} placeholder="https://facebook.com/..." />
              <Input label="YouTube" value={settings.youtube} onChange={(e) => handleChange("youtube", e.target.value)} placeholder="https://youtube.com/..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Business Hours</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: "monday_hours" as const, label: "Monday" },
                { key: "tuesday_hours" as const, label: "Tuesday" },
                { key: "wednesday_hours" as const, label: "Wednesday" },
                { key: "thursday_hours" as const, label: "Thursday" },
                { key: "friday_hours" as const, label: "Friday" },
                { key: "saturday_hours" as const, label: "Saturday" },
                { key: "sunday_hours" as const, label: "Sunday" },
              ].map(({ key, label }) => (
                <Input key={key} label={label} value={settings[key]} onChange={(e) => handleChange(key, e.target.value)} placeholder="9:00 AM - 9:00 PM" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
