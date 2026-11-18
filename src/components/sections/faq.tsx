import { ChevronDown } from "lucide-react";

const QUESTIONS = [
  {
    q: "Do I need to know how to code?",
    a: "No. You build workflows by choosing a starting point and adding steps from a list. Templates give you a working example to change.",
  },
  {
    q: "Which apps can I connect?",
    a: "Gmail, Google Sheets, Google Calendar, Slack, Notion, GitHub and Todoist, plus built-in steps for spreadsheets, message templates and AI writing.",
  },
  {
    q: "When does a workflow need approval?",
    a: "Reading a spreadsheet, calculating totals and drafting a report can run automatically. A workspace Owner approves each step that sends a message or changes a connected app.",
  },
  {
    q: "What does the AI see?",
    a: "Only what a step gives it. You can run AI on your own computer so nothing leaves it, or use Google Gemini. Steps that only calculate or fill in templates never use AI.",
  },
  {
    q: "What happens if a step fails?",
    a: "The run stops at that step and the history shows why. You can fix the problem and retry from the failed step; steps that already finished are not repeated.",
  },
  {
    q: "Can my whole team use it?",
    a: "Yes. Owners manage access and approvals. Editors build and run workflows. Viewers can see workflows and run results.",
  },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-line bg-surface py-24 sm:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <h2 id="faq-title" className="heading text-[length:clamp(2rem,1.3rem+2.4vw,3.1rem)]">
          Questions, answered
        </h2>
        <div className="divide-y divide-line border-y border-line">
          {QUESTIONS.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown size={20} aria-hidden="true" className="shrink-0 text-ink-faint transition-transform group-open:rotate-180" />
              </summary>
              <p className="max-w-[62ch] pb-6 text-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
