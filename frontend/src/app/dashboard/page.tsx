"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { profileApi, goalsApi, portfolioApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, BarChart3, AlertCircle, CheckCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  const r = 54, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} strokeWidth="12" stroke="#e5e7eb" fill="none" />
        <circle cx="70" cy="70" r={r} strokeWidth="12" stroke={color} fill="none"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-bold" style={{ color }}>{score}</p>
        <p className="text-xs text-gray-500">/ 100</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [health,    setHealth]    = useState<any>(null);
  const [goals,     setGoals]     = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      profileApi.healthScore(),
      goalsApi.list(),
      portfolioApi.get(),
    ]).then(([h, g, p]) => {
      setHealth(h.data);
      setGoals(g.data.goals);
      setPortfolio(p.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
      </div>
    );
  }

  const activeGoals    = goals.filter((g) => g.status === "ACTIVE");
  const completedGoals = goals.filter((g) => g.status === "COMPLETED");
  const totalPortfolio = portfolio?.allocation?.totalValue ?? 0;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Good morning, {user?.firstName} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s your financial health at a glance.</p>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Health Score */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Financial Health Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            {health ? (
              <>
                <ScoreRing score={health.score} />
                <Badge
                  className={
                    health.score >= 80 ? "bg-emerald-100 text-emerald-700" :
                    health.score >= 60 ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }
                >
                  {health.grade}
                </Badge>
              </>
            ) : (
              <p className="text-gray-400 text-sm">No data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Summary cards */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Portfolio Value</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {user?.currency} {totalPortfolio.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{portfolio?.assets?.length ?? 0} assets</p>
                </div>
                <BarChart3 className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Active Goals</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{activeGoals.length}</p>
                  <p className="text-xs text-gray-400 mt-1">{completedGoals.length} completed</p>
                </div>
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <p className="text-sm font-medium text-gray-700">Top Recommendation</p>
              </div>
              {health?.recommendations?.[0] ? (
                <p className="text-sm text-gray-600">{health.recommendations[0]}</p>
              ) : (
                <p className="text-sm text-gray-400">Complete your financial profile to get recommendations.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      {health && (health.strengths.length > 0 || health.weaknesses.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {health.strengths.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>{s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" /> Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {health.weaknesses.map((w: string, i: number) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">!</span>{w}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Goals */}
      {activeGoals.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Link href="/dashboard/goals" className="text-xs text-emerald-600 flex items-center hover:underline">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeGoals.slice(0, 3).map((g) => (
                <div key={g.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{g.title}</span>
                    <span className="text-gray-500">{g.percentComplete}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${g.percentComplete}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {user?.currency} {g.currentAmount.toLocaleString()} / {g.targetAmount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
