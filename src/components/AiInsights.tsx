import { useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import { mockMonthlyData } from "@/data/mockData";
import { Sparkles, TrendingDown, CreditCard, CalendarClock, PiggyBank, ShieldAlert } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

interface AiInsight {
  icon: typeof Sparkles;
  text: string;
  type: "warning" | "positive" | "info";
}

const BUDGET_LIMITS: Record<string, number> = {
  "Food & Dining": 200,
  "Shopping": 300,
  "Transportation": 100,
  "Entertainment": 60,
  "Utilities": 200,
  "Healthcare": 150,
};

const AiInsights = () => {
  const { transactions, totalBalance, totalIncome, totalExpenses } = useFinance();

  const insights = useMemo(() => {
    const results: AiInsight[] = [];
    const expenses = transactions.filter(t => t.type === "expense");
    const catTotals: Record<string, number> = {};
    expenses.forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });

    // Budget overspend predictions
    Object.entries(BUDGET_LIMITS).forEach(([cat, limit]) => {
      const spent = catTotals[cat] || 0;
      if (spent > limit * 0.8) {
        const pct = Math.round(((spent - limit) / limit) * 100);
        if (spent > limit) {
          results.push({
            icon: ShieldAlert,
            text: `You've exceeded your ${cat} budget by ${pct}%. Consider cutting back for the rest of the month.`,
            type: "warning",
          });
        } else {
          const remaining = Math.round(((limit - spent) / limit) * 100);
          results.push({
            icon: TrendingDown,
            text: `You've used ${100 - remaining}% of your ${cat} budget (${fmt(spent)} of ${fmt(limit)}). Pace your spending.`,
            type: "warning",
          });
        }
      }
    });

    // Subscription renewal prediction
    const subscriptions = transactions.filter(t =>
      t.description.toLowerCase().includes("subscription") || t.description.toLowerCase().includes("netflix")
    );
    if (subscriptions.length > 0) {
      const sub = subscriptions[0];
      results.push({
        icon: CalendarClock,
        text: `You have an upcoming renewal for ${sub.description} (${fmt(sub.amount)}) around the ${new Date(sub.date).getDate()}th. Your balance is ${totalBalance > sub.amount ? "sufficient" : "tight"}.`,
        type: totalBalance > sub.amount ? "info" : "warning",
      });
    }

    // Savings projection
    const monthlyData = mockMonthlyData;
    if (monthlyData.length >= 2) {
      const avgSavings = monthlyData.reduce((s, m) => s + m.balance, 0) / monthlyData.length;
      results.push({
        icon: PiggyBank,
        text: `At your average savings rate, you'll accumulate ~${fmt(avgSavings * 12)} over the next year. ${avgSavings > 2500 ? "Great progress!" : "Try to save a bit more each month."}`,
        type: avgSavings > 2500 ? "positive" : "info",
      });
    }

    // Spending velocity
    if (totalExpenses > 0 && totalIncome > 0) {
      const ratio = totalExpenses / totalIncome;
      if (ratio > 0.7) {
        results.push({
          icon: CreditCard,
          text: `You're spending ${Math.round(ratio * 100)}% of your income. Financial experts recommend keeping this under 70%.`,
          type: "warning",
        });
      } else {
        results.push({
          icon: CreditCard,
          text: `You're spending ${Math.round(ratio * 100)}% of your income — well within the recommended 70% threshold. Keep it up!`,
          type: "positive",
        });
      }
    }

    return results;
  }, [transactions, totalBalance, totalIncome, totalExpenses]);

  const typeStyles = {
    warning: "border-l-expense/60 bg-expense/[0.04]",
    positive: "border-l-income/60 bg-income/[0.04]",
    info: "border-l-primary/60 bg-primary/[0.04]",
  };

  return (
    <div className="glass-card rounded-xl p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
        <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">Smart</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 p-3 rounded-lg border-l-[3px] transition-colors ${typeStyles[insight.type]}`}
          >
            <Sparkles className="h-3.5 w-3.5 text-primary/50 flex-shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-foreground/85">{insight.text}</p>
          </div>
        ))}
        {insights.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No predictions available yet.</p>
        )}
      </div>
    </div>
  );
};

export default AiInsights;
