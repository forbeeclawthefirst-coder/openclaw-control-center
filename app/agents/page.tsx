export const dynamic = 'force-dynamic';

import AgentsTable from '@/components/agents-table';

export default function AgentsPage() {
  return (
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Agents</h1>
      <AgentsTable />
    </main>
  );
}