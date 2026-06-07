export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-cyan-500/20 bg-slate-900 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-cyan-400">
            CyberGuard
          </h1>

          <p className="mt-2 text-slate-400">
            Secure SOC Platform Login
          </p>
        </div>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-500 p-3 font-semibold text-slate-950"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          CyberGuard SaaS v1.0
        </div>
      </div>
    </div>
  );
}