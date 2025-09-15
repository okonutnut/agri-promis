"use client";

import { TravelOrderProjectsType } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ItineraryOfTravelProps = {
  isAddMode?: boolean;
  setItinerary: React.Dispatch<React.SetStateAction<TravelOrderProjectsType[]>>;
  itinerary: TravelOrderProjectsType[];
};
export default function ItineraryOfTravel({
  isAddMode,
  setItinerary,
  itinerary,
}: ItineraryOfTravelProps) {
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
    setItinerary((prev) => [...prev, form]);
    setForm({
      date: "",
      destination: "",
      purpose: "",
      departure_time: "",
      arrival_time: "",
    });
  };

  return (
    <section className="space-y-3">
      <Separator />
      <Label className="my-4 text-md uppercase">Itinerary of Travel</Label>
      {isAddMode && (
        <>
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
            <Button type="button" className="w-full mt-4" onClick={handleAdd}>
              Add
            </Button>
          </section>
          <Separator />
        </>
      )}
      <section className="flex-col items-start gap-4 space-y-4">
        {itinerary.map((item, index) => (
          <Accordion
            type="single"
            collapsible
            key={index}
            className="w-full rounded-md border"
          >
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger className="px-4">
                Travel #{index + 1}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 w-full p-4">
                  <Label>Date</Label>
                  <Input type="date" value={item.date} readOnly />
                  <Label>Destination</Label>
                  <Textarea value={item.destination} readOnly />
                  <Label>Purpose</Label>
                  <Textarea value={item.purpose} readOnly />
                  <Label>Departure Time</Label>
                  <Input type="time" value={item.departure_time} readOnly />
                  <Label>Arrival Time</Label>
                  <Input type="time" value={item.arrival_time} readOnly />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </section>
    </section>
  );
}
