"use client";

import React, { useState, useEffect } from "react";
import { trackEvent } from "@/utils/analytics";

interface WaveButtonProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export default function WaveButton({
  href = "https://pay.wave.com/m/M_sn_2MOwdjUaQWQJ/c/sn/",
  className,
  children,
}: WaveButtonProps) {
  const [target, setTarget] = useState("_blank");

  useEffect(() => {
    // Detect mobile devices on client side to prevent hydration mismatches
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;

    if (isMobileDevice) {
      // Same-tab redirection on mobile is highly reliable, bypassing popup blocks
      // and preventing empty tab clutter on iOS Safari and Microsoft Edge.
      setTarget("_self");
    }
  }, []);

  const handleClick = () => {
    trackEvent("Donations", "click_wave_donate", "Soutien Wave Mobile Money");
  };

  return (
    <a
      href={href}
      target={target}
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

