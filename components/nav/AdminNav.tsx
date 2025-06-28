"use client";

import { Avatar } from "@mui/material";
import { signOut, useSession } from "next-auth/react";


import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import LogoutIcon from '@mui/icons-material/Logout';

import { useState } from "react";

export default function Nav() {
  const { data: session } = useSession();
  const [open,setOpen]=useState(false);

  const handleChange=()=>setOpen(!open);

  const handleSignOut=()=>{
    signOut()
  }
  return (
    <div className="mt-5 px-3 bg-[#ffffff] w-full rounded-full py-3">
      <div className="flex items-center justify-between w-full px-5">
        <div></div>

        <div className="flex items-center gap-2">
          <Avatar
            sx={{ bgcolor: "#053625", width: 50, height: 50, fontSize: 25 }}
          >
            {session?.user?.name.at(0)}
          </Avatar>
          <div>
            <p className="font-bold text-2xl">{session?.user.name}</p>
            <div className="flex items-center">
                <p className="text-lg font-light text-[#413f3f]">{session?.user.email}</p>
                <button className={`cursor-pointer transition-all font-bold`} onClick={handleChange}>
                    {open ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>} 
                </button>

                <div className={`absolute translate-x-10 translate-y-17 bg-[#0a0a0a0e] text-xl font-bold px-5 py-3 rounded-2xl ${!open && "invisible transition-all" } `}>
                    <button className="flex items-center gap-2 cursor-pointer" onClick={handleSignOut}>
                        <LogoutIcon/>
                        <p>Sign Out</p>
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
