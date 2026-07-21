"use client";

import React, { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, X, CheckCircle2, Phone, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const eventTypes = [
  { value: "housewarming", label: "Housewarming" }, { value: "wedding", label: "Wedding" },
  { value: "baby-shower", label: "Baby Shower" }, { value: "pooja", label: "Pooja Decoration" },
  { value: "corporate", label: "Corporate Event" }, { value: "custom", label: "Custom Decoration" },
];
const budgetRanges = [
  { value: "under-5000", label: "Under ₹5,000" }, { value: "5000-10000", label: "₹5,000 — ₹10,000" },
  { value: "10000-25000", label: "₹10,000 — ₹25,000" }, { value: "25000-50000", label: "₹25,000 — ₹50,000" },
  { value: "50000-100000", label: "₹50,000 — ₹1,00,000" }, { value: "above-100000", label: "Above ₹1,00,000" },
];
const timeSlots = [
  { value: "06:00", label: "6:00 AM" }, { value: "07:00", label: "7:00 AM" }, { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" }, { value: "10:00", label: "10:00 AM" }, { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" }, { value: "13:00", label: "1:00 PM" }, { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" }, { value: "16:00", label: "4:00 PM" }, { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" }, { value: "19:00", label: "7:00 PM" }, { value: "20:00", label: "8:00 PM" },
];

interface FD { full_name: string; phone: string; email: string; event_type: string; event_date: string; preferred_time: string; venue_address: string; google_maps_link: string; estimated_budget: string; guest_count: string; special_notes: string; images: File[]; }
interface FE { [k: string]: string }

const inputCls = "flex h-12 w-full rounded-xl border border-border-light bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 transition-all focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 font-body font-light";

export default function BookingPageContent() {
  const sp = useSearchParams();
  const fileRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fd, setFd] = useState<FD>({ full_name: "", phone: "", email: "", event_type: sp.get("event_type") || "", event_date: "", preferred_time: "", venue_address: "", google_maps_link: "", estimated_budget: "", guest_count: "", special_notes: "", images: [] });
  const [errors, setErrors] = useState<FE>({});

  const ch = (f: keyof FD, v: string) => { setFd((p) => ({ ...p, [f]: v })); if (errors[f]) setErrors((p) => { const n = { ...p }; delete n[f]; return n; }); };

  const validate = () => {
    const e: FE = {};
    if (!fd.full_name.trim()) e.full_name = "Required";
    if (!fd.phone.trim()) e.phone = "Required";
    else if (!/^[6-9]\d{9}$/.test(fd.phone.replace(/\D/g, ""))) e.phone = "Invalid";
    if (!fd.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fd.email)) e.email = "Invalid";
    if (!fd.event_type) e.event_type = "Required";
    if (!fd.event_date) e.event_date = "Required";
    if (!fd.preferred_time) e.preferred_time = "Required";
    if (!fd.venue_address.trim()) e.venue_address = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const onUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(ev.target.files || []);
    if (fd.images.length + files.length > 5) { setErrors((p) => ({ ...p, images: "Max 5" })); return; }
    const valid = files.filter((f) => f.size <= 5 * 1024 * 1024 && ["image/jpeg", "image/png", "image/webp"].includes(f.type));
    setFd((p) => ({ ...p, images: [...p.images, ...valid] }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const sd = new FormData();
      Object.entries(fd).forEach(([k, v]) => { if (k !== "images" && v) sd.append(k, v); });
      fd.images.forEach((img, i) => sd.append(`image_${i}`, img));
      const res = await fetch("/api/booking", { method: "POST", body: sd });
      if (!res.ok) throw new Error("Failed");
      setSuccess(true);
    } catch (err) { setErrors({ submit: err instanceof Error ? err.message : "Error" }); }
    finally { setSubmitting(false); }
  };

  if (success) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center bg-ivory">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-full border border-gold flex items-center justify-center mx-auto mb-8"><CheckCircle2 className="w-8 h-8 text-gold" /></div>
          <h2 className="heading-section text-charcoal mb-4">Request Received</h2>
          <p className="text-stone font-light mb-2">Thank you, {fd.full_name}!</p>
          <p className="text-sm text-warm-gray font-body mb-8">We'll respond within 2 hours with a personalized quote.</p>
          <div className="bg-cream rounded-2xl p-6 text-left mb-8 border border-border-light">
            <div className="space-y-3 text-sm font-body">
              <div className="flex justify-between"><span className="text-stone">Event</span><span className="text-charcoal">{eventTypes.find((e) => e.value === fd.event_type)?.label}</span></div>
              <div className="flex justify-between"><span className="text-stone">Date</span><span className="text-charcoal">{fd.event_date}</span></div>
              <div className="flex justify-between"><span className="text-stone">Time</span><span className="text-charcoal">{timeSlots.find((t) => t.value === fd.preferred_time)?.label}</span></div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <a href="tel:+919876543210"><button className="flex items-center gap-2 bg-charcoal text-ivory px-6 py-3 rounded-full label-uppercase text-xs"><Phone className="w-3 h-3" />Call</button></a>
            <a href="/"><button className="flex items-center gap-2 border border-border-light text-charcoal px-6 py-3 rounded-full label-uppercase text-xs">Home</button></a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 bg-ivory">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="label-uppercase text-gold mb-4 block">Appointment</span>
            <h1 className="heading-section text-charcoal">Schedule your <em className="font-serif text-gold">decoration</em></h1>
            <p className="mt-4 text-stone font-light max-w-lg mx-auto">Fill in the details below. We'll respond within 2 hours with a personalized quote.</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-6 lg:px-12">
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onSubmit={onSubmit}
            className="bg-white rounded-2xl border border-border-light shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] p-8 sm:p-10 space-y-10">

            {errors.submit && <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-body">{errors.submit}</div>}

            {/* Personal */}
            <div>
              <span className="label-uppercase text-gold mb-6 block">Personal Details</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className="block label-uppercase text-stone mb-2">Full Name *</label><input value={fd.full_name} onChange={(e) => ch("full_name", e.target.value)} className={inputCls} placeholder="Your full name" />{errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>}</div>
                <div><label className="block label-uppercase text-stone mb-2">Phone *</label><input type="tel" value={fd.phone} onChange={(e) => ch("phone", e.target.value)} className={inputCls} placeholder="10-digit number" />{errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}</div>
                <div className="sm:col-span-2"><label className="block label-uppercase text-stone mb-2">Email *</label><input type="email" value={fd.email} onChange={(e) => ch("email", e.target.value)} className={inputCls} placeholder="your@email.com" />{errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}</div>
              </div>
            </div>

            {/* Event */}
            <div>
              <span className="label-uppercase text-gold mb-6 block">Event Details</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className="block label-uppercase text-stone mb-2">Event Type *</label><Select value={fd.event_type} onValueChange={(v) => ch("event_type", v)}><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent>{eventTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent></Select>{errors.event_type && <p className="mt-1 text-xs text-red-500">{errors.event_type}</p>}</div>
                <div><label className="block label-uppercase text-stone mb-2">Date *</label><input type="date" value={fd.event_date} onChange={(e) => ch("event_date", e.target.value)} min={new Date().toISOString().split("T")[0]} className={inputCls} />{errors.event_date && <p className="mt-1 text-xs text-red-500">{errors.event_date}</p>}</div>
                <div><label className="block label-uppercase text-stone mb-2">Preferred Time *</label><Select value={fd.preferred_time} onValueChange={(v) => ch("preferred_time", v)}><SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger><SelectContent>{timeSlots.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent></Select>{errors.preferred_time && <p className="mt-1 text-xs text-red-500">{errors.preferred_time}</p>}</div>
                <div><label className="block label-uppercase text-stone mb-2">Budget</label><Select value={fd.estimated_budget} onValueChange={(v) => ch("estimated_budget", v)}><SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger><SelectContent>{budgetRanges.map((b) => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}</SelectContent></Select></div>
              </div>
            </div>

            {/* Venue */}
            <div>
              <span className="label-uppercase text-gold mb-6 block">Venue</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2"><label className="block label-uppercase text-stone mb-2">Address *</label><input value={fd.venue_address} onChange={(e) => ch("venue_address", e.target.value)} className={inputCls} placeholder="Full venue address" />{errors.venue_address && <p className="mt-1 text-xs text-red-500">{errors.venue_address}</p>}</div>
                <div className="sm:col-span-2"><label className="block label-uppercase text-stone mb-2">Google Maps Link</label><input value={fd.google_maps_link} onChange={(e) => ch("google_maps_link", e.target.value)} className={inputCls} placeholder="https://maps.google.com/..." /></div>
                <div><label className="block label-uppercase text-stone mb-2">Guest Count</label><input type="number" value={fd.guest_count} onChange={(e) => ch("guest_count", e.target.value)} className={inputCls} placeholder="Approximate" /></div>
              </div>
            </div>

            {/* Notes + Images */}
            <div>
              <span className="label-uppercase text-gold mb-6 block">Additional</span>
              <textarea value={fd.special_notes} onChange={(e) => ch("special_notes", e.target.value)} rows={4} className="flex min-h-[120px] w-full rounded-xl border border-border-light bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-gold resize-none font-body font-light" placeholder="Special notes, color themes, preferences..." />
              <p className="text-xs text-warm-gray font-body mt-6 mb-3">Reference images — up to 5, max 5MB each</p>
              <div className="border border-dashed border-border-light rounded-xl p-8 text-center cursor-pointer hover:border-gold/30 transition-colors" onClick={() => fileRef.current?.click()}>
                <Upload className="w-5 h-5 text-warm-gray mx-auto mb-2" />
                <p className="text-xs text-warm-gray font-body">Click to upload</p>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onUpload} className="hidden" />
              </div>
              {errors.images && <p className="mt-1 text-xs text-red-500">{errors.images}</p>}
              {fd.images.length > 0 && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  {fd.images.map((f, i) => (
                    <div key={i} className="relative group">
                      <div className="h-10 px-3 rounded-lg bg-cream border border-border-light flex items-center"><span className="text-[10px] text-stone font-body">{f.name}</span></div>
                      <button type="button" onClick={() => setFd((p) => ({ ...p, images: p.images.filter((_, j) => j !== i) }))} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-2.5 h-2.5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-charcoal text-ivory h-14 rounded-full label-uppercase hover:bg-graphite transition-colors disabled:opacity-50">
              {submitting ? <div className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" /> : <><Calendar className="w-4 h-4" /> Submit Booking Request</>}
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
