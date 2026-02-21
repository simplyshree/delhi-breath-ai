import { useState } from "react";
import { Calculator, Truck, Leaf, IndianRupee, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Constants from the model
const BASE_TREES = 300;
const MAX_TREES = 1200;
const ROAD_LENGTH_PER_AREA = 25; // km
const TRUCK_COVERAGE = 8; // km per day
const TRUCK_COST = 4500000; // ₹45 lakhs
const TRUCK_OPERATION = 1000000; // ₹10 lakhs annual
const TREE_COST = 2500; // ₹ per tree (3-year maintenance)

function calcPollutionIndex(aqi: number, maxAqi: number): number {
  if (maxAqi === 0) return 0;
  return Math.min(aqi / maxAqi, 1);
}

function calcDustIndex(pm10: number, maxPm10: number): number {
  if (maxPm10 === 0) return 0;
  return Math.min(pm10 / maxPm10, 1);
}

function calcTreesRequired(pollutionIndex: number): number {
  return Math.round(BASE_TREES + pollutionIndex * (MAX_TREES - BASE_TREES));
}

function calcSprinklerTrucks(dustIndex: number): number {
  const frequency = 1 + dustIndex; // 1 to 2 times per day
  return Math.round((ROAD_LENGTH_PER_AREA * frequency) / TRUCK_COVERAGE);
}

function calcBudget(trucks: number, trees: number): { truckBudget: number; treeBudget: number; total: number } {
  let total = 0;
  let truckBudget = 0;
  let treeBudget = 0;
  if (trucks >= 1) {
    truckBudget = trucks * (TRUCK_COST + TRUCK_OPERATION);
    total += truckBudget;
  }
  if (trees >= 100) {
    treeBudget = trees * TREE_COST;
    total += treeBudget;
  }
  return { truckBudget, treeBudget, total };
}

function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

interface Results {
  pollutionIndex: number;
  dustIndex: number;
  treesRequired: number;
  sprinklerTrucks: number;
  truckBudget: number;
  treeBudget: number;
  total: number;
}

const ResultCard = ({
  icon: Icon,
  label,
  value,
  sub,
  color = "primary",
}: {
  icon: typeof Calculator;
  label: string;
  value: string;
  sub?: string;
  color?: "primary" | "moderate" | "good";
}) => {
  const colorMap = {
    primary: "text-primary border-primary/20 bg-primary/5",
    moderate: "text-aqi-moderate border-aqi-moderate/20 bg-aqi-moderate/5",
    good: "text-aqi-good border-aqi-good/20 bg-aqi-good/5",
  };
  return (
    <div className={`rounded-xl border p-5 ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-mono uppercase tracking-widest opacity-70">{label}</span>
      </div>
      <p className="text-2xl font-bold font-mono">{value}</p>
      {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
    </div>
  );
};

const ResourceCalculator = () => {
  const [aqi, setAqi] = useState("");
  const [maxAqi, setMaxAqi] = useState("");
  const [pm10, setPm10] = useState("");
  const [maxPm10, setMaxPm10] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const aqiVal = parseFloat(aqi);
    const maxAqiVal = parseFloat(maxAqi);
    const pm10Val = parseFloat(pm10);
    const maxPm10Val = parseFloat(maxPm10);

    if (
      isNaN(aqiVal) || isNaN(maxAqiVal) || isNaN(pm10Val) || isNaN(maxPm10Val) ||
      aqiVal < 0 || maxAqiVal <= 0 || pm10Val < 0 || maxPm10Val <= 0
    ) {
      setError("Please enter valid positive numbers. Max AQI and Max PM10 must be greater than 0.");
      return;
    }
    if (aqiVal > maxAqiVal) {
      setError("AQI cannot exceed Max AQI.");
      return;
    }
    if (pm10Val > maxPm10Val) {
      setError("PM10 cannot exceed Max PM10.");
      return;
    }

    const pollutionIndex = calcPollutionIndex(aqiVal, maxAqiVal);
    const dustIndex = calcDustIndex(pm10Val, maxPm10Val);
    const treesRequired = calcTreesRequired(pollutionIndex);
    const sprinklerTrucks = calcSprinklerTrucks(dustIndex);
    const { truckBudget, treeBudget, total } = calcBudget(sprinklerTrucks, treesRequired);

    setResults({ pollutionIndex, dustIndex, treesRequired, sprinklerTrucks, truckBudget, treeBudget, total });
  };

  const handleReset = () => {
    setAqi(""); setMaxAqi(""); setPm10(""); setMaxPm10("");
    setResults(null); setError("");
  };

  return (
    <div className="mt-20 rounded-2xl border border-border bg-card p-8 border-glow">
      <div className="flex items-center gap-3 mb-2">
        <Calculator className="h-5 w-5 text-primary" />
        <span className="text-xs font-mono uppercase tracking-widest text-primary">Resource Planner</span>
      </div>
      <h3 className="text-2xl font-bold mb-1">Resource & Budget Calculator</h3>
      <p className="text-muted-foreground text-sm mb-8 max-w-2xl">
        Enter the predicted AQI and PM10 values for an area to calculate required trees, sprinkler trucks, and estimated budget based on WHO & GRAP recommendations.
      </p>

      {/* Inputs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="space-y-2">
          <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Predicted AQI</Label>
          <Input
            type="number"
            placeholder="e.g. 320"
            value={aqi}
            onChange={(e) => setAqi(e.target.value)}
            min={0}
            className="bg-background border-border font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Max AQI (area/region)</Label>
          <Input
            type="number"
            placeholder="e.g. 500"
            value={maxAqi}
            onChange={(e) => setMaxAqi(e.target.value)}
            min={1}
            className="bg-background border-border font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">PM10 (µg/m³)</Label>
          <Input
            type="number"
            placeholder="e.g. 180"
            value={pm10}
            onChange={(e) => setPm10(e.target.value)}
            min={0}
            className="bg-background border-border font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Max PM10 (area/region)</Label>
          <Input
            type="number"
            placeholder="e.g. 300"
            value={maxPm10}
            onChange={(e) => setMaxPm10(e.target.value)}
            min={1}
            className="bg-background border-border font-mono"
          />
        </div>
      </div>

      {error && (
        <p className="text-destructive text-sm mb-4 font-mono">{error}</p>
      )}

      <div className="flex gap-3 mb-8">
        <Button onClick={handleCalculate} className="gap-2 font-mono">
          <Calculator className="h-4 w-4" /> Calculate
        </Button>
        <Button variant="outline" onClick={handleReset} className="gap-2 font-mono border-border">
          <RefreshCw className="h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          <div className="h-px bg-border" />
          <p className="text-xs font-mono uppercase tracking-widest text-primary">— Calculated Results</p>

          {/* Indices */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-background p-4 font-mono text-sm">
              <p className="text-muted-foreground mb-1">Pollution Index</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${(results.pollutionIndex * 100).toFixed(1)}%` }}
                  />
                </div>
                <span className="font-bold text-primary">{(results.pollutionIndex * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-4 font-mono text-sm">
              <p className="text-muted-foreground mb-1">Dust Index</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-aqi-moderate transition-all duration-700"
                    style={{ width: `${(results.dustIndex * 100).toFixed(1)}%` }}
                  />
                </div>
                <span className="font-bold text-aqi-moderate">{(results.dustIndex * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Resource Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              icon={Leaf}
              label="Trees Required"
              value={results.treesRequired.toLocaleString()}
              sub="1 tree offsets ~20 kg CO₂/yr (WHO)"
              color="good"
            />
            <ResultCard
              icon={Truck}
              label="Sprinkler Trucks"
              value={results.sprinklerTrucks.toString()}
              sub={`${ROAD_LENGTH_PER_AREA} km road · ${TRUCK_COVERAGE} km/truck/day`}
              color="moderate"
            />
            <ResultCard
              icon={IndianRupee}
              label="Truck Budget"
              value={formatINR(results.truckBudget)}
              sub="₹45L cost + ₹10L/yr operation"
            />
            <ResultCard
              icon={IndianRupee}
              label="Tree Plantation"
              value={formatINR(results.treeBudget)}
              sub="₹2,500/tree · 3-yr maintenance"
            />
          </div>

          {/* Total */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-primary mb-1">Total Estimated Budget</p>
              <p className="text-4xl font-bold text-primary font-mono">{formatINR(results.total)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                For area with 10,000 population · {ROAD_LENGTH_PER_AREA} km road network
              </p>
            </div>
            <div className="text-right space-y-1 text-sm font-mono text-muted-foreground">
              <p>Trucks: {formatINR(results.truckBudget)}</p>
              <p>Trees: {formatINR(results.treeBudget)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceCalculator;
