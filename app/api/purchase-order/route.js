import Invoice from "@/models/Invoice";
import Product from "@/models/Product";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDb from "@/libs/config";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const { id, quantity, grandTotal } = await request.json();
    await connectDb();
    if (session) {
      const prod = await Product.findOne({ _id: id });
      const user = await User.findOne({ email: session?.user?.email });

      const invoice = await Invoice.create({
        products: [
          {
            product: id,
            quantity,
            price: prod.price,
            category: prod.category,
          },
        ],
        grandTotal: grandTotal,
        type: true,
        issuedBy: user._id,
        email: user.email,
      });

      //updating the count in the product
      await Product.findOneAndUpdate(
        { _id: id },
        { count: prod.count + parseInt(quantity) },
        { new: true }
      );

      return NextResponse.json({ message: invoice, success: true });
    }
    return NextResponse.json({ message: "Not Authorized user" });
  } catch (error) {
    console.log("P.O error", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
