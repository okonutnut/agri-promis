import SkeletonLoading from "@/components/custom/layout/skeleton-loading";
import { Skeleton } from "@/components/ui/skeleton";

export default function FrameLoading() {
  return (
    <section className="w-screen h-screen flex flex-col relative text-sm overflow-hidden">
      {/* Skeleton for Navbar */}
      <Skeleton className="min-h-[45px] w-1/8" />

      <div className="flex flex-1 overflow-hidden">
        {/* Skeleton for Sidebar */}
        <span className="hidden sm:block">
          <SkeletonLoading />
        </span>

        {/* Skeleton for Content */}
        <div className="flex-1 w-full overflow-hidden">
          <div className="pl-4 pr-2 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto py-4">
              <SkeletonLoading />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
