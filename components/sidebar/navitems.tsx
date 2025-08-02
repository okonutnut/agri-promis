import {
  Cctv,
  ClipboardPen,
  House,
  Settings,
  UserPen,
  Users,
} from "lucide-react";

export function getDashboardNavItems() {
  return [
    {
      title: "All Programs",
      href: "/dashboard/programs",
      icon: House,
    },
    {
      title: "Team",
      href: "/dashboard/team",
      icon: Users,
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
    // {
    //   title: "Post Activity Reports",
    //   href: `/dashboard/projects/${id}/post-activity-reports`,
    //   icon: NotebookPen,
    // },
    {
      title: "Project Settings",
      href: `/dashboard/projects/${id}/settings`,
      icon: Settings,
    },
  ];
}

export function getFieldTechnicianNavItems(id: string) {
  return [
    {
      title: "Project Overview",
      href: `/field-technician/${id}`,
      icon: House,
    },
    {
      title: "Monitoring Report",
      href: `/field-technician/${id}/monitoring-report`,
      icon: Cctv,
    },
    // {
    //   title: "Post Activity Report",
    //   href: `/field-technician/${id}/post-activity-report`,
    //   icon: NotebookPen,
    // },
  ];
}
