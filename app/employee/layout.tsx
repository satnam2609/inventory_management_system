import Nav from "@/components/nav/AdminNav";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
 
      <div className="flex flex-col items-start h-screen w-full px-4 gap-4 lg:gap-3">
        <Nav />
        {children}
      </div>
  
  );
}
