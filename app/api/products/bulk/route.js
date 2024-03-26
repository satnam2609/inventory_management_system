import connectDb from "@/libs/config";
import Product from "@/models/Product";
import { productsInBulk } from "@/utils/products";
import { NextResponse } from "next/server";
import slugify from "slugify";

function calculateCost(price, count) {
  return Math.round((3 / 4) * price * count * 100).toString();
}

export async function GET() {
  try {
    await connectDb();
    const productsWithSlugs = productsInBulk.map((product) => ({
      ...product,
      slug: slugify(product.name),
      cost: calculateCost(product.price, product.count),
    }));

    await Product.insertMany(productsWithSlugs);
    return NextResponse.json(
      { message: "Added sample products in Bulk", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log("Inserting sample users in bulk failed", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await Product.updateMany(
      // Specify the filter criteria (you can adjust this based on your needs)
      {},
      // Set the 'threshold' field to a default value or to what makes sense for your application
      { $set: { minCount: 10 } },
      // Options (optional)
      { multi: true }
    );

    return NextResponse.json({
      message: "Updated successfully",
      success: true,
    });
  } catch (error) {
    console.log("Products bulk PUT error", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
    });
  }
}
