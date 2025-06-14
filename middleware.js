import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";
const BASE_ROUTE = "/";
export const config = { matcher: ["/admin/:path*", "/employee"] };

/**
 *
 * @param {NextRequest} req
 */
export async function middleware(req) {
  const urlPath = req.nextUrl.pathname;
  const token = await getToken({ req });

  if (BASE_ROUTE.includes(urlPath) && !token) {
    return NextResponse.redirect(new URL(BASE_ROUTE, req.url));
  }

  if (urlPath.startsWith("/employee")) {
    if (token.role !== "employee") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  if (urlPath.startsWith("/admin")) {
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/employee", req.url));
    }
  }

  return NextResponse.next();
}
