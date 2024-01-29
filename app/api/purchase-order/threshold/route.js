import connectDb from "@/libs/config";
import User from "@/models/User";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { page } = await request.json();
    const perPage = 5;
    const currentPage = page || 1;
    await connectDb();

    let productsLists = [],
      total = 0;
    productsLists = await Product.aggregate([
      {
        $match: {
          $expr: { $gte: ["$minCount", "$count"] },
        },
      },
    ])
      .limit(perPage)
      .skip((currentPage - 1) * perPage);

    total = productsLists.length;

    if (productsLists.length > 0) {
      return NextResponse.json({
        message: {
          thresholds: productsLists,
          total: total,
        },
        success: true,
      });
    }
    return NextResponse.json({
      message: "None product reached threshold",
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
