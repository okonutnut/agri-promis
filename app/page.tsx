"use client";

import LoadingPage from "@/components/custom/layout/loading-page";
import { useEffect } from "react";

function RootPage() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("Service Worker registered:", reg))
        .catch((err) =>
          console.error("Service Worker registration failed:", err)
        );
    }
  }, []);

  return <LoadingPage />;
}

export default RootPage;
