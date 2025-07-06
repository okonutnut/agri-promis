import { Loader2 } from "lucide-react";
import { GetUserRole } from "./actions";

export default async function RootPage() {
  await GetUserRole();
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-primary text-lg font-bold">Please wait...</p>
    </div>
  );
}
