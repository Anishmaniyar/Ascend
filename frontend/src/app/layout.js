import { Poppins } from "next/font/google";
import "./globals.css";

/* Poppins — the single font family for all text in LeetAptitude. */
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
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
      <body className={`${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}
