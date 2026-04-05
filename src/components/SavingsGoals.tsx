import { useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import { mockMonthlyData } from "@/data/mockData";
import { Target, Flame, Trophy, CheckCircle2 } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

interface SavingsGoal {
  name: string;
  target: number;
  saved: number;
  icon: string;
  milestones: number[];
}

const GOALS: SavingsGoal[] = [
  { name: "Emergency Fund", target: 10000, saved: 7280, icon: "🛡️", milestones: [2500, 5000, 7500, 10000] },
  { name: "Vacation", target: 3000, saved: 2750, icon: "✈️", milestones: [750, 1500, 2250, 3000] },
  { name: "New Laptop", target: 2000, saved: 1100, icon: "💻", milestones: [500, 1000, 1500, 2000] },
  { name: "Investment Fund", target: 5000, saved: 1800, icon: "📈", milestones: [1250, 2500, 3750, 5000] },
];

const ProgressRing = ({ progress, size = 52, strokeWidth = 4, pulse = false }: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  pulse?: boolean;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 1) * circumference);

  return (
    <div className={`relative ${pulse ? "animate-goal-pulse" : ""}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progress >= 0.9 ? "hsl(var(--income))" : "hsl(var(--primary))"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
        {Math.round(progress * 100)}%
      </span>
    </div>
  );
};

const SavingsGoals = () => {
  const { totalExpenses } = useFinance();

  const budgetStreak = useMemo(() => {
    const monthlyBudget = 3500;
    let streak = 0;
    for (let i = mockMonthlyData.length - 1; i >= 0; i--) {
      if (mockMonthlyData[i].expenses <= monthlyBudget) {
        streak++;
      } else break;
    }
    return streak;
  }, []);

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-income/10">
            <Target className="h-4 w-4 text-income" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Savings Goals</h3>
        </div>
        {budgetStreak > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-chart-3/10">
            <Flame className="h-3.5 w-3.5 text-chart-3" />
            <span className="text-xs font-bold text-chart-3">{budgetStreak}</span>
            <span className="text-[10px] text-muted-foreground">
              {budgetStreak === 1 ? "month" : "months"} streak
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {GOALS.map((goal) => {
          const progress = goal.saved / goal.target;
          const nearComplete = progress >= 0.9 && progress < 1;
          const complete = progress >= 1;
          const milestonesHit = goal.milestones.filter(m => goal.saved >= m).length;

          return (
            <div key={goal.name} className="group">
              <div className="flex items-center gap-3">
                <ProgressRing progress={progress} pulse={nearComplete} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{goal.icon}</span>
                    <span className="text-sm font-medium text-foreground truncate">{goal.name}</span>
                    {complete && <CheckCircle2 className="h-3.5 w-3.5 text-income flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {fmt(goal.saved)} of {fmt(goal.target)}
                    {nearComplete && (
                      <span className="ml-1.5 text-income font-medium">Almost there!</span>
                    )}
                  </p>
                  {/* Milestone dots */}
                  <div className="flex items-center gap-1 mt-1.5">
                    {goal.milestones.map((m, i) => (
                      <div key={m} className="flex items-center gap-1">
                        <div
                          className={`h-1.5 w-1.5 rounded-full transition-colors ${
                            goal.saved >= m ? "bg-income" : "bg-border"
                          }`}
                          title={fmt(m)}
                        />
                        {i < goal.milestones.length - 1 && (
                          <div className={`h-px w-3 ${goal.saved >= goal.milestones[i + 1] ? "bg-income/40" : "bg-border/60"}`} />
                        )}
                      </div>
                    ))}
                    <Trophy className={`h-3 w-3 ml-0.5 ${complete ? "text-chart-3" : "text-border"}`} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavingsGoals;
