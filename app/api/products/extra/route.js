import Product from "@/models/Product";
import connectDb from "@/libs/config";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDb();
    await Product.updateMany({}, { purchasesDuringPeriod: 10 }, { new: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: error.message });
  }
}
