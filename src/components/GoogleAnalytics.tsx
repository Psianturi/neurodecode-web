'use client';
import { Suspense } from 'react';
import { useGoogleAnalytics } from '@/lib/analytics';

function GATracker() {
  useGoogleAnalytics();
  return null;
}

export default function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GATracker />
    </Suspense>
  );
}
