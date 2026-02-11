// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';

import SessionsList from '@/components/sessions-list';

export default function SessionsPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Sessions</h1>
      <SessionsList />
    </main>
  );
}