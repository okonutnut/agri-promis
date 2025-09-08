"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  PropsWithChildren,
  Suspense,
} from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import CustomNavbar from "../navbar/custom-navbar";
import SkeletonLoading from "./skeleton-loading";
import { useUpdateUserCurrentLocationHook } from "@/components/hooks";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/sidebar/appSidebar";
import { UpdateUserCurrentLocationAction } from "@/app/actions/UserSessionAction";

// Define types
interface Tab {
  label: string;
  value: string;
  content: ReactNode;
}

interface SheetContextType {
  isOpen: boolean;
  title: string;
  content: ReactNode | null;
  tabs: Tab[];
  activeTab: string;
  footer: ReactNode | null;
  openSheet: (title: string, content: ReactNode, footer?: ReactNode) => void;
  openSheetWithTabs: (
    title: string,
    tabs: Tab[],
    defaultTab?: string,
    footer?: ReactNode
  ) => void;
  closeSheet: () => void;
  setActiveTab: (tab: string) => void;
  setFooter: (node: ReactNode | null) => void;
}

interface ModalContextType {
  isOpen: boolean;
  title: string;
  description: string;
  content: ReactNode | null;
  triggerNode: ReactNode | null;
  openModal: (
    title: string,
    description: string,
    content: ReactNode,
    trigger?: ReactNode
  ) => void;
  closeModal: () => void;
  setTrigger: (node: ReactNode | null) => void;
  clearTrigger: () => void;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);
const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useSheet = () => {
  const context = useContext(SheetContext);
  if (!context)
    throw new Error("useSheet must be used within CustomPageLayout");
  return context;
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("useModal must be used within CustomPageLayout");
  return context;
};

// Slot component for nested usage
export function SheetFooterSlot({ children }: { children: ReactNode }) {
  const { setFooter } = useSheet();
  const childRef = useRef<ReactNode>(children);

  useEffect(() => {
    childRef.current = children;
    setFooter(childRef.current);
    return () => setFooter(null);
  }, [setFooter]);

  return null;
}

export function ModalTriggerSlot({ children }: { children: ReactNode }) {
  const { setTrigger, clearTrigger } = useModal();
  const childRef = useRef<ReactNode>(children);

  useEffect(() => {
    childRef.current = children;
    setTrigger(childRef.current);
    return () => clearTrigger();
  }, [setTrigger, clearTrigger]);

  return null;
}

type CustomPageLayoutProps = PropsWithChildren<{
  className?: string;
  pageTitle?: string;
  isLoading?: boolean;
  error?: Error | null;
  noSidebar?: boolean;
  navItems?: any[];
  topRightComponent?: ReactNode;
  role?: "admin" | "user";
}>;

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
  // Hook to update user location
  useEffect(() => {
    const interval = setInterval(async () => {
      console.log("User location updated");
      await UpdateUserCurrentLocationAction();
    }, 600000); // 10 minutes in milliseconds

    return () => clearInterval(interval);
  }, []);

  // Internal sheet state not tied to rendering
  const sheetRef = useRef<{
    title: string;
    content: ReactNode | null;
    tabs: Tab[];
  }>({
    title: "",
    content: null,
    tabs: [],
  });

  // UI-controlling states
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const [footer, setFooterState] = useState<ReactNode | null>(null);

  const openSheet = useCallback(
    (title: string, content: ReactNode, footerNode?: ReactNode) => {
      sheetRef.current = { title, content, tabs: [] };
      setIsSheetOpen(true);
      setFooterState(footerNode ?? null);
    },
    []
  );

  const openSheetWithTabs = useCallback(
    (
      title: string,
      tabs: Tab[],
      defaultTab?: string,
      footerNode?: ReactNode
    ) => {
      sheetRef.current = { title, content: null, tabs };
      setIsSheetOpen(true);
      setActiveTab(defaultTab ?? tabs[0]?.value ?? "");
      setFooterState(footerNode ?? null);
    },
    []
  );

  const closeSheet = useCallback(() => {
    setIsSheetOpen(false);
    setFooterState(null);
  }, []);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    content: ReactNode | null;
    triggerNode: ReactNode | null;
  }>({
    isOpen: false,
    title: "",
    description: "",
    content: null,
    triggerNode: null,
  });

  const openModal = useCallback(
    (
      title: string,
      description: string,
      content: ReactNode,
      trigger?: ReactNode
    ) => {
      setModalState({
        isOpen: true,
        title,
        description,
        content,
        triggerNode: trigger ?? null,
      });
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      title: "",
      description: "",
      content: null,
      triggerNode: null,
    });
  }, []);

  const setTrigger = useCallback((node: ReactNode | null) => {
    setModalState((prev) => ({ ...prev, triggerNode: node }));
  }, []);

  const clearTrigger = useCallback(() => {
    setModalState((prev) => ({ ...prev, triggerNode: null }));
  }, []);

  const sheetContextValue: SheetContextType = {
    isOpen: isSheetOpen,
    title: sheetRef.current.title,
    content: sheetRef.current.content,
    tabs: sheetRef.current.tabs,
    activeTab,
    footer,
    openSheet,
    openSheetWithTabs,
    closeSheet,
    setActiveTab,
    setFooter: setFooterState,
  };

  const modalContextValue: ModalContextType = {
    isOpen: modalState.isOpen,
    title: modalState.title,
    description: modalState.description,
    content: modalState.content,
    triggerNode: modalState.triggerNode,
    openModal,
    closeModal,
    setTrigger,
    clearTrigger,
  };

  useEffect(() => {
    if (error)
      toast.error(`Error: ${error.message ?? "An unexpected error occurred"}`);
  }, [error]);

  return (
    <SheetContext.Provider value={sheetContextValue}>
      <ModalContext.Provider value={modalContextValue}>
        <section className="w-full h-screen flex flex-col relative text-sm overflow-hidden">
          <CustomNavbar
            navItems={navItems ?? []}
            noSidebar={noSidebar}
            pageTitle={pageTitle}
            role={role ?? "admin"}
          />

          <div className="flex flex-1 overflow-hidden">
            {!noSidebar && <AppSidebar navItems={navItems ?? []} />}
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

          <Sheet
            open={isSheetOpen}
            onOpenChange={(open) => !open && closeSheet()}
          >
            <SheetContent className="md:min-w-[600px] w-screen flex flex-col gap-0 h-full">
              <SheetHeader className="border-b p-2">
                <SheetTitle>{sheetRef.current.title}</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto">
                {sheetRef.current.tabs.length > 0 ? (
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full relative"
                  >
                    <TabsList className="w-full flex h-[46px] items-center border-b border-gray-200 relative bg-white rounded-none p-0">
                      {sheetRef.current.tabs.map((tab) => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className="relative inline-block select-none px-3 py-4 text-sm font-normal
    text-gray-900 hover:text-black
    data-[state=active]:text-black data-[state=active]:font-medium
    transition-colors duration-200
    bg-transparent border-none shadow-none rounded-none
    ring-0 focus:outline-none focus:ring-0
    after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full
    after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 after:origin-left
    data-[state=active]:after:scale-x-100"
                        >
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {sheetRef.current.tabs.map((tab) => (
                      <TabsContent
                        key={tab.value}
                        value={tab.value}
                        className="p-0"
                      >
                        {tab.content}
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  sheetRef.current.content
                )}
              </div>
              <SheetFooter className="border-t p-2 flex flex-row justify-end gap-2">
                <SheetClose asChild>
                  <Button variant="outline" size="sm">
                    Close
                  </Button>
                </SheetClose>
                {footer}
              </SheetFooter>
            </SheetContent>
          </Sheet>

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
