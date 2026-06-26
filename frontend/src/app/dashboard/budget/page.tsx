"use client";
import { useEffect, useState, useCallback } from "react";
import { budgetsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, PiggyBank, X, AlertTriangle } from "lucide-react";

const CATEGORIES = [
  "HOUSING", "FOOD", "TRANSPORT", "UTILITIES", "HEALTHCARE",
  "ENTERTAINMENT", "SHOPPING", "EDUCATION", "PERSONAL",
  "INSURANCE", "DEBT", "SAVINGS", "OTHER",
];

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
const fmt = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;
const title = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

const BAR: Record<string, string> = { ok: "bg-emerald-500", warning: "bg-yellow-400", over: "bg-red-500" };
const PILL: Record<string, string> = {
  ok: "bg-emerald-100 text-emerald-700", warning: "bg-yellow-100 text-yellow-700", over: "bg-red-100 text-red-700",
};

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        {children}
      </div>
    </div>
  );
}

export default function BudgetPage() {
  const [month,   setMonth]   = useState(currentMonth());
  const [data,    setData]    = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSet, setShowSet] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [form,    setForm]    = useState({ category: "HOUSING", amount: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await budgetsApi.list(month);
      setData(data);
    } finally { setLoading(false); }
  }, [month]);

  useEffect(() => { load(); }, [load]);

  async function handleSet(e: React.FormEvent) {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      await budgetsApi.set({ month, category: form.category, amount: Number(form.amount) });
      setShowSet(false); setForm({ category: "HOUSING", amount: "" });
      await load();
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Failed to set budget");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this budget limit?")) return;
    await budgetsApi.remove(id);
    await load();
  }

  const items       = data?.items ?? [];
  const totalBudget = data?.totalBudget ?? 0;
  const totalSpent  = data?.totalSpent ?? 0;
  const totalPct    = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const unbudgeted  = Object.entries(data?.unbudgeted ?? {}) as [string, number][];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
          <p className="text-gray-500 mt-1">Plan spending and track against it</p>
        </div>
        <div className="flex items-center gap-3">
          <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-40" />
          <Button onClick={() => setShowSet(true)} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
            <Plus className="w-4 h-4" /> Set Budget
          </Button>
        </div>
      </div>

      {/* Overall */}
      <Card><CardContent className="pt-5">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-xs text-gray-400">Spent of budget</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{fmt(totalSpent)} <span className="text-base font-normal text-gray-400">/ {fmt(totalBudget)}</span></p>
          </div>
          <span className={`text-sm font-semibold ${totalPct > 100 ? "text-red-600" : "text-gray-600"}`}>{totalPct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div className={`${totalPct > 100 ? "bg-red-500" : totalPct >= 80 ? "bg-yellow-400" : "bg-emerald-500"} h-2.5 rounded-full transition-all`} style={{ width: `${Math.min(totalPct, 100)}%` }} />
        </div>
      </CardContent></Card>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" /></div>
      ) : items.length === 0 ? (
        <Card className="text-center py-16"><CardContent>
          <PiggyBank className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No budgets set for this month</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">Set a limit per category to take control of spending</p>
          <Button onClick={() => setShowSet(true)} className="bg-emerald-600 hover:bg-emerald-700">Set your first budget</Button>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((b: any) => (
            <Card key={b.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{title(b.category)}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={PILL[b.status]}>
                      {b.status === "over" ? "Over" : b.status === "warning" ? "Close" : "On track"}
                    </Badge>
                    <button onClick={() => handleDelete(b.id)} className="text-gray-300 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{fmt(b.spent)} spent</span>
                  <span className="text-gray-500">of {fmt(b.amount)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${BAR[b.status]} h-2 rounded-full transition-all`} style={{ width: `${Math.min(b.percentUsed, 100)}%` }} />
                </div>
                <p className={`text-sm font-medium ${b.remaining < 0 ? "text-red-600" : "text-emerald-600"}`}>
                  {b.remaining < 0 ? `${fmt(Math.abs(b.remaining))} over budget` : `${fmt(b.remaining)} left`}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Unbudgeted spend warning */}
      {unbudgeted.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-2 text-yellow-700">
              <AlertTriangle className="w-4 h-4" />
              <p className="font-medium text-sm">Spending without a budget</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {unbudgeted.map(([cat, amt]) => (
                <Badge key={cat} variant="outline" className="text-xs">{title(cat)}: {fmt(amt)}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Set Modal */}
      <Modal open={showSet} onClose={() => setShowSet(false)}>
        <h2 className="text-lg font-bold mb-1">Set Budget</h2>
        <p className="text-sm text-gray-500 mb-4">For {month}</p>
        {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-3">{error}</div>}
        <form onSubmit={handleSet} className="space-y-3">
          <div><Label>Category</Label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {CATEGORIES.map((c) => <option key={c} value={c}>{title(c)}</option>)}
            </select>
          </div>
          <div><Label>Monthly limit (₹)</Label>
            <Input type="number" min={1} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="15000" required />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowSet(false)}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700" disabled={saving}>
              {saving ? "Saving…" : "Save Budget"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
