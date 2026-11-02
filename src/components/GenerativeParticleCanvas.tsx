import React, { useEffect, useRef, useState } from 'react';

type GenerativePattern = 'constellation' | 'flow' | 'lattice';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
  speed: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export function GenerativeParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pattern, setPattern] = useState<GenerativePattern>('constellation');
  const patternRef = useRef<GenerativePattern>('constellation');

  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let ripples: Ripple[] = [];
    let time = 0;

    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      vx: 0,
      vy: 0,
      isActive: false,
    };

    const initParticles = (w: number, h: number) => {
      const area = w * h;
      const count = Math.min(180, Math.max(75, Math.floor(area / 4800)));
      const nextParticles: Particle[] = [];

      const cols = Math.ceil(Math.sqrt(count * (w / Math.max(h, 1))));
      const rows = Math.ceil(count / cols);
      const cellW = w / cols;
      const cellH = h / rows;

      for (let i = 0; i < count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const originX = (col + 0.5) * cellW;
        const originY = (row + 0.5) * cellH;
        const x = originX + (Math.random() - 0.5) * cellW * 0.8;
        const y = originY + (Math.random() - 0.5) * cellH * 0.8;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.25 + Math.random() * 0.55;

        nextParticles.push({
          x,
          y,
          originX,
          originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.4 + Math.random() * 2.2,
          alpha: 0.35 + Math.random() * 0.55,
          phase: Math.random() * Math.PI * 2,
          speed,
        });
      }

      particles = nextParticles;
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nextX = e.clientX - rect.left;
      const nextY = e.clientY - rect.top;
      if (mouse.isActive) {
        mouse.vx = nextX - mouse.targetX;
        mouse.vy = nextY - mouse.targetY;
      }
      mouse.targetX = nextX;
      mouse.targetY = nextY;
      mouse.isActive = true;
    };

    const onPointerLeave = () => {
      mouse.isActive = false;
    };

    const onPointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      ripples.push({
        x: clickX,
        y: clickY,
        radius: 4,
        maxRadius: Math.max(width, height) * 0.45,
        alpha: 0.65,
      });

      particles.forEach((p) => {
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.hypot(dx, dy);
        if (dist < 220 && dist > 0.001) {
          const force = ((220 - dist) / 220) * 4.2;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      });
    };

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('pointerdown', onPointerDown);

    // Smooth pseudo-noise flow angle
    const getFlowAngle = (x: number, y: number, t: number) => {
      const scale = 0.0045;
      return (
        Math.sin(x * scale + t * 0.7) * Math.cos(y * scale - t * 0.5) * Math.PI * 2 +
        Math.cos((x + y) * scale * 0.6 + t * 0.4) * Math.PI
      );
    };

    const render = () => {
      time += 0.012;
      const currentPattern = patternRef.current;
      const isDark = document.documentElement.classList.contains('dark');

      // Smooth cursor interpolation
      if (mouse.isActive) {
        mouse.x += (mouse.targetX - mouse.x) * 0.18;
        mouse.y += (mouse.targetY - mouse.y) * 0.18;
      } else {
        mouse.x += (-9999 - mouse.x) * 0.05;
        mouse.y += (-9999 - mouse.y) * 0.05;
      }
      mouse.vx *= 0.9;
      mouse.vy *= 0.9;

      ctx.clearRect(0, 0, width, height);

      // Subtle architectural background grid dots
      ctx.fillStyle = isDark ? 'rgba(232, 70, 52, 0.08)' : 'rgba(232, 70, 52, 0.1)';
      const gridStep = 44;
      for (let gx = gridStep / 2; gx < width; gx += gridStep) {
        for (let gy = gridStep / 2; gy < height; gy += gridStep) {
          ctx.fillRect(gx, gy, 1, 1);
        }
      }

      // Draw & update click ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 4.5;
        r.alpha *= 0.96;

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(232, 70, 52, ${r.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();

        if (r.radius >= r.maxRadius || r.alpha < 0.02) {
          ripples.splice(i, 1);
        }
      }

      // Update particle kinematics
      const interactionRadius = Math.min(width, height) * 0.34;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (currentPattern === 'constellation') {
          // Gentle organic drift
          p.vx += Math.cos(time + p.phase) * 0.008;
          p.vy += Math.sin(time + p.phase) * 0.008;

          // Clamp velocity
          const speed = Math.hypot(p.vx, p.vy);
          const maxSpeed = p.speed * 1.8;
          if (speed > maxSpeed) {
            p.vx = (p.vx / speed) * maxSpeed;
            p.vy = (p.vy / speed) * maxSpeed;
          }
        } else if (currentPattern === 'flow') {
          // Vector flow field currents
          const angle = getFlowAngle(p.x, p.y, time);
          p.vx += Math.cos(angle) * 0.08;
          p.vy += Math.sin(angle) * 0.08;
          p.vx *= 0.92;
          p.vy *= 0.92;
        } else if (currentPattern === 'lattice') {
          // Harmonic spring return to architectural grid + wave modulation
          const waveX = Math.sin(time * 1.8 + p.originY * 0.02) * 14;
          const waveY = Math.cos(time * 1.8 + p.originX * 0.02) * 14;
          const targetX = p.originX + waveX;
          const targetY = p.originY + waveY;
          p.vx += (targetX - p.x) * 0.045;
          p.vy += (targetY - p.y) * 0.045;
          p.vx *= 0.84;
          p.vy *= 0.84;
        }

        // Cursor field reactivity (swirl + magnetic deflection)
        if (mouse.isActive) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < interactionRadius && dist > 0.001) {
            const norm = 1 - dist / interactionRadius;
            const nx = dx / dist;
            const ny = dy / dist;

            // Tangential orbital swirl + gentle repulsion core
            const swirlStrength = norm * 0.42;
            const repelStrength = dist < interactionRadius * 0.45 ? norm * 0.65 : -norm * 0.15;

            p.vx += nx * repelStrength - ny * swirlStrength + mouse.vx * norm * 0.015;
            p.vy += ny * repelStrength + nx * swirlStrength + mouse.vy * norm * 0.015;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Toroidal wrap for constellation and flow modes
        if (currentPattern !== 'lattice') {
          const margin = 20;
          if (p.x < -margin) p.x = width + margin;
          if (p.x > width + margin) p.x = -margin;
          if (p.y < -margin) p.y = height + margin;
          if (p.y > height + margin) p.y = -margin;
        }
      }

      // Draw connections between nearby particles
      const connectionDist = currentPattern === 'flow' ? 78 : 115;

      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Connect to cursor if within range
        if (mouse.isActive) {
          const mdx = p1.x - mouse.x;
          const mdy = p1.y - mouse.y;
          const mDist = Math.hypot(mdx, mdy);
          if (mDist < interactionRadius * 0.85) {
            const mAlpha = (1 - mDist / (interactionRadius * 0.85)) * 0.45;
            ctx.strokeStyle = `rgba(232, 70, 52, ${mAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          if (Math.abs(dx) > connectionDist || Math.abs(dy) > connectionDist) continue;

          const dist = Math.hypot(dx, dy);
          if (dist < connectionDist) {
            const lineAlpha = (1 - dist / connectionDist) * (isDark ? 0.28 : 0.32);
            ctx.strokeStyle = `rgba(232, 70, 52, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles and velocity vectors
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        let proximityBoost = 0;
        if (mouse.isActive) {
          const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (d < interactionRadius) {
            proximityBoost = (1 - d / interactionRadius) * 0.55;
          }
        }

        const finalAlpha = Math.min(1, p.alpha + proximityBoost);
        const radius = p.size + proximityBoost * 1.8;

        if (currentPattern === 'flow') {
          // Draw short directional vector tail in flow mode
          ctx.strokeStyle = `rgba(232, 70, 52, ${finalAlpha * 0.55})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 6, p.y - p.vy * 6);
          ctx.stroke();
        }

        ctx.fillStyle = `rgba(232, 70, 52, ${finalAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Subtle cursor focal ring
      if (mouse.isActive) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 18, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(232, 70, 52, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#E84634';
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return (
    <div className="w-full aspect-[4/3] sm:aspect-[21/9] rounded-[2rem] overflow-hidden relative shadow-xl border border-[#E0DACE]/80 dark:border-[#3A332E]/80 bg-[#FDFBF7] dark:bg-[#1E1A18] group select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair touch-none"
        aria-label="Interactive generative particle system representing interconnected software systems and creative engineering"
      />

      {/* Minimalist Pattern Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 flex items-center gap-1 p-1 rounded-full bg-[#FDFBF7]/85 dark:bg-[#1E1A18]/85 backdrop-blur-md border border-[#E0DACE] dark:border-[#3A332E] shadow-sm">
        {(['constellation', 'flow', 'lattice'] as GenerativePattern[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setPattern(mode)}
            className={`px-3.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all ${
              pattern === mode
                ? 'bg-[#E84634] text-white font-semibold'
                : 'text-[#E84634]/75 hover:text-[#E84634]'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Subtle Interactive Hint */}
      <div className="hidden sm:block absolute bottom-5 right-6 pointer-events-none text-[11px] font-mono uppercase tracking-widest text-[#E84634]/60">
        Move cursor or click to perturb field
      </div>
    </div>
  );
}
