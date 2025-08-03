"use client";

import CustomPageLayout from "@/components/custom/layout/admin-page-layout";
import { getDashboardNavItems } from "@/components/sidebar/navitems";
import {
  Calendar,
  CalendarCurrentDate,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
} from "@/components/ui/full-calendar";
import { addHours } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SchedulerPage() {
  return (
    <CustomPageLayout
      pageTitle="My Schedules"
      navItems={getDashboardNavItems()}
    >
      <Calendar
        events={[
          {
            id: "1",
            start: new Date(),
            end: addHours(new Date(), 2),
            title: "event A",
            color: "pink",
          },
          {
            id: "2",
            start: addHours(new Date(), 1.5),
            end: addHours(new Date(), 3),
            title: "event B",
            color: "blue",
          },
        ]}
      >
        <div className="flex justify-between items-center px-2">
          <CalendarCurrentDate />
          <div className="flex items-center gap-2 mr-2">
            <CalendarPrevTrigger>
              <ChevronLeft />
            </CalendarPrevTrigger>
            <CalendarTodayTrigger>Today</CalendarTodayTrigger>
            <CalendarNextTrigger>
              <ChevronRight />
            </CalendarNextTrigger>
          </div>
        </div>
        <div className="h-[500px] md:h-[70vh] w-full">
          <CalendarMonthView />
        </div>
      </Calendar>
    </CustomPageLayout>
  );
}
