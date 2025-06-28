import Invoice from "@/models/invoice";
import Item from "@/models/item";
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
    const { itemsObj }: { itemsObj: InvoiceItems } = await request.json();

    await connect();

    const itemsArray = Object.entries(itemsObj);
    let invoiceItems: any[] = [],
      grandTotal = 0;

    const user = await User.findOne({ email: session.user.email });

    await Promise.all(
      itemsArray.map(async ([id, qty]) => {
        const product = await Item.findOne({ _id: id });
        if (product) {
          await handlePurchaseOrder(product, qty);
          invoiceItems.push({
            product: product._id,
            qty: qty,
          });
          grandTotal += parseFloat(product.cost) * qty;
        } else {
          delete itemsObj[id];
        }
      })
    );

    const invoice = await Invoice.create({
      items: invoiceItems,
      grandTotal: grandTotal,
      issuedBy: user._id,
      customer: "inventory",
      order: true,
    });

    return NextResponse.json(
      { message: invoice._id, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.log("Invoice order failed with error: ", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

async function handlePurchaseOrder(
  product: any,
  quantity: number
): Promise<void> {
  // Initial Inventory is the quantity of stocked IN during the initial period of inventory stocking.(eg.start of the month).

  await Item.findOneAndUpdate(
    { _id: product._id },
    {
      $inc: {
        inventory: quantity,
      },
    },
    {
      new: true,
    }
  );
}
