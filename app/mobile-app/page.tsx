"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomPageLayout from "@/components/custom/layout/custom-page-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MobileAppPage() {
  const url = process.env.NEXT_PUBLIC_MOBILE_APP_URL ?? "#";

  return (
    <CustomPageLayout noSidebar className="p-0">
      <Card className="mx-auto w-full md:w-lg shadow-none md:shadow-xs border-0 md:border">
        <CardContent className="p-2">
          <CardHeader className="border-b space-y-2 mb-6">
            <CardTitle className="uppercase text-primary text-xl">
              Agri-ProMIS Mobile App
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <span>
                    The Agri-ProMIS mobile app is designed to enhance the user
                    experience by providing easy access to project data and
                    functionalities on-the-go.
                  </span>
                </li>
                <li>
                  <span>
                    Support offline access and synchronization of data when
                    connectivity is restored.
                  </span>
                </li>
                <li>
                  <span>
                    Can capture and upload images directly from the
                    device&apos;s camera with tagged geolocation and date time.
                  </span>
                </li>
              </ul>
            </CardDescription>
          </CardHeader>
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full">Download</Button>
          </Link>
        </CardContent>
      </Card>
    </CustomPageLayout>
  );
}
