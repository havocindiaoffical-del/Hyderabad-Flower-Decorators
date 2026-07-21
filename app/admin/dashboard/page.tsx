"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarCheck, Clock, CheckCircle2, XCircle,
  IndianRupee, AlertCircle, ArrowRight, Ticket
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBookingCounts, getRecentBookings, type BookingData } from "@/lib/firestore-helpers";
import { formatDate, formatTime, getBookingStatusColor, getBookingStatusLabel } from "@/lib/utils";
import Link from "next/link";

const statCards = [
  { title: "Upcoming Bookings", value: "0", icon: CalendarCheck, color: "text-blue-600 bg-blue-50" },
  { title: "Today's Appointments", value: "0", icon: Clock, color: "text-sage bg-sage/10" },
  { title: "Completed", value: "0", icon: CheckCircle2, color: "text-purple-600 bg-purple-50" },
  { title: "Cancelled", value: "0", icon: XCircle, color: "text-red-600 bg-red-50" },
  { title: "Pending Review", value: "0", icon: AlertCircle, color: "text-amber-600 bg-amber-50" },
  { title: "Revenue", value: "₹0", icon: IndianRupee, color: "text-gold bg-gold/10" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(statCards);
  const [recentBookings, setRecentBookings] = useState<BookingData[]>([]);
  const [firebaseReady, setFirebaseReady] = useState<boolean | null>(null);

  useEffect(() => {
    // Fetch data in background — page renders instantly
    getBookingCounts().then((counts) => {
      setStats([
        { title: "Upcoming Bookings", value: String(counts.upcoming), icon: CalendarCheck, color: "text-blue-600 bg-blue-50" },
        { title: "Today's Appointments", value: String(counts.today), icon: Clock, color: "text-sage bg-sage/10" },
        { title: "Completed", value: String(counts.completed), icon: CheckCircle2, color: "text-purple-600 bg-purple-50" },
        { title: "Cancelled", value: String(counts.cancelled), icon: XCircle, color: "text-red-600 bg-red-50" },
        { title: "Pending Review", value: String(counts.pending), icon: AlertCircle, color: "text-amber-600 bg-amber-50" },
        { title: "Revenue", value: "₹0", icon: IndianRupee, color: "text-gold bg-gold/10" },
      ]);
      setFirebaseReady(true);
    }).catch(() => {
      setFirebaseReady(false);
    });

    getRecentBookings(5).then(setRecentBookings).catch(() => {
      setRecentBookings([]);
    });
  }, []);

  const retry = () => {
    setFirebaseReady(null);
    getBookingCounts().then((counts) => {
      setStats([
        { title: "Upcoming Bookings", value: String(counts.upcoming), icon: CalendarCheck, color: "text-blue-600 bg-blue-50" },
        { title: "Today's Appointments", value: String(counts.today), icon: Clock, color: "text-sage bg-sage/10" },
        { title: "Completed", value: String(counts.completed), icon: CheckCircle2, color: "text-purple-600 bg-purple-50" },
        { title: "Cancelled", value: String(counts.cancelled), icon: XCircle, color: "text-red-600 bg-red-50" },
        { title: "Pending Review", value: String(counts.pending), icon: AlertCircle, color: "text-amber-600 bg-amber-50" },
        { title: "Revenue", value: "₹0", icon: IndianRupee, color: "text-gold bg-gold/10" },
      ]);
      setFirebaseReady(true);
    }).catch(() => setFirebaseReady(false));
    getRecentBookings(5).then(setRecentBookings).catch(() => setRecentBookings([]));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-charcoal">Dashboard</h1>
        <p className="text-sm text-warm-gray font-body mt-1">Welcome back! Here&apos;s an overview of your bookings.</p>
      </div>

      {/* Firebase Setup Banner */}
      {firebaseReady === false && (
        <div className="mb-8 bg-white rounded-2xl border-2 border-gold/30 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-gold shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-charcoal mb-2">Firebase Setup Required</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {["Firebase Console → your project", "Firestore → Create database → Test mode", "Auth → Enable Email/Password + Google", "Storage → Get started → Test mode", "Auth → Users → Add admin user", "Refresh this page"].map((text, i) => (
                  <p key={i} className="text-sm text-charcoal font-body"><span className="text-gold font-bold">{i+1}.</span> {text}</p>
                ))}
              </div>
              <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-gold text-charcoal px-5 py-2 rounded-full label-uppercase text-xs font-semibold hover:bg-gold-light transition-colors mr-3">Open Firebase →</a>
              <button onClick={retry} className="inline-flex items-center bg-charcoal text-ivory px-5 py-2 rounded-full label-uppercase text-xs hover:bg-graphite transition-colors">Retry</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid — renders instantly */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-warm-gray font-body">{stat.title}</p>
                    <p className="text-2xl font-heading font-bold text-charcoal mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Bookings</CardTitle>
          <Link href="/admin/bookings" className="text-sm text-gold hover:underline font-body inline-flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {firebaseReady === false ? (
            <div className="text-center py-8">
              <AlertCircle className="w-10 h-10 text-border-light mx-auto mb-3" />
              <p className="text-warm-gray font-body text-sm">Set up Firebase to see bookings</p>
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <Ticket className="w-10 h-10 text-border-light mx-auto mb-3" />
              <p className="text-warm-gray font-body text-sm">No bookings yet</p>
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
                      <td className="py-3 px-4"><span className="text-xs font-mono text-gold font-medium">{booking.ticket_id || "—"}</span></td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-charcoal font-body">{booking.full_name}</p>
                        <p className="text-xs text-warm-gray font-body">{booking.phone}</p>
                      </td>
                      <td className="py-3 px-4 font-body capitalize text-charcoal">{booking.event_type.replace(/-/g, " ")}</td>
                      <td className="py-3 px-4 font-body">
                        <p className="text-charcoal">{formatDate(booking.event_date)}</p>
                        <p className="text-xs text-warm-gray">{formatTime(booking.preferred_time)}</p>
                      </td>
                      <td className="py-3 px-4"><Badge className={getBookingStatusColor(booking.status)}>{getBookingStatusLabel(booking.status)}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
