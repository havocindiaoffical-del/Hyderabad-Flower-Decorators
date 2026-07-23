"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { signInWithEmailAndPassword, signInWithPopup, setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

// ─── ADMIN EMAIL WHITELIST (must match layout) ────────────────────
const ADMIN_EMAILS = [
  "info@hydflowerdecorators.com",
  "hydflowerdecorators@gmail.com",
  "nanid9404@gmail.com",
  "Jaswanthkaioken@gmail.com",
];

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "unauthorized") {
      setError("Access denied. This account is not authorized for admin access.");
    }
  }, [searchParams]);

  // ─── Auto-redirect: if admin is already logged in, go to dashboard ──
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email?.toLowerCase() || "";
        if (ADMIN_EMAILS.includes(email)) {
          router.replace("/admin/dashboard");
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Ensure persistence is set before signing in
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const loggedInEmail = result.user.email?.toLowerCase() || "";
      if (!ADMIN_EMAILS.includes(loggedInEmail)) {
        await auth.signOut();
        setError("Access denied. This account is not authorized for admin access.");
        return;
      }
      // Use replace to avoid back-button loops; short delay for layout to pick up auth state
      setTimeout(() => router.replace("/admin/dashboard"), 200);
    } catch {
      setError("Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      const loggedInEmail = result.user.email?.toLowerCase() || "";
      if (!ADMIN_EMAILS.includes(loggedInEmail)) {
        await auth.signOut();
        setError("Access denied. This Google account is not authorized for admin access.");
        return;
      }
      setTimeout(() => router.replace("/admin/dashboard"), 200);
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-[fadeIn_0.4s_ease]">
        <div className="text-center mb-12">
          <div className="w-10 h-10 border border-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gold text-sm font-serif">H</span>
          </div>
          <h1 className="text-xl font-heading text-charcoal">Admin Login</h1>
          <p className="mt-2 text-xs text-stone font-body">Hyderabad Flower Decorators</p>
        </div>
        <div className="bg-white border border-border-light rounded-2xl p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)]">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="text-red-600 text-xs font-body">{error}</span>
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-border-light text-charcoal h-12 rounded-xl label-uppercase hover:bg-cream transition-colors disabled:opacity-50 mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border-light" />
            <span className="text-xs text-warm-gray font-body">or</span>
            <div className="flex-1 h-px bg-border-light" />
          </div>

          {/* Email/Password Login */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label className="block label-uppercase text-stone mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex h-12 w-full rounded-xl border border-border-light bg-ivory pl-10 pr-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-gold font-body"
                  placeholder="admin@hydflowerdecorators.com"
                />
              </div>
            </div>
            <div>
              <label className="block label-uppercase text-stone mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex h-12 w-full rounded-xl border border-border-light bg-ivory pl-10 pr-10 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-gold font-body"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-charcoal"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-charcoal text-ivory h-12 rounded-full label-uppercase hover:bg-graphite transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-warm-gray font-body">
          Authorized admin access only
        </p>
      </div>
    </div>
  );
}
