import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useFinance } from "@/context/FinanceContext";
import { CATEGORY_COLORS } from "@/data/mockData";
import { useMemo } from "react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const SpendingBreakdown = () => {
  const { transactions } = useFinance();

  const { data, total } = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    const items = Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    const total = items.reduce((s, i) => s + i.value, 0);
    return { data: items, total };
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-xl p-5 flex items-center justify-center h-full">
        <p className="text-muted-foreground text-sm">No expense data available</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Spending Breakdown</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
              {data.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "hsl(220,9%,46%)"} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const item = payload[0];
                const value = item.value as number;
                const pct = ((value / total) * 100).toFixed(1);
                return (
                  <div className="rounded-lg border border-border/50 bg-card px-3 py-2 text-xs shadow-xl">
                    <p className="font-medium text-foreground mb-0.5">{item.name}</p>
                    <p className="text-muted-foreground">
                      {fmt(value)} · <span className="font-semibold text-foreground">{pct}%</span>
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-1.5 mt-2">
        {data.slice(0, 6).map(item => {
          const pct = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[item.name] }} />
              <span className="text-muted-foreground truncate">{item.name}</span>
              <span className="text-foreground font-medium ml-auto">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpendingBreakdown;
