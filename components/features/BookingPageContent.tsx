"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, X, CheckCircle2, Phone, Calendar, Copy, Check, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserAuth } from "@/components/providers/UserAuth";

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
  const { user, signInWithGoogle, userName, userEmail, loading: authLoading } = useUserAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState("");
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [fd, setFd] = useState<FD>({ full_name: "", phone: "", email: "", event_type: sp.get("event_type") || "", event_date: "", preferred_time: "", venue_address: "", google_maps_link: "", estimated_budget: "", guest_count: "", special_notes: "", images: [] });
  const [errors, setErrors] = useState<FE>({});

  useEffect(() => {
    if (user && userName && !fd.full_name) {
      setFd((prev) => ({ ...prev, full_name: userName, email: userEmail }));
    }
  }, [user, userName, userEmail, fd.full_name]);

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
    else {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const selected = new Date(fd.event_date + "T00:00:00");
      if (selected < today) e.event_date = "Cannot select a past date";
    }
    if (!fd.preferred_time) e.preferred_time = "Required";
    else if (fd.event_date) {
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];
      if (fd.event_date === todayStr) {
        const [slotH] = fd.preferred_time.split(":").map(Number);
        if (slotH < now.getHours() + 2) e.preferred_time = "Please select a time at least 2 hours ahead";
      }
    }
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

  // ─── PHASE 1: Create booking + send customer email (FAST) ────
  // ─── PHASE 2: Upload images to catbox.moe + send owner email (BACKGROUND) ──
  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitProgress("Submitting...");

    try {
      // Phase 1: FAST — create booking + customer email (NO images here)
      const sd = new FormData();
      Object.entries(fd).forEach(([k, v]) => { if (k !== "images" && v) sd.append(k, v); });
      if (user?.uid) sd.append("user_uid", user.uid);

      const res = await fetch("/api/booking", { method: "POST", body: sd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setTicketId(data.ticket_id || "");
      setEmailSent(data.emailSent || false);
      setEmailError(data.emailError || "");
      setSubmitProgress("");
      setSubmitting(false);
      setSuccess(true);

      // Phase 2: BACKGROUND — upload images + send owner email (customer already sees success)
      if (fd.images.length > 0) {
        setImageUploading(true);
        try {
          const imageSd = new FormData();
          imageSd.append("ticket_id", data.ticket_id);
          fd.images.forEach((img, i) => imageSd.append(`image_${i}`, img));

          await fetch("/api/booking/upload-images", { method: "POST", body: imageSd });
        } catch {
          // If background upload fails, admin can retry from dashboard
        }
        setImageUploading(false);
      }
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Error" });
      setSubmitProgress("");
      setSubmitting(false);
    }
  };

  const copyTicketId = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (success) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center bg-ivory">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-8"><CheckCircle2 className="w-8 h-8 text-gold" /></div>
          <h2 className="heading-section text-charcoal mb-4">Booking Submitted!</h2>
          <p className="text-stone font-light mb-2">Thank you, {fd.full_name}!</p>
          <p className="text-sm text-warm-gray font-body mb-6">We&apos;ll review your request and respond within 2 hours.</p>

          {/* Image upload indicator */}
          {imageUploading && (
            <div className="mb-4 p-3 rounded-xl bg-cream border border-border-light flex items-center gap-2 justify-center">
              <Loader2 className="w-4 h-4 text-gold animate-spin" />
              <span className="text-xs font-body text-stone">Uploading reference images...</span>
            </div>
          )}

          {emailSent && (
            <div className="mb-4 p-3 rounded-xl bg-sage/10 border border-sage/20 text-sage text-xs font-body text-center">
              ✓ Confirmation email sent to your inbox
            </div>
          )}
          {!emailSent && emailError && (
            <div className="mb-4 p-3 rounded-xl bg-gold/5 border border-gold/20 text-stone text-xs font-body text-center">
              Your booking is confirmed, but the confirmation email could not be sent right now. Please save your ticket ID below.
            </div>
          )}

          {/* Ticket ID Card */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gold/30 mb-6 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)]">
            <span className="label-uppercase text-gold mb-3 block">Your Ticket ID</span>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-2xl font-heading font-bold text-charcoal tracking-wider">{ticketId}</span>
              <button onClick={copyTicketId} className="w-8 h-8 rounded-lg bg-cream border border-border-light flex items-center justify-center hover:bg-gold/10 transition-colors">
                {copied ? <Check className="w-4 h-4 text-sage" /> : <Copy className="w-4 h-4 text-stone" />}
              </button>
            </div>
            <p className="text-xs text-warm-gray font-body">Save this ID to track your booking status anytime</p>
          </div>

          {/* Status Steps */}
          <div className="bg-cream rounded-2xl p-6 border border-border-light mb-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-3 left-[15%] right-[15%] h-0.5 bg-border-light" />
              {["Pending", "Confirmed", "In Progress", "Completed"].map((step, i) => (
                <div key={step} className="relative flex flex-col items-center z-10">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-gold text-charcoal" : "bg-white border border-border-light text-warm-gray"}`}>
                    {i === 0 ? "✓" : i + 1}
                  </div>
                  <span className={`text-[10px] mt-1 font-body ${i === 0 ? "text-gold font-medium" : "text-warm-gray"}`}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-cream rounded-2xl p-6 text-left mb-8 border border-border-light">
            <div className="space-y-3 text-sm font-body">
              <div className="flex justify-between"><span className="text-stone">Event</span><span className="text-charcoal">{eventTypes.find((e) => e.value === fd.event_type)?.label}</span></div>
              <div className="flex justify-between"><span className="text-stone">Date</span><span className="text-charcoal">{fd.event_date}</span></div>
              <div className="flex justify-between"><span className="text-stone">Time</span><span className="text-charcoal">{timeSlots.find((t) => t.value === fd.preferred_time)?.label}</span></div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <a href="/track"><button className="flex items-center gap-2 bg-gold text-charcoal px-6 py-3 rounded-full label-uppercase text-xs font-semibold hover:bg-gold-light transition-colors"><Calendar className="w-3 h-3" />Track Booking</button></a>
            <a href="tel:+919876543210"><button className="flex items-center gap-2 border border-border-light text-charcoal px-6 py-3 rounded-full label-uppercase text-xs"><Phone className="w-3 h-3" />Call</button></a>
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
            <p className="mt-4 text-stone font-light max-w-lg mx-auto">Fill in the details below. We&apos;ll respond within 2 hours with a personalized quote.</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-6 lg:px-12">
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onSubmit={onSubmit}
            className="bg-white rounded-2xl border border-border-light shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] p-8 sm:p-10 space-y-10">

            {errors.submit && <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-body">{errors.submit}</div>}

            {/* Quick Sign In */}
            <div>
              <span className="label-uppercase text-gold mb-4 block">Quick Sign In</span>
              {user ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-cream border border-border-light">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-heading font-bold text-sm">
                      {(user.displayName || user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-charcoal font-body">{user.displayName || user.email}</p>
                    <p className="text-xs text-warm-gray font-body">Signed in — details auto-filled</p>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={signInWithGoogle} disabled={authLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-border-light text-charcoal h-12 rounded-xl hover:bg-cream transition-colors disabled:opacity-50">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google to auto-fill details
                </button>
              )}
              <p className="text-xs text-warm-gray font-body mt-2">Or fill in your details manually below</p>
            </div>

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
                <div><label className="block label-uppercase text-stone mb-2">Date *</label><input type="date" value={fd.event_date} onChange={(e) => {
                  const newDate = e.target.value;
                  ch("event_date", newDate);
                  const now = new Date(); const todayStr = now.toISOString().split("T")[0];
                  if (newDate === todayStr && fd.preferred_time) {
                    const [slotH] = fd.preferred_time.split(":").map(Number);
                    if (slotH < now.getHours() + 2) ch("preferred_time", "");
                  }
                }} min={new Date().toISOString().split("T")[0]} className={inputCls} />{errors.event_date && <p className="mt-1 text-xs text-red-500">{errors.event_date}</p>}</div>
                <div><label className="block label-uppercase text-stone mb-2">Preferred Time *</label><Select value={fd.preferred_time} onValueChange={(v) => ch("preferred_time", v)}><SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger><SelectContent>{timeSlots.map((t) => {
                  const now = new Date(); const todayStr = now.toISOString().split("T")[0];
                  const isToday = fd.event_date === todayStr;
                  const [slotH] = t.value.split(":").map(Number);
                  const currentHour = now.getHours();
                  const isDisabled = isToday && slotH < currentHour + 2;
                  return <SelectItem key={t.value} value={t.value} disabled={isDisabled}>{t.label}{isDisabled ? " (unavailable)" : ""}</SelectItem>;
                })}</SelectContent></Select>{errors.preferred_time && <p className="mt-1 text-xs text-red-500">{errors.preferred_time}</p>}</div>
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
              <div className="mt-6 mb-4">
                <label className="block label-uppercase text-gold mb-3">Reference Images</label>
                <p className="text-xs text-warm-gray font-body mb-4">Upload photos of your desired decoration style — up to 5 images, max 5MB each (JPEG, PNG, WebP)</p>
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full h-14 rounded-xl bg-charcoal text-ivory flex items-center justify-center gap-3 label-uppercase hover:bg-graphite transition-colors">
                  <Upload className="w-4 h-4" /> Upload Reference Images
                </button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onUpload} className="hidden" />
              </div>
              {errors.images && <p className="mt-1 text-xs text-red-500">{errors.images}</p>}
              {fd.images.length > 0 && (
                <div className="mt-4 flex gap-3 flex-wrap">
                  {fd.images.map((f, i) => (
                    <div key={i} className="relative group">
                      <div className="w-16 h-16 rounded-lg bg-cream border border-border-light overflow-hidden flex items-center justify-center">
                        <img
                          src={URL.createObjectURL(f)}
                          alt={f.name}
                          className="w-full h-full object-cover"
                          onLoad={(e) => { URL.revokeObjectURL((e.target as HTMLImageElement).src); }}
                        />
                      </div>
                      <button type="button" onClick={() => setFd((p) => ({ ...p, images: p.images.filter((_, j) => j !== i) }))} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-charcoal text-ivory h-14 rounded-full label-uppercase hover:bg-graphite transition-colors disabled:opacity-50">
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>{submitProgress || "Submitting..."}</span></>
              ) : (
                <><Calendar className="w-4 h-4" /> Submit Booking Request</>
              )}
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
