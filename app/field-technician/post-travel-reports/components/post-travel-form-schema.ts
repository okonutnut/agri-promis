import { z } from "zod";

export const postTravelReportSchema = z.object({
  program_id: z.string().min(1, "Program is required"),
  travel_order_id: z.string().min(1, "Travel order is required"),
  travel_date_id: z.string().min(1, "Travel date is required"),
  projects_places_visited: z.string().optional(),
  activities_undertaken: z.string().optional(),
  issues_concern: z.array(z.string()).optional(),
  remarks: z.string().optional(),
});

export type PostTravelReportFormData = z.infer<typeof postTravelReportSchema>;
