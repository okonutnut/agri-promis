-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.activity_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  code text,
  description text,
  project_location_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_logs_pkey PRIMARY KEY (id),
  CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profile(id),
  CONSTRAINT activity_logs_project_location_id_fkey FOREIGN KEY (project_location_id) REFERENCES public.project_location(id)
);
CREATE TABLE public.assigned_fieldtechnicians (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  program_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT assigned_fieldtechnicians_pkey PRIMARY KEY (id),
  CONSTRAINT assigned_fieldtechnicians_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profile(id),
  CONSTRAINT assigned_fieldtechnicians_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id)
);
CREATE TABLE public.farmers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text,
  description text NOT NULL UNIQUE,
  active_status smallint DEFAULT '1'::smallint,
  member_count integer,
  created_at timestamp with time zone DEFAULT now(),
  president_name text,
  contact_number text,
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT farmers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.monitoring (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_location_id uuid NOT NULL,
  reporter_id uuid NOT NULL,
  observation text,
  photo_url ARRAY,
  remarks text,
  findings ARRAY,
  issues_concern ARRAY,
  purpose text,
  travel_order_no uuid,
  created_at timestamp with time zone DEFAULT now(),
  reviewed_by_id uuid,
  reviewed_at timestamp with time zone,
  travel_date_id uuid,
  CONSTRAINT monitoring_pkey PRIMARY KEY (id),
  CONSTRAINT monitoring_travel_order_no_fkey FOREIGN KEY (travel_order_no) REFERENCES public.travel_order(id),
  CONSTRAINT monitoring_reviewed_by_id_fkey FOREIGN KEY (reviewed_by_id) REFERENCES public.user_profile(id),
  CONSTRAINT monitoring_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.user_profile(id),
  CONSTRAINT monitoring_travel_date_id_fkey FOREIGN KEY (travel_date_id) REFERENCES public.travel_order_itinerary_items(id),
  CONSTRAINT monitoring_project_location_id_fkey FOREIGN KEY (project_location_id) REFERENCES public.project_location(id)
);
CREATE TABLE public.post_travel (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  travel_order_id uuid,
  travel_date_id uuid,
  projects_places_visited text,
  activities_undertaken text,
  issues_concern ARRAY,
  remarks text,
  photo_url ARRAY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewer_id uuid,
  reviewed_at timestamp with time zone,
  program_id uuid,
  project_title_activity text,
  icc_fca_lgu_name text,
  CONSTRAINT post_travel_pkey PRIMARY KEY (id),
  CONSTRAINT post_travel_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.user_profile(id),
  CONSTRAINT post_travel_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id),
  CONSTRAINT post_travel_travel_order_id_fkey FOREIGN KEY (travel_order_id) REFERENCES public.travel_order(id),
  CONSTRAINT post_travel_travel_date_id_fkey FOREIGN KEY (travel_date_id) REFERENCES public.travel_order_itinerary_items(id)
);
CREATE TABLE public.programs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_id uuid,
  program_name text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  description text,
  deleted_at timestamp with time zone,
  CONSTRAINT programs_pkey PRIMARY KEY (id),
  CONSTRAINT programs_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.user_profile(id)
);
CREATE TABLE public.project_location (
  project_id uuid,
  description text,
  location text,
  start_date date,
  end_date date,
  total_alloted_area text,
  progress_indicator smallint,
  fca_ids ARRAY,
  status smallint,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  deleted_at timestamp with time zone,
  CONSTRAINT project_location_pkey PRIMARY KEY (id),
  CONSTRAINT project_location_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.user_profile(id),
  CONSTRAINT project_location_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_name text NOT NULL,
  description text NOT NULL,
  created_by uuid,
  program_id uuid,
  created_at timestamp without time zone DEFAULT now(),
  deleted_at timestamp with time zone,
  CONSTRAINT projects_pkey PRIMARY KEY (id),
  CONSTRAINT projects_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id),
  CONSTRAINT projects_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.user_profile(id)
);
CREATE TABLE public.push_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  subscription jsonb,
  user_id uuid,
  CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT push_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profile(id)
);
CREATE TABLE public.settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  settings_name text NOT NULL UNIQUE,
  form_schema jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.travel_order (
  created_by uuid,
  user_id uuid,
  travel_order_no text NOT NULL,
  office text,
  departure_date timestamp without time zone,
  return_date timestamp without time zone,
  fund text,
  estimated_cost text,
  mode_of_transport text,
  created_at timestamp with time zone DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  is_active smallint,
  program_id uuid,
  deleted_at timestamp with time zone,
  CONSTRAINT travel_order_pkey PRIMARY KEY (id),
  CONSTRAINT travel_order_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profile(id),
  CONSTRAINT travel_order_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id),
  CONSTRAINT travel_order_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.user_profile(id)
);
CREATE TABLE public.travel_order_itinerary_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  travel_order_id uuid DEFAULT gen_random_uuid(),
  date date,
  destination text,
  departure_time time without time zone,
  arrival_time time without time zone,
  purpose text,
  end_date date,
  CONSTRAINT travel_order_itinerary_items_pkey PRIMARY KEY (id),
  CONSTRAINT travel_order_projects_travel_order_id_fkey FOREIGN KEY (travel_order_id) REFERENCES public.travel_order(id)
);
CREATE TABLE public.user_profile (
  id uuid NOT NULL,
  fullname text,
  email text,
  position text,
  role smallint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  active_status smallint NOT NULL DEFAULT '1'::smallint,
  CONSTRAINT user_profile_pkey PRIMARY KEY (id),
  CONSTRAINT user_profile_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_session (
  user_id uuid UNIQUE,
  ip_address text,
  longitude text,
  latitude text,
  id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  modified_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_session_pkey PRIMARY KEY (id),
  CONSTRAINT user_session_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profile(id)
);