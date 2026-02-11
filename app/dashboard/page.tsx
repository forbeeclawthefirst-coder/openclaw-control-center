export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import DashboardStats from '@/components/dashboard-stats';

export default function DashboardPage() {
  return (
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Suspense fallback={<div>Loading stats...</div>}>
        <DashboardStats />
      </Suspense>
    </main>
  );
}