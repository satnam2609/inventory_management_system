import Invoice from "@/models/Invoice";
import connectDb from "@/libs/config";
import { NextResponse } from "next/server";
import Category from "@/models/Category";
import Product from "@/models/Product";
import moment from "moment";
import { getValues } from "../categories/[slug]/route";

export async function POST(request) {
  try {
    const { id } = await request.json();
    let resultArray = [];
    const products = await Product.find({ category: id });

    await Promise.all(
      products.map(async (product) => {
        const invoices = await Invoice.find({
          products: {
            $elemMatch: {
              product: product._id,
            },
          },
          type: false,
        }).sort({ createdAt: -1 });

        invoices.forEach((invoice) => {
          const monthVal = moment(invoice.createdAt).format("MMMM");

          // Check if the month already exists in resultArray
          const monthObject = resultArray.find((obj) => obj.month === monthVal);

          if (monthObject) {
            // If the month exists, update the sales for the product
            monthObject[product.name] =
              (monthObject[product.name] || 0) +
              invoice.products.reduce((total, p) => {
                return total + parseInt(p.quantity) * parseInt(p.price);
              }, 0);
          } else {
            // If the month doesn't exist, create a new object
            const salesObj = {
              month: monthVal,
              [product.name]: invoice.products.reduce((total, p) => {
                return total + parseInt(p.quantity) * parseInt(p.price);
              }, 0),
            };

            resultArray.push(salesObj);
          }
        });
      })
    );

    return NextResponse.json({ resultArray, success: true });
  } catch (error) {
    console.log("Analytics error", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { startDate, endDate } = await request.json();

    let netRevenue = 0,
      netCogsCost = 0,
      netGrossProfit = 0,
      netAvgInventory = 0;
    await connectDb();

    const products = await Product.find({});

    for (const product of products) {
      const result = await getValues(product._id, startDate, endDate);

      // Log the result for debugging

      // Accumulate values
      netCogsCost += parseFloat(result.cogsCost || 0);
      netGrossProfit += parseFloat(result.grossProfit || 0);
      netAvgInventory += parseFloat(result.averageInventory || 0);
      netRevenue += parseFloat(result.revenue || 0);
    }

    return NextResponse.json({
      message: {
        netRevenue,
        netCogsCost,
        netGrossProfit,
        netAvgInventory,
      },
      success: true,
    });
  } catch (error) {
    console.log("Analytics error", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
