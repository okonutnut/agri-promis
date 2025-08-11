import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import SkeletonLoading from "../layout/skeleton-loading";

type SummaryCardsProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  isLoading?: boolean;
};

export default function SummaryCard({
  title,
  description,
  icon: Icon,
  children,
  isLoading,
}: SummaryCardsProps) {
  return (
    <Card className="p-4 w-full md:w-[276px] relative rounded-md shadow-xs">
      <CardContent className="p-0 space-y-4">
        <CardTitle className="uppercase flex items-center gap-2">
          {Icon && (
            <span className="border border-primary p-1 rounded-md">
              <Icon className="w-5 h-5 text-primary" />
            </span>
          )}
          {title}
        </CardTitle>
        {isLoading ? (
          <SkeletonLoading />
        ) : (
          <>
            <CardDescription className="text-foreground-500 font-medium">
              {description}
            </CardDescription>
            {children}
          </>
        )}
      </CardContent>
    </Card>
  );
}
