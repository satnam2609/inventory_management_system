"use client";

import { Avatar } from "@mui/material";
import { signOut, useSession } from "next-auth/react";

export default function Drawer() {
  const { data: session } = useSession();

  return (
    <div className="h-[96vh] bg-[#0a0a0a] rounded-2xl ml-6 w-3xs">
      <div className="px-3 py-10 m-auto flex flex-col items-center gap-4">
        <div className="flex flex-col items-center w-full gap-2">
          <Avatar
            sx={{ bgcolor: "#053625", width: 70, height: 70, fontSize: 35 }}
          >
            {session?.user?.name.at(0)}
          </Avatar>

          <div className="flex flex-col items-center ">
            <p className="text-2xl font-bold text-[#ededed]">
              {session?.user.name.split(" ")[0]}
            </p>
            <p className="text-lg  text-[#c4bebe]">{session?.user.role}</p>
          </div>
        </div>

        <div className="grid text-white"></div>
      </div>
    </div>
  );
}
