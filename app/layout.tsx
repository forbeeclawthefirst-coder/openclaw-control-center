import './globals.css'
import Link from 'next/link';

export const metadata = {
  title: 'OpenClaw Control Center',
  description: 'Manage your OpenClaw agents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  OpenClaw Control Center
                </Link>
                <div className="hidden md:flex space-x-4">
                  <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link href="/agents" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Agents
                  </Link>
                  <Link href="/tasks" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Tasks
                  </Link>
                  <Link href="/sessions" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Sessions
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  ● Connected to Main Instance
                </span>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}