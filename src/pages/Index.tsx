import { useState } from "react";
import { decades, Decade } from "@/data/decades";
import TimelineHero from "@/components/TimelineHero";
import DecadeCard from "@/components/DecadeCard";
import DecadeModal from "@/components/DecadeModal";

const Index = () => {
  const [selectedDecade, setSelectedDecade] = useState<Decade | null>(null);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <TimelineHero />

      {/* Timeline */}
      <section id="timeline" className="relative max-w-5xl mx-auto px-4 pb-24">
        {/* Vertical line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
        <div className="absolute right-[2.15rem] top-0 bottom-0 w-0.5 bg-border md:hidden" />

        <div className="space-y-8 md:space-y-16">
          {decades.map((decade, index) => (
            <DecadeCard
              key={decade.id}
              decade={decade}
              index={index}
              onSelect={setSelectedDecade}
            />
          ))}
        </div>

        {/* End marker */}
        <div className="flex justify-center mt-12">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl shadow-lg shadow-primary/30">
            🎧
          </div>
        </div>
      </section>

      <DecadeModal
        decade={selectedDecade}
        open={!!selectedDecade}
        onOpenChange={(open) => !open && setSelectedDecade(null)}
      />
    </div>
  );
};

export default Index;
