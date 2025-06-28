import Item from "@/models/item";
import Invoice from "@/models/invoice";
import Snapshot from "@/models/snapshot";
import connect from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/user";

type InvoiceItems = {
  [key: string]: number;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "User is not logged In.", success: false },
        { status: 400 }
      );
    }

    const {
      userData,
      itemsObj,
    }: { userData: string; itemsObj: InvoiceItems } = await request.json();

    const user = await User.findOne({ email: session.user.email });

    await connect();

    const itemsArray = Object.entries(itemsObj);

    let invoiceItems: any[] = [],
      grandTotal = 0;

    await Promise.all(
      itemsArray.map(async ([id, qty]) => {
        const product = await Item.findOne({ _id: id });
        if (product) {
          await handleBillOrder(product, qty);
          invoiceItems.push({
            product: product._id,
            qty: qty,
          });
          grandTotal += parseFloat(product.price) * qty;
        } else {
          delete itemsObj[id];
        }
      })
    );

    const invoice = await Invoice.create({
      items: invoiceItems,
      grandTotal: grandTotal,
      issuedBy: user._id,
      customer: userData,
      order: false,
    });

    return NextResponse.json(
      { message: invoice._id, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.log("Invoice billing failed with error: ", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

async function handleBillOrder(product: any, quantity: number): Promise<void> {
  await Item.findOneAndUpdate(
    { _id: product._id },
    {
      $inc: {
        inventory: -quantity,
      },
    },
    {
      new: true,
    }
  );

  await Snapshot.create({
    item: product._id,
    soldPrice:product.price,
    soldAmount: quantity,
  });
}
