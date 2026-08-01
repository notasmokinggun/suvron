# What's in this package

Drop these files into your local clone of `notasmokinggun/suvron`, overwriting the matching paths, then commit and push yourself from your own machine (never paste tokens into a chat).

```
git clone https://github.com/notasmokinggun/suvron.git
cd suvron
# copy every file from this package into the repo, same paths
git add -A
git commit -m "Grievance redressal: real policy content, multilingual pages, nav mega-menu, contact/complaint links"
git push
```

## 1. Grievance Redressal page — rebuilt (`grievance-redressal/`)
- Kept the existing "escalation path" visual design (4 named levels, timelines) but replaced the placeholder copy with your actual policy (GRP/1.0/2026-27):
  - **Level 1** — Customer Support, `support@suvron.com`, 7 days
  - **Level 2** — GRO Ms. Ekta G, `gro@suvron.com`, `9971373543`, 14 days
  - **Level 3** — Lending partner's Grievance Officer
  - **Level 4** — RBI, CMS portal + SACHET portal, 30-day trigger
- Added a full formal-policy section underneath (Objectives, Scope, Principles, Governance, Transparency) so the complete legal text is published, not just a summary.
- Added a language switcher at the top of the page.

## 2. Same page, 4 more languages
- `grievance-redressal/hi/` — Hindi (from the text you supplied)
- `grievance-redressal/ta/` — Tamil (translated)
- `grievance-redressal/te/` — Telugu (translated)
- `grievance-redressal/kn/` — Kannada (translated)

⚠️ **Please have a native speaker sanity-check the Tamil/Telugu/Kannada before publishing.** This is a regulatory disclosure document — I did the translation carefully, but a native reviewer catching a nuance is worth it for something RBI-facing.

## 3. Site-wide navigation, all pages
Every page (`index.html`, `about/`, `contact/`, `calculator/`, `blog/`, `privacy-policy/`, `terms/`, `responsible-lending/`, `grievance-redressal/*`) now has:
- **"Contact us"** as a direct top-nav link (was footer-only before)
- A **"Resources" hover/tap dropdown** (styled like the mega-menu screenshot you sent) bundling: Blog, EMI Calculator, Grievance Redressal, Responsible Lending
- A standing **"File a complaint"** button in the top nav bar (gold outline pill), so the complaint system is visible on every page, not just linked from the footer

## 4. `styles.css` / `script.js`
- Appended (not rewritten) — new CSS for the dropdown, complaint button, language-switcher chips, and the policy-text formatting; new JS just handles opening/closing the dropdown. Nothing existing was removed.

## Note on the earlier GitHub token
That token should be revoked at https://github.com/settings/tokens if you haven't already — it was pasted into this chat, so treat it as burned regardless of intended lifespan.
