import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UploadPostActivityReportForm from "../form/upload-post-activity-report-form";

export default function AddPostActivityReportSheet() {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button>Add Report</Button>
        </SheetTrigger>
        <SheetContent className="w-full md:max-w-xl">
          <SheetHeader className="border-b">
            <SheetTitle className="text-primary uppercase">
              Upload Post Activity Report
            </SheetTitle>
          </SheetHeader>
          <UploadPostActivityReportForm />
          <SheetFooter className="border-t">
            <Button form="upload-post-activity-report-form">Confirm</Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
