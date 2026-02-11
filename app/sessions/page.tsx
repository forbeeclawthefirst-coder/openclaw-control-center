export const dynamic = 'force-dynamic';

import SessionsList from '@/components/sessions-list';

export default function SessionsPage() {
  return (
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Sessions</h1>
      <SessionsList />
    </main>
  );
}