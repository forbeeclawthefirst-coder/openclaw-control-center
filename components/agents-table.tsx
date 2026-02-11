'use client';

import { useEffect, useState } from 'react';

export default function AgentsTable() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agents')
      .then(r => r.json())
      .then(data => {
        setAgents(data.agents || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading agents...</div>;

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Capabilities</th>
            <th className="p-3 text-left">Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent: any) => (
            <tr key={agent.id} className="border-t">
              <td className="p-3">{agent.name}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-sm ${agent.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                  {agent.status}
                </span>
              </td>
              <td className="p-3">{agent.capabilities?.join(', ')}</td>
              <td className="p-3">{agent.lastSeenAt ? new Date(agent.lastSeenAt).toLocaleString() : 'Never'}</td>
            </tr>
          ))}
          {agents.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-500">No agents registered yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}