"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search, CheckCircle2, XCircle, Clock,
  ChevronLeft, ChevronRight, Phone, Mail, MapPin
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  getBookings, updateBookingStatus, type BookingData,
} from "@/lib/firestore-helpers";
import { formatDate, formatTime, getBookingStatusColor } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const result = await getBookings({
        status: statusFilter,
        search: searchQuery,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setBookings(result.bookings);
      setTotalCount(result.total);
    } catch {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery, currentPage]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    setIsUpdating(true);
    try {
      await updateBookingStatus(bookingId, status);
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: status as BookingData["status"] });
      }
      fetchBookings();
    } catch {
      // Handle error
    } finally {
      setIsUpdating(false);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-charcoal">Bookings</h1>
        <p className="text-sm text-warm-gray font-body mt-1">Manage and review all booking requests</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="flex h-11 w-full rounded-xl border border-border-light bg-white pl-10 pr-4 py-2 text-sm text-charcoal placeholder:text-warm-gray/50 transition-all focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold font-body"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          {bookings.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="w-12 h-12 text-border-light mx-auto mb-4" />
              <p className="text-warm-gray font-body">No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="text-left py-3 px-4 font-heading font-medium text-warm-gray">Customer</th>
                    <th className="text-left py-3 px-4 font-heading font-medium text-warm-gray">Event</th>
                    <th className="text-left py-3 px-4 font-heading font-medium text-warm-gray">Date & Time</th>
                    <th className="text-left py-3 px-4 font-heading font-medium text-warm-gray">Venue</th>
                    <th className="text-left py-3 px-4 font-heading font-medium text-warm-gray">Status</th>
                    <th className="text-left py-3 px-4 font-heading font-medium text-warm-gray">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-border-light/50 hover:bg-cream/50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-charcoal font-body">{booking.full_name}</p>
                          <p className="text-xs text-warm-gray font-body">{booking.phone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-body capitalize text-charcoal">{booking.event_type.replace(/-/g, " ")}</td>
                      <td className="py-3 px-4 font-body">
                        <p className="text-charcoal">{formatDate(booking.event_date)}</p>
                        <p className="text-xs text-warm-gray">{formatTime(booking.preferred_time)}</p>
                      </td>
                      <td className="py-3 px-4 font-body text-charcoal max-w-[200px] truncate">{booking.venue_address}</td>
                      <td className="py-3 px-4">
                        <Badge className={getBookingStatusColor(booking.status)}>{booking.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => setSelectedBooking(booking)} className="text-gold hover:text-gold-light transition-colors font-body text-sm font-medium">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-warm-gray font-body">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="w-9 h-9 rounded-xl border border-border-light flex items-center justify-center disabled:opacity-50 hover:bg-cream transition-colors">
              <ChevronLeft className="w-4 h-4 text-charcoal" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-colors ${page === currentPage ? "bg-gold text-charcoal" : "border border-border-light text-charcoal hover:bg-cream"}`}>{page}</button>
            ))}
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="w-9 h-9 rounded-xl border border-border-light flex items-center justify-center disabled:opacity-50 hover:bg-cream transition-colors">
              <ChevronRight className="w-4 h-4 text-charcoal" />
            </button>
          </div>
        </div>
      )}

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-charcoal">Booking Details</DialogTitle>
            <DialogDescription className="text-warm-gray">Review and manage this booking request</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge className={getBookingStatusColor(selectedBooking.status)}>{selectedBooking.status}</Badge>
                <span className="text-xs text-warm-gray font-body">Created {formatDate(selectedBooking.created_at)}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-warm-gray font-body">Customer Name</label>
                  <p className="font-medium text-charcoal font-body">{selectedBooking.full_name}</p>
                </div>
                <div>
                  <label className="text-xs text-warm-gray font-body">Phone</label>
                  <a href={`tel:${selectedBooking.phone}`} className="font-medium text-gold font-body flex items-center gap-1"><Phone className="w-3 h-3" />{selectedBooking.phone}</a>
                </div>
                <div>
                  <label className="text-xs text-warm-gray font-body">Email</label>
                  <a href={`mailto:${selectedBooking.email}`} className="font-medium text-gold font-body flex items-center gap-1"><Mail className="w-3 h-3" />{selectedBooking.email}</a>
                </div>
                <div>
                  <label className="text-xs text-warm-gray font-body">Event Type</label>
                  <p className="font-medium text-charcoal font-body capitalize">{selectedBooking.event_type.replace(/-/g, " ")}</p>
                </div>
                <div>
                  <label className="text-xs text-warm-gray font-body">Date</label>
                  <p className="font-medium text-charcoal font-body">{formatDate(selectedBooking.event_date)}</p>
                </div>
                <div>
                  <label className="text-xs text-warm-gray font-body">Time</label>
                  <p className="font-medium text-charcoal font-body">{formatTime(selectedBooking.preferred_time)}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-warm-gray font-body">Venue Address</label>
                  <p className="font-medium text-charcoal font-body flex items-start gap-1"><MapPin className="w-3 h-3 mt-1 shrink-0 text-gold" />{selectedBooking.venue_address}</p>
                </div>
                {selectedBooking.google_maps_link && (
                  <div className="sm:col-span-2">
                    <a href={selectedBooking.google_maps_link} target="_blank" rel="noopener noreferrer" className="text-sm text-gold hover:underline font-body">Open in Google Maps →</a>
                  </div>
                )}
                {selectedBooking.estimated_budget && (
                  <div>
                    <label className="text-xs text-warm-gray font-body">Estimated Budget</label>
                    <p className="font-medium text-charcoal font-body">{selectedBooking.estimated_budget}</p>
                  </div>
                )}
                {selectedBooking.guest_count && (
                  <div>
                    <label className="text-xs text-warm-gray font-body">Guest Count</label>
                    <p className="font-medium text-charcoal font-body">{selectedBooking.guest_count}</p>
                  </div>
                )}
                {selectedBooking.special_notes && (
                  <div className="sm:col-span-2">
                    <label className="text-xs text-warm-gray font-body">Special Notes</label>
                    <p className="font-medium text-charcoal font-body">{selectedBooking.special_notes}</p>
                  </div>
                )}
                {selectedBooking.images && selectedBooking.images.length > 0 && (
                  <div className="sm:col-span-2">
                    <label className="text-xs text-warm-gray font-body mb-2 block">Reference Images</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedBooking.images.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                          <div className="w-20 h-20 rounded-lg bg-cream overflow-hidden">
                            <img src={url} alt={`Reference ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border-light">
                {selectedBooking.status === "pending" && (
                  <>
                    <Button onClick={() => handleStatusUpdate(selectedBooking.id!, "confirmed")} disabled={isUpdating} className="gap-2 bg-sage hover:bg-sage-light text-white">
                      <CheckCircle2 className="w-4 h-4" />Accept
                    </Button>
                    <Button onClick={() => handleStatusUpdate(selectedBooking.id!, "cancelled")} disabled={isUpdating} variant="destructive" className="gap-2">
                      <XCircle className="w-4 h-4" />Reject
                    </Button>
                  </>
                )}
                {selectedBooking.status === "confirmed" && (
                  <Button onClick={() => handleStatusUpdate(selectedBooking.id!, "completed")} disabled={isUpdating} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <CheckCircle2 className="w-4 h-4" />Mark Completed
                  </Button>
                )}
                {(selectedBooking.status === "confirmed" || selectedBooking.status === "pending") && (
                  <Button onClick={() => handleStatusUpdate(selectedBooking.id!, "cancelled")} disabled={isUpdating} variant="destructive" className="gap-2">
                    <XCircle className="w-4 h-4" />Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
