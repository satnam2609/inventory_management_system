import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

export default async function middleware(request) {
  const token = await getToken({ req: request, secret: SECRET });

  if (token) {
    return NextResponse.next();
  } else {
    // for api routes
    return new NextResponse.json(
      { message: "Forbidden route" },
      { status: 403 }
    );
  }
}
