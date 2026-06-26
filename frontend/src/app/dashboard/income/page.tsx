"use client";
import { useEffect, useState, useCallback } from "react";
import { incomeApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Wallet, X, IndianRupee } from "lucide-react";

const CATEGORIES = [
  "SALARY", "BUSINESS", "FREELANCE", "INVESTMENT",
  "RENTAL", "BONUS", "GIFT", "OTHER",
];

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
const fmt = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;
const title = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        {children}
      </div>
    </div>
  );
}

export default function IncomePage() {
  const [month,    setMonth]    = useState(currentMonth());
  const [items,    setItems]    = useState<any[]>([]);
  const [total,    setTotal]    = useState(0);
  const [byCat,    setByCat]    = useState<Record<string, number>>({});
  const [loading,  setLoading]  = useState(true);
  const [showAdd,  setShowAdd]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");

  const [form, setForm] = useState({
    amount: "", category: "SALARY", source: "", description: "",
    date: new Date().toISOString().slice(0, 10), isRecurring: false,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await incomeApi.list(month);
      setItems(data.items); setTotal(data.total); setByCat(data.byCategory);
    } finally { setLoading(false); }
  }, [month]);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      await incomeApi.create({
        amount:      Number(form.amount),
        category:    form.category,
        source:      form.source || undefined,
        description: form.description || undefined,
        date:        new Date(form.date).toISOString(),
        isRecurring: form.isRecurring,
      });
      setShowAdd(false);
      setForm({ amount: "", category: "SALARY", source: "", description: "", date: new Date().toISOString().slice(0, 10), isRecurring: false });
      await load();
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Failed to add income");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this income entry?")) return;
    await incomeApi.remove(id);
    await load();
  }

  const topCats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income</h1>
          <p className="text-gray-500 mt-1">Track what comes in each month</p>
        </div>
        <div className="flex items-center gap-3">
          <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-40" />
          <Button onClick={() => setShowAdd(true)} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
            <Plus className="w-4 h-4" /> Add Income
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-5">
          <p className="text-xs text-gray-400">Total this month</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{fmt(total)}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-xs text-gray-400">Entries</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{items.length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-xs text-gray-400">Top source</p>
          <p className="text-lg font-semibold text-gray-800 mt-1">{topCats[0] ? title(topCats[0][0]) : "—"}</p>
        </CardContent></Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" /></div>
      ) : items.length === 0 ? (
        <Card className="text-center py-16"><CardContent>
          <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No income recorded for this month</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">Add your salary or other income to build your picture</p>
          <Button onClick={() => setShowAdd(true)} className="bg-emerald-600 hover:bg-emerald-700">Add your first income</Button>
        </CardContent></Card>
      ) : (
        <Card><CardHeader className="pb-2"><CardTitle className="text-base">Entries</CardTitle></CardHeader>
          <CardContent className="divide-y">
            {items.map((i) => (
              <div key={i.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{i.source || title(i.category)}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(i.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      {i.description ? ` · ${i.description}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {i.isRecurring && <Badge variant="outline" className="text-xs">Recurring</Badge>}
                  <Badge variant="outline" className="text-xs">{title(i.category)}</Badge>
                  <span className="font-semibold text-emerald-600">+{fmt(i.amount)}</span>
                  <button onClick={() => handleDelete(i.id)} className="text-gray-300 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)}>
        <h2 className="text-lg font-bold mb-4">Add Income</h2>
        {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-3">{error}</div>}
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Amount (₹)</Label>
              <Input type="number" min={1} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="50000" required />
            </div>
            <div><Label>Category</Label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {CATEGORIES.map((c) => <option key={c} value={c}>{title(c)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Source</Label>
              <Input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="e.g. Acme Corp" />
            </div>
            <div><Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
          </div>
          <div><Label>Note</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={form.isRecurring} onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })} />
            This income recurs every month
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700" disabled={saving}>
              {saving ? "Saving…" : "Add Income"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
