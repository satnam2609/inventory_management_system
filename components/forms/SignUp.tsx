"use client";

import { ChangeEvent, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { registerApi } from "@/functions/auth";
import { signIn } from "next-auth/react";

export default function SignUpForm() {
  const router = useRouter();
  const initialState = {
    userName: "",
    email: "",
    password: "",
  };
  const [value, setValue] = useState(initialState);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(ev: ChangeEvent<HTMLFormElement>) {
    setLoading(true);
    ev.preventDefault();
    try {
      const res = await registerApi(
        value.userName,
        value.email,
        value.password
      );
      if (res.status === 201) {
        try {
          await signIn("credentials", {
            email: value.email,
            password: value.password,
            redirect: false,
          });
        } catch (error) {
          console.log("SignIn failed with error: ", error);
        }
      } else {
        console.log("Try again!");
      }

      router.push("/employee");
    } catch (_error) {
      console.log("Register request failed with error");
    }

    setLoading(false);
    setValue(initialState);
  }

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    setValue({ ...value, [ev.target.name]: ev.target.value });
  }

  return (
    <form
      className="flex flex-col items-center justify-center space-y-3 py-2"
      onSubmit={handleSubmit}
    >
      <div className="flex justify-between items-center w-full space-x-2">
        <label htmlFor="userName">Username</label>
        <input
          type="text"
          name="userName"
          value={value.userName}
          className="outline-none bg-transparent border-b-[1px] border-[#121313] px-3 py-2"
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-between items-center w-full space-x-2">
        <label htmlFor="email">Email</label>
        <input
          type="email"
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
        <CircularProgress className="text-[#121313]" />
      ) : (
        <button className="w-full rounded-lg px-3 py-3 bg-[#121313] text-[#fff] ">
          Submit
        </button>
      )}

      <span className="flex items-center justify-center">
        <p className="text-sm">already have an account?</p>
        <Link href={"/"} className="text-sm underline">
          Sign In
        </Link>
      </span>
    </form>
  );
}
