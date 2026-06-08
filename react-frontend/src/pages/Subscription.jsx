const plans = [
  {
    name: "Free",
    price: "$0",
    tagline: "Basic threat visibility",
    highlight: false,
    features: [
      "Basic dashboard access",
      "Limited threat queue",
      "Rule-based alert review",
      "Community support",
    ],
  },
  {
    name: "Professional",
    price: "$49/month",
    tagline: "For SOC analysts and small teams",
    highlight: true,
    features: [
      "AI-assisted threat triage",
      "Incident management",
      "MITRE ATT&CK mapping",
      "Audit timeline",
      "Executive dashboard",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "$149/month",
    tagline: "For full SOC operations",
    highlight: false,
    features: [
      "Everything in Professional",
      "Role-based access control",
      "Break Glass emergency workflow",
      "Advanced compliance reporting",
      "Team management",
      "Stripe billing integration ready",
    ],
  },
];

export default function Subscription() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">
          💳 Subscription Center
        </h1>
        <p className="mt-2 text-slate-400">
          CyberGuard SaaS plan structure for feature gating, billing, and commercial readiness.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-6 shadow-lg ${
              plan.highlight
                ? "border-cyan-400 bg-cyan-500/10 shadow-cyan-500/20"
                : "border-cyan-500/20 bg-slate-900 shadow-cyan-500/5"
            }`}
          >
            {plan.highlight && (
              <div className="mb-4 inline-block rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-slate-950">
                Recommended
              </div>
            )}

            <h2 className="text-2xl font-bold text-white">{plan.name}</h2>

            <p className="mt-2 text-slate-400">{plan.tagline}</p>

            <div className="mt-6">
              <span className="text-4xl font-bold text-cyan-300">
                {plan.price}
              </span>
            </div>

            <button className="mt-6 w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
              Choose {plan.name}
            </button>

            <div className="mt-6 space-y-3">
              {plan.features.map((feature, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-sm text-slate-300"
                >
                  ✅ {feature}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-cyan-300">
          SaaS Readiness Notes
        </h2>

        <p className="mt-4 leading-7 text-slate-300">
          This subscription page demonstrates how CyberGuard can be commercialised using a tiered SaaS model.
          In the final implementation, this page can connect to Stripe Checkout, enforce plan-based feature
          restrictions, and manage organisation-level billing.
        </p>
      </section>
    </div>
  );
}