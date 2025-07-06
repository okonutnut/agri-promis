import Navbar from "@/components/custom/navbar";

export default function Home() {
  return (
    <>
      <Navbar pageTitle="Dashboard" />
      <div className="w-full h-screen grid grid-cols-5">
        <section className="border-r p-4 col-span-4 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="border p-4">
              <h1>Left Section</h1>
            </div>
          </div>
        </section>
        <section className="p-4 col-span-1 shadow-lg">
          <h1 className="text-sm font-medium text-primary">Properties</h1>
        </section>
      </div>
    </>
  );
}
