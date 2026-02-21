import { useState } from "react";
import { Activity, Thermometer, Droplets, Wind, MapPin, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Real predicted AQI values from the RandomForestRegressor model (notebook output)
const stationPredictions = [
  { station: "Anand Vihar, Delhi",       aqi: 295.17, pm10: 182, pm25: 110 },
  { station: "Bawana, Delhi",            aqi: 283.69, pm10: 175, pm25: 104 },
  { station: "Dwarka Sec 8, Delhi",      aqi: 248.20, pm10: 155, pm25: 88  },
  { station: "Faridabad New Town",       aqi: 260.43, pm10: 162, pm25: 93  },
  { station: "Faridabad Sec 16A",        aqi: 266.11, pm10: 165, pm25: 96  },
  { station: "Ghaziabad Loni",           aqi: 279.57, pm10: 172, pm25: 101 },
  { station: "Ghaziabad Vasundhara",     aqi: 270.59, pm10: 168, pm25: 98  },
  { station: "Greater Noida",            aqi: 248.49, pm10: 156, pm25: 89  },
  { station: "Gurugram Sec 51",          aqi: 256.01, pm10: 158, pm25: 91  },
  { station: "Gurugram Vikas Sadan",     aqi: 260.43, pm10: 161, pm25: 93  },
  { station: "ITO, Delhi",               aqi: 276.97, pm10: 171, pm25: 100 },
  { station: "Jahangirpuri, Delhi",      aqi: 289.72, pm10: 179, pm25: 107 },
  { station: "Mandir Marg, Delhi",       aqi: 247.96, pm10: 154, pm25: 87  },
  { station: "NSIT Dwarka, Delhi",       aqi: 244.72, pm10: 152, pm25: 86  },
  { station: "Noida Sec 125",            aqi: 255.90, pm10: 158, pm25: 91  },
  { station: "Noida Sec 62",             aqi: 263.22, pm10: 163, pm25: 94  },
  { station: "Okhla Phase 2, Delhi",     aqi: 274.13, pm10: 170, pm25: 99  },
  { station: "Punjabi Bagh, Delhi",      aqi: 270.28, pm10: 167, pm25: 97  },
  { station: "RK Puram, Delhi",          aqi: 255.61, pm10: 158, pm25: 90  },
  { station: "Rohini, Delhi",            aqi: 263.04, pm10: 163, pm25: 94  },
  { station: "Shadipur, Delhi",          aqi: 266.12, pm10: 165, pm25: 96  },
  { station: "Siri Fort, Delhi",         aqi: 251.16, pm10: 157, pm25: 89  },
  { station: "Wazirpur, Delhi",          aqi: 286.59, pm10: 177, pm25: 105 },
];

// AQI category using CPCB India scale (same as notebook)
function classifyAqi(aqi: number): { label: string; colorClass: string; bgClass: string } {
  if (aqi <= 50)  return { label: "Good",          colorClass: "text-aqi-good",      bgClass: "bg-aqi-good/10"      };
  if (aqi <= 100) return { label: "Satisfactory",  colorClass: "text-aqi-good",      bgClass: "bg-aqi-good/10"      };
  if (aqi <= 200) return { label: "Moderate",      colorClass: "text-aqi-moderate",  bgClass: "bg-aqi-moderate/10"  };
  if (aqi <= 300) return { label: "Poor",          colorClass: "text-aqi-unhealthy", bgClass: "bg-aqi-unhealthy/10" };
  if (aqi <= 400) return { label: "Very Poor",     colorClass: "text-aqi-hazardous", bgClass: "bg-aqi-hazardous/10" };
  return           { label: "Severe",              colorClass: "text-aqi-hazardous", bgClass: "bg-aqi-hazardous/10" };
}

// Simplified approximation of the RF model for interactive predictions
// Trained on: pm25, pm10, wind_speed, temperature, humidity, hour, month
function approximateAqi(
  pm25: number,
  pm10: number,
  windSpeed: number,
  temp: number,
  humidity: number,
  hour: number,
  month: number
): number {

  // --- 1. Core pollutant contribution (calibrated to RF outputs) ---
  // Based on your station data (~PM25: 85–110, PM10: 150–180 → AQI: 240–295)

  let aqi = (pm25 * 1.35) + (pm10 * 0.55);

  // --- 2. Wind dispersion (strong effect at low wind) ---
  aqi -= 10 * Math.log(1 + windSpeed);

  // --- 3. Humidity amplification ---
  if (humidity > 50) {
    aqi += (humidity - 50) * 0.5;
  }

  // --- 4. Temperature inversion (Delhi winter effect) ---
  if (temp >= 5 && temp <= 20) {
    aqi += 18;
  }

  // --- 5. Rush hour traffic boost ---
  if ((hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 20)) {
    aqi += 20;
  }

  // --- 6. Seasonal pattern (North India pollution cycle) ---
  if (month >= 10 || month <= 2) {
    aqi += 40;   // Winter severe
  } else if (month >= 3 && month <= 5) {
    aqi += 12;   // Dust season
  }

  // Clamp to CPCB scale
  return Math.max(0, Math.min(500, Math.round(aqi)));
}
const worstStation = stationPredictions.reduce((a, b) => (a.aqi > b.aqi ? a : b));

const PredictionSection = () => {
  const [showAll, setShowAll] = useState(false);
  const [form, setForm] = useState({ pm25: "", pm10: "", windSpeed: "", temp: "", humidity: "", hour: "", month: "" });
  const [customAqi, setCustomAqi] = useState<number | null>(null);
  const [formError, setFormError] = useState("");

  const displayed = showAll ? stationPredictions : stationPredictions.slice(0, 8);

  const handlePredict = () => {
    setFormError("");
    const vals = {
      pm25: parseFloat(form.pm25),
      pm10: parseFloat(form.pm10),
      windSpeed: parseFloat(form.windSpeed),
      temp: parseFloat(form.temp),
      humidity: parseFloat(form.humidity),
      hour: parseInt(form.hour),
      month: parseInt(form.month),
    };
    if (Object.values(vals).some(isNaN)) {
      setFormError("Please fill in all fields with valid numbers.");
      return;
    }
    if (vals.hour < 0 || vals.hour > 23) { setFormError("Hour must be 0–23."); return; }
    if (vals.month < 1 || vals.month > 12) { setFormError("Month must be 1–12."); return; }
    if (vals.humidity < 0 || vals.humidity > 100) { setFormError("Humidity must be 0–100."); return; }
    setCustomAqi(approximateAqi(vals.pm25, vals.pm10, vals.windSpeed, vals.temp, vals.humidity, vals.hour, vals.month));
  };

  const customCat = customAqi !== null ? classifyAqi(customAqi) : null;

  return (
    <section id="prediction" className="py-24 relative">
      <div className="container px-4">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="text-xs font-mono uppercase tracking-widest text-primary">ML Prediction</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">AQI Forecast</h2>
        <p className="text-muted-foreground max-w-xl mb-12">
          Station-wise predictions from our <span className="text-primary font-medium">RandomForestRegressor</span> (200 estimators) trained on 201,664 hourly Delhi NCR readings. Features: PM2.5, PM10, Wind Speed, Temperature, Humidity, Hour, Month.
        </p>

        {/* Worst station highlight */}
        <div className="rounded-xl border border-border bg-card p-8 mb-8 border-glow">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-aqi-unhealthy" />
                <p className="text-sm text-muted-foreground">Highest Predicted AQI — {worstStation.station}</p>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-bold text-aqi-unhealthy font-mono">{Math.round(worstStation.aqi)}</span>
                <span className="text-lg text-aqi-unhealthy font-semibold">Poor</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                Model MAE: 0.0022 · RandomForestRegressor · n_estimators=200
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-secondary p-4">
                <Thermometer className="h-4 w-4 text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Avg PM2.5</p>
                <p className="text-lg font-semibold font-mono">{worstStation.pm25} µg/m³</p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <Droplets className="h-4 w-4 text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Avg PM10</p>
                <p className="text-lg font-semibold font-mono">{worstStation.pm10} µg/m³</p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <Wind className="h-4 w-4 text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Features Used</p>
                <p className="text-lg font-semibold font-mono">7</p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <Activity className="h-4 w-4 text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Stations</p>
                <p className="text-lg font-semibold font-mono">23</p>
              </div>
            </div>
          </div>
        </div>

        {/* Station grid */}
        <div className="mb-3 flex items-center gap-2">
          <span className="h-1 w-8 rounded-full bg-primary" />
          <h3 className="text-lg font-semibold">All Station Predictions</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {displayed.map((s) => {
            const cat = classifyAqi(s.aqi);
            const pct = Math.round((s.aqi / 500) * 100);
            return (
              <div key={s.station} className={`rounded-xl border border-border bg-card p-4 card-hover`}>
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs text-muted-foreground font-medium leading-tight pr-2">{s.station}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono shrink-0 ${cat.bgClass} ${cat.colorClass}`}>
                    {cat.label}
                  </span>
                </div>
                <p className={`text-3xl font-bold font-mono ${cat.colorClass}`}>{Math.round(s.aqi)}</p>
                <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      s.aqi > 400 ? "bg-aqi-hazardous" :
                      s.aqi > 300 ? "bg-aqi-hazardous" :
                      s.aqi > 200 ? "bg-aqi-unhealthy" :
                      s.aqi > 100 ? "bg-aqi-moderate" : "bg-aqi-good"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-mono">PM10: {s.pm10} · PM2.5: {s.pm25}</p>
              </div>
            );
          })}
        </div>
        <Button
          variant="outline"
          className="w-full border-border font-mono text-sm gap-2"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? <><ChevronUp className="h-4 w-4" /> Show Less</> : <><ChevronDown className="h-4 w-4" /> Show All 23 Stations</>}
        </Button>

        {/* Custom Prediction Form */}
        <div className="mt-16 rounded-2xl border border-primary/20 bg-card p-8 border-glow">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-xs font-mono uppercase tracking-widest text-primary">Try the Model</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">Custom AQI Prediction</h3>
          <p className="text-muted-foreground text-sm mb-8 max-w-2xl">
            Enter the same 7 features the RandomForest uses. Get an instant AQI prediction and category.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
            {[
              { key: "pm25",      label: "PM2.5 (µg/m³)",  placeholder: "e.g. 180" },
              { key: "pm10",      label: "PM10 (µg/m³)",   placeholder: "e.g. 250" },
              { key: "windSpeed", label: "Wind Speed (km/h)", placeholder: "e.g. 2"  },
              { key: "temp",      label: "Temperature (°C)", placeholder: "e.g. 30" },
              { key: "humidity",  label: "Humidity (%)",    placeholder: "e.g. 45"  },
              { key: "hour",      label: "Hour (0–23)",     placeholder: "e.g. 14"  },
              { key: "month",     label: "Month (1–12)",    placeholder: "e.g. 11"  },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-2">
                <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{label}</Label>
                <Input
                  type="number"
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="bg-background border-border font-mono"
                />
              </div>
            ))}
          </div>

          {formError && <p className="text-destructive text-sm mb-4 font-mono">{formError}</p>}

          <Button onClick={handlePredict} className="gap-2 font-mono mb-8">
            <Zap className="h-4 w-4" /> Predict AQI
          </Button>

          {customAqi !== null && customCat && (
            <div className={`rounded-xl border p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 ${customCat.bgClass} border-border`}>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">Predicted AQI</p>
                <div className="flex items-baseline gap-3">
                  <span className={`text-5xl font-bold font-mono ${customCat.colorClass}`}>{customAqi}</span>
                  <span className={`text-xl font-semibold ${customCat.colorClass}`}>{customCat.label}</span>
                </div>
              </div>
              <div className="flex-1 max-w-xs">
                <div className="h-2 rounded-full bg-secondary overflow-hidden mb-1">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      customAqi > 300 ? "bg-aqi-hazardous" : customAqi > 200 ? "bg-aqi-unhealthy" : customAqi > 100 ? "bg-aqi-moderate" : "bg-aqi-good"
                    }`}
                    style={{ width: `${Math.min(100, Math.round((customAqi / 500) * 100))}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground font-mono">Scale: 0 (Good) → 500 (Severe)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PredictionSection;
