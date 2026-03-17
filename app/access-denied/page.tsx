import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <>
      <h1 className="text-4xl font-bold">:&#40; Access Denied</h1>
      <Link href={"/"}>
        <Button variant={"outline"} size={"sm"}>
          Go Back
        </Button>
      </Link>
    </>
  );
}
