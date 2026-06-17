"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Loader2, Plus, X } from "lucide-react";
import api from "@/lib/api";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const EXPENSE_CATEGORIES = ["Food","Rent","Transport","Utilities","Shopping","Entertainment","Healthcare","Education","EMI","Other"];

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;
}

export default function ReviewPage() {
  const now          = new Date();
  const currentMonth = monthKey(now);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [review,     setReview]     = useState<any>(null);
  const [loading,    setLoading]    = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error,      setError]      = useState("");
  const [showForm,   setShowForm]   = useState(false);

  // Input form state
  const [income,   setIncome]   = useState("");
  const [spent,    setSpent]    = useState("");
  const [invested, setInvested] = useState("0");
  const [expenses, setExpenses] = useState<Array<{cat: string; amt: string}>>([
    { cat: "Food", amt: "" }, { cat: "Rent", amt: "" },
  ]);

  // Build last-6 months options
  const monthOptions = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return { key: monthKey(d), label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}` };
  });

  useEffect(() => { loadReview(selectedMonth); }, [selectedMonth]);

  async function loadReview(month: string) {
    setReview(null); setLoading(true); setError("");
    try {
      const { data } = await api.get(`/api/reviews/${month}`);
      setReview(data);
    } catch { /* no review yet */ }
    finally { setLoading(false); }
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setGenerating(true);
    try {
      const expenseBreakdown: Record<string, number> = {};
      expenses.forEach(({ cat, amt }) => { if (amt) expenseBreakdown[cat] = Number(amt); });

      const { data } = await api.post("/api/reviews/generate", {
        month:          selectedMonth,
        incomeReceived: Number(income),
        totalSpent:     Number(spent),
        totalInvested:  Number(invested) || 0,
        expenseBreakdown,
      });
      setReview(data);
      setShowForm(false);
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Failed to generate review");
    } finally { setGenerating(false); }
  }

  const savingsRate = income && spent
    ? Math.round(((Number(income)-Number(spent))/Number(income))*100)
    : null;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Review</h1>
          <p className="text-gray-500 mt-1">AI-generated financial analysis powered by Claude</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="h-9 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {monthOptions.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
          </select>
          {!review && !loading && (
            <Button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Sparkles className="w-4 h-4"/> Generate Review
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      {/* Input form */}
      {showForm && (
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Enter {monthOptions.find(m=>m.key===selectedMonth)?.label} Numbers</CardTitle>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Income Received (₹)</Label>
                  <Input type="number" min={1} value={income} onChange={e=>setIncome(e.target.value)} placeholder="80000" required className="mt-1"/>
                </div>
                <div>
                  <Label>Total Spent (₹)</Label>
                  <Input type="number" min={0} value={spent} onChange={e=>setSpent(e.target.value)} placeholder="55000" required className="mt-1"/>
                </div>
                <div>
                  <Label>Total Invested (₹)</Label>
                  <Input type="number" min={0} value={invested} onChange={e=>setInvested(e.target.value)} placeholder="10000" className="mt-1"/>
                </div>
              </div>

              {savingsRate !== null && (
                <div className={`text-sm font-medium px-4 py-2.5 rounded-lg ${savingsRate>=20?"bg-emerald-50 text-emerald-700":savingsRate>=10?"bg-yellow-50 text-yellow-700":"bg-red-50 text-red-600"}`}>
                  Savings this month: ₹{(Number(income)-Number(spent)).toLocaleString("en-IN")} ({savingsRate}% savings rate)
                  {savingsRate<10&&" — below recommended 20%"}
                </div>
              )}

              {/* Expense breakdown */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Expense Breakdown (optional)</Label>
                  <button type="button" onClick={()=>setExpenses(p=>[...p,{cat:"Other",amt:""}])}
                    className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3"/> Add category
                  </button>
                </div>
                <div className="space-y-2">
                  {expenses.map((ex, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <select value={ex.cat} onChange={e=>setExpenses(p=>p.map((x,j)=>j===i?{...x,cat:e.target.value}:x))}
                        className="h-9 w-36 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        {EXPENSE_CATEGORIES.map(c=><option key={c}>{c}</option>)}
                      </select>
                      <Input type="number" min={0} placeholder="Amount"
                        value={ex.amt} onChange={e=>setExpenses(p=>p.map((x,j)=>j===i?{...x,amt:e.target.value}:x))}
                        className="flex-1 h-9"/>
                      {expenses.length>1 && (
                        <button type="button" onClick={()=>setExpenses(p=>p.filter((_,j)=>j!==i))}
                          className="text-gray-300 hover:text-red-400 shrink-0"><X className="w-4 h-4"/></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" className="flex-1" onClick={()=>setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={generating} className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2">
                  {generating ? <><Loader2 className="w-4 h-4 animate-spin"/>Generating…</> : <><Sparkles className="w-4 h-4"/>Generate</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"/>
        </div>
      )}

      {/* Empty state */}
      {!loading && !review && !showForm && (
        <Card className="text-center py-16">
          <CardContent>
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4"/>
            <p className="font-semibold text-gray-800">
              No review for {monthOptions.find(m=>m.key===selectedMonth)?.label}
            </p>
            <p className="text-gray-500 text-sm mt-2 mb-6 max-w-sm mx-auto">
              Enter your monthly income, spending, and investments to get a personalised AI review.
            </p>
            <Button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Sparkles className="w-4 h-4"/> Generate Review
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Review display */}
      {review && (
        <div className="space-y-5">
          {/* KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Health Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{review.healthScore ?? "—"}</p>
                <p className="text-xs text-gray-400 mt-1">out of 100</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Savings Rate</p>
                <p className={`text-3xl font-bold mt-1 ${review.savingsRate>=20?"text-emerald-600":review.savingsRate>=10?"text-yellow-500":"text-red-500"}`}>
                  {review.savingsRate}%
                </p>
                <p className="text-xs text-gray-400 mt-1">target: 20%+</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Period</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {monthOptions.find(m=>m.key===(review.month??selectedMonth))?.label ?? review.month}
                </p>
                {review.generatedAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.generatedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          {review.summary && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500"/> Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">{review.summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Wins & Concerns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {review.wins?.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500"/> Wins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {review.wins.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/>{s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {review.concerns?.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500"/> Concerns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {review.concerns.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <TrendingDown className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0"/>{s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recommendations */}
          {review.recommendations?.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500"/> Action Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {review.recommendations.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                      <span className="text-gray-700 leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {/* Next month focus */}
          {review.nextMonthFocus?.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Next Month Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {review.nextMonthFocus.map((f: string, i: number) => (
                    <Badge key={i} className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-3 py-1">{f}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Regenerate */}
          <div className="text-center pt-2">
            <Button variant="outline" onClick={() => { setShowForm(true); setReview(null); }} className="gap-2 text-sm">
              <Sparkles className="w-3 h-3"/> Generate New Review
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
