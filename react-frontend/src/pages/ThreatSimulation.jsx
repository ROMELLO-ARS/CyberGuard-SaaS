import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bug,
  Database,
  FileWarning,
  Network,
  Radio,
  ShieldAlert,
  Terminal,
  Zap,
} from "lucide-react";
import api from "../services/api";

const threatTemplates = [
  {
    id: "port-scan",
    title: "Port Scan",
    icon: Network,
    severity: "Medium",
    source_type: "network_sensor",
    source_ip: "192.168.56.30",
    destination_ip: "192.168.56.20",
    event_type: "Port Scan",
    message: "Multiple connection attempts detected across common service ports.",
    raw_log:
      "Suricata Alert: ET SCAN Nmap Scripting Engine User-Agent Detected | SRC=192.168.56.30 DST=192.168.56.20 PORTS=21,22,80,443,445",
    explanation:
      "Simulates Kali or another testing machine scanning a victim host for open ports.",
  },
  {
    id: "ssh-bruteforce",
    title: "SSH Brute Force",
    icon: Terminal,
    severity: "High",
    source_type: "linux_auth",
    source_ip: "192.168.56.30",
    destination_ip: "192.168.56.20",
    event_type: "SSH Brute Force",
    message: "Multiple failed SSH login attempts detected for privileged account.",
    raw_log:
      "Jul 17 20:14:32 ubuntu-server sshd[2241]: Failed password for root from 192.168.56.30 port 55231 ssh2",
    explanation:
      "Simulates repeated failed login attempts against a Linux server in a private lab.",
  },
  {
    id: "malware-callback",
    title: "Malware Callback",
    icon: Bug,
    severity: "Critical",
    source_type: "ids_alert",
    source_ip: "192.168.56.20",
    destination_ip: "185.199.110.153",
    event_type: "Malware Callback",
    message: "Internal host attempted outbound communication to suspicious external IP.",
    raw_log:
      "IDS Alert: Possible malware beacon detected | SRC=192.168.56.20 DST=185.199.110.153 DPORT=443 INTERVAL=60s",
    explanation:
      "Simulates an infected endpoint attempting command-and-control communication.",
  },
  {
    id: "data-exfiltration",
    title: "Data Exfiltration",
    icon: Database,
    severity: "Critical",
    source_type: "firewall_log",
    source_ip: "192.168.56.25",
    destination_ip: "203.0.113.50",
    event_type: "Data Exfiltration",
    message: "Unusual outbound data transfer volume detected from internal workstation.",
    raw_log:
      "Firewall Alert: Large outbound transfer detected | SRC=192.168.56.25 DST=203.0.113.50 BYTES_OUT=734003200 PROTO=HTTPS",
    explanation:
      "Simulates a workstation sending an abnormal amount of data outside the network.",
  },
  {
    id: "ransomware-activity",
    title: "Ransomware Activity",
    icon: FileWarning,
    severity: "Critical",
    source_type: "endpoint_edr",
    source_ip: "192.168.56.40",
    destination_ip: "192.168.56.10",
    event_type: "Ransomware Activity",
    message: "High-volume file rename and encryption-like activity detected.",
    raw_log:
      "EDR Alert: Mass file modification detected | HOST=WIN-CLIENT01 FILES_CHANGED=1287 EXTENSION=.locked PROCESS=suspicious.exe",
    explanation:
      "Simulates endpoint behavior consistent with ransomware encryption activity.",
  },
  {
    id: "failed-login-storm",
    title: "Failed Login Storm",
    icon: ShieldAlert,
    severity: "High",
    source_type: "windows_event",
    source_ip: "192.168.56.31",
    destination_ip: "192.168.56.15",
    event_type: "Failed Login Storm",
    message: "Multiple Windows authentication failures detected in a short time window.",
    raw_log:
      "Windows Event 4625: An account failed to log on | SRC=192.168.56.31 TARGET=DOMAIN-DC01 COUNT=42 WINDOW=5min",
    explanation:
      "Simulates repeated failed Windows login attempts against a domain/server.",
  },
];

