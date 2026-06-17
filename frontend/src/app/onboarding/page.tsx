"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";
import { CheckCircle, ChevronRight, User, Wallet, ShieldCheck, Banknote, Target } from "lucide-react";

const STEPS = [
  { id: 1, key: "PERSONAL_INFO",   label: "Personal Info",   icon: User         },
  { id: 2, key: "INCOME_EXPENSES", label: "Income",          icon: Wallet       },
  { id: 3, key: "RISK_PROFILE",    label: "Risk Profile",    icon: ShieldCheck  },
  { id: 4, key: "EMERGENCY_LOANS", label: "Emergency Fund",  icon: Banknote     },
  { id: 5, key: "GOALS",           label: "Goals",           icon: Target       },
];

export default function OnboardingPage() {
  const router   = useRouter();
  const { user } = useAuthStore();
  const [step,    setStep]    = useState(1);
  const [error,   setError]   = useState("");
  const [saving,  setSaving]  = useState(false);
  const [done,    setDone]    = useState(false);

  // Step forms
  const [personal, setPersonal] = useState({ age:"", occupation:"", maritalStatus:"SINGLE", dependents:"0" });
  const [income,   setIncome]   = useState({ monthlyIncome:"", monthlyExpenses:"" });
  const [risk,     setRisk]     = useState({ riskProfile:"MODERATE", investmentExperience:"BEGINNER", insuranceCoverage:"false" });
  const [emergency,setEmergency]= useState({ emergencyFundAmount:"" });
  const [goals,    setGoals]    = useState([{ title:"", category:"EMERGENCY_FUND", targetAmount:"", monthlySIP:"", priority:"high" }]);

  function addGoal() {
    setGoals(g => [...g, { title:"", category:"OTHER", targetAmount:"", monthlySIP:"", priority:"medium" }]);
  }
  function removeGoal(i: number) { setGoals(g => g.filter((_,idx) => idx!==i)); }
  function updateGoal(i: number, field: string, val: string) {
    setGoals(g => g.map((gl,idx) => idx===i ? {...gl,[field]:val} : gl));
  }

  async function handleNext() {
    setError(""); setSaving(true);
    try {
      if (step === 1) {
        await api.post("/api/profile/step/personal-info", {
          age: Number(personal.age), occupation: personal.occupation,
          maritalStatus: personal.maritalStatus, dependents: Number(personal.dependents),
        });
      } else if (step === 2) {
        await api.post("/api/profile/step/income-expenses", {
          monthlyIncome: Number(income.monthlyIncome), monthlyExpenses: Number(income.monthlyExpenses),
        });
      } else if (step === 3) {
        await api.post("/api/profile/step/risk-profile", {
          riskProfile: risk.riskProfile, investmentExperience: risk.investmentExperience,
          insuranceCoverage: risk.insuranceCoverage === "true",
        });
      } else if (step === 4) {
        await api.post("/api/profile/step/emergency-loans", {
          emergencyFundAmount: Number(emergency.emergencyFundAmount), loans: [],
        });
      } else if (step === 5) {
        await api.post("/api/onboarding/goals", {
          goals: goals.map(g => ({
            title: g.title, category: g.category,
            targetAmount: Number(g.targetAmount),
            monthlySIP: g.monthlySIP ? Number(g.monthlySIP) : undefined,
            priority: g.priority,
          })),
        });
        await api.post("/api/onboarding/complete", {});
        setDone(true);
        setTimeout(() => router.push("/dashboard"), 2500);
        return;
      }
      setStep(s => s + 1);
    } catch(err: any) {
      const msg = err.response?.data?.error ?? err.response?.data?.errors?.[0]?.message ?? "Please check your inputs";
      setError(msg);
    } finally { setSaving(false); }
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900">You&apos;re all set!</h1>
        <p className="text-gray-500">Taking you to your dashboard…</p>
      </div>
    </div>
  );

  const progress = ((step - 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo + progress */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-2xl">💰</span>
            <span className="font-bold text-xl text-emerald-600">WealthWise</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Set up your financial profile</h1>
          <p className="text-gray-500 mt-1">Step {step} of {STEPS.length} — {STEPS[step-1].label}</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-4">
            <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mb-6 px-2">
          {STEPS.map(s => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  done?"bg-emerald-500 text-white":active?"bg-white border-2 border-emerald-500 text-emerald-600":"bg-gray-100 text-gray-400"}`}>
                  {done ? <CheckCircle className="w-5 h-5"/> : <Icon className="w-4 h-4"/>}
                </div>
                <span className={`text-xs hidden sm:block ${active?"text-emerald-600 font-medium":"text-gray-400"}`}>{s.label}</span>
              </div>
            );
          })}
        </div>

        <Card className="shadow-md">
          <CardContent className="pt-6 space-y-5">
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded">{error}</div>}

            {/* Step 1: Personal Info */}
            {step===1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Age</Label><Input type="number" min={18} max={100} value={personal.age} onChange={e=>setPersonal({...personal,age:e.target.value})} placeholder="28"/></div>
                  <div><Label>Occupation</Label><Input value={personal.occupation} onChange={e=>setPersonal({...personal,occupation:e.target.value})} placeholder="Software Engineer"/></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Marital Status</Label>
                    <select value={personal.maritalStatus} onChange={e=>setPersonal({...personal,maritalStatus:e.target.value})}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {["SINGLE","MARRIED","DIVORCED","WIDOWED"].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div><Label>Dependents</Label><Input type="number" min={0} value={personal.dependents} onChange={e=>setPersonal({...personal,dependents:e.target.value})} placeholder="0"/></div>
                </div>
              </div>
            )}

            {/* Step 2: Income */}
            {step===2 && (
              <div className="space-y-4">
                <div><Label>Monthly Income (₹)</Label>
                  <Input type="number" min={1} value={income.monthlyIncome} onChange={e=>setIncome({...income,monthlyIncome:e.target.value})} placeholder="80000"/>
                  <p className="text-xs text-gray-400 mt-1">Your in-hand salary or net monthly income</p>
                </div>
                <div><Label>Monthly Expenses (₹)</Label>
                  <Input type="number" min={0} value={income.monthlyExpenses} onChange={e=>setIncome({...income,monthlyExpenses:e.target.value})} placeholder="45000"/>
                  <p className="text-xs text-gray-400 mt-1">Rent, food, transport, utilities, etc.</p>
                </div>
                {income.monthlyIncome && income.monthlyExpenses && (
                  <div className="bg-emerald-50 rounded-lg px-4 py-3">
                    <p className="text-sm text-emerald-700 font-medium">
                      Monthly savings: ₹{(Number(income.monthlyIncome)-Number(income.monthlyExpenses)).toLocaleString("en-IN")}
                      {" "}({Math.round(((Number(income.monthlyIncome)-Number(income.monthlyExpenses))/Number(income.monthlyIncome))*100)}% savings rate)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Risk */}
            {step===3 && (
              <div className="space-y-4">
                <div><Label>Risk Profile</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {["CONSERVATIVE","MODERATE","AGGRESSIVE"].map(r => (
                      <button key={r} type="button" onClick={()=>setRisk({...risk,riskProfile:r})}
                        className={`py-3 rounded-lg text-sm font-medium border-2 transition-colors ${risk.riskProfile===r?"border-emerald-500 bg-emerald-50 text-emerald-700":"border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                        {r==="CONSERVATIVE"?"🛡️":r==="MODERATE"?"⚖️":"🚀"}<br/>{r}
                      </button>
                    ))}
                  </div>
                </div>
                <div><Label>Investment Experience</Label>
                  <select value={risk.investmentExperience} onChange={e=>setRisk({...risk,investmentExperience:e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {["BEGINNER","INTERMEDIATE","ADVANCED"].map(e=><option key={e}>{e}</option>)}
                  </select>
                </div>
                <div><Label>Do you have life/health insurance?</Label>
                  <div className="flex gap-4 mt-2">
                    {[["true","Yes ✓"],["false","No ✗"]].map(([val,lbl])=>(
                      <button key={val} type="button" onClick={()=>setRisk({...risk,insuranceCoverage:val})}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-colors ${risk.insuranceCoverage===val?"border-emerald-500 bg-emerald-50 text-emerald-700":"border-gray-200 text-gray-500"}`}>
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Emergency Fund */}
            {step===4 && (
              <div className="space-y-4">
                <div><Label>Emergency Fund Amount (₹)</Label>
                  <Input type="number" min={0} value={emergency.emergencyFundAmount} onChange={e=>setEmergency({emergencyFundAmount:e.target.value})} placeholder="150000"/>
                  <p className="text-xs text-gray-400 mt-1">Total savings set aside for emergencies (FD, liquid funds, savings account)</p>
                </div>
                <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-700">
                  💡 Goal: 6× your monthly expenses. You can add loan details later from your profile.
                </div>
              </div>
            )}

            {/* Step 5: Goals */}
            {step===5 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Add at least one financial goal to track your progress.</p>
                {goals.map((g,i)=>(
                  <div key={i} className="border rounded-lg p-4 space-y-3 relative">
                    {goals.length>1 && (
                      <button onClick={()=>removeGoal(i)} className="absolute top-3 right-3 text-gray-300 hover:text-red-400 text-lg leading-none">×</button>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Goal Name</Label><Input value={g.title} onChange={e=>updateGoal(i,"title",e.target.value)} placeholder="Emergency Fund"/></div>
                      <div><Label>Category</Label>
                        <select value={g.category} onChange={e=>updateGoal(i,"category",e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                          {["RETIREMENT","HOME","EDUCATION","TRAVEL","EMERGENCY_FUND","VEHICLE","WEDDING","INVESTMENT","OTHER"].map(c=><option key={c} value={c}>{c.replace("_"," ")}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Target Amount (₹)</Label><Input type="number" min={1} value={g.targetAmount} onChange={e=>updateGoal(i,"targetAmount",e.target.value)} placeholder="500000"/></div>
                      <div><Label>Monthly SIP (₹)</Label><Input type="number" min={0} value={g.monthlySIP} onChange={e=>updateGoal(i,"monthlySIP",e.target.value)} placeholder="Optional"/></div>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addGoal} className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                  + Add another goal
                </Button>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button type="button" variant="outline" className="flex-1" onClick={()=>setStep(s=>s-1)}>Back</Button>
              )}
              <Button type="button" onClick={handleNext} disabled={saving}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-1">
                {saving ? "Saving…" : step===STEPS.length ? "Finish Setup" : <>Next <ChevronRight className="w-4 h-4"/></>}
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6">
          Want to skip?{" "}
          <button onClick={()=>router.push("/dashboard")} className="text-emerald-600 hover:underline">Go to dashboard</button>
        </p>
      </div>
    </div>
  );
}
