import { Map, ExternalLink } from "lucide-react";

const MapSection = () => {
  return (
    <section id="map" className="py-24 relative">
      <div className="container px-4">
        <div className="flex items-center gap-3 mb-2">
          <Map className="h-5 w-5 text-primary" />
          <span className="text-xs font-mono uppercase tracking-widest text-primary">Dynamic Map</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Pollution Heatmap</h2>
        <p className="text-muted-foreground max-w-xl mb-12">
          Interactive Streamlit-powered map showing real-time pollution distribution across Delhi NCR.
        </p>

        <div className="rounded-xl border border-border bg-card overflow-hidden border-glow">
          {/* Placeholder for Streamlit embed */}
          <div className="relative aspect-[16/9] bg-secondary flex items-center justify-center">
            {/* Grid pattern background */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(hsl(142 70% 45% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(142 70% 45% / 0.3) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative z-10 text-center">
              <Map className="h-16 w-16 text-primary/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm mb-4">
                Streamlit Map will be embedded here
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary hover:bg-primary/20 transition-colors"
              >
                Open Full Map
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Legend bar */}
          <div className="p-4 border-t border-border flex flex-wrap items-center gap-6 text-xs">
            <span className="text-muted-foreground">AQI Levels:</span>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-aqi-good" />
              <span className="text-muted-foreground">Good (0–50)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-aqi-moderate" />
              <span className="text-muted-foreground">Moderate (51–100)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-aqi-unhealthy" />
              <span className="text-muted-foreground">Unhealthy (101–200)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-aqi-hazardous" />
              <span className="text-muted-foreground">Hazardous (300+)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
