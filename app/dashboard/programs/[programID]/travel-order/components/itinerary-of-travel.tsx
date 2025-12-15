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
  departureDate?: string;
  returnDate?: string;
};
export default function ItineraryOfTravel({
  isAddMode,
  setItinerary,
  itinerary,
  isPending,
  departureDate,
  returnDate,
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
        departureDate={departureDate}
        returnDate={returnDate}
      />
    );
  };

  return (
    <section className="flex flex-col h-full">
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
      <div className="flex-1 overflow-y-auto min-h-0">
        <section className="flex-col items-start gap-4 space-y-4 pb-4">
          {itinerary.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No itinerary entries yet. Click "Add" to create one.
            </div>
          ) : (
            itinerary.map((item, index) => (
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
            ))
          )}
        </section>
      </div>
    </section>
  );
}
