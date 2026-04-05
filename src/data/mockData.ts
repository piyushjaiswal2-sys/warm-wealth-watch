import { Transaction, MonthlyData, Category } from "@/types/finance";

export const CATEGORIES: Category[] = [
  "Salary", "Freelance", "Food & Dining", "Shopping", "Transportation",
  "Entertainment", "Utilities", "Healthcare", "Rent", "Investments", "Other",
];

export const CATEGORY_COLORS: Record<string, string> = {
  "Salary": "hsl(199, 89%, 48%)",
  "Freelance": "hsl(160, 84%, 39%)",
  "Food & Dining": "hsl(38, 92%, 50%)",
  "Shopping": "hsl(280, 65%, 60%)",
  "Transportation": "hsl(0, 72%, 51%)",
  "Utilities": "hsl(210, 50%, 60%)",
  "Healthcare": "hsl(340, 65%, 55%)",
  "Rent": "hsl(25, 75%, 50%)",
  "Entertainment": "hsl(180, 60%, 45%)",
  "Investments": "hsl(130, 50%, 45%)",
  "Other": "hsl(220, 9%, 46%)",
};

export const mockTransactions: Transaction[] = [
  { id: "1", date: "2025-03-28", description: "Monthly Salary", amount: 5200, type: "income", category: "Salary" },
  { id: "2", date: "2025-03-27", description: "Grocery Store", amount: 87.50, type: "expense", category: "Food & Dining" },
  { id: "3", date: "2025-03-26", description: "Netflix Subscription", amount: 15.99, type: "expense", category: "Entertainment" },
  { id: "4", date: "2025-03-25", description: "Uber Ride", amount: 24.30, type: "expense", category: "Transportation" },
  { id: "5", date: "2025-03-24", description: "Freelance Project", amount: 1200, type: "income", category: "Freelance" },
  { id: "6", date: "2025-03-23", description: "Electric Bill", amount: 142, type: "expense", category: "Utilities" },
  { id: "7", date: "2025-03-22", description: "Restaurant Dinner", amount: 65.80, type: "expense", category: "Food & Dining" },
  { id: "8", date: "2025-03-21", description: "New Headphones", amount: 199.99, type: "expense", category: "Shopping" },
  { id: "9", date: "2025-03-20", description: "Monthly Rent", amount: 1500, type: "expense", category: "Rent" },
  { id: "10", date: "2025-03-19", description: "Pharmacy", amount: 35.20, type: "expense", category: "Healthcare" },
  { id: "11", date: "2025-03-18", description: "Gas Station", amount: 52.00, type: "expense", category: "Transportation" },
  { id: "12", date: "2025-03-17", description: "Stock Dividend", amount: 85, type: "income", category: "Investments" },
  { id: "13", date: "2025-03-15", description: "Coffee Shop", amount: 12.50, type: "expense", category: "Food & Dining" },
  { id: "14", date: "2025-03-14", description: "Online Course", amount: 49.99, type: "expense", category: "Shopping" },
  { id: "15", date: "2025-03-12", description: "Side Project Payment", amount: 450, type: "income", category: "Freelance" },
  { id: "16", date: "2025-03-10", description: "Water Bill", amount: 38, type: "expense", category: "Utilities" },
  { id: "17", date: "2025-03-08", description: "Movie Tickets", amount: 28, type: "expense", category: "Entertainment" },
  { id: "18", date: "2025-03-05", description: "Clothing Store", amount: 156, type: "expense", category: "Shopping" },
  { id: "19", date: "2025-03-03", description: "Doctor Visit", amount: 120, type: "expense", category: "Healthcare" },
  { id: "20", date: "2025-03-01", description: "Investment Return", amount: 320, type: "income", category: "Investments" },
];

export const mockMonthlyData: MonthlyData[] = [
  { month: "Oct", income: 5800, expenses: 3200, balance: 2600 },
  { month: "Nov", income: 6100, expenses: 3800, balance: 2300 },
  { month: "Dec", income: 7200, expenses: 4500, balance: 2700 },
  { month: "Jan", income: 5500, expenses: 3100, balance: 2400 },
  { month: "Feb", income: 6400, expenses: 3600, balance: 2800 },
  { month: "Mar", income: 7255, expenses: 2527, balance: 4728 },
];
