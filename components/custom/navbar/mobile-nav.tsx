import Image from "next/image";
import NavbarUserImage from "./navbar-user-image";
import Link from "next/link";

export default function MobileNavbar() {
  return (
    <header className="w-screen min-h-12 flex items-center justify-between px-3 bg-white border-b border-gray-200 z-50 text-xs md:hidden sm:hidden">
      <Link href={"/"}>
        <Image src={"/logo.png"} width={40} height={40} alt="app_logo" />
      </Link>
      <NavbarUserImage />
    </header>
  );
}
