"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Ticket, CheckCircle2, Clock, AlertCircle, XCircle, Loader2, ArrowRight, Copy, Check } from "lucide-react";
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

function TicketCard({ booking }: { booking: BookingData }) {
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

  const copyTicketId = (id: string) => {
    navigator.clipboard.writeText(id);
  };

  return (
    <div className="pt-24 bg-ivory min-h-screen">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="label-uppercase text-gold mb-4 block">Track Booking</span>
            <h1 className="heading-section text-charcoal">Check your <em className="font-serif text-gold">ticket</em> status</h1>
            <p className="mt-4 text-stone font-light max-w-lg mx-auto">Enter your ticket ID or sign in to view all your bookings.</p>
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
              <button
                onClick={searchByTicket}
                disabled={searching || !ticketInput.trim()}
                className="flex items-center gap-2 bg-charcoal text-ivory px-6 rounded-xl hover:bg-graphite transition-colors disabled:opacity-50"
              >
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </button>
            </div>

            {searched && !searching && !searchedBooking && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 text-center">
                <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-600 font-body">No booking found with this ticket ID</p>
                <p className="text-xs text-red-400 font-body mt-1">Please check the ID and try again</p>
              </div>
            )}

            {searchedBooking && (
              <div className="mt-6">
                <TicketCard booking={searchedBooking} />
              </div>
            )}
          </motion.div>

          {/* OR */}
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
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-gold animate-spin" />
                  </div>
                ) : userBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-10 h-10 text-border-light mx-auto mb-3" />
                    <p className="text-warm-gray font-body text-sm">No bookings found</p>
                    <a href="/book" className="inline-flex items-center gap-1 text-gold text-sm font-body mt-2 hover:underline">
                      Book now <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userBookings.map((booking) => (
                      <TicketCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <button
                  onClick={signInWithGoogle}
                  disabled={authLoading}
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
    </div>
  );
}
