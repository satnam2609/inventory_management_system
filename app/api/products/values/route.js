import connectDb from "@/libs/config";
import Invoice from "@/models/Invoice";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDb();
    const { id, startDate, endDate } = await request.json();
    let invoices,
      quantitySold = 0;

    const product = await Product.findById(id);

    if (startDate || endDate) {
      // Fetch invoices within the specified date range
      const dateRangeQuery = {};
      if (startDate) {
        dateRangeQuery.$gte = new Date(startDate);
      }
      if (endDate) {
        dateRangeQuery.$lte = new Date(endDate);
      }
      invoices = await Invoice.find({
        products: { $elemMatch: { product: product._id } },
        type: false,
        createdAt: dateRangeQuery,
      });
    } else {
      // Fetch invoices within the current month
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      invoices = await Invoice.find({
        products: { $elemMatch: { product: product._id } },
        type: false,
        $expr: {
          $and: [
            { $eq: [{ $month: "$createdAt" }, currentMonth] },
            { $eq: [{ $year: "$createdAt" }, currentYear] },
          ],
        },
      });
    }

    // Calculate total quantity sold
    quantitySold = invoices.reduce((total, invoice) => {
      const productSold = invoice.products.find(
        (p) => p.product.toString() === id
      );
      if (productSold) {
        total += productSold.quantity;
      }
      return total;
    }, 0);

    // Calculate total available goods
    const totalAvailableGoods =
      product.initialInventory + product.purchasesDuringPeriod;

    // Ensure ending inventory is not negative
    const endingInventory = Math.max(
      0,
      totalAvailableGoods - parseInt(quantitySold || 0)
    );

    console.log(endingInventory);

    // Calculate weighted average cost
    const weightedAverageCost =
      totalAvailableGoods === 0
        ? 0
        : (product.initialInventory * parseFloat(product.cost) +
            product.purchasesDuringPeriod * parseFloat(product.price)) /
          totalAvailableGoods;

    // Calculate COGS in currency
    const cogsQuantity = totalAvailableGoods - endingInventory;
    const cogsCost = cogsQuantity * weightedAverageCost;

    // Calculate Gross Profit
    const revenue = cogsQuantity * parseFloat(product.price || 0);
    const grossProfit = revenue - cogsCost;

    // Calculate average inventory
    const averageInventory = (product.initialInventory + endingInventory) / 2;

    return NextResponse.json({
      message: {
        cogsCost: cogsCost.toFixed(1),
        revenue: revenue.toFixed(1),
        grossProfit: grossProfit.toFixed(1),
        averageInventory: averageInventory.toFixed(1),
      },
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
    }).status(500);
  }
}
