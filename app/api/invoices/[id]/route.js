import Invoice from "@/models/Invoice";
import connectDb from "@/libs/config";
import { NextResponse } from "next/server";
import moment from "moment";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectDb();
    const invoice = await Invoice.findOne({ _id: id }).populate(
      "products.product"
    );
    return NextResponse.json({ message: invoice, success: true });
  } catch (error) {
    console.log("Invoice error", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

async function handleSalesWithRangeQuery(id, startDate, endDate) {
  console.log("DateRange");
  await connectDb();
  const dateRangeQuery = {};
  if (startDate) {
    dateRangeQuery.$gt = new Date(startDate);
  }
  if (endDate) {
    dateRangeQuery.$lt = new Date(endDate);
  }

  const invoices = await Invoice.find({
    products: { $elemMatch: { product: id } },
    type: false,
    createdAt: dateRangeQuery,
  }).sort({ createdAt: 1 });

  return invoices;
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { startDate, endDate } = await request.json();
    let invoices = [];

    //If the dateRange values are not null then we need to fetch the invoices by range and also the product wise sales
    if (startDate || endDate) {
      invoices = await handleSalesWithRangeQuery(id, startDate, endDate);
    } else {
      await connectDb();

      //find the invoices with the product id in the products array and get the quantity multiplied by price value
      invoices = await Invoice.find({
        products: { $elemMatch: { product: id } },
        type: false,
      }).sort({ createdAt: 1 });
    }

    const salesData = invoices.reduce((result, invoice) => {
      const dateKey = new Date(invoice.createdAt).toISOString().split("T")[0];
      const existingEntry = result.find((entry) => entry.x === dateKey);

      if (existingEntry) {
        existingEntry.y += invoice.products.reduce((total, product) => {
          if (product.product.toString() === id.toString()) {
            return total + parseInt(product.quantity) * parseInt(product.price);
          }
        }, 0);
      } else {
        result.push({
          x: dateKey,
          y: invoice.products.reduce((total, product) => {
            if (product.product.toString() === id.toString()) {
              return (
                total + parseInt(product.quantity) * parseInt(product.price)
              );
            }
          }, 0),
        });
      }

      return result;
    }, []);

    const formattedSalesData = [
      {
        id: "Customer order",
        color: "hsl(124.9, 100%, 25.5%)",
        data: salesData,
      },
    ];

    return NextResponse.json({
      message: formattedSalesData,
    });
  } catch (error) {
    console.log("Error using PUT method for sales in invoices", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
