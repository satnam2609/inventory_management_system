import Invoice from "@/models/invoice";
import connect from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { dateRange }:{dateRange:string[]} = await request.json();
    await connect();

   

    if (dateRange[0] !=='' && dateRange[1]!=='') {
      const invoices = await Invoice.find({
        createdAt: {
          $gt: dateRange[0],
          $lt: dateRange[1],
        },
      });

      return NextResponse.json(
        { message: invoices, success: true },
        { status: 200 }
      );
    } else {
      const invoices = await Invoice.find({});
      return NextResponse.json(
        { message: invoices, success: true },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("Invoices fetching failed with error: ", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
