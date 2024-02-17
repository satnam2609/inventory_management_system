import Invoice from "@/models/Invoice";
import connectDb from "@/libs/config";
import { NextResponse } from "next/server";
import moment from "moment";

export async function POST(request) {
  try {
    const { code } = await request.json();
    await connectDb();
    let salesData = [];
    const invoices = await Invoice.find({
      type: false,
    });

    if (code === 2) {
      salesData = invoices.reduce((result, invoice) => {
        const dateVal = new Date(invoice.createdAt).toISOString().split("T")[0];
        const dateKey = moment(dateVal.split("-")[1]).format("MMMM");
        let existingEntry = result.find((item) => item.x === dateKey);
        if (existingEntry) {
          existingEntry.y += Math.round(invoice.grandTotal);
        } else {
          result.push({
            x: dateKey,
            y: Math.round(invoice.grandTotal),
          });
        }
        return result;
      }, []);
    } else {
      salesData = invoices.reduce((result, invoice) => {
        const dateKey = new Date(invoice.createdAt).toISOString().split("T")[0];

        let existingEntry = result.find((item) => item.x === dateKey);
        if (existingEntry) {
          existingEntry.y += Math.round(invoice.grandTotal);
        } else {
          result.push({
            x: String(dateKey),
            y: Math.round(invoice.grandTotal),
          });
        }
        return result;
      }, []);
    }

    return NextResponse.json({
      message: [
        {
          id: "Revenue",
          data: salesData,
        },
      ],
    });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
