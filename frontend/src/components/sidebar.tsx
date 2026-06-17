"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Target, BarChart3, MessageSquare,
  FileText, LogOut, TrendingUp,
} from "lucide-react";

const NAV = [
  { href: "/dashboard",          label: "Dashboard",  icon: LayoutDashboard },
  { href: "/dashboard/goals",    label: "Goals",      icon: Target          },
  { href: "/dashboard/portfolio",label: "Portfolio",  icon: BarChart3       },
  { href: "/dashboard/chat",     label: "AI Chat",    icon: MessageSquare   },
  { href: "/dashboard/review",   label: "Review",     icon: FileText        },
];

export function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, refreshToken, clearAuth } = useAuthStore();

  async function handleLogout() {
    try { if (refreshToken) await authApi.logout(refreshToken); } catch { /* ignore */ }
    clearAuth();
    router.push("/login");
  }

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-emerald-400 w-6 h-6" />
          <span className="font-bold text-lg text-emerald-400">WealthWise</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">AI Personal CFO</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href} href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-emerald-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-4 py-4 border-t border-gray-800">
        {user && (
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
            <span className="inline-block mt-1 text-xs bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-full">
              {user.plan}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
