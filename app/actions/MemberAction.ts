"use server";

import { createClient } from "@/utils/supabase/server";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { UserProfileType } from "../../components/types";
import {
  sendNotificationToAll,
  sendNotificationToUser,
} from "./NotificationAction";
import { createAdminClient } from "@/utils/supabase/server-admin";

// MEMBERS ACTIONS

export async function InsertMemberAction(data: UserProfileType) {
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: data.email as string,
      email_confirm: true,
      user_metadata: {
        name: data.fullname as string,
        active_status: 1,
        role: data.role,
      },
    });

  if (authError) {
    throw authError;
  }

  // Get the user ID from the auth data
  const userId = authData.user.id;

  const { error: userError } = await supabase.from("user_profile").insert({
    ...data,
    id: userId,
  });

  if (userError) {
    throw userError;
  }

  // Log the activity
  await InsertActivityLogAction(
    "Added a Member",
    `New member added: ${data.fullname}.`,
  );

  // Send Notification
  await sendNotificationToAll(`New member added: ${data.fullname}.`);

  return;
}

export async function UpdateMemberAction(
  userId: string,
  data: Partial<UserProfileType>,
) {
  const supabase = await createAdminClient();

  const { error: userError } = await supabase
    .from("user_profile")
    .update({ ...data, created_at: new Date() })
    .eq("id", userId)
    .select()
    .single();

  if (userError) {
    throw userError;
  }

  // Update auth metadata if name or role changed
  if (data.fullname || data.role !== undefined) {
    const { error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          name: data.fullname,
          role: data.role,
        },
      },
    );

    if (authError) {
      throw authError;
    }
  }

  // Log the activity
  await InsertActivityLogAction(
    "Updated a Member",
    `Member ${data.fullname?.toString()} updated.`,
  );

  // Send Notification
  await sendNotificationToUser(`Your member profile has been updated.`, userId);

  return;
}

export async function UpdateActiveStatusMemberAction(
  userId: string,
  status: number,
) {
  const supabase = await createAdminClient();

  const { data, error: userError } = await supabase
    .from("user_profile")
    .update({ active_status: status, created_at: new Date() })
    .eq("id", userId)
    .select()
    .single();

  if (userError) {
    throw userError;
  }

  // Update auth metadata if name or role changed
  const { error: authError } = await supabase.auth.admin.updateUserById(
    userId,
    {
      user_metadata: {
        active_status: status,
      },
    },
  );

  if (authError) {
    throw authError;
  }

  // Log the activity
  await InsertActivityLogAction(
    "Updated Member Status",
    `Member ${data.fullname?.toString()} status updated to ${
      status === 0 ? "Inactive" : "Active"
    }.`,
  );

  // Send NOtification
  await sendNotificationToUser(
    `Your member profile status has been updated to ${
      status === 0 ? "Inactive" : "Active"
    }.`,
    userId,
  );

  return;
}

export async function SelectAllMembersAction() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_profile")
    .select(
      `
      *,
      admin_programs:programs!programs_admin_id_fkey (*, projects(count)),
      assigned_fieldtechnicians:assigned_fieldtechnicians!assigned_fieldtechnicians_user_id_fkey (
        *,
        programs (*, projects(count))
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((user) => ({
    ...user,
    program_ids: [
      ...new Set([
        // programs where user is admin
        ...(user.admin_programs?.map((p: any) => p.id) ?? []),

        // programs from assigned_fieldtechnicians
        ...(user.assigned_fieldtechnicians
          ?.map((aft: any) => aft.programs?.id)
          .filter(Boolean) ?? []),
      ]),
    ],
  })) as (UserProfileType & { program_ids: string[] })[];
}

export async function SelectAllMembersByRoleAction(role: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("role", role);

  if (error) {
    throw error;
  }

  return data as UserProfileType[];
}
