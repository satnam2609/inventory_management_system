import Invoice from "@/models/Invoice";
import connectDb from "@/libs/config";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectDb();
    const invoice = await Invoice.findOne({ _id: id }).populate(
      "products.product"
    );
    return NextResponse.json({ message: invoice, success: true });
  } catch (error) {
    console.log("Invoice error", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
