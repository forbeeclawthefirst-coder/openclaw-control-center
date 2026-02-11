import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

// List agents
export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      include: { tokens: true },
      orderBy: { createdAt: "desc" }
    });
    // Parse JSON strings back to arrays for the response
    const formattedAgents = agents.map((agent: any) => ({
      ...agent,
      capabilities: agent.capabilities ? JSON.parse(agent.capabilities) : [],
      tags: agent.tags ? JSON.parse(agent.tags) : [],
      metadata: agent.metadata ? JSON.parse(agent.metadata) : {}
    }));
    return NextResponse.json({ agents: formattedAgents });
  } catch (error: any) {
    console.error('GET agents error:', error);
    return NextResponse.json({ agents: [], error: error.message }, { status: 500 });
  }
}

// Create agent
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Get or generate secret
    const secret = process.env.AGENT_TOKEN_SECRET || 'default-secret-change-in-prod';
    
    const agent = await prisma.agent.create({
      data: {
        agentId: body.agentId || `agent-${Date.now()}`,
        name: body.name,
        capabilities: JSON.stringify(body.capabilities || []),
        tags: JSON.stringify([]),
        metadata: JSON.stringify({}),
        orgId: "default"
      }
    });
    
    // Generate token
    const token = jwt.sign(
      { agentId: agent.agentId },
      secret,
      { expiresIn: "30d" }
    );
    
    await prisma.agentToken.create({
      data: {
        agentId: agent.id,
        token,
        name: "Default Token"
      }
    });
    
    return NextResponse.json({ 
      agent: {
        ...agent,
        capabilities: body.capabilities || []
      }, 
      token 
    });
  } catch (error: any) {
    console.error('POST agent error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}