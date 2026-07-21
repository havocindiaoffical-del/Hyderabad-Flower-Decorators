import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// ─── Bookings ──────────────────────────────────────────────────────

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
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
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  userUid: varchar("user_uid", { length: 200 }),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Gallery Images ────────────────────────────────────────────────

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Calendar Blocks ───────────────────────────────────────────────

export const calendarBlocks = pgTable("calendar_blocks", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 20 }).notNull().unique(),
  blocked: boolean("blocked").notNull().default(true),
  reason: varchar("reason", { length: 300 }).default(""),
});

// ─── Business Settings ─────────────────────────────────────────────

export const businessSettings = pgTable("business_settings", {
  id: serial("id").primaryKey(),
  businessName: varchar("business_name", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 300 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 20 }).notNull(),
  address: text("address").notNull(),
  brandColor: varchar("brand_color", { length: 20 }).default("#B8935F"),
  businessHours: jsonb("business_hours").$type<Record<string, string>>().default({}),
  socialLinks: jsonb("social_links").$type<Record<string, string>>().default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
