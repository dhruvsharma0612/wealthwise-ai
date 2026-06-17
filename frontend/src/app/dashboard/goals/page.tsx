"use client";
import { useEffect, useState } from "react";
import { goalsApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, TrendingUp, Target, X, IndianRupee } from "lucide-react";

const CATEGORIES = [
  "RETIREMENT","HOME","EDUCATION","TRAVEL","EMERGENCY_FUND",
  "VEHICLE","WEDDING","INVESTMENT","OTHER",
];

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:    "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  PAUSED:    "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function ProgressBar({ pct }: { pct: number }) {
  const color = pct >= 75 ? "bg-emerald-500" : pct >= 40 ? "bg-yellow-400" : "bg-red-400";
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
      <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${Math.min(pct,100)}%` }} />
    </div>
  );
}

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

export default function GoalsPage() {
  const { user } = useAuthStore();
  const [goals,        setGoals]        = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [showCreate,   setShowCreate]   = useState(false);
  const [contribute,   setContribute]   = useState<{ id: string; title: string } | null>(null);
  const [amount,       setAmount]       = useState("");
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState("");

  const [form, setForm] = useState({
    title: "", category: "OTHER", targetAmount: "", currentAmount: "0",
    monthlySIP: "", targetDate: "", priority: "medium",
  });

  async function load() {
    try {
      const { data } = await goalsApi.list();
      setGoals(data.goals);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      await goalsApi.create({
        title:         form.title,
        category:      form.category,
        targetAmount:  Number(form.targetAmount),
        currentAmount: Number(form.currentAmount || 0),
        monthlySIP:    form.monthlySIP ? Number(form.monthlySIP) : undefined,
        targetDate:    form.targetDate ? new Date(form.targetDate).toISOString() : undefined,
        priority:      form.priority,
      });
      setShowCreate(false);
      setForm({ title:"", category:"OTHER", targetAmount:"", currentAmount:"0", monthlySIP:"", targetDate:"", priority:"medium" });
      await load();
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Failed to create goal");
    } finally { setSaving(false); }
  }

  async function handleContribute(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      await goalsApi.contribute(contribute!.id, Number(amount));
      setContribute(null); setAmount("");
      await load();
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this goal?")) return;
    await goalsApi.remove(id);
    await load();
  }

  const active    = goals.filter(g => g.status === "ACTIVE");
  const completed = goals.filter(g => g.status === "COMPLETED");

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"/></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
          <p className="text-gray-500 mt-1">{active.length} active · {completed.length} completed</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
          <Plus className="w-4 h-4" /> New Goal
        </Button>
      </div>

      {/* Empty state */}
      {goals.length === 0 && (
        <Card className="text-center py-16">
          <CardContent>
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No goals yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-6">Set your first financial goal to start tracking progress</p>
            <Button onClick={() => setShowCreate(true)} className="bg-emerald-600 hover:bg-emerald-700">Create your first goal</Button>
          </CardContent>
        </Card>
      )}

      {/* Active goals */}
      {active.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {active.map((g) => (
            <Card key={g.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{g.title}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge className={STATUS_COLOR[g.status]}>{g.status}</Badge>
                      <Badge variant="outline" className="text-xs">{g.category.replace("_"," ")}</Badge>
                      <Badge variant="outline" className={`text-xs ${g.priority==="high"?"border-red-300 text-red-600":g.priority==="low"?"border-gray-300 text-gray-500":"border-yellow-300 text-yellow-600"}`}>
                        {g.priority}
                      </Badge>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(g.id)} className="text-gray-300 hover:text-red-400 transition-colors mt-0.5">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-semibold text-gray-800">{g.percentComplete}%</span>
                </div>
                <ProgressBar pct={g.percentComplete} />

                <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                  <div>
                    <p className="text-gray-400 text-xs">Saved</p>
                    <p className="font-semibold">₹{Number(g.currentAmount).toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Target</p>
                    <p className="font-semibold">₹{Number(g.targetAmount).toLocaleString("en-IN")}</p>
                  </div>
                  {g.monthlySIP && (
                    <div>
                      <p className="text-gray-400 text-xs">Monthly SIP</p>
                      <p className="font-semibold text-emerald-600">₹{Number(g.monthlySIP).toLocaleString("en-IN")}</p>
                    </div>
                  )}
                  {g.monthsToTarget != null && (
                    <div>
                      <p className="text-gray-400 text-xs">Months left</p>
                      <p className={`font-semibold ${g.onTrack===false?"text-red-500":"text-gray-800"}`}>
                        {g.monthsToTarget} {g.onTrack===false && "⚠️"}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  size="sm" variant="outline"
                  onClick={() => { setContribute({ id: g.id, title: g.title }); setAmount(""); }}
                  className="w-full mt-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <TrendingUp className="w-3 h-3 mr-1" /> Add Contribution
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Completed goals */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Completed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completed.map((g) => (
              <Card key={g.id} className="opacity-75">
                <CardContent className="pt-5 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">{g.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">₹{Number(g.targetAmount).toLocaleString("en-IN")} · {g.category.replace("_"," ")}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">✓ Done</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)}>
        <h2 className="text-lg font-bold mb-4">Create Goal</h2>
        {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-3">{error}</div>}
        <form onSubmit={handleCreate} className="space-y-3">
          <div><Label>Title</Label>
            <Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Emergency Fund" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Category</Label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {CATEGORIES.map(c=><option key={c} value={c}>{c.replace("_"," ")}</option>)}
              </select>
            </div>
            <div><Label>Priority</Label>
              <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Target Amount (₹)</Label>
              <Input type="number" min={1} value={form.targetAmount} onChange={e=>setForm({...form,targetAmount:e.target.value})} placeholder="600000" required />
            </div>
            <div><Label>Already Saved (₹)</Label>
              <Input type="number" min={0} value={form.currentAmount} onChange={e=>setForm({...form,currentAmount:e.target.value})} placeholder="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Monthly SIP (₹)</Label>
              <Input type="number" min={0} value={form.monthlySIP} onChange={e=>setForm({...form,monthlySIP:e.target.value})} placeholder="Optional" />
            </div>
            <div><Label>Target Date</Label>
              <Input type="date" value={form.targetDate} onChange={e=>setForm({...form,targetDate:e.target.value})} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={()=>setShowCreate(false)}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700" disabled={saving}>
              {saving?"Saving…":"Create Goal"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Contribute Modal */}
      <Modal open={!!contribute} onClose={()=>setContribute(null)}>
        <h2 className="text-lg font-bold mb-1">Add Contribution</h2>
        <p className="text-sm text-gray-500 mb-4">{contribute?.title}</p>
        <form onSubmit={handleContribute} className="space-y-4">
          <div>
            <Label>Amount (₹)</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input type="number" min={1} value={amount} onChange={e=>setAmount(e.target.value)}
                placeholder="Enter amount" className="pl-9" required />
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={()=>setContribute(null)}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700" disabled={saving}>
              {saving?"Adding…":"Add"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
