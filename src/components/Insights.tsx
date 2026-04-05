import { useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import { mockMonthlyData } from "@/data/mockData";
import { TrendingUp, AlertTriangle, Star, BarChart3 } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const Insights = () => {
  const { transactions, totalIncome, totalExpenses } = useFinance();

  const insights = useMemo(() => {
    const expenses = transactions.filter(t => t.type === "expense");
    const catTotals: Record<string, number> = {};
    expenses.forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });
    const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
    const topCategory = sorted[0];

    const currentMonth = mockMonthlyData[mockMonthlyData.length - 1];
    const prevMonth = mockMonthlyData[mockMonthlyData.length - 2];
    const expenseChange = prevMonth ? ((currentMonth.expenses - prevMonth.expenses) / prevMonth.expenses * 100).toFixed(1) : "0";

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : "0";

    return [
      {
        icon: AlertTriangle,
        title: "Top Spending",
        desc: topCategory ? `${topCategory[0]} at ${fmt(topCategory[1])}` : "No expenses yet",
        color: "text-chart-3",
        bg: "bg-chart-3/10",
      },
      {
        icon: BarChart3,
        title: "Monthly Change",
        desc: `Expenses ${parseFloat(expenseChange) > 0 ? "up" : "down"} ${Math.abs(parseFloat(expenseChange))}% vs last month`,
        color: parseFloat(expenseChange) > 0 ? "text-expense" : "text-income",
        bg: parseFloat(expenseChange) > 0 ? "bg-expense/10" : "bg-income/10",
      },
      {
        icon: TrendingUp,
        title: "Savings Rate",
        desc: `You're saving ${savingsRate}% of your income`,
        color: "text-income",
        bg: "bg-income/10",
      },
      {
        icon: Star,
        title: "Transactions",
        desc: `${transactions.length} total transactions tracked`,
        color: "text-primary",
        bg: "bg-primary/10",
      },
    ];
  }, [transactions, totalIncome, totalExpenses]);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Insights</h3>
      <div className="space-y-3">
        {insights.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${item.bg} flex-shrink-0`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insights;
