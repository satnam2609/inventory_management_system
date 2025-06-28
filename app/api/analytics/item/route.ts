import Item from "@/models/item";
import Snapshot from "@/models/snapshot";
import connect from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import Invoice from "@/models/invoice";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connect();

    const currentDate = new Date();

    const millisecondsInSevenDays = 7 * 24 * 60 * 60 * 1000;

    const lastWeekDate = new Date(
      currentDate.getTime() - millisecondsInSevenDays
    );

    const invoices = await Invoice.find({
      order: true,
      createdAt: {
        $gt: lastWeekDate,
      },
    }).populate('items.product');

    const recentAddedItems=invoices.map((invoice:any)=>{
      const product=invoice.items[0].product;
      return {
        _id:product._id,
        name:product.name,
        cost:product.cost,
        qty:invoice.items[0].qty,
        date:new Date(invoice.createdAt).toLocaleString('default')
      }
    });

    recentAddedItems.sort((a:any,b:any)=>new Date(a.date).getTime()-new Date(b.date).getTime())


    
    return NextResponse.json(
      { message: recentAddedItems, success: false },
      { status: 200 }
    );
  } catch (error) {
    console.log("Analytics API error: ", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
