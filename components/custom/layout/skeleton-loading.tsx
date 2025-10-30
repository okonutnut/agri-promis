"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonLoadingProps = {
  className?: string;
};
export default function SkeletonLoading({ className }: SkeletonLoadingProps) {
  return (
    <span className={`flex flex-col space-y-3 ${cn(className)}`}>
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
    </span>
  );
}
