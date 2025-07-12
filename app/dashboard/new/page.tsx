"use client";

import NewNavbar from "@/components/custom/navbar/new-navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CreateProgramForm from "@/components/custom/forms/create-program-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateProgramPage() {
  return (
    <>
      <NewNavbar />
      <Card className="mx-auto w-[500px] my-5">
        <CardHeader>
          <CardTitle className="uppercase text-primary">
            Create new program
          </CardTitle>
          <CardDescription>
            This is where you can create a new program to manage your
            agricultural projects.
          </CardDescription>
          <Separator className="mt-6 mb-3" />
          <CardContent className="p-0">
            <CreateProgramForm />
          </CardContent>
          <Link href={"/dashboard/programs"}>
            <Button variant={"outline"} size={"sm"} className="w-full">
              Cancel
            </Button>
          </Link>
        </CardHeader>
      </Card>
    </>
  );
}
