"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInForm() {
  const router = useRouter();
  const { data: session } = useSession();
  let initialState = {
    email: "",
    password: "",
  };
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(ev) {
    ev.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res.error) {
        console.log(res.error);
        setLoading(false);

        setValues(initialState);
        return;
      } else if (res.ok) {
        setLoading(false);
        setValues(initialState);
        // currentUser(session?.user.email).then((res) => {
        //   setValues(initialState);
        //   setLoading(false);
        //   if (res) {
        //     const route = res?.role;
        //     router.push(route + "/invoices");
        //   }
        // });
      }

      // router.push("/dashboard");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  function handleChange(ev) {
    setValues({ ...values, [ev.target.name]: ev.target.value });
  }

  return (
    <form
      className="flex flex-col items-center justify-center space-y-3 py-2"
      onSubmit={handleSubmit}
    >
      <div className="flex justify-between items-center w-full space-x-2">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          value={values.email}
          className="outline-none bg-transparent border-b-[1px] border-[#006064] px-3 py-2"
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-between items-center w-full space-x-2">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={values.password}
          className="outline-none bg-transparent border-b-[1px] border-[#006064] px-3 py-2"
          onChange={handleChange}
        />
      </div>

      {loading ? (
        <CircularProgress className="text-[#00e5ff]" />
      ) : (
        <button
          type="submit"
          className="w-full rounded-lg px-3 py-3 bg-[#006064] text-[#fff] "
        >
          Submit
        </button>
      )}

      <span className="flex items-center justify-center">
        <p className="text-sm">don't have an account?</p>
        <Link href={"/register"} className="text-sm underline">
          Sign up
        </Link>
      </span>
    </form>
  );
}
