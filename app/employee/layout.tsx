import Nav from "@/components/nav/AdminNav";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen   flex items-center">
      <div className="flex flex-col items-start h-screen w-full px-4">
        <Nav />
        {children}
      </div>
    </div>
  );
}
