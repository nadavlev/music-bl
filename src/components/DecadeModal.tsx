import { useState, useMemo } from "react";
import { Music, Sparkles, Copy, RefreshCw } from "lucide-react";
import { Decade } from "@/data/decades";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface DecadeModalProps {
  decade: Decade | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const genreColors: Record<string, string> = {
  "רוקנ'רול": "bg-red-500/20 text-red-300 border-red-500/30",
  "רוק": "bg-red-500/20 text-red-300 border-red-500/30",
  "ג'אז": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "ג'אז מוקדם": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "בלוז": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "בלוז מוקדם": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "פופ": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "דיסקו": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "היפ-הופ": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "היפ-הופ מוקדם": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "סול": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "R&B": "bg-rose-500/20 text-rose-300 border-rose-500/30",
  "EDM": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "פאנק": "bg-green-500/20 text-green-300 border-green-500/30",
  "רגטיים": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "סווינג": "bg-teal-500/20 text-teal-300 border-teal-500/30",
};

function getGenreColor(genre: string) {
  return genreColors[genre] || "bg-secondary text-secondary-foreground";
}

function generateSong(genre: string, keyword: string, decade: Decade): { lyrics: string; structure: string } {
  const templates: Record<string, { verses: string[]; chorus: string; structure: string }> = {
    default: {
      verses: [
        `בלילות שקטים, ${keyword} מרחף באוויר\nכמו מנגינה ישנה שלא נגמרה\nהלב פועם בקצב של ${genre}\nוהזמן עוצר, רק המוזיקה נשארה`,
        `ברחובות העיר, ${keyword} לוחש בשקט\nצלילים מתערבבים כמו חלום\nמהעשור של ${decade.name}, הסיפור נולד\nוכל תו הוא רגע שלא יחזור`,
      ],
      chorus: `${keyword}, ${keyword}\nתן למוזיקה לדבר\nבסגנון ${genre} אנחנו שרים\nבואו נרקוד עד הבוקר`,
      structure: `🎵 מבנה מומלץ:\n• קצב: בינוני-מהיר, אופייני ל${genre}\n• מפתח: רה מינור (Dm)\n• כלי נגינה: ${getInstruments(genre)}\n• מבנה: בית → פזמון → בית → פזמון → גשר → פזמון`,
    },
  };

  const template = templates.default;
  const lyrics = `🎤 בית 1:\n${template.verses[0]}\n\n🎶 פזמון:\n${template.chorus}\n\n🎤 בית 2:\n${template.verses[1]}\n\n🎶 פזמון:\n${template.chorus}`;

  return { lyrics, structure: template.structure };
}

function getInstruments(genre: string): string {
  const instruments: Record<string, string> = {
    "רוקנ'רול": "גיטרה חשמלית, בס, תופים, פסנתר",
    "רוק": "גיטרה חשמלית, בס, תופים",
    "ג'אז": "סקסופון, פסנתר, קונטרבס, תופים",
    "בלוז": "גיטרה אקוסטית, הרמוניקה, פסנתר",
    "פופ": "סינתיסייזר, גיטרה, תופים אלקטרוניים",
    "דיסקו": "בס, גיטרה פאנקית, כלי מיתר, תופים",
    "היפ-הופ": "ביטים, סמפלר, סינתיסייזר, 808",
    "EDM": "סינתיסייזר, דראם מאשין, בס אלקטרוני",
    "רגטיים": "פסנתר, בנג'ו",
    "סווינג": "תזמורת גדולה, חצוצרות, סקסופון",
    "פאנק": "גיטרה חשמלית, בס, תופים מהירים",
  };
  return instruments[genre] || "גיטרה, בס, תופים, סינתיסייזר";
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

const DecadeModal = ({ decade, open, onOpenChange }: DecadeModalProps) => {
  const [showAI, setShowAI] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState<{ lyrics: string; structure: string } | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const { toast } = useToast();

  if (!decade) return null;

  const handleGenerate = () => {
    if (!selectedGenre || !keyword.trim()) {
      toast({ title: "נא למלא את כל השדות", variant: "destructive" });
      return;
    }
    setResult(generateSong(selectedGenre, keyword, decade));
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.lyrics + "\n\n" + result.structure);
      toast({ title: "הועתק ללוח! 📋" });
    }
  };

  const handleReset = () => {
    setShowAI(false);
    setSelectedGenre("");
    setKeyword("");
    setResult(null);
    setActiveVideoId(null);
  };

  const handleClose = (val: boolean) => {
    if (!val) handleReset();
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <span className="text-3xl">{decade.icon}</span>
            {decade.name}
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            {decade.historicalNote}
          </DialogDescription>
        </DialogHeader>

        {!showAI ? (
          <div className="space-y-5">
            {/* Genres */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">סגנונות מוזיקליים</h4>
              <div className="flex flex-wrap gap-2">
                {decade.genres.map((genre) => (
                  <span
                    key={genre}
                    className={`px-3 py-1 rounded-full text-sm border ${getGenreColor(genre)}`}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Hits */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">להיטים עיקריים</h4>
              <div className="space-y-2">
                {decade.allHits.map((hit, i) => {
                  const videoId = extractYoutubeId(hit.youtubeUrl);
                  const isActive = activeVideoId === videoId;
                  return (
                    <div key={i} className="space-y-2">
                      <button
                        onClick={() => setActiveVideoId(isActive ? null : videoId)}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-right ${
                          isActive ? "bg-primary/10 border border-primary/30" : "hover:bg-accent/50"
                        }`}
                      >
                        <Music className="w-4 h-4 text-primary shrink-0" />
                        <span className="font-medium">{hit.title}</span>
                        <span className="text-muted-foreground text-sm">— {hit.artist}</span>
                        <span className="mr-auto text-red-400 text-xs flex items-center gap-1">
                          {isActive ? "▶ מנגן" : "▶ נגן"}
                        </span>
                      </button>
                      {isActive && videoId && (
                        <div className="rounded-lg overflow-hidden border border-border">
                          <iframe
                            width="100%"
                            height="250"
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
            </div>

            {/* AI Button */}
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={() => setShowAI(true)}
            >
              <Sparkles className="w-5 h-5" />
              צור שיר חדש ב-AI
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Genre selection */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">בחר סגנון מוזיקלי</h4>
              <div className="flex flex-wrap gap-2">
                {decade.genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      selectedGenre === genre
                        ? "bg-primary text-primary-foreground border-primary"
                        : `${getGenreColor(genre)} hover:opacity-80`
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Keyword */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">מילת מפתח או נושא לשיר</h4>
              <Input
                placeholder="למשל: אהבה, חופש, לילה בעיר..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="text-right"
              />
            </div>

            {/* Generate */}
            <Button className="w-full gap-2" size="lg" onClick={handleGenerate}>
              <Sparkles className="w-5 h-5" />
              צור שיר
            </Button>

            {/* Result */}
            {result && (
              <div className="space-y-4 p-4 rounded-xl bg-accent/30 border border-border">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-foreground">
                  {result.lyrics}
                </pre>
                <div className="border-t border-border pt-3">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-muted-foreground">
                    {result.structure}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
                    <Copy className="w-4 h-4" />
                    העתק
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setResult(null)} className="gap-1.5">
                    <RefreshCw className="w-4 h-4" />
                    צור שיר חדש
                  </Button>
                </div>
              </div>
            )}

            {/* Back */}
            <Button variant="ghost" className="w-full" onClick={() => { setShowAI(false); setResult(null); }}>
              ← חזרה למידע על העשור
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DecadeModal;
