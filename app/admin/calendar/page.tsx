"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Lock, Unlock, AlertCircle } from "lucide-react";
import { useAdminTheme } from "@/components/providers/AdminTheme";
import { formatDate, formatTime, getBookingStatusColor, getBookingStatusLabel } from "@/lib/utils";

interface BookingData {
  id?: string;
  ticket_id: string;
  full_name: string;
  phone: string;
  event_type: string;
  event_date: string;
  preferred_time: string;
  venue_address: string;
  status: string;
}

interface CalendarBlockData {
  id?: string;
  date: string;
  blocked: boolean;
  reason: string;
}

interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  bookings: BookingData[];
  blocked: boolean;
  blockReason?: string;
}

// Color mapping for each event type
const eventTypeColors: Record<string, { bg: string; text: string; dot: string }> = {
  "housewarming": { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300", dot: "bg-orange-500" },
  "wedding": { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-700 dark:text-pink-300", dot: "bg-pink-500" },
  "baby-shower": { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-300", dot: "bg-cyan-500" },
  "pooja": { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", dot: "bg-yellow-500" },
  "corporate": { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  "custom": { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-300", dot: "bg-violet-500" },
  "birthday": { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", dot: "bg-red-500" },
  "engagement": { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
};

function getEventColor(eventType: string) {
  return eventTypeColors[eventType] || { bg: "bg-gold/10", text: "text-gold", dot: "bg-gold" };
}

export default function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [blockedDates, setBlockedDates] = useState<Record<string, CalendarBlockData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [dbReady, setDbReady] = useState(true);

  useEffect(() => {
    try {
    } catch {}
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const fetchCalendarData = useCallback(async () => {
    try {
      const firstDay = new Date(year, month, 1).toISOString().split("T")[0];
      const lastDay = new Date(year, month + 1, 0).toISOString().split("T")[0];
      const res = await fetch(`/api/admin/calendar?start=${firstDay}&end=${lastDay}`);
      const data = await res.json();
      if (data.error) { setDbReady(false); generateCalendarDays([], {}); return; }
      const blocks: Record<string, CalendarBlockData> = {};
      (data.blocks || []).forEach((b: CalendarBlockData) => { blocks[b.date] = b; });
      setBlockedDates(blocks);
      setDbReady(true);
      generateCalendarDays(data.bookings || [], blocks);
    } catch {
      setDbReady(false);
      generateCalendarDays([], {});
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => { fetchCalendarData(); }, [fetchCalendarData]);

  const generateCalendarDays = (bookings: BookingData[], blocks: Record<string, CalendarBlockData>) => {
    const startingDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days: CalendarDay[] = [];

    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day).toISOString().split("T")[0];
      days.push({ date, day, isCurrentMonth: false, isToday: false, bookings: bookings.filter((b) => b.event_date === date), blocked: blocks[date]?.blocked || false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day).toISOString().split("T")[0];
      const isToday = new Date(year, month, day).getTime() === today.getTime();
      days.push({ date, day, isCurrentMonth: true, isToday, bookings: bookings.filter((b) => b.event_date === date), blocked: blocks[date]?.blocked || false });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day).toISOString().split("T")[0];
      days.push({ date, day, isCurrentMonth: false, isToday: false, bookings: bookings.filter((b) => b.event_date === date), blocked: blocks[date]?.blocked || false });
    }

    setCalendarDays(days);
  };

  const handleToggleBlock = async (date: string) => {
    try {
      const isBlocked = blockedDates[date]?.blocked || false;
      await fetch("/api/admin/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, blocked: !isBlocked, reason: "Blocked by admin" }),
      });
      fetchCalendarData();
    } catch {}
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const monthName = currentDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  // Theme colors
  const { theme } = useAdminTheme();
  const bgCard = theme.bgCard;
  const bgPrimary = theme.bgPrimary;
  const textPrimary = theme.textPrimary;
  const textSecondary = theme.textSecondary;
  const borderColor = theme.borderColor;
  const hoverBg = theme.bgHover;
  const dayBg = theme.bgCard;
  const dimBg = theme.isDark ? "#0F0F0F" : "#F0EBE3";

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4" style={{ background: bgPrimary }}>
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ background: bgPrimary }}>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold" style={{ color: textPrimary }}>Calendar</h1>
        <p className="text-sm font-body mt-1" style={{ color: textSecondary }}>View bookings by event type with color coding</p>
      </div>

      {!dbReady && (
        <div className="mb-6 p-4 rounded-xl bg-gold/5 border border-gold/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-gold shrink-0" />
          <p className="text-sm font-body" style={{ color: textPrimary }}>Database connection issue.</p>
        </div>
      )}

      {/* Color legend */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {Object.entries(eventTypeColors).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
            <span className="text-xs font-body capitalize" style={{ color: textSecondary }}>{type.replace(/-/g, " ")}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-3">
          <Lock className="w-3 h-3 text-red-400" />
          <span className="text-xs font-body" style={{ color: textSecondary }}>Blocked</span>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-2xl overflow-hidden" style={{ background: bgCard, border: `1px solid ${borderColor}` }}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigateMonth(-1)} className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors" style={{ border: `1px solid ${borderColor}`, background: hoverBg }}>
              <ChevronLeft className="w-5 h-5" style={{ color: textPrimary }} />
            </button>
            <h2 className="text-lg font-heading font-semibold" style={{ color: textPrimary }}>{monthName}</h2>
            <button onClick={() => navigateMonth(1)} className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors" style={{ border: `1px solid ${borderColor}`, background: hoverBg }}>
              <ChevronRight className="w-5 h-5" style={{ color: textPrimary }} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-heading font-medium py-2" style={{ color: textSecondary }}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const hasBookings = day.isCurrentMonth && day.bookings.length > 0;
              const bookingEventTypes = day.bookings.map(b => b.event_type);
              const uniqueTypes = [...new Set(bookingEventTypes)];

              return (
                <button
                  key={index}
                  onClick={() => day.isCurrentMonth && setSelectedDay(day)}
                  disabled={!day.isCurrentMonth}
                  className="relative rounded-xl p-1.5 transition-all duration-200 min-h-[48px] sm:min-h-[64px]"
                  style={{
                    background: !day.isCurrentMonth ? dimBg : (day.blocked ? (theme.isDark ? "#2A1515" : "#FEF2F2") : dayBg),
                    border: `1px solid ${day.isCurrentMonth && day.isToday ? "#B8935F" : borderColor}`,
                    cursor: day.isCurrentMonth ? "pointer" : "default",
                  }}
                >
                  <span className="text-xs font-body block mb-1" style={{ color: day.isCurrentMonth ? textPrimary : textSecondary }}>{day.day}</span>

                  {/* Booking count + color dots */}
                  {hasBookings && (
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-[9px] font-bold font-body" style={{ color: "#B8935F" }}>{day.bookings.length}</span>
                      <div className="flex gap-0.5 justify-center flex-wrap max-w-[40px]">
                        {uniqueTypes.slice(0, 4).map((eventType, i) => {
                          const colors = getEventColor(eventType);
                          return <div key={i} className={`w-2 h-2 rounded-full ${colors.dot}`} />;
                        })}
                      </div>
                    </div>
                  )}

                  {day.blocked && <Lock className="w-3 h-3 text-red-400 absolute top-0.5 right-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day detail dialog */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDay(null)}>
          <div className="absolute inset-0 bg-charcoal/40" />
          <div className="relative max-w-lg w-full rounded-2xl p-6 max-h-[80vh] overflow-y-auto" style={{ background: bgCard, border: `1px solid ${borderColor}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold" style={{ color: textPrimary }}>{formatDate(selectedDay.date)}</h3>
              <button onClick={() => setSelectedDay(null)} className="text-sm" style={{ color: textSecondary }}>✕</button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => handleToggleBlock(selectedDay.date)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-body transition-colors"
                style={{
                  background: selectedDay.blocked ? "rgba(91,117,83,0.1)" : "rgba(239,68,68,0.1)",
                  color: selectedDay.blocked ? "#5B7553" : "#ef4444",
                }}
              >
                {selectedDay.blocked ? <><Unlock className="w-3 h-3" />Unblock</> : <><Lock className="w-3 h-3" />Block</>}
              </button>
              <span className="text-xs font-body" style={{ color: textSecondary }}>{selectedDay.bookings.length} booking(s)</span>
            </div>

            {selectedDay.bookings.length > 0 ? (
              <div className="space-y-3">
                {selectedDay.bookings.map((booking) => {
                  const colors = getEventColor(booking.event_type);
                  return (
                    <div key={booking.id} className="rounded-xl p-3" style={{ background: hoverBg, border: `1px solid ${borderColor}` }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                          <span className="font-heading font-medium text-sm capitalize" style={{ color: textPrimary }}>{booking.full_name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-medium ${getBookingStatusColor(booking.status)}`}>
                          {getBookingStatusLabel(booking.status)}
                        </span>
                      </div>
                      <div className="text-xs font-body" style={{ color: textSecondary }}>
                        <p className="capitalize">{booking.event_type.replace(/-/g, " ")}</p>
                        <p>{formatTime(booking.preferred_time)} • {booking.venue_address}</p>
                        <a href={`tel:${booking.phone}`} className="text-gold">{booking.phone}</a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm font-body text-center py-4" style={{ color: textSecondary }}>No bookings on this date</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
