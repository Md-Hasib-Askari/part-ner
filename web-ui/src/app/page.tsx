"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/atoms/loading';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard on load
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
