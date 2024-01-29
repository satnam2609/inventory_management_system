import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

export default async function middleware(request) {
  const token = await getToken({ req: request, secret: SECRET });
  if (token && token.role === "admin") {
    return NextResponse.redirect("/admin");
  } else {
    return NextResponse.redirect("/");
  }

  // for api routes
  // if (request.nextUrl.pathname.startsWith("/api/admin")) {
  //   //check the token and role
  //   // create new response for unauthorized access for the api
  //   if (!token) {
  //     return new Response("Not authorized", { status: 401 });
  //   } else if (token && token.role !== "admin") {
  //     return new Response("Forbidden route", { status: 403 });
  //   }
  // }
}
