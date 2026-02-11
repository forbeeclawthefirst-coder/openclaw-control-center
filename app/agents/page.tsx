// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';

import AgentsTable from '@/components/agents-table';

export default function AgentsPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Agents</h1>
      <AgentsTable />
    </main>
  );
}