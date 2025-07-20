import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { getProgramNavItems, getProjectNavItems } from "./navitems";
import path from "path";
import { NavigationItemType } from "../types";

type AppDrawerProps = {
  trigger: React.ReactNode;
  options?: NavigationItemType[];
};
export default function AppDrawer({ trigger, options }: AppDrawerProps) {
  const { programID, projectID } = useParams();
  const pathname = usePathname();

  const navItems = programID
    ? getProgramNavItems(programID as string)
    : getProjectNavItems(projectID as string);

  const values = options || navItems;

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="min-h-[85dvh]">
        <DialogTitle className="mb-3"></DialogTitle>
        {values.map((item) => (
          <Link href={item.href} key={item.href} className="relative">
            {pathname === item.href && (
              <span className="bg-primary w-0.5 h-full absolute left-0"></span>
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
