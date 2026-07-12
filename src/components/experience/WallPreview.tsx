import { useRef, useState } from 'react';
import { Upload, Move, ZoomIn } from 'lucide-react';
import { ShapeThumb } from '@/components/shop/ShapeThumb';

interface Props {
  shapeId: string;
  finish: string;
  widthMm: number;
  heightMm: number;
}

// Assume typical wall photo ≈ 2.5m wide. We use a scale slider to calibrate.
export function WallPreview({ shapeId, finish, widthMm, heightMm }: Props) {
  const [wallSrc, setWallSrc] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 50, y: 45 });
  const [scale, setScale] = useState(1);
  const [wallWidthCm, setWallWidthCm] = useState(250);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleFile = (f: File) => {
    const url = URL.createObjectURL(f);
    setWallSrc(url);
  };

  // Pixel size of the piece relative to container, given wall calibration
  const pieceWidthPct = ((widthMm / 10) / wallWidthCm) * 100 * scale;
  const pieceHeightPct = ((heightMm / 10) / wallWidthCm) * 100 * scale;

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };
  const onPointerUp = () => { dragging.current = false; };

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-oxblood/20 bg-ivory-warm/40"
        onPointerMove={onPointerMove}
      >
        {wallSrc ? (
          <img src={wallSrc} alt="Your wall" className="absolute inset-0 w-full h-full object-cover select-none" draggable={false} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-3 p-8">
            <div className="w-16 h-16 rounded-full bg-oxblood/10 flex items-center justify-center">
              <Upload className="w-7 h-7 text-oxblood" />
            </div>
            <p className="font-display text-2xl">See it on your wall</p>
            <p className="text-sm text-muted-foreground max-w-xs">Upload a photo of the space. We'll overlay this piece at its true scale.</p>
            <label className="mt-2 inline-flex items-center gap-2 bg-oxblood text-ivory px-5 py-2.5 rounded-full cursor-pointer hover:bg-oxblood-deep transition">
              <Upload className="w-4 h-4" /> Upload wall photo
              <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </label>
          </div>
        )}

        {wallSrc && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-move select-none"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: `${pieceWidthPct}%`, height: `${pieceHeightPct}%`, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.35))' }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <ShapeThumb shapeId={shapeId} finish={finish} className="w-full h-full pointer-events-none" />
          </div>
        )}
      </div>

      {wallSrc && (
        <div className="grid sm:grid-cols-3 gap-4 p-4 border border-oxblood/15 rounded-lg bg-card/50">
          <label className="text-xs uppercase tracking-widest text-muted-foreground flex flex-col gap-2">
            <span className="flex items-center gap-1.5"><ZoomIn className="w-3 h-3" /> Piece scale · {(scale * 100).toFixed(0)}%</span>
            <input type="range" min={0.4} max={2} step={0.05} value={scale} onChange={e => setScale(+e.target.value)} className="accent-oxblood" />
          </label>
          <label className="text-xs uppercase tracking-widest text-muted-foreground flex flex-col gap-2">
            <span>Wall width in photo · {wallWidthCm} cm</span>
            <input type="range" min={100} max={500} step={10} value={wallWidthCm} onChange={e => setWallWidthCm(+e.target.value)} className="accent-oxblood" />
          </label>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Move className="w-3 h-3" /> Drag the piece to reposition
          </div>
          <button onClick={() => { setWallSrc(null); setPos({ x: 50, y: 45 }); setScale(1); }} className="sm:col-span-3 text-xs text-oxblood underline hover:no-underline">Upload a different photo</button>
        </div>
      )}
    </div>
  );
}
