import { House, NotebookPen, Settings, UserPen, Users } from "lucide-react";

export function getProgramNavItems(id: string) {
  return [
    {
      title: "Program Overview",
      href: `/dashboard/programs/${id}`,
      icon: House,
    },
    {
      title: "Team",
      href: `/dashboard/programs/${id}/team`,
      icon: Users,
    },
    {
      title: "Settings",
      href: `/dashboard/programs/${id}/settings`,
      icon: Settings,
    },
  ];
}

export function getProjectNavItems(id: string) {
  return [
    {
      title: "Project Overview",
      href: `/dashboard/projects/${id}`,
      icon: House,
    },
    {
      title: "Field Technicians",
      href: `/dashboard/projects/${id}/field-technicians`,
      icon: UserPen,
    },
    {
      title: "Field Reports",
      href: `/dashboard/projects/${id}/field-reports`,
      icon: NotebookPen,
    },
    {
      title: "Settings",
      href: `/dashboard/projects/${id}/settings`,
      icon: Settings,
    },
  ];
}
