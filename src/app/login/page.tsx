'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoginForm } from './login-form';

function LoginContent() {
  const searchParams = useSearchParams();
  const msg = searchParams.get('message') || searchParams.get('error');
  const [message] = useState<string | null>(msg);

  if (message) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
        <div className="w-full max-w-md">
          <div className="mb-4 p-3 rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan text-sm">
            {message}
          </div>
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
