# Design System Inspired by Flux

## 1. Visual Theme & Atmosphere

Flux embodies a sleek, technical aesthetic tailored for Gen Z professionals who live and breathe work metrics. The design marries deep, luxurious burgundy and charcoal tones with crisp digital interfaces, creating an environment that feels both premium and utilitarian. Bold contrast, sharp edges where appropriate, and generous whitespace establish a modern dashboard that rewards focus. Animations are subtle but purposeful—micro-interactions that acknowledge user input without distraction. The overall mood is sophisticated minimalism: dark enough to reduce eye strain during long work sessions, warm enough to feel human and inviting, technical enough to communicate precision.

**Key Characteristics**
- Deep wine and brown foundation with tech-forward neutral grays
- High contrast for readability and data clarity
- Geometric, clean shapes with strategic rounded corners
- Smooth micro-interactions and deliberate motion
- Data visualization-first component design
- Accessible color ratios meeting WCAG AA standards

## 2. Color Palette & Roles

### Primary
- **Flux Wine** (`#6B1F3F`): Primary brand color; used for primary CTAs, active states, and key visual anchors
- **Flux Deep Burgundy** (`#8B2E5F`): Hover and emphasis states; bridges wine and secondary brand color
- **Flux Accent Magenta** (`#D946A6`): Highlights, selected items, and interactive focus states; high contrast accent

### Accent Colors
- **Flux Terracotta** (`#C97A47`): Secondary accent for success states, warm highlights, and tertiary CTAs
- **Flux Sage** (`#6B9E7F`): Data visualization categorical color; calm, secondary positive indicator
- **Flux Slate Blue** (`#4A5E8C`): Information badges, links, and quaternary data colors

### Interactive
- **Flux Active** (`#D946A6`): Active/selected states, focus rings, toggle on
- **Flux Hover** (`#A01D6C`): Interactive element hover state; deepens primary
- **Flux Disabled** (`#5A5A5A`): Disabled buttons, inactive form fields, muted states
- **Success Green** (`#10B981`): Positive status indicators, completed tasks, growth metrics
- **Warning Orange** (`#F97316`): Alerts, pending states, and caution indicators
- **Error Red** (`#EF4444`): Critical errors, destructive actions, negative metrics

### Neutral Scale
- **Charcoal** (`#1A1A1A`): Primary text, dark backgrounds, deepest contrast
- **Dark Gray** (`#2D2D2D`): Secondary text, component backgrounds
- **Medium Gray** (`#4A4A4A`): Tertiary text, borders, dividers
- **Light Gray** (`#A0A0A0`): Placeholder text, disabled text, subtle borders
- **Off White** (`#F8F8F8`): Page background, card surfaces, lightest neutral
- **Pure White** (`#FFFFFF`): High-contrast text, elevated surfaces, focus backgrounds

### Surface & Borders
- **Card Surface** (`#232323`): Primary surface for cards, modals, elevated containers
- **Subtle Border** (`#3D3D3D`): Dividers between sections, input borders (default state)
- **Active Border** (`#D946A6`): Form focus borders, active navigation indicators
- **Overlay Dark** (`#000000` at 40% opacity): Backdrop for modals and overlays

### Shadow Colors
- **Shadow Dark** (`#000000` at 8% opacity): Subtle depth for cards and layers
- **Shadow Deeper** (`#000000` at 16% opacity): Medium elevation, popovers, dropdowns
- **Shadow Accent** (`#6B1F3F` at 12% opacity): Wine-tinted shadow for premium surfaces

## 3. Typography Rules

