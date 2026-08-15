import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Upload, Download, RefreshCw, Image as ImageIcon } from 'lucide-react';

type DitherAlgorithm = 'atkinson' | 'floyd' | 'threshold';

export function DitherTool() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [algorithm, setAlgorithm] = useState<DitherAlgorithm>('atkinson');
  const [threshold, setThreshold] = useState(128);
  const [contrast, setContrast] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImage(img);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const processImage = () => {
    if (!image || !canvasRef.current) return;
    setIsProcessing(true);

    // Use a small timeout to allow UI to show processing state if needed
    setTimeout(() => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // Set canvas dimensions
      // For performance, we might want to cap the max resolution
      const MAX_WIDTH = 1200;
      let width = image.width;
      let height = image.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw original scaled image
      ctx.drawImage(image, 0, 0, width, height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;

      // Apply contrast and grayscale
      for (let i = 0; i < pixels.length; i += 4) {
        // Contrast
        const r = ((pixels[i] / 255 - 0.5) * contrast + 0.5) * 255;
        const g = ((pixels[i + 1] / 255 - 0.5) * contrast + 0.5) * 255;
        const b = ((pixels[i + 2] / 255 - 0.5) * contrast + 0.5) * 255;

        // Grayscale (luminance)
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        
        pixels[i] = gray;
        pixels[i + 1] = gray;
        pixels[i + 2] = gray;
      }

      // Dithering algorithms
      if (algorithm === 'threshold') {
        for (let i = 0; i < pixels.length; i += 4) {
          const val = pixels[i] < threshold ? 0 : 255;
          pixels[i] = val;
          pixels[i + 1] = val;
          pixels[i + 2] = val;
        }
      } else if (algorithm === 'atkinson') {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const oldVal = pixels[idx];
            const newVal = oldVal < threshold ? 0 : 255;
            const err = Math.floor((oldVal - newVal) / 8);

            pixels[idx] = newVal;
            pixels[idx + 1] = newVal;
            pixels[idx + 2] = newVal;

            const adj = [[1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [0, 2]];
            for (const [dx, dy] of adj) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nIdx = (ny * width + nx) * 4;
                pixels[nIdx] += err;
                pixels[nIdx + 1] += err;
                pixels[nIdx + 2] += err;
              }
            }
          }
        }
      } else if (algorithm === 'floyd') {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const oldVal = pixels[idx];
            const newVal = oldVal < threshold ? 0 : 255;
            const err = oldVal - newVal;

            pixels[idx] = newVal;
            pixels[idx + 1] = newVal;
            pixels[idx + 2] = newVal;

            if (x + 1 < width) pixels[idx + 4] += (err * 7) / 16;
            if (y + 1 < height) {
              if (x - 1 >= 0) pixels[idx + width * 4 - 4] += (err * 3) / 16;
              pixels[idx + width * 4] += (err * 5) / 16;
              if (x + 1 < width) pixels[idx + width * 4 + 4] += (err * 1) / 16;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setIsProcessing(false);
    }, 10);
  };

  useEffect(() => {
    if (image) {
      processImage();
    }
  }, [image, algorithm, threshold, contrast]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `dithered-${algorithm}-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="pt-32 pb-32 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
      <Helmet>
        <title>Dither Tool - Randy</title>
        <meta name="description" content="A visual creative coding tool for 1-bit image dithering." />
      </Helmet>

      <div className="mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-[#E07A5F] dark:text-[#E07A5F] mb-4 block">Visual Creative Coding</span>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif-display tracking-tight mb-6 text-[#2C241B] dark:text-[#FDFBF7] leading-tight flex items-center gap-4">
          Dither Tool
        </h1>
        <p className="text-xl text-[#4A3F35] dark:text-[#E8E2D9] font-light max-w-2xl leading-relaxed">
          Convert your images into pure 1-bit black and white using classic computer graphics algorithms like Atkinson and Floyd-Steinberg.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-8 bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-500 dark:text-zinc-400 mb-4">Algorithm</h3>
            <div className="space-y-2">
              {[
                { id: 'atkinson', label: 'Atkinson (Macintosh)' },
                { id: 'floyd', label: 'Floyd-Steinberg' },
                { id: 'threshold', label: 'Hard Threshold' },
              ].map((algo) => (
                <button
                  key={algo.id}
                  onClick={() => setAlgorithm(algo.id as DitherAlgorithm)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
                    algorithm === algo.id
                      ? 'bg-[#E07A5F] text-[#FDFBF7] font-medium'
                      : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  }`}
                >
                  {algo.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-500 dark:text-zinc-400">Threshold</h3>
              <span className="text-xs text-zinc-400 font-mono">{threshold}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-[#E07A5F]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-500 dark:text-zinc-400">Contrast</h3>
              <span className="text-xs text-zinc-400 font-mono">{contrast.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full accent-[#E07A5F]"
            />
          </div>

          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              <Upload size={16} /> Select Image
            </button>
            <button
              onClick={handleDownload}
              disabled={!image}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                image
                  ? 'bg-[#2C241B] dark:bg-[#FDFBF7] text-[#FDFBF7] dark:text-[#2C241B] hover:bg-zinc-800 dark:hover:bg-zinc-200'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
              }`}
            >
              <Download size={16} /> Download Result
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 min-h-[400px] lg:min-h-[600px] overflow-hidden relative group">
          {!image && (
            <div className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <ImageIcon size={48} className="mb-4 opacity-50" />
              <p className="text-sm font-medium">Click or drag image to start</p>
            </div>
          )}
          
          <canvas
            ref={canvasRef}
            className={`max-w-full max-h-[800px] object-contain transition-opacity duration-300 ${isProcessing ? 'opacity-50' : 'opacity-100'} ${image ? 'block' : 'hidden'}`}
            style={{ imageRendering: 'pixelated' }}
          />

          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/20 dark:bg-black/20 backdrop-blur-sm">
              <RefreshCw className="animate-spin text-[#E07A5F]" size={32} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
