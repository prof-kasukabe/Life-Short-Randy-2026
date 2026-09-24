import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Code2, Upload, Image as ImageIcon, Camera, Film } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ASCII_CHARS = ['@', '%', '#', '*', '+', '=', '-', ':', '.', ' '];

export function CreativeScratch() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [resolution, setResolution] = useState<number>(100);
  const [isAnimated, setIsAnimated] = useState<boolean>(true);
  const [polaroidDesc, setPolaroidDesc] = useState<string>('My Masterpiece');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const asciiRef = useRef<HTMLPreElement>(null);
  const animationRef = useRef<number>();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        const img = new Image();
        img.onload = () => {
          imgRef.current = img;
          // Trigger re-render to start drawing
          setResolution(prev => prev === 100 ? 101 : 100); 
          setTimeout(() => setResolution(100), 10);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!imgRef.current) {
      if (asciiRef.current) {
        asciiRef.current.innerText = 'Upload an image to see the ASCII magic unfold...\n\n   /\\_/\\\n  ( o.o )\n   > ^ <';
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let startTime = Date.now();

    const renderFrame = () => {
      const img = imgRef.current;
      if (!img) return;

      const width = resolution;
      const scale = width / img.width;
      const fontAspectRatio = 0.55; 
      const height = Math.floor(img.height * scale * fontAspectRatio);

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height).data;
      let ascii = '';
      const time = (Date.now() - startTime) * 0.005;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const offset = (y * width + x) * 4;
          const r = imageData[offset];
          const g = imageData[offset + 1];
          const b = imageData[offset + 2];

          let brightness = (0.299 * r + 0.587 * g + 0.114 * b);
          
          if (isAnimated) {
            // Apply a fluid, dynamic wave effect (GIF movement)
            const noise = Math.sin(x * 0.1 + time) * 12 + Math.cos(y * 0.1 - time * 0.8) * 12;
            brightness = Math.max(0, Math.min(255, brightness + noise));
          }

          const charIndex = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
          ascii += ASCII_CHARS[charIndex];
        }
        ascii += '\n';
      }
      
      // Directly update DOM for high-performance 60FPS animation
      if (asciiRef.current) {
        asciiRef.current.innerText = ascii;
      }

      if (isAnimated) {
        animationRef.current = requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [imageSrc, resolution, isAnimated]);

  const handleDownloadPolaroid = () => {
    if (!asciiRef.current || !imgRef.current) return;
    
    const asciiArt = asciiRef.current.innerText;
    const lines = asciiArt.split('\n');
    if (lines[lines.length - 1] === '') lines.pop(); // Remove trailing empty line
    
    const cols = lines[0].length;
    const rows = lines.length;

    // Define polaroid layout dimensions
    const charWidth = 7;
    const charHeight = 12;
    const padding = 50;
    const bottomPadding = 140;

    const innerWidth = cols * charWidth;
    const innerHeight = rows * charHeight;

    const canvas = document.createElement('canvas');
    canvas.width = innerWidth + padding * 2;
    canvas.height = innerHeight + padding + bottomPadding;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw White Polaroid Border
    ctx.fillStyle = '#FDFBF7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Dark Photo Area
    ctx.fillStyle = '#1E1A18';
    ctx.fillRect(padding - 15, padding - 15, innerWidth + 30, innerHeight + 30);

    // Draw ASCII Characters
    ctx.fillStyle = '#E0DACE'; // Warm off-white text
    ctx.font = `bold ${charHeight}px monospace`;
    ctx.textBaseline = 'top';

    lines.forEach((line, i) => {
      ctx.fillText(line, padding, padding + i * charHeight);
    });

    // Draw Polaroid Description
    ctx.fillStyle = '#4A3F35';
    ctx.font = 'italic 36px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(polaroidDesc || 'A Visual Metamorphosis', canvas.width / 2, canvas.height - (bottomPadding / 2));

    // Trigger Image Download
    const link = document.createElement('a');
    link.download = `ascii-polaroid-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="pt-24 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>ASCII Art Studio - Randy</title>
        <meta name="description" content="A visual creative coding scratchpad turning images into dynamic ASCII art." />
      </Helmet>

      <div className="max-w-3xl mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-[#E84634] mb-4 flex items-center gap-2">
          <Sparkles size={14} /> Creative Scratchpad
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif-display font-bold tracking-tight mb-6 text-[#E84634]">
          ASCII Art Studio
        </h1>
        <p className="text-lg text-[#E84634]/80 leading-relaxed font-medium mb-8">
          Transform your images into a dynamic, living typographic masterpiece. Let the pixels breathe like a GIF, then capture the moment into a customized Polaroid.
        </p>

        {/* Action Controls */}
        <div className="flex flex-col md:flex-row gap-6 w-full bg-[#E0DACE]/30 dark:bg-[#3A332E]/30 p-6 rounded-[2rem] shadow-sm border border-[#E0DACE]/50 dark:border-[#3A332E]/50">
          <div className="flex-1 flex flex-col justify-center gap-3">
            <label className="text-xs font-bold uppercase tracking-widest text-[#E84634]">Polaroid Description</label>
            <input 
              type="text" 
              placeholder="e.g., A masterpiece born from code..." 
              value={polaroidDesc}
              onChange={(e) => setPolaroidDesc(e.target.value)}
              className="bg-white/50 dark:bg-black/20 border-b-2 border-[#E84634]/30 focus:border-[#E84634] px-4 py-2 rounded-t-xl outline-none text-sm transition-colors text-[#4A3F35] dark:text-[#FDFBF7]"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-6">
             <label className="flex items-center gap-2 cursor-pointer group">
               <div className={`w-11 h-6 rounded-full p-1 transition-colors ${isAnimated ? 'bg-[#E84634]' : 'bg-black/20 dark:bg-white/20'}`}>
                 <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isAnimated ? 'translate-x-5' : 'translate-x-0'}`} />
               </div>
               <span className="text-xs font-bold uppercase tracking-widest text-[#E84634] group-hover:opacity-80 transition-opacity flex items-center gap-1">
                 <Film size={14} /> Live GIF Effect
               </span>
             </label>
             
             <button 
              onClick={handleDownloadPolaroid}
              disabled={!imageSrc}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white bg-[#E84634] hover:bg-[#E84634]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-6 py-3 rounded-full shadow-sm"
             >
               <Camera size={14} /> Capture Polaroid
             </button>
          </div>
        </div>
      </div>

      <div className="bg-[#E0DACE]/30 dark:bg-[#3A332E]/30 p-4 sm:p-8 rounded-[2rem] shadow-sm mb-12">
        <div className="flex justify-between items-center mb-6 px-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#E84634] flex items-center gap-2">
            <Code2 size={16} /> Canvas
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full">
              <span className="text-xs font-bold text-[#E84634] uppercase tracking-wider">Density:</span>
              <input 
                type="range" 
                min="50" 
                max="180" 
                value={resolution} 
                onChange={(e) => setResolution(Number(e.target.value))}
                className="w-24 h-1 bg-[#E84634]/30 rounded-lg appearance-none cursor-pointer accent-[#E84634]"
              />
            </div>
            
            <label className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E84634] bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 transition-colors px-4 py-2 rounded-full cursor-pointer shrink-0 border border-[#E84634]/20">
              <Upload size={14} /> Upload Image
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        <div className="w-full relative bg-[#FDFBF7] dark:bg-[#1E1A18] rounded-2xl overflow-hidden border-2 border-[#E0DACE]/50 dark:border-[#3A332E]/50 shadow-inner flex flex-col lg:flex-row min-h-[500px]">
          
          {/* Source Image */}
          <div className="w-full lg:w-1/3 border-b-2 lg:border-b-0 lg:border-r-2 border-[#E0DACE]/50 dark:border-[#3A332E]/50 p-4 flex flex-col bg-black/5 dark:bg-white/5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E84634] mb-4 block">Source</span>
            <div className="flex-1 flex items-center justify-center rounded-xl border border-dashed border-[#E84634]/30 overflow-hidden bg-white/20 dark:bg-black/20 min-h-[250px]">
              {imageSrc ? (
                <img src={imageSrc} alt="Source" className="max-w-full max-h-[300px] object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#E84634]/50">
                  <ImageIcon size={32} />
                  <span className="text-xs uppercase tracking-widest font-bold">No Image</span>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* ASCII Output */}
          <div className="w-full lg:w-2/3 p-4 md:p-8 flex flex-col overflow-hidden bg-[#1E1A18]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E0DACE]">Output Render</span>
            </div>
            <div className="flex-1 overflow-hidden flex items-center justify-center">
              <pre 
                ref={asciiRef}
                className="font-mono text-[#E0DACE] leading-none"
                style={{ 
                  fontSize: '8px', 
                  letterSpacing: '0px',
                  transformOrigin: 'center center',
                  lineHeight: '8px'
                }}
              >
                {/* Content populated by ref */}
              </pre>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
