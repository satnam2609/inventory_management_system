import Drawer from "@/components/drawer/Drawer";
import Nav from "@/components/nav/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100vh] w-screen flex overflow-hidden">
       
      <div className="h-full shrink-0">
        <Drawer />
      </div>

       
      <div className="flex flex-col h-full w-full min-h-0 overflow-hidden">
      
        <div className="shrink-0 px-3 sm:px-6 md:px-8 py-3">
          <Nav />
        </div>

        
        <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 md:px-8 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}
