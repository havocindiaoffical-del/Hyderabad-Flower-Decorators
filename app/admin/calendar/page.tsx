"use client";

import React, { useState, useEffect, useCallback } from "react";

import { ChevronLeft, ChevronRight, Lock, Unlock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  getBookingsForDateRange, getCalendarBlocks, setCalendarBlock,
  type BookingData, type CalendarBlockData,
} from "@/lib/db-helpers";
import { formatDate, formatTime, getBookingStatusColor, getBookingStatusLabel } from "@/lib/utils";

interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  bookings: BookingData[];
  blocked: boolean;
  blockReason?: string;
}

export default function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [blockedDates, setBlockedDates] = useState<Record<string, CalendarBlockData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const fetchCalendarData = useCallback(async () => {
    try {
      const firstDay = new Date(year, month, 1).toISOString().split("T")[0];
      const lastDay = new Date(year, month + 1, 0).toISOString().split("T")[0];

      const [bookingsData, blocksData] = await Promise.all([
        getBookingsForDateRange(firstDay, lastDay),
        getCalendarBlocks(firstDay, lastDay),
      ]);

      const blocks: Record<string, CalendarBlockData> = {};
      blocksData.forEach((b) => { blocks[b.date] = b; });
      setBlockedDates(blocks);
      setFirebaseReady(true);

      generateCalendarDays(bookingsData, blocks);
    } catch {
      setFirebaseReady(false);
      generateCalendarDays([], {});
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

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
      await setCalendarBlock(date, !isBlocked, "Blocked by admin");
      fetchCalendarData();
    } catch {
      // Handle error
    }
  };

  const getDayStatus = (day: CalendarDay) => {
    if (day.blocked) return "unavailable";
    if (day.bookings.length >= 3) return "unavailable";
    if (day.bookings.length >= 2) return "few_slots";
    return "available";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-sage/10 border-sage/20";
      case "few_slots": return "bg-amber-50 border-amber-200";
      case "unavailable": return "bg-red-50 border-red-200";
      default: return "bg-white border-border-light";
    }
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const monthName = currentDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-warm-gray font-body">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-charcoal">Calendar</h1>
        <p className="text-sm text-warm-gray font-body mt-1">View and manage booking availability</p>
      </div>

      {!firebaseReady && (
        <div className="mb-6 p-4 rounded-xl bg-gold/5 border border-gold/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-gold shrink-0" />
          <p className="text-sm text-charcoal font-body">Database connection issue. Check your Neon database connection.</p>
        </div>
      )}

      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-sage/10 border border-sage/20" />
          <span className="text-sm text-warm-gray font-body">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-50 border border-amber-200" />
          <span className="text-sm text-warm-gray font-body">Few Slots</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-50 border border-red-200" />
          <span className="text-sm text-warm-gray font-body">Unavailable</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigateMonth(-1)} className="w-10 h-10 rounded-xl border border-border-light flex items-center justify-center hover:bg-cream transition-colors">
              <ChevronLeft className="w-5 h-5 text-charcoal" />
            </button>
            <h2 className="text-lg font-heading font-semibold text-charcoal">{monthName}</h2>
            <button onClick={() => navigateMonth(1)} className="w-10 h-10 rounded-xl border border-border-light flex items-center justify-center hover:bg-cream transition-colors">
              <ChevronRight className="w-5 h-5 text-charcoal" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-heading font-medium text-warm-gray py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const status = day.isCurrentMonth ? getDayStatus(day) : "default";
              return (
                <button
                  key={index}
                  onClick={() => day.isCurrentMonth && setSelectedDay(day)}
                  disabled={!day.isCurrentMonth}
                  className={`
                    relative aspect-square rounded-xl border p-1 transition-all duration-200
                    ${day.isCurrentMonth ? getStatusColor(status) : "bg-cream/30 border-transparent"}
                    ${day.isToday ? "ring-2 ring-gold ring-offset-1" : ""}
                    ${day.isCurrentMonth && day.bookings.length > 0 ? "cursor-pointer hover:shadow-md" : ""}
                    ${day.isCurrentMonth && day.bookings.length === 0 ? "cursor-default" : ""}
                  `}
                >
                  <span className={`text-xs font-body ${day.isCurrentMonth ? "text-charcoal" : "text-warm-gray/40"}`}>{day.day}</span>
                  {day.isCurrentMonth && day.bookings.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                      <div className="flex gap-0.5">
                        {day.bookings.slice(0, 3).map((_, i) => (
                          <div key={i} className="w-1 h-1 rounded-full bg-gold" />
                        ))}
                      </div>
                    </div>
                  )}
                  {day.blocked && <Lock className="w-3 h-3 text-red-400 absolute top-1 right-1" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-charcoal">{selectedDay ? formatDate(selectedDay.date) : ""}</DialogTitle>
            <DialogDescription className="text-warm-gray">
              {selectedDay?.blocked ? "This date is blocked" : `${selectedDay?.bookings.length || 0} booking(s) on this date`}
            </DialogDescription>
          </DialogHeader>
          {selectedDay && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Button onClick={() => handleToggleBlock(selectedDay.date)} variant={selectedDay.blocked ? "default" : "destructive"} size="sm" className="gap-2">
                  {selectedDay.blocked ? <><Unlock className="w-4 h-4" />Unblock Date</> : <><Lock className="w-4 h-4" />Block Date</>}
                </Button>
              </div>
              {selectedDay.bookings.length > 0 ? (
                <div className="space-y-3">
                  {selectedDay.bookings.map((booking) => (
                    <div key={booking.id} className="p-3 rounded-xl bg-cream border border-border-light">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-heading font-medium text-sm text-charcoal">{booking.full_name}</span>
                        <Badge className={getBookingStatusColor(booking.status)}>{getBookingStatusLabel(booking.status)}</Badge>
                      </div>
                      <div className="text-xs text-warm-gray font-body space-y-1">
                        <p>{booking.event_type.replace(/-/g, " ")} • {formatTime(booking.preferred_time)}</p>
                        <p>{booking.venue_address}</p>
                        <a href={`tel:${booking.phone}`} className="text-gold">{booking.phone}</a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-warm-gray font-body text-center py-4">No bookings on this date</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
