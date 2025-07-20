"use client";

import NewNavbar from "@/components/custom/navbar/admin-navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreateProjectForm from "@/components/custom/forms/create-project-form";
import { useParams } from "next/navigation";
import { useSelectProgramByIDHook } from "@/components/hooks";

export default function CreateProgramPage() {
  const { programUID } = useParams();
  const { data } = useSelectProgramByIDHook(programUID as string);

  return (
    <>
      <NewNavbar noSidebar />
      <Card className="mx-auto w-full md:w-[500px] my-5 shadow-none border-0 md:shadow-xs md:border">
        <CardHeader>
          <CardTitle className="uppercase text-primary">
            Create new project
          </CardTitle>
          <CardDescription>
            This is where you can create a new project for{" "}
            <strong>{data?.program_name}</strong>.
          </CardDescription>
          <Separator className="mt-6 mb-3" />
          <CardContent className="p-0">
            <CreateProjectForm />
          </CardContent>
          <Link href={`/dashboard/programs/${programUID}`}>
            <Button variant={"outline"} size={"sm"} className="w-full">
              Cancel
            </Button>
          </Link>
        </CardHeader>
      </Card>
    </>
  );
}
