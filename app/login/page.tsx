import Image from "next/image";
import LoginCard from "./components/login-card";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-10">
      <section className="relative hidden overflow-hidden md:col-span-7 md:block">
        <Image
          src="/login-bg.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 768px) 70vw, 0vw"
          priority
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex flex-col items-center justify-center gap-2">
          <h1 className="text-white text-4xl font-bold text-center max-w-[80%] mb-4">
            Agricultural Project Monitoring and Implementation System
            (Agri-ProMIS)
          </h1>
          <p className="text-white text-md text-center italic">
            &quot;Enhancing Agricultural Project Management&quot;
          </p>
        </div>
      </section>
      <LoginCard />
    </div>
  );
}
