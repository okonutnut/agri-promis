import {
  BookOpen,
  Cctv,
  ChartLine,
  ClipboardPen,
  Contact,
  FolderKanban,
  House,
  LayoutDashboard,
  NotebookPen,
  Settings,
  UserPen,
  Users,
} from "lucide-react";

export function getDashboardNavItems() {
  return [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Programs",
      href: "/dashboard/programs",
      icon: BookOpen,
    },
    {
      title: "Team",
      href: "/dashboard/team",
      icon: Users,
    },
    {
      title: "FCA",
      href: "/dashboard/fca",
      icon: Contact,
    },
    {
      title: "Activity Logs",
      href: "/dashboard/activity-logs",
      icon: ChartLine,
    },
  ];
}

export function getUserProfileNavItems() {
  return [
    {
      title: "My Profile",
      href: "/user-profile",
      icon: UserPen,
    },
    {
      title: "Back to Home",
      href: "/",
      icon: House,
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
      title: "Project List",
      href: `/dashboard/programs/${id}/projects`,
      icon: FolderKanban,
    },
    {
      title: "Post-Travel Reports",
      href: `/dashboard/programs/${id}/post-travel-reports`,
      icon: NotebookPen,
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
      title: "Activity Logs",
      href: `/dashboard/projects/${id}/activity-logs`,
      icon: ChartLine,
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
      title: "Dashboard",
      href: "/field-technician/dashboard",
      icon: House,
    },
    {
      title: "Post-Travel Reports",
      href: "/field-technician/post-travel-reports",
      icon: NotebookPen,
    },
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
    {
      title: "Activity Logs",
      href: "/field-technician/activity-logs",
      icon: ChartLine,
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
    {
      title: "Activity Logs",
      href: `/field-technician/projects/${id}/activity-logs`,
      icon: ChartLine,
    },
  ];
}
