import { NextResponse } from "next/server";

const protectedRoutes = ["/home", "/pacientes", "/cirugias", "/usuarios"];

export function middleware(req) {
  const token = req.cookies.get("token");
  const pathname = req.nextUrl.pathname;

  console.log("Ruta actual:", pathname);
  console.log("Token encontrado:", token);

  if (!token && protectedRoutes.includes(pathname)) {
    console.log("Redirigiendo a login desde:", pathname);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("Acceso permitido a:", pathname);
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
