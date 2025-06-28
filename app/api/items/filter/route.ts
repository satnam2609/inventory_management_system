import Item from "@/models/item";
import connect from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const search: string | null = request.nextUrl.searchParams.get("search");

    await connect();

    if (search === null || search === "") {
      const products = await Item.find({
        inventory:{
          $gt:0
        }
      });
      return NextResponse.json(
        { message: products, success: true },
        { status: 200 }
      );
    }

    const products = await Item.find({
      $text: { $search: search },
      inventory: {
        $gt: 0,
      },
    });

    return NextResponse.json(
      { message: products, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log("Filtering products failed with error: ", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
