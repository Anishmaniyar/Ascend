import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

/* Inter Variable — all UI, body, labels, buttons. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600"],
});

/* Newsreader Light — editorial stand-in for Signifier (commercial).
   Stack is declared as Signifier first so licensed installs win. */
const signifierFallback = Newsreader({
  subsets: ["latin"],
  variable: "--font-signifier-src",
  display: "swap",
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "LeetAptitude — Practice with purpose",
  description:
    "A focused aptitude practice platform for mastering topics, company tests, and the skills that matter.",
};

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
      <body
        className={`${inter.variable} ${signifierFallback.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
