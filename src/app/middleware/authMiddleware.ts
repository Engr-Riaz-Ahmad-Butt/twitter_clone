import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url)); 
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return NextResponse.next();
  } catch (error) {
    console.log("Error verifying token:", error);
    return NextResponse.redirect(new URL("/login", req.url)); 
  }
}

export const config = {
  matcher: "/api/protected/:path*", 
};
