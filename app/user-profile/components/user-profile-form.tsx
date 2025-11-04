"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/custom/input/form-input";
import FormSelect from "@/components/custom/select/form-select";
import { Loader2, Send } from "lucide-react";
import { useUpdateMemberHook } from "@/components/hooks";
import { useState } from "react";
import { useSelectUserProfileHook } from "@/app/hooks/UserProfileHook";
import NonFormInput from "@/components/custom/input/non-form-input";

const formSchema = z.object({
  id: z.string().optional(),
  fullname: z
    .string()
    .min(1, "Fullname is required")
    .refine((val) => /^[A-Za-z\s.]+$/.test(val), {
      message: "Fullname must only contain letters, spaces, and periods",
    }),
  email: z.string().email("Invalid email address"),
  position: z.string().min(1, "Position is required"),
  role: z.coerce.number().min(1, "Role is required"),
});

type MemberType = z.infer<typeof formSchema>;

export default function UserProfileForm() {
  // User Profile
  const { data: userProfile } = useSelectUserProfileHook();
  const [pageState, setPageState] = useState<"idle" | "loading">("idle");

  const roles = [
    { value: 1, label: "System Admin" },
    { value: 2, label: "System User" },
  ];

  const form = useForm<MemberType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: userProfile?.id || "",
      email: userProfile?.email || "",
      fullname: userProfile?.fullname || "",
      position: userProfile?.position || "",
      role: userProfile?.role || 1,
    },
  });

  // UPDATE MEMBER HOOK
  const { mutate: updateMutate, isPending } = useUpdateMemberHook();

  const onSubmit = (data: MemberType) => {
    setPageState("loading");
    // Insert logic removed: always call update mutate
    updateMutate(data, {
      onSuccess: () => {
        form.reset();
        setPageState("idle");
      },
    });
  };

  return (
    <>
      <form
        className="space-y-4 md:w-1/2 w-full"
        id="team-member-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput label="Fullname" name="fullname" form={form} />
        <NonFormInput
          label="Email"
          defaultValue={userProfile?.email}
          readOnly
        />
        <FormInput label="Position" name="position" form={form} />
        {userProfile?.role === 0 && (
          <FormSelect
            options={roles.map((role) => ({
              value: role.value,
              label: role.label,
            }))}
            label="System Role"
            name="role"
            form={form}
          />
        )}
        <Button
          size={"sm"}
          onClick={() => form.handleSubmit(onSubmit)()}
          variant={isPending ? "ghost" : "default"}
          disabled={isPending || pageState == "loading"}
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Send /> Submit
            </>
          )}
        </Button>
      </form>
    </>
  );
}
