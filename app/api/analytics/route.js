import Invoice from "@/models/Invoice";
import connectDb from "@/libs/config";
import { NextResponse } from "next/server";
import Category from "@/models/Category";
import Product from "@/models/Product";
import moment from "moment";

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
        }).sort({ createdAt: 1 });

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
