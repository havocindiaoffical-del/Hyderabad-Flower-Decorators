"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  getBusinessSettings, saveBusinessSettings, type BusinessSettingsData,
} from "@/lib/firestore-helpers";

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
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getBusinessSettings();
      if (data) {
        const hours = (data.business_hours || {}) as Record<string, string>;
        const social = (data.social_links || {}) as Record<string, string>;
        setSettings({
          business_name: data.business_name || "",
          phone: data.phone || "",
          email: data.email || "",
          whatsapp: data.whatsapp || "",
          address: data.address || "",
          brand_color: data.brand_color || "#B8935F",
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
      }
      setFirebaseReady(true);
    } catch {
      setFirebaseReady(false);
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
      const data: BusinessSettingsData = {
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
      };
      await saveBusinessSettings(data);
      alert("Settings saved successfully!");
    } catch {
      alert("Failed to save settings. Make sure Firebase Firestore is set up.");
    } finally {
      setIsSaving(false);
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
          <p className="text-sm text-warm-gray font-body mt-1">Manage your business information and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving || !firebaseReady} variant="default" className="gap-2">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      {!firebaseReady && (
        <div className="mb-6 p-4 rounded-xl bg-gold/5 border border-gold/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-gold shrink-0" />
          <p className="text-sm text-charcoal font-body">Firebase not connected. Set up Firestore to save settings.</p>
        </div>
      )}

      <div className="space-y-6">
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
