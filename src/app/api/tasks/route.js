import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  const roles = await prisma.roles.findMany();
  console.log(roles);
  return NextResponse.json(roles);
}

export function POST() {
  return NextResponse.json("creando tareas");
}
