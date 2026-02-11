'use client';

import { useEffect, useState } from 'react';

export default function TasksList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(data => {
        setTasks(data.tasks || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className="space-y-4">
      {tasks.map((task: any) => (
        <div key={task.id} className="p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">{task.type}</div>
              <div className="text-sm text-gray-500">
                Agent: {task.agent?.name || 'Unassigned'} | Priority: {task.priority}
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-sm ${
              task.status === 'completed' ? 'bg-green-100 text-green-800' :
              task.status === 'running' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100'
            }`}>
              {task.status}
            </span>
          </div>
          {task.progress > 0 && (
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded">
                <div className="h-2 bg-blue-500 rounded" style={{width: `${task.progress}%`}} />
              </div>
            </div>
          )}
        </div>
      ))}
      {tasks.length === 0 && (
        <div className="p-8 text-center text-gray-500">No tasks yet</div>
      )}
    </div>
  );
}