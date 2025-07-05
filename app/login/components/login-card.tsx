import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

export default function LoginCard({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Card className="p-8 w-full gap-2 mx-4 border-none shadow-none">
        <CardHeader>
          <Image
            src="/logo.png"
            alt="Agri-ProMIS"
            width={200}
            height={200}
            className="mx-auto"
          />
        </CardHeader>
        <CardContent>
          <h1 className="md:hidden text-3xl font-bold text-center mb-4 text-primary uppercase">
            Agri-ProMIS <br />
            <p className="text-primary text-sm text-center italic">
              &quot;Enhancing Agricultural Project Management&quot;
            </p>
          </h1>
          <h1 className="text-sm font-medium text-center mb-2">
            Sign in to your account
          </h1>
          {children}
        </CardContent>
        <p className="text-center text-xs text-gray-500">version 0.0.1-dev</p>
      </Card>
    </>
  );
}
