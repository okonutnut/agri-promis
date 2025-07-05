import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        <Card className="bg-white p-8 rounded-lg shadow-md w-full max-w-md gap-2 mx-4">
          <CardHeader>
            <Image
              src="/logo.png"
              alt="Agri-ProMIS"
              width={150}
              height={150}
              className="mx-auto"
            />
          </CardHeader>
          <CardContent>
            <h1 className="text-3xl mb-4 font-bold text-center uppercase text-primary">
              Agri-ProMIS
            </h1>
            <h1 className="text-sm font-medium text-center">
              Sign in to your account
            </h1>
            <form>
              <Button
                type="submit"
                className="flex items-center gap-2 cursor-pointer my-3 w-full"
                variant={"outline"}
              >
                <Image
                  src="/google-icon.png"
                  alt="Google"
                  width={20}
                  height={20}
                />
                Login with Google
              </Button>
            </form>
          </CardContent>
          <p className="text-center text-xs text-gray-500">version: 0.0.1</p>
        </Card>
      </div>
    </>
  );
}
