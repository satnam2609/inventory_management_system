import SignInForm from "@/components/form/SignInForm";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { currentUser } from "@/functions/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    const user = await currentUser(session.user?.email);
    redirect(user.role === "admin" ? "/admin" : "/employee");
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
