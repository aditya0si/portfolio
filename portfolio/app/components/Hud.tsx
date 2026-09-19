"use client";

import { useEffect, useState } from "react";

const NAV: [string, string][] = [
  ["PRODUCTS", "/#products"],
  ["SYSTEMS (R&D)", "/#systems"],
  ["STACK", "/#stack"],
  ["CONCEPTS", "/#concepts"],
  ["GITHUB", "/#github"],
  ["CONTACT", "/#contact"],
];

function useIstClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false,
      });
    const initial = window.setTimeout(() => setTime(fmt()), 0);
    const id = window.setInterval(() => setTime(fmt()), 1000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(id);
    };
  }, []);
  return time;
}

export default function Hud() {
  const time = useIstClock();
  const [theme, setTheme] = useState<"a" | "b">("a");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setTheme(
        document.documentElement.getAttribute("data-theme") === "b" ? "b" : "a"
      );
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggleTheme = () => {
    const next = theme === "a" ? "b" : "a";
    setTheme(next);
    if (next === "b") document.documentElement.setAttribute("data-theme", "b");
    else document.documentElement.removeAttribute("data-theme");
    try {
      localStorage.setItem("as-theme", next);
    } catch {}
  };

  return (
    <>
      <header className="hud-blur fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-4 border-b border-line px-4 font-mono text-[11px] tracking-[0.08em] sm:px-6">
        <a href="/" className="whitespace-nowrap font-medium text-ink">
          ADITYA SINGH<span className="cursor-blink text-accent">▮</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {NAV.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="uppercase text-muted transition-colors hover:text-accent"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 whitespace-nowrap text-muted sm:gap-5">
          <span className="hidden items-center gap-2 lg:flex">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            OPEN TO WORK
          </span>
          <span className="hidden tabular-nums sm:inline" suppressHydrationWarning>
            {time ? `${time} IST` : "IST"}
          </span>
          <button
            onClick={toggleTheme}
            className="uppercase transition-colors hover:text-accent"
            aria-label={`Switch to theme ${theme === "a" ? "B (dark)" : "A (light)"}`}
          >
            THEME[{theme === "a" ? "A" : "B"}]
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="uppercase md:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? "CLOSE ×" : "MENU ≡"}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col justify-center bg-bg px-8 pt-14 md:hidden">
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {NAV.map(([label, href], i) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 border-b border-line py-4"
              >
                <span className="font-mono text-[11px] text-accent">
                  0{i + 1}
                </span>
                <span className="font-display text-3xl font-medium text-ink transition-colors group-hover:text-accent">
                  {label}
                </span>
              </a>
            ))}
          </nav>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            ADITYASINGH.AI.STUDIO — {time ?? ""} IST
          </p>
        </div>
      )}
    </>
  );
}
