import Category from "@/models/Category";
import connectDb from "@/libs/config";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const { name } = await request.json();
    await connectDb();

    const category = await Category.findOneAndUpdate(
      { slug },
      { name, slug: slugify(name) },
      { new: true }
    );

    if (category) {
      return NextResponse.json({ message: category, success: true });
    } else {
      return NextResponse.json(
        { message: "Category not found", success: true },
        { status: 304 }
      );
    }
  } catch (error) {
    console.log("Category POST error", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { slug } = params;
    await connectDb();
    const category = await Category.findOneAndDelete({ slug }, { new: true });
    if (category) {
      return NextResponse.json(
        { message: category, success: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Category not found", success: true },
        { status: 304 }
      );
    }
  } catch (error) {
    console.log("Category POST error", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
