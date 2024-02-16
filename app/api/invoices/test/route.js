import connectDb from "@/libs/config";
import Invoice from "@/models/Invoice";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { products, grandTotal, email, date } = await request.json();

    await connectDb();
    if (Array.isArray(products)) {
      const invoice = await Invoice.create({
        products,
        // issuedBy: user._id,
        issuedBy: "65b61b8faa7aaa5d320cf1fd",
        grandTotal,
        email,
        createdAt: new Date(date),
      });

      //we need to update the count of each product
      products.map(async (p) => {
        let prodId = p.product;
        let count = parseInt(p.quantity);
        const product = await Product.findOne({ _id: prodId });
        await Product.findOneAndUpdate(
          { _id: prodId },
          { count: product.count - count },
          { new: true }
        );
      });

      return NextResponse.json(
        { message: invoice, success: true },
        { status: 201 }
      );
    }
    return NextResponse.json({
      message: "No products included in invoice",
      success: false,
    });
  } catch (error) {
    console.log("Failed to add invoice", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
