import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sessions = await prisma.agentSession.findMany({
      include: { agent: true, _count: { select: { messages: true } } },
      orderBy: { startedAt: "desc" }
    });
    
    // Parse JSON context for response
    const formattedSessions = sessions.map((session: any) => ({
      ...session,
      context: session.context ? JSON.parse(session.context) : {}
    }));
    
    return NextResponse.json({ sessions: formattedSessions });
  } catch (error: any) {
    console.error('GET sessions error:', error);
    return NextResponse.json({ sessions: [], error: error.message }, { status: 500 });
  }
}