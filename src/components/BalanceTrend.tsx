import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend, Cell,
} from "recharts";
import { mockMonthlyData } from "@/data/mockData";

const BUDGET_GOAL = 3500;

const BalanceTrend = () => {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Income vs Expenses</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "hsl(152,69%,41%)" }} />
            Income
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "hsl(4,72%,56%)" }} />
            Expenses
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 border-t-2 border-dashed" style={{ borderColor: "hsl(45,93%,47%)" }} />
            Budget Goal
          </span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockMonthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "12px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString()}`,
                name === "income" ? "Income" : "Expenses",
              ]}
            />
            <ReferenceLine
              y={BUDGET_GOAL}
              stroke="hsl(45,93%,47%)"
              strokeDasharray="6 4"
              strokeWidth={2}
              label={{
                value: `Budget $${(BUDGET_GOAL / 1000).toFixed(1)}k`,
                position: "right",
                fontSize: 11,
                fill: "hsl(var(--muted-foreground))",
              }}
            />
            <Bar dataKey="income" radius={[4, 4, 0, 0]} maxBarSize={32} fill="hsl(152,69%,41%)" name="income" />
            <Bar dataKey="expenses" radius={[4, 4, 0, 0]} maxBarSize={32} name="expenses">
              {mockMonthlyData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.expenses > BUDGET_GOAL ? "hsl(4,72%,56%)" : "hsl(4,72%,56%)"}
                  opacity={entry.expenses > BUDGET_GOAL ? 1 : 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceTrend;
