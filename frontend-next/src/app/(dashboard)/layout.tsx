'use client';

import { Suspense } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Navbar } from '@/components/navbar';
import { PageLoading } from '@/components/page-loading';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<PageLoading />}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

