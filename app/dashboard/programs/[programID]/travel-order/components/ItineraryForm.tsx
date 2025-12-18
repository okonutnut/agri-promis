"use client";

import { useState, useMemo, useEffect } from "react";
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
  initialValues?: TravelOrderProjectsType | null;
  isEditMode?: boolean;
  readOnly?: boolean;
};

export default function ItineraryForm({
  onSubmit,
  departureDate,
  returnDate,
  initialValues,
  isEditMode = false,
  readOnly = false,
}: ItineraryFormProps) {
  const extractTime = (datetime?: string) => {
    if (!datetime) return "";
    const [, timePart] = datetime.split("T");
    return timePart ? timePart.slice(0, 5) : "";
  };

  const defaultDepartureTime = extractTime(departureDate);
  const defaultArrivalTime = extractTime(returnDate);

  const [form, setForm] = useState<TravelOrderProjectsType>(
    initialValues || {
      date: "",
      end_date: "",
      destination: "",
      purpose: "",
      departure_time: defaultDepartureTime,
      arrival_time: defaultArrivalTime,
    }
  );

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      setForm({
        ...initialValues,
        end_date: initialValues.end_date || initialValues.date,
      });
    }
  }, [initialValues]);

  // Generate date options from departure date to return date
  const dateOptions = useMemo(() => {
    if (!departureDate || !returnDate) return [];

    // Extract date part directly from datetime-local format (YYYY-MM-DDTHH:mm)
    const startDateStr = departureDate.split("T")[0];
    const endDateStr = returnDate.split("T")[0];

    const [startYear, startMonth, startDay] = startDateStr.split("-").map(Number);
    const [endYear, endMonth, endDay] = endDateStr.split("-").map(Number);

    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    const dates: string[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
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
    setForm((prev) => ({ 
      ...prev, 
      date: value,
      end_date: prev.end_date && prev.end_date < value ? value : prev.end_date || value 
    }));
  };

  const handleEndDateSelect = (value: string) => {
    setForm((prev) => ({ ...prev, end_date: value }));
  };

  const handleAdd = () => {
    if (!form.date || !form.destination) return;
    
    // Ensure end_date is at least the same as date
    const finalForm = {
      ...form,
      end_date: form.end_date || form.date
    };
    
    onSubmit(finalForm);
    // Only reset form if adding new entry, not when editing
    if (!isEditMode) {
      setForm({
        date: "",
        end_date: "",
        destination: "",
        purpose: "",
        departure_time: defaultDepartureTime,
        arrival_time: defaultArrivalTime,
      });
    }
  };

  const isFormIncomplete =
    !form.date ||
    !form.destination ||
    !form.purpose ||
    !form.departure_time ||
    !form.arrival_time;

  return (
    <section className="flex-col items-start gap-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 w-full">
          <Label>Date From</Label>
          {shouldUseSelect ? (
            <Select value={form.date} onValueChange={handleDateSelect} disabled={readOnly}>
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
              readOnly={readOnly}
            />
          )}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label>Date To</Label>
          {shouldUseSelect ? (
            <Select 
              value={form.end_date || form.date} 
              onValueChange={handleEndDateSelect} 
              disabled={readOnly || !form.date}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select end date" />
              </SelectTrigger>
              <SelectContent>
                {dateOptions
                  .filter(date => !form.date || date >= form.date)
                  .map((date) => {
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
              name="end_date"
              value={form.end_date || form.date}
              onChange={handleChange}
              readOnly={readOnly}
              min={form.date}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label>Destination</Label>
        <Textarea
          name="destination"
          placeholder="Enter Destination"
          value={form.destination}
          onChange={handleChange}
          readOnly={readOnly}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label>Purpose</Label>
        <Textarea
          name="purpose"
          placeholder="Enter Purpose"
          value={form.purpose}
          onChange={handleChange}
          readOnly={readOnly}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label>Departure Time</Label>
        <Input
          type="time"
          name="departure_time"
          value={form.departure_time}
          onChange={handleChange}
          readOnly={readOnly}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label>Arrival Time</Label>
        <Input
          type="time"
          name="arrival_time"
          value={form.arrival_time}
          onChange={handleChange}
          readOnly={readOnly}
        />
      </div>
      {!readOnly && (
        <Button
          type="button"
          className="w-full mt-4"
          onClick={handleAdd}
          disabled={isFormIncomplete}
        >
          {isEditMode ? "Update" : "Add"}
        </Button>
      )}
    </section>
  );
}
