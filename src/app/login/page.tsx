'use client';

import { useEffect, useState } from 'react';
import { LoginForm } from './login-form';

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('message') || params.get('error');
    if (msg) setMessage(msg);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <div className="w-full max-w-md">
        {message && (
          <div className="mb-4 p-3 rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan text-sm">
            {message}
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
