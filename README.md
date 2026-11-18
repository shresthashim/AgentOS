<h1 align="center">AgentOS</h1>

<p align="center"><strong>Turn recurring work into workflows your team can run and trace.</strong></p>

<p align="center">
  Pull sales from a spreadsheet, draft the weekly update, and send it through Gmail.<br />
  Build the steps once, test with sample data, and see what happened on every run.
</p>

<p align="center">
  <a href="https://agentos.vercel.app"><strong>Explore AgentOS</strong></a>
  &nbsp;·&nbsp;
  <a href="https://agentos-app.vercel.app"><strong>Open the dashboard</strong></a>
  &nbsp;·&nbsp;
  <a href="#run-locally">Run the site locally</a>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/images/tour/build-dark.webp" />
    <img src="public/images/tour/build-light.webp" width="1080" alt="AgentOS workflow editor with a step-by-step canvas for a lead follow-up and the selected step's settings alongside it" />
  </picture>
</p>

## What you can automate

| Use case | Workflow |
| --- | --- |
| **Weekly sales reporting** | Read Google Sheets, calculate totals, draft a summary, and send the report through Gmail. |
| **Lead follow-up** | Start from a new enquiry, record the lead in a spreadsheet, and draft a personalized reply. |
| **Meeting notes** | Summarize call notes, create a Notion page, and share the result in Slack. |
| **Customer feedback** | Summarize a request, open a GitHub issue, and add a follow-up task in Todoist. |

Workflows can start on a schedule, through an authenticated webhook, or from supported Google Sheets changes. Use standard steps for calculations and filters, and add AI for tasks such as drafting or summarizing. Test before publishing and use run history to inspect individual steps. Actions that require approval pause for review before they run.

**Integrations:** Gmail · Google Sheets · Google Calendar · Slack · Notion · GitHub · Todoist

## Explore the site

- [**Workflow playground**](https://agentos.vercel.app/#try) — choose a trigger and actions, then watch a simulated run.
- [**Product tour**](https://agentos.vercel.app/#tour) — see the workflow editor, approval screen, and run timeline.
- [**Workflow templates**](https://agentos.vercel.app/#templates) — browse examples for support, sales, reporting, and operations.

This repository contains the landing site and interactive demos. The workflow editor, API, worker, and deployment instructions live in the [AgentOS platform repository](https://github.com/shresthashim/agentos-platform).

## Run locally

Requires **Node.js 20.9+** and npm. The landing site runs locally without API keys or a database.

```bash
git clone https://github.com/shresthashim/AgentOS.git
cd AgentOS
npm ci
npm run dev -- --port 3400
```

Open [localhost:3400](http://localhost:3400). Dashboard links default to `https://agentos-app.vercel.app`. To point them somewhere else, copy [`.env.example`](.env.example) to `.env.local` and set `NEXT_PUBLIC_APP_URL` before starting the dev server or building the site.

```bash
npm run lint
npm run build
npm run start -- --port 3400
```

## Site architecture

**Next.js App Router · React · Tailwind CSS · React Three Fiber · Motion**

| Path | Responsibility |
| --- | --- |
| [`src/app/`](src/app) | Page composition, metadata, styles, and self-hosted fonts |
| [`src/components/hero/`](src/components/hero) | Interactive 3D workflow preview and its static fallback |
| [`src/components/sections/`](src/components/sections) | Playground, product tour, templates, and other landing sections |
| [`src/lib/site.ts`](src/lib/site.ts) | Dashboard URL, integration details, and example workflows |
| [`public/`](public) | Integration icons and product tour images |

The homepage is statically prerendered. The 3D preview loads in the browser and has a static fallback for devices without WebGL. Workflow tabs support arrow-key navigation, and the site respects system light, dark, and reduced-motion preferences.
