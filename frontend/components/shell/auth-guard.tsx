"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [token, router]);

  if (!ready) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-sky-500/30 border-t-sky-500 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
