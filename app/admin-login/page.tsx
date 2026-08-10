import { Suspense } from "react";
import LoginForm from "@/components/admin/login-form";

export const metadata = {
  title: "Admin Login | Shiv Aadi",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-beige px-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}