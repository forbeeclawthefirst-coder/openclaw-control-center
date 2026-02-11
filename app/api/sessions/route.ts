import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  const sessions = await prisma.agentSession.findMany({
    include: { agent: true, _count: { select: { messages: true } } },
    orderBy: { startedAt: "desc" }
  });
  return NextResponse.json({ sessions });
}
