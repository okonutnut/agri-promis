"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useModal } from "@/components/custom/layout/custom-page-layout";

type ReportType = "post-travel" | "monitoring";

type ViewSummaryButtonProps = {
  reportId?: string;
  reportType: ReportType;
  buttonLabel?: string;
  title?: string;
  className?: string;
  iconOnly?: boolean;
  buttonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
};

type SummarizeResponse = {
  summary?: string;
  error?: string;
};

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getCacheKey(reportType: ReportType, reportId: string) {
  return `report-summary:${reportType}:${reportId}`;
}

function readSummaryCache(
  reportType: ReportType,
  reportId: string,
): string | null {
  if (typeof window === "undefined") return null;

  try {
    const key = getCacheKey(reportType, reportId);
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { summary: string; timestamp: number };
    if (!parsed?.summary || !parsed?.timestamp) return null;

    const isExpired = Date.now() - parsed.timestamp > CACHE_TTL_MS;
    if (isExpired) {
      window.sessionStorage.removeItem(key);
      return null;
    }

    return parsed.summary;
  } catch {
    return null;
  }
}

function writeSummaryCache(
  reportType: ReportType,
  reportId: string,
  summary: string,
) {
  if (typeof window === "undefined") return;

  try {
    const key = getCacheKey(reportType, reportId);
    window.sessionStorage.setItem(
      key,
      JSON.stringify({
        summary,
        timestamp: Date.now(),
      }),
    );
  } catch {
    // Ignore cache write failures
  }
}

export default function ViewSummaryButton({
  reportId,
  reportType,
  buttonLabel = "View Summary",
  className,
  iconOnly = false,
  buttonVariant = "outline",
}: ViewSummaryButtonProps) {
  const { openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string>("");

  const modalTitle = "Report Summary";

  const getModalBody = (
    text: string,
    loading: boolean,
    attemptedFetch: boolean,
  ) => (
    <div className="rounded-md border bg-muted/30 p-4 text-sm leading-relaxed min-h-24">
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Summarizing report...
        </div>
      ) : text ? (
        text
      ) : attemptedFetch ? (
        "Summary is currently unavailable. Please try again."
      ) : (
        "Click View Summary to generate a short report context."
      )}
    </div>
  );

  const fetchSummary = async () => {
    if (!reportId) {
      toast.error("Cannot summarize this report because report ID is missing.");
      setSummary("Summary is currently unavailable. Please try again.");
      openModal(
        modalTitle,
        "",
        getModalBody(
          "Summary is currently unavailable. Please try again.",
          false,
          true,
        ),
      );
      return;
    }

    const cached = readSummaryCache(reportType, reportId);
    if (cached) {
      setSummary(cached);
      openModal(modalTitle, "", getModalBody(cached, false, true));
      return;
    }

    setIsLoading(true);
    openModal(modalTitle, "", getModalBody("", true, true));

    try {
      const response = await fetch("/api/reports/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType,
          reportId,
        }),
      });

      const data = (await response.json()) as SummarizeResponse;

      if (!response.ok) {
        throw new Error(data?.error || "Failed to generate summary.");
      }

      const text = (data?.summary || "").trim();
      if (!text) {
        throw new Error("Summary is empty.");
      }

      setSummary(text);
      writeSummaryCache(reportType, reportId, text);
      openModal(modalTitle, "", getModalBody(text, false, true));
    } catch (error: unknown) {
      console.error("view-summary-button error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to generate summary. Please try again.";
      toast.error(message);
      const fallback = "Summary is currently unavailable. Please try again.";
      setSummary(fallback);
      openModal(modalTitle, "", getModalBody(fallback, false, true));
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    closeModal();
    if (summary) {
      openModal(modalTitle, "", getModalBody(summary, false, true));
      return;
    }
    void fetchSummary();
  };

  return (
    <Button
      type="button"
      size="sm"
      variant={buttonVariant}
      className={className}
      onClick={handleButtonClick}
      disabled={isLoading}
      aria-label={buttonLabel}
      title={buttonLabel}
    >
      <Sparkles className={iconOnly ? "h-4 w-4" : "mr-2 h-4 w-4"} />
      {!iconOnly ? buttonLabel : null}
    </Button>
  );
}
