import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
  Timestamp,
  setDoc,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Booking helpers ─────────────────────────────────────────────

export interface BookingData {
  id?: string;
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
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export async function createBooking(data: Omit<BookingData, "id" | "created_at" | "updated_at" | "status">): Promise<string> {
  const now = new Date().toISOString();
  const docRef = await addDoc(collection(db, "bookings"), {
    ...data,
    status: "pending",
    created_at: now,
    updated_at: now,
  });
  return docRef.id;
}

export async function getBooking(id: string): Promise<BookingData | null> {
  const snap = await getDoc(doc(db, "bookings", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as BookingData;
}

export async function getBookings(opts?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ bookings: BookingData[]; total: number }> {
  const pageSize = opts?.limit || 10;
  const page = opts?.page || 1;

  const constraints: QueryConstraint[] = [orderBy("created_at", "desc")];

  if (opts?.status && opts.status !== "all") {
    constraints.push(where("status", "==", opts.status));
  }

  const q = query(collection(db, "bookings"), ...constraints);
  const snapshot = await getDocs(q);

  let allDocs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as BookingData));

  // Client-side search filter
  if (opts?.search) {
    const s = opts.search.toLowerCase();
    allDocs = allDocs.filter(
      (b) =>
        b.full_name?.toLowerCase().includes(s) ||
        b.phone?.includes(s) ||
        b.email?.toLowerCase().includes(s)
    );
  }

  const total = allDocs.length;
  const start = (page - 1) * pageSize;
  const bookings = allDocs.slice(start, start + pageSize);

  return { bookings, total };
}

export async function getRecentBookings(count: number): Promise<BookingData[]> {
  const q = query(collection(db, "bookings"), orderBy("created_at", "desc"), limit(count));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BookingData));
}

export async function updateBookingStatus(id: string, status: string): Promise<void> {
  await updateDoc(doc(db, "bookings", id), {
    status,
    updated_at: new Date().toISOString(),
  });
}

export async function getBookingCounts(): Promise<{
  upcoming: number;
  today: number;
  completed: number;
  cancelled: number;
  pending: number;
}> {
  const today = new Date().toISOString().split("T")[0];

  const [upcomingSnap, todaySnap, completedSnap, cancelledSnap, pendingSnap] = await Promise.all([
    getDocs(query(collection(db, "bookings"), where("event_date", ">=", today), where("status", "!=", "cancelled"))),
    getDocs(query(collection(db, "bookings"), where("event_date", "==", today), where("status", "!=", "cancelled"))),
    getDocs(query(collection(db, "bookings"), where("status", "==", "completed"))),
    getDocs(query(collection(db, "bookings"), where("status", "==", "cancelled"))),
    getDocs(query(collection(db, "bookings"), where("status", "==", "pending"))),
  ]);

  return {
    upcoming: upcomingSnap.size,
    today: todaySnap.size,
    completed: completedSnap.size,
    cancelled: cancelledSnap.size,
    pending: pendingSnap.size,
  };
}

// ─── Gallery helpers ─────────────────────────────────────────────

export interface GalleryImageData {
  id?: string;
  url: string;
  title: string;
  category: string;
  featured: boolean;
  created_at: string;
}

export async function addGalleryImage(data: Omit<GalleryImageData, "id" | "created_at">): Promise<string> {
  const docRef = await addDoc(collection(db, "gallery_images"), {
    ...data,
    created_at: new Date().toISOString(),
  });
  return docRef.id;
}

export async function getGalleryImages(): Promise<GalleryImageData[]> {
  const q = query(collection(db, "gallery_images"), orderBy("created_at", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryImageData));
}

export async function toggleFeatured(id: string, current: boolean): Promise<void> {
  await updateDoc(doc(db, "gallery_images", id), { featured: !current });
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await deleteDoc(doc(db, "gallery_images", id));
}

// ─── Calendar blocks ─────────────────────────────────────────────

export interface CalendarBlockData {
  id?: string;
  date: string;
  blocked: boolean;
  reason: string;
}

export async function getCalendarBlocks(startDate: string, endDate: string): Promise<CalendarBlockData[]> {
  const q = query(
    collection(db, "calendar_blocks"),
    where("date", ">=", startDate),
    where("date", "<=", endDate)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CalendarBlockData));
}

export async function setCalendarBlock(date: string, blocked: boolean, reason: string): Promise<void> {
  // Check if block exists
  const q = query(collection(db, "calendar_blocks"), where("date", "==", date));
  const snap = await getDocs(q);

  if (!snap.empty) {
    const existingDoc = snap.docs[0];
    if (blocked) {
      await updateDoc(existingDoc.ref, { blocked, reason });
    } else {
      await deleteDoc(existingDoc.ref);
    }
  } else if (blocked) {
    await addDoc(collection(db, "calendar_blocks"), { date, blocked, reason });
  }
}

// ─── Business Settings ───────────────────────────────────────────

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
  updated_at?: string;
}

export async function getBusinessSettings(): Promise<BusinessSettingsData | null> {
  const q = query(collection(db, "business_settings"), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as BusinessSettingsData;
}

export async function saveBusinessSettings(data: BusinessSettingsData): Promise<void> {
  const existing = await getBusinessSettings();
  const payload = { ...data, updated_at: new Date().toISOString() };
  delete (payload as Record<string, unknown>).id;

  if (existing?.id) {
    await updateDoc(doc(db, "business_settings", existing.id), payload);
  } else {
    await addDoc(collection(db, "business_settings"), payload);
  }
}

// ─── Booking date lookup (for calendar) ──────────────────────────

export async function getBookingsForDateRange(startDate: string, endDate: string): Promise<BookingData[]> {
  const q = query(
    collection(db, "bookings"),
    where("event_date", ">=", startDate),
    where("event_date", "<=", endDate)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BookingData));
}
