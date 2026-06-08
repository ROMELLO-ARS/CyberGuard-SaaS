export default function Settings() {
  const username = localStorage.getItem("cyberguard_user") || "Unknown";
  const role = localStorage.getItem("cyberguard_role") || "Unknown";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">
          ⚙ Settings
        </h1>
        <p className="mt-2 text-slate-400">
          Manage CyberGuard account, security, and platform preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-cyan-300">
            User Profile
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Username
              </p>
              <p className="mt-2 font-semibold text-white">
                {username}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Role
              </p>
              <p className="mt-2 font-semibold text-cyan-300">
                {role}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Current Plan
              </p>
              <p className="mt-2 font-semibold text-green-300">
                Enterprise Demo
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-cyan-300">
            Security Controls
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-slate-800 p-4">
              <div>
                <p className="font-semibold text-white">
                  API Authentication
                </p>
                <p className="text-sm text-slate-400">
                  Login token stored for current session.
                </p>
              </div>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-300">
                Enabled
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-800 p-4">
              <div>
                <p className="font-semibold text-white">
                  Role-Based Access Control
                </p>
                <p className="text-sm text-slate-400">
                  Sidebar access is filtered by user role.
                </p>
              </div>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-300">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-800 p-4">
              <div>
                <p className="font-semibold text-white">
                  Audit Logging
                </p>
                <p className="text-sm text-slate-400">
                  Analyst activity can be traced in the audit timeline.
                </p>
              </div>
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-300">
                Available
              </span>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-cyan-300">
          Platform Status
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-800 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Frontend
            </p>
            <p className="mt-2 font-semibold text-green-300">
              React Online
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Backend
            </p>
            <p className="mt-2 font-semibold text-green-300">
              FastAPI Online
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Architecture
            </p>
            <p className="mt-2 font-semibold text-cyan-300">
              SaaS Ready
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}