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
import { Trash2 } from "lucide-react";

type ItineraryOfTravelProps = {
  isAddMode?: boolean;
  isEditMode?: boolean;
  setItineraryAction: React.Dispatch<
    React.SetStateAction<TravelOrderProjectsType[]>
  >;
  itinerary: TravelOrderProjectsType[];
  isPending?: boolean;
  departureDate?: string;
  returnDate?: string;
};

export default function ItineraryOfTravel({
  isAddMode,
  isEditMode,
  setItineraryAction,
  itinerary,
  isPending,
  departureDate,
  returnDate,
}: ItineraryOfTravelProps) {
  const { openModal, closeModal } = useModal();
  const isEditable = isAddMode || isEditMode;

  const openAddModal = () => {
    openModal(
      "Add Itinerary of Travel",
      "",
      <ItineraryForm
        onSubmit={(form) => {
          setItineraryAction((prev) => [...prev, form]);
          closeModal();
        }}
        departureDate={departureDate}
        returnDate={returnDate}
        isEditMode={false}
      />,
    );
  };

  const openEditModal = (item: TravelOrderProjectsType, index: number) => {
    openModal(
      isEditable ? "Edit Itinerary Entry" : "View Itinerary Entry",
      "",
      <ItineraryForm
        onSubmit={(form) => {
          if (isEditable) {
            setItineraryAction((prev) => {
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
        isEditMode={isEditable}
        readOnly={!isEditable}
      />,
    );
  };

  const handleDelete = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    openModal(
      "Remove Entry",
      "Are you sure you want to remove this itinerary entry?",
      <Button
        className="w-full"
        variant="destructive"
        onClick={() => {
          setItineraryAction((prev) => prev.filter((_, i) => i !== index));
          closeModal();
        }}
      >
        Remove
      </Button>,
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

  return (
    <section className="flex flex-col h-full">
      {isEditable && (
        <Button
          type="button"
          size="sm"
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
            {isEditable
              ? `No itinerary entries yet. Click "Add" to create one.`
              : "No itinerary entries."}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12.5">#</TableHead>
                  <TableHead>Date / Period</TableHead>
                  <TableHead className={isEditable ? "" : "text-end"}>
                    Destination
                  </TableHead>
                  {isEditable && <TableHead className="w-12" />}
                </TableRow>
              </TableHeader>
              <TableBody>
                {itinerary.map((item, index) => (
                  <TableRow
                    key={index}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => openEditModal(item, index)}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      {formatDate(item.date, item.end_date)}
                    </TableCell>
                    <TableCell
                      className={`max-w-50 truncate ${
                        isEditable ? "" : "text-end"
                      }`}
                    >
                      {item.destination || "-"}
                    </TableCell>
                    {isEditable && (
                      <TableCell className="text-end pr-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => handleDelete(e, index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
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
