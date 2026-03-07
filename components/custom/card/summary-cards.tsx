"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import SkeletonLoading from "../layout/skeleton-loading";

type SummaryCardsProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
};

export default function SummaryCard({
  title,
  description,
  icon: Icon,
  children,
  isLoading,
  className,
}: SummaryCardsProps) {
  return (
    <Card
      className={cn(
        "p-3 sm:p-4 h-auto sm:h-auto w-full relative rounded-md shadow-xs flex flex-col",
        className,
      )}
    >
      {isLoading ? (
        <SkeletonLoading />
      ) : (
        <CardContent className="p-0 space-y-2 sm:space-y-4 h-full flex flex-col">
          <CardTitle className="uppercase text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
            {Icon && (
              <span className="border border-primary p-0.5 sm:p-1 rounded-md shrink-0">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </span>
            )}
            <span className="truncate">{title}</span>
          </CardTitle>
          <CardDescription className="text-foreground-500 font-medium text-xs sm:text-sm line-clamp-2">
            {description}
          </CardDescription>
          <div className="mt-auto flex justify-start pt-2 sm:pt-0">
            {children}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
