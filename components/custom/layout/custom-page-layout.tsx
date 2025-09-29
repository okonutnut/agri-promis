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
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import SkeletonLoading from "./skeleton-loading";
import CustomNavbar from "../navbar/custom-navbar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { useSelectUserProfileHook } from "@/app/hooks/UserProfileHook";
import { UpdateUserCurrentLocationAction } from "@/app/actions/UserSessionAction";
import { createClient } from "@/utils/supabase/client";

// -------------------- Context Types --------------------
interface SheetContextType {
  isOpen: boolean;
  title: string;
  content: ReactNode;
  footerRenderer: (() => ReactNode) | null;

  openSheet: (
    title: string,
    content: ReactNode,
    footer?: () => ReactNode
  ) => void;
  closeSheet: () => void;

  setFooter: (renderer: () => ReactNode) => void;
  clearFooter: () => void;
}

interface ModalContextType {
  isOpen: boolean;
  title: string;
  description: string;
  content: ReactNode | null;
  openModal: (title: string, description: string, content: ReactNode) => void;
  closeModal: () => void;
}

// -------------------- Contexts --------------------
const SheetContext = createContext<SheetContextType | undefined>(undefined);
const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useSheet = () => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet must be used within a CustomPageLayout");
  }
  return context;
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a CustomPageLayout");
  }
  return context;
};

// convenience hooks
export const useOpenSheet = () => useSheet().openSheet;
export const useCloseSheet = () => useSheet().closeSheet;

// -------------------- Footer Slot --------------------
export function SheetFooterSlot({ children }: { children: ReactNode }) {
  const { setFooter, clearFooter } = useSheet();

  useEffect(() => {
    setFooter(() => children);
    return () => clearFooter();
  }, [setFooter, clearFooter]);

  return null;
}

// -------------------- Layout Props --------------------
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

// -------------------- Main Layout --------------------
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
  // Ping server every 10 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      await UpdateUserCurrentLocationAction();
    }, 600000);
    return () => clearInterval(interval);
  }, []);

  // -------------------- Sheet State --------------------
  const [sheetState, setSheetState] = useState({
    isOpen: false,
    title: "",
    content: null as ReactNode,
  });

  const [footerRenderer, setFooterRenderer] = useState<
    (() => ReactNode) | null
  >(null);

  const setFooter = useCallback((renderer: () => ReactNode) => {
    setFooterRenderer(() => renderer);
  }, []);

  const clearFooter = useCallback(() => {
    setFooterRenderer(null);
  }, []);

  const openSheet = (
    title: string,
    content: ReactNode,
    footer?: () => ReactNode
  ) => {
    setFooterRenderer(footer ?? null);
    setSheetState({
      isOpen: true,
      title,
      content,
    });
  };

  const closeSheet = () => {
    setFooterRenderer(null);
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
    footerRenderer,
    setFooter,
    clearFooter,
  };

  // -------------------- Modal State --------------------
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    content: ReactNode | null;
  }>({
    isOpen: false,
    title: "",
    description: "",
    content: null,
  });

  const openModal = useCallback(
    (title: string, description: string, content: ReactNode) => {
      setModalState({ isOpen: true, title, description, content });
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalState({ isOpen: false, title: "", description: "", content: null });
  }, []);

  const modalContextValue: ModalContextType = {
    isOpen: modalState.isOpen,
    title: modalState.title,
    description: modalState.description,
    content: modalState.content,
    openModal,
    closeModal,
  };

  // -------------------- Session Management --------------------
  const supabase = createClient();
  const { data } = useSelectUserProfileHook();
  useEffect(() => {
    if (data?.active_status === 0) {
      toast.error("Your account is inactive. Please contact support.");
      async function signOutInactiveUser() {
        console.log("Signing out inactive user...");
        await supabase.auth.signOut();
        window.location.href = "/login";
      }
      signOutInactiveUser();
    }
  }, [data]);

  // -------------------- Render --------------------
  return (
    <SheetContext.Provider value={sheetContextValue}>
      <ModalContext.Provider value={modalContextValue}>
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
              <div
                className={cn(
                  "pl-4 pr-2 h-full flex flex-col overflow-y-scroll",
                  className
                )}
              >
                <div className="flex-1 py-4">
                  <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl font-medium">{pageTitle}</h1>
                    {(!isLoading || error) && topRightComponent}
                  </div>
                  {isLoading || error ? (
                    <SkeletonLoading />
                  ) : (
                    <Suspense fallback={<SkeletonLoading />}>
                      {children}
                    </Suspense>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Global Sheet */}
          <Sheet open={sheetState.isOpen} onOpenChange={closeSheet}>
            <SheetContent className="md:min-w-[600px] w-screen flex flex-col gap-0 h-full">
              <SheetHeader className="border-b p-2">
                <SheetTitle className="uppercase text-primary">
                  {sheetState.title}
                </SheetTitle>
              </SheetHeader>
              {sheetState.content}
            </SheetContent>
          </Sheet>

          {/* Modal */}
          <AlertDialog
            open={modalState.isOpen}
            onOpenChange={(open) => !open && closeModal()}
          >
            <AlertDialogContent className="p-0 gap-1">
              <AlertDialogHeader className="border-b p-2 flex flex-row justify-between items-start">
                <div>
                  <AlertDialogTitle>{modalState.title}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {modalState.description}
                  </AlertDialogDescription>
                </div>
                <AlertDialogCancel asChild>
                  <Button
                    variant="ghost"
                    className="h-7 w-7 border-0 shadow-none"
                  >
                    <X />
                  </Button>
                </AlertDialogCancel>
              </AlertDialogHeader>
              <div className="p-1">{modalState.content}</div>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </ModalContext.Provider>
    </SheetContext.Provider>
  );
}
