import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SummaryCardsProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
};
export default function SummaryCard({
  title,
  description,
  children,
}: SummaryCardsProps) {
  return (
    <Card className="p-3 min-w-sm">
      <CardHeader className="p-0">
        <CardTitle className="uppercase">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}
