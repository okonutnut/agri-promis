import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

type NonFormMultiInputProps = {
  label: string;
  values?: any | null;
};
export default function NonFormMultiInput({
  values,
  label,
}: NonFormMultiInputProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {values?.slice(1).map((issue: string, index: number) => (
          <Badge
            key={index}
            variant={"outline"}
            className="flex items-center gap-1 bg-secondary rounded-full px-3 py-1"
          >
            <span className="text-sm">{issue}</span>
          </Badge>
        ))}
      </div>
    </div>
  );
}
