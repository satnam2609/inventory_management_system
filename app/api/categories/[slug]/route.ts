import Category from "@/models/category";
import connect from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    const { slug } = await params;
    const { name } = await request.json();
    await connect();

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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } =await params;
    await connect();
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
