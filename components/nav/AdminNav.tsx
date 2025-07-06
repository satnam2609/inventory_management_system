"use client";

import { Avatar } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import Image from "next/image";

export default function Nav() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const handleToggleDropdown = () => setOpen((prev) => !prev);
  const handleSignOut = () => signOut({ callbackUrl: "/" });

  return (
    <nav className="mt-5 px-4 bg-white w-full rounded-full py-3 shadow-md">
      <div className="flex items-center justify-between flex-wrap px-5 gap-3">
        {/* Logo */}
        <div className="flex items-center gap-3 min-w-0">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <p className="text-xl md:text-2xl font-bold truncate">Invexa</p>
        </div>

        {/* Profile */}
        <div className="relative flex items-center gap-3 min-w-0">
          <Avatar
            sx={{ bgcolor: "#053625", width: 45, height: 45, fontSize: 20 }}
          >
            {session?.user?.name?.[0]}
          </Avatar>

          <div className="flex flex-col min-w-0">
            <p className="font-semibold text-base md:text-lg truncate max-w-[150px]">
              {session?.user?.name}
            </p>

            <div className="flex items-center gap-1 min-w-0">
              <p className="text-sm text-gray-600 truncate max-w-[200px]">
                {session?.user?.email}
              </p>
              <button className="cursor-pointer" onClick={handleToggleDropdown}>
                {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </button>
            </div>
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-[65px] bg-[#ededed] text-base font-semibold px-5 py-3 rounded-2xl shadow-xl z-50 min-w-max">
              <button
                className="flex items-center gap-2 text-[#111] hover:opacity-80"
                onClick={handleSignOut}
              >
                <LogoutIcon />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
