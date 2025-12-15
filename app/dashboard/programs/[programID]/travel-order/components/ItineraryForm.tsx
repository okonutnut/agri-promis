"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TravelOrderProjectsType } from "@/components/types";

type ItineraryFormProps = {
  onSubmit: (form: TravelOrderProjectsType) => void;
  departureDate?: string;
  returnDate?: string;
};

export default function ItineraryForm({
  onSubmit,
  departureDate,
  returnDate,
}: ItineraryFormProps) {
  const extractTime = (datetime?: string) => {
    if (!datetime) return "";
    const [, timePart] = datetime.split("T");
    return timePart ? timePart.slice(0, 5) : "";
  };

  const defaultDepartureTime = extractTime(departureDate);
  const defaultArrivalTime = extractTime(returnDate);

  const [form, setForm] = useState<TravelOrderProjectsType>({
    date: "",
    destination: "",
    purpose: "",
    departure_time: defaultDepartureTime,
    arrival_time: defaultArrivalTime,
  });

  // Generate date options from departure date to return date
  const dateOptions = useMemo(() => {
    if (!departureDate || !returnDate) return [];

    // Extract date part directly from datetime-local format (YYYY-MM-DDTHH:mm)
    // This avoids timezone conversion issues
    const startDateStr = departureDate.split("T")[0]; // YYYY-MM-DD
    const endDateStr = returnDate.split("T")[0]; // YYYY-MM-DD

    // Parse date components to avoid timezone issues
    const [startYear, startMonth, startDay] = startDateStr.split("-").map(Number);
    const [endYear, endMonth, endDay] = endDateStr.split("-").map(Number);

    // Create date objects in local timezone
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    const dates: string[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      // Format as YYYY-MM-DD using local date methods
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      dates.push(dateStr);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }, [departureDate, returnDate]);

  const shouldUseSelect = departureDate && returnDate && dateOptions.length > 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (value: string) => {
    setForm((prev) => ({ ...prev, date: value }));
  };

  const handleAdd = () => {
    if (!form.date || !form.destination) return;
    onSubmit(form);
    setForm({
      date: "",
      destination: "",
      purpose: "",
      departure_time: defaultDepartureTime,
      arrival_time: defaultArrivalTime,
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
        {shouldUseSelect ? (
          <Select value={form.date} onValueChange={handleDateSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a date" />
            </SelectTrigger>
            <SelectContent>
              {dateOptions.map((date) => {
                const dateObj = new Date(date);
                const formattedDate = dateObj.toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                return (
                  <SelectItem key={date} value={date}>
                    {formattedDate}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        ) : (
          <Input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        )}
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
