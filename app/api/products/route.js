import connectDb from "@/libs/config";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(request) {
  try {
    await connectDb();
    const { name, description, category, price, minCount } =
      await request.json();

    if (await Product.findOne({ slug: slugify(name) })) {
      return NextResponse.json(
        { message: "Product already exists", success: true },
        { status: 304 }
      );
    }

    return NextResponse.json({
      message: await Product.create({
        name,
        slug: slugify(name),
        description,
        category,
        price,
        minCount: parseInt(minCount),
      }),
      success: true,
    });
  } catch (error) {
    console.log("Product POST error", error);
    return NextResponse.json(
      { message: "Internal server error", success: true },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDb();
    const products = await Product.find({});
    return NextResponse.json({ message: products, success: true });
  } catch (error) {
    console.log("Product GET error", error);
    return NextResponse.json(
      { message: "Internal server error", success: true },
      { status: 500 }
    );
  }
}
