import {
  BookOpen,
  Cctv,
  ChartLine,
  ClipboardPen,
  Contact,
  FolderKanban,
  House,
  LayoutDashboard,
  Map,
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
      title: "Field Technicians",
      href: `/dashboard/programs/${id}/field-technicians`,
      icon: UserPen,
    },
    {
      title: "Travel Reports",
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

export function getProjectNavItems(programId: string, projectId: string) {
  return [
    {
      title: "Overview",
      href: `/dashboard/programs/${programId}/projects/${projectId}`,
      icon: House,
    },
    {
      title: "Project Locations",
      href: `/dashboard/programs/${programId}/projects/${projectId}/locations`,
      icon: Map,
    },
    {
      title: "Settings",
      href: `/dashboard/programs/${programId}/projects/${projectId}/settings`,
      icon: Settings,
    },
  ];
}

export function getProjectLocationNavItems(id: string) {
  return [
    {
      title: "Overview",
      href: `/dashboard/project-location/${id}`,
      icon: House,
    },
    {
      title: "Monitoring Reports",
      href: `/dashboard/project-location/${id}/monitoring-reports`,
      icon: Cctv,
    },
    {
      title: "Activity Logs",
      href: `/dashboard/project-location/${id}/activity-logs`,
      icon: ChartLine,
    },
    {
      title: "Settings",
      href: `/dashboard/project-location/${id}/settings`,
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
      title: "Assigned Programs",
      href: "/field-technician/programs",
      icon: UserPen,
    },
    {
      title: "Travel Reports",
      href: "/field-technician/post-travel-reports",
      icon: NotebookPen,
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

export function getUserProjectNavItems(programID: string, locationID: string) {
  return [
    {
      title: "Project Overview",
      href: `/field-technician/programs/${programID}/location/${locationID}`,
      icon: House,
    },
    {
      title: "Monitoring Report",
      href: `/field-technician/programs/${programID}/location/${locationID}/monitoring-report`,
      icon: Cctv,
    },
    {
      title: "Activity Logs",
      href: `/field-technician/programs/${programID}/location/${locationID}/activity-logs`,
      icon: ChartLine,
    },
    // {
    //   title: "Back to Projects",
    //   href: `/field-technician/projects/${programID}`,
    //   icon: ArrowLeft,
    // },
  ];
}
