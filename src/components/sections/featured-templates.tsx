import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/components/motion/tilt-card";
import { StepIconView } from "@/components/step-icon";
import { APP_URL, type StepIcon } from "@/lib/site";

/** A handful of templates that solve real, everyday jobs. */
const FEATURED: {
  name: string;
  outcome: string;
  detail: string;
  steps: { icon: StepIcon; label: string }[];
  tone: string;
}[] = [
  {
    name: "New lead follow-up",
    outcome: "Every enquiry gets a personal reply the same day",
    detail: "Logs each website enquiry in your leads sheet, drafts a follow-up in your voice, and sends it once a rep approves.",
    steps: [
      { icon: "inbox", label: "New enquiry" },
      { icon: "googlesheets", label: "Log the lead" },
      { icon: "ai", label: "Draft reply" },
      { icon: "gmail", label: "Send" },
    ],
    tone: "from-[#e8f5ee] dark:from-[#0f2a1f]",
  },
  {
    name: "Monday sales report",
    outcome: "The weekly numbers, explained, in everyone's inbox",
    detail: "Totals the week from your sales sheet, has AI explain what changed, and emails the report after a quick check.",
    steps: [
      { icon: "clock", label: "Mondays 9:00" },
      { icon: "googlesheets", label: "Read sales" },
      { icon: "ai", label: "Explain" },
      { icon: "gmail", label: "Email" },
    ],
    tone: "from-[#e9eefc] dark:from-[#18214a]",
  },
  {
    name: "Customer reply drafts",
    outcome: "Answers that follow your own policy, ready to send",
    detail: "Uses your policy to draft a reply to each customer question, keeps a copy for review, and sends it once approved.",
    steps: [
      { icon: "inbox", label: "Question" },
      { icon: "ai", label: "Draft" },
      { icon: "doc", label: "Save copy" },
      { icon: "gmail", label: "Reply" },
    ],
    tone: "from-[#fff3df] dark:from-[#33260d]",
  },
  {
    name: "Meeting notes to Notion",
    outcome: "Every call written up and shared with the team",
    detail: "Turns call notes into a tidy Notion page with next steps, then lets the team know in Slack.",
    steps: [
      { icon: "inbox", label: "Call notes" },
      { icon: "ai", label: "Summarize" },
      { icon: "notion", label: "Notion page" },
      { icon: "slack", label: "Tell the team" },
    ],
    tone: "from-[#f1ecfb] dark:from-[#251c40]",
  },
];

export function FeaturedTemplates() {
  return (
    <section id="templates" aria-labelledby="templates-title" className="py-24 sm:py-32">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[40rem]">
            <h2 id="templates-title" className="heading text-[length:clamp(2rem,1.3rem+2.4vw,3.1rem)]">
              Start with a workflow that already works
            </h2>
            <p className="lede mt-4 text-ink-muted">
              Ready-made templates for the jobs teams repeat every week.
              Connect your apps, adjust the wording, and turn it on.
            </p>
          </div>
          <a href={APP_URL} className="btn btn-secondary">
            See all templates
          </a>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {FEATURED.map((t) => (
            <li key={t.name}>
              <TiltCard>
              <a
                href={APP_URL}
                className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-gradient-to-br ${t.tone} to-surface to-60% p-7 transition-[border-color,box-shadow,transform] duration-300 hover:border-line-strong hover:shadow-[0_30px_60px_-36px_rgb(var(--shadow)/0.5)] sm:p-8`}
              >
                {/* The workflow at a glance; a pulse runs along it on hover. */}
                <span aria-hidden="true" className="relative flex items-start justify-between">
                  <span className="absolute left-6 right-6 top-6 h-px bg-line-strong" />
                  <span className="absolute left-6 top-6 h-px w-0 bg-cobalt transition-[width] duration-700 ease-out group-hover:w-[calc(100%-3rem)]" />
                  {t.steps.map((s) => (
                    <span key={s.label} className="relative flex w-16 flex-col items-center gap-2 sm:w-20">
                      <span className="flex size-12 items-center justify-center rounded-2xl border border-line bg-surface text-ink-muted shadow-[0_6px_18px_-12px_rgb(var(--shadow)/0.5)] transition-transform duration-300 group-hover:scale-105">
                        <StepIconView icon={s.icon} size={22} />
                      </span>
                      <span className="text-center text-xs leading-tight text-ink-faint">{s.label}</span>
                    </span>
                  ))}
                </span>
                <span className="mt-8 text-sm font-semibold text-cobalt-ink">{t.name}</span>
                <span className="heading mt-2 text-[length:clamp(1.35rem,1.1rem+0.8vw,1.75rem)]">{t.outcome}</span>
                <span className="mt-3 flex-1 text-[15px] text-ink-muted">{t.detail}</span>
                <span className="mt-7 inline-flex items-center gap-1.5 text-[15px] font-semibold">
                  Use this template
                  <ArrowUpRight
                    size={18}
                    aria-hidden="true"
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </a>
              </TiltCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
