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
  report_date?: string;
  report_time?: string;
  status_note?: string;
  remarks?: string;
  photo_url?: string;
  latitude?: number;
  longitude?: number;
  tag?: string[];
  created_at?: string;
};
