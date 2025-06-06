"use client";

import { useEffect } from "react";

export function AdGoogle() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error:", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", width: 320, height: 100 }}
      data-ad-client="ca-pub-9711979023429716"
      data-ad-slot="1234567890"  // Ganti dengan Ad Slot ID Google AdSense kamu
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
