import Item from "@/models/item";
import connect from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { page } = await request.json();
    const perPage = 8;
    const currentPage = page || 1;

    await connect();

    const total=await Item.find({}).estimatedDocumentCount();
    require('@/models/category')
    const products = await Item.find({}).populate("category")
      .limit(perPage)
      .skip((currentPage-1)*perPage);
    return NextResponse.json(
      { message: {products,total}, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to fetch items by pagination with error: ", error);
    return NextResponse.json(
      { message: "Internal sever error", success: false },
      { status: 500 }
    );
  }
}
