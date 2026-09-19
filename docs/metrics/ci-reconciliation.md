# GitHub Actions reconciliation

**Measured:** 2026-09-19
**Scope:** all 47 repository snapshots in `research/real_repo_evidence.json`, queried at each snapshot's immutable commit SHA.

| Result at audited SHA | Repositories |
|---|---:|
| Successful run observed | 21 |
| No runs returned | 21 |
| Runs returned, none successful | 4 |
| Audited SHA unavailable | 1 |

The complete per-repository run IDs, URLs, conclusions, and queried SHAs are in `research/ci-reconciliation.json`. The repeatable collector is `research/reconcile_ci.js`.

The five current product candidates retained their previously audited status:

- schemeGPT — successful run `34871798476`
- Sentinel — successful run `33509493282`
- tenant-api-platform — successful run `34558220324`
- event-stream-platform — successful run `34623119770`
- mcp-from-scratch — no runs returned at the audited SHA

A workflow file is configuration evidence only. It is not counted as a successful CI run. Repositories with failed, cancelled, or missing runs remain labeled accordingly in the machine-readable report.
