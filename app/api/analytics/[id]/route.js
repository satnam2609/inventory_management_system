import Invoice from "@/models/Invoice";

import connectDb from "@/libs/config";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    await connectDb();
    const invoices = await Invoice.find({
      products: { $elemMatch: { category: id } },
    }).sort({ createdAt: -1 });
    let totalInvested = 0,
      totalReturned = 0,
      objectsForReturned = [],
      objectsForInvested = []; //array of objects from the products field from Invoice
    invoices.forEach((invoice) => {
      if (!invoice.type) {
        invoice.products.map((item) => {
          if (String(item.category) === id) {
            objectsForReturned.push(item);
          }
        });
      }
    });

    totalReturned = objectsForReturned.reduce((total, item) => {
      total += parseInt(item.quantity) * parseInt(item.price);
      return total;
    }, 0);

    invoices.forEach((invoice) => {
      if (invoice.type) {
        invoice.products.map((item) => {
          if (String(item.category) === id) {
            objectsForInvested.push(item);
          }
        });
      }
    });

    totalInvested = objectsForInvested.reduce((total, item) => {
      total += parseInt(item.quantity) * parseInt(item.price);
      return total;
    }, 0);

    return NextResponse.json({
      message: {
        totalInvested,
        totalReturned,
      },
      success: true,
    });
  } catch (error) {
    console.log("Error Anaytics category wise", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
