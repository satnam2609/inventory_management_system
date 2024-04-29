import connectDb from "@/libs/config";
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
          $expr: {
            $gte: ["$minCount", "$initialInventory" + "$purchasesDuringPeriod"],
          },
        },
      },
      { $skip: (currentPage - 1) * perPage },
      { $limit: perPage },
    ]);

    total = await Product.countDocuments({
      $expr: {
        $gte: ["$minCount", "$initialInventory" + "$purchasesDuringPeriod"],
      },
    });

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
      message: "No products reached the threshold",
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
