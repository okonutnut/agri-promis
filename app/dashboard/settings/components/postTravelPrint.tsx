"use client";

import {
  SelectSettings,
  UpsertSettings,
} from "@/app/actions/SystemSettingsAction";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useRealtimeQuery } from "@/hooks/use-realtime";
import { useUniversalMutation } from "@/hooks/use-universal-mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export type PostTravelPrintSettingsType = {
  reviewer?: string;
  reviewerPosition?: string;
  recommendationApproval?: string;
  recommendationApprovalPosition?: string;
  approver?: string;
  approverPosition?: string;
};

const formSchema = z.object({
  reviewer: z.string().optional(),
  reviewerPosition: z.string().optional(),
  recommendationApproval: z.string().optional(),
  recommendationApprovalPosition: z.string().optional(),
  approver: z.string().optional(),
  approverPosition: z.string().optional(),
});
export default function PostTravelPrintCard() {
  //   SELECT SETTINGS
  const { data, isLoading, error } =
    useRealtimeQuery<PostTravelPrintSettingsType>({
      queryFn: async () => await SelectSettings("travel_report_print_settings"),
      queryKey: ["travel_report_print_settings"],
      table: "settings",
    });

  //   UPSERT SETTINGS
  const { mutate, isPending } = useUniversalMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) =>
      await UpsertSettings(
        "travel_report_print_settings",
        JSON.stringify(data),
      ),
    onSuccess: () => {
      toast.success("Settings saved successfully");
    },
    onError: () => {
      toast.error("Failed to save settings");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reviewer: "",
      reviewerPosition: "",
      recommendationApproval: "",
      recommendationApprovalPosition: "",
      approver: "",
      approverPosition: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    mutate(data);
  };

  useEffect(() => {
    if (!data) return;

    form.reset({
      reviewer: data.reviewer || "",
      reviewerPosition: data.reviewerPosition || "",
      recommendationApproval: data.recommendationApproval || "",
      recommendationApprovalPosition: data.recommendationApprovalPosition || "",
      approver: data.approver || "",
      approverPosition: data.approverPosition || "",
    });
  }, [data, form]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load settings");
      return;
    }
  }, [error]);

  return (
    <Card className="p-3 rounded-md">
      <form
        className="flex flex-col space-y-3"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <span className="font-bold mb-4">Travel Report Print Settings</span>
        {/* REVIEWER */}
        <div className="flex flex-wrap items-start justify-between">
          <div>
            <Label>Reviewer</Label>
            <span className="text-sm text-muted-foreground">
              This is the one who will be reviewing the travel report.
            </span>
          </div>
          <Input
            disabled={isLoading}
            className="w-75"
            {...form.register("reviewer")}
          />
        </div>
        {/* REVIEWER POSITION */}
        <div className="flex flex-wrap items-start justify-between">
          <div>
            <Label>Reviewer Position</Label>
            <span className="text-sm text-muted-foreground">
              This is the position of the reviewer.
            </span>
          </div>
          <Input
            disabled={isLoading}
            className="w-75"
            {...form.register("reviewerPosition")}
          />
        </div>

        <Separator />

        {/* RECOMMENDING APPROVAL */}
        <div className="flex flex-wrap items-start justify-between">
          <div>
            <Label>Recommendation Approval</Label>
            <span className="text-sm text-muted-foreground">
              This is the one who will be recommending approval of the travel
              report.
            </span>
          </div>
          <Input
            disabled={isLoading}
            className="w-75"
            {...form.register("recommendationApproval")}
          />
        </div>
        {/* RECOMMENDING APPROVAL POSITION */}
        <div className="flex flex-wrap items-start justify-between">
          <div>
            <Label>Recommendation Approval Position</Label>
            <span className="text-sm text-muted-foreground">
              This is the position of the person recommending approval of the
              travel report.
            </span>
          </div>
          <Input
            disabled={isLoading}
            className="w-75"
            {...form.register("recommendationApprovalPosition")}
          />
        </div>

        <Separator />

        {/* APPROVER */}
        <div className="flex flex-wrap items-start justify-between">
          <div>
            <Label>Approver</Label>
            <span className="text-sm text-muted-foreground">
              This is the one who will be approving the travel report.
            </span>
          </div>
          <Input
            disabled={isLoading}
            className="w-75"
            {...form.register("approver")}
          />
        </div>

        {/* APPROVER POSITION */}
        <div className="flex flex-wrap items-start justify-between">
          <div>
            <Label>Approver Position</Label>
            <span className="text-sm text-muted-foreground">
              This is the position of the person approving the travel report.
            </span>
          </div>
          <Input
            disabled={isLoading}
            className="w-75"
            {...form.register("approverPosition")}
          />
        </div>

        <Separator />

        <div className="flex justify-end items-center">
          <Button size="sm" type="submit" disabled={isPending || isLoading}>
            {isPending ? (
              <>
                <Spinner /> Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
