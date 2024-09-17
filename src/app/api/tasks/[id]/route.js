import { NextResponse } from "next/server";

export function GET(request, { params }) {
  return NextResponse.json("Obteniendo tarea " + params.id);
}

export function POST(request, { params }) {
  return NextResponse.json("Obteniendo tarea " + params.id);
}

export function PUT(request, { params }) {
  return NextResponse.json("Obteniendo tarea " + params.id);
}

export function DELETE(request, { params }) {
  return NextResponse.json("Obteniendo tarea " + params.id);
}
