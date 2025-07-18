export type UserProfile = {
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

export type FieldReportType = {
  id?: string;
  project_id?: string;
  reporter_id?: string;
  date_time_captured?: string;
  report_level?: number;
  status_note?: string;
  remarks?: string;
  image_file?: File;
  photo_url?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  tag?: string[];
  user_profile?: UserProfile;
  created_at?: string;
};

export type AssignedProjectsType = {
  id?: string;
  user_id?: string;
  fullname?: string;
  project_ids?: string[];
  created_at?: string;
  user_profile?: UserProfile;
};

export type NavigationItemType = {
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
