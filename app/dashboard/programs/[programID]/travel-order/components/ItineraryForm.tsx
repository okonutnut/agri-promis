"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TravelOrderProjectsType } from "@/components/types";

type ItineraryFormProps = {
  onSubmit: (form: TravelOrderProjectsType) => void;
};

export default function ItineraryForm({ onSubmit }: ItineraryFormProps) {
  const [form, setForm] = useState<TravelOrderProjectsType>({
    date: "",
    destination: "",
    purpose: "",
    departure_time: "",
    arrival_time: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (!form.date || !form.destination) return;
    onSubmit(form);
    setForm({
      date: "",
      destination: "",
      purpose: "",
      departure_time: "",
      arrival_time: "",
    });
  };

  const isFormIncomplete =
    !form.date ||
    !form.destination ||
    !form.purpose ||
    !form.departure_time ||
    !form.arrival_time;

  return (
    <section className="flex-col items-start gap-4 space-y-4">
      <div className="flex flex-col gap-2 w-full">
        <Label>Date</Label>
        <Input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label>Destination</Label>
        <Textarea
          name="destination"
          placeholder="Enter Destination"
          value={form.destination}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label>Purpose</Label>
        <Textarea
          name="purpose"
          placeholder="Enter Purpose"
          value={form.purpose}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label>Departure Time</Label>
        <Input
          type="time"
          name="departure_time"
          value={form.departure_time}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label>Arrival Time</Label>
        <Input
          type="time"
          name="arrival_time"
          value={form.arrival_time}
          onChange={handleChange}
        />
      </div>
      <Button
        type="button"
        className="w-full mt-4"
        onClick={handleAdd}
        disabled={isFormIncomplete}
      >
        Add
      </Button>
    </section>
  );
}
