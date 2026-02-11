'use client';

import { useEffect, useState } from 'react';

export default function AgentsTable() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    agentId: '',
    capabilities: []
  });
  const [token, setToken] = useState('');

  const fetchAgents = () => {
    fetch('/api/agents')
      .then(r => r.json())
      .then(data => {
        setAgents(data.agents || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await res.json();
    if (data.agent) {
      setToken(data.token);
      setShowForm(false);
      setFormData({ name: '', agentId: '', capabilities: [] });
      fetchAgents();
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    alert('Token copied! Save this - you won\'t see it again.');
  };

  if (loading) return <div>Loading agents...</div>;

  return (
    <div>
      <div className="mb-4">
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Register New Agent
        </button>
      </div>

      {token && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="font-semibold text-yellow-800">⚠️ Save this token! You won't see it again:</p>
          <code className="block mt-2 p-2 bg-gray-800 text-green-400 rounded text-sm break-all">{token}</code>
          <button onClick={copyToken} className="mt-2 text-sm text-blue-600 hover:underline">Copy to clipboard</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-3">Register New Agent</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Agent Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="My Agent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Agent ID (optional)</label>
              <input 
                type="text" 
                value={formData.agentId}
                onChange={e => setFormData({...formData, agentId: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="auto-generated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Capabilities (comma-separated)</label>
              <input 
                type="text" 
                value={formData.capabilities.join(', ')}
                onChange={e => setFormData({...formData, capabilities: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                className="w-full p-2 border rounded"
                placeholder="code, shell, browse"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Register</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </form>
      )}

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Agent ID</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Capabilities</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent: any) => (
              <tr key={agent.id} className="border-t">
                <td className="p-3">{agent.name}</td>
                <td className="p-3 font-mono text-sm">{agent.agentId}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${agent.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    {agent.status}
                  </span>
                </td>
                <td className="p-3">{Array.isArray(agent.capabilities) ? agent.capabilities.join(', ') : agent.capabilities}</td>
              </tr>
            ))}
            {agents.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">No agents registered yet. Click "Register New Agent" to add one.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}