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

export async function PUT(request) {
  try {
    const { startDate, endDate } = await request.json();
    await connectDb();

    let invoices;

    if (startDate || endDate) {
      const dateRangeQuery = {};

      if (startDate) {
        dateRangeQuery.$gte = new Date(startDate);
      }
      if (endDate) {
        dateRangeQuery.$lte = new Date(endDate);
      }
      invoices = await Invoice.find({
        type: false,
        createdAt: dateRangeQuery,
      });
    } else {
      invoices = await Invoice.find({ type: false });
    }

    const netSalesUnit = invoices.reduce((total, invoice) => {
      invoice.products.map((p) => {
        total += p.quantity;
      });

      return total;
    }, 0);

    return NextResponse.json({ message: netSalesUnit, success: true });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
