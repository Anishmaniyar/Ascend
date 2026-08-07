import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

/* PolySans substitute (style guide): Inter Tight at weight 400 for display,
   Inter for body/UI. These become --font-display and --font-body, consumed
   by the theme tokens --font-polysans / --font-inter in globals.css. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  title: "LeetAptitude — Placement prep, mastered",
  description:
    "Learn topic-by-topic, practice structured question sets, attempt company-specific assessments and track detailed progress.",
};

/* No-FOUC theme bootstrap: apply the saved/system theme to <html> before
   first paint so the app never flashes the wrong theme. */
const themeScript = `(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${interTight.variable}`}>
        {children}
      </body>
    </html>
  );
}
