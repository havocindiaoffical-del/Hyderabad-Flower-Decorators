import {
  pgTable,
  integer,
  text,
  varchar,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// ─── Bookings ──────────────────────────────────────────────────────

export const bookings = pgTable("bookings", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  ticketId: varchar("ticket_id", { length: 20 }).notNull().unique(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 300 }).notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  eventDate: varchar("event_date", { length: 20 }).notNull(),
  preferredTime: varchar("preferred_time", { length: 20 }).notNull(),
  venueAddress: text("venue_address").notNull(),
  googleMapsLink: varchar("google_maps_link", { length: 500 }),
  estimatedBudget: varchar("estimated_budget", { length: 100 }),
  guestCount: varchar("guest_count", { length: 50 }),
  specialNotes: text("special_notes"),
  images: jsonb("images").$type<string[]>().default([]),
  imageShareUrls: jsonb("image_share_urls").$type<string[]>().default([]),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  previousStatus: varchar("previous_status", { length: 20 }),
  userUid: varchar("user_uid", { length: 200 }),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Gallery Images ────────────────────────────────────────────────

export const galleryImages = pgTable("gallery_images", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  url: text("url").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Calendar Blocks ───────────────────────────────────────────────

export const calendarBlocks = pgTable("calendar_blocks", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  date: varchar("date", { length: 20 }).notNull().unique(),
  blocked: boolean("blocked").notNull().default(true),
  reason: varchar("reason", { length: 300 }).default(""),
});

// ─── Business Settings ─────────────────────────────────────────────

export const businessSettings = pgTable("business_settings", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  businessName: varchar("business_name", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 300 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 20 }).notNull(),
  address: text("address").notNull(),
  brandColor: varchar("brand_color", { length: 20 }).default("#B8935F"),
  businessHours: jsonb("business_hours").$type<Record<string, string>>().default({}),
  socialLinks: jsonb("social_links").$type<Record<string, string>>().default({}),
  brevoApiKey: varchar("brevo_api_key", { length: 100 }),
  brevoSenderEmail: varchar("brevo_sender_email", { length: 300 }),
  siteContent: jsonb("site_content").$type<Record<string, unknown>>().default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
