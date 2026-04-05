import Header from "@/components/Header";
import SummaryCards from "@/components/SummaryCards";
import BalanceTrend from "@/components/BalanceTrend";
import SpendingBreakdown from "@/components/SpendingBreakdown";
import TransactionsList from "@/components/TransactionsList";
import Insights from "@/components/Insights";
import AiInsights from "@/components/AiInsights";
import SavingsGoals from "@/components/SavingsGoals";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <SummaryCards />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BalanceTrend />
          </div>
          <SpendingBreakdown />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TransactionsList />
          </div>
          <div className="space-y-8">
            <SavingsGoals />
            <Insights />
          </div>
        </div>
        <AiInsights />
      </main>
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-4">
        <div className="border-t border-border/50 pt-5 text-center">
          <p className="text-xs text-muted-foreground">
            FinSight Dashboard · Designed by <span className="font-medium text-foreground">Piyush Jaiswal</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
