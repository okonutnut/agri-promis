import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import GoogleSignInButton from "./google-login";

export default function LoginCard() {
  return (
    <section className="min-h-screen w-full md:w-[30%] md:shrink-0 flex items-center justify-center">
      <Card className="p-8 w-full max-w-xl gap-2 mx-4 border-none shadow-none">
        <CardHeader>
          <Image
            src="/favicon.svg"
            alt="app-logo"
            width={200}
            height={200}
            className="mx-auto"
            priority
            fetchPriority="high"
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
          <GoogleSignInButton />
        </CardContent>
        <p className="text-center text-xs text-gray-500">version 1.0-dev</p>
      </Card>
    </section>
  );
}
