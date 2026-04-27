# TECH STACK DOCUMENT
## editxsubh.com — Creator Business Platform

> **Version:** 1.0 | **Date:** March 2026  
> **Architect:** Full-stack Next.js 14 application  
> **Hosting:** Vercel (free tier) | **Domain:** editxsubh.com

---

## 1. TECHNOLOGY OVERVIEW

editxsubh.com is built as a **modern full-stack Next.js application** with a JAMstack-influenced architecture — static generation where possible, server-side rendering for dynamic content, and API routes for backend functionality. The stack prioritizes performance, SEO, developer experience, and cost-efficiency.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│         Next.js 14 (App Router) + React 18 + TypeScript     │
├─────────────────────────────────────────────────────────────┤
│                        STYLING LAYER                        │
│            Tailwind CSS + Framer Motion + GSAP              │
├─────────────────────────────────────────────────────────────┤
│                       CONTENT LAYER                         │
│              Sanity CMS (Blog + Resources)                  │
├─────────────────────────────────────────────────────────────┤
│                        API LAYER                            │
│    Next.js API Routes (Contact Form + Payment Webhooks)     │
├─────────────────────────────────────────────────────────────┤
│                     INTEGRATION LAYER                       │
│        Razorpay | Resend | Google Analytics 4               │
├─────────────────────────────────────────────────────────────┤
│                     HOSTING LAYER                           │
│              Vercel (CDN + Edge Functions)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. CORE STACK

### 2.1 Framework — Next.js 14 (App Router)

| Detail | Value |
|--------|-------|
| Version | Next.js 14.x (latest stable) |
| Router | App Router (not Pages Router) |
| Runtime | Node.js 20 LTS |
| Language | TypeScript 5.x (strict mode) |

**Why Next.js 14:**
- **SSG** (Static Site Generation) for portfolio, about, and blog pages → blazing fast load times
- **SSR** (Server-Side Rendering) for shop and dynamic content → SEO-friendly with fresh data
- **API Routes** built-in → no separate backend needed (contact form, payment webhooks)
- **Image Optimization** (`next/image`) → automatic WebP conversion, lazy loading, responsive sizing
- **Font Optimization** (`next/font`) → zero layout shift, self-hosted Google Fonts
- **Metadata API** → granular SEO, Open Graph, and Twitter Card control per page
- **Edge Runtime support** → ultra-fast middleware and auth checks on Vercel

**Rendering Strategy Per Page:**
```
/                 → ISR (revalidate: 3600)   — Home
/portfolio        → SSG (static)             — Portfolio index
/portfolio/[slug] → SSG + fallback           — Case studies
/about            → SSG (static)             — About
/resources        → ISR (revalidate: 1800)   — Resources hub
/resources/[slug] → SSG + fallback           — Individual resource
/shop             → ISR (revalidate: 900)    — Shop
/shop/[slug]      → SSG + fallback           — Product pages
/blog             → ISR (revalidate: 1800)   — Blog index
/blog/[slug]      → SSG + fallback           — Blog posts
/contact          → SSG (static)             — Contact
```

---

### 2.2 Language — TypeScript

- Strict mode enabled (`"strict": true` in tsconfig)
- All components, utilities, and API routes fully typed
- Zod for runtime schema validation (forms, API payloads)
- Type-safe CMS queries with Sanity's GROQ TypeGen

---

### 2.3 Styling — Tailwind CSS + CSS Variables

| Detail | Value |
|--------|-------|
| Version | Tailwind CSS 3.x |
| Config | Custom theme extending base config |
| CSS Variables | Design tokens for colors, spacing, fonts |
| PostCSS | Autoprefixer + cssnano (production minification) |

**Custom Tailwind Config Highlights:**
```js
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      orange: {
        DEFAULT: '#FF6B35',
        light: '#FF8C5A',
        dark: '#E84A0C',
      },
      black: '#0A0A0A',
      'off-white': '#F5F5F0',
      'yellow-highlight': '#F5E642',
      'grid-line': '#E0DDD4',
    },
    fontFamily: {
      display: ['Bebas Neue', 'sans-serif'],
      heading: ['Syne', 'sans-serif'],
      body: ['Inter', 'sans-serif'],
      handwritten: ['Caveat', 'cursive'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    animation: {
      marquee: 'marquee 30s linear infinite',
      'blob-rotate': 'blob-rotate 20s linear infinite',
      'fade-up': 'fade-up 0.6s ease forwards',
    },
  },
}
```

