export default function RootPage() {
  console.log("RootPage component rendered");
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Loading...</h1>
        <p className="text-gray-600">
          Redirecting you to the appropriate page...
        </p>
      </div>
    </div>
  );
}
