import React, { useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sparkles, RefreshCw, Code2 } from 'lucide-react';

export function CreativeScratch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 600;
      const isDark = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? '#1E1A18' : '#FDFBF7';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const numParticles = 4000;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0,
      vy: 0,
      size: Math.random() * 1.5 + 0.5,
      mass: Math.random() * 0.5 + 0.5
    }));

    const draw = () => {
      const isDark = document.documentElement.classList.contains('dark');
      
      // Motion blur effect
      ctx.fillStyle = isDark ? 'rgba(30, 26, 24, 0.15)' : 'rgba(253, 251, 247, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Sand Color
      ctx.fillStyle = isDark ? 'rgba(232, 70, 52, 0.8)' : 'rgba(232, 70, 52, 0.6)';
      
      // The wave front travels across the screen
      const waveX = (time * 250) % (canvas.width + 800) - 400;

      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];
        const distFromWave = p.x - waveX;

        let forceX = 0.2; // Ambient wind pushing right
        let forceY = 0.5; // Base gravity

        // Wave crest physics
        if (distFromWave > 0 && distFromWave < 250) {
          // Sucked backward and lifted into the approaching crest
          const intensity = 1 - (distFromWave / 250);
          forceX -= intensity * 4.0;
          forceY -= intensity * 6.0;
        } else if (distFromWave <= 0 && distFromWave > -300) {
          // Surging forward and crashing down violently
          const intensity = 1 - (Math.abs(distFromWave) / 300);
          forceX += intensity * 10.0;
          forceY += intensity * 4.0;
        }

        // Mathematical turbulence (Perlin-like noise using trig)
        const noise = Math.sin(p.x * 0.02 + time) * Math.cos(p.y * 0.02 - time);
        forceX += noise * 2.0;
        forceY += noise * 0.5;

        // Apply forces
        p.vx += forceX * p.mass * 0.1;
        p.vy += forceY * p.mass * 0.1;

        // Friction / Air Resistance
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;

        // Draw particle (sand grain)
        ctx.fillRect(p.x, p.y, p.size, p.size);

        // Respawn if out of bounds to maintain particle density
        if (p.y > canvas.height + 50 || p.x > canvas.width + 50 || p.y < -200 || p.x < -400) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.vx = 0;
          p.vy = 0;
        }
      }

      time += 0.016; 
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const algorithmCode = `// Sand Tsunami Particle Simulation
// Over 4,000 individual sand grains reacting to a dynamic mathematical wave front.

const draw = () => {
  // Apply motion blur trail background
  ctx.fillStyle = isDark ? 'rgba(30,26,24, 0.15)' : 'rgba(253,251,247, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(232, 70, 52, 0.8)'; // Signature Sand Color

  // Calculate sweeping wave front position
  const waveX = (time * 250) % (canvas.width + 800) - 400;

  for (let i = 0; i < numParticles; i++) {
    const p = particles[i];
    const distFromWave = p.x - waveX;

    let forceX = 0.2; // Ambient wind
    let forceY = 0.5; // Gravity

    // Wave vortex mechanics
    if (distFromWave > 0 && distFromWave < 250) {
      // Sucked backward and lifted into the approaching crest
      const intensity = 1 - (distFromWave / 250);
      forceX -= intensity * 4.0;
      forceY -= intensity * 6.0;
    } else if (distFromWave <= 0 && distFromWave > -300) {
      // Surging forward and crashing down heavily
      const intensity = 1 - (Math.abs(distFromWave) / 300);
      forceX += intensity * 10.0;
      forceY += intensity * 4.0;
    }

    // Apply mathematical turbulence & forces
    const noise = Math.sin(p.x * 0.02 + time) * Math.cos(p.y * 0.02 - time);
    p.vx += (forceX + noise * 2.0) * p.mass * 0.1;
    p.vy += (forceY + noise * 0.5) * p.mass * 0.1;

    // Apply friction and update positions
    p.vx *= 0.92;
    p.vy *= 0.92;
    p.x += p.vx;
    p.y += p.vy;

    ctx.fillRect(p.x, p.y, p.size, p.size);
    
    // Respawn if out of bounds to maintain density
    if (outOfBounds(p)) respawn(p);
  }
  
  time += 0.016;
  requestAnimationFrame(draw);
};`;

  return (
    <div className="pt-24 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Visual Creative Scratch - Randy</title>
        <meta name="description" content="A visual creative coding scratchpad by warenbergg1995." />
      </Helmet>

      <div className="max-w-3xl mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-[#E84634] mb-4 flex items-center gap-2">
          <Sparkles size={14} /> Creative Scratchpad
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif-display font-bold tracking-tight mb-6 text-[#E84634]">
          Visual Sandbox
        </h1>
        <p className="text-lg text-[#E84634]/80 leading-relaxed font-medium">
          An experimental canvas for visual ideas and generative sketches exploring the intersection of math, code, and design.
          <br className="hidden sm:block mt-2" />
          <span className="text-[#E84634] font-serif-display italic tracking-wide text-xl mt-4 block">Curated & Crafted by warenbergg1995</span>
        </p>
      </div>

      <div className="bg-[#E0DACE]/30 dark:bg-[#3A332E]/30 p-4 sm:p-8 rounded-[2rem] shadow-sm">
        <div className="flex justify-between items-center mb-6 px-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#E84634] flex items-center gap-2">
            <Code2 size={16} /> Live Simulation
          </h2>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E84634] hover:opacity-70 transition-opacity bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-full"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>

        <div className="aspect-video w-full relative bg-[#FDFBF7] dark:bg-[#1E1A18] rounded-2xl overflow-hidden border-2 border-[#E0DACE]/50 dark:border-[#3A332E]/50 shadow-inner mb-8">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full block"
          />
        </div>

        <div className="bg-[#FDFBF7] dark:bg-[#1E1A18] rounded-2xl p-6 md:p-8 border-2 border-[#E0DACE]/50 dark:border-[#3A332E]/50">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#E84634] mb-4">The Sand Tsunami</h3>
              <p className="text-[#4A3F35] dark:text-[#E0DACE] text-sm leading-relaxed mb-4">
                This visual sketch utilizes a <strong>Flow-Field Particle Physics</strong> algorithm to simulate a massive "sand tsunami". Over 4,000 independent particles (sand grains) are constantly evaluated against a traveling mathematical wave front.
              </p>
              <p className="text-[#4A3F35] dark:text-[#E0DACE] text-sm leading-relaxed">
                As the invisible crest sweeps across the screen, it generates lift and negative pressure—sucking particles upwards before violently propelling them forward and crashing them down via simulated gravity and trigonometric turbulence.
              </p>
            </div>
            <div className="w-full lg:w-2/3 overflow-x-auto bg-black/5 dark:bg-white/5 p-4 md:p-6 rounded-xl border border-black/5 dark:border-white/5">
              <pre className="text-xs font-mono text-[#4A3F35]/90 dark:text-[#E0DACE]/90 leading-relaxed">
                <code>{algorithmCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
