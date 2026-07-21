"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck, Clock, CheckCircle2, XCircle,
  IndianRupee, AlertCircle, ArrowRight, Loader2, Ticket
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBookingCounts, getRecentBookings, type BookingData } from "@/lib/firestore-helpers";
import { formatDate, formatTime, getBookingStatusColor, getBookingStatusLabel } from "@/lib/utils";
import Link from "next/link";

interface DashboardStats {
  upcoming_bookings: number;
  today_appointments: number;
  completed_bookings: number;
  cancelled_bookings: number;
  total_revenue: number;
  pending_bookings: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    upcoming_bookings: 0,
    today_appointments: 0,
    completed_bookings: 0,
    cancelled_bookings: 0,
    total_revenue: 0,
    pending_bookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [counts, recent] = await Promise.all([
        getBookingCounts(),
        getRecentBookings(5),
      ]);

      setStats({
        upcoming_bookings: counts.upcoming,
        today_appointments: counts.today,
        completed_bookings: counts.completed,
        cancelled_bookings: counts.cancelled,
        total_revenue: 0,
        pending_bookings: counts.pending,
      });

      setRecentBookings(recent);
      setFirebaseReady(true);
    } catch {
      setFirebaseReady(false);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { title: "Upcoming Bookings", value: stats.upcoming_bookings, icon: CalendarCheck, color: "text-blue-600 bg-blue-50" },
    { title: "Today's Appointments", value: stats.today_appointments, icon: Clock, color: "text-sage bg-sage/10" },
    { title: "Completed", value: stats.completed_bookings, icon: CheckCircle2, color: "text-purple-600 bg-purple-50" },
    { title: "Cancelled", value: stats.cancelled_bookings, icon: XCircle, color: "text-red-600 bg-red-50" },
    { title: "Pending Review", value: stats.pending_bookings, icon: AlertCircle, color: "text-amber-600 bg-amber-50" },
    { title: "Revenue", value: "₹0", icon: IndianRupee, color: "text-gold bg-gold/10" },
  ];

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-warm-gray font-body">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-charcoal">Dashboard</h1>
        <p className="text-sm text-warm-gray font-body mt-1">Welcome back! Here&apos;s an overview of your bookings.</p>
      </div>

      {/* Firebase Setup Banner */}
      {!firebaseReady && (
        <div className="mb-8 bg-white rounded-2xl border-2 border-gold/30 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-charcoal mb-1">Firebase Setup Required</h3>
              <p className="text-sm text-warm-gray font-body mb-4">Your dashboard can&apos;t connect to Firebase. Follow these steps to get started:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {[
                  { step: "1", text: "Go to Firebase Console → your project" },
                  { step: "2", text: "Firestore Database → Create database → Test mode" },
                  { step: "3", text: "Authentication → Enable Email/Password + Google" },
                  { step: "4", text: "Storage → Get started → Test mode" },
                  { step: "5", text: "Authentication → Users → Add your admin user" },
                  { step: "6", text: "Come back here and click Retry" },
                ].map(({ step, text }) => (
                  <div key={step} className="flex gap-2 items-start">
                    <span className="w-5 h-5 rounded-full bg-gold text-charcoal text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">{step}</span>
                    <p className="text-sm text-charcoal font-body">{text}</p>
                  </div>
                ))}
              </div>
              <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gold text-charcoal px-5 py-2.5 rounded-full label-uppercase text-xs font-semibold hover:bg-gold-light transition-colors mr-3">
                Open Firebase Console →
              </a>
              <button onClick={fetchDashboardData} className="inline-flex items-center gap-2 bg-charcoal text-ivory px-5 py-2.5 rounded-full label-uppercase text-xs hover:bg-graphite transition-colors">
                <Loader2 className="w-3 h-3" /> Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid — always visible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-warm-gray font-body">{stat.title}</p>
                      <p className="text-2xl font-heading font-bold text-charcoal mt-1">{firebaseReady ? stat.value : "—"}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Link
              href="/admin/bookings"
              className="text-sm text-gold hover:underline font-body inline-flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {!firebaseReady ? (
              <div className="text-center py-8">
                <AlertCircle className="w-10 h-10 text-border-light mx-auto mb-3" />
                <p className="text-warm-gray font-body text-sm">Set up Firebase to see bookings here</p>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="w-10 h-10 text-border-light mx-auto mb-3" />
                <p className="text-warm-gray font-body text-sm">No bookings yet. Share your booking page!</p>
                <a href="/book" className="text-gold text-xs font-body hover:underline mt-2 inline-block">yourdomain.com/book →</a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-light">
                      <th className="text-left py-3 px-4 font-heading font-medium text-warm-gray">Ticket</th>
                      <th className="text-left py-3 px-4 font-heading font-medium text-warm-gray">Customer</th>
                      <th className="text-left py-3 px-4 font-heading font-medium text-warm-gray">Event</th>
                      <th className="text-left py-3 px-4 font-heading font-medium text-warm-gray">Date</th>
                      <th className="text-left py-3 px-4 font-heading font-medium text-warm-gray">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-border-light/50 hover:bg-cream/50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="text-xs font-mono text-gold font-medium">{booking.ticket_id || "—"}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-charcoal font-body">{booking.full_name}</p>
                            <p className="text-xs text-warm-gray font-body">{booking.phone}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-body capitalize text-charcoal">{booking.event_type.replace(/-/g, " ")}</td>
                        <td className="py-3 px-4 font-body">
                          <div>
                            <p className="text-charcoal">{formatDate(booking.event_date)}</p>
                            <p className="text-xs text-warm-gray">{formatTime(booking.preferred_time)}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getBookingStatusColor(booking.status)}>
                            {getBookingStatusLabel(booking.status)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
