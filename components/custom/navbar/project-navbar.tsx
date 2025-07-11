export default function ProjectNavbar({
  pageTitle,
}: Readonly<{
  pageTitle: string;
}>) {
  return (
    <nav className="flex items-center justify-between w-full h-16 px-4 bg-white border-b border-gray-200">
      <h1 className="text-lg font-semibold text-gray-800">{pageTitle}</h1>
      <div className="flex items-center space-x-4">
        {/* Add any additional navigation items or buttons here */}
      </div>
    </nav>
  );
}
