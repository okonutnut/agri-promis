"use client";

import { TravelOrderProjectsType } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useModal } from "@/components/custom/layout/custom-page-layout";
import ItineraryForm from "./ItineraryForm";

type ItineraryOfTravelProps = {
  isAddMode?: boolean;
  setItinerary: React.Dispatch<React.SetStateAction<TravelOrderProjectsType[]>>;
  itinerary: TravelOrderProjectsType[];
  isPending?: boolean;
};
export default function ItineraryOfTravel({
  isAddMode,
  setItinerary,
  itinerary,
  isPending,
}: ItineraryOfTravelProps) {
  const { openModal, closeModal } = useModal();

  const openAddModal = () => {
    openModal(
      "Add Itinerary of Travel",
      "",
      <ItineraryForm
        onSubmit={(form) => {
          setItinerary((prev) => [...prev, form]);
          closeModal();
        }}
      />
    );
  };

  return (
    <section>
      <div className="flex justify-between items-center">
        <Label className="my-4 text-md uppercase">Itinerary of Travel</Label>
        {isAddMode && (
          <Button
            type="button"
            size={"sm"}
            className="px-10"
            disabled={isPending}
            onClick={openAddModal}
          >
            Add
          </Button>
        )}
      </div>
      <section className="flex-col items-start gap-4 space-y-4">
        {itinerary.map((item, index) => (
          <Accordion
            type="single"
            collapsible
            key={index}
            className="w-full rounded-md border shadow-xs"
          >
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger className="px-4">
                Travel Iteration {index + 1}
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
