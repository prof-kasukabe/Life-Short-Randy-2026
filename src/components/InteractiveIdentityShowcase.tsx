import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Share2, 
  Box, 
  RotateCcw, 
  Play, 
  Pause, 
  Sparkles, 
  Layers, 
  Code2, 
  Cpu, 
  ExternalLink,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Mode = 'network' | 'geometry3d' | 'terminal';

interface NodeItem {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  description: string;
  tech: string[];
  metrics: string;
}

interface CommandHistory {
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export function InteractiveIdentityShowcase() {
  const [mode, setMode] = useState<Mode>('network');
  const [isPlaying, setIsPlaying] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<NodeItem | null>(null);
  const [geometryShape, setGeometryShape] = useState<'icosahedron' | 'cube' | 'torus'>('icosahedron');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<CommandHistory[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Nodes for Network Graph mode
  const nodesRef = useRef<NodeItem[]>([
    {
      id: 'core',
      name: 'RANDY ARDIANSYAH',
      category: 'IDENTITY',
      x: 0.5,
      y: 0.5,
      vx: 0,
      vy: 0,
      radius: 28,
      color: '#E84634',
      description: 'Software Engineer & Digital Realist • Architecting modern full-stack systems and reactive web apps.',
      tech: ['TypeScript', 'Architecture', 'System Design', 'AI Workflow'],
      metrics: 'Status: ACTIVE • Uptime: 99.98% • Latency: 12ms'
    },
    {
      id: 'frontend',
      name: 'Frontend Systems',
      category: 'ENGINEERING',
      x: 0.22,
      y: 0.28,
      vx: 0.0003,
      vy: -0.0002,
      radius: 18,
      color: '#E84634',
      description: 'Modern reactive web interfaces with micro-interactions, canvas shaders, and editorial typography.',
      tech: ['React 19', 'Vite', 'TailwindCSS', 'WebGL / Canvas', 'PWA'],
      metrics: 'FPS: 60 • Bundle: Optimized • Hydration: Instant'
    },
    {
      id: 'backend',
      name: 'Distributed Backend',
      category: 'SERVICES',
      x: 0.78,
      y: 0.26,
      vx: -0.0002,
      vy: 0.0003,
      radius: 20,
      color: '#E84634',
      description: 'High-throughput microservices, real-time WebSockets, REST/GraphQL APIs, and resilient data layers.',
      tech: ['Node.js', 'Go', 'Express', 'Cloud Functions', 'REST / GraphQL'],
      metrics: 'Throughput: 12k req/s • Zero-Downtime • Graceful Fallback'
    },
    {
      id: 'cloud',
      name: 'Cloud & Database',
      category: 'INFRASTRUCTURE',
      x: 0.8,
      y: 0.72,
      vx: -0.0002,
      vy: -0.0002,
      radius: 17,
      color: '#E84634',
      description: 'Relational & NoSQL database modeling, Firestore synchronization, multi-region container orchestration.',
      tech: ['Firestore', 'PostgreSQL', 'GCP', 'Docker', 'Redis Cache'],
      metrics: 'Replication: Multi-Region • Durability: 99.999%'
    },
    {
      id: 'ai',
      name: 'AI & Intelligence',
      category: 'INNOVATION',
      x: 0.22,
      y: 0.74,
      vx: 0.0003,
      vy: 0.0002,
      radius: 19,
      color: '#E84634',
      description: 'Vibe coding acceleration, Gemini API orchestration, agentic pipelines, and neural text/vision integration.',
      tech: ['Gemini 2.5', 'LLM Agents', 'Vector Search', 'Prompt Engineering'],
      metrics: 'Tokens: Streaming • Context: 1M • Zero Hallucination Guard'
    },
    {
      id: 'philosophy',
      name: 'The Late 20s',
      category: 'PHILOSOPHY',
      x: 0.5,
      y: 0.82,
      vx: 0.0001,
      vy: -0.0001,
      radius: 16,
      color: '#E84634',
      description: 'Embracing discomfort, deep focus over superficial hype, crafting timeless and reliable software artifacts.',
      tech: ['Discipline', 'Continuous Learning', 'Digital Realism', 'Craft'],
      metrics: 'Mindset: Grounded • Focus: High Impact'
    }
  ]);

  const draggedNodeRef = useRef<NodeItem | null>(null);

  // Initialize terminal welcome output
  useEffect(() => {
    setTerminalHistory([
      {
        command: 'system:init --target=late20s-workspace',
        timestamp: '10:00:01',
        output: (
          <div className="space-y-1 text-xs">
            <pre className="font-mono text-[#E84634] leading-tight select-none">
{`  ____                 _         ___     _ _ _       _ 
 |  _ \\ __ _ _ __   __| |_   _  |_ _|___| (_) |_   _(_)
 | |_) / _\` | '_ \\ / _\` | | | |  | |/ __| | | __| | | |
 |  _ < (_| | | | | (_| | |_| |  | | (__| | | |_| |_| |
 |_| \\_\\__,_|_| |_|\\__,_|\\__, | |___\\___|_|_|\\__|\\__,_|
                         |___/                         `}
            </pre>
            <p className="text-[#E84634]/90 font-mono font-semibold pt-1">
              [OK] Identity Matrix &amp; Systems Console Initialized.
            </p>
            <p className="text-[#E84634]/70 font-mono text-[11px]">
              Engine: Randy Ardiansyah • Digital Realist • Status: READY
            </p>
            <p className="text-[#E84634]/70 font-mono text-[11px]">
              Type <span className="text-[#E84634] font-bold underline">help</span> or click quick pills below to explore commands.
            </p>
          </div>
        )
      }
    ]);
  }, []);

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory]);