export default function ThreatSimulation({ showToast }) {
  const [selectedThreat, setSelectedThreat] = useState(threatTemplates[0]);
  const [sending, setSending] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [lastSentThreat, setLastSentThreat] = useState(null);
  const [autoCreateIncident, setAutoCreateIncident] = useState(true);
  const [createdIncident, setCreatedIncident] = useState(null);

 async function sendThreat(threat) {
  try {
    setSending(true);
    setApiResponse(null);
    setCreatedIncident(null);

    const payload = {
      source_type: threat.source_type,
      event_time: new Date().toISOString(),
      source_ip: threat.source_ip,
      destination_ip: threat.destination_ip,
      event_type: threat.event_type,
      severity: threat.severity,
      message: threat.message,
      raw_log: threat.raw_log,
    };

    const response = await api.post("/logs/ingest", payload);

    setApiResponse(response.data);
    setLastSentThreat(threat);

    const createdLogId = response.data.log_id || response.data.id;

    if (autoCreateIncident && createdLogId) {
      const incidentResponse = await api.post(
        `/logs/${createdLogId}/create-incident`
      );

      setCreatedIncident(incidentResponse.data);

      showToast?.(
        `${threat.title} sent and incident created automatically.`,
        "success"
      );
    } else {
      showToast?.(`${threat.title} sent to CyberGuard API.`, "success");
    }
  } catch (error) {
    console.error("Failed to send threat simulation", error);

    setApiResponse({
      status: "failed",
      message: "Threat simulation request failed.",
      error: error.message,
    });

    showToast?.("Threat simulation failed.", "error");
  } finally {
    setSending(false);
  }
}

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">
          Threat Simulation Center
        </h1>
        <p className="mt-2 max-w-4xl text-slate-400">
          Send realistic security events through the real CyberGuard API to prove
          that the SOC dashboard is receiving, storing, and processing threat data.
        </p>
      </div>

      <section className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
            <Radio size={28} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyan-300">
              Realistic SOC Test Workflow
            </h2>
            <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-300">
              This page does not update fake frontend values. Each simulation sends a
              structured event to <span className="text-cyan-300">POST /logs/ingest</span>.
              The backend stores the log, makes it visible in Log Ingestion, and allows it
              to become an incident. This creates a realistic SOC workflow from threat
              event to analyst response.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-cyan-300">
            Threat Scenarios
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Choose a realistic test event and send it through the live API.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {threatTemplates.map((threat) => {
              const Icon = threat.icon;
              const isSelected = selectedThreat.id === threat.id;

              return (
                <button
                  key={threat.id}
                  onClick={() => setSelectedThreat(threat)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-500/10"
                      : "border-slate-700 bg-slate-800 hover:border-cyan-500/40"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-slate-950 p-3 text-cyan-300">
                      <Icon size={24} />
                    </div>

                    <div>
                      <p className="font-bold text-white">{threat.title}</p>
                      <p
                        className={`mt-1 text-sm font-semibold ${
                          threat.severity === "Critical"
                            ? "text-red-300"
                            : threat.severity === "High"
                            ? "text-orange-300"
                            : "text-yellow-300"
                        }`}
                      >
                        {threat.severity}
                      </p>
                      <p className="mt-2 text-sm leading-5 text-slate-400">
                        {threat.explanation}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-cyan-300">
            Selected Test
          </h2>

          <div className="mt-6 rounded-2xl bg-slate-800 p-5">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-cyan-300" />
              <div>
                <p className="font-bold text-white">
                  {selectedThreat.title}
                </p>
                <p className="text-sm text-slate-400">
                  {selectedThreat.source_type}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Severity</span>
                <span className="font-semibold text-cyan-300">
                  {selectedThreat.severity}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Source IP</span>
                <span className="font-semibold text-slate-200">
                  {selectedThreat.source_ip}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Destination IP</span>
                <span className="font-semibold text-slate-200">
                  {selectedThreat.destination_ip}
                </span>
              </div>
            </div>
              <label className="mt-6 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300">
  <input
    type="checkbox"
    checked={autoCreateIncident}
    onChange={(event) => setAutoCreateIncident(event.target.checked)}
    className="h-4 w-4 accent-cyan-400"
  />
  Auto-create incident after log ingestion
</label>
            <button
              onClick={() => sendThreat(selectedThreat)}
              disabled={sending}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Zap size={18} />
              {sending ? "Sending to API..." : "Send Threat to API"}
            </button>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <Activity className="text-cyan-300" />
          <h2 className="text-2xl font-bold text-cyan-300">
            API Proof Panel
          </h2>
        </div>

        <p className="mt-2 text-sm text-slate-400">
          This panel shows the actual backend response returned by CyberGuard after sending
          the threat event.
        </p>

        {apiResponse ? (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-slate-800 p-5">
              <p className="text-sm font-semibold text-cyan-300">
                Last Sent Threat
              </p>

              <div className="mt-4 space-y-3 text-sm">
                <p>
                  <span className="text-slate-500">Scenario:</span>{" "}
                  <span className="text-slate-200">
                    {lastSentThreat?.title}
                  </span>
                </p>
                <p>
                  <span className="text-slate-500">Message:</span>{" "}
                  <span className="text-slate-200">
                    {lastSentThreat?.message}
                  </span>
                </p>
                <p>
                  <span className="text-slate-500">Raw Log:</span>
                </p>
                <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-300">
                  {lastSentThreat?.raw_log}
                </pre>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-950 p-5">
              <p className="text-sm font-semibold text-green-300">
                Backend Response
              </p>

              <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-black/40 p-4 text-xs text-slate-300">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-slate-800 p-6 text-sm text-slate-400">
            No threat sent yet. Select a scenario and click{" "}
            <span className="text-cyan-300">Send Threat to API</span>.
          </div>
        )}

        {createdIncident && (
  <div className="rounded-2xl bg-slate-950 p-5">
    <p className="text-sm font-semibold text-purple-300">
      Auto-Created Incident
    </p>

    <div className="mt-4 space-y-3 text-sm">
      <p>
        <span className="text-slate-500">Incident ID:</span>{" "}
        <span className="text-cyan-300">{createdIncident.id}</span>
      </p>

      <p>
        <span className="text-slate-500">Title:</span>{" "}
        <span className="text-slate-200">{createdIncident.title}</span>
      </p>

      <p>
        <span className="text-slate-500">Severity:</span>{" "}
        <span className="text-slate-200">{createdIncident.severity}</span>
      </p>

      <p>
        <span className="text-slate-500">Assigned To:</span>{" "}
        <span className="text-slate-200">{createdIncident.assigned_to}</span>
      </p>

      <p>
        <span className="text-slate-500">Status:</span>{" "}
        <span className="text-green-300">{createdIncident.status}</span>
      </p>
    </div>
  </div>
)}
      </section>

      <section className="mt-8 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6">
        <h2 className="text-2xl font-bold text-purple-300">
          Real Network Monitoring Roadmap
        </h2>

        <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300">
          The next real-world integration is to connect CyberGuard to a Suricata IDS
          sensor. Suricata monitors actual network traffic and writes IDS alerts to
          eve.json. A CyberGuard agent can read those alerts and forward them into the
          same API used by this page.
        </p>

        <div className="mt-5 rounded-xl bg-slate-950 p-4">
          <p className="text-sm font-semibold text-cyan-300">
            Real-world flow:
          </p>
          <p className="mt-2 text-sm text-slate-300">
            Kali Linux controlled traffic → Victim VM → Suricata IDS alert →
            CyberGuard API → SOC dashboard → incident → report
          </p>
        </div>
      </section>
    </div>
  );
}