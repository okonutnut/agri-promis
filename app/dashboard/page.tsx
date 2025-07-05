export default function Home() {
  return (
    <div className="w-full h-screen grid grid-cols-5">
      <section className="border-r p-4 col-span-4 overflow-y-auto">
        <h1 className="text-2xl font-bold text-primary uppercase">Dashboard</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="border p-4">
            <h1>Left Section</h1>
          </div>
        </div>
      </section>
      <section className="p-4 col-span-1 border-l">
        <h1 className="text-2xl font-bold text-primary uppercase">Right Section</h1>
      </section>
    </div>
  );
}
