import { ImageData } from "./interfaces";

export type UserProfileType = {
  id?: string;
  fullname: string;
  email?: string;
  phone?: string;
  role?: number;
  position?: string;
  program_ids?: string[];
  active_status?: number;
  created_at?: string;
};

export type ActivityLogType = {
  id?: string;
  user_id?: string;
  code?: string;
  description?: string;
  ip_address?: string;
  created_at?: string;
};

export type FCAType = {
  id?: string;
  code?: string;
  description?: string;
  member_count?: number;
  active_status?: number;
  created_at?: string;
};

export type ProgramType = {
  id?: string;
  admin_id?: string;
  program_name: string;
  description?: string;
  user_profile?: UserProfileType;
  project_count: { count: number }[];
  created_at?: string;
};

export type ProjectType = {
  id?: string;
  project_name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: number;
  total_alloted_area?: number;
  progress_indicator?: number;
  location_id?: string;
  location?: string;
  fca?: FCAType[];
  fca_ids?: string[];
  programs?: ProgramType;
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
  key?: string;
  project_id?: string;
  travel_order_no?: string;
  reporter_id?: string;
  reviewed_by_id?: string;
  purpose?: string;
  findings?: string[];
  observation?: string;
  issues_concern?: string[];
  remarks?: string;
  photo_url?: string[];
  project?: ProjectType & { fcaDetails?: FCAType[] };
  images?: ImageData[];
  reporter?: UserProfileType;
  travel_order?: TravelOrderType;
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
  project_id?: string;
  projects?: ProjectType;
  created_at?: string;
  user_profile?: UserProfileType;
};

export type TravelOrderType = {
  id?: string;
  user_id?: string;
  travel_order_no?: string;
  purpose?: string;
  user?: { fullname?: string };
  createdBy?: { fullname?: string };
  office?: string;
  program_id?: string;
  project_id?: string;
  project?: ProjectType;
  fund?: number;
  estimated_cost?: number;
  departure_date?: string;
  return_date?: string;
  destination?: string;
  mode_of_transport?: string;
  is_active?: number;
  created_at?: string;
};

export type NavigationItemType = {
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export type NotificationType = {
  id?: string;
  user_id?: string;
  title?: string;
  message?: string;
  public?: number;
  is_read?: number;
  created_at?: string;
};
