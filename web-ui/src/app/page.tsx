"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/atoms/loading';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to sign-in on load
    router.push('/sign-in');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground">Redirecting to Sign In...</p>
      </div>
    </div>
  );
}
