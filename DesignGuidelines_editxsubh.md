# DESIGN GUIDELINES
## editxsubh.com — Visual Design System

> **Version:** 1.0 | **Date:** March 2026  
> **Design Direction:** Vibhu Trivedi × Javeria Fusion  
> *Raw expressive scrapbook energy + Clean minimalist structural clarity = Cinematic Creative Platform*

---

## 1. DESIGN PHILOSOPHY

This website fuses two distinct design languages into one cohesive identity:

### The Vibhu Trivedi Influence — "The Creative Sketchbook"
- **Aesthetic:** Mixed-media scrapbook. Graph-paper grid backgrounds layered with masking tape textures, torn paper edges, gritty dark sections
- **Typography:** Strong bold display fonts with authority, broken by hand-drawn arrows, scribbled annotations, and orange/yellow "highlighter" marker accents
- **Hierarchy:** The accent color (orange) strategically guides the eye — titles, section headers, key data points
- **Contrast:** Stark transitions from light textured sections to heavy dark sections — creates drama and cinematic depth
- **Message to viewer:** *"I am an artist. I think outside the box, and I'm not afraid to break the rules to make something visually striking."*

### The Javeria Influence — "Modern Minimalist Structure"
- **Aesthetic:** Soft UI with rounded/blob shapes, asymmetric hero image containers, circular CTA buttons
- **Color:** Warm, earthy muted palette — easy on the eyes, encouraging dwell time
- **Typography:** Pristine modern sans-serif body text; **outline/stroke fonts** as large visual anchors (heavy without being overwhelming)
- **Layout:** Classic Z-pattern and F-pattern reading flow — logo → nav → headline → paragraph → CTA
- **Scroll marquee:** Skill/service ticker at section boundaries — modern, clean, uncluttered
- **Message to viewer:** *"I am organized and user-focused. I understand digital interfaces and value clarity."*

### The Fusion Result — "Cinematic Creative Platform"
The homepage layout structure follows Javeria (clean, navigable, Z-pattern) while the visual texture, typography expression, dark-light contrast, and accent highlight style follow Vibhu Trivedi. This creates a site that feels premium, creative, and deeply personal.

---

## 2. BRAND COLOR SYSTEM

### Primary Palette
| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--color-orange` | Signature Orange | `#FF6B35` | CTAs, highlights, accent marks, hover states |
| `--color-black` | Deep Black | `#0A0A0A` | Dark sections, backgrounds, text on light |
| `--color-white` | Off-White | `#F5F5F0` | Light section backgrounds, text on dark |

### Extended Palette
| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--color-orange-light` | Soft Orange | `#FF8C5A` | Gradient ends, softer accents |
| `--color-orange-dark` | Deep Orange | `#E84A0C` | Gradient starts, hover darken |
| `--color-yellow-highlight` | Marker Yellow | `#F5E642` | Highlight marks on text (Vibhu style) |
| `--color-gray-900` | Near Black | `#111111` | Card backgrounds, dark UI |
| `--color-gray-700` | Dark Gray | `#2A2A2A` | Section dividers, subtle borders |
| `--color-gray-400` | Mid Gray | `#6B6B6B` | Subtext, captions |
| `--color-gray-100` | Light Gray | `#E8E8E3` | Dividers on light backgrounds |
| `--color-grid` | Grid Line | `#E0DDD4` | Graph-paper grid texture lines |

### Dark / Light Section Alternation
The site alternates between **light grid sections** (Off-white background + black text) and **dark cinematic sections** (Deep black background + white text) — directly inspired by Vibhu Trivedi's dramatic light-to-dark contrast. Orange remains the accent in both modes.

---

## 3. TYPOGRAPHY SYSTEM

### Font Stack
| Role | Font | Weight | Usage |
|------|------|--------|-------|
| **Display / Hero** | `Bebas Neue` | 400 | Giant section titles, hero name, brutalist section labels |
| **Display Outline** | `Bebas Neue` | 400 (CSS stroke) | Decorative large anchors, "outline" text effect (Javeria style) |
| **Heading** | `Syne` | 700, 800 | Section headings H2–H3 |
| **Subheading** | `Syne` | 600 | Card titles, labels |
| **Body** | `Inter` | 400, 500 | All body copy, descriptions, blog content |
| **Accent / Handwritten** | `Caveat` | 400, 600 | Scribbled annotations, arrow labels, handwritten style notes (Vibhu style) |
| **Monospace** | `JetBrains Mono` | 400 | Code snippets, tool tags, metadata |

