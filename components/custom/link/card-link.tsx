"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

type CardLinkProps = {
  href: string;
  children?: React.ReactNode;
  className?: string;
};
export default function CardLink({ href, children, className }: CardLinkProps) {
  return (
    <Link href={href}>
      <Card
        className={cn(
          `shadow-none transition-transform duration-200 hover:-translate-y-1 hover:shadow-xs hover:bg-white/50 p-0 rounded-md`,
          className
        )}
      >
        {children}
      </Card>
    </Link>
  );
}
