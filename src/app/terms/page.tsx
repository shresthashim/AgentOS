import type { Metadata } from "next";
import Link from "next/link";
import { External, LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { CONTACT_EMAIL, GOVERNING_LAW, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "The terms for using AgentOS: your account, your content, connected apps, approvals, AI steps and acceptable use.";

export const metadata: Metadata = {
  title: `Terms of service | ${SITE_NAME}`,
  description,
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: { type: "article", url: `${SITE_URL}/terms`, title: `Terms of service | ${SITE_NAME}`, description },
};

const email = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

const SECTIONS: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreeing to these terms",
    content: (
      <>
        <p>
          These terms apply when you use AgentOS, including this website and the AgentOS workspace app. By creating an
          account or using AgentOS, you agree to them. If you use AgentOS for an organization, you confirm that you
          may accept these terms for it.
        </p>
        <p>
          Our <Link href="/privacy">privacy policy</Link> explains how we handle your information and is part of
          these terms.
        </p>
      </>
    ),
  },
  {
    id: "the-service",
    title: "The service",
    content: (
      <>
        <p>
          AgentOS lets you build workflows that connect apps, add AI steps, test with sample data and approve actions
          before they run. AgentOS is in early access: features may change, and we may add, change or remove parts
          of the service as it develops.
        </p>
        <p>
          AgentOS is currently free to use. If we introduce paid plans, we will tell you in advance, and you will not
          be charged unless you choose a paid plan.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Your account",
    content: (
      <ul>
        <li>You must be at least 16 years old to use AgentOS.</li>
        <li>Give accurate information when you sign up, and keep your email address up to date.</li>
        <li>
          Keep your password and sign-in methods secure. You are responsible for what happens in your account, and
          should tell us straight away at {email} if you think someone else has accessed it.
        </li>
      </ul>
    ),
  },
  {
    id: "workspaces",
    title: "Workspaces and teams",
    content: (
      <p>
        A workspace belongs to its owners. Owners decide who joins and what role each member has. Editors can build
        and run workflows; viewers can see them. Owners are responsible for the people they invite and for how their
        workspace is used.
      </p>
    ),
  },
  {
    id: "your-content",
    title: "Your content",
    content: (
      <>
        <p>
          You keep ownership of everything you put into AgentOS: workflows, inputs, files and the results your
          workflows produce (“your content”).
        </p>
        <p>
          You give us permission to store, process and send your content only as needed to provide AgentOS to you,
          for example to run a workflow step or show run history to your team. You confirm that you have the right to
          use the content and data you bring into AgentOS.
        </p>
      </>
    ),
  },
  {
    id: "connected-apps",
    title: "Connected apps",
    content: (
      <>
        <p>
          When you connect an app such as Gmail, Google Sheets, Google Calendar, Slack, Notion, GitHub or Todoist, you
          authorize AgentOS to act in that app within the access you grant. Your use of those apps is also governed by
          their own terms, including the{" "}
          <External href="https://policies.google.com/terms">Google Terms of Service</External>.
        </p>
        <p>
          We are not responsible for apps we do not operate, or for changes they make that affect your workflows. You
          can disconnect an app at any time.
        </p>
      </>
    ),
  },
  {
    id: "approvals",
    title: "Approvals and automated actions",
    content: (
      <>
        <p>
          AgentOS carries out the actions in the workflows you publish, such as sending emails, adding spreadsheet
          rows, creating calendar events or posting messages. Actions with an approval step wait for a person to
          approve them.
        </p>
        <p>
          You are responsible for the workflows you publish and the actions you approve. Review what a step will do
          before you approve it, especially emails and changes that cannot be undone.
        </p>
      </>
    ),
  },
  {
    id: "ai",
    title: "AI-generated content",
    content: (
      <p>
        AI steps generate text automatically, and the results can be incomplete or wrong. Check AI output before you
        rely on it or approve an action that uses it. Do not rely on it for legal, medical, financial or other
        professional advice.
      </p>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: (
      <>
        <p>You agree not to use AgentOS to:</p>
        <ul>
          <li>send spam, or bulk or unsolicited messages;</li>
          <li>break the law or infringe anyone’s rights, including privacy and intellectual property;</li>
          <li>send harmful, deceptive, harassing or abusive content;</li>
          <li>upload malware, or try to access accounts, data or systems you are not allowed to;</li>
          <li>get around usage limits, security controls or the approval steps of other workspaces;</li>
          <li>break the terms or policies of the apps you connect;</li>
          <li>copy, resell or reverse-engineer AgentOS, except where the law allows it.</li>
        </ul>
      </>
    ),
  },
  {
    id: "termination",
    title: "Suspension and ending your use",
    content: (
      <>
        <p>
          You can stop using AgentOS at any time and ask us to delete your account by writing to {email}.
        </p>
        <p>
          We may suspend or close an account that breaks these terms, puts other users or the service at risk, or
          where the law requires it. Where we reasonably can, we will tell you first and give you a chance to export
          your workflows.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    content: (
      <p>
        AgentOS is provided “as is” and “as available”. To the extent the law allows, we make no promises that it
        will be uninterrupted, error-free or suitable for a particular purpose, or that connected apps will always
        accept the actions your workflows send.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: (
      <>
        <p>
          To the extent the law allows, AgentOS is not liable for indirect, incidental, special or consequential
          losses, or for lost profits, revenue or data, arising from your use of the service.
        </p>
        <p>
          Our total liability for any claim relating to AgentOS is limited to the greater of the amount you paid us
          in the 12 months before the claim and 100 US dollars. Nothing in these terms limits liability that cannot
          be limited by law.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Your responsibility to us",
    content: (
      <p>
        If someone brings a claim against us because of your content, the workflows you run or your breach of these
        terms, you agree to cover the reasonable costs of that claim, to the extent the law allows.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    content: (
      <p>
        We may update these terms as AgentOS changes. We will revise the date at the top, and if a change is
        significant we will tell you by email or in the workspace app before it takes effect. If you keep using
        AgentOS after that, the new terms apply.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    content: (
      <p>
        These terms are governed by the laws of {GOVERNING_LAW}. If you live in a country whose consumer protection
        laws give you more rights, those rights still apply.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: <p>Questions about these terms? Write to {email}.</p>,
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      current="/terms"
      title="Terms of service"
      intro="The agreement between you and AgentOS: what we provide, what you are responsible for, and how we work together."
      summary={[
        "You own your workflows and content. We use them only to run AgentOS for you.",
        "You decide what your workflows do, and you are responsible for the actions you approve.",
        "Check AI output before relying on it or approving an action that uses it.",
        "Don’t use AgentOS for spam, abuse or anything unlawful.",
        "AgentOS is free during early access. We will tell you before anything changes.",
      ]}
      sections={SECTIONS}
    />
  );
}
