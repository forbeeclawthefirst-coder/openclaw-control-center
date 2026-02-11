// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';

import TasksList from '@/components/tasks-list';

export default function TasksPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      <TasksList />
    </main>
  );
}