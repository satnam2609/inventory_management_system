"use client";

import SignInForm from "@/components/form/SignInForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.push("/employee");
  }

  return (
    <div className="h-screen grid place-items-center">
      <div className="shadow-xl border-t-4 border-[#006064] rounded-t-lg space-y-3 px-3">
        <p className="text-xl font-bold my-2">Sign In</p>
        <SignInForm />
      </div>
    </div>
  );
}
