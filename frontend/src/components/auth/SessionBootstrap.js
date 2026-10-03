"use client";

import { useEffect } from "react";
import { getAccessToken } from "@/lib/auth/session";

// Runs once inside the authenticated app layout. Right after the Google
// OAuth redirect there is no access token in memory yet, so this exchanges
// the freshly-set refresh cookie for one. Fails silently when logged out.
export default function SessionBootstrap() {
  useEffect(() => {
    getAccessToken().catch(() => {});
  }, []);

  return null;
}
