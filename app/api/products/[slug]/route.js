import connectDb from "@/libs/config";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function PUT(request, { params }) {
  try {
    await connectDb();
    const { slug } = params;
    const reqBody = await request.json();
    if (!(await Product.findOne({ slug }))) {
      return NextResponse.json(
        { message: "Product not found", success: true },
        { status: 304 }
      );
    } else {
      const product = await Product.findOneAndUpdate(
        { slug },
        { ...reqBody, slug: slugify(reqBody.name) },
        { new: true }
      );
      return NextResponse.json({ message: product, success: true });
    }
  } catch (error) {
    console.log("Product PUT error", error);
    return NextResponse.json(
      { message: "Internal server error", success: true },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDb();
    const { slug } = params;
    if (!(await Product.findOne({ slug }))) {
      return NextResponse.json(
        { message: "Product not found", success: true },
        { status: 304 }
      );
    } else {
      const product = await Product.findOneAndDelete({ slug }, { new: true });
      return NextResponse.json({ message: product, success: true });
    }
  } catch (error) {
    console.log("Product DELETE error", error);
    return NextResponse.json(
      { message: "Internal server error", success: true },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    await connectDb();
    const { slug } = params;
    const product = await Product.findOne({ slug });

    return NextResponse.json({ message: product, success: true });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
    });
  }
}
