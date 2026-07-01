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
} from "lucide-react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ThreatQueue from "./pages/ThreatQueue";
import Incidents from "./pages/Incidents";
import MitreCenter from "./pages/MitreCenter";
import Executive from "./pages/Executive";
import AuditTimeline from "./pages/AuditTimeline";
import Subscription from "./pages/Subscription";
import SettingsPage from "./pages/Settings";

const navItems = [
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
];

function renderPage(activePage) {
  if (activePage === "Dashboard") return <Dashboard />;
  if (activePage === "Threat Queue") return <ThreatQueue />;
  if (activePage === "Incidents") return <Incidents />;
  if (activePage === "MITRE Center") return <MitreCenter />;
  if (activePage === "Executive") return <Executive />;
  if (activePage === "Audit Timeline") return <AuditTimeline />;
  if (activePage === "Subscription") return <Subscription />;
  if (activePage === "Settings") return <SettingsPage />;

  return <Dashboard />;
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

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
              setActivePage("Dashboard");
            }}
            className="mt-8 w-full rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
          >
            Logout
          </button>
        </aside>

        <main className="flex-1 p-8">{renderPage(activePage)}</main>
      </div>
    </div>
  );
}

export default App;