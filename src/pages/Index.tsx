import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PredictionSection from "@/components/PredictionSection";

import StrategiesSection from "@/components/StrategiesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <PredictionSection />
      
      <StrategiesSection />
      <Footer />
    </div>
  );
};

export default Index;
