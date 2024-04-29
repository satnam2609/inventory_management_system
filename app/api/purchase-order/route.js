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
      const user = await User.findOne({ email: session?.user?.email });
      const prod = await Product.findOne({ _id: id });

      const invoice = await Invoice.create({
        products: [
          {
            product: id,
            quantity,
            price: cost,
            category: prod.category,
          },
        ],
        grandTotal: grandTotal,
        type: true,
        issuedBy: user._id,
        email: user.email,
      });

      // Update product inventory
      let updatedCount = prod.count + parseInt(quantity);
      let updatedInitialInventory = prod.initialInventory;
      let updatedPurchasesDuringPeriod = prod.purchasesDuringPeriod;
      let initialInventory = prod.initialInventory;

      if (initialInventory === 0 || initialInventory === "0") {
        // If the product count is 0, treat it as a new product
        await Product.findOneAndUpdate(
          { _id: id },
          {
            initialInventory: updatedInitialInventory + parseInt(quantity), // Set initial inventory to the new quantity
            // count: updatedCount,
            cost: String(cost),
          },
          { new: true }
        );
      } else {
        // Calculate total quantity sold
        // const totalQuantitySold = await calculateTotalQuantitySold(id);

        // // Adjust initial inventory based on total quantity sold
        // const adjustedInitialInventory =
        //   totalQuantitySold > 0
        //     ? prod.initialInventory - totalQuantitySold
        //     : prod.initialInventory;

        const currentMonth = new Date().getMonth();
        const lastUpdatedMonth = new Date(prod.updatedAt).getMonth();

        if (currentMonth !== lastUpdatedMonth) {
          updatedPurchasesDuringPeriod = parseInt(quantity);
        } else {
          updatedPurchasesDuringPeriod += parseInt(quantity);
        }

        await Product.findOneAndUpdate(
          { _id: id },
          {
            // count: updatedCount,
            cost: String(cost),
            purchasesDuringPeriod: updatedPurchasesDuringPeriod,
          },
          { new: true }
        );
      }

      return NextResponse.json({ message: invoice, success: true });
    }
    return NextResponse.json({ message: "Not Authorized user" });
  } catch (error) {
    console.error("Purchase Order error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

// Function to calculate the total quantity sold for a product
async function calculateTotalQuantitySold(productId) {
  const invoices = await Invoice.find({ "products.product": productId });
  let totalQuantitySold = 0;
  for (const invoice of invoices) {
    for (const product of invoice.products) {
      if (product.product.toString() === productId) {
        totalQuantitySold +=
          product.initialInventory + product.purchasesDuringPeriod;
      }
    }
  }
  return totalQuantitySold;
}
