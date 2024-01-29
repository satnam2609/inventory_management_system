import connectDb from "@/libs/config";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userName, email, password } = await request.json();
    await connectDb();

    //check for the existing user
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return NextResponse.json(
        {
          message: "User already exists",
          success: false,
        },
        {
          status: 304,
        }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ userName, email, password: hashedPassword });
    return NextResponse.json(
      { message: "User registered", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.log("User registration failed", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
