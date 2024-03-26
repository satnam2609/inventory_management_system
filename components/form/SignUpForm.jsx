"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { TextField, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { message } from "antd";
import Link from "next/link";
import { registerApi } from "@/functions/auth";

export default function SignUpForm() {
  const router = useRouter();
  let initialState = {
    userName: "",
    email: "",
    password: "",
  };
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(ev) {
    setLoading(true);
    ev.preventDefault();
    const res = await registerApi(
      values.userName,
      values.email,
      values.password
    );
    if (res.success) {
      message.success("User registered");
    } else {
      message.error("Try again");
    }

    setLoading(false);
    setValues(initialState);
    router.push("/employee");
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
        <label htmlFor="userName">Username</label>
        <input
          type="text"
          name="userName"
          value={values.userName}
          className="outline-none bg-transparent border-b-[1px] border-[#006064] px-3 py-2"
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-between items-center w-full space-x-2">
        <label htmlFor="email">Email</label>
        <input
          type="email"
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
        <button className="w-full rounded-lg px-3 py-3 bg-[#006064] text-[#fff] ">
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
