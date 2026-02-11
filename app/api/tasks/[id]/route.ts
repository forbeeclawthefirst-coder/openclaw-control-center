import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: { logs: true, agent: true }
  });
  
  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  
  return NextResponse.json({ task });
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  
  if (body.action === "cancel") {
    const task = await prisma.task.update({
      where: { id: params.id },
      data: { status: "cancelled" }
    });
    return NextResponse.json({ task });
  }
  
  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