---

## 3. ANIMATION & INTERACTION

### 3.1 Framer Motion

| Detail | Value |
|--------|-------|
| Package | `framer-motion` latest |
| Usage | Page transitions, scroll reveals, hover effects, AnimatePresence |

**Key patterns:**
```tsx
// Scroll reveal (fade up)
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
/>

// Page transitions
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.35 }}
  />
</AnimatePresence>

// Staggered children
<motion.div variants={containerVariants} initial="hidden" whileInView="show">
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants} />
  ))}
</motion.div>
```

### 3.2 GSAP (GreenSock)

| Detail | Value |
|--------|-------|
| Package | `gsap` + `ScrollTrigger` plugin |
| Usage | Complex scroll-driven animations (parallax, timeline scrub) |

**Use cases:**
- Hero section parallax on scroll
- Torn-paper section divider parallax effect
- Marquee ticker animation
- Progress bar fills (skills section)
- Counter animation for stats

---

## 4. CONTENT MANAGEMENT — SANITY CMS

| Detail | Value |
|--------|-------|
| Version | Sanity v3 |
| Package | `@sanity/client`, `next-sanity` |
| Studio | Embedded at `/studio` (Sanity Studio v3) |
| Data Fetching | GROQ queries via `sanity.fetch()` |
| Image CDN | Sanity's built-in image CDN (automatic WebP + resizing) |
| Priority | P1 (Post-launch, required for Blog + Resources) |

**Schemas:**
```
├── blog-post        (title, slug, body, hero, category, author, publishedAt)
├── portfolio-item   (title, slug, video, category, tools, challenge, process, results)
├── product          (title, slug, price, description, whatsIncluded[], previewImages[])
├── resource         (title, slug, category, description, downloadUrl, previewImage)
└── site-settings    (hero copy, social links, contact info)
```

**Why Sanity:**
- Free tier includes 2 users and 10GB bandwidth (sufficient for launch)
- Real-time updates without redeployment (webhook-triggered ISR revalidation)
- Type-safe GROQ with auto-generated TypeScript types
- Excellent image pipeline (CDN + transformation)

---

## 5. PAYMENT INTEGRATION — RAZORPAY

| Detail | Value |
|--------|-------|
| Package | `razorpay` (Node.js SDK) |
| Frontend | Razorpay Checkout.js (loaded client-side) |
| Priority | P0 — Launch Critical |

**Payment Flow:**
```
User clicks "Buy" on Product Page
       ↓
POST /api/shop/create-order
(Next.js API Route creates Razorpay order with amount + productId)
       ↓
Client receives { orderId, amount, currency }
       ↓
Razorpay Checkout.js opens payment modal
       ↓
User completes payment
       ↓
POST /api/shop/verify-payment
(HMAC signature verification server-side)
       ↓
Success: Send download link via email (Resend)
       ↓
User receives digital product
```

**Environment Variables:**
```
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx (server-side only, never exposed to client)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx (safe to expose)
```

---

## 6. EMAIL — RESEND

| Detail | Value |
|--------|-------|
| Package | `resend` |
| Free Tier | 3,000 emails/month |
| Templates | React Email templates (type-safe, component-based) |
| Priority | P0 — Launch Critical |

**Email types:**
1. **Contact form notification** — to Shubham when someone submits the contact form
2. **Contact form confirmation** — to visitor confirming receipt
3. **Purchase confirmation** — to buyer with product download link
4. **Resource download** — for future email-gated resources

**Why Resend over Nodemailer:**
- Nodemailer requires an SMTP server setup (complex, unreliable on Vercel)
- Resend is purpose-built for Next.js / Vercel deployments
- React Email templates = component-based, type-safe email HTML
- Free tier sufficient for launch volume

---

## 7. FORMS — REACT HOOK FORM + ZOD

| Detail | Value |
|--------|-------|
| Package | `react-hook-form` + `@hookform/resolvers` + `zod` |
| Usage | Contact form, future email capture forms |

**Why:**
- Minimal re-renders, excellent performance
- Zod schema shared between frontend validation and API route validation (single source of truth)
- TypeScript native

```ts
// Shared schema
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  projectType: z.enum(['YouTube Editing', 'Social Media', 'Motion Graphics', 'Other']),
  budget: z.string(),
  message: z.string().min(20).max(2000),
});
```

---

## 8. SEO & METADATA

