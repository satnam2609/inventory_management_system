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

// async function handleSalesWithCodeQuery(id, code) {
//   console.log("DateRange");
//   await connectDb();
//   let codeVal = code,
//     invoices = null;
//   switch (val) {
//     case 1: {
//       //current day sales
//       invoices = await Invoice.find({
//         products: { $elemMatch: { product: id } },
//         type: false,
//         createdAt: { $gte: new Date() },
//       });
//     }
//     case 2: {
//       invoices=await Invoice.find({
//         products: { $elemMatch: { product: id } },
//         type: false,
//         createdAt:
//       })
//     }
//     case 4: {
//     }

//     default: {
//     }
//   }

//   invoices = await Invoice.find({
//     products: { $elemMatch: { product: id } },
//     type: false,
//     createdAt: dateRangeQuery,
//   }).sort({ createdAt: 1 });

//   return invoices;
// }

// export async function PUT(request, { params }) {
//   try {
//     const { id } = params;
//     const { startDate, endDate } = await request.json();
//     let invoices = [];

//     //If the dateRange values are not null then we need to fetch the invoices by range and also the product wise sales
//     if (startDate || endDate) {
//       invoices = await handleSalesWithRangeQuery(id, startDate, endDate);
//     } else {
//       await connectDb();

//       //find the invoices with the product id in the products array and get the quantity multiplied by price value
//       invoices = await Invoice.find({
//         products: { $elemMatch: { product: id } },
//         type: false,
//       }).sort({ createdAt: 1 });
//     }

//     const salesData = invoices.reduce((result, invoice) => {
//       const dateKey = new Date(invoice.createdAt).toISOString().split("T")[0];
//       const existingEntry = result.find((entry) => entry.x === dateKey);

//       if (existingEntry) {
//         existingEntry.y += invoice.products.reduce((total, product) => {
//           if (product.product.toString() === id.toString()) {
//             return total + parseInt(product.quantity) * parseInt(product.price);
//           }
//         }, 0);
//       } else {
//         result.push({
//           x: dateKey,
//           y: invoice.products.reduce((total, product) => {
//             if (product.product.toString() === id.toString()) {
//               return (
//                 total + parseInt(product.quantity) * parseInt(product.price)
//               );
//             }
//           }, 0),
//         });
//       }

//       return result;
//     }, []);

//     const formattedSalesData = [
//       {
//         id: "Customer order",
//         color: "hsl(124.9, 100%, 25.5%)",
//         data: salesData,
//       },
//     ];

//     return NextResponse.json({
//       message: formattedSalesData,
//     });
//   } catch (error) {
//     console.log("Error using PUT method for sales in invoices", error);
//     return NextResponse.json(
//       { message: "Internal server error", success: false },
//       { status: 500 }
//     );
//   }
// }

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { code } = await request.json();
    let salesData;

    await connectDb();

    //find the invoices with the product id in the products array and get the quantity multiplied by price value
    const invoices = await Invoice.find({
      products: { $elemMatch: { product: id } },
      type: false,
    }).sort({ createdAt: 1 });

    //If the dateRange values are not null then we need to fetch the invoices by range and also the product wise sales

    //If the value of code is 1 then that means we want to fetch the sales of current date
    if (code === "2" || code === 2) {
      salesData = invoices.reduce((result, invoice) => {
        const dateVal = new Date(invoice.createdAt).toISOString().split("T")[0];
        const dateKey = moment(dateVal.split("-")[1]).format("MM");
        const existingEntry = result.find((entry) => entry.x === dateKey);

        if (existingEntry) {
          existingEntry.y += invoice.products.reduce((total, product) => {
            if (product.product.toString() === id.toString()) {
              return (
                total + parseInt(product.quantity) * parseInt(product.price)
              );
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
    } else if (code === "4" || code === 4) {
      salesData = invoices.reduce((result, invoice) => {
        const dateVal = new Date(invoice.createdAt).toISOString().split("T")[0];
        const dateKey = moment(dateVal.split("-")[2]).format("YYYY");
        const existingEntry = result.find((entry) => entry.x === dateKey);

        if (existingEntry) {
          existingEntry.y += invoice.products.reduce((total, product) => {
            if (product.product.toString() === id.toString()) {
              return (
                total + parseInt(product.quantity) * parseInt(product.price)
              );
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
    } else {
      salesData = invoices.reduce((result, invoice) => {
        const dateKey = new Date(invoice.createdAt).toISOString().split("T")[0];
        const existingEntry = result.find((entry) => entry.x === dateKey);

        if (existingEntry) {
          existingEntry.y += invoice.products.reduce((total, product) => {
            if (product.product.toString() === id.toString()) {
              return (
                total + parseInt(product.quantity) * parseInt(product.price)
              );
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
    }

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
