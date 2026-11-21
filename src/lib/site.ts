export const SITE_NAME = "AgentOS";
export const SITE_URL = "https://agentos-home.vercel.app";

/** Workspace entry point. Local previews can override NEXT_PUBLIC_APP_URL. */
export const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://agentos-workspace.vercel.app"
).replace(/\/$/, "");

export type AppSlug =
  | "gmail"
  | "googlesheets"
  | "googlecalendar"
  | "slack"
  | "notion"
  | "github"
  | "todoist";

/** The connected apps and what AgentOS can do in each. Every one waits for approval. */
export const APPS: { slug: AppSlug; name: string; does: string }[] = [
  { slug: "gmail", name: "Gmail", does: "Send emails" },
  { slug: "googlesheets", name: "Google Sheets", does: "Read and add rows" },
  { slug: "googlecalendar", name: "Google Calendar", does: "Book appointments" },
  { slug: "slack", name: "Slack", does: "Post team updates" },
  { slug: "notion", name: "Notion", does: "Create pages" },
  { slug: "github", name: "GitHub", does: "Open issues" },
  { slug: "todoist", name: "Todoist", does: "Add tasks" },
];

/** Glyphs for steps that are not an app. */
export type StepIcon = AppSlug | "clock" | "inbox" | "ai" | "approve" | "doc" | "filter" | "chart";

export type Category = "Customers" | "Reports & finance" | "Daily operations" | "Team";

/** The templates that ship with AgentOS, described in plain words. */
export const TEMPLATES: {
  name: string;
  text: string;
  category: Category;
  steps: StepIcon[];
}[] = [
  {
    name: "Customer reply",
    text: "Draft a reply from your own policy, save it for review, then send it with Gmail once approved.",
    category: "Customers",
    steps: ["inbox", "ai", "doc", "gmail"],
  },
  {
    name: "Weekly sales report",
    text: "Total up the week's sales, have AI explain the numbers, and email the report after a quick check.",
    category: "Reports & finance",
    steps: ["googlesheets", "chart", "ai", "gmail"],
  },
  {
    name: "New lead follow-up",
    text: "Add each website enquiry to a sheet and prepare a personal follow-up email.",
    category: "Customers",
    steps: ["inbox", "googlesheets", "ai", "gmail"],
  },
  {
    name: "Appointment request",
    text: "Turn a booking request into a short brief, then add it to the calendar and invite the guests.",
    category: "Customers",
    steps: ["inbox", "ai", "googlecalendar"],
  },
  {
    name: "Expense log",
    text: "Summarize an expense and add it as a new row in your expenses sheet.",
    category: "Reports & finance",
    steps: ["inbox", "doc", "googlesheets"],
  },
  {
    name: "Low-stock alert",
    text: "Find the items running low in your stock sheet and save a clear restock report.",
    category: "Daily operations",
    steps: ["googlesheets", "filter", "doc"],
  },
  {
    name: "Daily team update",
    text: "Write the day's update and share it in the Slack channel you choose.",
    category: "Team",
    steps: ["clock", "ai", "slack"],
  },
  {
    name: "Meeting notes to Notion",
    text: "Turn notes from a customer call into a Notion page and let the team know.",
    category: "Team",
    steps: ["inbox", "ai", "notion", "slack"],
  },
  {
    name: "Feedback to GitHub issue",
    text: "Summarize customer feedback and open an issue so the product team can track it.",
    category: "Daily operations",
    steps: ["inbox", "ai", "github"],
  },
  {
    name: "Follow-up task",
    text: "Prepare a follow-up after a workshop and add it to the right Todoist project.",
    category: "Daily operations",
    steps: ["inbox", "ai", "todoist"],
  },
];

/** Workflows the hero canvas can show. Each step has a kind, an icon and a title. */
export type FlowStep = {
  kind: "Trigger" | "Action" | "AI step" | "Approval";
  icon: StepIcon;
  title: string;
};

export const HERO_FLOWS: { id: string; name: string; steps: FlowStep[] }[] = [
  {
    id: "sales",
    name: "Weekly sales report",
    steps: [
      { kind: "Trigger", icon: "clock", title: "Every Monday, 9:00" },
      { kind: "Action", icon: "googlesheets", title: "Read this week's sales" },
      { kind: "AI step", icon: "ai", title: "Write the summary" },
      { kind: "Approval", icon: "approve", title: "Team lead approves" },
      { kind: "Action", icon: "gmail", title: "Email the report" },
    ],
  },
  {
    id: "leads",
    name: "New lead follow-up",
    steps: [
      { kind: "Trigger", icon: "inbox", title: "New website enquiry" },
      { kind: "Action", icon: "googlesheets", title: "Add the lead to a sheet" },
      { kind: "AI step", icon: "ai", title: "Write a follow-up" },
      { kind: "Approval", icon: "approve", title: "Sales approves" },
      { kind: "Action", icon: "gmail", title: "Send the email" },
    ],
  },
  {
    id: "notes",
    name: "Meeting notes",
    steps: [
      { kind: "Trigger", icon: "inbox", title: "Call notes arrive" },
      { kind: "AI step", icon: "ai", title: "Summarize the call" },
      { kind: "Approval", icon: "approve", title: "Account owner approves" },
      { kind: "Action", icon: "notion", title: "Create a Notion page" },
      { kind: "Action", icon: "slack", title: "Tell the team in Slack" },
    ],
  },
  {
    id: "feedback",
    name: "Feedback to issue",
    steps: [
      { kind: "Trigger", icon: "inbox", title: "New customer feedback" },
      { kind: "AI step", icon: "ai", title: "Summarize the request" },
      { kind: "Approval", icon: "approve", title: "Product lead approves" },
      { kind: "Action", icon: "github", title: "Open a GitHub issue" },
      { kind: "Action", icon: "todoist", title: "Add a follow-up task" },
    ],
  },
];

/**
 * Legal pages. Set a real, monitored address before publishing: Google's OAuth
 * review and data-protection law both expect a working contact.
 */
export const CONTACT_EMAIL = "agentos.workspace@gmail.com";
export const LEGAL_UPDATED = "November 21, 2026";
/** Governing law for the terms of service. Confirm before publishing. */
export const GOVERNING_LAW = "Nepal";
