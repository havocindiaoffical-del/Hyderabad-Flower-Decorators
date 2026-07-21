"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  setPersistence,
  browserLocalPersistence,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface UserAuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  userName: string;
  userPhone: string;
  userEmail: string;
}

const UserAuthContext = createContext<UserAuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  userName: "",
  userPhone: "",
  userEmail: "",
});

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure Firebase Auth persists across page loads
    setPersistence(auth, browserLocalPersistence).catch(() => {});

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, googleProvider);
    } catch {
      // User closed popup or error
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignore
    }
  };

  const userName = user?.displayName || "";
  const userPhone = user?.phoneNumber || "";
  const userEmail = user?.email || "";

  return (
    <UserAuthContext.Provider
      value={{ user, loading, signInWithGoogle, logout, userName, userPhone, userEmail }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export const useUserAuth = () => useContext(UserAuthContext);
