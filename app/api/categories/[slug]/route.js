import Category from "@/models/Category";
import connectDb from "@/libs/config";
import Product from "@/models/Product";
import Invoice from "@/models/Invoice";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const { name } = await request.json();
    await connectDb();

    const category = await Category.findOneAndUpdate(
      { slug },
      { name, slug: slugify(name) },
      { new: true }
    );

    if (category) {
      return NextResponse.json({ message: category, success: true });
    } else {
      return NextResponse.json(
        { message: "Category not found", success: true },
        { status: 304 }
      );
    }
  } catch (error) {
    console.log("Category POST error", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { slug } = params;
    await connectDb();
    const category = await Category.findOneAndDelete({ slug }, { new: true });
    if (category) {
      return NextResponse.json(
        { message: category, success: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Category not found", success: true },
        { status: 304 }
      );
    }
  } catch (error) {
    console.log("Category POST error", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { startDate, endDate } = await request.json();

    // Connect to the database
    await connectDb();

    const { slug } = params;

    // Find the category based on the slug
    const category = await Category.findOne({ slug });

    // Initialize cumulative values
    let totalCogsCost = 0,
      totalGrossProfit = 0,
      totalAvgInventory = 0,
      totalRevenue = 0;

    // Find all products in the category
    const products = await Product.find({ category: category._id });

    // Iterate over products and accumulate values
    for (const product of products) {
      const result = await getValues(product._id, startDate, endDate);

      // Log the result for debugging
      console.log(result);

      // Accumulate values
      totalCogsCost += parseFloat(result.cogsCost || 0);
      totalGrossProfit += parseFloat(result.grossProfit || 0);
      totalAvgInventory += parseFloat(result.averageInventory || 0);
      totalRevenue += parseFloat(result.revenue || 0);
    }

    // Return the cumulative data as a JSON response
    return NextResponse.json({
      message: {
        totalRevenue: totalRevenue.toFixed(2),
        totalCogsCost: totalCogsCost.toFixed(2),
        totalGrossProfit: totalGrossProfit.toFixed(2),
        totalAvgInventory: totalAvgInventory.toFixed(2),
      },
      success: true,
    });
  } catch (error) {
    // Log the error for debugging
    console.error(`Error: ${error}`);

    // Return an error response
    return NextResponse.json({
      message: "Internal server error",
      success: false,
    }).status(500);
  }
}

export async function getValues(id, startDate, endDate) {
  const response = await fetch(`http://localhost:3000/api/products/values`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ id: id, startDate: startDate, endDate: endDate }),
  });

  if (response.ok) {
    const { message } = await response.json();
    return message;
  }
}
