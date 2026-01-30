"use client";

import { Analytics, getAnalytics } from "firebase/analytics";
import { app } from "./firebase";

let analytics: Analytics;  

export function getAnalyticsInstance() {
  if (typeof window !== 'undefined' && !analytics) {
    analytics = getAnalytics(app);
  }
  return analytics;
}
