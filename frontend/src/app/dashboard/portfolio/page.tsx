"use client";
import { useEffect, useState } from "react";
import { portfolioApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, BarChart3, X } from "lucide-react";

const ASSET_TYPES = ["STOCK","ETF","MUTUAL_FUND","CRYPTO","GOLD","BOND","PPF","NPS","FD","REAL_ESTATE","CASH","OTHER"];

const TYPE_COLOR: Record<string, string> = {
  STOCK:"bg-blue-100 text-blue-700", ETF:"bg-indigo-100 text-indigo-700",
  MUTUAL_FUND:"bg-purple-100 text-purple-700", CRYPTO:"bg-orange-100 text-orange-700",
  GOLD:"bg-yellow-100 text-yellow-700", BOND:"bg-teal-100 text-teal-700",
  PPF:"bg-green-100 text-green-700", NPS:"bg-emerald-100 text-emerald-700",
  FD:"bg-cyan-100 text-cyan-700", REAL_ESTATE:"bg-rose-100 text-rose-700",
  CASH:"bg-gray-100 text-gray-700", OTHER:"bg-gray-100 text-gray-500",
};

function AllocationBar({ byType }: { byType: Array<{ type: string; allocation: number; value: number }> }) {
  const colors = ["bg-blue-500","bg-yellow-400","bg-purple-500","bg-orange-400","bg-teal-500","bg-pink-400","bg-indigo-500","bg-green-500"];
  return (
    <div className="space-y-3">
      <div className="flex h-5 rounded-full overflow-hidden gap-0.5">
        {byType.map((b, i) => (
          <div key={b.type} className={`${colors[i % colors.length]} transition-all`} style={{ width: `${b.allocation}%` }}
            title={`${b.type}: ${b.allocation}%`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {byType.map((b, i) => (
          <div key={b.type} className="flex items-center gap-1.5 text-xs">
            <span className={`w-2.5 h-2.5 rounded-sm ${colors[i % colors.length]}`} />
            <span className="text-gray-600">{b.type.replace("_"," ")}</span>
            <span className="font-semibold text-gray-800">{b.allocation}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        {children}
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const [data,       setData]       = useState<any>(null);
  const [loading,    setLoading]    = useState(true);
  const [showAdd,    setShowAdd]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState("");
  const [form, setForm] = useState({ symbol:"", name:"", type:"STOCK", quantity:"", avgBuyPrice:"" });

  async function load() {
    try { const { data: d } = await portfolioApi.get(); setData(d); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      await portfolioApi.addAsset({ symbol:form.symbol, name:form.name, type:form.type, quantity:Number(form.quantity), avgBuyPrice:Number(form.avgBuyPrice) });
      setShowAdd(false);
      setForm({ symbol:"", name:"", type:"STOCK", quantity:"", avgBuyPrice:"" });
      await load();
    } catch(err: any) { setError(err.response?.data?.error ?? "Failed to add asset"); }
    finally { setSaving(false); }
  }

  async function handleRemove(id: string, symbol: string) {
    if (!confirm(`Remove ${symbol} from portfolio?`)) return;
    await portfolioApi.removeAsset(id);
    await load();
  }

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"/></div>;

  const totalValue = data?.allocation?.totalValue ?? 0;
  const assets: any[] = data?.assets ?? [];
  const byType: any[] = data?.allocation?.byType ?? [];
  const divScore: number = data?.allocation?.diversificationScore ?? 0;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-500 mt-1">{assets.length} assets · diversification {divScore}/10</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
          <Plus className="w-4 h-4" /> Add Asset
        </Button>
      </div>

      {/* Total + Allocation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Total Value</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">₹{totalValue.toLocaleString("en-IN")}</p>
            <p className="text-xs text-gray-400 mt-1">{assets.length} holdings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Diversification</p>
            <p className="text-3xl font-bold mt-1" style={{ color: divScore>=7?"#10b981":divScore>=4?"#f59e0b":"#ef4444" }}>
              {divScore}<span className="text-lg text-gray-400">/10</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">{byType.length} asset classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Largest Holding</p>
            {byType[0] ? (
              <>
                <p className="text-xl font-bold text-gray-900 mt-1">{byType[0].type.replace("_"," ")}</p>
                <p className="text-xs text-gray-400 mt-1">{byType[0].allocation}% of portfolio</p>
              </>
            ) : <p className="text-gray-400 mt-2 text-sm">No assets yet</p>}
          </CardContent>
        </Card>
      </div>

      {/* Allocation chart */}
      {byType.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" /> Allocation Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AllocationBar byType={byType} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
              {byType.map((b) => (
                <div key={b.type} className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-500">{b.type.replace("_"," ")}</p>
                  <p className="font-semibold text-gray-800 text-sm">₹{Number(b.value).toLocaleString("en-IN")}</p>
                  <p className="text-xs text-emerald-600">{b.allocation}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Asset list */}
      {assets.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No assets yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-6">Add your first investment to start tracking your portfolio</p>
            <Button onClick={() => setShowAdd(true)} className="bg-emerald-600 hover:bg-emerald-700">Add your first asset</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Symbol","Name","Type","Qty","Avg Price","Value",""].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {assets.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-800">{a.symbol}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{a.name}</td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs ${TYPE_COLOR[a.type] ?? "bg-gray-100 text-gray-500"}`}>{a.type.replace("_"," ")}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{a.quantity}</td>
                    <td className="px-4 py-3 text-gray-700">₹{Number(a.avgBuyPrice).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">₹{Number(a.currentValue).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleRemove(a.id, a.symbol)} className="text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Add Asset Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)}>
        <h2 className="text-lg font-bold mb-4">Add Asset</h2>
        {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-3">{error}</div>}
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Symbol</Label>
              <Input value={form.symbol} onChange={e=>setForm({...form,symbol:e.target.value.toUpperCase()})} placeholder="INFY" required />
            </div>
            <div><Label>Type</Label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {ASSET_TYPES.map(t=><option key={t} value={t}>{t.replace("_"," ")}</option>)}
              </select>
            </div>
          </div>
          <div><Label>Name</Label>
            <Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Infosys Ltd." required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Quantity</Label>
              <Input type="number" min={0.00000001} step="any" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} placeholder="10" required />
            </div>
            <div><Label>Avg Buy Price (₹)</Label>
              <Input type="number" min={0.00000001} step="any" value={form.avgBuyPrice} onChange={e=>setForm({...form,avgBuyPrice:e.target.value})} placeholder="1500" required />
            </div>
          </div>
          {form.quantity && form.avgBuyPrice && (
            <p className="text-xs text-emerald-600 font-medium">
              Value: ₹{(Number(form.quantity)*Number(form.avgBuyPrice)).toLocaleString("en-IN")}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={()=>setShowAdd(false)}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700" disabled={saving}>
              {saving?"Adding…":"Add Asset"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
