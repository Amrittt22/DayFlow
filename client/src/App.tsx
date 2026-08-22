/** Dayflow — Paper Motion design system: human editorial product space. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import AppDashboard from "./pages/AppDashboard";
import Announcements from "./pages/Announcements";
import EmployeeDirectory from "./pages/EmployeeDirectory";
import PayrollStudio from "./pages/PayrollStudio";
import RequestsCenter from "./pages/RequestsCenter";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/app"} component={AppDashboard} />
      <Route path={"/announcements"} component={Announcements} />
      <Route path={"/directory"} component={EmployeeDirectory} />
      <Route path={"/payroll"} component={PayrollStudio} />
      <Route path={"/requests"} component={RequestsCenter} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
