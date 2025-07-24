"use client";

import FormInput from "@/components/custom/input/form-input";
import FormTextarea from "@/components/custom/input/form-textarea";
import FormSelect from "@/components/custom/select/form-select";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";

type IssueTravelOrderFormProps = {
  assignedMembers: string[];
};
export default function IssueTravelOrderForm({
  assignedMembers,
}: IssueTravelOrderFormProps) {
  const form = useForm({
    defaultValues: {
      travel_order_no: "",
      name: "",
      office: "DA NVES",
      program: "",
      estimated_cost: 0,
      departure_date: "",
      return_date: "",
      destination: "",
      mode_of_transportation: "da_rfo_02_mv",
      assigned_members: assignedMembers,
    },
  });

  const modeOfTransportOptions = [
    { value: "da_rfo_02_mv", label: "DA RFO 02 MV" },
    { value: "puv", label: "PUV" },
    { value: "private", label: "Private" },
    { value: "plane", label: "Plane" },
  ];

  return (
    <form className="space-y-4 p-2">
      <FormInput label="Travel Order No." name="travel_order_no" form={form} />
      <FormInput label="Name" name="name" form={form} />
      <FormInput label="Office" name="office" form={form} />
      <FormInput label="Program" name="program" form={form} />
      <FormInput
        label="Estimated Cost"
        name="estimated_cost"
        type="number"
        form={form}
      />
      <FormInput
        label="Departure Date"
        type="datetime-local"
        name="departure_date"
        form={form}
      />
      <FormInput
        label="Return Date"
        type="datetime-local"
        name="return_date"
        form={form}
      />
      <FormTextarea label="Destination" name="destination" form={form} />
      <FormSelect
        options={modeOfTransportOptions}
        label="Mode of Transportation"
        name="mode_of_transportation"
        form={form}
      />
      <div className="absolute right-0 left-0 bottom-0 m-2">
        <Button className="w-full">Save</Button>
        <SheetClose asChild>
          <Button variant="outline" className="w-full mt-2">
            Close
          </Button>
        </SheetClose>
      </div>
    </form>
  );
}
