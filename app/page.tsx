"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── INLINE SVG LOGO ───────────────────────────────────────────────────────
const BramhandLogo = ({ size = 48 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width={size} height={size}>
    <defs>
      <radialGradient id="bgGradL" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0d1b3e"/>
        <stop offset="60%" stopColor="#060e24"/>
        <stop offset="100%" stopColor="#020810"/>
      </radialGradient>
      <linearGradient id="goldGradL" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f5d87e"/>
        <stop offset="40%" stopColor="#e8b84b"/>
        <stop offset="70%" stopColor="#fce97a"/>
        <stop offset="100%" stopColor="#c8922a"/>
      </linearGradient>
      <linearGradient id="blueGradL" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3a8fff"/>
        <stop offset="100%" stopColor="#00d4ff"/>
      </linearGradient>
      <filter id="glowBL">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glowGL">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="softGL">
        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <radialGradient id="orbGradL" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#4da6ff"/>
        <stop offset="40%" stopColor="#1a5fa8"/>
        <stop offset="100%" stopColor="#060e24"/>
      </radialGradient>
    </defs>
    <circle cx="250" cy="250" r="230" fill="#010913"/>
    <circle cx="250" cy="250" r="225" fill="url(#bgGradL)"/>
    <circle cx="250" cy="250" r="228" fill="none" stroke="#1a3060" strokeWidth="1"/>
    <circle cx="250" cy="250" r="222" fill="none" stroke="url(#goldGradL)" strokeWidth="2.5"/>
    <ellipse cx="250" cy="250" rx="170" ry="55" fill="none" stroke="#3a8fff" strokeWidth="1.2" opacity="0.35" transform="rotate(-20 250 250)" filter="url(#glowBL)"/>
    <ellipse cx="250" cy="250" rx="140" ry="45" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.3" transform="rotate(40 250 250)" filter="url(#glowBL)"/>
    <ellipse cx="250" cy="250" rx="105" ry="35" fill="none" stroke="#3a8fff" strokeWidth="1" opacity="0.25" transform="rotate(-55 250 250)" filter="url(#glowBL)"/>
    <circle cx="250" cy="185" r="42" fill="url(#orbGradL)" filter="url(#softGL)" opacity="0.9"/>
    <ellipse cx="240" cy="172" rx="18" ry="12" fill="white" opacity="0.12"/>
    <ellipse cx="250" cy="185" rx="52" ry="16" fill="none" stroke="url(#blueGradL)" strokeWidth="1.5" opacity="0.6" filter="url(#glowBL)"/>
    <circle cx="250" cy="133" r="4" fill="url(#goldGradL)" filter="url(#glowGL)"/>
    <circle cx="398" cy="225" r="3" fill="#00d4ff" filter="url(#glowBL)" opacity="0.8"/>
    <text x="250" y="264" textAnchor="middle" fontFamily="Georgia, serif" fontSize="38" fontWeight="700" letterSpacing="2" fill="url(#goldGradL)" filter="url(#glowGL)">Bhramhaand</text>
    <rect x="198" y="275" width="104" height="28" rx="14" fill="#0a1f45" stroke="url(#blueGradL)" strokeWidth="1.5"/>
    <text x="250" y="294" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="16" fontWeight="700" letterSpacing="3" fill="url(#blueGradL)">.AI</text>
  </svg>
);

// ─── CONSTANTS ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "search", label: "Search", icon: "⊙" },
  { id: "chat", label: "AI Chat", icon: "◈" },
  { id: "books", label: "Library", icon: "◉" },
  { id: "research", label: "Research", icon: "✦" },
  { id: "tools", label: "AI Tools", icon: "⬡" },
  { id: "jobs", label: "Jobs", icon: "◎" },
];

const SEARCH_CATEGORIES = ["All", "Web", "Books", "Research", "AI Tools", "Jobs"];

const SAMPLE_RESULTS = {
  All: [
    { type: "Research", title: "Attention Is All You Need", source: "arXiv · Vaswani et al.", desc: "The foundational transformer paper that revolutionized NLP and AI architecture design.", tags: ["NLP", "Transformers", "Deep Learning"] },
    { type: "Tool", title: "Claude by Anthropic", source: "anthropic.com", desc: "Advanced AI assistant with strong reasoning, coding, and analysis capabilities.", tags: ["AI Assistant", "LLM", "API"] },
    { type: "Book", title: "The Age of AI", source: "Kissinger, Schmidt & Huttenlocher", desc: "A profound examination of artificial intelligence and what it means for human society and civilization.", tags: ["AI", "Society", "Future"] },
    { type: "Job", title: "Senior ML Engineer @ DeepMind", source: "London / Remote · $180k–$240k", desc: "Lead research on large-scale language models and reinforcement learning systems.", tags: ["ML", "Research", "Remote"] },
    { type: "Web", title: "State of AI Report 2024", source: "stateof.ai", desc: "Annual comprehensive analysis of AI research, industry trends, and policy developments.", tags: ["Report", "2024", "Industry"] },
  ],
  Books: [
    { type: "Book", title: "Deep Learning", source: "Goodfellow, Bengio & Courville", desc: "The definitive textbook on deep learning methods, architectures, and applications.", tags: ["Deep Learning", "Math", "Textbook"] },
    { type: "Book", title: "Superintelligence", source: "Nick Bostrom", desc: "Explores the potential trajectories of AI development and existential risks.", tags: ["AI Safety", "Philosophy", "Future"] },
    { type: "Book", title: "Human Compatible", source: "Stuart Russell", desc: "Rethinking AI development with a focus on building systems aligned with human values.", tags: ["AI Alignment", "Safety", "Ethics"] },
  ],
  Research: [
    { type: "Research", title: "GPT-4 Technical Report", source: "OpenAI · 2023", desc: "Technical overview of GPT-4's capabilities, evaluations, and safety measures.", tags: ["LLM", "GPT-4", "Safety"] },
    { type: "Research", title: "Constitutional AI: Harmlessness from AI Feedback", source: "Anthropic · 2022", desc: "A method for training AI systems to be helpful, harmless, and honest.", tags: ["RLHF", "Safety", "Alignment"] },
    { type: "Research", title: "Scaling Laws for Neural Language Models", source: "Kaplan et al. · 2020", desc: "Empirical study of how language model performance scales with compute, data, and parameters.", tags: ["Scaling", "LLM", "Empirical"] },
  ],
  "AI Tools": [
    { type: "Tool", title: "Perplexity AI", source: "perplexity.ai · ★★★★★", desc: "AI-powered search engine providing cited, accurate answers to complex queries.", tags: ["Search", "Citations", "Free"] },
    { type: "Tool", title: "Cursor", source: "cursor.sh · ★★★★½", desc: "AI-first code editor with deep understanding of your entire codebase.", tags: ["Coding", "IDE", "Pro"] },
    { type: "Tool", title: "Midjourney", source: "midjourney.com · ★★★★★", desc: "State-of-the-art AI image generation with photorealistic and artistic outputs.", tags: ["Image Gen", "Creative", "API"] },
  ],
  Jobs: [
    { type: "Job", title: "AI Research Scientist @ Anthropic", source: "San Francisco · $220k–$350k", desc: "Work on frontier AI safety research, alignment, and interpretability.", tags: ["Research", "Safety", "Onsite"] },
    { type: "Job", title: "LLM Engineer @ Mistral AI", source: "Paris / Remote · €120k–€180k", desc: "Develop and optimize large language model training pipelines.", tags: ["LLM", "Remote", "Europe"] },
    { type: "Job", title: "ML Platform Engineer @ Scale AI", source: "Remote · $160k–$220k", desc: "Build infrastructure for data labeling and model evaluation at massive scale.", tags: ["Platform", "Remote", "Infrastructure"] },
  ],
};

const AI_TOOLS = [
  { name: "ChatGPT", cat: "Chatbot", rating: 4.8, desc: "OpenAI's flagship conversational AI", tags: ["Free/Pro", "API"], color: "#10a37f" },
  { name: "Claude", cat: "Chatbot", rating: 4.9, desc: "Anthropic's AI with strong reasoning", tags: ["Free/Pro", "API"], color: "#e8b84b" },
  { name: "Midjourney", cat: "Image Gen", rating: 4.8, desc: "Premium AI art generation", tags: ["Pro", "Discord"], color: "#9b59b6" },
  { name: "Runway ML", cat: "Video Gen", rating: 4.5, desc: "AI video generation & editing", tags: ["Pro", "API"], color: "#e74c3c" },
  { name: "Perplexity", cat: "Search", rating: 4.7, desc: "AI search with citations", tags: ["Free/Pro", "API"], color: "#3a8fff" },
  { name: "Cursor", cat: "Coding", rating: 4.8, desc: "AI-first code editor", tags: ["Free/Pro", "IDE"], color: "#00d4ff" },
  { name: "ElevenLabs", cat: "Voice AI", rating: 4.7, desc: "Ultra-realistic voice synthesis", tags: ["Pro", "API"], color: "#f39c12" },
  { name: "Suno", cat: "Music AI", rating: 4.6, desc: "AI music generation", tags: ["Free/Pro"], color: "#2ecc71" },
  { name: "Pika Labs", cat: "Video Gen", rating: 4.4, desc: "Text-to-video AI platform", tags: ["Free/Pro"], color: "#e91e8c" },
];

const BOOKS = [
  { title: "Deep Learning", author: "Goodfellow et al.", year: 2016, cat: "ML/AI", pages: 775, rating: 4.9 },
  { title: "The Alignment Problem", author: "Brian Christian", year: 2020, cat: "AI Safety", pages: 368, rating: 4.7 },
  { title: "Superintelligence", author: "Nick Bostrom", year: 2014, cat: "AI Safety", pages: 328, rating: 4.5 },
  { title: "Human Compatible", author: "Stuart Russell", year: 2019, cat: "AI Ethics", pages: 352, rating: 4.8 },
  { title: "Life 3.0", author: "Max Tegmark", year: 2017, cat: "Future AI", pages: 384, rating: 4.6 },
  { title: "Weapons of Math Destruction", author: "Cathy O'Neil", year: 2016, cat: "AI Ethics", pages: 272, rating: 4.4 },
  { title: "The Master Algorithm", author: "Pedro Domingos", year: 2015, cat: "ML Theory", pages: 352, rating: 4.5 },
  { title: "Reinforcement Learning", author: "Sutton & Barto", year: 2018, cat: "ML/AI", pages: 526, rating: 4.9 },
];

const RESEARCH_PAPERS = [
  { title: "Attention Is All You Need", authors: "Vaswani et al.", year: 2017, venue: "NeurIPS", citations: "98,400+", cat: "NLP" },
  { title: "BERT: Pre-training of Deep Bidirectional Transformers", authors: "Devlin et al.", year: 2018, venue: "NAACL", citations: "54,200+", cat: "NLP" },
  { title: "Playing Atari with Deep RL", authors: "Mnih et al.", year: 2013, venue: "ICLR", citations: "18,900+", cat: "RL" },
  { title: "Generative Adversarial Nets", authors: "Goodfellow et al.", year: 2014, venue: "NeurIPS", citations: "63,100+", cat: "Generative" },
  { title: "Constitutional AI", authors: "Bai et al., Anthropic", year: 2022, venue: "arXiv", citations: "3,200+", cat: "Alignment" },
  { title: "Sparks of AGI: GPT-4 Evaluation", authors: "Bubeck et al., Microsoft", year: 2023, venue: "arXiv", citations: "5,800+", cat: "LLM" },
];

const JOBS = [
  { title: "AI Research Scientist", company: "Anthropic", location: "San Francisco, CA", type: "Full-time", salary: "$220k–$350k", remote: false, tags: ["AI Safety", "Research", "PhD"] },
  { title: "Senior ML Engineer", company: "DeepMind", location: "London, UK", type: "Full-time", salary: "£150k–£220k", remote: false, tags: ["ML", "PyTorch", "Research"] },
  { title: "LLM Engineer", company: "Mistral AI", location: "Remote", type: "Full-time", salary: "€120k–€180k", remote: true, tags: ["LLM", "Python", "Remote"] },
  { title: "AI Product Manager", company: "OpenAI", location: "San Francisco, CA", type: "Full-time", salary: "$200k–$280k", remote: false, tags: ["PM", "AI", "Strategy"] },
  { title: "ML Platform Engineer", company: "Scale AI", location: "Remote", type: "Full-time", salary: "$160k–$220k", remote: true, tags: ["Infrastructure", "MLOps", "Remote"] },
  { title: "Computer Vision Researcher", company: "Meta AI", location: "Menlo Park, CA", type: "Full-time", salary: "$180k–$260k", remote: false, tags: ["CV", "Research", "PyTorch"] },
];

const ARCH_SECTIONS = [
  {
    title: "Folder Structure",
    icon: "📁",
    content: `bramhand-ai/
├── apps/
│   ├── web/                    # Next.js 14 frontend
│   │   ├── app/                # App router
│   │   │   ├── (auth)/         # Auth routes
│   │   │   ├── (dashboard)/    # Protected routes
│   │   │   ├── search/
│   │   │   ├── chat/
│   │   │   ├── library/
│   │   │   ├── research/
│   │   │   ├── tools/
│   │   │   └── jobs/
│   │   ├── components/
│   │   │   ├── ui/             # Reusable UI
│   │   │   ├── search/
│   │   │   ├── chat/
│   │   │   └── shared/
│   │   └── lib/
│   └── api/                    # FastAPI backend
│       ├── routers/
│       ├── services/
│       ├── models/
│       ├── middleware/
│       └── security/
├── packages/
│   ├── db/                     # Prisma + PostgreSQL
│   ├── vector-db/              # Pinecone client
│   ├── auth/                   # Auth utilities
│   └── ai/                     # AI pipeline (RAG)
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   ├── terraform/
│   └── cloudflare/
└── docs/`
  },
  {
    title: "Database Schema",
    icon: "🗄️",
    content: `-- Users & Auth
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  name        VARCHAR(255),
  role        user_role DEFAULT 'user',
  mfa_enabled BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Encrypted tokens
CREATE TABLE refresh_tokens (
  id         UUID PRIMARY KEY,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,  -- bcrypt hashed
  expires_at TIMESTAMPTZ NOT NULL,
  rotated    BOOLEAN DEFAULT false
);

-- Search history (per-user isolation)
CREATE TABLE searches (
  id         UUID PRIMARY KEY,
  user_id    UUID REFERENCES users(id),
  query      TEXT NOT NULL,
  category   VARCHAR(50),
  results    JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat conversations
CREATE TABLE conversations (
  id         UUID PRIMARY KEY,
  user_id    UUID REFERENCES users(id),
  title      TEXT,
  model      VARCHAR(50) DEFAULT 'claude-3-5-sonnet',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id              UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  role            VARCHAR(20) CHECK (role IN ('user','assistant','system')),
  content         TEXT NOT NULL,
  sources         JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Bookmarks
CREATE TABLE bookmarks (
  id         UUID PRIMARY KEY,
  user_id    UUID REFERENCES users(id),
  item_type  VARCHAR(50),
  item_id    VARCHAR(255),
  metadata   JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`
  },
  {
    title: "API Design",
    icon: "🔌",
    content: `# Bramhand.ai REST API v1

Base URL: https://api.bramhand.ai/v1

## Authentication
POST /auth/register        # Register new user
POST /auth/login           # Login → JWT + refresh token
POST /auth/refresh         # Rotate refresh token
POST /auth/mfa/enable      # Enable MFA
POST /auth/mfa/verify      # Verify TOTP code
DELETE /auth/logout        # Revoke tokens

## Search
GET  /search?q=&cat=&page= # Semantic search
GET  /search/suggest?q=    # Autocomplete
POST /search/filters       # Advanced search

## AI Chat
POST /chat                 # Send message (SSE stream)
GET  /chat/conversations   # List conversations
GET  /chat/{id}/messages   # Get conversation
DELETE /chat/{id}          # Delete conversation

## Library
GET  /library/books        # List books
GET  /library/books/{id}   # Book detail + AI summary
POST /library/search       # Search books

## Research
GET  /research/papers      # List papers
GET  /research/{id}        # Paper + AI summary
GET  /research/trending    # Trending by week
POST /research/{id}/cite   # Generate citation

## Tools
GET  /tools                # List AI tools
GET  /tools/{id}           # Tool detail
GET  /tools/compare?ids=   # Compare tools

## Jobs
GET  /jobs                 # List jobs
GET  /jobs/{id}            # Job detail
POST /jobs/{id}/apply      # Apply (resume upload)
GET  /jobs/saved           # Saved jobs

## User
GET  /user/profile         # Get profile
PUT  /user/profile         # Update profile
GET  /user/usage           # API usage stats
POST /user/api-key         # Generate API key`
  },
  {
    title: "Security Implementation",
    icon: "🔐",
    content: `# Zero-Trust Security Architecture

## Layer 1: Network
- Cloudflare WAF with OWASP ruleset
- DDoS protection (Cloudflare Magic Transit)
- TLS 1.3 enforced, HSTS preloaded
- IP allowlist for admin panel (/admin)
- Geo-blocking for high-risk regions

## Layer 2: Authentication
- Argon2id for password hashing (m=65536, t=3, p=4)
- JWT RS256 (15-min access tokens)
- Refresh token rotation + reuse detection
- TOTP-based MFA (Google Authenticator)
- Breached password detection (HaveIBeenPwned API)

## Layer 3: Authorization
- RBAC: [guest, user, pro, researcher, admin]
- Row-level security in PostgreSQL
- Attribute-based access control for premium content

## Layer 4: API Security
- Rate limiting: 100 req/min (user), 10 req/min (anon)
- Request signing for admin endpoints
- API key scoping (read-only, write, admin)
- IP-based throttling with exponential backoff

## Layer 5: Input Validation
- Zod/Pydantic schema validation on all inputs
- HTML sanitization (DOMPurify)
- SQL injection prevention (parameterized queries only)
- File upload scanning (ClamAV) + type validation
- Content Security Policy (strict-dynamic)

## Layer 6: Data Protection
- AES-256-GCM for sensitive data at rest
- Separate encryption keys per tenant
- HashiCorp Vault for secrets management
- PII tokenization before storage
- GDPR: right to erasure implemented

## Layer 7: Monitoring
- Real-time threat detection (AWS GuardDuty)
- Anomaly detection for API patterns
- Automated incident response playbooks
- SOC 2 Type II audit logging
- Intrusion detection with Falco`
  },
  {
    title: "Deployment Guide",
    icon: "🚀",
    content: `# Production Deployment

## Prerequisites
- Docker 24+ & Kubernetes 1.28+
- AWS EKS or GCP GKE cluster
- Cloudflare account (Teams plan)
- HashiCorp Vault cluster

## Step 1: Infrastructure
cd infrastructure/terraform
terraform init
terraform plan -out=prod.tfplan
terraform apply prod.tfplan

## Step 2: Secrets
vault kv put secret/bramhand \\
  db_url="postgresql://..." \\
  openai_key="sk-..." \\
  claude_key="sk-ant-..." \\
  jwt_secret="..."

## Step 3: Database
kubectl apply -f k8s/postgres/
kubectl exec -it postgres-0 -- psql -U bramhand
\\i /sql/schema.sql
\\i /sql/seed.sql

## Step 4: Backend API
docker build -t bramhand-api:v1.0 ./apps/api
docker push registry.bramhand.ai/api:v1.0
kubectl apply -f k8s/api/
kubectl rollout status deployment/api

## Step 5: Frontend
npm run build --workspace=web
docker build -t bramhand-web:v1.0 ./apps/web
kubectl apply -f k8s/web/

## Step 6: DNS & TLS
cloudflare dns create bramhand.ai A <LB_IP>
cloudflare dns create api.bramhand.ai A <API_IP>
# TLS auto-provisioned via cert-manager + Let's Encrypt

## Step 7: Verify
kubectl get pods -n production
curl https://api.bramhand.ai/v1/health
# Expected: {"status":"ok","version":"1.0.0"}`
  },
  {
    title: "Scaling Architecture",
    icon: "📈",
    content: `# Horizontal Scaling Design

## Traffic Tiers
Tier 1 (0–10k DAU):   1 API pod, 1 DB, 1 Redis
Tier 2 (10k–100k):    3 API pods, RDS Multi-AZ, Redis Cluster
Tier 3 (100k–1M+):    Auto-scaled pods, Aurora Serverless v2
                       Global CDN, Read replicas per region

## Kubernetes HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  minReplicas: 3
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        averageUtilization: 60
  - type: Resource
    resource:
      name: memory
      target:
        averageUtilization: 75

## Caching Strategy
L1: In-memory (Node.js LRU cache, 30s TTL)
L2: Redis Cluster (search results, 5min TTL)
L3: CloudFlare Cache (static assets, 1yr TTL)
L4: CDN (media files, immutable)

## Database Scaling
- Connection pooling: PgBouncer (pool_size=50)
- Read replicas for search queries
- Partitioning by user_id for large tables
- Archival: cold data → S3 after 90 days

## Vector DB (Pinecone)
- Serverless tier: scales to 0
- Dedicated clusters for enterprise
- Multi-region replication for low-latency

## AI Model Load Balancing
- Fallback chain: Claude → OpenAI → Gemini
- Circuit breaker pattern for API failures
- Async queue (BullMQ) for batch operations
- Token bucket rate limiting per user tier`
  },
];

// ─── STYLES ────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #020810;
    --bg2:       #060e24;
    --bg3:       #0a1428;
    --card:      #0d1b3e;
    --card2:     #0f1f48;
    --border:    rgba(58,143,255,0.18);
    --border2:   rgba(245,216,126,0.2);
    --gold:      #e8b84b;
    --gold2:     #f5d87e;
    --blue:      #3a8fff;
    --blue2:     #00d4ff;
    --text:      #e8eef8;
    --text2:     #8ab4d4;
    --text3:     #4a6a8a;
    --glow-blue: 0 0 30px rgba(58,143,255,0.3);
    --glow-gold: 0 0 30px rgba(232,184,75,0.3);
    --r:         12px;
    --r2:        20px;
  }
  .light {
    --bg:        #f4f7ff;
    --bg2:       #eaeef8;
    --bg3:       #dde4f4;
    --card:      #ffffff;
    --card2:     #f0f4ff;
    --border:    rgba(58,143,255,0.2);
    --border2:   rgba(180,140,30,0.3);
    --text:      #0a1428;
    --text2:     #3a5070;
    --text3:     #7a90b0;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

  /* STARS CANVAS */
  .stars-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }

  /* HEADER */
  .header {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; height: 64px;
    background: rgba(2,8,16,0.85);
    backdrop-filter: blur(24px) saturate(180%);
    border-bottom: 1px solid var(--border);
  }
  .light .header { background: rgba(244,247,255,0.9); }
  .logo-area { display: flex; align-items: center; gap: 12px; cursor: default; }
  .logo-text { display: flex; flex-direction: column; }
  .logo-name { font-family: 'Cinzel', serif; font-size: 16px; font-weight: 700; color: var(--gold); letter-spacing: 0.5px; }
  .logo-tag { font-size: 9px; letter-spacing: 3px; color: var(--text3); text-transform: uppercase; }
  .nav { display: flex; gap: 2px; }
  .nav-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    border: none; background: transparent; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--text2); transition: all 0.2s;
  }
  .nav-btn:hover { background: var(--card); color: var(--text); }
  .nav-btn.active { background: rgba(58,143,255,0.15); color: var(--blue2); border: 1px solid rgba(58,143,255,0.3); }
  .nav-icon { font-size: 12px; }
  .header-actions { display: flex; gap: 8px; align-items: center; }
  .icon-btn {
    width: 36px; height: 36px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--card);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 14px; color: var(--text2);
    transition: all 0.2s;
  }
  .icon-btn:hover { border-color: var(--blue); color: var(--blue2); }

  /* HERO */
  .hero {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 24px 40px; position: relative; z-index: 1;
  }
  .hero-eyebrow {
    font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
    color: var(--blue2); margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }
  .hero-eyebrow::before, .hero-eyebrow::after {
    content: ''; flex: 1; max-width: 40px;
    height: 1px; background: var(--blue2); opacity: 0.4;
  }
  .hero-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(36px, 7vw, 80px);
    font-weight: 700; text-align: center; line-height: 1.1;
    letter-spacing: -0.5px; margin-bottom: 16px;
    background: linear-gradient(135deg, var(--gold2) 0%, var(--gold) 40%, var(--blue2) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero-sub {
    font-size: 16px; color: var(--text2); text-align: center;
    max-width: 460px; line-height: 1.7; margin-bottom: 48px;
    font-weight: 300;
  }
  .hero-stats { display: flex; gap: 40px; margin-top: 48px; flex-wrap: wrap; justify-content: center; }
  .stat { text-align: center; }
  .stat-num { font-family: 'Cinzel', serif; font-size: 24px; color: var(--gold); font-weight: 700; }
  .stat-label { font-size: 11px; color: var(--text3); letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }

  /* SEARCH BOX */
  .search-wrap { width: 100%; max-width: 680px; position: relative; }
  .search-cats { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; justify-content: center; }
  .cat-pill {
    padding: 5px 14px; border-radius: 99px; font-size: 12px; font-weight: 500;
    border: 1px solid var(--border); background: var(--card); color: var(--text2);
    cursor: pointer; transition: all 0.2s;
  }
  .cat-pill:hover { border-color: var(--blue); color: var(--blue2); }
  .cat-pill.active { background: rgba(58,143,255,0.2); border-color: var(--blue); color: var(--blue2); }
  .search-box {
    display: flex; align-items: center; gap: 12px;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 16px; padding: 6px 6px 6px 20px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.4), var(--glow-blue);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .search-box:focus-within {
    border-color: var(--blue);
    box-shadow: 0 8px 40px rgba(0,0,0,0.4), 0 0 0 3px rgba(58,143,255,0.15), var(--glow-blue);
  }
  .search-input {
    flex: 1; background: transparent; border: none; outline: none;
    font-family: 'DM Sans', sans-serif; font-size: 16px; color: var(--text);
    caret-color: var(--blue2);
  }
  .search-input::placeholder { color: var(--text3); }
  .search-btn {
    padding: 10px 20px; border-radius: 10px;
    background: linear-gradient(135deg, var(--blue) 0%, var(--blue2) 100%);
    border: none; color: white; font-weight: 600; font-size: 14px;
    cursor: pointer; white-space: nowrap; transition: opacity 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .search-btn:hover { opacity: 0.9; }

  /* CONTENT */
  .content { padding: 80px 24px 80px; max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
  .section-header { margin-bottom: 32px; }
  .section-title { font-family: 'Cinzel', serif; font-size: 28px; color: var(--text); font-weight: 600; }
  .section-sub { font-size: 14px; color: var(--text2); margin-top: 6px; }

  /* RESULTS */
  .results-grid { display: flex; flex-direction: column; gap: 12px; }
  .result-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--r2); padding: 20px 24px;
    transition: border-color 0.2s, transform 0.2s;
    cursor: pointer;
  }
  .result-card:hover { border-color: var(--blue); transform: translateY(-2px); }
  .result-type {
    display: inline-flex; align-items: center;
    font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
    padding: 3px 10px; border-radius: 99px; margin-bottom: 10px;
  }
  .type-Research { background: rgba(58,143,255,0.15); color: var(--blue2); }
  .type-Tool { background: rgba(232,184,75,0.15); color: var(--gold); }
  .type-Book { background: rgba(46,204,113,0.15); color: #2ecc71; }
  .type-Job { background: rgba(233,30,140,0.15); color: #e91e8c; }
  .type-Web { background: rgba(0,212,255,0.15); color: var(--blue2); }
  .result-title { font-size: 17px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
  .result-source { font-size: 12px; color: var(--text3); margin-bottom: 8px; }
  .result-desc { font-size: 14px; color: var(--text2); line-height: 1.6; margin-bottom: 12px; }
  .result-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .tag {
    font-size: 11px; padding: 3px 10px; border-radius: 99px;
    background: var(--bg3); border: 1px solid var(--border); color: var(--text3);
  }

  /* CHAT */
  .chat-layout { display: grid; grid-template-columns: 240px 1fr; gap: 16px; height: calc(100vh - 200px); }
  .chat-sidebar {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--r2); padding: 16px; overflow-y: auto;
    display: flex; flex-direction: column; gap: 8px;
  }
  .chat-new-btn {
    width: 100%; padding: 10px; border-radius: 10px;
    background: linear-gradient(135deg, var(--blue) 0%, var(--blue2) 100%);
    border: none; color: white; font-weight: 600; font-size: 13px;
    cursor: pointer; font-family: 'DM Sans', sans-serif; margin-bottom: 8px;
  }
  .conv-item {
    padding: 10px 12px; border-radius: 8px; cursor: pointer;
    font-size: 13px; color: var(--text2); transition: all 0.15s;
    border: 1px solid transparent; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .conv-item:hover { background: var(--card2); color: var(--text); }
  .conv-item.active { background: rgba(58,143,255,0.15); color: var(--blue2); border-color: var(--border); }
  .chat-main {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--r2); display: flex; flex-direction: column; overflow: hidden;
  }
  .chat-messages { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .msg { display: flex; gap: 12px; }
  .msg.user { flex-direction: row-reverse; }
  .msg-avatar {
    width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 14px;
    background: var(--card2); border: 1px solid var(--border);
  }
  .msg.user .msg-avatar { background: rgba(58,143,255,0.2); }
  .msg-bubble {
    max-width: 75%; padding: 14px 18px; border-radius: 16px;
    font-size: 14px; line-height: 1.7; color: var(--text);
    background: var(--bg3); border: 1px solid var(--border);
  }
  .msg.user .msg-bubble { background: rgba(58,143,255,0.15); border-color: rgba(58,143,255,0.3); }
  .msg-sources { margin-top: 10px; display: flex; gap: 6px; flex-wrap: wrap; }
  .source-chip {
    font-size: 11px; padding: 3px 10px; border-radius: 99px;
    background: rgba(232,184,75,0.1); border: 1px solid rgba(232,184,75,0.25); color: var(--gold);
    cursor: pointer;
  }
  .chat-input-area {
    padding: 16px; border-top: 1px solid var(--border);
    display: flex; gap: 10px; align-items: flex-end;
  }
  .chat-input {
    flex: 1; background: var(--bg3); border: 1px solid var(--border); border-radius: 12px;
    padding: 12px 16px; color: var(--text); font-family: 'DM Sans', sans-serif;
    font-size: 14px; resize: none; outline: none; max-height: 120px; min-height: 48px;
    transition: border-color 0.2s;
  }
  .chat-input:focus { border-color: var(--blue); }
  .chat-send-btn {
    width: 44px; height: 44px; border-radius: 10px;
    background: linear-gradient(135deg, var(--blue) 0%, var(--blue2) 100%);
    border: none; color: white; cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    transition: opacity 0.2s;
  }
  .chat-send-btn:hover { opacity: 0.9; }
  .typing-indicator { display: flex; gap: 5px; align-items: center; padding: 4px 0; }
  .typing-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--blue2); animation: bounce 1.2s infinite; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

  /* GRID CARDS */
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .grid-2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
  .card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--r2); padding: 20px; transition: all 0.2s; cursor: pointer;
  }
  .card:hover { border-color: var(--blue2); transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
  .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .card-icon { font-size: 28px; }
  .card-badge { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--text3); }
  .card-title { font-size: 16px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
  .card-meta { font-size: 12px; color: var(--text3); margin-bottom: 8px; }
  .card-desc { font-size: 13px; color: var(--text2); line-height: 1.6; }
  .stars { color: var(--gold); font-size: 12px; }
  .rating { font-size: 12px; color: var(--text2); margin-left: 4px; }
  .tool-color-bar { width: 40px; height: 3px; border-radius: 99px; margin-bottom: 12px; }

  /* FILTERS BAR */
  .filters-bar { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; align-items: center; }
  .filter-chip {
    padding: 6px 16px; border-radius: 99px; font-size: 12px; font-weight: 500;
    border: 1px solid var(--border); background: var(--card); color: var(--text2);
    cursor: pointer; transition: all 0.2s;
  }
  .filter-chip:hover, .filter-chip.active { border-color: var(--blue); color: var(--blue2); background: rgba(58,143,255,0.1); }

  /* JOBS */
  .job-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--r2); padding: 20px 24px;
    display: flex; align-items: flex-start; gap: 16px;
    transition: all 0.2s; cursor: pointer;
  }
  .job-card:hover { border-color: var(--blue2); transform: translateY(-2px); }
  .company-logo {
    width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
    background: var(--card2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .job-info { flex: 1; }
  .job-title { font-size: 16px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
  .job-company { font-size: 13px; color: var(--text2); margin-bottom: 8px; }
  .job-meta { display: flex; gap: 12px; font-size: 12px; color: var(--text3); margin-bottom: 10px; flex-wrap: wrap; }
  .job-salary { font-size: 14px; font-weight: 600; color: var(--gold); margin-left: auto; white-space: nowrap; }
  .remote-badge {
    font-size: 10px; padding: 2px 8px; border-radius: 99px; font-weight: 600;
    background: rgba(46,204,113,0.15); color: #2ecc71; border: 1px solid rgba(46,204,113,0.3);
  }

  /* ARCHITECTURE DOCS */
  .arch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 16px; }
  .arch-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--r2); overflow: hidden;
  }
  .arch-card-header {
    padding: 16px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .arch-card-header h3 { font-family: 'Cinzel', serif; font-size: 14px; color: var(--gold); }
  .arch-card pre {
    padding: 20px; font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: var(--text2); overflow-x: auto;
    line-height: 1.7; white-space: pre; background: var(--bg2);
    max-height: 320px; overflow-y: auto;
  }

  /* SECTION TABS */
  .page { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  /* FOOTER */
  .footer {
    border-top: 1px solid var(--border); padding: 32px 24px;
    text-align: center; color: var(--text3); font-size: 12px;
    position: relative; z-index: 1;
  }
  .footer-logo { font-family: 'Cinzel', serif; font-size: 20px; color: var(--gold); margin-bottom: 8px; }

  /* LOADING PULSE */
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .pulse { animation: pulse 2s infinite; }

  /* GLOW TEXT */
  .glow-blue { text-shadow: 0 0 20px rgba(58,143,255,0.6); }
  .glow-gold { text-shadow: 0 0 20px rgba(232,184,75,0.6); }

  /* EMPTY STATE */
  .empty-state { text-align: center; padding: 80px 20px; color: var(--text3); }
  .empty-icon { font-size: 48px; margin-bottom: 16px; }

  /* MOBILE NAV */
  @media (max-width: 768px) {
    .nav { display: none; }
    .chat-layout { grid-template-columns: 1fr; }
    .chat-sidebar { display: none; }
    .hero-stats { gap: 24px; }
  }
  
  /* SCROLL LOCK */
  .no-scroll { overflow: hidden; }
`;

// ─── STARS BACKGROUND ──────────────────────────────────────────────────────
function StarsBackground({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!dark) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.3 + 0.3, a: Math.random(),
      s: Math.random() * 0.003 + 0.001,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.a += s.s; if (s.a > 1 || s.a < 0.1) s.s *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,210,255,${s.a * 0.7})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [dark]);
  if (!dark) return null;
  return <canvas ref={canvasRef} className="stars-bg" />;
}

// ─── SEARCH PAGE ───────────────────────────────────────────────────────────
function SearchPage({ query, setQuery, category, setCategory }) {
  const [searched, setSearched] = useState(false);
  const results = SAMPLE_RESULTS[category] || SAMPLE_RESULTS["All"];

  const handleSearch = () => {
    if (query.trim()) setSearched(true);
  };

  return (
    <div className="page">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0 48px" }}>
        <div className="search-cats">
          {SEARCH_CATEGORIES.map(c => (
            <button key={c} className={`cat-pill ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
        <div className="search-wrap">
          <div className="search-box">
            <span style={{ color: "var(--text3)", fontSize: 18 }}>⊙</span>
            <input className="search-input" placeholder="Search across AI, Books, Research, Tools, Jobs..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} />
            <button className="search-btn" onClick={handleSearch}>Search →</button>
          </div>
        </div>
      </div>
      {searched && query.trim() ? (
        <div className="results-grid">
          {results.map((r, i) => (
            <div key={i} className="result-card">
              <span className={`result-type type-${r.type}`}>{r.type}</span>
              <div className="result-title">{r.title}</div>
              <div className="result-source">{r.source}</div>
              <div className="result-desc">{r.desc}</div>
              <div className="result-tags">{r.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">⊙</div>
          <div style={{ fontSize: 18, color: "var(--text2)", marginBottom: 8 }}>Search everything with AI</div>
          <div style={{ fontSize: 13, color: "var(--text3)" }}>Try: "transformer architecture", "AI safety jobs", "deep learning books"</div>
        </div>
      )}
    </div>
  );
}

// ─── CHAT PAGE ─────────────────────────────────────────────────────────────
function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm Bramhand AI — your research-grade assistant. I can help with deep analysis, coding, research papers, and more. Ask me anything.", sources: [] }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [convs] = useState(["Transformer Architecture", "AI Safety Research", "Python FastAPI Setup", "Vector DB Comparison"]);
  const [activeConv, setActiveConv] = useState(0);
  const bottomRef = useRef(null);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: text, sources: [] }];
    setMessages(newMessages);
    setLoading(true);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are Bramhand AI — an expert research assistant on the Bramhand.ai knowledge platform created by Aditya Kumar Pal. You provide highly accurate, research-backed answers with cited sources. Format code nicely and be concise yet thorough. At the end of answers about research or technical topics, suggest 2-3 relevant sources in a JSON array format like: [SOURCES: [{\"title\":\"...\",\"url\":\"...\"}]]",
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "I'm unable to respond right now.";
      const sourceMatch = raw.match(/\[SOURCES: (\[.*?\])\]/s);
      let content = raw.replace(/\[SOURCES:.*?\]/s, "").trim();
      let sources = [];
      if (sourceMatch) {
        try { sources = JSON.parse(sourceMatch[1]); } catch {}
      }
      setMessages(prev => [...prev, { role: "assistant", content, sources }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "I encountered an error connecting to the AI. Please try again.", sources: [] }]);
    }
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [input, loading, messages]);

  return (
    <div className="page">
      <div className="chat-layout">
        <div className="chat-sidebar">
          <button className="chat-new-btn">+ New Conversation</button>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "var(--text3)", textTransform: "uppercase", padding: "4px 4px 8px", marginTop: 4 }}>Recent</div>
          {convs.map((c, i) => <div key={i} className={`conv-item ${activeConv === i ? "active" : ""}`} onClick={() => setActiveConv(i)}>◈ {c}</div>)}
        </div>
        <div className="chat-main">
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                <div className="msg-avatar">{m.role === "user" ? "U" : "◈"}</div>
                <div>
                  <div className="msg-bubble" style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
                  {m.sources && m.sources.length > 0 && (
                    <div className="msg-sources">
                      {m.sources.map((s, j) => <a key={j} className="source-chip" href={s.url} target="_blank" rel="noopener noreferrer">✦ {s.title}</a>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="msg">
                <div className="msg-avatar">◈</div>
                <div className="msg-bubble">
                  <div className="typing-indicator">
                    <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="chat-input-area">
            <textarea className="chat-input" placeholder="Ask anything — research, code, analysis..." rows={1} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} />
            <button className="chat-send-btn" onClick={sendMessage} disabled={loading}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LIBRARY PAGE ──────────────────────────────────────────────────────────
function LibraryPage() {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "ML/AI", "AI Safety", "AI Ethics", "Future AI", "ML Theory"];
  const filtered = filter === "All" ? BOOKS : BOOKS.filter(b => b.cat === filter);
  return (
    <div className="page">
      <div className="filters-bar">
        {cats.map(c => <button key={c} className={`filter-chip ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>)}
      </div>
      <div className="grid-3">
        {filtered.map((b, i) => (
          <div key={i} className="card">
            <div className="card-header">
              <div style={{ fontSize: 36 }}>📘</div>
              <span className="card-badge">{b.cat}</span>
            </div>
            <div className="card-title">{b.title}</div>
            <div className="card-meta">{b.author} · {b.year} · {b.pages}p</div>
            <div className="stars">{"★".repeat(Math.floor(b.rating))}<span className="rating">{b.rating}</span></div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button style={{ flex: 1, padding: "7px", borderRadius: 8, background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text2)", fontSize: 12, cursor: "pointer" }}>AI Summary</button>
              <button style={{ flex: 1, padding: "7px", borderRadius: 8, background: "rgba(58,143,255,0.15)", border: "1px solid rgba(58,143,255,0.3)", color: "var(--blue2)", fontSize: 12, cursor: "pointer" }}>Save</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RESEARCH PAGE ─────────────────────────────────────────────────────────
function ResearchPage() {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "NLP", "RL", "Generative", "Alignment", "LLM"];
  const filtered = filter === "All" ? RESEARCH_PAPERS : RESEARCH_PAPERS.filter(p => p.cat === filter);
  return (
    <div className="page">
      <div className="filters-bar">
        {cats.map(c => <button key={c} className={`filter-chip ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>)}
      </div>
      <div className="results-grid">
        {filtered.map((p, i) => (
          <div key={i} className="result-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span className="result-type type-Research">{p.cat}</span>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>{p.venue} · {p.year}</span>
            </div>
            <div className="result-title">{p.title}</div>
            <div className="result-source">{p.authors}</div>
            <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 12, color: "var(--text3)" }}>
              <span>✦ {p.citations} citations</span>
              <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                <button style={{ padding: "5px 12px", borderRadius: 6, background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text2)", fontSize: 11, cursor: "pointer" }}>AI Summary</button>
                <button style={{ padding: "5px 12px", borderRadius: 6, background: "rgba(232,184,75,0.1)", border: "1px solid rgba(232,184,75,0.25)", color: "var(--gold)", fontSize: 11, cursor: "pointer" }}>Cite</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TOOLS PAGE ────────────────────────────────────────────────────────────
function ToolsPage() {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Chatbot", "Image Gen", "Video Gen", "Coding", "Search", "Voice AI", "Music AI"];
  const filtered = filter === "All" ? AI_TOOLS : AI_TOOLS.filter(t => t.cat === filter);
  return (
    <div className="page">
      <div className="filters-bar">
        {cats.map(c => <button key={c} className={`filter-chip ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>)}
      </div>
      <div className="grid-3">
        {filtered.map((t, i) => (
          <div key={i} className="card">
            <div style={{ width: 40, height: 3, borderRadius: 99, background: t.color, marginBottom: 12 }} />
            <div className="card-header">
              <div className="card-title" style={{ fontSize: 18 }}>{t.name}</div>
              <span className="card-badge">{t.cat}</span>
            </div>
            <div className="card-desc" style={{ marginBottom: 12 }}>{t.desc}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {t.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="stars">{"★".repeat(Math.floor(t.rating))}<span className="rating">{t.rating}</span></div>
              <button style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(58,143,255,0.15)", border: "1px solid rgba(58,143,255,0.3)", color: "var(--blue2)", fontSize: 12, cursor: "pointer" }}>Visit →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── JOBS PAGE ─────────────────────────────────────────────────────────────
function JobsPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "Remote" ? JOBS.filter(j => j.remote) : filter === "Onsite" ? JOBS.filter(j => !j.remote) : JOBS;
  return (
    <div className="page">
      <div className="filters-bar">
        {["All", "Remote", "Onsite", "Research", "Engineering"].map(f => (
          <button key={f} className={`filter-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((j, i) => (
          <div key={i} className="job-card">
            <div className="company-logo">🏢</div>
            <div className="job-info">
              <div className="job-title">{j.title}</div>
              <div className="job-company">{j.company}</div>
              <div className="job-meta">
                <span>📍 {j.location}</span>
                <span>⏱ {j.type}</span>
                {j.remote && <span className="remote-badge">Remote</span>}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {j.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
              <div className="job-salary">{j.salary}</div>
              <button style={{ padding: "8px 16px", borderRadius: 8, background: "linear-gradient(135deg, var(--blue), var(--blue2))", border: "none", color: "white", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Apply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ARCHITECTURE DOCS ─────────────────────────────────────────────────────
function ArchitectureDocs() {
  return (
    <div className="page" style={{ paddingTop: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div className="hero-eyebrow" style={{ justifyContent: "center" }}>Platform Architecture</div>
        <h2 style={{ fontFamily: "Cinzel, serif", fontSize: 28, color: "var(--gold)", marginBottom: 8 }}>Enterprise Blueprint</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Production-ready, zero-trust, scalable SaaS architecture</p>
      </div>
      <div className="arch-grid">
        {ARCH_SECTIONS.map((s, i) => (
          <div key={i} className="arch-card">
            <div className="arch-card-header">
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <h3>{s.title}</h3>
            </div>
            <pre>{s.content}</pre>
          </div>
        ))}
      </div>

      {/* Monetization */}
      <div style={{ marginTop: 48 }}>
        <h3 style={{ fontFamily: "Cinzel, serif", fontSize: 22, color: "var(--gold)", marginBottom: 24, textAlign: "center" }}>💰 Monetization Strategy</h3>
        <div className="grid-3">
          {[
            { tier: "Free", price: "$0/mo", feats: ["100 AI searches/mo", "10 chat messages/mo", "Basic library access", "Community support"], color: "var(--text3)" },
            { tier: "Pro", price: "$19/mo", feats: ["Unlimited AI search", "Unlimited AI chat", "Full research hub", "Citation export", "Priority support"], color: "var(--blue2)" },
            { tier: "Enterprise", price: "Custom", feats: ["Everything in Pro", "Custom RAG pipeline", "Dedicated API access", "SLA 99.99%", "SSO + SAML", "Dedicated support"], color: "var(--gold)" },
          ].map((p, i) => (
            <div key={i} className="card" style={{ borderColor: i === 1 ? "var(--blue)" : "var(--border)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: p.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{p.tier}</div>
              <div style={{ fontFamily: "Cinzel, serif", fontSize: 32, color: "var(--text)", marginBottom: 16 }}>{p.price}</div>
              {p.feats.map((f, j) => <div key={j} style={{ fontSize: 13, color: "var(--text2)", padding: "5px 0", borderBottom: "1px solid var(--border)" }}>✓ {f}</div>)}
            </div>
          ))}
        </div>
      </div>

      {/* Security Grid */}
      <div style={{ marginTop: 48 }}>
        <h3 style={{ fontFamily: "Cinzel, serif", fontSize: 22, color: "var(--gold)", marginBottom: 24, textAlign: "center" }}>🔐 28-Layer Security Model</h3>
        <div className="grid-3">
          {[
            { icon: "🛡", title: "Zero Trust Network", desc: "No implicit trust. Every request verified, authenticated, and authorized." },
            { icon: "🔑", title: "JWT + MFA", desc: "Short-lived RS256 tokens, TOTP MFA, and refresh token rotation." },
            { icon: "🗝", title: "AES-256 Encryption", desc: "All sensitive data encrypted at rest. Separate keys per tenant." },
            { icon: "🚧", title: "WAF + DDoS Shield", desc: "Cloudflare WAF with OWASP rules. Magic Transit DDoS protection." },
            { icon: "🔒", title: "RBAC + RLS", desc: "Role-based access control with PostgreSQL row-level security." },
            { icon: "📊", title: "Real-time Monitoring", desc: "Threat detection with GuardDuty, Falco IDS, and SOC 2 audit logs." },
          ].map((s, i) => (
            <div key={i} className="card">
              <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
              <div className="card-title">{s.title}</div>
              <div className="card-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function BramhandAI() {
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState("home");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [focus, setFocus] = useState(false);

  const isHome = tab === "home";

  const handleSearch = () => {
    if (query.trim()) setTab("search");
  };

  return (
    <div className={dark ? "" : "light"} style={{ minHeight: "100vh" }}>
      <style>{css}</style>
      <StarsBackground dark={dark} />

      {/* HEADER */}
      <header className="header">
        <div className="logo-area" onClick={() => setTab("home")}>
          <BramhandLogo size={38} />
          <div className="logo-text">
            <span className="logo-name">Bramhand.ai</span>
            <span className="logo-tag">by Aditya Kumar Pal</span>
          </div>
        </div>

        {!isHome && (
          <nav className="nav">
            {NAV_ITEMS.map(n => (
              <button key={n.id} className={`nav-btn ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
                <span className="nav-icon">{n.icon}</span>{n.label}
              </button>
            ))}
          </nav>
        )}

        <div className="header-actions">
          <button className="icon-btn" title="Architecture Docs" onClick={() => setTab("arch")}>⬡</button>
          <button className="icon-btn" title={dark ? "Light mode" : "Dark mode"} onClick={() => setDark(!dark)}>{dark ? "☀" : "◑"}</button>
          <button className="icon-btn" title="Focus mode" onClick={() => setFocus(!focus)}>◎</button>
          {!isHome && (
            <button style={{ padding: "8px 16px", borderRadius: 8, background: "linear-gradient(135deg, var(--blue), var(--blue2))", border: "none", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* HOME */}
      {isHome && !focus && (
        <main className="hero">
          <div className="hero-eyebrow">Infinite Knowledge · One Intelligence</div>
          <h1 className="hero-title">Bramhand.ai</h1>
          <p className="hero-sub">The world's most powerful AI knowledge platform. Search, chat, research, discover — all in one cosmic interface.</p>

          <div className="search-wrap">
            <div className="search-cats">
              {SEARCH_CATEGORIES.map(c => (
                <button key={c} className={`cat-pill ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
              ))}
            </div>
            <div className="search-box">
              <span style={{ color: "var(--text3)", fontSize: 18 }}>⊙</span>
              <input className="search-input" placeholder="Ask anything — research, books, AI tools, jobs..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} />
              <button className="search-btn" onClick={handleSearch}>Search →</button>
            </div>
          </div>

          {/* Module Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, maxWidth: 880, width: "100%", marginTop: 48 }}>
            {NAV_ITEMS.map(n => (
              <button key={n.id} onClick={() => setTab(n.id)} style={{
                background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16,
                padding: "20px 16px", cursor: "pointer", transition: "all 0.2s", textAlign: "center",
                fontFamily: "DM Sans, sans-serif"
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--blue)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{n.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{n.label}</div>
              </button>
            ))}
          </div>

          <div className="hero-stats">
            {[["10M+", "Knowledge Nodes"], ["50K+", "Research Papers"], ["500+", "AI Tools"], ["10K+", "Tech Jobs"]].map(([n, l]) => (
              <div key={l} className="stat">
                <div className="stat-num glow-gold">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* SECTION PAGES */}
      {!isHome && tab !== "arch" && (
        <div className="content" style={{ paddingTop: 96 }}>
          <div className="section-header">
            <h2 className="section-title">
              {NAV_ITEMS.find(n => n.id === tab)?.icon} {NAV_ITEMS.find(n => n.id === tab)?.label}
            </h2>
          </div>
          {tab === "search" && <SearchPage query={query} setQuery={setQuery} category={category} setCategory={setCategory} />}
          {tab === "chat" && <ChatPage />}
          {tab === "books" && <LibraryPage />}
          {tab === "research" && <ResearchPage />}
          {tab === "tools" && <ToolsPage />}
          {tab === "jobs" && <JobsPage />}
        </div>
      )}

      {tab === "arch" && (
        <div className="content" style={{ paddingTop: 96 }}>
          <ArchitectureDocs />
        </div>
      )}

      {/* FOOTER */}
      {(isHome || tab === "arch") && (
        <footer className="footer">
          <div className="footer-logo">Bramhand.ai</div>
          <div style={{ marginBottom: 8 }}>Infinite Knowledge. One Intelligence.</div>
          <div>Created with ✦ by <strong style={{ color: "var(--gold)" }}>Aditya Kumar Pal</strong> · Powered by Claude AI · © 2025 Bramhand.ai</div>
          <div style={{ marginTop: 12, fontSize: 11, color: "var(--text3)" }}>Enterprise-grade · Zero Trust Security · GDPR Compliant · 99.99% SLA</div>
        </footer>
      )}
    </div>
  );
}