### Font Family
**Primary:** Inter (Google Fonts) — `font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

**Secondary (Monospace for data):** JetBrains Mono (Google Fonts) — `font-family: 'JetBrains Mono', 'Courier New', monospace`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|---|---|
| Display / Hero | Inter | 48px | 700 | 56px | -1.2px | Dashboard title, page headers |
| H1 | Inter | 36px | 700 | 44px | -0.8px | Major section headers |
| H2 | Inter | 28px | 600 | 36px | -0.5px | Subsection headers, card titles |
| H3 | Inter | 24px | 600 | 32px | -0.3px | Widget headers, modal titles |
| Body Large | Inter | 16px | 400 | 24px | 0px | Primary body text, descriptions |
| Body Regular | Inter | 14px | 400 | 22px | 0px | Standard interface text, labels |
| Body Small | Inter | 12px | 400 | 18px | 0px | Secondary info, timestamps, captions |
| Button | Inter | 14px | 600 | 20px | 0.5px | All button text, uppercase-ready |
| Input | Inter | 14px | 400 | 22px | 0px | Form inputs, text fields |
| Link | Inter | 14px | 500 | 22px | 0px | Navigation links, inline CTAs |
| Code / Data | JetBrains Mono | 13px | 400 | 20px | 0px | Data tables, metrics display, code blocks |
| Caption | Inter | 11px | 400 | 16px | 0.3px | Footnotes, legends, subtext |

### Principles
- **Hierarchy through weight and size, not color:** Text contrast driven by semantic roles, supported by size differentiation
- **Line height generosity:** Maintain 1.4–1.5 multiplier for readability in dark mode
- **Letter spacing for emphasis:** Tighter on headlines (negative), looser on buttons and labels
- **Data fidelity:** Monospace fonts for metrics ensure alignment and scanning ease
- **Accessibility first:** All text meets WCAG AA contrast on stated backgrounds

## 4. Component Stylings

### Buttons

**Primary Button**
- `background-color: #6B1F3F`
- `color: #FFFFFF`
- `padding: 12px 24px`
- `border-radius: 8px`
- `border: none`
- `font-size: 14px`
- `font-weight: 600`
- `letter-spacing: 0.5px`
- `cursor: pointer`
- `transition: all 200ms ease-in-out`
- **Hover:** `background-color: #A01D6C`, `box-shadow: 0 4px 12px rgba(107, 31, 63, 0.3)`
- **Active:** `background-color: #5A1633`, `transform: scale(0.98)`
- **Disabled:** `background-color: #5A5A5A`, `color: #A0A0A0`, `cursor: not-allowed`

**Secondary Button**
- `background-color: transparent`
- `color: #D946A6`
- `padding: 12px 24px`
- `border-radius: 8px`
- `border: 2px solid #D946A6`
- `font-size: 14px`
- `font-weight: 600`
- `letter-spacing: 0.5px`
- `cursor: pointer`
- `transition: all 200ms ease-in-out`
- **Hover:** `background-color: #D946A6`, `color: #FFFFFF`, `box-shadow: 0 4px 12px rgba(217, 70, 166, 0.2)`
- **Active:** `background-color: #A01D6C`, `border-color: #A01D6C`, `color: #FFFFFF`
- **Disabled:** `border-color: #5A5A5A`, `color: #5A5A5A`, `cursor: not-allowed`

**Ghost Button**
- `background-color: transparent`
- `color: #A0A0A0`
- `padding: 12px 24px`
- `border-radius: 8px`
- `border: none`
- `font-size: 14px`
- `font-weight: 600`
- `letter-spacing: 0.5px`
- `cursor: pointer`
- `transition: all 200ms ease-in-out`
- **Hover:** `color: #D946A6`, `background-color: rgba(217, 70, 166, 0.08)`
- **Active:** `color: #D946A6`, `background-color: rgba(217, 70, 166, 0.12)`
- **Disabled:** `color: #5A5A5A`, `cursor: not-allowed`

### Cards & Containers

**Card Surface**
- `background-color: #232323`
- `border-radius: 12px`
- `border: 1px solid #3D3D3D`
- `padding: 24px`
- `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)`
- `transition: all 200ms ease-in-out`
- **Hover (interactive card):** `border-color: #6B1F3F`, `box-shadow: 0 6px 20px rgba(107, 31, 63, 0.12)`