### Type Scale
```
Display:     96px / 120px  — Hero name, giant section labels
H1:          64px / 80px   — Page titles
H2:          48px / 60px   — Section headings
H3:          32px / 44px   — Card titles, subsection headings
H4:          24px / 36px   — Labels, sub-labels
Body Large:  18px / 28px   — Lead paragraphs
Body:        16px / 26px   — Standard body copy
Caption:     14px / 22px   — Meta info, tags, timestamps
Tiny:        12px / 18px   — Legal text, footnotes
```

### Typography Rules
- **Hero name** ("Shubham Sharma") — Bebas Neue at 96px, with orange underline or yellow highlighter pseudo-element (Vibhu style)
- **Outline text** — Used for large decorative anchors (e.g., "PORTFOLIO", "ABOUT") using CSS `-webkit-text-stroke`, never for readability copy
- **Handwritten annotations** — Caveat font used sparingly: caption a photo, label an arrow, add a personal note in About page — max 3 uses per page
- **Line length:** Body text max 70 characters per line for readability

---

## 4. SPACING & LAYOUT SYSTEM

### Grid
- Desktop: 12-column grid, 1440px max-width, 120px side padding
- Tablet: 8-column grid, 768px, 48px side padding
- Mobile: 4-column grid, 375px, 24px side padding

### Spacing Scale (8px base unit)
```
xs:   4px
sm:   8px
md:   16px
lg:   24px
xl:   32px
2xl:  48px
3xl:  64px
4xl:  96px
5xl:  128px
6xl:  192px
```

### Section Padding
- Desktop section padding: `128px` vertical
- Mobile section padding: `64px` vertical
- Card internal padding: `32px`

---

## 5. VISUAL TEXTURE & EFFECTS SYSTEM

These are the signature visual elements that give the site its unique "Vibhu Trivedi × Cinematic" feel:

### 5.1 Grid Paper Texture
- Applied to light background sections
- CSS: subtle `1px` grid lines at `32px` intervals in `--color-grid`
- Opacity: 30–40% — should feel like a hint, not a visible grid
- Mimics a designer's graph paper notebook

```css
background-image:
  linear-gradient(var(--color-grid) 1px, transparent 1px),
  linear-gradient(90deg, var(--color-grid) 1px, transparent 1px);
background-size: 32px 32px;
```

### 5.2 Masking Tape Elements
- Decorative torn-tape strips at section corners or photo frames
- CSS or SVG-based, angled 2–5 degrees
- Colors: Off-white with slight shadow, or orange/yellow variants
- Used on: Hero image frame, About photo, featured project thumbnails

### 5.3 Torn Paper / Rough Edge Dividers
- Section transitions between light and dark zones use SVG torn-paper edges instead of straight horizontal lines
- Creates organic, tactile feel — signature of the scrapbook aesthetic
- Animated slightly on scroll (parallax)

### 5.4 Yellow / Orange Highlighter Marks
- CSS `::before` or `::after` pseudo-elements with a slightly transparent yellow/orange background
- Applied to key words in headings: e.g., "cinematic" / "storytelling" / "motion graphics"
- Slightly tilted (-1 to -2 degrees) and rough-edged using border-radius variation

```css
.highlight-word {
  background: linear-gradient(transparent 60%, rgba(245, 230, 66, 0.6) 40%);
}
```

