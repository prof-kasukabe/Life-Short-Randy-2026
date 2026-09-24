import { PortfolioItem, BlogPost, ITProject } from './types';

export const portfolioData: PortfolioItem[] = [
  {
    id: '1',
    title: 'Minimalist E-commerce',
    category: 'Web Design',
    imageUrl: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A clean and intuitive e-commerce platform.'
  },
  {
    id: '2',
    title: 'Fintech Dashboard',
    category: 'UI/UX',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A comprehensive dashboard for financial analytics.'
  },
  {
    id: '3',
    title: 'Brand Identity',
    category: 'Branding',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Modern brand identity for a tech startup.'
  },
  {
    id: '4',
    title: 'Travel App',
    category: 'Mobile App',
    imageUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Mobile application for travel planning.'
  },
  {
    id: '5',
    title: 'Photography Portfolio',
    category: 'Web Design',
    imageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A visual-first portfolio for a photographer.'
  },
  {
    id: '6',
    title: 'Smart Home Interface',
    category: 'UI/UX',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Control panel interface for smart home devices.'
  }
];

export const blogData: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Minimalism in Web Design',
    excerpt: 'Exploring how less can be more when designing user interfaces and experiences.',
    date: 'Oct 12, 2026',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'Understanding Color Theory in UI',
    excerpt: 'A deep dive into how colors affect user psychology and behavior in digital products.',
    date: 'Sep 28, 2026',
    readTime: '7 min read'
  },
  {
    id: '3',
    title: 'Building Accessible React Applications',
    excerpt: 'Practical tips and techniques for making your React apps usable by everyone.',
    date: 'Sep 15, 2026',
    readTime: '6 min read'
  },
  {
    id: '4',
    title: 'The Future of Frontend Development',
    excerpt: 'Predictions and trends shaping the landscape of web development in the coming years.',
    date: 'Aug 30, 2026',
    readTime: '8 min read'
  }
];