**Card Header**
- `border-bottom: 1px solid #3D3D3D`
- `padding-bottom: 16px`
- `margin-bottom: 16px`
- `display: flex`
- `justify-content: space-between`
- `align-items: center`

**Widget Container** (Smaller card variant)
- `background-color: #232323`
- `border-radius: 8px`
- `border: 1px solid #3D3D3D`
- `padding: 16px`
- `box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06)`

### Inputs & Forms

**Text Input (Default)**
- `background-color: #1A1A1A`
- `color: #FFFFFF`
- `border: 1px solid #3D3D3D`
- `border-radius: 8px`
- `padding: 12px 16px`
- `font-size: 14px`
- `font-family: 'Inter', sans-serif`
- `line-height: 22px`
- `transition: all 200ms ease-in-out`
- **Focus:** `border-color: #D946A6`, `outline: none`, `box-shadow: 0 0 0 3px rgba(217, 70, 166, 0.1)`
- **Hover (unfocused):** `border-color: #4A4A4A`
- **Disabled:** `background-color: #2D2D2D`, `color: #5A5A5A`, `border-color: #3D3D3D`, `cursor: not-allowed`

**Placeholder Text**
- `color: #A0A0A0`

**Label**
- `font-size: 12px`
- `font-weight: 600`
- `color: #A0A0A0`
- `display: block`
- `margin-bottom: 8px`
- `text-transform: uppercase`
- `letter-spacing: 0.5px`

**Error State**
- `border-color: #EF4444`
- `box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1)`

**Success State**
- `border-color: #10B981`
- `box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1)`

**Checkbox / Radio**
- `width: 20px`
- `height: 20px`
- `border-radius: 4px` (checkbox) / `border-radius: 50%` (radio)
- `border: 2px solid #3D3D3D`
- `background-color: #1A1A1A`
- `cursor: pointer`
- **Checked:** `background-color: #D946A6`, `border-color: #D946A6`, `accent-color: #FFFFFF`
- **Focus:** `outline: 2px solid #D946A6`, `outline-offset: 2px`

### Navigation

**Nav Bar Container**
- `background-color: #1A1A1A`
- `border-bottom: 1px solid #3D3D3D`
- `padding: 0 32px`
- `height: 64px`
- `display: flex`
- `align-items: center`
- `gap: 48px`

**Nav Item (Default)**
- `color: #A0A0A0`
- `font-size: 14px`
- `font-weight: 500`
- `padding: 8px 12px`
- `border-radius: 6px`
- `cursor: pointer`
- `transition: all 150ms ease-in-out`
- **Hover:** `color: #D946A6`, `background-color: rgba(217, 70, 166, 0.06)`
- **Active:** `color: #D946A6`, `border-bottom: 2px solid #D946A6`, `background-color: transparent`

**Sidebar Item**
- `padding: 12px 16px`
- `border-radius: 8px`
- `margin-bottom: 8px`
- `color: #A0A0A0`
- `font-size: 14px`
- `font-weight: 500`
- `cursor: pointer`
- `transition: all 150ms ease-in-out`
- **Hover:** `background-color: rgba(217, 70, 166, 0.08)`, `color: #D946A6`
- **Active:** `background-color: #6B1F3F`, `color: #FFFFFF`

### Badges

**Badge Primary**
- `background-color: #6B1F3F`
- `color: #FFFFFF`
- `padding: 6px 12px`
- `border-radius: 6px`
- `font-size: 11px`
- `font-weight: 600`
- `display: inline-block`
- `letter-spacing: 0.3px`

**Badge Status (Success)**
- `background-color: #10B981`
- `color: #FFFFFF`
- `padding: 6px 12px`
- `border-radius: 6px`
- `font-size: 11px`
- `font-weight: 600`

**Badge Status (Warning)**
- `background-color: #F97316`
- `color: #1A1A1A`
- `padding: 6px 12px`
- `border-radius: 6px`
- `font-size: 11px`
- `font-weight: 600`

