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
      { $skip: (currentPage - 1) * perPage },
      { $limit: perPage },
    ]);

    total = await Product.countDocuments([
      {
        $match: {
          $expr: { $gte: ["$minCount", "$count"] },
        },
      },
    ]);

    if (productsLists.length) {
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
