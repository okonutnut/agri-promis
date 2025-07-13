import { useSelectLocationByID } from "@/components/hooks";

export function GetLocation({ projectID }: { projectID: string }) {
  const {
    data: locationData,
    isLoading,
    isError,
  } = useSelectLocationByID(projectID);
  return (
    <p className="font-mono">
      {isLoading
        ? "Loading location..."
        : isError
        ? "Error fetching location"
        : `${locationData?.province} | ${locationData?.barangay},
            ${locationData?.municipality}`}
    </p>
  );
}
