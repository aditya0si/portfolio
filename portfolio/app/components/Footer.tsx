import { profile } from "@/lib/data";
import VisitorCounter from "./VisitorCounter";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-sheet flex-col gap-4 px-5 py-8 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <p>© {new Date().getFullYear()} ADITYA SINGH — SOURCE AVAILABLE ON GITHUB</p>
          <VisitorCounter />
        </div>
        <div className="flex items-center gap-5">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
            GITHUB
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
            LINKEDIN
          </a>
          <a href={`mailto:${profile.email}`} className="transition-colors hover:text-accent">
            EMAIL
          </a>
          <a href="#main" className="transition-colors hover:text-accent">
            TOP ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
