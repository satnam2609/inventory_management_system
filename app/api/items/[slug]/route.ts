import Item from "@/models/item";
import connect from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { console } from "inspector";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    const { slug } = await params;
    const reqBody = await request.json();

    await connect();

    if (!Item.findOne({ slug })) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 304 }
      );
    }

    const product = await Item.findOneAndUpdate(
      { slug },
      { ...reqBody, slug: slugify(reqBody.name) },
      { new: true }
    );
    return NextResponse.json({ message: product, success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connect();
    const product = await Item.findOneAndDelete({ slug }, { new: true });
    if (product) {
      return NextResponse.json(
        { message: product, success: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Product not found", success: true },
        { status: 304 }
      );
    }
  } catch (error) {
    console.log("Product POST error", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    const { slug } = await params;
    await connect();

    const product = await Item.findOne({ slug });
    if (product) {
      return NextResponse.json(
        { message: product, success: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log("Product with slug fetching failed with error: ", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
