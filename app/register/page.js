import SignUpForm from "@/components/form/SignUpForm";

export default async function Register() {
  return (
    <div className="h-screen grid place-items-center">
      <div className="shadow-xl border-t-4 border-[#006064] rounded-t-lg space-y-3 px-3">
        <p className="text-xl font-bold my-2">Sign Up</p>
        <SignUpForm />
      </div>
    </div>
  );
}
