"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Ticket, CheckCircle2, Clock, AlertCircle, XCircle, Loader2, ArrowRight, CalendarDays, X as XIcon, RotateCcw } from "lucide-react";
import { useUserAuth } from "@/components/providers/UserAuth";
import { formatDate, formatTime, getBookingStatusColor, getBookingStatusLabel } from "@/lib/utils";

interface BookingData {
  id?: string;
  ticket_id: string;
  full_name: string;
  event_type: string;
  event_date: string;
  preferred_time: string;
  venue_address: string;
  status: string;
  admin_notes?: string;
}

const statusSteps = ["pending", "confirmed", "in_progress", "completed"];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00",
];

function StatusTracker({ status }: { status: string }) {
  const currentStep = statusSteps.indexOf(status);
  const isCancelled = status === "cancelled";

  return (
    <div className="flex items-center justify-between relative py-4">
      <div className="absolute top-[22px] left-[12%] right-[12%] h-0.5 bg-border-light" />
      {["Pending", "Confirmed", "In Progress", "Completed"].map((step, i) => {
        const isActive = !isCancelled && i <= currentStep;
        const isCurrent = !isCancelled && i === currentStep;
        return (
          <div key={step} className="relative flex flex-col items-center z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              isCancelled ? "bg-red-50 text-red-400 border border-red-200" :
              isActive ? "bg-gold text-charcoal" :
              "bg-white border border-border-light text-warm-gray"
            }`}>
              {isCancelled ? <XCircle className="w-4 h-4" /> :
               i < currentStep ? <CheckCircle2 className="w-5 h-5" /> :
               <span className="text-sm">{i + 1}</span>
              }
            </div>
            <span className={`text-[10px] mt-1.5 font-body whitespace-nowrap ${
              isCurrent ? "text-gold font-semibold" :
              isActive ? "text-charcoal font-medium" :
              "text-warm-gray"
            }`}>{step}</span>
          </div>
        );
      })}
    </div>
  );
}

function TicketCard({ booking, onCancel, onReschedule }: { booking: BookingData; onCancel: () => void; onReschedule: () => void }) {
  const canModify = booking.status === "pending" || booking.status === "confirmed";

  return (
    <div className="bg-white rounded-2xl border border-border-light p-6 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-gold" />
          <span className="text-sm font-heading font-bold text-charcoal tracking-wider">{booking.ticket_id}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-body font-medium ${getBookingStatusColor(booking.status)}`}>
          {getBookingStatusLabel(booking.status)}
        </span>
      </div>

      <StatusTracker status={booking.status} />

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border-light">
        <div>
          <p className="text-xs text-warm-gray font-body">Event</p>
          <p className="text-sm text-charcoal font-body font-medium capitalize">{booking.event_type.replace(/-/g, " ")}</p>
        </div>
        <div>
          <p className="text-xs text-warm-gray font-body">Date</p>
          <p className="text-sm text-charcoal font-body font-medium">{formatDate(booking.event_date)}</p>
        </div>
        <div>
          <p className="text-xs text-warm-gray font-body">Time</p>
          <p className="text-sm text-charcoal font-body font-medium">{formatTime(booking.preferred_time)}</p>
        </div>
        <div>
          <p className="text-xs text-warm-gray font-body">Venue</p>
          <p className="text-sm text-charcoal font-body font-medium truncate">{booking.venue_address}</p>
        </div>
      </div>

      {booking.admin_notes && (
        <div className="mt-4 p-3 rounded-xl bg-gold/5 border border-gold/20">
          <p className="text-xs text-gold font-body font-medium mb-1">Message from HFD</p>
          <p className="text-sm text-charcoal font-body">{booking.admin_notes}</p>
        </div>
      )}

      {/* Customer action buttons */}
      {canModify && (
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border-light">
          <button
            onClick={onReschedule}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-body bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />Reschedule
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-body bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
          >
            <XIcon className="w-3.5 h-3.5" />Cancel Booking
          </button>
        </div>
      )}

      {!canModify && booking.status !== "cancelled" && (
        <p className="text-xs text-warm-gray font-body mt-3 pt-3 border-t border-border-light">
          This booking is already in progress — reschedule/cancel is only available for pending or confirmed bookings.
        </p>
      )}
    </div>
  );
}

function CancelDialog({ booking, onClose, onSuccess }: { booking: BookingData; onClose: () => void; onSuccess: (status: string) => void }) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCancel = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/booking/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: booking.ticket_id, action: "cancel", reason }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setIsSubmitting(false); return; }
      onSuccess("cancelled");
      onClose();
    } catch {
      setError("Network error — please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-heading font-semibold text-charcoal mb-2">Cancel Booking</h3>
        <p className="text-sm text-warm-gray font-body mb-4">
          Are you sure you want to cancel <strong>{booking.ticket_id}</strong>? This action cannot be undone once confirmed by the admin.
        </p>
        <div className="mb-4">
          <label className="block text-xs text-warm-gray font-body mb-2">Reason for cancellation (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="flex min-h-[60px] w-full rounded-xl border border-border-light bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-gold resize-none font-body"
            placeholder="e.g., Event postponed, change of plans..."
          />
        </div>
        {error && <p className="text-xs text-red-500 font-body mb-3">{error}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 rounded-xl text-sm font-body bg-cream text-stone hover:bg-ivory transition-colors">Go Back</button>
          <button onClick={handleCancel} disabled={isSubmitting} className="flex-1 px-4 py-2 rounded-xl text-sm font-body bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Confirm Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RescheduleDialog({ booking, onClose, onSuccess }: { booking: BookingData; onClose: () => void; onSuccess: (newDate: string, newTime: string) => void }) {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState(booking.preferred_time);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Minimum date: tomorrow (2-hour buffer requirement)
  const today = new Date();
  const minDate = new Date(today.getTime() + 2 * 60 * 60 * 1000);
  const minDateStr = minDate.toISOString().split("T")[0];

  const isTodaySelected = newDate === today.toISOString().split("T")[0];
  const nowHours = today.getHours();
  const nowMinutes = today.getMinutes();
  const minSlotMinutes = isTodaySelected ? (nowHours + 2) * 60 + nowMinutes : 0;

  const availableTimeSlots = timeSlots.filter((slot) => {
    const [h, m] = slot.split(":").map(Number);
    return h * 60 + m >= minSlotMinutes;
  });

  const handleReschedule = async () => {
    if (!newDate) { setError("Please select a new date"); return; }
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/booking/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: booking.ticket_id, action: "reschedule", new_date: newDate, new_time: newTime, reason }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setIsSubmitting(false); return; }
      onSuccess(data.new_date, data.new_time);
      onClose();
    } catch {
      setError("Network error — please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-heading font-semibold text-charcoal mb-2 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-gold" />Reschedule Booking
        </h3>
        <p className="text-sm text-warm-gray font-body mb-4">
          Change the date/time for <strong>{booking.ticket_id}</strong>. Current: {formatDate(booking.event_date)} at {formatTime(booking.preferred_time)}
        </p>

        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-xs text-warm-gray font-body mb-2">New Date *</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={minDateStr}
              className="flex h-11 w-full rounded-xl border border-border-light bg-ivory px-4 py-2 text-sm text-charcoal focus:outline-none focus:border-gold font-body"
            />
          </div>

          <div>
            <label className="block text-xs text-warm-gray font-body mb-2">New Time *</label>
            <select
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border-light bg-ivory px-4 py-2 text-sm text-charcoal focus:outline-none focus:border-gold font-body"
            >
              {availableTimeSlots.length > 0 ? (
                availableTimeSlots.map((slot) => (
                  <option key={slot} value={slot}>{formatTime(slot)}</option>
                ))
              ) : (
                <option value="">No available slots for this date</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs text-warm-gray font-body mb-2">Reason (optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="flex min-h-[60px] w-full rounded-xl border border-border-light bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-gold resize-none font-body"
              placeholder="e.g., Venue changed, need more time..."
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-500 font-body mb-3">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 rounded-xl text-sm font-body bg-cream text-stone hover:bg-ivory transition-colors">Go Back</button>
          <button onClick={handleReschedule} disabled={isSubmitting || !newDate} className="flex-1 px-4 py-2 rounded-xl text-sm font-body bg-gold text-charcoal hover:bg-gold-light transition-colors disabled:opacity-50">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Confirm Reschedule"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TrackPage() {
  const { user, signInWithGoogle, loading: authLoading } = useUserAuth();
  const [ticketInput, setTicketInput] = useState("");
  const [searchedBooking, setSearchedBooking] = useState<BookingData | null>(null);
  const [userBookings, setUserBookings] = useState<BookingData[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [loadedUserBookings, setLoadedUserBookings] = useState(false);

  // Dialogs
  const [cancelBooking, setCancelBooking] = useState<BookingData | null>(null);
  const [rescheduleBooking, setRescheduleBooking] = useState<BookingData | null>(null);

  const searchByTicket = async () => {
    if (!ticketInput.trim()) return;
    setSearching(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/track?ticket=${encodeURIComponent(ticketInput.trim().toUpperCase())}`);
      const data = await res.json();
      setSearchedBooking(data.booking || null);
    } catch {
      setSearchedBooking(null);
    } finally {
      setSearching(false);
    }
  };

  const loadUserBookings = async () => {
    if (!user) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/track?uid=${encodeURIComponent(user.uid)}`);
      const data = await res.json();
      setUserBookings(data.bookings || []);
      setLoadedUserBookings(true);
    } catch {
      setUserBookings([]);
    } finally {
      setSearching(false);
    }
  };

  React.useEffect(() => {
    if (user && !loadedUserBookings) loadUserBookings();
  }, [user]);

  const handleCancelSuccess = (status: string) => {
    if (searchedBooking) setSearchedBooking({ ...searchedBooking, status });
    setUserBookings(userBookings.map(b => b.ticket_id === cancelBooking?.ticket_id ? { ...b, status } : b));
  };

  const handleRescheduleSuccess = (newDate: string, newTime: string) => {
    if (searchedBooking) setSearchedBooking({ ...searchedBooking, event_date: newDate, preferred_time: newTime });
    setUserBookings(userBookings.map(b => b.ticket_id === rescheduleBooking?.ticket_id ? { ...b, event_date: newDate, preferred_time: newTime } : b));
  };

  return (
    <div className="pt-24 bg-ivory min-h-screen">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="label-uppercase text-gold mb-4 block">Track Booking</span>
            <h1 className="heading-section text-charcoal">Check your <em className="font-serif text-gold">ticket</em> status</h1>
            <p className="mt-4 text-stone font-light max-w-lg mx-auto">Enter your ticket ID or sign in to view all your bookings. You can reschedule or cancel pending bookings.</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-6 lg:px-12 space-y-8">
          {/* Search by Ticket ID */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-border-light shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] p-8"
          >
            <h3 className="font-heading font-semibold text-charcoal mb-4">Search by Ticket ID</h3>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                <input
                  type="text"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && searchByTicket()}
                  placeholder="HFD-XXXXXX"
                  className="flex h-12 w-full rounded-xl border border-border-light bg-ivory pl-10 pr-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-gold font-body tracking-wider"
                />
              </div>
              <button onClick={searchByTicket} disabled={searching || !ticketInput.trim()} className="flex items-center gap-2 bg-charcoal text-ivory px-6 rounded-xl hover:bg-graphite transition-colors disabled:opacity-50">
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </button>
            </div>

            {searched && !searching && !searchedBooking && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 text-center">
                <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-600 font-body">No booking found with this ticket ID</p>
              </div>
            )}

            {searchedBooking && (
              <div className="mt-6">
                <TicketCard booking={searchedBooking} onCancel={() => setCancelBooking(searchedBooking)} onReschedule={() => setRescheduleBooking(searchedBooking)} />
              </div>
            )}
          </motion.div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border-light" />
            <span className="text-xs text-warm-gray font-body">or view all your bookings</span>
            <div className="flex-1 h-px bg-border-light" />
          </div>

          {/* User Bookings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-border-light shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] p-8"
          >
            {user ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-heading font-bold text-sm">
                      {(user.displayName || user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-charcoal font-body">{user.displayName || user.email}</p>
                    <p className="text-xs text-warm-gray font-body">Your bookings</p>
                  </div>
                </div>

                {searching ? (
                  <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>
                ) : userBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-10 h-10 text-border-light mx-auto mb-3" />
                    <p className="text-warm-gray font-body text-sm">No bookings found</p>
                    <a href="/book" className="inline-flex items-center gap-1 text-gold text-sm font-body mt-2 hover:underline">Book now <ArrowRight className="w-3 h-3" /></a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userBookings.map((booking) => (
                      <TicketCard key={booking.id} booking={booking} onCancel={() => setCancelBooking(booking)} onReschedule={() => setRescheduleBooking(booking)} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <button onClick={signInWithGoogle} disabled={authLoading}
                  className="flex items-center justify-center gap-3 bg-white border border-border-light text-charcoal h-12 rounded-xl hover:bg-cream transition-colors disabled:opacity-50 mx-auto px-8"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google to view your bookings
                </button>
                <p className="text-xs text-warm-gray font-body mt-3">Only shows bookings made while signed in</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Cancel Dialog */}
      {cancelBooking && (
        <CancelDialog
          booking={cancelBooking}
          onClose={() => setCancelBooking(null)}
          onSuccess={(status) => handleCancelSuccess(status)}
        />
      )}

      {/* Reschedule Dialog */}
      {rescheduleBooking && (
        <RescheduleDialog
          booking={rescheduleBooking}
          onClose={() => setRescheduleBooking(null)}
          onSuccess={(newDate, newTime) => handleRescheduleSuccess(newDate, newTime)}
        />
      )}
    </div>
  );
}
