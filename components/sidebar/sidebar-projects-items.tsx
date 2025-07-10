import Link from "next/link";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { SelectAllProjectsByProgramIDHook } from "../hooks";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function SidebarProjectsItems() {
  const { programID } = useParams();
  const { data } = SelectAllProjectsByProgramIDHook(programID as string);
  console.log("Projects Data:", data);
  const projects = useMemo(() => {
    return data || [];
  }, [data]);

  return (
    <>
      {projects.map((item) => (
        <SidebarMenu key={item.id}>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={`project/${item.id}`}>
                <span>{item.project_name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      ))}
    </>
  );
}
