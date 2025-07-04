"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Loader from "@/utils/Loader";

type user = {
  email: string;
  password: string;
};

export default function SignInForm() {
  const initialState: user = { email: "", password: "" };
  const [value, setValue] = useState<user>(initialState);
  const [loading, setLoading] = useState(false);

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    ev.preventDefault();
    setValue({ ...value, [ev.target.name]: ev.target.value });
  }

  async function handleSubmit(ev: ChangeEvent<HTMLFormElement>) {
    ev.preventDefault();
    console.log("Value is ",value)
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: value.email,
        password: value.password,
        redirect: false,
      });

      if (res?.error) {
        console.log(res?.error);
        setLoading(false);

        setValue(initialState);
        return;
      } else if (res?.ok) {
        setLoading(false);
        setValue(initialState);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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
          value={value.email}
          className="outline-none bg-transparent border-b-[1px] border-[#121313] px-3 py-2"
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-between items-center w-full space-x-2">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={value.password}
          className="outline-none bg-transparent border-b-[1px] border-[#121313] px-3 py-2"
          onChange={handleChange}
        />
      </div>

      {loading ? (
        <Loader/>
      ) : (
        <button
          type="submit"
          className="w-full cursor-pointer rounded-lg px-3 py-3 bg-[#121313] text-[#fff] "
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
