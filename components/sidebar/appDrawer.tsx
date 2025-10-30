"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";
import { NavigationItemType } from "../types";

type AppDrawerProps = {
  trigger: React.ReactNode;
  sidebarOptions?: NavigationItemType[];
};
export default function AppDrawer({ trigger, sidebarOptions }: AppDrawerProps) {
  const pathname = usePathname();

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="min-h-[85dvh]">
        <DialogTitle className="mb-3"></DialogTitle>
        {sidebarOptions?.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className="relative"
            prefetch={true}
          >
            {pathname === item.href && (
              <span className="bg-primary w-1 h-full absolute left-0"></span>
            )}
            <Button
              variant={"ghost"}
              className={`w-full justify-start rounded-none ${
                path.basename(pathname) === path.basename(item.href)
                  ? "bg-accent text-accent-foreground"
                  : ""
              }`}
            >
              {item.icon && <item.icon />} {item.title}
            </Button>
          </Link>
        ))}
      </DrawerContent>
    </Drawer>
  );
}
