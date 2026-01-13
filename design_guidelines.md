# Design Guidelines: Secure Video Course Platform

## Design Approach
**System-Based:** Apple HIG-inspired minimalist design emphasizing content hierarchy and educational focus. Clean, professional aesthetic prioritizing readability and clarity over visual flourish.

## Typography
- **Primary Font:** Inter or SF Pro Display (Google Fonts CDN)
- **Scale:**
  - H1: text-4xl font-bold (page titles)
  - H2: text-2xl font-semibold (module titles)
  - H3: text-xl font-medium (lesson titles)
  - Body: text-base (content, descriptions)
  - Small: text-sm (metadata, timestamps)

## Layout System
**Spacing Units:** Tailwind 4, 6, 8, 12, 16 for consistent rhythm
- Container: max-w-6xl mx-auto
- Section padding: py-8 to py-16
- Component spacing: space-y-6 for vertical stacks
- Card padding: p-6

## Core Components

### Navigation
- Top bar with platform logo, user email, logout button
- Minimal, fixed header (h-16)
- Clean divider line below

### Login Page (/login)
- Centered card (max-w-md)
- Email input field
- Magic link button (primary CTA)
- Minimal branding, no hero image
- Footer with disclaimer text

### Dashboard (/dashboard)
- Left sidebar or top navigation showing course structure
- Main content area displaying modules as collapsible accordions
- Each module shows:
  - Title and lesson count
  - Progress bar (percentage complete)
  - List of lessons with checkmark indicators
- Lessons display as clickable rows with title and duration

### Lesson Page (/lesson/[id])
- Two-column layout (desktop): 70% video / 30% info
- Single column (mobile): Video top, info below
- Video player embedded (16:9 aspect ratio)
- Lesson info panel:
  - Title and description
  - "Mark as Complete" checkbox (large, clear)
  - Module navigation (previous/next)
- No sidebars or distractions during playback

### Progress Indicators
- Linear progress bars (rounded, subtle)
- Checkmarks for completed lessons (filled circle with check icon)
- Uncompleted lessons (empty circle outline)

### Forms & Inputs
- Single-line text inputs with clear labels above
- Minimal borders (border-b-2 style)
- Focus states with subtle color shift
- Large touch targets (min h-12)

## UI Patterns
- **Cards:** Subtle borders, no shadows, rounded corners (rounded-lg)
- **Buttons:** 
  - Primary: Solid fill, rounded-md, h-12, px-6
  - Secondary: Outline style
- **Icons:** Heroicons (outline style for UI, solid for status)
- **Spacing:** Generous whitespace between sections
- **Dividers:** Subtle 1px borders to separate content zones

## Interactions
- Minimal animations (fade in/out only)
- Instant state changes for checkboxes
- Smooth accordion expand/collapse for modules
- No hover effects on video player overlay

## Footer
- Fixed disclaimer text: "Deze content is informatief en geen juridisch advise."
- Centered, small text (text-xs)
- Light background separator

## Images
**None required.** This is a post-login utility application focused on video content and course structure. All visual content comes from embedded Vimeo videos.

**Key Principle:** Prioritize clarity, scannability, and distraction-free learning. Every element serves a functional purpose.