### 8.1 Next.js Metadata API
```ts
// app/layout.tsx — root metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://editxsubh.com'),
  title: { default: 'Shubham Sharma — Video Editor & Motion Graphics', template: '%s | editxsubh.com' },
  description: 'Helping creators and brands turn ideas into cinematic content.',
  openGraph: { type: 'website', locale: 'en_IN', ... },
  twitter: { card: 'summary_large_image', creator: '@editxsubh' },
  robots: { index: true, follow: true },
};
```

### 8.2 Structured Data (JSON-LD)
- `Person` schema on Home + About pages
- `Product` schema on individual product pages
- `Article` schema on blog posts
- `WebSite` schema with `SearchAction` on root

### 8.3 Sitemap & Robots
- `/sitemap.xml` — auto-generated via `next-sitemap` package
- `/robots.txt` — allow all crawlers, disallow `/studio` (Sanity backend)

### 8.4 Target Keywords
```
Primary:   video editor India
           motion graphics freelancer India
           YouTube video editing service
Secondary: short form video editor
           After Effects freelancer
           video editing templates India
           CapCut templates free
```

---

## 9. ANALYTICS

| Tool | Purpose | Priority |
|------|---------|----------|
| **Google Analytics 4** | Traffic, conversions, user behavior | P1 |
| **Vercel Analytics** | Core Web Vitals, real-user performance | P1 (free on Vercel) |
| **Vercel Speed Insights** | LCP, FID, CLS monitoring per page | P1 (free) |

**GA4 Implementation:**
- `@next/third-parties/google` — official Google integration for Next.js (no performance impact)
- Custom events: `portfolio_view`, `product_purchase`, `contact_form_submit`, `resource_download`

---

## 10. HOSTING & DEPLOYMENT — VERCEL

| Detail | Value |
|--------|-------|
| Platform | Vercel |
| Plan | Free (Hobby tier — sufficient for launch) |
| Region | Mumbai (`bom1`) — lowest latency for India |
| CDN | Global Edge Network (automatic) |
| Custom Domain | editxsubh.com via Vercel DNS |
| SSL | Auto-provisioned via Let's Encrypt |
| Branch Deploys | `main` → production, PRs → preview URLs |

**Vercel Configuration (`vercel.json`):**
```json
{
  "regions": ["bom1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

---

## 11. PROJECT STRUCTURE

```
editxsubh.com/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, analytics, nav, footer)
│   ├── page.tsx                  # Home page
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── portfolio/
│   │   ├── page.tsx              # Portfolio index with filter
│   │   └── [slug]/page.tsx       # Case study pages
│   ├── resources/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── shop/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── api/
│   │   ├── contact/route.ts      # Contact form handler
│   │   ├── shop/
│   │   │   ├── create-order/route.ts
│   │   │   └── verify-payment/route.ts
│   │   └── revalidate/route.ts   # Sanity webhook ISR revalidation
│   ├── privacy-policy/page.tsx
│   ├── terms/page.tsx
│   ├── refund-policy/page.tsx
│   └── studio/[[...tool]]/page.tsx  # Sanity Studio (embedded)
│
├── components/
│   ├── ui/                       # Base components (Button, Card, Badge...)
│   ├── layout/                   # Header, Footer, Navigation
│   ├── sections/                 # Page sections (Hero, Services, Portfolio...)
│   ├── portfolio/                # Portfolio-specific components
│   ├── shop/                     # Product cards, checkout
│   ├── blog/                     # Blog grid, post layout
│   └── animations/               # Framer Motion wrappers, GSAP hooks
│
├── lib/
│   ├── sanity/
│   │   ├── client.ts             # Sanity client config
│   │   ├── queries.ts            # GROQ query definitions
│   │   └── schemas/              # Content schemas
│   ├── razorpay.ts               # Razorpay client
│   ├── resend.ts                 # Email client + templates
│   └── validations.ts            # Zod schemas
│
├── hooks/                        # Custom React hooks
│   ├── useScrollReveal.ts
│   ├── useMarquee.ts
│   └── useCounter.ts
│
├── types/                        # TypeScript type definitions
├── public/
│   ├── fonts/                    # Self-hosted fonts (if needed)
│   ├── textures/                 # Grid paper, noise, tape SVGs
│   ├── icons/                    # Tool logos, custom icons
│   └── og-image.jpg              # Default Open Graph image
│
├── styles/
│   └── globals.css               # Tailwind base + custom CSS variables
│
├── sanity.config.ts              # Sanity Studio config
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── .env.local                    # Environment variables (never commit)
```

---

## 12. ENVIRONMENT VARIABLES

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=                           # Server-side only

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=               # Safe to expose
RAZORPAY_KEY_SECRET=                        # Server-side only

# Email (Resend)
RESEND_API_KEY=
CONTACT_EMAIL_TO=shubham@editxsubh.com      # Where contact forms go

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site
NEXT_PUBLIC_SITE_URL=https://editxsubh.com
```

