import { NextResponse } from "next/server";

const protectedRoutes = ["/home", "/dashboard", "/perfil"];

export function middleware(req) {
  const token = req.cookies.get("token");

  if (!token && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/dashboard/:path*", "/perfil/:path*"],
};
