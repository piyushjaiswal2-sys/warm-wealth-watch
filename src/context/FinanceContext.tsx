import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { Transaction, UserRole, TransactionType, Category } from "@/types/finance";
import { mockTransactions } from "@/data/mockData";

interface Filters {
  search: string;
  type: TransactionType | "all";
  category: Category | "all";
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
}

interface FinanceContextType {
  transactions: Transaction[];
  role: UserRole;
  filters: Filters;
  darkMode: boolean;
  setRole: (role: UserRole) => void;
  setFilters: (filters: Partial<Filters>) => void;
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  toggleDarkMode: () => void;
  filteredTransactions: Transaction[];
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
};

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(
    () => loadFromStorage("finance_transactions", mockTransactions)
  );
  const [role, setRole] = useState<UserRole>(
    () => loadFromStorage("finance_role", "admin" as UserRole)
  );
  const [darkMode, setDarkMode] = useState(
    () => loadFromStorage("finance_dark", false)
  );
  const [filters, setFiltersState] = useState<Filters>({
    search: "",
    type: "all",
    category: "all",
    sortBy: "date",
    sortOrder: "desc",
  });

  const persist = useCallback((key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, []);

  const handleSetRole = useCallback((r: UserRole) => {
    setRole(r);
    persist("finance_role", r);
  }, [persist]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      persist("finance_dark", next);
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, [persist]);

  const setFilters = useCallback((partial: Partial<Filters>) => {
    setFiltersState(prev => ({ ...prev, ...partial }));
  }, []);

  const addTransaction = useCallback((tx: Omit<Transaction, "id">) => {
    setTransactions(prev => {
      const next = [{ ...tx, id: crypto.randomUUID() }, ...prev];
      persist("finance_transactions", next);
      return next;
    });
  }, [persist]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => {
      const next = prev.filter(t => t.id !== id);
      persist("finance_transactions", next);
      return next;
    });
  }, [persist]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }
    if (filters.type !== "all") result = result.filter(t => t.type === filters.type);
    if (filters.category !== "all") result = result.filter(t => t.category === filters.category);
    result.sort((a, b) => {
      const mul = filters.sortOrder === "asc" ? 1 : -1;
      if (filters.sortBy === "date") return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return mul * (a.amount - b.amount);
    });
    return result;
  }, [transactions, filters]);

  const totalIncome = useMemo(() => transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalBalance = totalIncome - totalExpenses;

  // Initialize dark mode class
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, []);

  return (
    <FinanceContext.Provider value={{
      transactions, role, filters, darkMode,
      setRole: handleSetRole, setFilters, addTransaction, deleteTransaction, toggleDarkMode,
      filteredTransactions, totalBalance, totalIncome, totalExpenses,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
