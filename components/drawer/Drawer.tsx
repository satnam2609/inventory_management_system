"use client";

import {
  Category,
  Dashboard,
  Inventory,
  MoneyOffCsredRounded,
  ReceiptOutlined,
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export default function Drawer() {
  const { data: session } = useSession();
  const currentRoute = usePathname();
  const router = useRouter();

  function FieldComponent({
    title,
    icon,
    route,
  }: {
    title: string;
    icon: React.ReactNode;
    route: string;
  }) {
    return (
      <div
        className={`flex items-center gap-2 py-2 w-full ${
          route === currentRoute
            ? "bg-[#ccf369] text-[#0a0a0a]"
            : "bg-transparent"
        } px-4 rounded-lg ${
          route !== currentRoute ? "cursor-pointer hover:bg-[#366353]" : ""
        }`}
        onClick={() => router.push(route)}
      >
        <p>{icon}</p>
        <p>{title}</p>
      </div>
    );
  }

  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 bg-[#053625] rounded-tr-2xl rounded-br-2xl my-2 overflow-y-auto">
      <div className="px-3 py-10 flex flex-col gap-6 h-full">
        {/* Avatar & User Info */}
        <div className="flex flex-col items-center w-full gap-2">
          <Avatar
            sx={{ bgcolor: "#ccf369", width: 70, height: 70, fontSize: 35 }}
          >
            <p className="text-[#0a0a0a] font-bold">
              {session?.user?.name?.at(0)}
            </p>
          </Avatar>

          <div className="flex flex-col items-center text-center">
            <p className="text-2xl font-bold text-[#ededed]">
              {session?.user?.name?.split(" ")[0]}
            </p>
            <p className="text-lg text-[#c4bebe]">{session?.user?.role}</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="text-white w-full grid grid-rows-5 gap-3">
          <FieldComponent title="Dashboard" icon={<Dashboard />} route="/admin" />
          <FieldComponent title="Invoices" icon={<ReceiptOutlined />} route="/admin/invoices" />
          <FieldComponent title="Category" icon={<Category />} route="/admin/categories" />
          <FieldComponent title="Item" icon={<Inventory />} route="/admin/items" />
          <FieldComponent title="Purchase Order" icon={<MoneyOffCsredRounded />} route="/admin/purchase-order" />
        </nav>
      </div>
    </aside>
  );
}
