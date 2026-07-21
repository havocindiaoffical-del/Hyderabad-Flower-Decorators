export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  event_type: string;
  event_date: string;
  preferred_time: string;
  venue_address: string;
  google_maps_link?: string;
  estimated_budget?: string;
  guest_count?: number;
  special_notes?: string;
  images?: string[];
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  full_name: string;
  phone: string;
  email: string;
  event_type: string;
  event_date: string;
  preferred_time: string;
  venue_address: string;
  google_maps_link?: string;
  estimated_budget?: string;
  guest_count?: number;
  special_notes?: string;
  images?: File[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image_url: string;
  featured: boolean;
  sort_order: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
  featured: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  review: string;
  event_type: string;
  avatar_url?: string;
  featured: boolean;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  logo_url?: string;
  brand_color: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  business_hours: Record<string, string>;
  hero_images: string[];
  social_links: Record<string, string>;
  updated_at: string;
}

export interface CalendarSlot {
  date: string;
  status: "available" | "few_slots" | "unavailable";
  bookings_count: number;
  blocked: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "editor";
}

export interface DashboardStats {
  upcoming_bookings: number;
  today_appointments: number;
  completed_bookings: number;
  cancelled_bookings: number;
  total_revenue: number;
  pending_bookings: number;
}
