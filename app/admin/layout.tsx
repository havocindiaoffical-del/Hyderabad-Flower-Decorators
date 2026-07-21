"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Calendar, Image, Settings, LogOut, Menu, X, BookOpen } from "lucide-react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

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
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Fast auth check — Firebase caches auth state
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (!firebaseUser && !isLoginPage) router.push("/admin/login");
    });
    return () => unsubscribe();
  }, [router, isLoginPage]);

  const logout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  // Login page renders without the admin sidebar
  if (isLoginPage) return <>{children}</>;

  if (loading) return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-warm-gray font-body">Loading...</p>
      </div>
    </div>
  );
  if (!user) return null;

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:fixed lg:inset-y-0 bg-white border-r border-border-light">
        <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border-light">
          <div className="w-7 h-7 border border-gold rounded-full flex items-center justify-center">
            <span className="text-gold text-[10px] font-serif font-semibold">H</span>
          </div>
          <span className="text-[11px] tracking-[0.2em] uppercase text-stone font-body">Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-body transition-colors",
                  pathname === item.href
                    ? "text-gold bg-gold/5"
                    : "text-stone hover:text-charcoal hover:bg-cream"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-border-light">
          <div className="px-3 py-2 mb-2">
            <p className="text-[10px] text-warm-gray font-body truncate">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] text-red-500 hover:bg-red-50 w-full font-body transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-border-light h-14 flex items-center justify-between px-4">
        <span className="text-[11px] tracking-[0.2em] uppercase text-stone font-body">Admin</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-stone">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-charcoal/40" onClick={() => setSidebarOpen(false)}>
          <div className="absolute left-0 top-14 bottom-0 w-56 bg-white" onClick={(e) => e.stopPropagation()}>
            <nav className="px-3 py-4 space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-body",
                      pathname === item.href
                        ? "text-gold bg-gold/5"
                        : "text-stone hover:text-charcoal"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1 lg:pl-56">
        <div className="pt-14 lg:pt-0">{children}</div>
      </main>
    </div>
  );
}
