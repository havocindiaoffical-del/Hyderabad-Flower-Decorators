"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  CalendarCheck, Clock, CheckCircle2, XCircle,
  AlertCircle, ArrowRight, Ticket, Sparkles, Bell, BellOff, Users
} from "lucide-react";
import { formatDate, formatTime, getBookingStatusColor, getBookingStatusLabel } from "@/lib/utils";

interface BookingData {
  id?: string;
  ticket_id: string;
  full_name: string;
  phone: string;
  email: string;
  event_type: string;
  event_date: string;
  preferred_time: string;
  venue_address: string;
  status: string;
  admin_notes?: string;
  created_at: string;
}

interface StatCard {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const NOTIFICATION_KEY = "hfd_notifications_enabled";

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentBookings, setRecentBookings] = useState<BookingData[]>([]);
  const [dbReady, setDbReady] = useState<boolean | null>(null);
  const [dbError, setDbError] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [lastBookingCount, setLastBookingCount] = useState(0);
  const [isDark, setIsDark] = useState(false);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Check dark mode
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hfd_admin_dark");
      setIsDark(saved === "true");
    } catch {}
  }, []);

  // Check notification preference
  useEffect(() => {
    try {
      setNotificationsEnabled(localStorage.getItem(NOTIFICATION_KEY) === "true");
    } catch {}
  }, []);

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      // Request browser notification permission
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setNotificationsEnabled(true);
          try { localStorage.setItem(NOTIFICATION_KEY, "true"); } catch {}
        } else {
          alert("Notification permission denied. Enable it in your browser settings.");
        }
      } else {
        alert("Your browser doesn't support push notifications.");
      }
    } else {
      setNotificationsEnabled(false);
      try { localStorage.setItem(NOTIFICATION_KEY, "false"); } catch {}
    }
  };

  const buildStats = (c: { upcoming: number; today: number; completed: number; cancelled: number; pending: number }): StatCard[] => [
    { title: "Upcoming Events", value: String(c.upcoming), icon: CalendarCheck, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { title: "Today's Events", value: String(c.today), icon: Clock, color: "text-sage", bgColor: "bg-sage/10" },
    { title: "Completed", value: String(c.completed), icon: CheckCircle2, color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { title: "Pending Review", value: String(c.pending), icon: AlertCircle, color: "text-amber-500", bgColor: "bg-amber-500/10" },
    { title: "Cancelled", value: String(c.cancelled), icon: XCircle, color: "text-red-500", bgColor: "bg-red-500/10" },
    { title: "Total Events", value: String(c.upcoming + c.today + c.completed + c.pending + c.cancelled), icon: Sparkles, color: "text-gold", bgColor: "bg-gold/10" },
  ];

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.error) { setDbReady(false); setDbError(data.error); return; }
      setStats(buildStats(data.counts));
      setRecentBookings(data.recentBookings || []);
      setDbReady(true);

      // Push notification for new bookings
      const total = data.counts.upcoming + data.counts.today + data.counts.completed + data.counts.pending + data.counts.cancelled;
      if (notificationsEnabled && lastBookingCount > 0 && total > lastBookingCount) {
        const newCount = total - lastBookingCount;
        try {
          new Notification("HFD — New Booking!", {
            body: `${newCount} new booking(s) received. Check the dashboard.`,
            icon: "/favicon.ico",
          });
        } catch {}
      }
      setLastBookingCount(total);
    } catch {
      setDbReady(false);
      setDbError("Network error — could not reach server");
    }
  }, [notificationsEnabled, lastBookingCount]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // Poll for new bookings every 30 seconds
  useEffect(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(fetchDashboard, 30000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [fetchDashboard]);

  const retry = () => {
    setDbReady(null);
    setDbError("");
    fetchDashboard();
  };

  // Theme colors
  const bgCard = isDark ? "#1A1A1A" : "#FFFFFF";
  const bgPrimary = isDark ? "#0F0F0F" : "#FAF8F5";
  const textPrimary = isDark ? "#E8E2DA" : "#1A1A1A";
  const textSecondary = isDark ? "#9B9490" : "#6B6560";
  const textMuted = isDark ? "#6B6560" : "#9B9490";
  const borderColor = isDark ? "#2A2A2A" : "#E8E2DA";
  const hoverBg = isDark ? "#222222" : "#F0EBE3";

  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ background: bgPrimary }}>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold" style={{ color: textPrimary }}>Dashboard</h1>
          <p className="text-sm font-body mt-1" style={{ color: textSecondary }}>Welcome back! Here&apos;s an overview of your bookings.</p>
        </div>
        <button
          onClick={toggleNotifications}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-body transition-colors ${notificationsEnabled ? "bg-sage/10 text-sage" : "bg-cream text-stone"}`}
          style={{ background: notificationsEnabled ? "rgba(91,117,83,0.1)" : hoverBg, color: notificationsEnabled ? "#5B7553" : textSecondary }}
        >
          {notificationsEnabled ? <><Bell className="w-4 h-4" />Notifications On</> : <><BellOff className="w-4 h-4" />Enable Notifications</>}
        </button>
      </div>

      {dbReady === false && (
        <div className="mb-8 rounded-2xl p-6" style={{ background: bgCard, border: `2px solid rgba(184,147,95,0.3)` }}>
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-gold shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-heading font-semibold mb-2" style={{ color: textPrimary }}>Database Connection Issue</h3>
              <p className="text-sm font-body mb-4" style={{ color: textSecondary }}>{dbError || "Check your DATABASE_URL environment variable."}</p>
              <button onClick={retry} className="inline-flex items-center px-5 py-2 rounded-full text-xs transition-colors" style={{ background: "#1A1A1A", color: "#FAF8F5" }}>Retry</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="rounded-2xl p-5 transition-all" style={{ background: bgCard, border: `1px solid ${borderColor}` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-body" style={{ color: textSecondary }}>{stat.title}</p>
                  <p className="text-2xl font-heading font-bold mt-1" style={{ color: textPrimary }}>{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <div className="rounded-2xl overflow-hidden" style={{ background: bgCard, border: `1px solid ${borderColor}` }}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${borderColor}` }}>
          <h2 className="font-heading font-semibold" style={{ color: textPrimary }}>Recent Bookings</h2>
          <a href="/admin/bookings" className="text-sm font-body inline-flex items-center gap-1 text-gold hover:underline">
            View All <ArrowRight className="w-3 h-3" />
          </a>
        </div>
        <div className="p-5">
          {dbReady === false ? (
            <div className="text-center py-8">
              <AlertCircle className="w-10 h-10 mx-auto mb-3" style={{ color: borderColor }} />
              <p className="font-body text-sm" style={{ color: textSecondary }}>Database not connected</p>
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <Ticket className="w-10 h-10 mx-auto mb-3" style={{ color: borderColor }} />
              <p className="font-body text-sm" style={{ color: textSecondary }}>No bookings yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <th className="text-left py-3 px-4 font-heading font-medium" style={{ color: textSecondary }}>Ticket</th>
                    <th className="text-left py-3 px-4 font-heading font-medium" style={{ color: textSecondary }}>Customer</th>
                    <th className="text-left py-3 px-4 font-heading font-medium" style={{ color: textSecondary }}>Event</th>
                    <th className="text-left py-3 px-4 font-heading font-medium" style={{ color: textSecondary }}>Date</th>
                    <th className="text-left py-3 px-4 font-heading font-medium" style={{ color: textSecondary }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="transition-colors" style={{ borderBottom: `1px solid ${borderColor}` }}>
                      <td className="py-3 px-4"><span className="text-xs font-mono text-gold font-medium">{booking.ticket_id || "—"}</span></td>
                      <td className="py-3 px-4">
                        <p className="font-medium font-body" style={{ color: textPrimary }}>{booking.full_name}</p>
                        <p className="text-xs font-body" style={{ color: textSecondary }}>{booking.phone}</p>
                      </td>
                      <td className="py-3 px-4 font-body capitalize" style={{ color: textPrimary }}>{booking.event_type.replace(/-/g, " ")}</td>
                      <td className="py-3 px-4 font-body">
                        <p style={{ color: textPrimary }}>{formatDate(booking.event_date)}</p>
                        <p className="text-xs" style={{ color: textSecondary }}>{formatTime(booking.preferred_time)}</p>
                      </td>
                      <td className="py-3 px-4"><span className={`px-3 py-1 rounded-full text-xs font-body font-medium ${getBookingStatusColor(booking.status)}`}>{getBookingStatusLabel(booking.status)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Event types overview */}
      {recentBookings.length > 0 && (
        <div className="mt-6 rounded-2xl p-5" style={{ background: bgCard, border: `1px solid ${borderColor}` }}>
          <h2 className="font-heading font-semibold mb-4" style={{ color: textPrimary }}>
            <Users className="w-4 h-4 inline mr-2 text-gold" />Bookings by Event Type
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(
              recentBookings.reduce<Record<string, number>>((acc, b) => {
                const type = b.event_type.replace(/-/g, " ");
                acc[type] = (acc[type] || 0) + 1;
                return acc;
              }, {})
            ).map(([type, count]) => (
              <div key={type} className="rounded-xl p-3 text-center" style={{ background: hoverBg }}>
                <p className="text-xs font-body capitalize" style={{ color: textSecondary }}>{type}</p>
                <p className="text-lg font-heading font-bold mt-1" style={{ color: textPrimary }}>{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
