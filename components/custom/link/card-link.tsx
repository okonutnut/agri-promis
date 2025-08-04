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
          `shadow-none transition-transform duration-200 hover:-translate-y-1 hover:shadow-xs p-0`,
          className
        )}
      >
        {children}
      </Card>
    </Link>
  );
}
