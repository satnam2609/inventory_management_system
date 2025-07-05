import Snapshot from "@/models/snapshot";
import connect from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";

function generateRandomGreenShade() {
   
    const hue = 150;
    const saturation = 90;
    const lightness = Math.floor(Math.random() * 40) + 10;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  
}

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    await import("@/models/category");
    await connect();

    const currentDate = new Date();

    const prevMonthDate = currentDate;
    prevMonthDate.setMonth(
      currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1
    );

    const snapshots = await Snapshot.find({
      createdAt: {
        $gt: prevMonthDate,
      },
    }).populate({
      path: "item",
      populate: {
        path: "category",
      },
    });

    console.log(snapshots);

    const data: any[] = [],
      baseObj: any = {};
    snapshots.forEach((snapshot: any) => {
      let key = snapshot.item.category.name;
      let value = baseObj[key] || 0;
      baseObj[key] = value + snapshot.soldPrice * snapshot.soldAmount;
    });

    Object.entries(baseObj).forEach(([category, value]) => {
      data.push({
        id: category,
        label: category,
        value,
        color: generateRandomGreenShade(),
      });
    });

    return NextResponse.json({
      message: data,
      success: true,
    });
  } catch (error) {
    console.log("Analytics API error: ", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
