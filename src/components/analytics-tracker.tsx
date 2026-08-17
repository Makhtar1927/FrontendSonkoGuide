"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView, trackEvent } from "@/utils/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Avoid double logging on initial mount in strict mode
    if (pathname) {
      trackPageView(pathname, typeof document !== "undefined" ? document.title : pathname);
    }
  }, [pathname]);

  useEffect(() => {
    // Global delegated click listener for analytics
    const handleGlobalClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement)?.closest("[data-analytics]");
      if (target) {
        const action = target.getAttribute("data-analytics-action") || "click";
        const category = target.getAttribute("data-analytics-category") || "interaction";
        const label = target.getAttribute("data-analytics-label") || target.textContent?.trim() || "";
        trackEvent(category, action, label);
      }
    };

    window.addEventListener("click", handleGlobalClick, { passive: true });
    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  return null;
}
