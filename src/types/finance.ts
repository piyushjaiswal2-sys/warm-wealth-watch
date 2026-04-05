export type TransactionType = "income" | "expense";

export type Category =
  | "Salary"
  | "Freelance"
  | "Food & Dining"
  | "Shopping"
  | "Transportation"
  | "Entertainment"
  | "Utilities"
  | "Healthcare"
  | "Rent"
  | "Investments"
  | "Other";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

export type UserRole = "viewer" | "admin";

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}
