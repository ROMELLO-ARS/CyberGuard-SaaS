import { useEffect, useMemo, useState } from "react";
import {
  Shield,
  LayoutDashboard,
  Siren,
  FolderOpen,
  Target,
  BarChart3,
  ScrollText,
  CreditCard,
  Settings,
  Presentation,
  DatabaseZap,
  HomeIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ThreatQueue from "./pages/ThreatQueue";
import Incidents from "./pages/Incidents";
import MitreCenter from "./pages/MitreCenter";
import Executive from "./pages/Executive";
import AuditTimeline from "./pages/AuditTimeline";
import Subscription from "./pages/Subscription";
import SettingsPage from "./pages/Settings";
import Toast from "./components/Toast";
import DemoGuide from "./pages/DemoGuide";
import LogIngestion from "./pages/LogIngestion";
import AIAssistant from "./components/AIAssistant";
import Home from "./pages/Home";


const navItems = [
  {
  label: "Home",
  icon: HomeIcon,
  roles: ["Administrator", "SOC Analyst", "SOC Manager", "Executive"],
},
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["Administrator", "SOC Analyst", "SOC Manager", "Executive"],
  },
  {
    label: "Threat Queue",
    icon: Siren,
    roles: ["Administrator", "SOC Analyst", "SOC Manager"],
  },
  {
  label: "Log Ingestion",
  icon: DatabaseZap,
  roles: ["Administrator", "SOC Analyst", "SOC Manager"],
},
  {
    label: "Incidents",
    icon: FolderOpen,
    roles: ["Administrator", "SOC Analyst", "SOC Manager"],
  },
  {
    label: "MITRE Center",
    icon: Target,
    roles: ["Administrator", "SOC Analyst", "SOC Manager"],
  },
  {
    label: "Executive",
    icon: BarChart3,
    roles: ["Administrator", "SOC Manager", "Executive"],
  },
  {
    label: "Audit Timeline",
    icon: ScrollText,
    roles: ["Administrator", "SOC Analyst", "SOC Manager"],
  },
  {
    label: "Subscription",
    icon: CreditCard,
    roles: ["Administrator", "Executive"],
  },
  {
    label: "Settings",
    icon: Settings,
    roles: ["Administrator", "Executive"],
  },
  {
  label: "Demo Guide",
  icon: Presentation,
  roles: ["Administrator", "SOC Analyst", "SOC Manager", "Executive"],
},

];

function App() {
  const [activePage, setActivePage] = useState("Home");
  const [toast, setToast] = useState(null);

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("cyberguard_token");
    const username = localStorage.getItem("cyberguard_user");
    const role = localStorage.getItem("cyberguard_role");

    if (!token) return null;

    return {
      token,
      username,
      role,
    };
  });

  function showToast(message, type = "info") {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  }

  function renderPage() {
    if (activePage === "Home") return <Home setActivePage={setActivePage} />;
    if (activePage === "Dashboard") return <Dashboard />;
    if (activePage === "Threat Queue") return <ThreatQueue showToast={showToast} />;
    if (activePage === "Incidents") return <Incidents showToast={showToast} />;
    if (activePage === "MITRE Center") return <MitreCenter showToast={showToast} />;
    if (activePage === "Executive") return <Executive showToast={showToast} />;
    if (activePage === "Audit Timeline") return <AuditTimeline showToast={showToast} />;
    if (activePage === "Subscription") return <Subscription />;
    if (activePage === "Settings") return <SettingsPage showToast={showToast} />;
    if (activePage === "Demo Guide") return <DemoGuide />;
    if (activePage === "Log Ingestion") return <LogIngestion showToast={showToast} />;

    return <Dashboard />;
  }

  const allowedNavItems = useMemo(() => {
    if (!user) return [];

    return navItems.filter((item) => item.roles.includes(user.role));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (allowedNavItems.length === 0) return;

    if (!allowedNavItems.some((item) => item.label === activePage)) {
      setActivePage(allowedNavItems[0].label);
    }
  }, [user, activePage, allowedNavItems]);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-cyan-500/20 bg-slate-950/95 p-6">
          <div className="mb-10 flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-500/10 p-3">
              <Shield className="h-8 w-8 text-cyan-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-cyan-400">
                CyberGuard
              </h1>
              <p className="text-xs text-slate-400">
                SaaS SOC Platform
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-xl border border-cyan-500/20 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">Logged in as</p>
            <p className="font-semibold text-cyan-300">{user.username}</p>
            <p className="text-xs text-slate-500">{user.role}</p>
          </div>

          <nav className="space-y-2">
            {allowedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => setActivePage(item.label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 shadow-lg shadow-cyan-500/10"
                      : "text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => {
              localStorage.clear();
              setUser(null);
              setActivePage("Home");
              showToast("Logged out successfully.", "info");
            }}
            className="mt-8 w-full rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
          >
            Logout
          </button>
        </aside>

        <main className="flex-1 overflow-hidden p-8">
  <AnimatePresence mode="wait">
    <motion.div
      key={activePage}
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {renderPage()}
    </motion.div>
  </AnimatePresence>
</main>
      </div>

      <AIAssistant showToast={showToast} />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;