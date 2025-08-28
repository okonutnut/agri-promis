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
    console.error("Error creating user:", authError);
    throw new Error(`Failed to create user: ${authError.message}`);
  }

  // Get the user ID from the auth data
  const userId = authData.user.id;

  const { error: userError } = await supabase.from("user_profile").insert({
    ...data,
    id: userId,
  });

  if (userError) {
    console.error("Error creating member:", userError);
    throw new Error(`Failed to create member: ${userError.message}`);
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
    console.error("Error updating member:", userError);
    throw new Error(`Failed to update member: ${userError.message}`);
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
      console.error("Error updating user metadata:", authError);
      throw new Error(`Failed to update user metadata: ${authError.message}`);
    }
  }

  // Log the activity
  await InsertActivityLogAction(
    "Updated a Member",
    `Member ${data.fullname} updated.`
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
    console.error("Error updating member:", userError);
    throw new Error(`Failed to update member: ${userError.message}`);
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
    console.error("Error updating user metadata:", authError);
    throw new Error(`Failed to update user metadata: ${authError.message}`);
  }

  // Log the activity
  await InsertActivityLogAction(
    "Updated Member Status",
    `Member ${data.fullname} status updated to ${status}.`
  );

  return;
}

export async function SelectAllMembersAction() {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .order("role");

  if (error) {
    console.error("Error fetching members:", error);
    throw new Error(`Failed to fetch members: ${error.message}`);
  }

  return data as UserProfileType[];
}

export async function SelectAllMembersByRoleAction(role: number) {
  const supabase = await createClient(cookies());

  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("role", role);

  if (error) {
    console.error("Error fetching members:", error);
    throw new Error(`Failed to fetch members: ${error.message}`);
  }

  // Get user email from auth
  const userIds = data?.map((item) => item.id).filter(Boolean) || [];
  const { data: userData, error: emailError } =
    await supabase.auth.admin.listUsers();
  if (emailError) {
    console.error("Error fetching user emails:", emailError);
    throw new Error(`Failed to fetch user emails: ${emailError.message}`);
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
