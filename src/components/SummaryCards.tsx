/**
 * SummaryCards.tsx
 * FinSight Dashboard : Financial Overview Cards
 * Developed by: Piyush Jaiswal
 */

import { useFinance } from "@/context/FinanceContext";
import { mockMonthlyData } from "@/data/mockData";
import { DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const pctChange = (current: number, previous: number) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

const SummaryCards = () => {
  const { totalBalance, totalIncome, totalExpenses } = useFinance();
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

  const trends = useMemo(() => {
    const len = mockMonthlyData.length;
    if (len < 2) return { balance: 0, income: 0, expenses: 0, savings: 0 };
    const curr = mockMonthlyData[len - 1];
    const prev = mockMonthlyData[len - 2];
    const prevSavings = prev.income > 0 ? ((prev.income - prev.expenses) / prev.income * 100) : 0;
    return {
      balance: pctChange(curr.balance, prev.balance),
      income: pctChange(curr.income, prev.income),
      expenses: pctChange(curr.expenses, prev.expenses),
      savings: savingsRate - prevSavings,
    };
  }, [savingsRate]);

  const cards = [
    {
      label: "Total Balance",
      value: fmt(totalBalance),
      icon: Wallet,
      accent: "text-primary",
      bgAccent: "bg-primary/10",
      trend: trends.balance,
      invertTrend: false,
    },
    {
      label: "Income",
      value: fmt(totalIncome),
      icon: TrendingUp,
      accent: "text-emerald-600",
      bgAccent: "bg-emerald-500/10",
      trend: trends.income,
      invertTrend: false,
    },
    {
      label: "Expenses",
      value: fmt(totalExpenses),
      icon: TrendingDown,
      accent: "text-red-600",
      bgAccent: "bg-red-500/10",
      trend: trends.expenses,
      invertTrend: true, // If expenses go down, it's "Good" (Green)
    },
    {
      label: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      icon: DollarSign,
      accent: "text-blue-600",
      bgAccent: "bg-blue-500/10",
      trend: trends.savings,
      invertTrend: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const isPositive = card.trend >= 0;
        // Logic: If it's an expense and trend is negative (spending less), it's Good.
        const isGood = card.invertTrend ? !isPositive : isPositive;
        const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

        return (
          <div key={card.label} className="glass-card rounded-xl p-5 hover:shadow-md transition-shadow bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground font-medium">{card.label}</span>
              <div className={cn("p-2 rounded-lg", card.bgAccent)}>
                <card.icon className={cn("h-4 w-4", card.accent)} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight">{card.value}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <span className={cn(
                "inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md",
                isGood 
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" 
                  : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              )}>
                <TrendIcon className="h-3.5 w-3.5" />
                {Math.abs(card.trend).toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;