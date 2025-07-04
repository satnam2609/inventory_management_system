"use client";
import SignInForm from "@/components/forms/SignIn";
import Loader from "@/utils/Loader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/employee");
    }
  }, [status === "authenticated", router]);
  if (status === "loading") {
    return <div className="h-screen grid place-items-center">
      <Loader/>
    </div>;
  }
  return (
    <div className="h-screen grid place-items-center">
      <div className="shadow-xl border-t-4 border-[#121313] rounded-t-lg space-y-3 px-3">
        <p className="text-xl font-bold my-2">Sign In</p>
        <SignInForm />
      </div>
    </div>
  );
}
