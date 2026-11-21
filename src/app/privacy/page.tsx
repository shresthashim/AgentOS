import type { Metadata } from "next";
import { DataTable, External, LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { APP_URL, CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "How AgentOS collects, uses and protects your information, including data from Google and other apps you connect.";

export const metadata: Metadata = {
  title: `Privacy policy | ${SITE_NAME}`,
  description,
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: { type: "article", url: `${SITE_URL}/privacy`, title: `Privacy policy | ${SITE_NAME}`, description },
};

const email = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

const SECTIONS: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    content: (
      <>
        <p>
          AgentOS is a workflow automation service. It lets you build workflows across apps such as Gmail, Google
          Sheets, Google Calendar, Slack, Notion, GitHub and Todoist, add AI steps, and approve actions before they
          run.
        </p>
        <p>
          This policy covers this website ({SITE_URL.replace("https://", "")}) and the AgentOS workspace app (
          {APP_URL.replace("https://", "")}). In this policy, “AgentOS”, “we” and “us” mean the operator of AgentOS.
          You can reach us at {email}.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    content: (
      <>
        <p>We collect only what we need to run your account and your workflows.</p>
        <DataTable
          head={["Information", "What it includes", "Why we need it"]}
          rows={[
            [
              "Account details",
              "Your name, email address and password. We store the password only as an Argon2 hash, never in readable form.",
              "To create your account and sign you in.",
            ],
            [
              "Google sign-in",
              "If you sign in with Google: your name, email address, Google account ID and whether Google has verified the email.",
              "To sign you in and link Google sign-in to your account.",
            ],
            [
              "Sign-in sessions",
              "A hashed session token, a short device label (browser and operating system), the time you were last active and your country.",
              "To keep you signed in, show your active sessions and protect your account.",
            ],
            [
              "Workspace content",
              "Workflows, the inputs you provide, run history and results, approvals, team members and invitations.",
              "To run your workflows and show you what each run did.",
            ],
            [
              "App connections",
              "Access credentials for the apps you connect, and the channels, pages, repositories or projects you allow. Credentials are encrypted.",
              "To carry out the steps your workflows include.",
            ],
            [
              "Emails we send you",
              "Your email address and the content of account emails: verification codes, password resets, invitations and a welcome email.",
              "To verify your email, secure your account and add you to workspaces.",
            ],
          ]}
        />
        <p>
          We do not use advertising or analytics trackers on this website or in the workspace app, and we do not buy
          information about you from others.
        </p>
      </>
    ),
  },
  {
    id: "google-user-data",
    title: "Google user data",
    content: (
      <>
        <p>
          AgentOS asks for access to your Google account only when you choose a feature that needs it, and only for
          the narrowest access that feature requires.
        </p>
        <DataTable
          head={["When you", "AgentOS can", "Google permission"]}
          rows={[
            [
              "Sign in with Google",
              "See your name, email address and Google account ID.",
              <code key="s">openid, email, profile</code>,
            ],
            [
              "Connect Gmail",
              "Send the emails your workflows prepare, after they are approved. AgentOS cannot read, search or delete your email.",
              <code key="g">gmail.send</code>,
            ],
            [
              "Connect Google Sheets",
              "Read the spreadsheets your workflows use and, only if you allow editing, add or update rows in them.",
              <span key="sh">
                <code>spreadsheets.readonly</code>
                <br />
                or <code>spreadsheets</code>
              </span>,
            ],
            [
              "Connect Google Calendar",
              "Create and update events on calendars you own, for example when a workflow books an appointment.",
              <code key="c">calendar.events.owned</code>,
            ],
          ]}
        />
        <h3>How we use it</h3>
        <ul>
          <li>
            We use Google user data only to provide the features you set up: signing you in and running the workflow
            steps you build, test and approve.
          </li>
          <li>
            Data a workflow reads from Google, such as spreadsheet rows, is kept as part of that run’s history in your
            workspace so you and your team can review what happened.
          </li>
          <li>
            We store Google refresh tokens encrypted. Access tokens are short-lived and used only while a step runs.
          </li>
        </ul>
        <h3>What we never do</h3>
        <ul>
          <li>We do not sell Google user data or use it for advertising.</li>
          <li>
            We do not use Google user data to develop, improve or train generalized artificial intelligence or
            machine learning models.
          </li>
          <li>
            We do not transfer Google user data to others except as needed to provide the features you use (for
            example, sending text to an AI step you added), to comply with the law, or with your permission.
          </li>
          <li>
            People do not read your Google user data unless you ask us to (for example, for support), it is needed for
            security, or the law requires it.
          </li>
        </ul>
        <p className="legal-callout">
          AgentOS’s use and transfer of information received from Google APIs to any other app will adhere to the{" "}
          <External href="https://developers.google.com/terms/api-services-user-data-policy">
            Google API Services User Data Policy
          </External>
          , including the Limited Use requirements.
        </p>
        <p>
          You can disconnect a Google connection at any time on the Connections page of your workspace, which deletes
          the stored credential. You can also remove AgentOS’s access in your{" "}
          <External href="https://myaccount.google.com/permissions">Google account settings</External>.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use information",
    content: (
      <ul>
        <li>To provide AgentOS: run workflows, keep run history, manage workspaces and send approved actions.</li>
        <li>To keep accounts safe: verify email addresses, limit repeated sign-in attempts and detect misuse.</li>
        <li>
          To send account emails, such as verification codes, password resets and invitations. We do not send
          marketing email.
        </li>
        <li>To answer your questions and fix problems you report.</li>
        <li>To meet legal obligations.</li>
      </ul>
    ),
  },
  {
    id: "ai-steps",
    title: "AI steps",
    content: (
      <>
        <p>
          When a workflow includes an AI step, the text that step works on (for example, rows from a sheet or notes
          you provide) is sent to Google’s Gemini API to produce the result. The result is saved with the run so you
          can review it before anything is sent.
        </p>
        <p>
          AI steps run only when you add them to a workflow. We do not use your workflow content to train AI models.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "How we share information",
    content: (
      <>
        <p>We do not sell your personal information. We share it only in these cases:</p>
        <ul>
          <li>
            <strong>With your workspace.</strong> Members of a workspace can see its workflows, runs and members,
            according to their role (owner, editor or viewer).
          </li>
          <li>
            <strong>With the apps you connect.</strong> When a workflow runs, AgentOS sends the data each step needs
            to that app, such as an approved email to Gmail or a message to Slack.
          </li>
          <li>
            <strong>With service providers</strong> who help us run AgentOS, under agreements that limit their use of
            the data: Vercel (website and app hosting), Google (Gemini API for AI steps), Resend (account email
            delivery) and our cloud database and server hosting providers.
          </li>
          <li>
            <strong>For legal reasons,</strong> when required by law or to protect the rights and safety of our users
            and others.
          </li>
          <li>
            <strong>In a business transfer,</strong> such as a merger or sale, in which case this policy continues to
            apply to your information.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    content: (
      <>
        <p>We use only what the service needs to work:</p>
        <ul>
          <li>
            <strong>A session cookie</strong> that keeps you signed in to the workspace app. Page scripts cannot read
            it.
          </li>
          <li>
            <strong>A short-lived Google sign-in cookie</strong> that protects a sign-in in progress and expires within
            minutes.
          </li>
          <li>
            <strong>Browser storage</strong> for preferences such as light or dark theme and layout, and to show the
            website’s opening animation only once per visit.
          </li>
        </ul>
        <p>We do not use advertising or analytics cookies.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect information",
    content: (
      <ul>
        <li>Passwords are stored only as Argon2 hashes.</li>
        <li>Session tokens are stored as hashes, so a copy of our database cannot be used to sign in.</li>
        <li>Credentials for connected apps are encrypted at rest.</li>
        <li>Connections to AgentOS use HTTPS.</li>
        <li>Workspace roles limit who can view, change, connect apps or approve actions.</li>
        <li>Actions such as sending email wait for a person to approve them.</li>
      </ul>
    ),
  },
  {
    id: "retention",
    title: "How long we keep information",
    content: (
      <>
        <p>
          We keep your information while your account is active. When you disconnect an app, we delete its stored
          credential straight away.
        </p>
        <p>
          You can ask us to delete your account by writing to {email}. We delete your account and the workspace data
          only you can access within 30 days, unless the law requires us to keep something longer. Shared workspaces
          stay available to their other members.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your choices and rights",
    content: (
      <>
        <p>Depending on where you live, you may have the right to:</p>
        <ul>
          <li>access the personal information we hold about you, and receive a copy;</li>
          <li>correct information that is wrong;</li>
          <li>delete your information;</li>
          <li>object to or restrict some uses of it;</li>
          <li>withdraw a permission you gave, such as access to a Google account.</li>
        </ul>
        <p>
          You can update your name and password in your profile, export workflows, and disconnect apps yourself. For
          anything else, write to {email}. You can also complain to your local data protection authority.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    content: (
      <p>
        AgentOS is not meant for children under 16, and we do not knowingly collect their information. If you believe
        a child has given us personal information, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "international",
    title: "International transfers",
    content: (
      <p>
        Our service providers may process information in countries other than yours. When they do, we choose
        providers that protect it to the standards this policy describes.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        We will update this page when our practices change and revise the date at the top. If a change is
        significant, we will tell you by email or in the workspace app before it takes effect.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      current="/privacy"
      title="Privacy policy"
      intro="What AgentOS collects, why, and how you stay in control of it, including the data you share from Google and other connected apps."
      summary={[
        "We collect only what we need to run your account and the workflows you build.",
        "Google data is used only for the features you set up, never for ads, and never to train AI models.",
        "AgentOS can send email from your Gmail but cannot read your inbox.",
        "We never sell your information, and we use no advertising or analytics trackers.",
        "You can disconnect any app at any time, and ask us to delete your account.",
      ]}
      sections={SECTIONS}
    />
  );
}
