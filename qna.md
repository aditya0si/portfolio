# Questions & Answers Log (`qna.md`)

## Operational Protocol
In strict adherence to `AGENT_MISSION.md`:
> *"If a personal/identity decision is required, add it to `qna.md`; for ordinary engineering choices, make a reasonable evidence-based assumption."*
> *"Blocking Questions (0–3): Only ask if a wrong answer requires discarding completed work. Every question must include a recommended default so the user can simply reply 'yes to all'. If nothing is blocking, state None (0)."*

---

## Blocking Questions (0–3)
**None (0)**. There are currently zero blocking questions. All architectural decisions, scoring models, provisional flagship lineups, and conceptual system proposals are grounded in verifiable repository evidence and market requirements.

---

## Non-Internet Identity, Biography & Experience Inquiries

The following items involve personal biographical and employment details that cannot be definitively resolved from public internet repositories. Sensible, evidence-first defaults are provided so progress is never blocked:

### 1. Professional Employment History & Prior Internships
*   **Context**: Early draft data in `portfolio/lib/data.ts` referenced internships at IBM (medical OCR pipeline) and HCL Technologies (LangGraph RAG pipeline). However, no official employment verification records, corporate repository commits, or public recommendation artifacts exist in the captured GitHub snapshot.
*   **Question**: What are the exact official dates, job titles, authorized corporate deliverables, and public attribution permissions for IBM and HCL Technologies, or should public case studies focus exclusively on verifiable open-source repositories and hackathon prototype projects (`floodlens`/`bustwatch`)?
*   **Recommended Default**: Center all public portfolio project showcases, case studies, and capability matrices strictly on verifiable, publicly inspectable GitHub repositories (`schemeGPT`, `Sentinel`, `mcp-from-scratch`, `DevAtlas`, `event-stream-platform`, and hackathon prototypes `floodlens`/`bustwatch`). Mention prior corporate internships only if and when official dates and unclassified descriptions are explicitly supplied by the candidate.

### 2. Candidate Display Name & Contact Channel Privacy
*   **Context**: Candidate is referred to as "Aditya Singh" across GitHub (`aditya0si`) and "Aditya Pratap Singh" in select academic profiles. The existing portfolio displays a personal phone number (`7651982009`) in static text alongside email (`oliaditya05@gmail.com`).
*   **Question**: What is the preferred professional display name, and should personal mobile numbers be exposed directly on public web pages?
*   **Recommended Default**: Use **Aditya Singh** as the primary professional display name. Prioritize **Email (`oliaditya05@gmail.com`)**, **GitHub (`aditya0si`)**, and **LinkedIn** in public headers and contact cards to protect candidate phone privacy from automated web scrapers.

### 3. Academic Details & Graduation Status
*   **Context**: Academic credentials indicate candidate is pursuing / completed a B.Tech in Computer & Communication Engineering at Manipal Institute of Technology (MIT Manipal).
*   **Question**: What is the formal graduation month/year (e.g., Class of 2025 vs. 2026) and GPA/honors to display on public profiles?
*   **Recommended Default**: State "B.Tech in Computer & Communication Engineering, Manipal Institute of Technology (MIT Manipal)" highlighting coursework in Operating Systems, Computer Architecture, Distributed Systems, and Database Systems, omitting specific GPA unless provided.
