---
name: Academic Excellence
colors:
  surface: '#f8f9ff'
  surface-dim: '#d7dae2'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3fc'
  surface-container: '#ebeef6'
  surface-container-high: '#e5e8f0'
  surface-container-highest: '#dfe2eb'
  on-surface: '#181c22'
  on-surface-variant: '#424654'
  inverse-surface: '#2d3137'
  inverse-on-surface: '#eef1f9'
  outline: '#737785'
  outline-variant: '#c3c6d6'
  surface-tint: '#0056d2'
  primary: '#0040a1'
  on-primary: '#ffffff'
  primary-container: '#0056d2'
  on-primary-container: '#ccd8ff'
  inverse-primary: '#b2c5ff'
  secondary: '#565e71'
  on-secondary: '#ffffff'
  secondary-container: '#d8dff5'
  on-secondary-container: '#5b6375'
  tertiary: '#822800'
  on-tertiary: '#ffffff'
  tertiary-container: '#a93802'
  on-tertiary-container: '#ffcebd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001847'
  on-primary-fixed-variant: '#0040a1'
  secondary-fixed: '#dae2f8'
  secondary-fixed-dim: '#bec6dc'
  on-secondary-fixed: '#131c2b'
  on-secondary-fixed-variant: '#3f4758'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#812800'
  background: '#f8f9ff'
  on-background: '#181c22'
  surface-variant: '#dfe2eb'
typography:
  display-lg:
    fontFamily: Source Sans 3
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Source Sans 3
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Source Sans 3
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Source Sans 3
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Source Sans 3
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Source Sans 3
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Source Sans 3
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Source Sans 3
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 48px
  margin-tablet: 24px
  margin-mobile: 16px
---

## Brand & Style

This design system embodies a **Corporate Modern** aesthetic tailored for high-stakes learning and professional development. The brand personality is authoritative yet accessible, designed to build immediate trust with learners, educators, and enterprise partners. 

The visual language prioritizes clarity and structured information density. It utilizes a "Professional Utility" approach—where every element serves a functional purpose, avoiding decorative clutter in favor of clean lines, intentional whitespace, and a sophisticated color palette that signals reliability and global scale. The target audience includes career-driven professionals and students who require an environment that feels academic, stable, and results-oriented.

## Colors

The palette is anchored by a signature "University Blue" (`#0056D2`), which acts as the primary driver for actions and brand recognition. 

- **Primary:** Used for high-emphasis buttons, active states, and key navigational elements.
- **Secondary:** A professional slate grey used for secondary actions and supporting UI elements to provide contrast without competing with the primary blue.
- **Neutral:** A deep charcoal used for maximum legibility in typography.
- **Surface-Alt:** A cool, soft blue-grey tint used for section backgrounds and card groupings to define layout boundaries without the harshness of solid lines.

## Typography

The typography system utilizes **Source Sans 3** (the modern successor to Source Sans Pro) across all levels to maintain a rational, highly legible, and neutral tone. 

The hierarchy is strictly organized to facilitate "scanning" of dense educational content. Headlines use tighter letter spacing and heavier weights to command attention, while body text maintains a generous line height for long-form reading comfort. Labels and metadata utilize semi-bold and bold weights at smaller sizes to ensure they remain distinct within complex card layouts.

## Layout & Spacing

This design system uses a **Fixed-Fluid Hybrid Grid**. Content is constrained to a maximum width of 1200px for optimal readability on desktop, centered with fluid margins.

- **Grid:** A 12-column system is used for desktop and tablet, collapsing to 4 columns on mobile. 
- **Rhythm:** An 8px linear scale governs all padding and margins. 
- **Vertical Spacing:** Generous section vertical padding (often 64px to 96px) is encouraged to create a sense of "breathing room" and prestige, preventing the UI from feeling crowded or overly commercial.

## Elevation & Depth

Hierarchy is achieved primarily through **Tonal Layers** and **Low-Contrast Outlines** rather than aggressive shadows. 

- **Level 0:** The main canvas uses `#FFFFFF`.
- **Level 1:** Section backgrounds use `#F2F5FA` to create distinct horizontal logical blocks.
- **Level 2:** Cards and interactive containers use a 1px solid border (`#D1D7E0`) with a very soft, high-diffusion shadow (8px blur, 4% opacity) only to indicate interactivity.
- **Floating:** Modals and dropdowns use a more pronounced shadow to separate them from the primary content plane.

## Shapes

The shape language is modern and approachable. A **Rounded** (`0.5rem`) corner radius is the standard for most components, including buttons, input fields, and small cards. 

This increased rounding creates a more contemporary and accessible feel compared to tighter technical aesthetics. Larger containers like featured course cards may use `rounded-lg` (`1rem`) to appear more welcoming and distinct, but "pill" shapes are reserved strictly for status tags and badges.

## Components

### Buttons
- **Primary:** Solid `#0056D2` with white text. High-contrast, rectangular with standard 0.5rem rounding. 16px horizontal padding.
- **Secondary:** Transparent background with a 1px `#0056D2` border.
- **Ghost:** No border, primary blue text, used for tertiary actions in navigation.

### Cards
Cards are the primary vehicle for course information. They must feature a white background, a 1px subtle border, and a consistent internal padding of 24px. The `rounded-lg` (1rem) radius should be applied to the container to maintain the approachable brand feel.

### Input Fields
Inputs use a white background with a `#31394A` border that thickens and changes to primary blue on focus. The 0.5rem radius ensures consistency with the primary button language.

### Navigation
The header is a high-visibility white bar with a persistent shadow or border. It should prioritize a "Mega-Menu" style for categories and a clear search bar with a prominent "Join for Free" primary action on the far right.

### Tags & Badges
Small, capitalized labels with increased letter spacing. Used for difficulty levels (e.g., "Beginner") or credentials. Use muted background tints of the primary color with dark text for accessibility, utilizing a pill shape for clear visual differentiation.