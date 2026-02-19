import { Activity, TrendingUp, Thermometer, Droplets, Wind, Eye } from "lucide-react";

const mockPredictions = [
  { day: "Today", aqi: 178, label: "Unhealthy", color: "text-aqi-unhealthy" },
  { day: "Tomorrow", aqi: 195, label: "Unhealthy", color: "text-aqi-unhealthy" },
  { day: "Day 3", aqi: 152, label: "Unhealthy", color: "text-aqi-unhealthy" },
  { day: "Day 4", aqi: 120, label: "Moderate", color: "text-aqi-moderate" },
  { day: "Day 5", aqi: 89, label: "Moderate", color: "text-aqi-moderate" },
  { day: "Day 6", aqi: 65, label: "Moderate", color: "text-aqi-moderate" },
  { day: "Day 7", aqi: 48, label: "Good", color: "text-aqi-good" },
];

const stats = [
  { icon: Thermometer, label: "Temperature", value: "28°C" },
  { icon: Droplets, label: "Humidity", value: "62%" },
  { icon: Wind, label: "Wind Speed", value: "12 km/h" },
  { icon: Eye, label: "Visibility", value: "3.2 km" },
];

const PredictionSection = () => {
  return (
    <section id="prediction" className="py-24 relative">
      <div className="container px-4">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="text-xs font-mono uppercase tracking-widest text-primary">ML Prediction</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">AQI Forecast</h2>
        <p className="text-muted-foreground max-w-xl mb-12">
          7-day air quality index prediction powered by our machine learning model trained on historical Delhi NCR data.
        </p>

        {/* Current AQI highlight */}
        <div className="rounded-xl border border-border bg-card p-8 mb-8 border-glow">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current AQI — Delhi NCR</p>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-bold text-aqi-unhealthy font-mono">178</span>
                <span className="text-lg text-aqi-unhealthy font-semibold">Unhealthy</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Last updated: 2 minutes ago</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-lg bg-secondary p-4 min-w-[100px]">
                  <s.icon className="h-4 w-4 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-semibold font-mono">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7-day forecast */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
          {mockPredictions.map((p) => (
            <div
              key={p.day}
              className="rounded-xl border border-border bg-card p-4 text-center card-hover cursor-default"
            >
              <p className="text-xs text-muted-foreground mb-2">{p.day}</p>
              <p className={`text-2xl font-bold font-mono ${p.color}`}>{p.aqi}</p>
              <p className={`text-xs mt-1 ${p.color}`}>{p.label}</p>
              <div className="mt-3 flex items-center justify-center">
                <TrendingUp className={`h-3 w-3 ${p.color}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PredictionSection;