**Badge Status (Error)**
- `background-color: #EF4444`
- `color: #FFFFFF`
- `padding: 6px 12px`
- `border-radius: 6px`
- `font-size: 11px`
- `font-weight: 600`

**Badge Outline**
- `background-color: transparent`
- `color: #D946A6`
- `border: 1px solid #D946A6`
- `padding: 6px 12px`
- `border-radius: 6px`
- `font-size: 11px`
- `font-weight: 600`

### Tables

**Table Container**
- `background-color: #232323`
- `border-radius: 12px`
- `border: 1px solid #3D3D3D`
- `overflow: hidden`

**Table Header**
- `background-color: #1A1A1A`
- `border-bottom: 2px solid #3D3D3D`

**Table Header Cell**
- `padding: 16px`
- `color: #A0A0A0`
- `font-size: 12px`
- `font-weight: 600`
- `letter-spacing: 0.5px`
- `text-align: left`
- `text-transform: uppercase`

**Table Body Cell**
- `padding: 16px`
- `color: #FFFFFF`
- `font-size: 14px`
- `border-bottom: 1px solid #3D3D3D`
- `font-family: 'JetBrains Mono', monospace` (for numeric data)

**Table Row Hover**
- `background-color: rgba(217, 70, 166, 0.04)`

**Striped Row (even)**
- `background-color: #1A1A1A`

### Data Visualizations / Metrics

**Metric Card**
- `background-color: #232323`
- `border: 1px solid #3D3D3D`
- `border-radius: 8px`
- `padding: 16px`

**Metric Value**
- `font-size: 32px`
- `font-weight: 700`
- `color: #FFFFFF`
- `font-family: 'JetBrains Mono', monospace`

**Metric Label**
- `font-size: 12px`
- `font-weight: 600`
- `color: #A0A0A0`
- `margin-top: 8px`
- `text-transform: uppercase`
- `letter-spacing: 0.3px`

**Metric Change (Positive)**
- `color: #10B981`
- `font-size: 13px`
- `font-weight: 500`

**Metric Change (Negative)**
- `color: #EF4444`
- `font-size: 13px`
- `font-weight: 500`

## 5. Layout Principles

### Spacing System
**Base Unit:** 8px

**Spacing Scale:**
- `4px` — micro-spacing (button icon gap, tight lists)
- `8px` — xs (small padding, tight components)
- `12px` — sm (input padding, small gaps)
- `16px` — md (card padding, section gaps)
- `24px` — lg (section padding, spacing between major sections)
- `32px` — xl (major layout padding, hero spacing)
- `48px` — 2xl (full-page margins, hero top spacing)

**Usage Contexts:**
- Buttons: `12px vertical`, `24px horizontal`
- Cards: `24px padding`
- Section gaps: `24px` or `32px`
- Input fields: `12px` padding vertical, `16px` horizontal
- Widget spacing: `16px`

### Grid & Container
**Max Width:** `1400px` for main dashboard content

**Column Strategy:** 12-column grid with `16px` gutter
- Dashboard layout: 3-column grid for widgets (4 columns each, 16px gaps)
- On medium screens: 2-column grid (6 columns each)
- On small screens: 1-column full-width

**Section Patterns:**
- Full-bleed header with `32px` vertical padding
- Content area with `32px` horizontal padding, centered within max-width
- Sidebar + main content: sidebar fixed `280px` width, main content flexible

### Whitespace Philosophy
Flux employs generous whitespace to reduce cognitive load during long work sessions. Negative space around interactive elements creates clear affordances and breathing room. Cards are spaced `24px` apart vertically, creating distinct visual zones. The dark background naturally reduces visual noise, so whitespace is used to clarify hierarchy rather than create drama.

