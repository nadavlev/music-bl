import { Music, ChevronDown } from "lucide-react";

const TimelineHero = () => {
  const scrollToTimeline = () => {
    document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.15),transparent_70%)]" />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-center gap-3 text-5xl md:text-7xl">
          <span>🎵</span>
          <Music className="w-12 h-12 md:w-16 md:h-16 text-primary" />
          <span>🎶</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
          ציר הזמן המוזיקלי
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          מסע אינטראקטיבי בהיסטוריה של המוזיקה — מ-1900 ועד היום.
          <br />
          גלו את הסגנונות, הלהיטים, וצרו שירים חדשים בעזרת AI.
        </p>

        <button
          onClick={scrollToTimeline}
          className="mt-8 flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors animate-bounce"
        >
          <span className="text-sm">גלול למטה</span>
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};

export default TimelineHero;
