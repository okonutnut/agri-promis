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
  president_name?: string;
  contact_number?: string;
  member_count?: number;
  active_status?: number;
  created_at?: string;

  // relations
  assignedProjects?: ProjectLocationType[];
};

export type ProgramType = {
  id?: string;
  admin_id?: string;
  program_name: string;
  description?: string;
  user_profile?: UserProfileType;
  project_count: { count: number }[];
  created_at?: string;

  // relations
  projects?: ProjectType[];
};

export type ProjectType = {
  id?: string;
  project_name?: string;
  description?: string;
  created_by?: string;
  program_id?: string;
  created_at?: string;

  // realtions
  programs?: ProgramType;
  fca?: FCAType[];
  project_location?: ProjectLocationType[];
};

export type ProjectLocationType = {
  id?: string;
  project_id?: string;
  description?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  total_alloted_area?: number;
  progress_indicator?: number;
  fca_ids?: string[];
  status?: number;
  programs?: ProgramType;
  locationData?: LocationType;
  created_by?: string;
  created_at?: string;

  // relation
  projects?: ProjectType;
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
  travel_order_id?: string;
  travel_date_id?: string;
  project_location_id?: string;
  travel_order_no?: string;
  reporter_id?: string;
  reviewed_by_id?: string;
  purpose?: string;
  findings?: string[];
  observation?: string;
  issues_concern?: string[];
  remarks?: string;
  photo_url?: string[];

  // Objects
  project_location?: ProjectLocationType;
  project?: ProjectType & { fcaDetails?: FCAType[] };
  images?: ImageData[];
  reporter?: UserProfileType;
  travel_order?: TravelOrderType;
  reviewedBy?: UserProfileType;
  created_at?: string;
};

export type PostTravelReportType = {
  id?: string;
  user_id?: string;
  program_id?: string;
  reviewer_id?: string;
  travel_order_id?: string;
  travel_date_id?: string;
  projects_places_visited?: string;
  activities_undertaken?: string;
  issues_concern?: string;
  remarks?: string;
  photo_url?: string[];
  created_at?: string;
  reviewed_at?: string;

  // relations
  user?: UserProfileType;
  reviewer?: UserProfileType;
  travel_order?: TravelOrderType;
  travel_date?: TravelOrderProjectsType;
};

export type ReportType = {
  id?: string;
  code?: string;
  description?: string;
  created_at?: string;
};

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
  mode_of_transport?: string;
  is_active?: number;
  travel_itinerary: TravelOrderProjectsType[];
  created_at?: string;
};

export type TravelOrderProjectsType = {
  id?: string;
  travel_order_id?: string;
  date?: string;
  destination?: string;
  purpose?: string;
  departure_time?: string;
  arrival_time?: string;
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
  subscription?: string;
  created_at?: string;
};

export type Stage = {
  value: string;
  label: string;
};
