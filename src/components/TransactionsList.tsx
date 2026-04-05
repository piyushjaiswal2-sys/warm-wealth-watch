import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { CATEGORIES } from "@/data/mockData";
import { Search, SlidersHorizontal, Plus, Trash2, ArrowUpDown, X } from "lucide-react";
import type { Category, TransactionType } from "@/types/finance";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const TransactionsList = () => {
  const { filteredTransactions, filters, setFilters, role, addTransaction, deleteTransaction } = useFinance();
  const [showAdd, setShowAdd] = useState(false);
  const [newTx, setNewTx] = useState({ description: "", amount: "", type: "expense" as TransactionType, category: "Other" as Category, date: new Date().toISOString().split("T")[0] });

  const handleAdd = () => {
    if (!newTx.description || !newTx.amount) return;
    addTransaction({ ...newTx, amount: parseFloat(newTx.amount) });
    setNewTx({ description: "", amount: "", type: "expense", category: "Other", date: new Date().toISOString().split("T")[0] });
    setShowAdd(false);
  };

  const toggleSort = () => {
    if (filters.sortBy === "date") setFilters({ sortBy: "amount" });
    else setFilters({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc", sortBy: "date" });
  };

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Transactions</h3>
        {role === "admin" && (
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
            {showAdd ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showAdd ? "Cancel" : "Add"}
          </button>
        )}
      </div>

      {/* Add form */}
      {showAdd && role === "admin" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 p-3 bg-secondary/50 rounded-lg">
          <input placeholder="Description" value={newTx.description} onChange={e => setNewTx(p => ({ ...p, description: e.target.value }))} className="px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          <input placeholder="Amount" type="number" value={newTx.amount} onChange={e => setNewTx(p => ({ ...p, amount: e.target.value }))} className="px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          <input type="date" value={newTx.date} onChange={e => setNewTx(p => ({ ...p, date: e.target.value }))} className="px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          <select value={newTx.type} onChange={e => setNewTx(p => ({ ...p, type: e.target.value as TransactionType }))} className="px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={newTx.category} onChange={e => setNewTx(p => ({ ...p, category: e.target.value as Category }))} className="px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={handleAdd} className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm">Add Transaction</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder="Search transactions..."
            value={filters.search}
            onChange={e => setFilters({ search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 bg-secondary/50 border-0 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <select
          value={filters.type}
          onChange={e => setFilters({ type: e.target.value as TransactionType | "all" })}
          className="px-3 py-2 bg-secondary/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={filters.category}
          onChange={e => setFilters({ category: e.target.value as Category | "all" })}
          className="px-3 py-2 bg-secondary/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={toggleSort} className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
          <ArrowUpDown className="h-4 w-4" />
        </button>
      </div>

      {/* List */}
      <div className="space-y-1 max-h-[520px] overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No transactions found
          </div>
        ) : (
          filteredTransactions.map(tx => (
            <div key={tx.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors group">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type === "income" ? "bg-income/10" : "bg-expense/10"}`}>
                <span className={`text-xs font-bold ${tx.type === "income" ? "text-income" : "text-expense"}`}>
                  {tx.type === "income" ? "+" : "−"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{tx.category} · {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
              </div>
              <span className={`text-sm font-semibold ${tx.type === "income" ? "text-income" : "text-expense"}`}>
                {tx.type === "income" ? "+" : "−"}{fmt(tx.amount)}
              </span>
              {role === "admin" && (
                <button
                  onClick={() => deleteTransaction(tx.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all"
                  title="Delete transaction"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionsList;
