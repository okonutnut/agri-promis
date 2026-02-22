export type PostTravelWithDetails = {
  id: string;
  travel_order_id: string;
  travel_date_id: string;
  projects_places_visited: string;
  activities_undertaken: string;
  issues_concern: string[];
  remarks: string;
  photo_url: string[];
  created_at: string; // ISO timestamp
  reviewer_id: string;
  reviewed_at: string;
  program_id: string;
  travel_order_no: string;
  user_id: string;
  fullname: string;
  position: string;
  date: string; // YYYY-MM-DD
  end_date: string | null;
  destination: string;
};
