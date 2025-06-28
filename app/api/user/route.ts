import connect from "@/libs/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { name, email, password } = await request.json();

    await connect();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!(await User.findOne({ email }))) {
      return NextResponse.json(
        {
          message: await User.create({
            name,
            email,
            password: hashedPassword,
          }),
        },
        {
          status: 201,
        }
      );
    } else {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 304 }
      );
    }
  } catch (error) {
    console.error("Error occured while registering user. Error: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
