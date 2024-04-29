import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Product from "@/models/Product";
import Invoice from "@/models/Invoice";
import { NextResponse } from "next/server";
import connectDb from "@/libs/config";
import User from "@/models/User";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const { products, grandTotal, email } = await request.json();

    const user = await User.findOne({ email: session?.user?.email }).select(
      "_id"
    );

    await connectDb();
    if (Array.isArray(products)) {
      const invoice = await Invoice.create({
        products,
        issuedBy: user._id,
        grandTotal,
        email,
      });

      //we need to update the count of each product
      products.map(async (p) => {
        let prodId = p.product;
        let count = parseInt(p.quantity);
        const product = await Product.findOne({ _id: prodId });

        const initialInventory = product.initialInventory;
        const purchasesDuringPeriod = product.purchasesDuringPeriod;

        let updatedInitialInventory = initialInventory - count;
        let updatedPurchasesDuringPeriod = purchasesDuringPeriod - count;

        if (updatedPurchasesDuringPeriod >= 0) {
          await Product.findOneAndUpdate(
            { _id: prodId },
            {
              purchasesDuringPeriod: updatedPurchasesDuringPeriod,
            },

            { new: true }
          );
        } else if (
          updatedPurchasesDuringPeriod < 0 &&
          updatedInitialInventory >= 0
        ) {
          await Product.findOneAndUpdate(
            { _id: prodId },
            {
              initialInventory: updatedInitialInventory,
            },

            { new: true }
          );
        } else {
          throw new Error("Invalid quantity");
        }
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
    console.log("Failed to add invoice with an error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

async function handleNormalInvoice(currentPage, perPage) {
  await connectDb();
  const invoices = await Invoice.find({})
    .limit(perPage)
    .skip((currentPage - 1) * perPage)
    .populate("products.product")
    .sort({ createdAt: -1 });

  const totalInvoices = await Invoice.find({}).estimatedDocumentCount();

  return {
    invoices,
    total: totalInvoices,
  };
}

// async function handleDateQueryInvoice(currentPage, perPage, start, end) {
//   await connectDb();
//   const dateRangeQuery = [];
//   if (start) {
//     dateRangeQuery.$gte = new Date(start);
//   }
//   if (end) {
//     dateRangeQuery.$lte = new Date(end);
//   }

//   const invoices = await Invoice.find({
//     createdAt: dateRangeQuery,
//   });

//   const total = await Invoice.find({
//     createdAt: dateRangeQuery,
//   }).estimatedDocumentCount();

//   return {
//     invoices,
//     total: total,
//   };
// }

export async function PUT(request) {
  try {
    const { page, startDate, endDate } = await request.json();
    let result;
    const perPage = 6;
    const currentPage = page || 1;

    if (startDate || endDate) {
      await connectDb();
      const dateRangeQuery = {};

      if (startDate) {
        dateRangeQuery.$gte = new Date(startDate);
      }
      if (endDate) {
        dateRangeQuery.$lte = new Date(endDate);
      }

      const invoices = await Invoice.find({
        createdAt: dateRangeQuery,
      }).sort({ createdAt: -1 });

      const total = await Invoice.find({
        createdAt: dateRangeQuery,
      }).estimatedDocumentCount();

      // result = await handleDateQueryInvoice(
      //   currentPage,
      //   perPage,
      //   startDate,
      //   endDate
      // );

      return NextResponse.json({
        message: {
          invoices,
          total,
        },
      });
    } else {
      result = await handleNormalInvoice(currentPage, perPage);
      return NextResponse.json({ message: result });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

//This endpoint is used to fetch the totalInvested amount
export async function GET() {
  try {
    await connectDb();
    const invoices = await Invoice.find({ type: true });
    const netSalesUnit = invoices.reduce((total, invoice) => {
      total += invoice.quantity;
      return total;
    }, 0);

    return NextResponse.json({ message: netSalesUnit, success: true });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