export const itProjectsData: ITProject[] = [
  {
    id: 'it-1',
    title: 'OmniFlow AI: Visual Workflow Automation Engine',
    tagline: 'Autonomous visual workflow orchestrator powered by multimodal LLMs and event-driven microservices',
    category: 'AI & Machine Learning',
    status: 'in_progress',
    progressPercentage: 78,
    timeline: 'Jul 2026 - Present',
    techStack: ['React 19', 'TypeScript', 'Python', 'FastAPI', 'Redis', 'Docker', 'Tailwind CSS'],
    description: 'Building an enterprise visual workflow builder allowing engineers to chain multimodal AI models, database queries, and custom webhooks into resilient background pipelines with live execution telemetry and retry heuristics.',
    features: [
      'Interactive drag-and-drop canvas with custom node connectors and real-time execution highlighting',
      'Async worker cluster powered by Celery & Redis with automatic exponential backoff',
      'Zero-latency streaming node inspection using WebSocket protocol',
      'Fine-grained RBAC with audit logging for enterprise pipeline compliance'
    ],
    architectureSummary: 'Microservice architecture separating the React SPA canvas from a containerized Python FastAPI runtime with distributed workers and secure webhook dispatchers.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    githubUrl: 'https://github.com/randyeef/omniflow-ai-engine',
    demoUrl: 'https://demo.omniflow-engine.dev',
    featured: true
  },
  {
    id: 'it-2',
    title: 'Kinetix Cloud: Real-Time IoT Telemetry & Edge Analytics',
    tagline: 'High-throughput time-series visualization platform for distributed edge sensor fleets',
    category: 'Full-Stack',
    status: 'in_progress',
    progressPercentage: 60,
    timeline: 'Aug 2026 - Present',
    techStack: ['Next.js', 'Go (Golang)', 'PostgreSQL', 'TimescaleDB', 'MQTT', 'Docker'],
    description: 'Engineered to ingest, sanitize, and visualize up to 50,000 sensor pulses per second. Features sub-second anomaly detection, dynamic threshold alerting, and offline data buffering for resilient edge connectivity.',
    features: [
      'High-performance Go ingestion gateway handling MQTT & gRPC streams with minimal memory overhead',
      'Continuous aggregate queries powered by TimescaleDB hyper-tables',
      'Custom SVG & WebGL charting components achieving seamless 60 FPS under heavy data loads',
      'Configurable notification webhooks dispatching alerts via Telegram, Discord, and Slack'
    ],
    architectureSummary: 'Edge sensors transmit telemetry via MQTT to an autoscaled Go gateway, batch-persisting into TimescaleDB with WebSocket fan-out to subscribed clients.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    githubUrl: 'https://github.com/randyeef/kinetix-iot-analytics',
    demoUrl: 'https://kinetix-telemetry.dev',
    featured: true
  },
  {
    id: 'it-3',
    title: 'DevPortal: Microservices API Gateway & Developer Hub',
    tagline: 'Centralized API governance, interactive OAS3 documentation, and API key management portal',
    category: 'Backend & API',
    status: 'in_progress',
    progressPercentage: 85,
    timeline: 'Jun 2026 - Present',
    techStack: ['Node.js', 'TypeScript', 'Express', 'PostgreSQL', 'Redis', 'JWT', 'Tailwind CSS'],
    description: 'Modern internal developer platform providing automated OpenAPI specification validation, rate-limiting tier enforcement, API token rotation, and comprehensive analytics for internal service endpoints.',
    features: [
      'Sliding-window rate limiter powered by Redis atomic scripts',
      'Instant API key provisioning with granular permission scopes and expiration policies',
      'Live sandbox query console allowing instant testing with simulated mock responses',
      'Interactive metric dashboards tracking P95/P99 latency, error rates, and request quotas'
    ],
    architectureSummary: 'Reverse-proxy layer intercepting ingress requests, performing bearer validation and token bucket quotas before forwarding to upstream services.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    githubUrl: 'https://github.com/randyeef/devportal-api-gateway',
    demoUrl: 'https://devportal-core.dev',
    featured: false
  },
  {
    id: 'it-4',
    title: 'SaaSify: Multi-Tenant Enterprise Management Suite',
    tagline: 'Production-grade multi-tenant B2B platform with automated billing, RBAC, and audit trails',
    category: 'Full-Stack',
    status: 'completed',
    progressPercentage: 100,
    timeline: 'Feb 2026 - May 2026',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase Firestore', 'Stripe API', 'Node.js'],
    description: 'Architected and delivered an enterprise-ready management suite supporting isolated tenant workspaces, custom team invitation lifecycles, role-based authorization, and automated subscription tier provisioning.',
    features: [
      'Zero-leak tenant data partitioning enforced via Firestore Security Rules and schema validation',
      'Complete Stripe Customer Portal integration for automated recurring subscriptions and prorated invoices',
      'Exportable audit logs tracking administrative actions, logins, and permission changes',
      'Optimized responsive layout with full keyboard navigation and light/dark theme persistence'
    ],
    architectureSummary: 'Tenant-isolated Firestore document hierarchy backed by Firebase Auth claims and serverless cloud functions verifying Stripe webhooks.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    githubUrl: 'https://github.com/randyeef/saasify-enterprise-suite',
    demoUrl: 'https://saasify-suite.dev',
    featured: true
  },
  {
    id: 'it-5',
    title: 'Lumina: Canvas-Based Generative Dither & Shader Studio',
    tagline: 'Interactive WebGL/Canvas graphics laboratory for Floyd-Steinberg and Atkinson retro dithering',
    category: 'Frontend',
    status: 'completed',
    progressPercentage: 100,
    timeline: 'Mar 2026 - Apr 2026',
    techStack: ['TypeScript', 'HTML5 Canvas API', 'React', 'Tailwind CSS', 'Lucide Icons'],
    description: 'High-performance client-side image processing utility providing real-time matrix dithering, luminance threshold adjustments, custom palette mapping (GameBoy, Cyberpunk, Monochrome), and SVG vector extraction.',
    features: [
      'Multi-threaded pixel processing running across web worker threads without UI freezing',
      'Support for Floyd-Steinberg, Atkinson, Bayer 4x4, and Sierra matrix diffusion algorithms',
      'Instant export to high-resolution PNG, ASCII text, and scalable SVG vector paths',
      'Interactive image comparison slider with zoom and pan viewport controls'
    ],
    architectureSummary: 'Pure client-side processing using typed Uint8ClampedArray pixel buffers with zero server roundtrips, ensuring instantaneous feedback.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    githubUrl: 'https://github.com/randyeef/lumina-dither-studio',
    demoUrl: 'https://lumina-studio.dev',
    featured: true
  },
  {
    id: 'it-6',
    title: 'LogiTrack: Intelligent Logistics Fleet & Route Optimizer',
    tagline: 'Full-stack dispatch coordination system with Dijkstra routing algorithms and live GPS tracking',
    category: 'Full-Stack',
    status: 'completed',
    progressPercentage: 100,
    timeline: 'Nov 2025 - Jan 2026',
    techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Leaflet Maps', 'Docker'],
    description: 'Comprehensive logistics dispatcher portal deployed to manage multi-vehicle parcel distribution. Includes algorithmic route optimization reducing fuel expenditure by 18%, geofence entry/exit detection, and automated proof-of-delivery signatures.',
    features: [
      'Algorithmic route computation factoring in vehicle payload capacity, delivery windows, and traffic constraints',
      'Interactive geospatial map with live delivery pin clustering and breadcrumb trail replay',
      'Digital bill of lading generator rendering tamper-proof PDF manifests with cryptographic QR verification',
      'Automated SMS and email status notifications for end recipients'
    ],
    architectureSummary: 'Node.js routing microservice coupled with PostgreSQL spatial indexing (PostGIS) and React Leaflet map tiles.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    githubUrl: 'https://github.com/randyeef/logitrack-fleet-optimizer',
    demoUrl: 'https://logitrack-logistics.dev',
    featured: false
  },
  {
    id: 'it-7',
    title: 'AuthShield: Zero-Trust Authentication & Session Sentinel',
    tagline: 'High-assurance security library featuring WebAuthn biometric passkeys, TOTP 2FA, and anomaly detection',
    category: 'Backend & API',
    status: 'completed',
    progressPercentage: 100,
    timeline: 'Aug 2025 - Oct 2025',
    techStack: ['TypeScript', 'Node.js', 'WebAuthn / FIDO2', 'Redis', 'PostgreSQL', 'Crypto'],
    description: 'Turnkey authentication microservice delivering passwordless biometric login, device fingerprinting, and dynamic risk scoring based on IP geolocation and velocity anomalies.',
    features: [
      'Passwordless authentication leveraging modern WebAuthn FIDO2 public-key cryptography',
      'Time-based One-Time Password (TOTP) algorithm compliant with RFC 6238',
      'Real-time session invalidation broadcasting kill signals across active browser tabs via SSE',
      'Comprehensive OWASP Top 10 hardening against brute force, replay, and timing attacks'
    ],
    architectureSummary: 'Stateless JWT authorization paired with Redis sliding-window session registries for instantaneous remote token revocation.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    githubUrl: 'https://github.com/randyeef/authshield-sentinel',
    demoUrl: 'https://authshield.dev',
    featured: false
  }
];
