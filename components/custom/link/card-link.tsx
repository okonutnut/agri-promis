import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Boxes } from "lucide-react";
import Link from "next/link";

type CardLinkProps = {
  href: string;
  children?: React.ReactNode;
  className?: string;
};
export default function CardLink({ href, children, className }: CardLinkProps) {
  return (
    <Link href={href}>
      <Card className="shadow-none transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
        <CardContent
          className={cn("flex items-center gap-2 text-sm", className)}
        >
          {children}
        </CardContent>
      </Card>
    </Link>
  );
}