### Border Radius Scale
- `4px` — small UI elements (checkboxes, small badges)
- `6px` — input fields, small buttons, tight components
- `8px` — buttons, cards, navigation items, most interactive elements
- `12px` — major cards, modals, elevated surfaces
- `16px` — large containers, hero sections, rounded corners for emphasis
- `50%` — avatars, circular status indicators, radio buttons

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| 0 (Base) | `box-shadow: none`, `background: #1A1A1A` | Page background, base surfaces |
| 1 (Card) | `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)` | Card containers, widgets, standard surfaces |
| 2 (Raised) | `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12)` | Hovered cards, input focus, popovers |
| 3 (Floating) | `box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16)` | Modals, dropdowns, primary popovers |
| 4 (Premium) | `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16), 0 0 16px rgba(107, 31, 63, 0.12)` | Featured cards, premium UI elements |

**Shadow Philosophy**

Depth in Flux is subtle and intentional. Rather than aggressive shadows suggesting distance, the system employs soft elevation that hints at layering without breaking the cohesive dark aesthetic. The wine-tinted shadow for premium surfaces (Level 4) creates a signature, brand-aligned depth cue. Shadows should be used sparingly to highlight interactive moments—hover states, focus, and modal overlays—rather than as default styling. This maintains the technical, forward-focused personality while adding warmth through the burgundy color.

## 7. Do's and Don'ts

### Do
- **Use color intentionally:** Reserve `#D946A6` for primary CTAs and active states; resist over-saturating the interface
- **Prioritize readability:** Ensure all text meets WCAG AA contrast on stated backgrounds (minimum 4.5:1 for body text)
- **Embrace whitespace:** Let components breathe with generous margins; dark backgrounds can feel cramped if over-packed
- **Animate purposefully:** Use 200ms easing for interactive states; avoid flashy, distracting motion
- **Stack semantic colors:** Use success, warning, and error consistently across all data feedback
- **Test data density:** Ensure tables and metrics remain scannable even when packed with numbers
- **Use monospace for metrics:** Display all numeric data in JetBrains Mono for alignment and clarity
- **Support dark mode habitually:** All colors are designed for dark-mode-first, so apply consistently

### Don't
- **Avoid light grays on dark backgrounds:** Use `#A0A0A0` or lighter for secondary text; never go dimmer
- **Don't mix shadows:** Stick to the 5-level shadow system; custom shadows dilute the design language
- **Avoid over-rounded corners:** Only round above `8px` for major containers; tight UI should use `4px`–`6px`
- **Don't use saturation as hierarchy:** Use size and weight; color saturation should signal status, not importance
- **Avoid sans-serif for numeric display:** Data must use monospace for scanning efficiency
- **Don't ignore focus states:** Every interactive element must have a visible focus ring for accessibility
- **Avoid accent color on large surfaces:** Reserve `#D946A6` for buttons, badges, and highlights; paint large areas with `#6B1F3F`
- **Don't override disabled states:** Gray out disabled elements consistently; never hide them or strip styling entirely

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|--|
| Mobile | 320px–639px | Single-column layout, full-width cards, bottom navigation, touch-friendly 48px targets |
| Tablet | 640px–1023px | 2-column widget grid, sidebar collapses to nav drawer, 44px touch targets |
| Desktop | 1024px+ | 3-column widget grid, fixed sidebar, 12-column layout grid active, dense tables |
| Wide | 1400px+ | Max-width container constraint applied, hero section expanded |

### Touch Targets
- **Minimum interactive size:** `44px × 44px` on tablet/mobile
- **Recommended button height:** `12px vertical padding` = `36px–40px` total on desktop
- **Link padding:** `8px` minimum on all sides to create easy tap zones
- **Icon size with padding:** `24px icon` + `8px padding` = `40px` minimum target

### Collapsing Strategy
**Mobile Collapse (320px–639px):**
- Sidebar hides; navigation moves to bottom drawer or hamburger menu
- Widget grid becomes single column
- Tables stack vertically or become scrollable horizontally with sticky first column
- Modals take full screen minus system chrome
- Padding reduces to `16px` horizontal

**Tablet Adaptation (640px–1023px):**
- Sidebar toggles to slide-out drawer (280px width)
- Widget grid becomes 2 columns (6 columns each in 12-column grid)
- Tables remain horizontal with horizontal scroll on overflow
- Padding: `24px` horizontal
- Navigation tabs may condense to icon + label