### 5.5 Hand-Drawn Arrow Accents
- SVG arrows, slightly wobbly paths (not perfectly straight)
- Used near CTAs, portfolio thumbnails, and section transitions
- Color: Orange (#FF6B35) or White (on dark sections)
- Never more than 2–3 per page view

### 5.6 Noise / Grain Overlay
- Subtle CSS noise texture on hero and dark sections
- Adds cinematic film-grain feel
- CSS `filter: url(#noise)` via inline SVG filter or static noise PNG at 4% opacity

### 5.7 Blob / Organic Shapes (Javeria Influence)
- Asymmetric SVG blobs used as image containers and section backgrounds
- Primarily on: Hero image container, About photo frame
- Colors: Orange blob with slight shadow, or dark blob on light sections
- Animate slowly (20s rotation loop using CSS `@keyframes`)

### 5.8 Scrolling Marquee / Ticker
- Skills / services scrolling horizontally: `"VIDEO EDITING • MOTION GRAPHICS • COLOR GRADING • STORYTELLING • AI WORKFLOWS •"`
- Appears at the base of the Hero section (Javeria homepage bottom bar style)
- Dark background, white text, orange separator dots
- CSS: `animation: marquee linear infinite`

---

## 6. COMPONENT LIBRARY

### 6.1 Buttons

**Primary CTA Button**
- Background: Orange (#FF6B35)
- Text: White, Syne 600, 16px
- Padding: 14px 32px
- Border-radius: 999px (pill shape — Javeria style)
- Hover: Scale(1.04) + background darken to #E84A0C + subtle shadow
- Transition: 0.25s ease

**Secondary Button (Outline)**
- Border: 2px solid Orange
- Text: Orange
- Background: Transparent
- Hover: Fill with Orange, text turns White

**Ghost Button (Dark sections)**
- Border: 2px solid White
- Text: White
- Hover: Fill White, text turns Black

**Icon Button (Circular)**
- 56px circle (Javeria style)
- Background: Orange
- Icon: White SVG, 24px
- Used for: Arrow CTAs, social links, scroll indicators

### 6.2 Cards

**Portfolio Card**
- Aspect ratio: 16:9 thumbnail
- Corner radius: 12px
- Hover: Scale(1.03) + orange bottom border appears (4px) + overlay with category tag
- Category tag: Monospace font, orange background, uppercase
- Masking tape element in top corner (decorative)

**Service Card**
- Dark background (#111111)
- Orange icon on top
- Title in Syne 700
- Description in Inter 400, gray
- Thin left orange border (3px)
- Hover: Border expands to full left + slight background lighten

**Product Card**
- White background on light sections, dark on dark sections
- Preview image top (slightly cropped with blob overflow)
- Price badge: Orange pill
- Hover: Card lifts (translateY -8px) + shadow intensifies

**Resource Card**
- Grid paper texture background (light)
- Download icon: Orange
- Category tag: Handwritten font (Caveat) for personality

**Blog Card**
- Clean, Javeria-style grid layout
- Category pill: Colored by topic
- Read time badge
- Hover: Title color shifts to orange

### 6.3 Navigation

**Header (Sticky)**
- Background: Transparent → blurs to dark glass on scroll (`backdrop-filter: blur(16px)`)
- Logo: "editxsubh" in Bebas Neue, Orange color
- Nav links: Inter 500, 15px, White/Black (adapts to section)
- Active link: Orange with subtle underline
- CTA: "Hire Me" pill button (Orange)
- Mobile: Hamburger → full-screen slide-in menu with large Bebas Neue nav items

**Mobile Menu**
- Full screen takeover, black background
- Nav items: 64px Bebas Neue, staggered entrance animation
- Orange accent lines between items
- Social icons at bottom

### 6.4 Hero Layout (Javeria Z-Pattern Base)

```
[LOGO]                           [Nav Items]    [Hire Me CTA]
─────────────────────────────────────────────────────────────
[Hi, I'm]                        ┌──────────────────────────┐
[SHUBHAM SHARMA]  ←highlight     │                          │
[Video Editor &                  │   Profile / Showreel     │
Motion Graphics]                 │   in Blob Shape          │
                                 │                          │
[Tagline text here]              └──────────────────────────┘
                                       ↑ Orange blob frame
[● View Portfolio]
[○ Explore Resources]  [○ Hire Me]

──── [Social links: circular icon buttons] ────

▌ VIDEO EDITING • MOTION GRAPHICS • COLOR GRADING • STORYTELLING ▸ (marquee)
```

### 6.5 Section Headers
- Section label: Caveat font (handwritten), small, orange — *"what I do"*
- Section title: Syne 800, large — **"Services"**
- Decorative: Orange outline text behind title (Bebas Neue, CSS stroke, 40% opacity)
- Underline: Rough orange squiggle SVG below title

### 6.6 Skill / Tool Bars
- Tool name + proficiency level
- Bar: Dark track, orange fill, animated on viewport entry (width 0 → final %)
- Percentage shown on hover only
- Tool logo icon beside name

### 6.7 Timeline (About page)
- Vertical centered line in orange
- Nodes: Orange circles
- Left/right alternating cards on desktop
- Single column stacked on mobile
- Entry animations: slide in from left/right on scroll

### 6.8 Video Embed Player
- 16:9 container with slight rounded corners (12px)
- Custom play button overlay: Orange circle with white triangle
- Thumbnail with slight dark vignette overlay
- On hover: Overlay lifts, play button scales up

---

## 7. ANIMATION & MOTION GUIDELINES

### Core Principles
- Motion should feel cinematic, not bouncy
- Easing: Prefer `cubic-bezier(0.25, 0.1, 0.25, 1)` over spring physics
- Duration: 0.3s micro, 0.5s transitions, 0.8s reveals
- No animation that delays content visibility beyond 0.2s

### Scroll-triggered Animations
- **Fade up:** `opacity 0 → 1` + `translateY 24px → 0`, staggered for grid items
- **Slide in:** Cards enter from left or right depending on grid position
- **Counter animation:** Numbers count up when stats section enters viewport
- **Progress bars:** Fill from 0% on scroll entry (skills section)

### Hover States
- Cards: `transform: scale(1.03) translateY(-4px)` + shadow
- Buttons: Scale(1.04) + color shift
- Links: Underline slides in from left
- Nav items: Orange dot appears above on hover

### Page Transitions
- Route change: Fade out current page (0.2s) → slide in new page from right (0.3s)
- Use Framer Motion `<AnimatePresence>` and `<motion.div>`

### Loader (Optional)
- Brief (max 1.5s) cinematic intro: "editxsubh" logotype draws in with stroke animation
- Followed by fade-out revealing the homepage
- Skip if Lighthouse performance is impacted

### Parallax
- Hero section: Subtle background texture moves at 0.3× scroll speed
- Section dividers / torn paper: Move at 0.5× scroll speed
- Keep GPU-friendly: Use `transform: translateY()` not `background-position`

---

## 8. PAGE-BY-PAGE DESIGN SPECIFICATIONS

---

### PAGE 1: HOME

**Section 1 — Hero**
- Background: Light off-white (`#F5F5F0`) with grid paper texture
- Full-viewport height (100vh)
- Layout: 60% left content zone / 40% right image zone (Javeria split)
- Left: Stacked type hierarchy — handwritten greeting (Caveat, orange) → Giant name (Bebas Neue, 96px, black, key word highlighted in yellow) → Title (Syne, 24px, gray) → Tagline (Inter, 18px) → 3 CTA buttons → Social icon row
- Right: Showreel or profile image inside orange asymmetric blob shape, masking tape corner decorations
- Bottom: Full-width orange marquee ticker bar
- Decorative: Small hand-drawn orange arrow pointing from tagline to primary CTA

**Section 2 — Portfolio Preview**
- Background: Deep black (#0A0A0A) — dramatic dark section
- Title treatment: "MY WORK" in white Bebas Neue + "portfolio" ghost/outline text behind it
- 6 project cards in 3×2 grid on desktop, 1 column on mobile
- Hover: Orange bottom border + category overlay
- "View Full Portfolio →" link in orange at bottom

**Section 3 — Services**
- Background: Off-white with grid paper texture (light section returns)
- 5 cards in a responsive grid
- Each card: dark background, orange icon, service title, 2-line description, tool tags

**Section 4 — Tools Showcase**
- Background: Dark (#111111) — alternating dark section
- Headline: "TOOLS I USE" Bebas Neue
- Icon grid with tool logos + animated proficiency bar below each
- Slight glow effect on icons (orange box-shadow)

**Section 5 — Resources Preview**
- Background: Light with grid texture
- 3–4 resource cards with torn-paper edge detail
- Handwritten (Caveat) category labels

**Section 6 — Products Preview**
- Background: Dark
- 3–4 product cards with price badges in orange
- Bold headline: "GRAB THESE →"

**Section 7 — Final CTA**
- Background: Solid orange (#FF6B35) — the single boldest section
- Full-width, centered text: Giant Bebas Neue headline in white
- One white button with black text
- Decorative: White noise overlay at 5%

---

### PAGE 2: PORTFOLIO

**Filter Bar**
- Sticky below header
- Category pills: All | YouTube | Social Media | Motion Graphics | Ads
- Active pill: Orange background + white text
- Others: Ghost/outline style

**Project Grid**
- Masonry or uniform 3-column grid on desktop
- Each card: 16:9 thumbnail, hover overlay with project info, orange category tag
- Hover animation: Scale + orange reveal bar at bottom

**Case Study Page Layout**
- Hero: Full-width video embed (16:9)
- Content: Max-width 800px centered, generous typography
- Stats/Results: Large orange numbers with labels (animated counters)
- Process section: Dark background, step-by-step breakdown
- Navigation: Previous / Next project arrows at bottom

---

### PAGE 3: ABOUT

**Hero / Intro**
- Split layout: Profile photo (blob-framed, masking tape accents) left | Text right
- Name in Bebas Neue, personal story in Inter
- Handwritten annotations in Caveat ("why I started", "what drives me")

**Skills Section**
- Dark background
- Tool name + orange animated progress bar
- Proficiency percentage hidden, reveals on hover

**Experience Timeline**
- Light section with grid paper texture
- Vertical orange timeline line
- Left/right alternating entries
- Company/role in Syne 700, description in Inter

**Philosophy & Values**
- Dark section
- Large centered Bebas Neue quote: *"EDITING IS STORYTELLING"* with yellow highlight on a key word
- 3 value pillars: Quality · Speed · Story — each with orange icon and short description

---

### PAGE 4: RESOURCES

**Category Filter** — Same pill filter pattern as Portfolio

**Resource Grid**
- Cards with grid paper texture
- Download icon in orange
- Handwritten Caveat category label
- On hover: Card lifts, orange "Download →" text appears

**Individual Resource Page**
- Title, description, preview image/screenshot
- Orange download button (pill, large)
- Related resources section at bottom

---

### PAGE 5: SHOP

**Product Grid**
- 3-column on desktop, 1-column on mobile
- Price badge: Orange pill in top-right corner of image
- Clean minimal cards on white/dark alternating background

**Individual Product Page**
- Product title in Syne 800
- Price in large orange text
- "What's Included" — checklist with orange checkmarks
- Demo preview: embedded video or screenshot carousel
- Benefits: Icon + short text in 3 columns
- Purchase CTA: Full-width orange button + Razorpay trust badge below

---

### PAGE 6: BLOG

**Grid Layout**
- 3-column masonry grid on desktop
- Each card: Thumbnail (16:9) + category pill + title + excerpt + read time
- Category pills color-coded by topic

**Individual Blog Post**
- Hero image: Full-width with dark vignette overlay + article title centered
- Content: Max-width 720px, Inter 18px body, generous line-height
- Syne 700 for all in-article headings
- Orange horizontal rules between sections
- Related Articles: 3-card row at bottom

---

### PAGE 7: CONTACT

**Layout: Split screen**
- Left: Collaboration CTA text + direct contact info + social links
- Right: Contact form

**Form Design**
- Dark background card (#111)
- Floating labels (animate up on focus)
- Focus state: Orange border + subtle orange glow
- Submit button: Full-width orange pill

**Left Panel**
- Large Bebas Neue headline
- Orange email address
- Social links as circular icon buttons
- Small handwritten (Caveat) annotation: *"let's make something great"*

---

## 9. RESPONSIVE DESIGN RULES

### Desktop (1440px+)
- Full multi-column layouts as described
- All decorative elements visible (tape, arrows, annotations)

### Tablet (768px–1023px)
- 2-column grids replace 3-column
- Hero: Stack vertically (image above, text below)
- Decorative elements reduced (only 1–2 per section)

### Mobile (320px–767px)
- Single column everything
- Font scale: Display 56px → 40px, H1 → 36px
- Marquee speed slows 20% for readability
- Remove grid paper texture (performance)
- Masking tape elements hidden
- CTAs stack vertically, full-width

---

## 10. DARK MODE GUIDELINES

The site is **primarily dark-accent** (alternates light/dark sections) rather than a system-level dark mode toggle. However:

- Respect `prefers-color-scheme: dark` system setting
- In dark mode: Flip light sections to dark (`#111`) and off-white elements to `#222`
- Orange stays orange in both modes
- Grid paper texture inverted (dark lines on dark = subtle, nearly invisible — safe)

---

## 11. ICONOGRAPHY

- **Primary icon library:** Lucide Icons (MIT licensed, consistent stroke style)
- **Tool logos:** Official SVG logos (Adobe, DaVinci, CapCut, Canva, Filmora)
- **Custom icons:** Orange, 2px stroke weight, 24×24px viewbox
- **Social icons:** Circular button treatment (56px), filled orange background

---

## 12. IMAGERY GUIDELINES

- **Profile photo:** High contrast, editorial style — avoid flat passport-style photos
- **Portfolio thumbnails:** 16:9, high saturation, cinematic color grade preferred
- **Blog hero images:** Bold, high-contrast, overlaid with orange or dark gradient
- **Product previews:** Clean mockup-style (device frames or clean flat lay)
- **Background textures:** Subtle, low-opacity — never compete with content
- **AI-generated images:** Acceptable for blog heroes; must maintain color palette consistency

---

## 13. ACCESSIBILITY REQUIREMENTS

- All text on orange backgrounds: White, verified contrast ≥ 4.5:1
- Interactive elements: minimum 44×44px tap target
- All images: meaningful `alt` attributes
- Focus states: Visible orange outline on all focusable elements
- Motion: Respect `prefers-reduced-motion` — disable all decorative animations
- Form fields: Proper `<label>` association, error states in red with icon

---

*END OF DESIGN GUIDELINES — editxsubh.com v1.0*
