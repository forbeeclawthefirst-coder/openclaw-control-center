import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const agent = await prisma.agent.findUnique({
    where: { id: params.id },
    include: { sessions: true, tasks: true }
  });
  
  if (!agent) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  
  return NextResponse.json({ agent });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const agent = await prisma.agent.update({
    where: { id: params.id },
    data: body
  });
  return NextResponse.json({ agent });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.agent.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
