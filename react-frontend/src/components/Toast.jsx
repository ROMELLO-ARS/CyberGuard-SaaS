export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isError = toast.type === "error";
  const isSuccess = toast.type === "success";

  return (
    <div className="fixed right-6 top-6 z-[9999] w-full max-w-sm">
      <div
        className={`rounded-2xl border p-4 shadow-2xl ${
          isError
            ? "border-red-500/30 bg-red-500/10 shadow-red-500/20"
            : isSuccess
            ? "border-green-500/30 bg-green-500/10 shadow-green-500/20"
            : "border-cyan-500/30 bg-cyan-500/10 shadow-cyan-500/20"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className={`font-bold ${
                isError
                  ? "text-red-300"
                  : isSuccess
                  ? "text-green-300"
                  : "text-cyan-300"
              }`}
            >
              {isError ? "Error" : isSuccess ? "Success" : "Notification"}
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-200">
              {toast.message}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}