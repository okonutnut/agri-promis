"use client";

import Image from "next/image";
import NavbarUserImage from "./navbar-user-image";
import Link from "next/link";
import NotificationRequest from "../notifications/notification";

export default function MobileNavbar() {
  return (
    <header className="w-screen min-h-14 flex items-center justify-between px-3 border-b z-50 text-xs md:hidden sm:hidden">
      <Link href={"/"}>
        <Image src={"/logo.png"} width={40} height={40} alt="app_logo" />
      </Link>
      <span className="flex items-center gap-6">
        <NotificationRequest />
        <NavbarUserImage />
      </span>
    </header>
  );
}
