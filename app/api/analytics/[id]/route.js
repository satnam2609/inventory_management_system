import Invoice from "@/models/Invoice";

import connectDb from "@/libs/config";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    await connectDb();
    const invoices = await Invoice.find({
      products: { $elemMatch: { category: id } },
      type: false,
    }).sort({ createdAt: -1 });
    let total = 0,
      objects = []; //array of objects from the products field from Invoice
    invoices.forEach((invoice) => {
      invoice.products.map((item) => {
        if (String(item.category) === id) {
          objects.push(item);
        }
      });
    });

    total = objects.reduce((total, item) => {
      total += parseInt(item.quantity) * parseInt(item.price);
      return total;
    }, 0);

    return NextResponse.json({ message: total, success: true });
  } catch (error) {
    console.log("Error Anaytics category wise", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
