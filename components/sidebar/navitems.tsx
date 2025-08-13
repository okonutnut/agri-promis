import {
  Cctv,
  ChartLine,
  ClipboardPen,
  House,
  Settings,
  UserPen,
  Users,
} from "lucide-react";

export function getDashboardNavItems() {
  return [
    {
      title: "Programs",
      href: "/dashboard/programs",
      icon: House,
    },
    // {
    //   title: "Schedules",
    //   href: "/dashboard/schedules",
    //   icon: ChartBar,
    // },
    {
      title: "Team",
      href: "/dashboard/team",
      icon: Users,
    },
    {
      title: "Activity Logs",
      href: "/dashboard/activity-logs",
      icon: ChartLine,
    },
  ];
}

export function getProgramNavItems(id: string) {
  return [
    {
      title: "Overview",
      href: `/dashboard/programs/${id}`,
      icon: House,
    },
    {
      title: "Travel Order",
      href: `/dashboard/programs/${id}/travel-order`,
      icon: ClipboardPen,
    },
    {
      title: "Program Settings",
      href: `/dashboard/programs/${id}/settings`,
      icon: Settings,
    },
  ];
}

export function getProjectNavItems(id: string) {
  return [
    {
      title: "Overview",
      href: `/dashboard/projects/${id}`,
      icon: House,
    },
    {
      title: "Field Technicians",
      href: `/dashboard/projects/${id}/field-technicians`,
      icon: UserPen,
    },
    {
      title: "Monitoring Reports",
      href: `/dashboard/projects/${id}/monitoring-reports`,
      icon: Cctv,
    },
    {
      title: "Project Settings",
      href: `/dashboard/projects/${id}/settings`,
      icon: Settings,
    },
  ];
}

export function getUserDashboardNavItems() {
  return [
    {
      title: "Assigned Projects",
      href: "/field-technician/projects",
      icon: UserPen,
    },
    {
      title: "Travel Orders",
      href: "/field-technician/travel-order",
      icon: ClipboardPen,
    },
  ];
}

export function getUserProjectNavItems(id: string) {
  return [
    {
      title: "Project Overview",
      href: `/field-technician/projects/${id}`,
      icon: House,
    },
    {
      title: "Monitoring Report",
      href: `/field-technician/projects/${id}/monitoring-report`,
      icon: Cctv,
    },
  ];
}
