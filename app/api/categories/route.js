import Category from "@/models/Category";
import connectDb from "@/libs/config";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(request) {
  try {
    const { name } = await request.json();

    await connectDb();

    const slug = slugify(name);

    if (await Category.findOne({ slug })) {
      return NextResponse.json(
        { message: "Category already exists", success: true },
        { status: 304 }
      );
    }
    const category = await Category.create({ name, slug });
    return NextResponse.json(
      { message: category, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.log("Category POST error", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDb();

    const categories = await Category.find({});
    return NextResponse.json(
      { message: categories, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log("Category GET error", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
