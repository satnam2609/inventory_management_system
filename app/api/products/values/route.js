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
      const dateRangeQuery = {};

      if (startDate) {
        dateRangeQuery.$gte = new Date(startDate);
      }
      if (endDate) {
        dateRangeQuery.$lte = new Date(endDate);
      }
      invoices = await Invoice.find({
        products: {
          $elemMatch: {
            product: product._id,
          },
        },
        type: false,
        createdAt: dateRangeQuery,
      });
    } else {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed in JavaScript
      const currentYear = currentDate.getFullYear();

      // Fetch invoices from the database with a createdAt date in the current month
      invoices = await Invoice.find({
        products: {
          $elemMatch: {
            product: product._id,
          },
        },
        type: false,
        $expr: {
          $and: [
            { $eq: [{ $month: "$createdAt" }, currentMonth] },
            { $eq: [{ $year: "$createdAt" }, currentYear] },
          ],
        },
      });
    }

    quantitySold = invoices.reduce((total, invoice) => {
      const obj = invoice.products.filter(
        (p) => p.product.toString() === id
      )[0];

      total += obj.quantity;
      return total;
    }, 0);

    const totalAvailableGoods =
      product.initialInventory + product.purchasesDuringPeriod;
    const endingInventory = totalAvailableGoods - parseInt(quantitySold || 0);

    // Calculate the weighted average cost dynamically
    const weightedAverageCost =
      (product.initialInventory * parseFloat(product.cost) +
        product.purchasesDuringPeriod * parseFloat(product.price)) /
        totalAvailableGoods || 0;

    // Calculate COGS in currency
    const cogsQuantity = totalAvailableGoods - endingInventory;
    const cogsCost = cogsQuantity * weightedAverageCost;

    // Calculate Gross Profit
    const revenue = cogsQuantity * parseFloat(product.price || 0);
    const grossProfit = revenue - cogsCost;
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
    console.log(error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
    }).status(500);
  }
}
