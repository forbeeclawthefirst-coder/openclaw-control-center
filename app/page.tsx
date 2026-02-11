export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">OpenClaw Control Center</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="/agents" className="text-gray-600 hover:text-gray-900">Agents</a>
              <a href="/tasks" className="text-gray-600 hover:text-gray-900">Tasks</a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Manage Your Agents
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Centralized control center for OpenClaw agents. Monitor, manage, and deploy tasks to your agent fleet.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a href="/dashboard" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Go to Dashboard
            </a>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Agent Management</h3>
              <p className="mt-2 text-sm text-gray-500">Register and monitor agent nodes</p>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Task Distribution</h3>
              <p className="mt-2 text-sm text-gray-500">Distribute work to capable agents</p>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Real-time Monitoring</h3>
              <p className="mt-2 text-sm text-gray-500">Live session and task tracking</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
