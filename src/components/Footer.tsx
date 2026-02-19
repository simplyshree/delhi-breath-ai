import { Wind } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-8">
    <div className="container px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Wind className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold gradient-text">AirAware</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Delhi NCR Air Quality Prediction Platform · Built with ML
      </p>
    </div>
  </footer>
);

export default Footer;