**Desktop Expansion (1024px+):**
- Sidebar fixed at 280px width, always visible
- Widget grid 3 columns (4 columns each)
- Full table display without scrolling (where possible)
- Padding: `32px` horizontal
- All features visible by default

**Flexible Elements:**
- Charts and graphs scale within their containers
- Data visualizations use `100%` width, constrained by parent card
- Form layouts stack single-column on mobile, 2-column on desktop if space permits
- Navigation breadcrumbs hide on mobile; appear on tablet+

## 9. Agent Prompt Guide

### Quick Color Reference
Use these mappings as a quick lookup when implementing Flux components:

- **Primary CTA Buttons:** Flux Wine (`#6B1F3F`)
- **Active / Selected State:** Flux Accent Magenta (`#D946A6`)
- **Page Background:** Charcoal (`#1A1A1A`)
- **Card / Surface Background:** Dark Gray (`#2D2D2D`) or Card Surface (`#232323`)
- **Primary Text / Headings:** Pure White (`#FFFFFF`)
- **Secondary Text / Labels:** Light Gray (`#A0A0A0`)
- **Borders (default):** Subtle Border (`#3D3D3D`)
- **Borders (focus / active):** Active Border (`#D946A6`)
- **Success Indicator:** Success Green (`#10B981`)
- **Warning / Pending:** Warning Orange (`#F97316`)
- **Error / Destructive:** Error Red (`#EF4444`)
- **Disabled State:** Flux Disabled (`#5A5A5A`)
- **Secondary CTA / Outline:** Flux Accent Magenta (`#D946A6`) with transparent bg + border
- **Hover State (primary button):** Flux Hover (`#A01D6C`)
- **Link Color:** Flux Slate Blue (`#4A5E8C`)

### Iteration Guide

1. **All component backgrounds default to Card Surface (`#232323`) or primary surface (`#1A1A1A`); use `border: 1px solid #3D3D3D` for all card/container borders.**

2. **Typography: Headings use Inter 700 with negative letter-spacing (-0.5px to -1.2px); body uses Inter 400 at 14px–16px; numeric data always uses JetBrains Mono 13px–14px.**

3. **Buttons always have `border-radius: 8px`; primary buttons are `#6B1F3F` bg with white text; secondary buttons have transparent bg + `#D946A6` border; both require 200ms transition and hover state with shadow.**

4. **Form inputs: `background: #1A1A1A`, `border: 1px solid #3D3D3D`, `border-radius: 8px`, `padding: 12px 16px`; focus state adds `border-color: #D946A6` and `box-shadow: 0 0 0 3px rgba(217, 70, 166, 0.1)`.**

5. **All interactive elements require visible focus ring and hover state; never remove outline; use `outline: 2px solid #D946A6` or box-shadow equivalent.**

6. **Status colors are non-negotiable: green (`#10B981`) for success, orange (`#F97316`) for warning, red (`#EF4444`) for error; apply consistently across badges, charts, and indicators.**

7. **Spacing follows 8px base unit: buttons `12px × 24px`, cards `24px` padding, section gaps `24px`–`32px`, widget grid gaps `16px`.**

8. **Text color hierarchy: primary text is `#FFFFFF`, secondary is `#A0A0A0`, labels/captions are uppercase `#A0A0A0` with `letter-spacing: 0.5px`.**

9. **Shadows are minimal and strategic: use `0 2px 8px rgba(0,0,0,0.08)` for cards, `0 4px 12px rgba(0,0,0,0.12)` for hover, `0 6px 20px rgba(0,0,0,0.16)` for modals; wine-tinted shadows (`rgba(107, 31, 63, 0.12)`) reserved for premium/brand surfaces.**

10. **Border radius: `4px` for tight UI (checkboxes, small badges), `6px` for inputs, `8px` for buttons/nav items, `12px` for major cards, `50%` for avatars and circular indicators.**