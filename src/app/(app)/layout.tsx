
"use client"; // This directive is essential for using hooks like useRouter and useAuth
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // Corrected import path
import { useAuth } from '@/contexts/auth-context';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'; // Assuming DashboardLayout exists

// Rename folder (app) to (dashboard) in your file system
// And update route name in page.tsx from HomePage to DashboardRedirectPage if needed.
// For this file, it assumes it's in src/app/(dashboard)/layout.tsx

export default function ProtectedAppLayout({ children }: { children: ReactNode }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.replace('/login');
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If DashboardLayout handles its own structure (sidebars, etc.), 
  // then this AppLayout primarily serves as the auth guard.
  return <DashboardLayout>{children}</DashboardLayout>;
}
