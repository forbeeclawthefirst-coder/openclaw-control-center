'use client';

import { useEffect, useState } from 'react';

export default function TasksList() {
  const [tasks, setTasks] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'code-review',
    priority: 'normal',
    payload: '',
    requiredCapabilities: []
  });

  const fetchData = () => {
    Promise.all([
      fetch('/api/tasks').then(r => r.json()),
      fetch('/api/agents').then(r => r.json())
    ])
      .then(([tasksData, agentsData]) => {
        setTasks(tasksData.tasks || []);
        setAgents(agentsData.agents || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        payload: formData.payload ? JSON.parse(formData.payload) : {}
      })
    });
    
    setShowForm(false);
    setFormData({ type: 'code-review', priority: 'normal', payload: '', requiredCapabilities: [] });
    fetchData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100';
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create New Task
        </button>
        <button 
          onClick={fetchData}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Refresh
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-3">Create New Task</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Task Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="code-review">Code Review</option>
                <option value="deploy">Deploy</option>
                <option value="analyze">Analyze</option>
                <option value="test">Test</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium">Priority</label>
              <select 
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium">Required Capabilities</label>
              <input 
                type="text" 
                value={formData.requiredCapabilities.join(', ')}
                onChange={e => setFormData({...formData, requiredCapabilities: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                className="w-full p-2 border rounded"
                placeholder="code, shell, github"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium">Payload (JSON)</label>
              <textarea 
                value={formData.payload}
                onChange={e => setFormData({...formData, payload: e.target.value})}
                className="w-full p-2 border rounded h-24 font-mono text-sm"
                placeholder='{"repo": "myrepo", "branch": "main"}'
              />
            </div>
            
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Create Task</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {tasks.map((task: any) => (
          <div key={task.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{task.type}</span>
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Priority: {task.priority}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Agent: {task.agent?.name || <span className="text-orange-500">Unassigned</span>} 
                  | Created: {new Date(task.createdAt).toLocaleString()}
                </div>
                
                {task.progress > 0 && (
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded w-48">
                      <div 
                        className="h-2 bg-blue-500 rounded transition-all" 
                        style={{width: `${task.progress}%`}} 
                      />
                    </div>
                    <span className="text-sm text-gray-600">{task.progress}%</span>
                  </div>
                )}
              </div>
              
              {task.status === 'pending' && agents.length > 0 && (
                <button 
                  onClick={async () => {
                    await fetch(`/api/tasks/${task.id}/assign`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ agentId: agents[0].id })
                    });
                    fetchData();
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Assign to {agents[0].name}
                </button>
              )}
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="p-8 text-center text-gray-500 border rounded">No tasks yet. Click "Create New Task" to add one.</div>
        )}
      </div>
    </div>
  );
}