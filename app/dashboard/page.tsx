// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import DashboardStats from '@/components/dashboard-stats';

export default function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Suspense fallback={<div>Loading stats...</div>}>
        <DashboardStats />
      </Suspense>
    </main>
  );
}