---

## 13. PERFORMANCE STRATEGY

### Image Optimization
- Use `next/image` for all images → automatic WebP, AVIF, responsive sizes
- Sanity CDN for CMS images (automatic format + dimension optimization)
- Explicit `width` and `height` on all images → zero CLS

### Font Optimization
- `next/font/google` with `display: 'swap'` and `preload: true`
- Subset fonts to Latin only (reduces file size)

### Code Splitting
- Next.js automatic route-level code splitting
- Dynamic imports for heavy components: `dynamic(() => import('...'), { ssr: false })`
  - GSAP (load client-side only)
  - Razorpay Checkout.js (load only on product pages)
  - Sanity Studio (load only at /studio)

### Bundle Analysis
```bash
ANALYZE=true npm run build
# Uses @next/bundle-analyzer to identify large dependencies
```

### Caching Strategy
- Static assets: `Cache-Control: public, max-age=31536000, immutable` (Vercel auto)
- API routes: `no-store` for payment routes; appropriate `revalidate` for data routes
- ISR pages: On-demand revalidation via Sanity webhook

---

## 14. SECURITY CHECKLIST

- [x] HTTPS enforced (Vercel auto SSL)
- [x] Security headers in `vercel.json` (X-Frame-Options, CSP, etc.)
- [x] CSRF protection on contact form (custom token + SameSite cookie)
- [x] Razorpay signature verification (HMAC-SHA256) before fulfillment
- [x] Input validation with Zod on all API routes
- [x] Environment variables never exposed to client (server-only)
- [x] Rate limiting on contact + payment API routes (Vercel Edge Middleware)
- [x] Sanity API token restricted to read-only for public queries
- [x] `.gitignore` includes `.env.local`

---

## 15. PACKAGE LIST (PRODUCTION)

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "framer-motion": "^11.x",
    "gsap": "^3.x",
    "next-sanity": "^7.x",
    "@sanity/client": "^6.x",
    "@sanity/image-url": "^1.x",
    "razorpay": "^2.x",
    "resend": "^3.x",
    "react-email": "^2.x",
    "@react-email/components": "^0.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "zod": "^3.x",
    "lucide-react": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  },
  "devDependencies": {
    "@types/react": "^18.x",
    "@types/node": "^20.x",
    "eslint": "^8.x",
    "eslint-config-next": "^14.x",
    "prettier": "^3.x",
    "next-sitemap": "^4.x",
    "@next/bundle-analyzer": "^14.x"
  }
}
```

---

## 16. DEVELOPMENT COMMANDS

```bash
# Install dependencies
npm install

# Development server (localhost:3000)
npm run dev

# Production build
npm run build

# Start production server locally
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Bundle analysis
ANALYZE=true npm run build

# Generate sitemap (post-build)
npm run postbuild
```

---

## 17. DEPLOYMENT WORKFLOW

```
Local Development
      ↓
git push origin feature/xxx
      ↓
Vercel Preview Deploy (auto) → sharable preview URL for review
      ↓
PR merged to main
      ↓
Vercel Production Deploy (auto) → editxsubh.com live within ~30s
      ↓
Sanity content update → webhook fires → ISR revalidation → stale pages regenerated
```

---

## 18. PHASE IMPLEMENTATION REFERENCE

| Phase | Focus | Key Tech |
|-------|-------|----------|
| Phase 1 (Wks 1–2) | Foundation: Home, About, Contact | Next.js setup, Tailwind design system, Framer Motion, Resend |
| Phase 2 (Wks 3–4) | Portfolio & Services | Static pages, portfolio filter, case study template |
| Phase 3 (Wks 5–6) | Revenue Engine | Razorpay integration, Shop pages, Resources + download |
| Phase 4 (Wks 7–8) | Content & Launch | Sanity CMS, Blog, sitemap, GA4, Vercel production |

---

*END OF TECH STACK DOCUMENT — editxsubh.com v1.0*
