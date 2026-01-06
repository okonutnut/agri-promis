"use client";

import { TravelOrderProjectsType } from "@/components/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useModal } from "@/components/custom/layout/custom-page-layout";
import ItineraryForm from "./ItineraryForm";
import { format } from "date-fns";

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
        isEditMode={false}
      />
    );
  };

  const openEditModal = (item: TravelOrderProjectsType, index: number) => {
    openModal(
      isAddMode ? "Edit Itinerary Entry" : "View Itinerary Entry",
      "",
      <ItineraryForm
        onSubmit={(form) => {
          if (isAddMode) {
            setItinerary((prev) => {
              const updated = [...prev];
              updated[index] = form;
              return updated;
            });
          }
          closeModal();
        }}
        departureDate={departureDate}
        returnDate={returnDate}
        initialValues={item}
        isEditMode={isAddMode}
        readOnly={!isAddMode}
      />
    );
  };

  const formatDate = (dateStr?: string, endDateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const start = new Date(dateStr);
      const formattedStart = format(start, "MMM dd, yyyy");
      
      if (endDateStr && endDateStr !== dateStr) {
        const end = new Date(endDateStr);
        return `${formattedStart} - ${format(end, "MMM dd, yyyy")}`;
      }
      
      return formattedStart;
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "-";
    return timeStr;
  };

  return (
    <section className="flex flex-col h-full">
      {isAddMode && (
        <Button
          type="button"
          size={"sm"}
          className="px-10 mb-4"
          disabled={isPending}
          onClick={openAddModal}
        >
          Add
        </Button>
      )}
      <div className="flex-1 overflow-y-auto min-h-0">
        {itinerary.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No itinerary entries yet. Click &quot;Add&quot; to create one.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Date / Period</TableHead>
                  <TableHead className="text-end">Destination</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itinerary.map((item, index) => (
                  <TableRow
                    key={index}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => openEditModal(item, index)}
                  >
                    <TableCell className="font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell>{formatDate(item.date, item.end_date)}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-end">
                      {item.destination || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </section>
  );
}
