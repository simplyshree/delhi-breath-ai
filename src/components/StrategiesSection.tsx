import { Shield, AlertTriangle, Leaf, Home, Car, Factory, Heart, Droplets } from "lucide-react";
import ResourceCalculator from "@/components/ResourceCalculator";
import HospitalSearch from "@/components/HospitalSearch";

const preventive = [
  {
    icon: Leaf,
    title: "Green Cover Expansion",
    desc: "Increase urban green spaces and tree plantations along major roads to absorb pollutants.",
  },
  {
    icon: Car,
    title: "Traffic Management",
    desc: "Implement odd-even vehicle policy and promote EV adoption during high-AQI periods.",
  },
  {
    icon: Factory,
    title: "Industrial Emission Control",
    desc: "Enforce stricter emission norms for factories and thermal power plants in the NCR belt.",
  },
  {
    icon: Droplets,
    title: "Dust Suppression",
    desc: "Deploy water sprinklers and anti-smog guns at construction sites and arterial roads.",
  },
];

const tentative = [
  {
    icon: Home,
    title: "Stay Indoors",
    desc: "Keep windows closed and use air purifiers when AQI exceeds 200. Limit outdoor activities.",
  },
  {
    icon: Heart,
    title: "Health Precautions",
    desc: "Wear N95 masks outdoors. Keep inhalers and medication ready for respiratory conditions.",
  },
  {
    icon: Shield,
    title: "School Advisories",
    desc: "Suspend outdoor school activities when AQI is severe. Shift to indoor physical education.",
  },
  {
    icon: AlertTriangle,
    title: "Emergency Protocols",
    desc: "Activate GRAP measures and issue public health advisories through local administration.",
  },
];

const StrategyCard = ({ icon: Icon, title, desc }: { icon: typeof Shield; title: string; desc: string }) => (
  <div className="rounded-xl border border-border bg-card p-6 card-hover">
    <div className="rounded-lg bg-primary/10 w-10 h-10 flex items-center justify-center mb-4">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <h4 className="font-semibold mb-2">{title}</h4>
    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);

const StrategiesSection = () => {
  return (
    <section id="strategies" className="py-24 relative">
      <div className="container px-4">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-xs font-mono uppercase tracking-widest text-primary">Action Plans</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Strategies</h2>
        <p className="text-muted-foreground max-w-xl mb-16">
          Comprehensive preventive and tentative measures to combat air pollution in Delhi NCR.
        </p>

        {/* Resource Calculator — moved above action plans */}
        <ResourceCalculator />

        {/* Preventive */}
        <div className="mt-16 mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1 w-8 rounded-full bg-primary" />
            <h3 className="text-lg font-semibold">Preventive Strategies</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {preventive.map((s) => (
              <StrategyCard key={s.title} {...s} />
            ))}
          </div>
        </div>

        {/* Tentative */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1 w-8 rounded-full bg-aqi-moderate" />
            <h3 className="text-lg font-semibold">Tentative Strategies</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tentative.map((s) => (
              <StrategyCard key={s.title} {...s} />
            ))}
          </div>
        </div>

        {/* Hospital Search */}
        <HospitalSearch />
      </div>
    </section>
  );
};

export default StrategiesSection;
