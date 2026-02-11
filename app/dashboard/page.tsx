import { prisma } from "@/lib/db";

async function getStats() {
  const [agents, sessions, tasks] = await Promise.all([
    prisma.agent.count(),
    prisma.agentSession.count(),
    prisma.task.count()
  ]);
  
  const onlineAgents = await prisma.agent.count({ where: { status: "online" } });
  const pendingTasks = await prisma.task.count({ where: { status: "pending" } });
  
  return { agents, onlineAgents, sessions, tasks, pendingTasks };
}

export default async function Dashboard() {
  const stats = await getStats();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/agents" className="text-gray-600 hover:text-gray-900">Agents</a>
              <a href="/tasks" className="text-gray-600 hover:text-gray-900">Tasks</a>
              <a href="/sessions" className="text-gray-600 hover:text-gray-900">Sessions</a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Agents</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.agents}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Online Agents</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.onlineAgents}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Sessions</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.sessions}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Pending Tasks</dt>
              <dd className="mt-1 text-3xl font-semibold text-yellow-600">{stats.pendingTasks}</dd>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
