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
      <TabsList className="flex justify-between w-full bg-transparent border-b rounded-none p-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.title}
            value={tab.title}
            className="rounded-none"
          >
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.title} value={tab.title} className="p-0">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
