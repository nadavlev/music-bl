import { useState } from "react";
import { Music } from "lucide-react";
import { Decade } from "@/data/decades";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DecadeCardProps {
  decade: Decade;
  index: number;
  onSelect: (decade: Decade) => void;
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

const DecadeCard = ({ decade, index, onSelect }: DecadeCardProps) => {
  const isEven = index % 2 === 0;
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <div className="relative flex items-center gap-6 md:gap-10 group">
      {/* Timeline dot */}
      <div className="absolute right-4 md:right-auto md:left-1/2 md:-translate-x-1/2 top-0 z-10">
        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-accent border-4 border-primary flex items-center justify-center text-lg md:text-2xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
          {decade.icon}
        </div>
      </div>

      {/* Card - alternating sides on desktop */}
      <div
        className={`w-[calc(100%-4rem)] mr-auto md:w-[calc(50%-3.5rem)] ${
          isEven ? "md:mr-auto md:pl-0 md:pr-8" : "md:ml-auto md:pr-0 md:pl-8"
        } md:pt-0`}
      >
        <div className="bg-card border border-border rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:border-primary/40">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-foreground">{decade.name}</h3>
            <span className="text-xs text-muted-foreground font-mono">{decade.years}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{decade.description}</p>

          {/* Genres */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {decade.genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>

          {/* Preview hits with embedded player */}
          <div className="space-y-2 mb-4">
            {decade.previewHits.map((hit) => {
              const videoId = extractYoutubeId(hit.youtubeUrl);
              const isActive = activeVideoId === videoId;
              return (
                <div key={hit.title} className="space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveVideoId(isActive ? null : videoId);
                    }}
                    className={`w-full flex items-center gap-2 text-sm p-1.5 rounded-lg transition-colors text-right ${
                      isActive ? "bg-primary/10 border border-primary/30" : "hover:bg-accent/50"
                    }`}
                  >
                    <Music className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-foreground font-medium">{hit.title}</span>
                    <span className="text-muted-foreground">— {hit.artist}</span>
                    <span className="mr-auto text-red-400 text-xs">
                      {isActive ? "▶ מנגן" : "▶ נגן"}
                    </span>
                  </button>
                  {isActive && videoId && (
                    <div className="rounded-lg overflow-hidden border border-border">
                      <iframe
                        width="100%"
                        height="200"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        className="block"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <Button
            variant="outline"
            className="w-full border-primary/30 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => onSelect(decade)}
          >
            גלה עוד →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DecadeCard;
