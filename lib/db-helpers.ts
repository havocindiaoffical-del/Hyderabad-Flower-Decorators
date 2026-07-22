import { eq, and, gte, lte, ne, desc, sql, like, or } from "drizzle-orm";
import { getDb } from "./db";
import { bookings, galleryImages, calendarBlocks, businessSettings } from "./schema";

// ─── Types (kept compatible with old firestore-helpers) ───────────

export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

export interface BookingData {
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
  status: BookingStatus;
  previous_status?: string;
  user_uid?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryImageData {
  id?: string;
  url: string;
  title: string;
  category: string;
  featured: boolean;
  created_at: string;
}

export interface CalendarBlockData {
  id?: string;
  date: string;
  blocked: boolean;
  reason: string;
}

export interface BusinessSettingsData {
  id?: string;
  business_name: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  brand_color: string;
  business_hours: Record<string, string>;
  social_links: Record<string, string>;
  brevo_api_key?: string;
  brevo_sender_email?: string;
  updated_at?: string;
}

// ─── Ticket ID Generator ──────────────────────────────────────────

function generateTicketId(): string {
  const prefix = "HFD";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// ─── Booking Helpers ──────────────────────────────────────────────

export async function createBooking(
  data: Omit<BookingData, "id" | "created_at" | "updated_at" | "status" | "ticket_id">
): Promise<{ id: string; ticket_id: string }> {
  const ticket_id = generateTicketId();

  const result = await getDb().insert(bookings).values({
    ticketId: ticket_id,
    fullName: data.full_name,
    phone: data.phone,
    email: data.email,
    eventType: data.event_type,
    eventDate: data.event_date,
    preferredTime: data.preferred_time,
    venueAddress: data.venue_address,
    googleMapsLink: data.google_maps_link || null,
    estimatedBudget: data.estimated_budget || null,
    guestCount: data.guest_count || null,
    specialNotes: data.special_notes || null,
    images: data.images || [],
    status: "pending",
    userUid: data.user_uid || null,
  }).returning({ id: bookings.id });

  return { id: String(result[0].id), ticket_id };
}

export async function getBooking(id: string): Promise<BookingData | null> {
  const result = await getDb().select().from(bookings).where(eq(bookings.id, Number(id))).limit(1);
  if (result.length === 0) return null;
  return rowToBooking(result[0]);
}

export async function getBookingByTicketId(ticketId: string): Promise<BookingData | null> {
  const result = await getDb().select().from(bookings).where(eq(bookings.ticketId, ticketId)).limit(1);
  if (result.length === 0) return null;
  return rowToBooking(result[0]);
}

export async function getBookingsByUserUid(uid: string): Promise<BookingData[]> {
  const result = await getDb().select().from(bookings).where(eq(bookings.userUid, uid)).orderBy(desc(bookings.createdAt));
  return result.map(rowToBooking);
}

export async function getBookingsByPhone(phone: string): Promise<BookingData[]> {
  const result = await getDb().select().from(bookings).where(eq(bookings.phone, phone)).orderBy(desc(bookings.createdAt));
  return result.map(rowToBooking);
}

export async function getBookings(opts?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ bookings: BookingData[]; total: number }> {
  const pageSize = opts?.limit || 10;
  const page = opts?.page || 1;

  const conditions = [];

  if (opts?.status && opts.status !== "all") {
    conditions.push(eq(bookings.status, opts.status));
  }

  if (opts?.search) {
    const s = opts.search.toLowerCase();
    conditions.push(
      or(
        sql`LOWER(${bookings.fullName}) LIKE ${"%" + s + "%"}`,
        sql`${bookings.phone} LIKE ${"%" + s + "%"}`,
        sql`LOWER(${bookings.email}) LIKE ${"%" + s + "%"}`,
        sql`LOWER(${bookings.ticketId}) LIKE ${"%" + s + "%"}`
      )!
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [countResult, rows] = await Promise.all([
    getDb().select({ count: sql<number>`count(*)` }).from(bookings).where(whereClause),
    getDb().select().from(bookings).where(whereClause).orderBy(desc(bookings.createdAt)).limit(pageSize).offset((page - 1) * pageSize),
  ]);

  const total = Number(countResult[0]?.count || 0);
  return { bookings: rows.map(rowToBooking), total };
}

export async function getRecentBookings(count: number): Promise<BookingData[]> {
  const result = await getDb().select().from(bookings).orderBy(desc(bookings.createdAt)).limit(count);
  return result.map(rowToBooking);
}

export async function updateBookingStatus(id: string, status: string, adminNotes?: string): Promise<void> {
  // First, get the current status to save as previous_status
  const current = await getDb().select({ status: bookings.status }).from(bookings).where(eq(bookings.id, Number(id))).limit(1);
  const currentStatus = current[0]?.status || "pending";

  const updateData: Record<string, unknown> = {
    status,
    previousStatus: currentStatus,
    updatedAt: new Date(),
  };
  if (adminNotes) {
    updateData.adminNotes = adminNotes;
  }

  await getDb().update(bookings).set(updateData).where(eq(bookings.id, Number(id)));
}

export async function getBookingCounts(): Promise<{
  upcoming: number;
  today: number;
  completed: number;
  cancelled: number;
  pending: number;
}> {
  const todayStr = new Date().toISOString().split("T")[0];

  const [upcoming, todayCount, completed, cancelled, pending] = await Promise.all([
    getDb().select({ count: sql<number>`count(*)` }).from(bookings).where(
      and(gte(bookings.eventDate, todayStr), ne(bookings.status, "cancelled"))
    ),
    getDb().select({ count: sql<number>`count(*)` }).from(bookings).where(
      and(eq(bookings.eventDate, todayStr), ne(bookings.status, "cancelled"))
    ),
    getDb().select({ count: sql<number>`count(*)` }).from(bookings).where(eq(bookings.status, "completed")),
    getDb().select({ count: sql<number>`count(*)` }).from(bookings).where(eq(bookings.status, "cancelled")),
    getDb().select({ count: sql<number>`count(*)` }).from(bookings).where(eq(bookings.status, "pending")),
  ]);

  return {
    upcoming: Number(upcoming[0]?.count || 0),
    today: Number(todayCount[0]?.count || 0),
    completed: Number(completed[0]?.count || 0),
    cancelled: Number(cancelled[0]?.count || 0),
    pending: Number(pending[0]?.count || 0),
  };
}

export async function getBookingsForDateRange(startDate: string, endDate: string): Promise<BookingData[]> {
  const result = await getDb().select().from(bookings).where(
    and(gte(bookings.eventDate, startDate), lte(bookings.eventDate, endDate))
  );
  return result.map(rowToBooking);
}

// ─── Gallery Helpers ──────────────────────────────────────────────

export async function addGalleryImage(data: Omit<GalleryImageData, "id" | "created_at">): Promise<string> {
  const result = await getDb().insert(galleryImages).values({
    url: data.url,
    title: data.title,
    category: data.category,
    featured: data.featured,
  }).returning({ id: galleryImages.id });
  return String(result[0].id);
}

export async function getGalleryImages(): Promise<GalleryImageData[]> {
  const result = await getDb().select().from(galleryImages).orderBy(desc(galleryImages.createdAt));
  return result.map((r) => ({
    id: String(r.id),
    url: r.url,
    title: r.title,
    category: r.category,
    featured: r.featured,
    created_at: r.createdAt.toISOString(),
  }));
}

export async function toggleFeatured(id: string, current: boolean): Promise<void> {
  await getDb().update(galleryImages).set({ featured: !current }).where(eq(galleryImages.id, Number(id)));
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await getDb().delete(galleryImages).where(eq(galleryImages.id, Number(id)));
}

// ─── Calendar Block Helpers ───────────────────────────────────────

export async function getCalendarBlocks(startDate: string, endDate: string): Promise<CalendarBlockData[]> {
  const result = await getDb().select().from(calendarBlocks).where(
    and(gte(calendarBlocks.date, startDate), lte(calendarBlocks.date, endDate))
  );
  return result.map((r) => ({
    id: String(r.id),
    date: r.date,
    blocked: r.blocked,
    reason: r.reason || "",
  }));
}

export async function setCalendarBlock(date: string, blocked: boolean, reason: string): Promise<void> {
  const existing = await getDb().select().from(calendarBlocks).where(eq(calendarBlocks.date, date)).limit(1);

  if (existing.length > 0) {
    if (blocked) {
      await getDb().update(calendarBlocks).set({ blocked, reason }).where(eq(calendarBlocks.date, date));
    } else {
      await getDb().delete(calendarBlocks).where(eq(calendarBlocks.date, date));
    }
  } else if (blocked) {
    await getDb().insert(calendarBlocks).values({ date, blocked, reason });
  }
}

// ─── Business Settings Helpers ────────────────────────────────────

export async function getBusinessSettings(): Promise<BusinessSettingsData | null> {
  const result = await getDb().select().from(businessSettings).limit(1);
  if (result.length === 0) return null;

  const r = result[0];
  return {
    id: String(r.id),
    business_name: r.businessName,
    phone: r.phone,
    email: r.email,
    whatsapp: r.whatsapp,
    address: r.address,
    brand_color: r.brandColor || "#B8935F",
    business_hours: (r.businessHours as Record<string, string>) || {},
    social_links: (r.socialLinks as Record<string, string>) || {},
    brevo_api_key: r.brevoApiKey || "",
    brevo_sender_email: r.brevoSenderEmail || "",
    updated_at: r.updatedAt?.toISOString(),
  };
}

export async function saveBusinessSettings(data: BusinessSettingsData): Promise<void> {
  const payload = {
    businessName: data.business_name,
    phone: data.phone,
    email: data.email,
    whatsapp: data.whatsapp,
    address: data.address,
    brandColor: data.brand_color,
    businessHours: data.business_hours,
    socialLinks: data.social_links,
    brevoApiKey: data.brevo_api_key || null,
    brevoSenderEmail: data.brevo_sender_email || null,
    updatedAt: new Date(),
  };

  const existing = await getDb().select({ id: businessSettings.id }).from(businessSettings).limit(1);

  if (existing.length > 0) {
    await getDb().update(businessSettings).set(payload).where(eq(businessSettings.id, existing[0].id));
  } else {
    await getDb().insert(businessSettings).values(payload);
  }
}

// ─── Brevo API Key Helper ──────────────────────────────────────────

export async function getBrevoConfig(): Promise<{ apiKey: string; senderEmail: string }> {
  const result = await getDb().select({
    apiKey: businessSettings.brevoApiKey,
    senderEmail: businessSettings.brevoSenderEmail,
  }).from(businessSettings).limit(1);
  if (result.length === 0) return { apiKey: "", senderEmail: "" };
  return {
    apiKey: result[0].apiKey || "",
    senderEmail: result[0].senderEmail || "",
  };
}

// ─── Row Mapper ───────────────────────────────────────────────────

function rowToBooking(row: typeof bookings.$inferSelect): BookingData {
  return {
    id: String(row.id),
    ticket_id: row.ticketId,
    full_name: row.fullName,
    phone: row.phone,
    email: row.email,
    event_type: row.eventType,
    event_date: row.eventDate,
    preferred_time: row.preferredTime,
    venue_address: row.venueAddress,
    google_maps_link: row.googleMapsLink || "",
    estimated_budget: row.estimatedBudget || "",
    guest_count: row.guestCount || "",
    special_notes: row.specialNotes || "",
    images: (row.images as string[]) || [],
    status: row.status as BookingStatus,
    previous_status: row.previousStatus || undefined,
    user_uid: row.userUid || undefined,
    admin_notes: row.adminNotes || undefined,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}
