import connectDb from "@/libs/config";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

async function handleCategoryWithPagination(perPage, currentPage, category) {
  await connectDb();

  const products = await Product.find({ category: category })
    .skip((currentPage - 1) * perPage)
    .limit(perPage);
  const total = await Product.countDocuments({
    category: category,
  });
  return { products, total };
}

export async function POST(request) {
  try {
    let result;
    const { page, category } = await request.json();
    const perPage = 6;
    const currentPage = page || 1;
    if (category) {
      result = await handleCategoryWithPagination(
        perPage,
        currentPage,
        category
      );

      return NextResponse.json({ message: result, success: true });
    }
    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    const total = await Product.countDocuments({});
    return NextResponse.json({ message: { products, total }, success: true });
  } catch (error) {
    console.log("Filter error", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
