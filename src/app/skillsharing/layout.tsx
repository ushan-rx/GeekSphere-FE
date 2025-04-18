'use client';

import { SidebarLeft } from '@/components/sideBar/sidebar-left';
import DynamicBreadcrumb from '@/components/dynamicBreadcrumb';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function SkillSharingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <SidebarLeft className="hidden lg:flex" />
        <div className="flex-1 space-y-4 p-4 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Skill Sharing</h2>
          </div>
          <DynamicBreadcrumb />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
} 