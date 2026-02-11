import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  const tasks = await prisma.task.findMany({
    include: { agent: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const body = await req.json();
  
  const task = await prisma.task.create({
    data: {
      type: body.type,
      payload: JSON.stringify(body.payload || {}),
      requiredCapabilities: JSON.stringify(body.requiredCapabilities || []),
      priority: body.priority || "normal",
      orgId: "default"
    }
  });
  
  return NextResponse.json({ task });
}