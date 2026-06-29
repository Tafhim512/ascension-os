import { Suspense } from "react";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <Suspense fallback={<div className="text-text-secondary">Loading...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}