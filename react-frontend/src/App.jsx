import { useEffect, useMemo, useState } from "react";
import ThreatSimulation from "./pages/ThreatSimulation";
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
  LogOut,
  Zap,
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
import DemoGuide from "./pages/DemoGuide";
import LogIngestion from "./pages/LogIngestion";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";

import Toast from "./components/Toast";
import AIAssistant from "./components/AIAssistant";

const navSections = [
  {
    title: "Overview",
    items: [
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
    ],
  },
  {
    title: "SOC Operations",
    items: [
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
      label: "Threat Simulation",
      icon: Zap,
      roles: ["Administrator", "SOC Analyst", "SOC Manager"],
},
    ],
  },

  {
    title: "Governance",
    items: [
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
        label: "Demo Guide",
        icon: Presentation,
        roles: ["Administrator", "SOC Analyst", "SOC Manager", "Executive"],
      },
    ],
  },
  {
    title: "Account",
    items: [
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
    ],
  },
];

function flattenNavItems(sections) {
  return sections.flatMap((section) => section.items);
}

function roleBadgeStyle(role) {
  if (role === "Administrator") return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
  if (role === "SOC Analyst") return "border-green-500/30 bg-green-500/10 text-green-300";
  if (role === "SOC Manager") return "border-purple-500/30 bg-purple-500/10 text-purple-300";
  if (role === "Executive") return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  return "border-slate-500/30 bg-slate-500/10 text-slate-300";
}

function App() {
  const [activePage, setActivePage] = useState("Home");
  const [toast, setToast] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

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

  if (activePage === "Threat Queue") {
    return <ThreatQueue showToast={showToast} />;
  }

  if (activePage === "Log Ingestion") {
    return <LogIngestion showToast={showToast} />;
  }

  if (activePage === "Incidents") {
    return <Incidents showToast={showToast} />;
  }

  if (activePage === "MITRE Center") {
    return <MitreCenter showToast={showToast} />;
  }

  if (activePage === "Threat Simulation") {
    return <ThreatSimulation showToast={showToast} />;
  }

  if (activePage === "Executive") {
    return <Executive showToast={showToast} />;
  }

  if (activePage === "Audit Timeline") {
    return <AuditTimeline showToast={showToast} />;
  }

  if (activePage === "Subscription") {
    return <Subscription />;
  }

  if (activePage === "Settings") {
    return <SettingsPage showToast={showToast} />;
  }

  if (activePage === "Demo Guide") {
    return <DemoGuide />;
  }

  return <Home setActivePage={setActivePage} />;
}
    
    
  const allowedNavItems = useMemo(() => {
    if (!user) return [];

    return flattenNavItems(navSections).filter((item) =>
      item.roles.includes(user.role)
    );
  }, [user]);

  const allowedNavSections = useMemo(() => {
    if (!user) return [];

    return navSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.roles.includes(user.role)),
      }))
      .filter((section) => section.items.length > 0);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (allowedNavItems.length === 0) return;

    if (!allowedNavItems.some((item) => item.label === activePage)) {
      setActivePage(allowedNavItems[0].label);
    }
  }, [user, activePage, allowedNavItems]);

  if (!user && !showLogin) {
    return <LandingPage onLaunchDemo={() => setShowLogin(true)} />;
  }

  if (!user && showLogin) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="flex w-80 flex-col border-r border-cyan-500/20 bg-slate-950/95 p-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-500/10 p-3 shadow-lg shadow-cyan-500/10">
              <Shield className="h-8 w-8 text-cyan-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-cyan-400">
                CyberGuard
              </h1>
              <p className="text-xs text-slate-400">
                AI SOC SaaS Platform
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-cyan-500/20 bg-slate-900 p-4 shadow-lg shadow-cyan-500/5">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Current Session
            </p>

            <p className="mt-2 font-semibold text-white">
              {user.username}
            </p>

            <div
              className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${roleBadgeStyle(
                user.role
              )}`}
            >
              {user.role}
            </div>

            <div className="mt-4 rounded-xl bg-slate-950 p-3">
              <p className="text-xs text-slate-500">Plan</p>
              <p className="mt-1 text-sm font-semibold text-green-300">
                Enterprise Demo
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto pr-1">
            {allowedNavSections.map((section) => (
              <div key={section.title}>
                <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {section.title}
                </p>

                <div className="space-y-2">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.label;

                    return (
                      <button
                        key={item.label}
                        onClick={() => setActivePage(item.label)}
                        className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                          isActive
                            ? "bg-cyan-500/15 text-cyan-300 shadow-lg shadow-cyan-500/10"
                            : "text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="activeSidebarIndicator"
                            className="absolute left-0 top-2 h-8 w-1 rounded-r-full bg-cyan-400"
                          />
                        )}

                        <Icon
                          className={`h-5 w-5 ${
                            isActive
                              ? "text-cyan-300"
                              : "text-slate-400 group-hover:text-cyan-300"
                          }`}
                        />

                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-6 border-t border-slate-800 pt-4">
            <button
              onClick={() => {
                localStorage.clear();
                setUser(null);
                setActivePage("Home");
                setShowLogin(false);
                showToast("Logged out successfully.", "info");
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-3 text-sm font-bold text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
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
    </div>
  );
}

export default App;