import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

// List agents
export async function GET() {
  const agents = await prisma.agent.findMany({
    include: { tokens: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ agents });
}

// Create agent
export async function POST(req: Request) {
  const body = await req.json();
  const agent = await prisma.agent.create({
    data: {
      agentId: body.agentId || `agent-${Date.now()}`,
      name: body.name,
      capabilities: body.capabilities || [],
      orgId: body.orgId || "default"
    }
  });
  
  // Generate token
  const token = jwt.sign(
    { agentId: agent.agentId },
    process.env.AGENT_TOKEN_SECRET!,
    { expiresIn: "30d" }
  );
  
  await prisma.agentToken.create({
    data: {
      agentId: agent.id,
      token,
      name: "Default Token"
    }
  });
  
  return NextResponse.json({ agent, token });
}
