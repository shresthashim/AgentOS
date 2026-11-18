import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Splash } from "@/components/splash";
import { ThemeProvider } from "@/components/theme";
import "./globals.css";

// Headlines in Schibsted Grotesk; reading text in DM Sans, the AgentOS app's own face.
// Self-hosted variable fonts (SIL Open Font License, see ./fonts), so builds and
// first paint never depend on reaching a font service.
const display = localFont({
  src: "./fonts/schibsted-grotesk-latin-wght-normal.woff2",
  weight: "400 900",
  variable: "--font-display",
  display: "swap",
});
const body = localFont({
  src: "./fonts/dm-sans-latin-wght-normal.woff2",
  weight: "100 1000",
  variable: "--font-body",
  display: "swap",
});

const description =
  "Automate reports and routine work across Gmail, Google Sheets, Slack and Notion. Review actions like sending email before they run.";

export const metadata: Metadata = {
  metadataBase: new URL("https://agentos.vercel.app"),
  alternates: { canonical: "/" },
  title: "AgentOS: automate the work between your apps",
  description,
  openGraph: {
    url: "/",
    title: "AgentOS: automate the work between your apps",
    description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1022" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // next-themes sets the theme class on <html> before paint, so React sees a difference.
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body>
        <Splash />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
