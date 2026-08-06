# AGENTS.md

Chrome/Edge MV3 extension ("github-hyper") that injects a back-to-top button and a README table of contents on `https://github.com/*`.

## Behavioral guidelines

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## Build & test

- Install: `pnpm`
- Build (production, minified): `pnpm build` → outputs to `dist/`
- Build (development, unminified + sourcemaps): `pnpm dev`
- There is **no dev server, HMR, test suite, linter, or typecheck script**. `dev` is just a non-minified webpack build. To verify changes, run `pnpm build` (or `npx tsc --noEmit` for types).
- To try changes: build, then load `dist/` via `chrome://extensions` (or `edge://extensions`) → "Load unpacked". Reload the extension after every rebuild; `dist` is gitignored.

## Architecture

- Single webpack entry: `src/ContentScript/index.ts` → bundles to `dist/contentScript.js`. `public/manifest.json` and `public/icons/` are copied verbatim into `dist` (webpack.common.js).
- The script is plain TS + DOM APIs; **React is a dependency but unused** — don't reach for JSX/React components.
- Styles are SCSS modules (`src/ContentScript/index.module.scss`), compiled with CSS Modules (css-loader `modules: true`). Import as `import styles from "*.module.scss"` and reference classes via `styles.<name>`; the module declaration lives in `src/types/index.d.ts`.

## Gotchas

- **Version must be kept in sync** between `package.json` and `public/manifest.json` (currently 0.4.1). Bump both.
- The extension is tightly coupled to GitHub's DOM and is fragile by design:
  - TOC extraction targets the `readme-toc article` element and inserts into a long `div.Layout--flowRow-until-md...` sidebar selector in `src/ContentScript/contents.ts`.
  - Re-crawls on GitHub's SPA navigation via the `pjax:end` event in `src/ContentScript/index.ts`.
  - `window.onscroll` is assigned globally (overwrites any existing handler).
- Changes to GitHub's markup silently break features (empty TOC, missing button). After DOM-related edits, test against a real GitHub repo README (with headings) and a non-README page.
