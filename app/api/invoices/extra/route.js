import connectDb from "@/libs/config";
import Invoice from "@/models/Invoice";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDb();
    await Invoice.deleteMany({
      createdAt: {
        $gte: new Date("2024-04-22"),
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message });
  }
}
