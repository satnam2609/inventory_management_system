import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDb from "@/libs/config";

export async function POST(req) {
  try {
    const { email } = await req.json();

    await connectDb();
    const userRole = await User.findOne({ email }).select("role");

    return NextResponse.json({ message: userRole, success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" });
  }
}
