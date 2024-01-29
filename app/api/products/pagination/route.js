import connectDb from "@/libs/config";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { page } = await request.json();
    const perPage = 6;
    const currentPage = page || 1;
    await connectDb();
    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    const totalProducts = await Product.find({}).estimatedDocumentCount();

    return NextResponse.json(
      { products, total: totalProducts, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log("product pagination error", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
