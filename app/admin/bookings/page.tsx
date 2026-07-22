"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import JSZip from "jszip";
import {
  Search, CheckCircle2, XCircle, Clock, Loader2,
  ChevronLeft, ChevronRight, Phone, Mail, MapPin, Ticket, Undo2, Download, Image as ImageIcon
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
  google_maps_link: string;
  estimated_budget: string;
  guest_count: string;
  special_notes: string;
  images: string[];
  image_share_urls: string[];
  zip_url: string;
  upload_status: string;
  status: string;
  previous_status?: string;
  user_uid?: string;
  admin_notes?: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

const statusFlow: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [shareLinkProgress, setShareLinkProgress] = useState("");
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  useEffect(() => {
    try { setIsDark(localStorage.getItem("hfd_admin_dark") === "true"); } catch {}
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const params = new URLSearchParams({ status: statusFilter, search: searchQuery, page: String(currentPage) });
      const res = await fetch(`/api/admin/bookings?${params}`);
      const data = await res.json();
      setBookings(data.bookings || []);
      setTotalCount(data.total || 0);
    } catch {
      setBookings([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery, currentPage]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    setIsUpdating(true);
    try {
      await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status, adminNotes }),
      });
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, previous_status: selectedBooking.status, status, admin_notes: adminNotes || selectedBooking.admin_notes });
      }
      setAdminNotes("");
      fetchBookings();
    } catch {} finally { setIsUpdating(false); }
  };

  const handleRevert = async (bookingId: string) => {
    if (!selectedBooking?.previous_status) return;
    setIsUpdating(true);
    try {
      await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: selectedBooking.previous_status }),
      });
      setSelectedBooking({ ...selectedBooking, status: selectedBooking.previous_status!, previous_status: undefined });
      fetchBookings();
    } catch {} finally { setIsUpdating(false); }
  };

  const handleGenerateShareLink = async () => {
    if (!selectedBooking) return;
    setIsGeneratingLink(true);
    setShareLinkProgress("Uploading images to cloud...");
    try {
      const res = await fetch("/api/admin/bookings/upload-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: selectedBooking.id }),
      });
      const data = await res.json();
      if (data.error) { alert(`Error: ${data.error}`); return; }
      setSelectedBooking({ ...selectedBooking, image_share_urls: data.catboxUrls || [], zip_url: data.zipUrl || "", upload_status: "complete" });
      setShareLinkProgress(`✅ ${data.catboxUrls?.length || 0} images uploaded!`);
    } catch (err) {
      alert(`Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsGeneratingLink(false);
      setTimeout(() => setShareLinkProgress(""), 5000);
    }
  };

  const handleDownloadZip = async () => {
    if (!selectedBooking || selectedBooking.images.length === 0) return;
    setIsDownloading(true);
    setDownloadProgress("Preparing ZIP...");
    try {
      const zip = new JSZip();
      const detailsContent = [
        "=".repeat(50), "HYDERABAD FLOWER DECORATORS — BOOKING DETAILS", "=".repeat(50), "",
        `Ticket ID    : ${selectedBooking.ticket_id}`, `Customer Name: ${selectedBooking.full_name}`,
        `Phone        : ${selectedBooking.phone}`, `Email        : ${selectedBooking.email}`, "",
        "EVENT DETAILS", "-".repeat(30),
        `Event Type   : ${selectedBooking.event_type.replace(/-/g, " ")}`,
        `Event Date   : ${formatDate(selectedBooking.event_date)}`,
        `Preferred Time: ${formatTime(selectedBooking.preferred_time)}`,
        `Venue Address: ${selectedBooking.venue_address}`,
        selectedBooking.estimated_budget ? `Budget       : ${selectedBooking.estimated_budget}` : "",
        selectedBooking.guest_count ? `Guest Count  : ${selectedBooking.guest_count}` : "",
        "", `Status       : ${getBookingStatusLabel(selectedBooking.status)}`,
        selectedBooking.special_notes ? `Notes        : ${selectedBooking.special_notes}` : "",
        "", "=".repeat(50), "Generated by HFD Admin", "=".repeat(50),
      ].filter(l => l !== null).join("\n");
      zip.file("customer_details.txt", detailsContent);

      for (let i = 0; i < selectedBooking.images.length; i++) {
        setDownloadProgress(`Downloading image ${i + 1}/${selectedBooking.images.length}...`);
        try {
          const r = await fetch(selectedBooking.images[i]);
          if (!r.ok) continue;
          const b = await r.blob();
          let ext = "jpg";
          if (b.type.includes("png")) ext = "png";
          else if (b.type.includes("webp")) ext = "webp";
          zip.file(`images/reference_${i + 1}.${ext}`, b);
        } catch {}
      }

      setDownloadProgress("Generating ZIP...");
      const content = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
      const safeName = selectedBooking.full_name.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_").trim();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(content);
      a.download = `${safeName}_${selectedBooking.ticket_id}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadProgress("Download complete!");
    } catch (err) {
      alert(`Download failed: ${err instanceof Error ? err.message : "Failed"}`);
    } finally { setIsDownloading(false); setDownloadProgress(""); }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const bgCard = isDark ? "#1A1A1A" : "#FFFFFF";
  const bgPrimary = isDark ? "#0F0F0F" : "#FAF8F5";
  const textPrimary = isDark ? "#E8E2DA" : "#1A1A1A";
  const textSecondary = isDark ? "#9B9490" : "#6B6560";
  const textMuted = isDark ? "#6B6560" : "#9B9490";
  const borderColor = isDark ? "#2A2A2A" : "#E8E2DA";
  const hoverBg = isDark ? "#222222" : "#F0EBE3";
  const inputBg = isDark ? "#222222" : "#FFFFFF";

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]" style={{ background: bgPrimary }}>
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ background: bgPrimary }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold" style={{ color: textPrimary }}>Bookings</h1>
        <p className="text-sm font-body mt-1" style={{ color: textSecondary }}>Manage and review all booking requests</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: textMuted }} />
          <input type="text" placeholder="Search by name, phone, email, or ticket ID..." value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="flex h-11 w-full rounded-xl border pl-10 pr-4 py-2 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold font-body"
            style={{ background: inputBg, color: textPrimary, borderColor }} />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="h-11 rounded-xl px-4 text-sm font-body focus:outline-none focus:border-gold"
          style={{ background: inputBg, color: textPrimary, border: `1px solid ${borderColor}` }}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: bgCard, border: `1px solid ${borderColor}` }}>
        {bookings.length === 0 ? (
          <div className="text-center py-16"><Clock className="w-12 h-12 mx-auto mb-4" style={{ color: borderColor }} /><p className="font-body" style={{ color: textSecondary }}>No bookings found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <th className="text-left py-3 px-4 font-heading font-medium" style={{ color: textSecondary }}>Ticket</th>
                  <th className="text-left py-3 px-4 font-heading font-medium" style={{ color: textSecondary }}>Customer</th>
                  <th className="text-left py-3 px-4 font-heading font-medium" style={{ color: textSecondary }}>Event</th>
                  <th className="text-left py-3 px-4 font-heading font-medium" style={{ color: textSecondary }}>Date</th>
                  <th className="text-left py-3 px-4 font-heading font-medium" style={{ color: textSecondary }}>Photos</th>
                  <th className="text-left py-3 px-4 font-heading font-medium" style={{ color: textSecondary }}>Status</th>
                  <th className="text-left py-3 px-4 font-heading font-medium" style={{ color: textSecondary }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="transition-colors cursor-pointer" style={{ borderBottom: `1px solid ${borderColor}` }}
                    onClick={() => { setSelectedBooking(b); setAdminNotes(""); setShareLinkCopied(false); }}>
                    <td className="py-3 px-4"><span className="text-xs font-mono font-medium text-gold">{b.ticket_id}</span></td>
                    <td className="py-3 px-4"><p className="font-medium font-body" style={{ color: textPrimary }}>{b.full_name}</p><p className="text-xs font-body" style={{ color: textSecondary }}>{b.phone}</p></td>
                    <td className="py-3 px-4 font-body capitalize" style={{ color: textPrimary }}>{b.event_type.replace(/-/g, " ")}</td>
                    <td className="py-3 px-4 font-body"><p style={{ color: textPrimary }}>{formatDate(b.event_date)}</p><p className="text-xs" style={{ color: textSecondary }}>{formatTime(b.preferred_time)}</p></td>
                    <td className="py-3 px-4">
                      {b.zip_url ? (
                        <span className="text-xs font-body text-sage font-medium">✓ Ready</span>
                      ) : b.upload_status === "uploading" ? (
                        <span className="text-xs font-body text-gold">⏳ Uploading</span>
                      ) : (b.image_share_urls?.length > 0 || b.images?.length > 0) ? (
                        <span className="text-xs font-body" style={{ color: textMuted }}>Pending</span>
                      ) : (
                        <span className="text-xs font-body" style={{ color: textMuted }}>None</span>
                      )}
                    </td>
                    <td className="py-3 px-4"><span className={`px-2.5 py-1 rounded-full text-xs font-body font-medium ${getBookingStatusColor(b.status)}`}>{getBookingStatusLabel(b.status)}</span></td>
                    <td className="py-3 px-4"><span className="text-gold hover:underline font-body text-sm font-medium">View</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm font-body" style={{ color: textSecondary }}>Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-50" style={{ border: `1px solid ${borderColor}`, background: hoverBg }}><ChevronLeft className="w-4 h-4" style={{ color: textPrimary }} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium"
                style={{ background: page === currentPage ? "#B8935F" : hoverBg, color: page === currentPage ? "#1A1A1A" : textPrimary, border: page === currentPage ? "none" : `1px solid ${borderColor}` }}>{page}</button>
            ))}
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-50" style={{ border: `1px solid ${borderColor}`, background: hoverBg }}><ChevronRight className="w-4 h-4" style={{ color: textPrimary }} /></button>
          </div>
        </div>
      )}

      {/* ─── Booking Detail Dialog ────────────────────────────── */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedBooking(null)}>
          <div className="absolute inset-0 bg-charcoal/40" />
          <div className="relative max-w-2xl w-full rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: bgCard, border: `1px solid ${borderColor}` }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><Ticket className="w-4 h-4 text-gold" /><span className="font-heading font-semibold" style={{ color: textPrimary }}>{selectedBooking.ticket_id}</span></div>
              <button onClick={() => setSelectedBooking(null)} className="text-sm px-2 py-1 rounded-lg" style={{ color: textSecondary, background: hoverBg }}>✕</button>
            </div>

            {/* Status + Date */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-body font-medium ${getBookingStatusColor(selectedBooking.status)}`}>{getBookingStatusLabel(selectedBooking.status)}</span>
                {selectedBooking.previous_status && (
                  <span className="text-xs font-body" style={{ color: textSecondary }}>was <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${getBookingStatusColor(selectedBooking.previous_status)}`}>{getBookingStatusLabel(selectedBooking.previous_status)}</span></span>
                )}
              </div>
              <span className="text-xs font-body" style={{ color: textMuted }}>Created {formatDate(selectedBooking.created_at)}</span>
            </div>

            {/* Status Steps */}
            <div className="flex items-center justify-between relative py-2 mb-4">
              <div className="absolute top-[18px] left-[12%] right-[12%] h-0.5" style={{ background: borderColor }} />
              {(["Pending", "Confirmed", "In Progress", "Completed"] as const).map((step, i) => {
                const keys = ["pending", "confirmed", "in_progress", "completed"];
                const currentIdx = keys.indexOf(selectedBooking.status);
                const isCancelled = selectedBooking.status === "cancelled";
                const isActive = !isCancelled && i <= currentIdx;
                const isCurrent = !isCancelled && i === currentIdx;
                return (
                  <div key={step} className="relative flex flex-col items-center z-10">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: isCancelled ? (isDark ? "#2A1515" : "#FEF2F2") : isActive ? "#B8935F" : bgCard, color: isCancelled ? "#ef4444" : isActive ? "#1A1A1A" : textMuted, border: `1px solid ${isCancelled ? "#ef4444" : isActive ? "#B8935F" : borderColor}` }}>
                      {isCancelled ? <XCircle className="w-3 h-3" /> : i < currentIdx ? "✓" : i + 1}
                    </div>
                    <span className="text-[9px] mt-1 font-body whitespace-nowrap" style={{ color: isCurrent ? "#B8935F" : isActive ? textPrimary : textMuted, fontWeight: isCurrent ? 600 : 400 }}>{step}</span>
                  </div>
                );
              })}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-xs font-body" style={{ color: textSecondary }}>Customer</label><p className="font-medium font-body" style={{ color: textPrimary }}>{selectedBooking.full_name}</p></div>
              <div><label className="text-xs font-body" style={{ color: textSecondary }}>Phone</label><a href={`tel:${selectedBooking.phone}`} className="font-medium text-gold font-body flex items-center gap-1"><Phone className="w-3 h-3" />{selectedBooking.phone}</a></div>
              <div><label className="text-xs font-body" style={{ color: textSecondary }}>Email</label><a href={`mailto:${selectedBooking.email}`} className="font-medium text-gold font-body flex items-center gap-1"><Mail className="w-3 h-3" />{selectedBooking.email}</a></div>
              <div><label className="text-xs font-body" style={{ color: textSecondary }}>Event</label><p className="font-medium font-body capitalize" style={{ color: textPrimary }}>{selectedBooking.event_type.replace(/-/g, " ")}</p></div>
              <div><label className="text-xs font-body" style={{ color: textSecondary }}>Date</label><p className="font-medium font-body" style={{ color: textPrimary }}>{formatDate(selectedBooking.event_date)}</p></div>
              <div><label className="text-xs font-body" style={{ color: textSecondary }}>Time</label><p className="font-medium font-body" style={{ color: textPrimary }}>{formatTime(selectedBooking.preferred_time)}</p></div>
              <div className="sm:col-span-2"><label className="text-xs font-body" style={{ color: textSecondary }}>Venue</label><p className="font-medium font-body flex items-start gap-1" style={{ color: textPrimary }}><MapPin className="w-3 h-3 mt-1 shrink-0 text-gold" />{selectedBooking.venue_address}</p></div>
              {selectedBooking.google_maps_link && <div className="sm:col-span-2"><a href={selectedBooking.google_maps_link} target="_blank" rel="noopener noreferrer" className="text-sm text-gold hover:underline font-body">Open in Maps →</a></div>}
              {selectedBooking.estimated_budget && <div><label className="text-xs font-body" style={{ color: textSecondary }}>Budget</label><p className="font-medium font-body" style={{ color: textPrimary }}>{selectedBooking.estimated_budget}</p></div>}
              {selectedBooking.guest_count && <div><label className="text-xs font-body" style={{ color: textSecondary }}>Guests</label><p className="font-medium font-body" style={{ color: textPrimary }}>{selectedBooking.guest_count}</p></div>}
              {selectedBooking.special_notes && <div className="sm:col-span-2"><label className="text-xs font-body" style={{ color: textSecondary }}>Notes</label><p className="font-medium font-body" style={{ color: textPrimary }}>{selectedBooking.special_notes}</p></div>}

              {/* ─── Photos Section ─────────────────────────── */}
              {(selectedBooking.image_share_urls?.length > 0 || selectedBooking.images?.length > 0) && (
                <div className="sm:col-span-2">
                  <label className="text-xs font-body mb-2 block" style={{ color: textSecondary }}>
                    📎 Reference Photos ({selectedBooking.image_share_urls?.length || selectedBooking.images?.length || 0})
                  </label>

                  {/* Uploading status */}
                  {selectedBooking.upload_status === "uploading" && (
                    <div className="rounded-xl p-4 mb-3 flex items-center gap-3" style={{ background: "rgba(184,147,95,0.1)", border: "1px solid rgba(184,147,95,0.2)" }}>
                      <Loader2 className="w-4 h-4 animate-spin text-gold" />
                      <p className="text-xs font-body font-medium text-gold">Images uploading to cloud... Refresh to check</p>
                    </div>
                  )}

                  {/* ✅ Download link ready */}
                  {selectedBooking.zip_url && (
                    <div className="rounded-xl p-4 mb-3" style={{ background: "rgba(91,117,83,0.05)", border: "1px solid rgba(91,117,83,0.15)" }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-sage" />
                          <p className="text-xs font-body font-semibold" style={{ color: "#5B7553" }}>✓ Photos ready — permanent link</p>
                        </div>
                        <a href={selectedBooking.zip_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-body font-semibold" style={{ background: "#B8935F", color: "#1A1A1A" }}>
                          <Download className="w-4 h-4" />Access Photos
                        </a>
                      </div>
                      <p className="text-[10px] font-body mt-2" style={{ color: textMuted }}>Share via WhatsApp, email, or any channel — never expires</p>
                    </div>
                  )}

                  {/* Individual image URLs */}
                  {selectedBooking.image_share_urls?.length > 0 && (
                    <div className="rounded-xl p-3 mb-3" style={{ background: "rgba(184,147,95,0.05)", border: "1px solid rgba(184,147,95,0.15)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-body font-semibold" style={{ color: "#B8935F" }}>🔗 Individual Image Links ({selectedBooking.image_share_urls.length})</p>
                        <button onClick={() => { navigator.clipboard.writeText(selectedBooking.image_share_urls!.join("\n")); setShareLinkCopied(true); setTimeout(() => setShareLinkCopied(false), 2000); }}
                          className="text-xs px-3 py-1.5 rounded-lg font-body" style={{ background: "#B8935F", color: "#1A1A1A" }}>
                          {shareLinkCopied ? "✓ Copied!" : "Copy All URLs"}
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        {selectedBooking.image_share_urls.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-mono text-gold hover:underline truncate">
                            <ImageIcon className="w-3 h-3 shrink-0" />Image {i + 1}: {url}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload to Cloud button */}
                  {!selectedBooking.zip_url && selectedBooking.upload_status !== "uploading" && selectedBooking.images?.length > 0 && (
                    <button onClick={handleGenerateShareLink} disabled={isGeneratingLink}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-body font-semibold mb-3 disabled:opacity-50" style={{ background: "#B8935F", color: "#1A1A1A" }}>
                      {isGeneratingLink ? <><Loader2 className="w-4 h-4 animate-spin" />{shareLinkProgress || "Uploading..."}</> : <><ImageIcon className="w-4 h-4" />Upload to Cloud</>}
                    </button>
                  )}

                  {/* Local ZIP download */}
                  {selectedBooking.images?.length > 0 && (
                    <button onClick={handleDownloadZip} disabled={isDownloading}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-body font-semibold mb-3 disabled:opacity-50" style={{ background: hoverBg, color: textPrimary, border: `1px solid ${borderColor}` }}>
                      {isDownloading ? <><Loader2 className="w-4 h-4 animate-spin" />{downloadProgress || "Preparing..."}</> : <><Download className="w-4 h-4" />Download ZIP (Local)</>}
                    </button>
                  )}

                  {/* Image thumbnails */}
                  {selectedBooking.images?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedBooking.images.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                          <div className="w-20 h-20 rounded-lg overflow-hidden" style={{ background: hoverBg }}>
                            <img src={url} alt={`Reference ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Admin Notes */}
            <div className="mt-4">
              <label className="text-xs font-body mb-2 block" style={{ color: textSecondary }}>Add Note (visible to customer)</label>
              <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={2}
                className="flex min-h-[60px] w-full rounded-xl border px-4 py-3 text-sm resize-none font-body focus:outline-none focus:border-gold"
                style={{ background: isDark ? "#222222" : "#FAF8F5", color: textPrimary, borderColor }} placeholder="e.g., Confirmed for 3 PM" />
            </div>

            {selectedBooking.admin_notes && (
              <div className="mt-3 p-3 rounded-xl" style={{ background: "rgba(184,147,95,0.05)", border: "1px solid rgba(184,147,95,0.2)" }}>
                <p className="text-xs text-gold font-body font-medium mb-1">Current Note</p>
                <p className="text-sm font-body" style={{ color: textPrimary }}>{selectedBooking.admin_notes}</p>
              </div>
            )}

            {/* Revert + Status Actions */}
            <div className="flex flex-wrap gap-3 pt-4" style={{ borderTop: `1px solid ${borderColor}` }}>
              {selectedBooking.previous_status && (
                <button onClick={() => handleRevert(selectedBooking.id!)} disabled={isUpdating}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-body" style={{ background: hoverBg, color: textSecondary, border: `1px solid ${borderColor}` }}>
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin text-gold" /> : <Undo2 className="w-4 h-4 text-gold" />}
                  <span className="text-gold font-semibold">Revert</span> to {getBookingStatusLabel(selectedBooking.previous_status)}
                </button>
              )}
              {statusFlow[selectedBooking.status]?.map((nextStatus) => (
                <button key={nextStatus} onClick={() => handleStatusUpdate(selectedBooking.id!, nextStatus)} disabled={isUpdating}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-body font-semibold text-white"
                  style={{ background: nextStatus === "cancelled" ? "#dc2626" : nextStatus === "confirmed" ? "#5B7553" : nextStatus === "in_progress" ? "#7c3aed" : "#2563eb" }}>
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                  {nextStatus === "confirmed" && <><CheckCircle2 className="w-4 h-4" />Confirm</>}
                  {nextStatus === "in_progress" && <><Loader2 className="w-4 h-4" />Start Work</>}
                  {nextStatus === "completed" && <><CheckCircle2 className="w-4 h-4" />Complete</>}
                  {nextStatus === "cancelled" && <><XCircle className="w-4 h-4" />Cancel</>}
                </button>
              ))}
            </div>

            {selectedBooking.previous_status && (
              <div className="flex items-start gap-2 p-3 rounded-lg mt-3" style={{ background: hoverBg, border: `1px solid ${borderColor}` }}>
                <Undo2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <p className="text-xs font-body" style={{ color: textSecondary }}>
                  Changed from <strong style={{ color: textPrimary }}>{getBookingStatusLabel(selectedBooking.previous_status)}</strong> to <strong style={{ color: textPrimary }}>{getBookingStatusLabel(selectedBooking.status)}</strong>. Click <strong className="text-gold">"Revert"</strong> to undo.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
