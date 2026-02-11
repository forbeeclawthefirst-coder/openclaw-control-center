'use client';

import { useEffect, useState } from 'react';

export default function DashboardStats() {
  const [stats, setStats] = useState({ agents: 0, sessions: 0, tasks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/agents').then(r => r.json()),
      fetch('/api/sessions').then(r => r.json()),
      fetch('/api/tasks').then(r => r.json())
    ])
      .then(([agents, sessions, tasks]) => {
        setStats({
          agents: agents.agents?.length || 0,
          sessions: sessions.sessions?.length || 0,
          tasks: tasks.tasks?.length || 0
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading stats...</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-6 bg-blue-50 rounded-lg">
        <div className="text-3xl font-bold">{stats.agents}</div>
        <div className="text-gray-600">Agents</div>
      </div>
      <div className="p-6 bg-green-50 rounded-lg">
        <div className="text-3xl font-bold">{stats.sessions}</div>
        <div className="text-gray-600">Sessions</div>
      </div>
      <div className="p-6 bg-purple-50 rounded-lg">
        <div className="text-3xl font-bold">{stats.tasks}</div>
        <div className="text-gray-600">Tasks</div>
      </div>
    </div>
  );
}