"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuth } = useAuthStore();
  const router     = useRouter();

  useEffect(() => {
    if (!isAuth) router.replace("/login");
  }, [isAuth, router]);

  if (!isAuth) return null;
  return <>{children}</>;
}
