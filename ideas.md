# Dayflow Design Exploration

## Three visual directions

### Approach 1 — Human Rhythm
**Very Brief Intro:** A calm, editorial productivity workspace that turns everyday HR operations into clear, reassuring moments of progress. Soft daylight tones and a disciplined, tactile interface make administrative work feel more humane.

**Probability:** 0.07

### Approach 2 — Signal Room
**Very Brief Intro:** A dark operational control room with high-contrast data signals, dense interaction surfaces, and confident status language. It makes Dayflow feel like an always-on command center for modern people operations.

**Probability:** 0.04

### Approach 3 — Paper Motion
**Very Brief Intro:** A warm, contemporary dashboard that carries forward the source PDF’s yellow highlighter energy through structured color marks, white-space, and paper-like layering. The result is both unmistakably Dayflow and easy to scan.

**Probability:** 0.09

---

## Chosen direction — Paper Motion

### Design Movement
**Contemporary editorial systems design**, influenced by refined business reporting, annotated notebooks, and Swiss information hierarchy. It turns HR administration into an approachable, guided workspace instead of a dense enterprise interface.

### Core Principles
1. **Clarity before density:** Information must be grouped into strong visual layers, with action states and next steps immediately visible.
2. **Human operational tone:** Data is precise, but the visual language stays warm, encouraging, and respectful of the person behind each record.
3. **Marked moments:** Yellow annotation strokes, badges, and timeline nodes direct attention to work that matters now.
4. **Intentional asymmetry:** The landing experience uses editorial columns, while the working dashboard uses a purposeful sidebar and varied-card composition—not a flat, uniform card grid.

### Color Philosophy
The foundation is **porcelain white and mist grey**, representing transparency and reliability. A deep **ink navy** anchors documents, data, and navigation, avoiding impersonal pure black. **Dayflow Saffron** is used only as an annotation color—a noticeable signal for priority, momentum, and approved progress—rather than as indiscriminate decoration. Moss, coral, and sky accents provide understandable success, alert, and informational statuses.

### Layout Paradigm
The overall site moves from an **editorial product story** into an embedded application experience. The homepage begins with an asymmetrical left narrative column, then reveals a large app canvas. The interactive dashboard uses a fixed vertical operations rail, a utility strip, a broad activity column, and a narrower “today” column. Breakpoint behavior collapses the operations rail into an accessible menu while preserving priority actions.

### Signature Elements
1. **Saffron swash:** A compact, irregular yellow underline/mark that appears behind section labels, active navigation, and key metrics.
2. **Date rail:** A vertical sequence of small day markers used in attendance, leave, and approval contexts to make time visible at a glance.
3. **Paper planes:** Slightly offset, layered panels with soft paper shadows and fine hairline borders, creating a tactile workspace without excessive rounding.

### Interaction Philosophy
Interactivity should reduce uncertainty. Active navigation has an immediate, visible shift; approval actions show a concise confirmation; clickable work items reveal a lightweight detail layer instead of taking users to dead ends. Hover states should sharpen hierarchy rather than add spectacle. All placeholder actions clearly indicate that the working prototype is demonstrating a future production capability.

### Animation
Use 160–240ms, **cubic-bezier(0.23, 1, 0.32, 1)** transitions for hover elevation, navigation changes, and small panel reveals. On initial load, content may enter through short opacity and 8–12px upward transforms with a 40ms stagger. The saffron stroke can subtly expand into place when a section becomes active. Respect `prefers-reduced-motion` and avoid animation during frequent actions.

### Typography System
Headlines use **DM Serif Display** for a confident, human editorial voice. Body copy, navigation, data labels, and controls use **Manrope** for highly legible contemporary utility. Headings should be concise and generously spaced; dashboard numbers use Manrope semi-bold with tabular numeric settings. Avoid generic sans-serif-only compositions.

### Brand Essence
**Dayflow is the people-operations workspace that makes every workday easier to see, manage, and move forward.**

**Personality:** Thoughtful, assured, approachable.

### Brand Voice
Dayflow speaks in short, active, respectful language. Headlines describe a concrete operational benefit; calls to action name the next useful step; microcopy confirms context rather than repeating generic instructions.

> “People operations, in step with the workday.”

> “Review the requests waiting for your decision.”

### Wordmark & Logo
The Dayflow mark is a **stepped sunpath**: three softly angled horizontal arcs that build into a subtle forward arrow. It suggests both a day moving across time and a team making steady progress. The wordmark is set in Manrope 700 with a slightly tightened tracking, paired with the black-and-saffron mark.

### Signature Brand Color
**Dayflow Saffron — `#F9B62D`**. This is a high-visibility annotation color used sparingly to guide attention and make Dayflow immediately recognizable.

## Style Decisions

- The source PDF’s yellow highlighter motif is translated into thin, irregular saffron strokes—not copied literally.
- The concept does not reuse the source document’s Odoo logo or branding. Dayflow has its own product identity.
- All sample employees, status values, and payroll figures are illustrative interface content only, chosen to show the defined HR workflows.
- **Dayflow Saffron `#F9B62D` is an annotation color only:** it guides attention through strokes, active states, small badges, key numerals, and primary actions rather than broad decorative surfaces.
- **Paper planes appear throughout the experience:** slightly offset document layers, fine borders, clipped inserts, small tabs, and tactile shadows prevent generic uniform card grids.
- **The date rail is a recurring Dayflow motif:** attendance, leave, approvals, and reporting visibly reference workday progression through small rails, marked nodes, or decision moments.
