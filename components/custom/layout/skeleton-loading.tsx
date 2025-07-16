import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonLoading() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-5 w-1/4" />
      <Skeleton className="h-5 w-1/8" />
    </div>
  );
}
