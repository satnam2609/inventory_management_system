"use client";

import SignUpForm from "@/components/forms/SignUp";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const { status } = useSession();

  if (status === "authenticated") {
    router.push("/employee");
  }
  return (
    <div className="h-screen grid place-items-center">
      <div className="shadow-xl border-t-4 border-[#121313] rounded-t-lg space-y-3 px-3">
        <p className="text-xl font-bold my-2">Sign Up</p>
        <SignUpForm />
      </div>
    </div>
  );
}
