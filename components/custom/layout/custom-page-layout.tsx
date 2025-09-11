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
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { div } from "@tensorflow/tfjs";

// Sheet Context
interface SheetContextType {
  isOpen: boolean;
  title: string;
  content: ReactNode;
  tabs: { label: string; value: string; content: ReactNode }[];
  activeTab: string;
  footer: ReactNode | null;

  openSheet: (title: string, content: ReactNode) => void;
  openSheetWithTabs: (
    title: string,
    tabs: { label: string; value: string; content: ReactNode }[],
    defaultTab?: string
  ) => void;
  closeSheet: () => void;
  setActiveTab: (tab: string) => void;

  setFooter: (node: ReactNode) => void;
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
export const useOpenSheetWithTabs = () => useSheet().openSheetWithTabs;
export const useCloseSheet = () => useSheet().closeSheet;
export const useActiveSheetTab = () => {
  const { activeTab, setActiveTab } = useSheet();
  return { activeTab, setActiveTab };
};

// Slot component for nested usage
export function SheetFooterSlot({ children }: { children: ReactNode }) {
  const { setFooter, clearFooter } = useSheet();

  useEffect(() => {
    setFooter(children);
    return () => clearFooter();
  }, [children, setFooter, clearFooter]);

  return null;
}

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
  useEffect(() => {
    const interval = setInterval(async () => {
      await UpdateUserCurrentLocationAction();
    }, 600000);
    return () => clearInterval(interval);
  }, []);

  // Sheet state management
  const [sheetState, setSheetState] = useState({
    isOpen: false,
    title: "",
    content: null as ReactNode,
    tabs: [] as { label: string; value: string; content: ReactNode }[],
    activeTab: "",
    footerNode: null as ReactNode | null,
  });

  const openSheet = (title: string, content: ReactNode, footer?: ReactNode) => {
    setSheetState({
      isOpen: true,
      title,
      content,
      tabs: [],
      activeTab: "",
      footerNode: footer ?? null,
    });
  };

  const openSheetWithTabs = (
    title: string,
    tabs: { label: string; value: string; content: ReactNode }[],
    defaultTab?: string,
    footer?: ReactNode
  ) => {
    setSheetState({
      isOpen: true,
      title,
      content: null,
      tabs,
      activeTab: defaultTab || (tabs[0]?.value ?? ""),
      footerNode: footer ?? null,
    });
  };

  const closeSheet = () => {
    setSheetState({
      isOpen: false,
      title: "",
      content: null,
      tabs: [],
      activeTab: "",
      footerNode: null,
    });
  };

  const setActiveTab = (tab: string) => {
    setSheetState((prev) => ({ ...prev, activeTab: tab }));
  };

  const [footer, setFooterState] = useState<ReactNode>(null);

  const setFooter = useCallback((node: ReactNode) => {
    setFooterState(node);
  }, []);

  const clearFooter = useCallback(() => {
    setFooterState(null);
  }, []);

  const sheetContextValue: SheetContextType = {
    isOpen: sheetState.isOpen,
    title: sheetState.title,
    content: sheetState.content,
    tabs: sheetState.tabs,
    activeTab: sheetState.activeTab,
    openSheet,
    openSheetWithTabs,
    closeSheet,
    setActiveTab,
    footer,
    setFooter,
    clearFooter,
  };

  // Modal state management
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

  // USER SESSION MANAGEMENT
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
              <div className={cn("pl-4 pr-2 h-full flex flex-col", className)}>
                <div className="flex-1 overflow-y-auto py-4">
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
              <>
                {sheetState.tabs.length > 0 ? (
                  <Tabs
                    value={sheetState.activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="w-full flex border-b bg-transparent rounded-none p-0 mt-2">
                      {sheetState.tabs.map((tab) => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className={cn(
                            "px-4 py-2 text-base transition-colors rounded-none",
                            "data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:shadow-none",
                            "border-b-2 border-transparent text-muted-foreground"
                          )}
                        >
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {sheetState.tabs.map((tab) => (
                      <TabsContent
                        key={tab.value}
                        value={tab.value}
                        className="flex-1 overflow-y-auto relative"
                      >
                        {tab.content}
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  <div className="flex-1 overflow-y-auto relative">
                    {sheetState.content}
                  </div>
                )}
              </>
              <SheetFooter className="border-t p-2 flex flex-row justify-end gap-2">
                <SheetClose asChild>
                  <Button variant={"outline"} size={"sm"}>
                    Close
                  </Button>
                </SheetClose>
                {footer}
              </SheetFooter>
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
                    size="sm"
                    className="h-6 w-6 border-0 shadow-none"
                  >
                    <X />
                  </Button>
                </AlertDialogCancel>
              </AlertDialogHeader>
              <div className="relative p-2">{modalState.content}</div>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </ModalContext.Provider>
    </SheetContext.Provider>
  );
}
