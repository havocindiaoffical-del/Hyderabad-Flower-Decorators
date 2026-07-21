"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch {
      setError("Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-12">
          <div className="w-10 h-10 border border-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gold text-sm font-serif">H</span>
          </div>
          <h1 className="text-xl font-heading text-charcoal">Admin Login</h1>
          <p className="mt-2 text-xs text-stone font-body">Hyderabad Flower Decorators</p>
        </div>
        <div className="bg-white border border-border-light rounded-2xl p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)]">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-body">{error}</div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
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
          Firebase Authentication · Secured
        </p>
      </motion.div>
    </div>
  );
}