  // Canvas render loop for Network & 3D Geometry
  useEffect(() => {
    if (mode === 'terminal') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let rotationX = 0.4;
    let rotationY = 0.6;
    let rotationSpeed = 0.008;
    let pulseAngle = 0;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 3D Geometry definitions
    const getGeometryVertices = () => {
      if (geometryShape === 'cube') {
        const s = 100;
        return [
          [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
          [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
        ];
      } else if (geometryShape === 'torus') {
        const verts: [number, number, number][] = [];
        const R = 110;
        const r = 40;
        const segs = 16;
        for (let i = 0; i < segs; i++) {
          const u = (i / segs) * Math.PI * 2;
          for (let j = 0; j < 8; j++) {
            const v = (j / 8) * Math.PI * 2;
            const x = (R + r * Math.cos(v)) * Math.cos(u);
            const y = (R + r * Math.cos(v)) * Math.sin(u);
            const z = r * Math.sin(v);
            verts.push([x, y, z]);
          }
        }
        return verts;
      } else {
        // Icosahedron
        const phi = (1 + Math.sqrt(5)) / 2;
        const scale = 75;
        const raw = [
          [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
          [0, -1,  phi], [0,  1,  phi], [0, -1, -phi], [0,  1, -phi],
          [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
        ];
        return raw.map(([x, y, z]) => [x * scale, y * scale, z * scale] as [number, number, number]);
      }
    };

    const getGeometryEdges = () => {
      if (geometryShape === 'cube') {
        return [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7]
        ];
      } else if (geometryShape === 'torus') {
        const edges: [number, number][] = [];
        const segs = 16;
        for (let i = 0; i < segs; i++) {
          for (let j = 0; j < 8; j++) {
            const idx = i * 8 + j;
            const nextRing = ((i + 1) % segs) * 8 + j;
            const nextTube = i * 8 + ((j + 1) % 8);
            edges.push([idx, nextRing]);
            edges.push([idx, nextTube]);
          }
        }
        return edges;
      } else {
        // Icosahedron edges
        return [
          [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
          [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
          [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
          [4, 9], [9, 8], [8, 6], [6, 2], [2, 4],
          [4, 5], [5, 9], [9, 1], [1, 8], [8, 7],
          [7, 6], [6, 10], [10, 2], [2, 11], [11, 4]
        ];
      }
    };

    // Render Frame Loop
    const render = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const w = canvas.parentElement?.clientWidth || 800;
      const h = canvas.parentElement?.clientHeight || 450;

      ctx.clearRect(0, 0, w, h);

      // Subtle dynamic grid / ambient radar background
      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(232, 70, 52, 0.05)' : 'rgba(232, 70, 52, 0.07)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw subtle dynamic coordinates around canvas corners
      ctx.fillStyle = isDark ? 'rgba(232, 70, 52, 0.3)' : 'rgba(232, 70, 52, 0.35)';
      ctx.font = '10px monospace';
      ctx.fillText(`SYS: RANDY-IDENTITY // MODE: ${mode.toUpperCase()}`, 16, 24);
      ctx.fillText(`POS: ${Math.round(mousePos.x)}, ${Math.round(mousePos.y)}`, w - 110, 24);
      ctx.restore();

      if (mode === 'network') {
        const nodes = nodesRef.current;
        pulseAngle += 0.03;

        // Physics step
        if (isPlaying) {
          nodes.forEach((node, i) => {
            if (draggedNodeRef.current?.id === node.id) return;
            node.x += node.vx;
            node.y += node.vy;

            // Soft wall bounces
            if (node.x < 0.12 || node.x > 0.88) node.vx *= -1;
            if (node.y < 0.16 || node.y > 0.84) node.vy *= -1;

            // Gravitational pull toward center
            const dx = 0.5 - node.x;
            const dy = 0.5 - node.y;
            if (node.id !== 'core') {
              node.vx += dx * 0.00004;
              node.vy += dy * 0.00004;
            }

            // Mouse interaction / deflection
            const mouseCanvasX = mousePos.x;
            const mouseCanvasY = mousePos.y;
            const nodePxX = node.x * w;
            const nodePxY = node.y * h;
            const distMouse = Math.hypot(nodePxX - mouseCanvasX, nodePxY - mouseCanvasY);
            if (distMouse < 100 && distMouse > 1) {
              const repelAngle = Math.atan2(nodePxY - mouseCanvasY, nodePxX - mouseCanvasX);
              const force = (100 - distMouse) / 100 * 0.0008;
              node.vx += Math.cos(repelAngle) * force;
              node.vy += Math.sin(repelAngle) * force;
            }

            // Damping
            node.vx *= 0.99;
            node.vy *= 0.99;
          });
        }

        // Draw connections between nodes
        const coreNode = nodes.find(n => n.id === 'core') || nodes[0];
        const corePxX = coreNode.x * w;
        const corePxY = coreNode.y * h;

        nodes.forEach(node => {
          if (node.id === 'core') return;
          const pxX = node.x * w;
          const pxY = node.y * h;

          const isConnectedHovered = hoveredNode?.id === node.id || hoveredNode?.id === 'core';

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(corePxX, corePxY);
          ctx.lineTo(pxX, pxY);

          if (isConnectedHovered) {
            ctx.strokeStyle = '#E84634';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = '#E84634';
            ctx.shadowBlur = 8;
          } else {
            ctx.strokeStyle = isDark ? 'rgba(232, 70, 52, 0.22)' : 'rgba(232, 70, 52, 0.28)';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([4, 4]);
          }
          ctx.stroke();
          ctx.restore();

          // Data flow pulses along edges
          const pulseOffset = (pulseAngle * 0.5 + node.radius) % 1;
          const pulseX = corePxX + (pxX - corePxX) * pulseOffset;
          const pulseY = corePxY + (pxY - corePxY) * pulseOffset;

          ctx.save();
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#E84634';
          ctx.shadowColor = '#E84634';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.restore();
        });

        // Additional perimeter linkages
        for (let i = 1; i < nodes.length; i++) {
          const next = (i % (nodes.length - 1)) + 1;
          const n1 = nodes[i];
          const n2 = nodes[next];
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(n1.x * w, n1.y * h);
          ctx.lineTo(n2.x * w, n2.y * h);
          ctx.strokeStyle = isDark ? 'rgba(232, 70, 52, 0.12)' : 'rgba(232, 70, 52, 0.16)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }

        // Draw nodes
        nodes.forEach(node => {
          const pxX = node.x * w;
          const pxY = node.y * h;
          const isCore = node.id === 'core';
          const isHovered = hoveredNode?.id === node.id;

          ctx.save();

          // Outer halo / pulse
          if (isCore || isHovered) {
            const pulseScale = 1 + Math.sin(pulseAngle * 2) * 0.12;
            ctx.beginPath();
            ctx.arc(pxX, pxY, (node.radius + 10) * pulseScale, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(232, 70, 52, 0.12)';
            ctx.fill();
          }

          // Node body
          ctx.beginPath();
          ctx.arc(pxX, pxY, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = isCore 
            ? '#E84634' 
            : isDark ? '#2C241B' : '#FDFBF7';
          ctx.fill();

          ctx.lineWidth = isCore ? 3 : 2;
          ctx.strokeStyle = '#E84634';
          if (isHovered) {
            ctx.shadowColor = '#E84634';
            ctx.shadowBlur = 12;
          }
          ctx.stroke();

          // Node inner icon/symbol
          ctx.fillStyle = isCore ? '#FFFFFF' : '#E84634';
          ctx.font = isCore ? 'bold 12px monospace' : '10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(isCore ? 'R' : node.name.charAt(0), pxX, pxY);

          // Node label under node
          ctx.fillStyle = '#E84634';
          ctx.font = isCore ? 'bold 12px sans-serif' : '11px monospace';
          ctx.fillText(node.name, pxX, pxY + node.radius + 15);

          if (isCore) {
            ctx.font = '9px monospace';
            ctx.fillStyle = isDark ? 'rgba(232, 70, 52, 0.7)' : 'rgba(232, 70, 52, 0.8)';
            ctx.fillText('PORTFOLIO NUCLEUS', pxX, pxY + node.radius + 27);
          }

          ctx.restore();
        });
      } else if (mode === 'geometry3d') {
        // 3D Geometry Mode
        if (isPlaying) {
          rotationX += rotationSpeed * 0.7;
          rotationY += rotationSpeed;
        }

        const vertices = getGeometryVertices();
        const edges = getGeometryEdges();
        const cx = w / 2;
        const cy = h / 2;
        const fov = 350;

        // Rotate and project vertices
        const projected = vertices.map(([vx, vy, vz]) => {
          // Rotate around X
          const y1 = vy * Math.cos(rotationX) - vz * Math.sin(rotationX);
          const z1 = vy * Math.sin(rotationX) + vz * Math.cos(rotationX);

          // Rotate around Y
          const x2 = vx * Math.cos(rotationY) + z1 * Math.sin(rotationY);
          const z2 = -vx * Math.sin(rotationY) + z1 * Math.cos(rotationY);

          // Perspective projection
          const distance = 400;
          const factor = fov / (distance + z2);
          const xProj = x2 * factor + cx;
          const yProj = y1 * factor + cy;

          return { x: xProj, y: yProj, z: z2 };
        });

        // Draw edges
        edges.forEach(([i, j]) => {
          const p1 = projected[i];
          const p2 = projected[j];
          if (!p1 || !p2) return;

          const avgZ = (p1.z + p2.z) / 2;
          const alpha = Math.max(0.15, Math.min(0.9, (avgZ + 120) / 240));

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(232, 70, 52, ${alpha})`;
          ctx.lineWidth = avgZ > 0 ? 2 : 1;
          if (avgZ > 30) {
            ctx.shadowColor = '#E84634';
            ctx.shadowBlur = 6;
          }
          ctx.stroke();
          ctx.restore();
        });

        // Draw projected vertex dots
        projected.forEach(p => {
          const radius = Math.max(2, Math.min(5, (p.z + 120) / 45));
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = '#E84634';
          ctx.shadowColor = '#E84634';
          ctx.shadowBlur = 5;
          ctx.fill();
          ctx.restore();
        });

        // Center Brand Identity Badge inside 3D Shape
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = '#E84634';
        ctx.font = 'bold 22px "Instrument Serif", Georgia, serif';
        ctx.fillText('RANDY ARDIANSYAH', cx, cy - 10);

        ctx.font = 'bold 10px monospace';
        ctx.letterSpacing = '2px';
        ctx.fillStyle = isDark ? 'rgba(232, 70, 52, 0.9)' : 'rgba(232, 70, 52, 0.85)';
        ctx.fillText('THE LATE 20S • DIGITAL REALIST', cx, cy + 12);

        ctx.font = '9px monospace';
        ctx.fillText('ENGINEERING & HIGH-IMPACT SYSTEMS', cx, cy + 28);
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [mode, isPlaying, geometryShape, mousePos, hoveredNode]);

  // Handle canvas mouse move for interactive graph
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (draggedNodeRef.current) {
      draggedNodeRef.current.x = Math.max(0.08, Math.min(0.92, x / rect.width));
      draggedNodeRef.current.y = Math.max(0.12, Math.min(0.88, y / rect.height));
      return;
    }

    if (mode === 'network') {
      const found = nodesRef.current.find(n => {
        const nx = n.x * rect.width;
        const ny = n.y * rect.height;
        return Math.hypot(nx - x, ny - y) <= n.radius + 8;
      });
      setHoveredNode(found || null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'network') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clicked = nodesRef.current.find(n => {
      const nx = n.x * rect.width;
      const ny = n.y * rect.height;
      return Math.hypot(nx - x, ny - y) <= n.radius + 10;
    });

    if (clicked) {
      draggedNodeRef.current = clicked;
    }
  };

  const handleMouseUp = () => {
    draggedNodeRef.current = null;
  };

  // Reset node positions
  const handleResetPositions = () => {
    nodesRef.current[0].x = 0.5; nodesRef.current[0].y = 0.5;
    nodesRef.current[1].x = 0.22; nodesRef.current[1].y = 0.28;
    nodesRef.current[2].x = 0.78; nodesRef.current[2].y = 0.26;
    nodesRef.current[3].x = 0.8; nodesRef.current[3].y = 0.72;
    nodesRef.current[4].x = 0.22; nodesRef.current[4].y = 0.74;
    nodesRef.current[5].x = 0.5; nodesRef.current[5].y = 0.82;
    nodesRef.current.forEach(n => { n.vx = (Math.random() - 0.5) * 0.0004; n.vy = (Math.random() - 0.5) * 0.0004; });
  };

  // Terminal command executor
  const handleCommandSubmit = (cmdToRun?: string) => {
    const rawCmd = (cmdToRun !== undefined ? cmdToRun : terminalInput).trim();
    if (!rawCmd) return;

    const cmdLower = rawCmd.toLowerCase();
    const now = new Date().toTimeString().split(' ')[0];
    let outputContent: React.ReactNode = null;

    if (cmdLower === 'help') {
      outputContent = (
        <div className="space-y-1 font-mono text-xs">
          <p className="text-[#E84634] font-bold">Available Commands:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-[11px] text-[#E84634]/90 pt-1">
            <span>• <strong className="text-[#E84634]">whoami</strong> : Bio summary</span>
            <span>• <strong className="text-[#E84634]">skills</strong> : Technical stack</span>
            <span>• <strong className="text-[#E84634]">projects</strong> : IT project status</span>
            <span>• <strong className="text-[#E84634]">architecture</strong> : System design</span>
            <span>• <strong className="text-[#E84634]">stats</strong> : Live telemetry</span>
            <span>• <strong className="text-[#E84634]">clear</strong> : Clear screen</span>
          </div>
        </div>
      );
    } else if (cmdLower === 'whoami') {
      outputContent = (
        <div className="space-y-1.5 font-mono text-xs text-[#E84634]/90">
          <p className="font-bold text-[#E84634]">RANDY ARDIANSYAH</p>
          <p>Role: Software Engineer &amp; Digital Realist</p>
          <p>Focus: Full-Stack Architectures, Distributed APIs, AI Integration &amp; Vibe Coding.</p>
          <p className="italic text-[#E84634]/70">"Diving deeper into the process, embracing the discomfort, and bending fate to create meaningful digital systems."</p>
        </div>
      );
    } else if (cmdLower === 'skills') {
      outputContent = (
        <div className="space-y-1 font-mono text-xs text-[#E84634]">
          <p className="font-bold">Core Engineering Capabilities:</p>
          <div className="space-y-1 text-[11px] text-[#E84634]/85 pt-1">
            <div className="flex justify-between"><span>[Frontend] React 19, TypeScript, Next.js, WebGL</span><span>95%</span></div>
            <div className="w-full bg-[#E84634]/20 h-1.5 rounded-full"><div className="bg-[#E84634] h-1.5 rounded-full w-[95%]"></div></div>
            
            <div className="flex justify-between pt-1"><span>[Backend] Node.js, Express, Go, REST/GraphQL</span><span>92%</span></div>
            <div className="w-full bg-[#E84634]/20 h-1.5 rounded-full"><div className="bg-[#E84634] h-1.5 rounded-full w-[92%]"></div></div>

            <div className="flex justify-between pt-1"><span>[Databases &amp; Cloud] Firestore, PostgreSQL, Docker, GCP</span><span>88%</span></div>
            <div className="w-full bg-[#E84634]/20 h-1.5 rounded-full"><div className="bg-[#E84634] h-1.5 rounded-full w-[88%]"></div></div>

            <div className="flex justify-between pt-1"><span>[AI &amp; Automation] Gemini 2.5, Agents, RAG Pipelines</span><span>90%</span></div>
            <div className="w-full bg-[#E84634]/20 h-1.5 rounded-full"><div className="bg-[#E84634] h-1.5 rounded-full w-[90%]"></div></div>
          </div>
        </div>
      );
    } else if (cmdLower === 'projects') {
      outputContent = (
        <div className="space-y-1.5 font-mono text-xs text-[#E84634]">
          <p className="font-bold">Active &amp; Completed IT Initiatives:</p>
          <div className="space-y-1 text-[11px] text-[#E84634]/85">
            <div className="p-1.5 border border-[#E84634]/30 rounded bg-[#E84634]/5">
              <span className="text-amber-500 font-bold">[IN PROGRESS]</span> <strong>Distributed Real-Time Fleet Telemetry</strong> (Go, WebSockets, TimescaleDB)
            </div>
            <div className="p-1.5 border border-[#E84634]/30 rounded bg-[#E84634]/5">
              <span className="text-amber-500 font-bold">[IN PROGRESS]</span> <strong>Intelligent Code Refactoring Assistant</strong> (Gemini 2.5, AST, TypeScript)
            </div>
            <div className="p-1.5 border border-[#E84634]/30 rounded bg-[#E84634]/5">
              <span className="text-emerald-500 font-bold">[DELIVERED]</span> <strong>Enterprise Micro-Frontend Architecture</strong> (Module Federation, React 19)
            </div>
            <div className="pt-1">
              <Link to="/projects" className="underline font-bold hover:text-white">
                → Open Full Projects Catalog Page (/projects)
              </Link>
            </div>
          </div>
        </div>
      );
    } else if (cmdLower === 'stats' || cmdLower === 'status') {
      outputContent = (
        <div className="font-mono text-xs text-[#E84634] space-y-1">
          <p className="font-bold">System Telemetry &amp; Diagnostics:</p>
          <p className="text-[11px]">• Environment: Production (Web SPA + Firebase Firestore)</p>
          <p className="text-[11px]">• Client Latency: 14ms • Location: Jakarta / Asia-East1</p>
          <p className="text-[11px]">• Frame Rate: 60 FPS • Canvas Engine: Responsive 2D / 3D</p>
          <p className="text-[11px]">• Node Count: {nodesRef.current.length} Active System Nodes</p>
        </div>
      );
    } else if (cmdLower === 'architecture') {
      outputContent = (
        <div className="font-mono text-xs text-[#E84634] space-y-1">
          <p className="font-bold">System Architectural Blueprint:</p>
          <pre className="text-[10px] text-[#E84634]/80 leading-snug">
{`[Client / PWA UI] ---> [Vite + React 19 SSR/SPA Engine]
       |
       +---> [Firebase Auth + Security Rules v2]
       +---> [Cloud Firestore Global DB]
       +---> [Edge Analytics & Gemini API Worker]`}
          </pre>
        </div>
      );
    } else if (cmdLower === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else {
      outputContent = (
        <p className="font-mono text-xs text-red-500">
          Command not recognized: "{rawCmd}". Type <span className="underline font-bold text-[#E84634]">help</span> for valid commands.
        </p>
      );
    }

    setTerminalHistory(prev => [
      ...prev,
      {
        command: rawCmd,
        output: outputContent,
        timestamp: now
      }
    ]);

    setTerminalInput('');
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full rounded-[2rem] overflow-hidden relative shadow-2xl border border-[#E0DACE] dark:border-[#3A332E] bg-[#FDFBF7] dark:bg-[#1E1A18] transition-all duration-300 flex flex-col ${
        isExpanded ? 'aspect-auto min-h-[580px]' : 'aspect-[4/3] sm:aspect-video'
      }`}
    >
      {/* Interactive Top Chrome Bar */}
      <div className="h-12 border-b border-[#E0DACE] dark:border-[#3A332E] bg-white/70 dark:bg-[#25201D]/80 backdrop-blur-md px-4 flex items-center justify-between z-20 shrink-0">
        
        {/* Left: Window Dots & Identity Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/40 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/40 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/40 inline-block"></span>
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#E0DACE] dark:border-[#3A332E] text-xs font-mono font-bold text-[#E84634]">
            <Cpu size={14} className="animate-spin text-[#E84634]" style={{ animationDuration: '8s' }} />
            <span>randy@identity-engine</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E84634]/10 text-[#E84634] font-semibold">
              v2.8-interactive
            </span>
          </div>
        </div>

        {/* Center: Mode Selectors */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#E0DACE]/40 dark:bg-[#141211]/60 border border-[#E0DACE]/60 dark:border-[#3A332E]">
          <button
            onClick={() => setMode('network')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
              mode === 'network'
                ? 'bg-[#E84634] text-white shadow-sm'
                : 'text-[#E84634]/70 hover:text-[#E84634] hover:bg-[#E84634]/10'
            }`}
            title="Interactive Network Graph"
          >
            <Share2 size={13} />
            <span className="hidden md:inline">Graph</span>
          </button>

          <button
            onClick={() => setMode('geometry3d')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
              mode === 'geometry3d'
                ? 'bg-[#E84634] text-white shadow-sm'
                : 'text-[#E84634]/70 hover:text-[#E84634] hover:bg-[#E84634]/10'
            }`}
            title="Kinetic 3D Geometry"
          >
            <Box size={13} />
            <span className="hidden md:inline">3D Wireframe</span>
          </button>

          <button
            onClick={() => setMode('terminal')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
              mode === 'terminal'
                ? 'bg-[#E84634] text-white shadow-sm'
                : 'text-[#E84634]/70 hover:text-[#E84634] hover:bg-[#E84634]/10'
            }`}
            title="Live Interactive CLI Terminal"
          >
            <TerminalIcon size={13} />
            <span className="hidden md:inline">Console</span>
          </button>
        </div>

        {/* Right: Controls & Toggles */}
        <div className="flex items-center gap-1.5">
          {mode !== 'terminal' && (
            <>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg border border-[#E0DACE] dark:border-[#3A332E] text-[#E84634] hover:bg-[#E84634]/10 transition-colors"
                title={isPlaying ? 'Pause Physics' : 'Resume Physics'}
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              </button>

              <button
                onClick={handleResetPositions}
                className="p-1.5 rounded-lg border border-[#E0DACE] dark:border-[#3A332E] text-[#E84634] hover:bg-[#E84634]/10 transition-colors"
                title="Reset Layout"
              >
                <RotateCcw size={13} />
              </button>
            </>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg border border-[#E0DACE] dark:border-[#3A332E] text-[#E84634] hover:bg-[#E84634]/10 transition-colors"
            title={isExpanded ? 'Standard View' : 'Expand Height'}
          >
            {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col">
        {mode !== 'terminal' ? (
          <>
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full h-full cursor-crosshair block"
            />

            {/* Geometry shape quick switcher in 3D mode */}
            {mode === 'geometry3d' && (
              <div className="absolute top-4 left-4 z-10 flex gap-1.5 bg-white/80 dark:bg-[#1E1A18]/80 backdrop-blur-md p-1 rounded-xl border border-[#E0DACE] dark:border-[#3A332E]">
                <button
                  onClick={() => setGeometryShape('icosahedron')}
                  className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg transition-all ${
                    geometryShape === 'icosahedron' ? 'bg-[#E84634] text-white' : 'text-[#E84634] hover:bg-[#E84634]/10'
                  }`}
                >
                  Icosahedron
                </button>
                <button
                  onClick={() => setGeometryShape('cube')}
                  className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg transition-all ${
                    geometryShape === 'cube' ? 'bg-[#E84634] text-white' : 'text-[#E84634] hover:bg-[#E84634]/10'
                  }`}
                >
                  Hypercube
                </button>
                <button
                  onClick={() => setGeometryShape('torus')}
                  className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg transition-all ${
                    geometryShape === 'torus' ? 'bg-[#E84634] text-white' : 'text-[#E84634] hover:bg-[#E84634]/10'
                  }`}
                >
                  Torus Knot
                </button>
              </div>
            )}

            {/* Active Node Info HUD Tooltip (Network Mode) */}
            {mode === 'network' && hoveredNode && (
              <div className="absolute bottom-12 left-4 sm:left-6 max-w-sm p-3.5 rounded-2xl bg-white/95 dark:bg-[#1E1A18]/95 backdrop-blur-md border border-[#E84634]/40 shadow-xl pointer-events-none z-10 transition-all animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E84634]">
                    {hoveredNode.category}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <h4 className="text-sm font-bold text-[#E84634] leading-tight mb-1">
                  {hoveredNode.name}
                </h4>
                <p className="text-xs text-[#E84634]/80 leading-relaxed mb-2 font-light">
                  {hoveredNode.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {hoveredNode.tech.map((t, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E84634]/10 text-[#E84634] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] font-mono text-[#E84634]/60 border-t border-[#E84634]/20 pt-1.5">
                  {hoveredNode.metrics}
                </p>
              </div>
            )}

            {/* Interactive hint badge */}
            <div className="absolute bottom-3 right-4 pointer-events-none hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-[#E84634]/70 bg-white/60 dark:bg-[#1E1A18]/60 px-3 py-1 rounded-full border border-[#E0DACE] dark:border-[#3A332E]">
              <Sparkles size={12} className="text-[#E84634]" />
              <span>{mode === 'network' ? 'Geser & klik node untuk interaksi physics' : 'Drag mouse untuk rotasi 3D'}</span>
            </div>
          </>
        ) : (
          /* Terminal Interactive CLI Mode */
          <div className="flex-1 flex flex-col p-4 sm:p-6 font-mono overflow-hidden bg-[#FDFBF7] dark:bg-[#141211]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 select-text">
              {terminalHistory.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#E84634]/80">
                    <span className="text-[#E84634] font-bold">randy@late20s:~$</span>
                    <span className="font-semibold text-[#E84634]">{item.command}</span>
                    <span className="text-[10px] text-[#E84634]/50 ml-auto">{item.timestamp}</span>
                  </div>
                  <div className="pl-4 border-l-2 border-[#E84634]/30 py-1">
                    {item.output}
                  </div>
                </div>
              ))}
              <div ref={terminalBottomRef} />
            </div>

            {/* Quick Command Action Chips */}
            <div className="pt-3 pb-2 border-t border-[#E0DACE] dark:border-[#3A332E] flex flex-wrap gap-1.5">
              <span className="text-[10px] text-[#E84634]/60 self-center mr-1">Quick:</span>
              {['whoami', 'skills', 'projects', 'architecture', 'stats', 'help', 'clear'].map(cmd => (
                <button
                  key={cmd}
                  onClick={() => handleCommandSubmit(cmd)}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-[#E84634]/10 hover:bg-[#E84634] text-[#E84634] hover:text-white font-mono font-semibold transition-all border border-[#E84634]/20"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Terminal Input Line */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleCommandSubmit();
              }}
              className="flex items-center gap-2 pt-2 border-t border-[#E0DACE] dark:border-[#3A332E]"
            >
              <span className="text-xs font-bold text-[#E84634]">randy@late20s:~$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Ketik command (contoh: skills, projects, whoami)..."
                className="flex-1 bg-transparent border-none outline-none text-xs text-[#E84634] placeholder-[#E84634]/40 font-mono"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1 bg-[#E84634] text-white rounded text-xs font-mono font-bold hover:opacity-90"
              >
                RUN
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Telemetry Status Strip */}
      <div className="h-8 border-t border-[#E0DACE] dark:border-[#3A332E] bg-white/80 dark:bg-[#1E1A18]/90 backdrop-blur-md px-4 flex items-center justify-between text-[10px] font-mono text-[#E84634]/75 shrink-0">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-bold text-[#E84634]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            SYSTEM OPERATIONAL
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">STACK: REACT 19 + TYPESCRIPT + FIREBASE</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline">INSPECTOR: ACTIVE</span>
          <Link 
            to="/projects" 
            className="flex items-center gap-1 text-[#E84634] font-bold hover:underline"
          >
            <span>PROYEK TI</span>
            <ExternalLink size={10} />
          </Link>
        </div>
      </div>
    </div>
  );
}
