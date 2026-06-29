import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <Suspense fallback={<div className="text-text-secondary">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}