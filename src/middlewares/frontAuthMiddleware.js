import { NextResponse } from "next/server";

const protectedRoutes = ["/home", "/pacientes", "/cirugias", "/usuarios"];

export function middleware(req) {
  const token = req.cookies.get("token");

  // Verificar si el token no existe y la ruta está protegida
  if (!token && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/pacientes/:path*",
    "/cirugias/:path*",
    "/usuarios/:path*",
  ],
};
