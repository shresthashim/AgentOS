# AgentOS landing page

Marketing site for AgentOS, a workflow automation platform. The hero shows a 3D
workflow canvas: step cards for real apps joined by wires, with a pulse of data
moving through and an approval step that changes from waiting to approved.
Visitors can switch between four example workflows.

## Run

```bash
npm install
npx next dev --port 3400     # http://localhost:3400
npx next build && npx next start --port 3400
```

The landing page is hosted at `https://agentos.vercel.app`. Its app links go to
`https://agentos-app.vercel.app` by default. Set `NEXT_PUBLIC_APP_URL` in
`.env.local` to test against a local dashboard.

## Sections

1. Hero: 3D workflow canvas with workflow tabs
2. Integrations hub: AgentOS wired to each connected app, with data flowing
3. Before and after: the same weekly job by hand and with AgentOS (toggle)
4. How it works: a sticky builder preview that changes as you scroll the three steps
5. Featured templates: four real-world workflows with their flow at a glance
6. Teams: photos and workflow examples by team
7. Trust: approvals, run history, schedules, versions, roles and access
8. FAQ and a final call to action

Light and dark themes follow the system setting. The navigation toggle uses a
brief crossfade and switches instantly with reduced motion.

## Stack

- Next.js 16 (App Router, static prerender), React 19, Tailwind CSS 4
- Three.js with React Three Fiber 9 and drei for the hero canvas
- Motion for in-view detection and reduced-motion support; lucide-react icons
- Schibsted Grotesk (headlines) and DM Sans (text), self-hosted through `next/font/local`
  (SIL Open Font License, see `src/app/fonts/`)
- next-themes for light and dark

## Where things are

| Path | What it is |
| --- | --- |
| `src/components/hero/` | Hero, the 3D scene (`flow-scene.tsx`) and card faces (`node-face.ts`) |
| `src/components/sections/` | All page sections |
| `src/lib/site.ts` | App URL, connected apps, templates and the hero workflows |
| `public/apps/` | App icons |
| `public/images/` | Team photos (Pexels, free to use without attribution) |

## Behaviour notes

- The 3D canvas loads on the client only, pauses when it scrolls out of view,
  and shows a static drawing without WebGL. On narrow screens the workflow runs
  top to bottom.
- With reduced motion, cards appear without animation, the pulse is hidden and
  the hero does not change workflows by itself.
- The workflow tabs and team tabs are keyboard tabs (arrow keys move between them).
  Screen readers get the selected workflow as an ordered list of steps.

## Before launch

- There are no customer quotes or logos. Add them only with each customer's permission.
- Example names and addresses use `.example` domains.
