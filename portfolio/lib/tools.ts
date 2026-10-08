export type ToolLogo = {
  name: string;
  category: string;
  src: string;
  alt: string;
  sourceUrl: string;
  license: string;
  background: "light" | "dark";
};

export const toolLogos: ToolLogo[] = [
  {
    name: "Codex",
    category: "AGENT CLIs",
    src: "/tools/codex.svg",
    alt: "OpenAI mark for Codex",
    sourceUrl: "https://developers.openai.com/favicon.svg",
    license: "OpenAI brand asset (developers.openai.com favicon)",
    background: "light",
  },
  {
    name: "Hermes",
    category: "AGENT CLIs",
    src: "/tools/hermes.png",
    alt: "Nous Research Hermes Agent official application icon",
    sourceUrl:
      "https://raw.githubusercontent.com/NousResearch/hermes-agent/main/apps/bootstrap-installer/src-tauri/icons/128x128.png",
    license: "MIT (NousResearch/hermes-agent)",
    background: "light",
  },
  {
    name: "Claude Code",
    category: "AGENT CLIs",
    src: "/tools/claude-code.svg",
    alt: "Anthropic Claude official mark",
    sourceUrl: "https://claude.ai/favicon.svg",
    license: "Anthropic brand asset (claude.ai favicon)",
    background: "light",
  },
  {
    name: "OpenCode",
    category: "AGENT CLIs",
    src: "/tools/opencode.svg",
    alt: "OpenCode official logo mark",
    sourceUrl:
      "https://raw.githubusercontent.com/anomalyco/opencode/dev/packages/console/app/src/asset/brand/opencode-logo-light.svg",
    license: "MIT (anomalyco/opencode)",
    background: "light",
  },
  {
    name: "Python",
    category: "LANGUAGES",
    src: "/tools/python.svg",
    alt: "Python official logo",
    sourceUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg",
    license: "MIT (devicons/devicon)",
    background: "light",
  },
  {
    name: "Go",
    category: "LANGUAGES",
    src: "/tools/go.svg",
    alt: "Go official logo",
    sourceUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original.svg",
    license: "MIT (devicons/devicon)",
    background: "light",
  },
  {
    name: "TypeScript",
    category: "LANGUAGES",
    src: "/tools/typescript.svg",
    alt: "TypeScript official logo",
    sourceUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg",
    license: "MIT (devicons/devicon)",
    background: "light",
  },
  {
    name: "JavaScript",
    category: "LANGUAGES",
    src: "/tools/javascript.svg",
    alt: "JavaScript official logo",
    sourceUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg",
    license: "MIT (devicons/devicon)",
    background: "light",
  },
  {
    name: "C++",
    category: "LANGUAGES",
    src: "/tools/cplusplus.svg",
    alt: "C++ official logo",
    sourceUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg",
    license: "MIT (devicons/devicon)",
    background: "light",
  },
  {
    name: "FastAPI",
    category: "BACKEND & DATA",
    src: "/tools/fastapi.svg",
    alt: "FastAPI official logo",
    sourceUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg",
    license: "MIT (devicons/devicon)",
    background: "light",
  },
  {
    name: "PostgreSQL",
    category: "BACKEND & DATA",
    src: "/tools/postgresql.svg",
    alt: "PostgreSQL official logo",
    sourceUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg",
    license: "MIT (devicons/devicon)",
    background: "light",
  },
  {
    name: "Redis",
    category: "BACKEND & DATA",
    src: "/tools/redis.svg",
    alt: "Redis official logo",
    sourceUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg",
    license: "MIT (devicons/devicon)",
    background: "light",
  },
  {
    name: "Next.js",
    category: "PRODUCT & WEB",
    src: "/tools/nextjs.svg",
    alt: "Next.js official logo",
    sourceUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg",
    license: "MIT (devicons/devicon)",
    background: "light",
  },
  {
    name: "React",
    category: "PRODUCT & WEB",
    src: "/tools/react.svg",
    alt: "React official logo",
    sourceUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg",
    license: "MIT (devicons/devicon)",
    background: "light",
  },
  {
    name: "Node.js",
    category: "PRODUCT & WEB",
    src: "/tools/nodejs.svg",
    alt: "Node.js official logo",
    sourceUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg",
    license: "MIT (devicons/devicon)",
    background: "light",
  },
  {
    name: "Tailwind CSS",
    category: "PRODUCT & WEB",
    src: "/tools/tailwindcss.svg",
    alt: "Tailwind CSS official logo",
    sourceUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg",
    license: "MIT (devicons/devicon)",
    background: "light",
  },
  {
    name: "Docker",
    category: "INFRA & TOOLING",
    src: "/tools/docker.svg",
    alt: "Docker official logo",
    sourceUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg",
    license: "MIT (devicons/devicon)",
    background: "light",
  },
  {
    name: "Playwright",
    category: "INFRA & TOOLING",
    src: "/tools/playwright.svg",
    alt: "Playwright official logo",
    sourceUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/playwright/playwright-original.svg",
    license: "MIT (devicons/devicon)",
    background: "light",
  },
  {
    name: "pytest",
    category: "INFRA & TOOLING",
    src: "/tools/pytest.svg",
    alt: "pytest official logo",
    sourceUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/pytest/pytest-original.svg",
    license: "MIT (devicons/devicon)",
    background: "light",
  },
  {
    name: "GitHub Actions",
    category: "INFRA & TOOLING",
    src: "/tools/githubactions.svg",
    alt: "GitHub Actions official logo",
    sourceUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/githubactions/githubactions-original.svg",
    license: "MIT (devicons/devicon)",
    background: "light",
  },
  {
    name: "LangChain",
    category: "BACKEND & DATA",
    src: "/tools/langchain.svg",
    alt: "LangChain official OSS lockup",
    sourceUrl:
      "https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/6a994264a64b3afcdd880f66_LangChain_OSS%20Lockup_light%201.svg",
    license: "LangChain OSS brand asset (langchain.com/brand-assets)",
    background: "light",
  },
  {
    name: "LangGraph",
    category: "BACKEND & DATA",
    src: "/tools/langgraph.svg",
    alt: "LangGraph official OSS lockup",
    sourceUrl:
      "https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/6a994264a64b3afcdd880f6b_LangGraph_OSS%20Lockup_light%201.svg",
    license: "LangGraph OSS brand asset (langchain.com/brand-assets)",
    background: "light",
  },
  {
    name: "Express",
    category: "BACKEND & DATA",
    src: "/tools/express.svg",
    alt: "Express official logo",
    sourceUrl:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg",
    license: "MIT (devicons/devicon)",
    background: "light",
  },
];
