"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { InsertActivityLogAction } from "@/app/actions/ActivityLogAction";
import { UserProfileType } from "../../components/types";

// MEMBERS ACTIONS

export async function InsertMemberAction(data: UserProfileType) {
  const supabase = await createClient(cookies());

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
    `New member added: ${data.fullname}.`
  );

  return;
}

export async function UpdateMemberAction(
  userId: string,
  data: Partial<UserProfileType>
) {
  const supabase = await createClient(cookies());

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
      }
    );

    if (authError) {
      throw authError;
    }
  }

  // Log the activity
  await InsertActivityLogAction(
    "Updated a Member",
    `Member ${data.fullname?.toString()} updated.`
  );

  return;
}

export async function UpdateActiveStatusMemberAction(
  userId: string,
  status: number
) {
  const supabase = await createClient(cookies());

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
    }
  );

  if (authError) {
    throw authError;
  }

  // Log the activity
  await InsertActivityLogAction(
    "Updated Member Status",
    `Member ${data.fullname?.toString()} status updated to ${
      status === 0 ? "Inactive" : "Active"
    }.`
  );

  return;
}

export async function SelectAllMembersAction() {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("user_profile")
    .select(
      `
      *,
      assigned_projects (
        project_id,
        projects (
          id,
          program_id
        )
      ),
      programs:programs!programs_admin_id_fkey (
        id
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((user) => {
    // programs from assigned projects
    const programFromAssigned =
      user.assigned_projects
        ?.map((ap: any) => ap.projects?.program_id)
        .filter(Boolean) ?? [];

    // programs where user is admin
    const programFromAdmin =
      user.programs?.map((p: { id: string }) => p.id).filter(Boolean) ?? [];

    return {
      ...user,
      program_ids: [...new Set([...programFromAssigned, ...programFromAdmin])],
    };
  }) as (UserProfileType & { program_ids: string[] })[];
}

export async function SelectAllMembersByRoleAction(role: number) {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("role", role);

  if (error) {
    throw error;
  }

  // Get user email from auth
  const userIds = data?.map((item) => item.id).filter(Boolean) || [];
  const { data: userData, error: emailError } =
    await supabase.auth.admin.listUsers();
  if (emailError) {
    throw emailError;
  }
  const emailMap = new Map(
    (userData?.users ?? [])
      .filter((user) => userIds.includes(user.id))
      .map((user) => [user.id, user.email])
  );

  const result = data?.map((item) => ({
    ...item,
    email: emailMap.get(item.id) || "",
  }));

  return result as UserProfileType[];
}
