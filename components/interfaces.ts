export interface LocationData {
  latitude: number | undefined;
  longitude: number | undefined;
  locationName: string | undefined;
  error: string | undefined;
}

export interface ImageData {
  id: string;
  src: string;
  file: File;
  dateTimeCaptured: string;
}

export interface CropDiseaseData {
  title: string;
  description?: string;
  possibleSolution: string[];
}
