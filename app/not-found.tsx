"use client";

import { SearchIcon } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

export default function NotFoundPage() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle className="text-2xl">404 - Not Found</EmptyTitle>
        <EmptyDescription>
          The page you&apos;re looking for doesn&apos;t exist. Try searching for
          what you need below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <form action="" className="sm:w-3/4">
          <InputGroup className="w-full">
            <InputGroupInput
              placeholder="Try searching for pages..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </form>
        <Link href={`/${searchTerm}`}>
          <Button variant="outline" size="sm">
            Goto
          </Button>
        </Link>
      </EmptyContent>
    </Empty>
  );
}
