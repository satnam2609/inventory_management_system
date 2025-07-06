import Drawer from "@/components/drawer/Drawer";
import Nav from "@/components/nav/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen flex items-center">
      <Drawer />
      <div className="flex flex-col items-start h-screen w-full px-8 gap-4 md:gap-2 lg:gap-4">
        <Nav />
        {children}
      </div>
    </div>
  );
}
