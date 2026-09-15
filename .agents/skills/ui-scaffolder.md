# Name: UI Scaffolder & Aesthetic Tailwind Builder (agy agent)

# Description: Automates generating, styling, and polishing Next.js 15 pages, layouts, and forms using Tailwind CSS with premium dark-mode support.

## Activation Trigger

- Triggered when asked to construct, design, style, or scaffold a new user interface, page, interactive form, dashboard, card, or navigation component.

## Core Execution Rules

### 1. Color Palette & Dark Mode System

- Use high-contrast, premium color combinations rather than generic shades.
  - Light Mode: Slate/zinc backgrounds (`bg-slate-50`), crisp white cards (`bg-white`), dark slate text (`text-slate-900`), and indigo/violet brand highlights (`bg-indigo-600 hover:bg-indigo-700`).
  - Dark Mode: Deep gray backgrounds (`dark:bg-slate-950`), dark card borders (`dark:border-slate-800`), sub-borders (`dark:bg-slate-900/50`), and vibrant indigo/violet highlights (`dark:text-indigo-400`).
- Ensure all interactive elements include standard Tailwind dark mode variants (prefixed with `dark:`).

### 2. Interaction & Micro-Animations

- Build highly responsive interactive elements. Every clickable item must have:
  - Transition animations: `transition-all duration-200 ease-in-out` or `transition-colors duration-200`.
  - Hover states: Highlight colors, scales (`hover:scale-[1.02]`), or slight shadows (`hover:shadow-md`).
  - Focus ring states: Provide clear focus rings for accessibility (`focus:ring-2 focus:ring-indigo-500 focus:outline-none`).

### 3. Layout & Structure (Mobile First)

- Utilize Flexbox and CSS Grid designs with responsive layouts:
  - Default layout starts mobile-friendly (`grid-cols-1`, `w-full`).
  - Use breakpoint responsive prefixes (`sm:grid-cols-2 lg:grid-cols-3` or `md:flex-row`).
  - Maintain consistent padding and margins (`p-4 sm:p-6 lg:p-8`, `gap-6`).

### 4. Next.js 15 App Router & Type Standards

- Maintain Server Component standards: default to React Server Components (RSC).
- Add `'use client'` only at the absolute top of the file when client state, hooks (`useState`, `useEffect`), or interactions are required.
- Do not use `any`. Always define explicit type interfaces for props and dataset formats.

## Execution Workflow

1. **Anatomy Drafting**
   - Outline the semantic HTML layout structure (`<main>`, `<section>`, `<header>`, `<form>`, `<footer>`).
2. **Tailwind Design Application**
   - Apply utility classes for grids, padding, typography, colors, and borders.
3. **Dark Mode Integration**
   - Walk through classes to verify dark mode equivalents are set for backgrounds, text, and borders.
4. **State & Logic Binding**
   - Implement loading skeletons (`animate-pulse`), error indicators, input validations, and action states.
