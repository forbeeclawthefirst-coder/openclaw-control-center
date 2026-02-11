export const dynamic = 'force-dynamic';

import TasksList from '@/components/tasks-list';

export default function TasksPage() {
  return (
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      <TasksList />
    </main>
  );
}