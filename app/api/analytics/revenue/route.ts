import Snapshot from "@/models/snapshot";
import connect from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";

function getTimeInterval(isMonth: boolean, time: string): string {
  if (isMonth) {
    // Month wise
    return new Date(time).toLocaleString("default", { month: "long" });
  } else {
    // Yearly
    return new Date(time).toLocaleString("default", { year: "numeric" });
  }
}

interface Data{
    month:string,
    revenue:number
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { isMonth } = await request.json();

    const label=isMonth?"Month":"Year"

    await connect();

    const snapshots = await Snapshot.find({});

    let data:Data[] = [],
      baseObj: any = {};

    snapshots.forEach((snapshot: any) => {
      const key = getTimeInterval(isMonth, snapshot.createdAt);
      const revenueOfKey = baseObj[key] || 0;
      baseObj[key] = revenueOfKey + snapshot.soldPrice * snapshot.soldAmount;
    });

    Object.entries(baseObj).forEach(([month, revenue]) => {
      data.push({
        month,
        revenue:revenue as number,
        
      });
    });

    return NextResponse.json(
      { message: data, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error is ", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
