"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabItem = {
  title: string;
  content: React.ReactNode;
};

type CustomTabListProps = {
  tabs: TabItem[];
  defaultTab?: string;
};

export function CustomTabList({ tabs, defaultTab }: CustomTabListProps) {
  return (
    <Tabs
      defaultValue={defaultTab ?? tabs[0]?.title}
      className="w-full h-full overflow-y-auto"
    >
      <div className="w-full overflow-x-auto">
        <TabsList className="flex justify-start sm:justify-between w-full min-w-max sm:min-w-0 bg-transparent border-b rounded-none p-0 gap-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.title}
              value={tab.title}
              className="rounded-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 min-w-fit"
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {tabs.map((tab) => (
        <TabsContent key={tab.title} value={tab.title} className="p-0 mb-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
