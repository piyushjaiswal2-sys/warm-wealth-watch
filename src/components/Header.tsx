import { useFinance } from "@/context/FinanceContext";
import { Moon, Sun } from "lucide-react";

const Header = () => {
  const { darkMode, toggleDarkMode } = useFinance();

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {/* Your Custom Rupee Logo */}
        <div className="h-9 w-9 rounded-xl flex items-center justify-center overflow-hidden shadow-sm border border-border">
          <img 
            src="/favicon.ico" 
            alt="FinSight Logo" 
            className="h-full w-full object-cover" 
          />
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">FinSight</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Dark Mode Toggle - Kept because it's a great feature */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all border border-transparent hover:border-border"
          title="Toggle Theme"
        >
          {darkMode ? (
            <><Sun className="h-4 w-4" /><span className="text-xs font-medium hidden sm:inline">Light Mode</span></>
          ) : (
            <><Moon className="h-4 w-4" /><span className="text-xs font-medium hidden sm:inline">Dark Mode</span></>
          )}
        </button>

        {/* Removed the Viewer/Admin toggle for a cleaner, professional look */}
      </div>
    </header>
  );
};

export default Header;