import Invoice from "@/models/invoice";
import Snapshot from "@/models/snapshot";
import connect from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import Item from "@/models/item";

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    await connect();

    const currentDate = new Date();

    const prevYearsDate = new Date(currentDate);
    prevYearsDate.setFullYear(currentDate.getFullYear() - 1);

    const snapshots = await Snapshot.find({
      createdAt: {
        $gt: prevYearsDate,
        $lt: currentDate,
      },
    });

    const totalRevenue = snapshots.reduce((sale, snapshot) => {
      return (
        sale + parseFloat(snapshot.soldPrice) * parseInt(snapshot.soldAmount)
      );
    }, 0);

    const invoices = await Invoice.find({
      order: true,
      createdAt: {
        $gt: prevYearsDate,
        $lt: currentDate,
      },
    });

    const totalCOGS = invoices.reduce((total, inv) => {
      return total + inv.grandTotal;
    }, 0);

    const margin = ((totalRevenue - totalCOGS) * 100) / totalRevenue;

    const items = await Item.find({
      inventory: {
        $gt: 0,
      },
    });

    const outOfStocks = items.reduce((val, item) => {
      return val + item.inventory === 0 ? 1 : 0;
    }, 0);

    const inStocks= items.reduce((val, item) => {
      return val + item.inventory;
    },0);

    const lowStocks=items.reduce((val,item)=>{
      return val + item.inventory < item.minCount ? 1:0;
    },0)

    const currentInventory = items.reduce((inv, item) => {
      return inv + item.inventory * item.cost;
    }, 0);

    const totalSoldAmount = snapshots.reduce((sale, snap) => {
      return sale + snap.soldAmount * snap.soldPrice;
    }, 0);

    const avgInventory = (currentInventory * 2 + totalSoldAmount) / 2;

    return NextResponse.json({
      message: {
        totalRevenue: totalRevenue,
        totalCOGS: totalCOGS,
        margin: margin.toFixed(2),
        avgInventory: avgInventory || 0,
        outOfStocks,
        inStocks,
        lowStocks
      },
      success: true,
    });
  } catch (error) {
    console.log("Analytics error ", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
