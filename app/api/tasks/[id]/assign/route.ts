import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    
    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        agentId: body.agentId,
        status: 'assigned',
        assignedAt: new Date()
      },
      include: { agent: true }
    });
    
    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to assign task' },
      { status: 500 }
    );
  }
}