import connectDb from "@/libs/config";
import { NextResponse } from "next/server";
import Invoice from "@/models/Invoice";

export async function POST(request) {
  try {
    const { page } = await request.json();
    const perPage = 5;
    const currentPage = page || 1;

    await connectDb();

    const recentlyOrdered = await Invoice.find({
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
      },
    })
      .populate("products.product")
      .limit(perPage)
      .skip((currentPage - 1) * perPage);

    const total = await Invoice.find({
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
      },
    }).estimatedDocumentCount();

    return NextResponse.json({
      message: {
        invoices: recentlyOrdered,
        total: total,
      },
      success: true,
    });
  } catch (error) {
    console.log("Purchase order error", error);
    return NextResponse.json(
      { message: "Internal server error", success: true },
      { status: 500 }
    );
  }
}
