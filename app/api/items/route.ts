import connect from "@/libs/db";
import Item from "@/models/item";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await connect();
    const { name,category,cost, price, minCount } = await req.json();

    if (await Item.findOne({ slug: slugify(name) })) {
      return NextResponse.json(
        { message: "Product already exists", success: true },
        { status: 304 }
      );
    }

    return NextResponse.json({
      message: await Item.create({
        name,
        slug: slugify(name),
        category,
        cost,
        price,
        minCount: parseInt(minCount),
      }),
      success: true,
    });
  } catch (error) {
    console.log("Item POST error", error);
    return NextResponse.json(
      { message: "Internal server error", success: true },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    await connect();
    const products = await Item.find({}).populate("category");
    return NextResponse.json({ message: products, success: true });
  } catch (error) {
    console.log("Item GET error", error);
    return NextResponse.json(
      { message: "Internal server error", success: true },
      { status: 500 }
    );
  }
}
