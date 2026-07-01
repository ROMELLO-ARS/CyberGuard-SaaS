export default function AccessDenied({ title = "Access Denied", message, requiredRoles }) {
  const currentUser = localStorage.getItem("cyberguard_user") || "anonymous";
  const currentRole = localStorage.getItem("cyberguard_role") || "Guest";

  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8">
      <h1 className="text-3xl font-bold text-red-300">
        🚫 {title}
      </h1>

      <p className="mt-4 leading-7 text-red-100/80">
        {message || "Your current role does not have permission to view this resource."}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-slate-950/60 p-4">
          <p className="text-xs uppercase tracking-wide text-red-200/70">
            Current User
          </p>
          <p className="mt-2 font-semibold text-white">
            {currentUser}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950/60 p-4">
          <p className="text-xs uppercase tracking-wide text-red-200/70">
            Current Role
          </p>
          <p className="mt-2 font-semibold text-white">
            {currentRole}
          </p>
        </div>
      </div>

      {requiredRoles && (
        <div className="mt-6 rounded-xl bg-slate-950/60 p-4">
          <p className="text-xs uppercase tracking-wide text-red-200/70">
            Required Role
          </p>
          <p className="mt-2 font-semibold text-white">
            {Array.isArray(requiredRoles) ? requiredRoles.join(", ") : requiredRoles}
          </p>
        </div>
      )}
    </div>
  );
}