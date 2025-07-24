import { ImageData } from "./interfaces";

export type UserProfileType = {
  id?: string;
  fullname: string;
  email?: string;
  phone?: string;
  role?: string;
  access_level?: string;
  created_at?: string;
};

export type ProgramType = {
  id?: string;
  agriculturist_id?: string;
  program_name: string;
  description?: string;
  created_at?: string;
};

export type ProjectType = {
  id?: string;
  project_name: string;
  crop_type: string;
  start_date: string;
  end_date: string;
  status?: number;
  location_id?: string;
  locationData?: LocationType;
  program_id?: string;
  created_by?: string;
  created_at?: string;
};

export type LocationType = {
  id?: string;
  province: string;
  municipality: string;
  barangay: string;
  created_at?: string;
};

export type MonitoringReportType = {
  id?: string;
  project_id?: string;
  reporter_id?: string;
  status_note?: string;
  images?: ImageData[];
  photo_url?: string[];
  location_name?: string;
  latitude?: number;
  longitude?: number;
  reporter?: UserProfileType;
  remarks?: string;
  reviewedBy?: UserProfileType;
  created_at?: string;
};

export interface PostActivityReportType {
  id?: string;
  project_id?: string;
  submitted_by_id?: string;
  reviewed_by_id?: string;
  travel_order_no?: string;
  inclusive_date_of_travel?: string;
  issues_concern_accomplishment?: string;
  activities_undertaken?: string;
  status_notes?: string;
  remarks?: string;
  reviewedBy?: UserProfileType;
  created_at?: string;
}

export type AssignedProjectsType = {
  id?: string;
  user_id?: string;
  fullname?: string;
  project_ids?: string[];
  created_at?: string;
  user_profile?: UserProfileType;
};

export type TravelOrderType = {
  id?: string;
  travel_order_no: string;
  name: string;
  office: string;
  program: string;
  estimated_cost: number;
  departure_date: string;
  return_date: string;
  destination: string;
  mode_of_transportation: string;
  created_at?: string;
};

export type NavigationItemType = {
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
