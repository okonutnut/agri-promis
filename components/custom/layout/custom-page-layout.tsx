"use client";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AppSidebar } from "@/components/sidebar/appSidebar";
import { NavigationItemType } from "@/components/types";
import {
  Suspense,
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import SkeletonLoading from "./skeleton-loading";
import CustomNavbar from "../navbar/custom-navbar";
import { useUpdateUserCurrentLocationHook } from "@/components/hooks";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Sheet Context
interface SheetContextType {
  isOpen: boolean;
  title: string;
  content: ReactNode;
  openSheet: (title: string, content: ReactNode) => void;
  closeSheet: () => void;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export const useSheet = () => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet must be used within a CustomPageLayout");
  }
  return context;
};

type CustomPageLayoutProps = {
  children?: React.ReactNode;
  className?: string;
  pageTitle?: string;
  isLoading?: boolean;
  error?: Error | null;
  noSidebar?: boolean;
  navItems?: NavigationItemType[];
  topRightComponent?: React.ReactNode;
  role?: "admin" | "user";
};

export default function CustomPageLayout({
  children,
  className,
  pageTitle,
  isLoading,
  error,
  noSidebar,
  navItems,
  topRightComponent,
  role,
}: CustomPageLayoutProps) {
  useUpdateUserCurrentLocationHook();

  // Sheet state management
  const [sheetState, setSheetState] = useState({
    isOpen: false,
    title: "",
    content: null as ReactNode,
  });

  const openSheet = (title: string, content: ReactNode) => {
    setSheetState({
      isOpen: true,
      title,
      content,
    });
  };

  const closeSheet = () => {
    setSheetState({
      isOpen: false,
      title: "",
      content: null,
    });
  };

  const sheetContextValue: SheetContextType = {
    isOpen: sheetState.isOpen,
    title: sheetState.title,
    content: sheetState.content,
    openSheet,
    closeSheet,
  };

  return (
    <SheetContext.Provider value={sheetContextValue}>
      <section className="w-full h-screen flex flex-col relative text-sm overflow-hidden">
        {error &&
          toast.error(
            `Error: ${error.message || "An unexpected error occurred"}`
          )}
        <CustomNavbar
          navItems={navItems || []}
          noSidebar={noSidebar}
          pageTitle={pageTitle}
          role={role || "admin"}
        />
        <div className="flex flex-1 overflow-hidden">
          {!noSidebar && <AppSidebar navItems={navItems || []} />}
          <div className="flex-1 w-full overflow-hidden">
            <div className={cn("pl-4 pr-2 h-full flex flex-col", className)}>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-medium">{pageTitle}</h1>
                  {(!isLoading || error) && topRightComponent}
                </div>
                {isLoading || error ? (
                  <SkeletonLoading />
                ) : (
                  <Suspense fallback={<SkeletonLoading />}>{children}</Suspense>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Global Sheet */}
        <Sheet open={sheetState.isOpen} onOpenChange={closeSheet}>
          <SheetContent className="md:min-w-[600px] w-screen">
            <SheetHeader className="border-b p-2">
              <SheetTitle className="uppercase text-primary">
                {sheetState.title}
              </SheetTitle>
            </SheetHeader>
            {sheetState.content}
          </SheetContent>
        </Sheet>
      </section>
    </SheetContext.Provider>
  );
}
