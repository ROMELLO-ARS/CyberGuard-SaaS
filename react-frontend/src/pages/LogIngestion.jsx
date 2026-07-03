import { useEffect, useState } from "react";
import api from "../services/api";

function severityStyle(severity) {
  if (severity === "Critical") return "border-red-500/30 bg-red-500/10 text-red-300";
  if (severity === "High") return "border-orange-500/30 bg-orange-500/10 text-orange-300";
  if (severity === "Medium") return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  return "border-slate-500/30 bg-slate-500/10 text-slate-300";
}

export default function LogIngestion({ showToast }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [creatingIncidentId, setCreatingIncidentId] = useState(null);

  const [formData, setFormData] = useState({
    source_type: "firewall",
    event_time: "",
    source_ip: "",
    destination_ip: "",
    event_type: "Suspicious Connection",
    severity: "Medium",
    message: "",
    raw_log: "",
  });

  const sampleLogs = [
  {
    label: "SSH Brute Force",
    data: {
      source_type: "ids",
      event_time: "2026-07-02 19:10:00",
      source_ip: "203.0.113.45",
      destination_ip: "10.0.0.22",
      event_type: "Brute Force Login Attempt",
      severity: "Critical",
      message: "Multiple failed SSH login attempts detected from external IP",
      raw_log:
        "Jul 02 19:10:00 sshd[1842]: Failed password for admin from 203.0.113.45 port 55321 ssh2 repeated 42 times",
    },
  },
  {
    label: "Malware Callback",
    data: {
      source_type: "endpoint",
      event_time: "2026-07-02 19:18:00",
      source_ip: "10.0.0.18",
      destination_ip: "198.51.100.22",
      event_type: "Malware C2 Callback",
      severity: "High",
      message: "Endpoint attempted outbound communication to suspected command-and-control server",
      raw_log:
        "EDR ALERT host=FINANCE-PC01 src=10.0.0.18 dst=198.51.100.22 proto=https action=blocked reason=suspected_c2_callback",
    },
  },
  {
    label: "Port Scan",
    data: {
      source_type: "firewall",
      event_time: "2026-07-02 19:25:00",
      source_ip: "192.0.2.90",
      destination_ip: "10.0.0.5",
      event_type: "Port Scan Detected",
      severity: "Medium",
      message: "Multiple connection attempts across common service ports detected",
      raw_log:
        "FW DENY src=192.0.2.90 dst=10.0.0.5 ports=21,22,23,80,443,3389 action=blocked pattern=horizontal_scan",
    },
  },
  {
    label: "Data Exfiltration",
    data: {
      source_type: "network",
      event_time: "2026-07-02 19:33:00",
      source_ip: "10.0.0.27",
      destination_ip: "203.0.113.200",
      event_type: "Possible Data Exfiltration",
      severity: "High",
      message: "Unusual outbound data transfer volume detected from internal workstation",
      raw_log:
        "NETFLOW src=10.0.0.27 dst=203.0.113.200 bytes_out=824000000 duration=300s proto=tcp alert=unusual_large_transfer",
    },
  },
  {
    label: "Ransomware Activity",
    data: {
      source_type: "endpoint",
      event_time: "2026-07-02 19:41:00",
      source_ip: "10.0.0.31",
      destination_ip: "N/A",
      event_type: "Ransomware-Like File Encryption",
      severity: "Critical",
      message: "Rapid file rename and encryption pattern detected on endpoint",
      raw_log:
        "EDR CRITICAL host=HR-LAPTOP07 process=unknown.exe activity=mass_file_rename extension=.locked files_modified=914 action=isolated",
    },
  },
];

function loadSampleLog(sample) {
  setFormData(sample.data);
  showToast?.(`${sample.label} sample loaded.`, "info");
}
  async function loadLogs() {
    try {
      setLoading(true);
      const response = await api.get("/logs");
      setLogs(response.data);
    } catch (error) {
      console.error("Failed to load ingested logs", error);
      showToast?.("Failed to load ingested logs.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  function updateField(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitLog(event) {
    event.preventDefault();

    if (!formData.message.trim() || !formData.raw_log.trim()) {
      showToast?.("Message and raw log are required.", "error");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/logs/ingest", formData);

      showToast?.("Security log ingested successfully.", "success");

      setFormData({
        source_type: "firewall",
        event_time: "",
        source_ip: "",
        destination_ip: "",
        event_type: "Suspicious Connection",
        severity: "Medium",
        message: "",
        raw_log: "",
      });

      await loadLogs();
    } catch (error) {
      console.error("Failed to ingest log", error);
      showToast?.("Failed to ingest security log.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function createIncidentFromLog(logId) {
    try {
      setCreatingIncidentId(logId);

      await api.post(`/logs/${logId}/create-incident`);

      showToast?.("Incident created successfully from ingested log.", "success");
    } catch (error) {
      console.error("Failed to create incident from log", error);
      showToast?.("Failed to create incident from log.", "error");
    } finally {
      setCreatingIncidentId(null);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">
          📥 Log Ingestion
        </h1>
        <p className="mt-2 text-slate-400">
          Ingest realistic firewall, IDS, endpoint, and network log events into CyberGuard for SOC triage.
        </p>

        <div className="mt-6 rounded-xl border border-cyan-500/10 bg-slate-950 p-4">
  <p className="text-sm font-semibold text-cyan-300">
    Quick Demo Samples
  </p>
  <p className="mt-1 text-sm text-slate-400">
    Load realistic SOC events for a faster demonstration.
  </p>

  <div className="mt-4 flex flex-wrap gap-3">
    {sampleLogs.map((sample) => (
      <button
        key={sample.label}
        type="button"
        onClick={() => loadSampleLog(sample)}
        className="rounded-lg border border-cyan-500/30 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10"
      >
        {sample.label}
      </button>
    ))}
  </div>
</div>
      </div>

      <section className="mb-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-cyan-300">
          Ingest Security Log
        </h2>

        <p className="mt-2 text-slate-400">
          Manually submit a parsed log event. Later, this module can be extended to support file upload,
          syslog forwarding, Suricata EVE JSON, Zeek logs, and Windows Event Logs.
        </p>

        <form onSubmit={submitLog} className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Source Type
            </label>
            <select
              value={formData.source_type}
              onChange={(event) => updateField("source_type", event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="firewall">Firewall</option>
              <option value="ids">IDS</option>
              <option value="endpoint">Endpoint</option>
              <option value="windows_event">Windows Event</option>
              <option value="network">Network</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Severity
            </label>
            <select
              value={formData.severity}
              onChange={(event) => updateField("severity", event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Event Time
            </label>
            <input
              type="text"
              placeholder="2026-07-02 18:30:00"
              value={formData.event_time}
              onChange={(event) => updateField("event_time", event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Event Type
            </label>
            <input
              type="text"
              placeholder="Suspicious Connection"
              value={formData.event_type}
              onChange={(event) => updateField("event_type", event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Source IP
            </label>
            <input
              type="text"
              placeholder="203.0.113.77"
              value={formData.source_ip}
              onChange={(event) => updateField("source_ip", event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Destination IP
            </label>
            <input
              type="text"
              placeholder="10.0.0.15"
              value={formData.destination_ip}
              onChange={(event) => updateField("destination_ip", event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Message
            </label>
            <input
              type="text"
              placeholder="Outbound connection to suspicious external IP detected"
              value={formData.message}
              onChange={(event) => updateField("message", event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Raw Log
            </label>
            <textarea
              placeholder="Paste raw firewall, IDS, endpoint, or network log here..."
              value={formData.raw_log}
              onChange={(event) => updateField("raw_log", event.target.value)}
              className="h-32 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Ingesting..." : "Ingest Log"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-cyan-300">
          Ingested Log Events
        </h2>

        {loading ? (
          <p className="mt-4 text-slate-400">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="mt-4 text-slate-400">
            No logs have been ingested yet.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-slate-700 bg-slate-950 p-5"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityStyle(
                          log.severity
                        )}`}
                      >
                        {log.severity}
                      </span>

                      <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                        {log.source_type}
                      </span>

                      <span className="text-xs text-slate-500">
                        {log.created_at}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-white">
                      {log.event_type || "Security Event"}
                    </h3>

                    <p className="mt-2 text-slate-300">
                      {log.message}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      <span className="rounded-lg bg-slate-800 px-3 py-2 text-slate-300">
                        Source: {log.source_ip || "Unknown"}
                      </span>

                      <span className="rounded-lg bg-slate-800 px-3 py-2 text-slate-300">
                        Destination: {log.destination_ip || "Unknown"}
                      </span>

                      <span className="rounded-lg bg-slate-800 px-3 py-2 text-slate-300">
                        Event Time: {log.event_time || "N/A"}
                      </span>
                    </div>

                    <pre className="mt-4 overflow-x-auto rounded-lg bg-black/40 p-4 text-xs text-slate-400">
                      {log.raw_log}
                    </pre>
                  </div>

                  <button
                    onClick={() => createIncidentFromLog(log.id)}
                    disabled={creatingIncidentId === log.id}
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {creatingIncidentId === log.id
                      ? "Creating..."
                      : "Create Incident"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}