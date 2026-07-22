"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Calendar, Image, Settings, LogOut, Menu, X, BookOpen, Moon, Sun } from "lucide-react";
import { onAuthStateChanged, signOut, setPersistence, browserLocalPersistence, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

// ─── ADMIN EMAIL WHITELIST ─────────────────────────────────────────
const ADMIN_EMAILS = [
  "info@hydflowerdecorators.com",
  "hydflowerdecorators@gmail.com",
  "nanid9404@gmail.com",
];

const SESSION_KEY = "hfd_admin_email";
const DARK_THEME_KEY = "hfd_admin_dark";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { href: "/admin/calendar", label: "Calendar", icon: Calendar },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const pathnameRef = useRef(pathname);
  const routerRef = useRef(router);
  pathnameRef.current = pathname;
  routerRef.current = router;

  // Load dark mode preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DARK_THEME_KEY);
      if (saved === "true") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      }
    } catch {}
  }, []);

  const toggleDarkMode = useCallback(() => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    try { localStorage.setItem(DARK_THEME_KEY, String(newMode)); } catch {}
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = useCallback(async () => {
    try { await signOut(auth); } catch {}
    sessionStorage.removeItem(SESSION_KEY);
    routerRef.current.push("/admin/login");
  }, []);

  // ─── Firebase Auth listener ─────────────────────────────────────
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(() => {});
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!mounted) return;
      setUser(firebaseUser);

      if (firebaseUser) {
        const email = firebaseUser.email?.toLowerCase() || "";
        const authorized = ADMIN_EMAILS.includes(email);
        setIsAuthorized(authorized);

        if (authorized) {
          try { sessionStorage.setItem(SESSION_KEY, email); } catch {}
          if (pathnameRef.current === "/admin/login" || pathnameRef.current === "/admin" || pathnameRef.current === "/admin/") {
            routerRef.current.replace("/admin/dashboard");
          }
        } else {
          try { sessionStorage.removeItem(SESSION_KEY); } catch {}
          signOut(auth).catch(() => {});
          if (pathnameRef.current !== "/admin/login") {
            routerRef.current.replace("/admin/login?error=unauthorized");
          }
        }
      } else {
        setIsAuthorized(false);
        try { sessionStorage.removeItem(SESSION_KEY); } catch {}
        if (pathnameRef.current !== "/admin/login") {
          routerRef.current.replace("/admin/login");
        }
      }

      setAuthChecked(true);
    });

    return () => { mounted = false; unsubscribe(); };
  }, []);

  // ─── Login page: no layout chrome ──────────────────────────────
  if (pathname === "/admin/login" || pathname === "/admin" || pathname === "/admin/") {
    if (authChecked && user && isAuthorized) return null;
    return <>{children}</>;
  }

  if (!authChecked) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-[#0F0F0F]" : "bg-ivory"} flex items-center justify-center`}>
        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAuthorized) return null;

  // Theme-aware colors
  const bgPrimary = darkMode ? "#0F0F0F" : "#FAF8F5";
  const bgCard = darkMode ? "#1A1A1A" : "#FFFFFF";
  const bgSidebar = darkMode ? "#141414" : "#FFFFFF";
  const bgInput = darkMode ? "#222222" : "#FAF8F5";
  const textPrimary = darkMode ? "#E8E2DA" : "#1A1A1A";
  const textSecondary = darkMode ? "#9B9490" : "#6B6560";
  const textMuted = darkMode ? "#6B6560" : "#9B9490";
  const borderColor = darkMode ? "#2A2A2A" : "#E8E2DA";
  const hoverBg = darkMode ? "#222222" : "#F0EBE3";
  const goldBg = darkMode ? "rgba(184,147,95,0.1)" : "rgba(184,147,95,0.05)";

  const userAvatar = user.photoURL;
  const userInitial = (user.displayName || user.email || "U")[0].toUpperCase();

  return (
    <div className={`min-h-screen flex`} style={{ background: bgPrimary }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:fixed lg:inset-y-0" style={{ background: bgSidebar, borderRight: `1px solid ${borderColor}` }}>
        <div className="flex items-center gap-2.5 px-5 h-14" style={{ borderBottom: `1px solid ${borderColor}` }}>
          <div className="w-7 h-7 border border-gold rounded-full flex items-center justify-center">
            <span className="text-gold text-[10px] font-serif font-semibold">H</span>
          </div>
          <span className="text-[11px] tracking-[0.2em] uppercase" style={{ color: textMuted }}>Admin</span>
          <button onClick={toggleDarkMode} className="ml-auto text-stone hover:text-gold transition-colors">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-body transition-colors",
                  pathname === item.href ? "text-gold" : "",
                )}
                style={{
                  color: pathname === item.href ? "#B8935F" : textSecondary,
                  background: pathname === item.href ? goldBg : "transparent",
                }}
              >
                <Icon className="w-4 h-4" />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4" style={{ borderTop: `1px solid ${borderColor}` }}>
          {/* User profile with Gmail icon */}
          <div className="flex items-center gap-2.5 px-3 py-2">
            {userAvatar ? (
              <img src={userAvatar} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-gold/30" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-gold font-heading font-bold text-xs ring-2 ring-gold/30">
                {userInitial}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] truncate" style={{ color: textPrimary }}>{user.displayName || "Admin"}</p>
              <p className="text-[10px] truncate" style={{ color: textMuted }}>{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] text-red-500 hover:bg-red-500/10 w-full font-body transition-colors mt-2">
            <LogOut className="w-4 h-4" />Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4" style={{ background: bgSidebar, borderBottom: `1px solid ${borderColor}` }}>
        <div className="flex items-center gap-2">
          {userAvatar ? (
            <img src={userAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold font-heading font-bold text-[10px]">{userInitial}</div>
          )}
          <span className="text-[11px] tracking-[0.2em] uppercase" style={{ color: textMuted }}>Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleDarkMode} className="text-stone hover:text-gold transition-colors">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: textSecondary }}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-charcoal/40" onClick={() => setSidebarOpen(false)}>
          <div className="absolute left-0 top-14 bottom-0 w-56" style={{ background: bgSidebar }} onClick={(e) => e.stopPropagation()}>
            <nav className="px-3 py-4 space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                    className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-body", pathname === item.href ? "text-gold" : "")}
                    style={{ color: pathname === item.href ? "#B8935F" : textSecondary, background: pathname === item.href ? goldBg : "transparent" }}
                  >
                    <Icon className="w-4 h-4" />{item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-3 py-4" style={{ borderTop: `1px solid ${borderColor}` }}>
              <div className="flex items-center gap-2.5 px-3 py-2">
                {userAvatar ? (
                  <img src={userAvatar} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-gold/30" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-gold font-heading font-bold text-xs">{userInitial}</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] truncate" style={{ color: textPrimary }}>{user.displayName || "Admin"}</p>
                  <p className="text-[10px] truncate" style={{ color: textMuted }}>{user.email}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] text-red-500 hover:bg-red-500/10 w-full font-body transition-colors mt-2">
                <LogOut className="w-4 h-4" />Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 lg:pl-56">
        <div className="pt-14 lg:pt-0">{children}</div>
      </main>
    </div>
  );
}
