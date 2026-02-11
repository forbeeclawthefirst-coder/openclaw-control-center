import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const agent = await prisma.agent.findUnique({ where: { id: params.id } });
  if (!agent) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  
  const token = jwt.sign(
    { agentId: agent.agentId },
    process.env.AGENT_TOKEN_SECRET!,
    { expiresIn: "30d" }
  );
  
  await prisma.agentToken.create({
    data: {
      agentId: agent.id,
      token,
      name: "New Token"
    }
  });
  
  return NextResponse.json({ token });
}
