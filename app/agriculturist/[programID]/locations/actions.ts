"use server";

import { createClient } from "@/utils/supabase/server";
import { LocationType } from "./types";
import { format } from "date-fns";

export async function InsertLocationAction(location: LocationType) {
  try {
    const supabase = await createClient();
    // Remove 'id' property before insert
    const { id, ...locationWithoutId } = location;
    const { error } = await supabase
      .from("locations")
      .insert({ ...locationWithoutId })
      .select("*");

    if (error) {
      console.error("Error inserting location:", error);
      throw new Error(error.message);
    }

    return;
  } catch (error) {
    console.error("Error in InsertLocationAction:", error);
    throw new Error("Server error while inserting location");
  }
}

export async function SelectAllLocationsAction() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching locations:", error);
      throw new Error(error.message);
    }

    return data as LocationType[];
  } catch (error) {
    console.error("Error in SelectAllLocations:", error);
    throw new Error("Server error while fetching locations");
  }
}
