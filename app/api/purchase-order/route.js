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
    const { id, quantity, cost, grandTotal } = await request.json();

    await connectDb();
    if (session) {
      //session
      const prod = await Product.findOne({ _id: id });
      const user = await User.findOne({ email: session?.user?.email });

      let retailerPrice = parseInt(prod.price * 0.85);

      const invoice = await Invoice.create({
        products: [
          {
            product: id,
            quantity,
            price: retailerPrice,
            category: prod.category,
          },
        ],
        grandTotal: grandTotal,
        type: true,
        issuedBy: "65d703e991aa16b3147c15d8", //user._id,
        email: "satnam@gmail.com", //user.email,
      });

      //If the product is new in the inventory then the initialInventory must be updated with the quantity bought
      if (prod.count === 0 || prod.count === "0") {
        await Product.findOneAndUpdate(
          { _id: id },
          {
            initialInventory: quantity,

            count: parseInt(quantity),
            cost: String(cost),
          },
          { new: true }
        );

        return NextResponse.json({ message: invoice, success: true });
      }
      //updating the count in the product
      const check =
        new Date(prod.updatedAt).getMonth() !== new Date().getMonth();

      await Product.findOneAndUpdate(
        { _id: id },
        {
          count: prod.count + parseInt(quantity),
          cost: String(cost),
          purchasesDuringPeriod: check
            ? prod.purchasesDuringPeriod + quantity
            : prod.purchasesDuringPeriod,
        },

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
