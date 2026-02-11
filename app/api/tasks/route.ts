import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { agentTaskQueue } from "@/lib/queue";

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
      payload: body.payload || {},
      requiredCapabilities: body.requiredCapabilities || [],
      priority: body.priority || "normal",
      orgId: body.orgId || "default"
    }
  });
  
  // Add to queue
  await agentTaskQueue.add(body.type, {
    taskId: task.id,
    ...body
  });
  
  return NextResponse.json({ task });
}
