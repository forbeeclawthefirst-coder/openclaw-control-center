import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: { agent: true },
      orderBy: { createdAt: "desc" }
    });
    
    // Parse JSON strings for response
    const formattedTasks = tasks.map((task: any) => ({
      ...task,
      payload: task.payload ? JSON.parse(task.payload) : {},
      requiredCapabilities: task.requiredCapabilities ? JSON.parse(task.requiredCapabilities) : [],
      result: task.result ? JSON.parse(task.result) : null
    }));
    
    return NextResponse.json({ tasks: formattedTasks });
  } catch (error: any) {
    console.error('GET tasks error:', error);
    return NextResponse.json({ tasks: [], error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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
    
    return NextResponse.json({ 
      task: {
        ...task,
        payload: body.payload || {},
        requiredCapabilities: body.requiredCapabilities || []
      }
    });
  } catch (error: any) {
    console.error('POST task error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}