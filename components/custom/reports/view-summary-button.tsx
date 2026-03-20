"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

type ReportType = "post-travel" | "monitoring";

type ViewSummaryButtonProps = {
  reportId?: string;
  reportData?: Record<string, unknown>;
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

function writeSummaryCache(
  reportType: ReportType,
  cacheKey: string,
  summary: string,
) {
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

export default function ViewSummaryButton({
  reportId,
  reportData,
  reportType,
  buttonLabel = "View Summary",
  className,
  iconOnly = false,
  buttonVariant = "outline",
}: ViewSummaryButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string>("");

  const getCacheKey = () => {
    if (reportData) {
      return `report-summary:${reportType}:${JSON.stringify(reportData).slice(0, 50)}`;
    }
    if (reportId) {
      return `report-summary:${reportType}:${reportId}`;
    }
    return null;
  };

  const getTooltipContent = (isLoading: boolean, text: string) => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <Loader2 className="h-3 w-3 animate-spin" />
          Summarizing...
        </div>
      );
    }
    if (text) {
      return text;
    }
    return "Click to generate summary";
  };

  const fetchSummary = async () => {
    const cacheKey = getCacheKey();
    if (!cacheKey) {
      toast.error("Cannot summarize: missing report data.");
      return;
    }

    const cached = readSummaryCache(cacheKey);
    if (cached) {
      setSummary(cached);
      return;
    }

    setIsLoading(true);

    try {
      const payload: Record<string, unknown> = { reportType };
      if (reportData) {
        payload.reportData = reportData;
      } else if (reportId) {
        payload.reportId = reportId;
      }

      const response = await fetch("/api/reports/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
      writeSummaryCache(reportType, cacheKey, text);
    } catch (error: unknown) {
      console.error("view-summary-button error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to generate summary. Please try again.";
      toast.error(message);
      setSummary("Summary unavailable");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!summary) {
      void fetchSummary();
    }
  };

  const tooltipContent = getTooltipContent(isLoading, summary);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant={buttonVariant}
          className={className}
          onClick={handleClick}
          disabled={isLoading}
          aria-label={buttonLabel}
        >
          <Sparkles className={iconOnly ? "h-4 w-4" : "mr-2 h-4 w-4"} />
          {!iconOnly ? buttonLabel : null}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-sm" side="right">
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
}