'use client';

import { useEffect, useState } from 'react';

export default function SessionsList() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sessions')
      .then(r => r.json())
      .then(data => {
        setSessions(data.sessions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading sessions...</div>;

  return (
    <div className="space-y-4">
      {sessions.map((session: any) => (
        <div key={session.id} className="p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">{session.title || 'Untitled Session'}</div>
              <div className="text-sm text-gray-500">
                Agent: {session.agent?.name || 'Unknown'} | Messages: {session._count?.messages || 0}
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-sm ${session.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
              {session.status}
            </span>
          </div>
        </div>
      ))}
      {sessions.length === 0 && (
        <div className="p-8 text-center text-gray-500">No sessions yet</div>
      )}
    </div>
  );
}