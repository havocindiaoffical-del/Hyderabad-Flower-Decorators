"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  CalendarCheck, Clock, CheckCircle2, XCircle,
  AlertCircle, ArrowRight, Ticket, Sparkles, Bell, BellOff, Users, X
} from "lucide-react";
import { useAdminTheme } from "@/components/providers/AdminTheme";
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

interface ToastNotification {
  id: string;
  message: string;
  customerName: string;
  eventType: string;
  ticketId: string;
  timestamp: number;
}

const NOTIFICATION_KEY = "hfd_notifications_enabled";
const POLL_INTERVAL = 10000; // 10 seconds

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentBookings, setRecentBookings] = useState<BookingData[]>([]);
  const [dbReady, setDbReady] = useState<boolean | null>(null);
  const [dbError, setDbError] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [toastNotifications, setToastNotifications] = useState<ToastNotification[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Refs to avoid stale closures in polling interval
  const knownTicketIdsRef = useRef<Set<string>>(new Set());
  const notificationsEnabledRef = useRef(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFirstFetchRef = useRef(true);
  const mountedRef = useRef(true);
  const toastTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Keep ref synced with state
  useEffect(() => {
    notificationsEnabledRef.current = notificationsEnabled;
  }, [notificationsEnabled]);

  // Check notification preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATION_KEY);
      if (saved === "true") {
        setNotificationsEnabled(true);
      }
    } catch {}
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
      // Clear all toast timeouts
      for (const [, timeout] of toastTimeoutsRef.current) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
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

  const dismissToast = useCallback((id: string) => {
    // Clear the auto-dismiss timeout
    const existingTimeout = toastTimeoutsRef.current.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      toastTimeoutsRef.current.delete(id);
    }
    setToastNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

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
      if (!res.ok) {
        if (mountedRef.current) {
          setDbReady(false);
          setDbError("Server error — could not fetch stats");
        }
        return;
      }
      const data = await res.json();
      if (data.error) {
        if (mountedRef.current) {
          setDbReady(false);
          setDbError(data.error);
        }
        return;
      }

      if (!mountedRef.current) return;

      setStats(buildStats(data.counts));
      setRecentBookings(data.recentBookings || []);
      setDbReady(true);
      setLastUpdated(new Date());

      // Get all ticket IDs from the response
      const fetchedAllTicketIds: string[] = data.allTicketIds || [];

      // Detect new bookings by comparing with known set
      // Only after the first fetch establishes our baseline
      if (!isFirstFetchRef.current) {
        const newBookingIds: string[] = [];
        for (const tid of fetchedAllTicketIds) {
          if (!knownTicketIdsRef.current.has(tid)) {
            newBookingIds.push(tid);
          }
        }

        if (newBookingIds.length > 0) {
          // Find the full booking data for new bookings
          const recentList = data.recentBookings || [];
          const newBookings: BookingData[] = recentList.filter((b: BookingData) =>
            newBookingIds.includes(b.ticket_id)
          );

          // If some new bookings aren't in the recent list, we still show count
          const inRecentCount = newBookings.length;
          const totalCount = newBookingIds.length;
          const unseenCount = totalCount - inRecentCount;

          // Browser push notification
          if (notificationsEnabledRef.current && "Notification" in window && Notification.permission === "granted") {
            try {
              const notificationBody = totalCount === 1
                ? `New booking from ${newBookings[0]?.full_name || "a customer"} — ${newBookings[0]?.event_type?.replace(/-/g, " ") || "event"}`
                : `${totalCount} new booking(s) received!`;
              new Notification("HFD — New Booking!", {
                body: notificationBody,
                icon: "/favicon.ico",
                tag: "hfd-new-booking",
              });
            } catch {}
          }

          // In-page toast notifications
          const toasts: ToastNotification[] = newBookings.map((b: BookingData) => ({
            id: b.ticket_id,
            message: `New booking: ${b.full_name} — ${b.event_type.replace(/-/g, " ")}`,
            customerName: b.full_name,
            eventType: b.event_type.replace(/-/g, " "),
            ticketId: b.ticket_id,
            timestamp: Date.now(),
          }));

          // If there are unseen bookings not in recent list, add a summary toast
          if (unseenCount > 0) {
            toasts.push({
              id: `unseen-${Date.now()}`,
              message: `${unseenCount} additional new booking(s) received`,
              customerName: "",
              eventType: "",
              ticketId: "",
              timestamp: Date.now(),
            });
          }

          setToastNotifications(prev => [...toasts, ...prev].slice(0, 10));

          // Auto-dismiss each toast after 15 seconds
          toasts.forEach(t => {
            const timeout = setTimeout(() => {
              if (mountedRef.current) dismissToast(t.id);
            }, 15000);
            toastTimeoutsRef.current.set(t.id, timeout);
          });
        }
      }

      // Update known ticket IDs set with ALL fetched IDs
      knownTicketIdsRef.current = new Set(fetchedAllTicketIds);
      isFirstFetchRef.current = false;
    } catch {
      if (mountedRef.current) {
        setDbReady(false);
        setDbError("Network error — could not reach server");
      }
    }
  }, [dismissToast]);

  // Initial fetch
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Poll every 10 seconds
  useEffect(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(fetchDashboard, POLL_INTERVAL);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchDashboard]);

  const retry = () => {
    setDbReady(null);
    setDbError("");
    fetchDashboard();
  };

  // Theme colors
  const { theme } = useAdminTheme();
  const bgCard = theme.bgCard;
  const bgPrimary = theme.bgPrimary;
  const textPrimary = theme.textPrimary;
  const textSecondary = theme.textSecondary;
  const textMuted = theme.textMuted;
  const borderColor = theme.borderColor;
  const hoverBg = theme.bgHover;

  return (
    <div className="p-4 sm:p-6 lg:p-8 relative" style={{ background: bgPrimary }}>
      {/* Toast notifications container */}
      {toastNotifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
          {toastNotifications.map(n => (
            <div
              key={n.id}
              className="flex items-start gap-3 p-4 rounded-xl shadow-lg animate-slide-in-right"
              style={{
                background: theme.bgCard,
                border: "1px solid rgba(184,147,95,0.4)",
                color: textPrimary,
              }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(184,147,95,0.15)" }}>
                <Bell className="w-5 h-5" style={{ color: "#B8935F" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium" style={{ color: textPrimary }}>{n.message}</p>
                {n.ticketId && (
                  <p className="text-xs font-mono mt-1" style={{ color: "#B8935F" }}>{n.ticketId}</p>
                )}
                <p className="text-[10px] font-body mt-1" style={{ color: textMuted }}>
                  {new Date(n.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => dismissToast(n.id)}
                className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-opacity hover:opacity-80"
                style={{ background: hoverBg, color: textMuted }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold" style={{ color: textPrimary }}>Dashboard</h1>
          <p className="text-sm font-body mt-1" style={{ color: textSecondary }}>Welcome back! Here&apos;s an overview of your bookings.</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-body px-2 py-0.5 rounded-full" style={{ background: "rgba(91,117,83,0.1)", color: "#5B7553" }}>
              <Clock className="w-3 h-3" />
              Auto-refreshes every 10s
            </span>
            {lastUpdated && (
              <span className="text-[10px] font-body" style={{ color: textMuted }}>
                Last: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={toggleNotifications}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-body transition-colors shrink-0"
          style={{
            background: notificationsEnabled ? "rgba(91,117,83,0.1)" : hoverBg,
            color: notificationsEnabled ? "#5B7553" : textSecondary,
            border: `1px solid ${notificationsEnabled ? "rgba(91,117,83,0.2)" : borderColor}`,
          }}
        >
          {notificationsEnabled
            ? <><Bell className="w-4 h-4" />Notifications On</>
            : <><BellOff className="w-4 h-4" />Enable Notifications</>
          }
        </button>
      </div>

      {/* DB error */}
      {dbReady === false && (
        <div className="mb-8 rounded-2xl p-6" style={{ background: bgCard, border: "2px solid rgba(184,147,95,0.3)" }}>
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
