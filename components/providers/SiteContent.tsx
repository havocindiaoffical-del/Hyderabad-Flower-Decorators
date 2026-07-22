"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SiteContent, defaultContent } from "@/lib/site-content-types";

interface SiteContentContextType {
  content: SiteContent;
  isLoaded: boolean;
}

const SiteContentContext = createContext<SiteContentContextType>({
  content: defaultContent,
  isLoaded: false,
});

export function useSiteContent() {
  return useContext(SiteContentContext);
}

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.content && typeof data.content === "object") {
          // Deep merge with defaults to ensure all fields exist
          const merged: SiteContent = { ...defaultContent, ...data.content };
          if (data.content.hero && typeof data.content.hero === "object") {
            merged.hero = { ...defaultContent.hero, ...data.content.hero };
          }
          setContent(merged);
        }
        setIsLoaded(true);
      })
      .catch(() => {
        // Fetch failed — use defaults (site still works)
        setIsLoaded(true);
      });
  }, []);

  return (
    <SiteContentContext.Provider value={{ content, isLoaded }}>
      {children}
    </SiteContentContext.Provider>
  );
}
