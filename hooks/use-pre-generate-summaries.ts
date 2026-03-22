"use client";

import { useEffect, useRef } from "react";

type ReportType = "post-travel" | "monitoring";

const CACHE_TTL_MS = 30 * 60 * 1000;

function readSummaryCache(cacheKey: string): string | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(cacheKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { summary: string; timestamp: number };
    if (!parsed?.summary || !parsed?.timestamp) return null;

    const isExpired = Date.now() - parsed.timestamp > CACHE_TTL_MS;
    if (isExpired) {
      window.sessionStorage.removeItem(cacheKey);
      return null;
    }

    return parsed.summary;
  } catch {
    return null;
  }
}

function writeSummaryCache(cacheKey: string, summary: string) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(
      cacheKey,
      JSON.stringify({
        summary,
        timestamp: Date.now(),
      }),
    );
  } catch {
    // Ignore cache write failures
  }
}

function getCacheKey(reportType: ReportType, reportId: string): string {
  return `report-summary:${reportType}:${reportId}`;
}

async function generateSummary(
  reportType: ReportType,
  reportId: string,
  reportData: Record<string, unknown>,
): Promise<string | null> {
  const cacheKey = getCacheKey(reportType, reportId);

  const cached = readSummaryCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch("/api/reports/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportType, reportData }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { summary?: string };
    const summary = (data?.summary || "").trim();

    if (summary && summary !== "Summary unavailable") {
      writeSummaryCache(cacheKey, summary);
      return summary;
    }

    return null;
  } catch {
    return null;
  }
}

type UsePreGenerateSummariesOptions = {
  reportType: ReportType;
  reports: Array<Record<string, unknown>> | undefined;
  enabled?: boolean;
};

export function usePreGenerateSummaries({
  reportType,
  reports,
  enabled = true,
}: UsePreGenerateSummariesOptions) {
  const isRunning = useRef(false);

  useEffect(() => {
    if (!enabled || !reports || reports.length === 0 || isRunning.current) {
      return;
    }

    isRunning.current = true;

    const preGenerate = async () => {
      for (const report of reports) {
        const reportId = report.id as string | undefined;
        if (!reportId) continue;

        const cacheKey = getCacheKey(reportType, reportId);
        const cached = readSummaryCache(cacheKey);
        if (cached) continue;

        await generateSummary(reportType, reportId, report);
      }
      isRunning.current = false;
    };

    void preGenerate();
  }, [reportType, reports, enabled]);
}
