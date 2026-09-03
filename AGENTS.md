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

- Install: `pnpm install` (CI uses `pnpm install --frozen-lockfile`)
- Build (production, minified): `pnpm build` (= `tsc --noEmit && webpack --config webpack.prod.js`) → outputs to `dist/`
- Build (development, unminified + sourcemaps): `pnpm dev` (webpack.dev.js, `development` + `cheap-module-source-map`)
- Typecheck: `pnpm typecheck` (= `tsc --noEmit`, strict, ES2022 target)
- There is **no dev server, HMR, test suite, or linter**. `dev`/`build` are just webpack builds. To verify changes, run `pnpm build`.
- To try changes: build, then load `dist/` via `chrome://extensions` (or `edge://extensions`) → "Load unpacked". Reload the extension after every rebuild; `dist` is gitignored.

## Architecture

- Single webpack entry: `src/ContentScript/index.ts` → bundles to `dist/contentScript.js` (+ `contentScript.css`). `public/` (`manifest.json`, `icons/`) is copied verbatim into `dist` (webpack.common.js).
- MV3 content script (`public/manifest.json`): matches `https://github.com/*`, `run_at: document_idle`.
- Plain TS + DOM APIs, no framework — don't add JSX/React components.
- Code split: `index.ts` owns back-to-top button + `MutationObserver` bootstrap; `contents.ts` owns TOC extraction/render/highlight (`syncContents` / `shouldSyncContents`).
- Styles are SCSS modules (`src/ContentScript/index.module.scss`), compiled with CSS Modules (css-loader `modules: { namedExport: false }`). Import as `import styles from "*.module.scss"` and reference classes via `styles.<name>`; the module declaration lives in `src/types/index.d.ts`.
- TS is strict ES2022 (`tsconfig.json`, `noUnusedLocals`/`noUnusedParameters` on).

## Gotchas

- **Version must be kept in sync** between `package.json` and `public/manifest.json` (currently 0.6.3). Bump both. CI (`.github/workflows/release.yml`) fails if they differ, and requires release tags to be exactly `v<version>`.
- Release: pushing tag `v*` (e.g. `v0.6.1`) builds `dist/`, zips identical chrome/edge packages, and publishes/updates the GitHub Release.
- The extension is tightly coupled to GitHub's DOM and is fragile by design:
  - GitHub renders repo pages as a Primer React app; the README is **not in the initial HTML** — it's rendered client-side, so TOC extraction only works after the README mounts.
  - TOC extraction targets `article.markdown-body` and injects into `[data-component="SplitPageLayout.Pane"]` in `src/ContentScript/contents.ts`. No legacy selectors — new GitHub DOM only.
  - Heading `id` resolution handles GitHub's `.markdown-heading` wrapper (id on sibling `a[id]`); headings without `id`+text are skipped.
  - `syncContents` is idempotent (skips when readme/sidebar/TOC nodes + title signature + heading identities are unchanged); active heading is highlighted via `IntersectionObserver`.
  - The sidebar column is short, so native `sticky` can't hold the TOC: once it would scroll under the header it pins via `position: fixed` (`top: 72px`, left/width measured from the sidebar slot), tracked by a placeholder + rAF-throttled scroll check (IO only reports enter/exit, so it can't catch the dock-back moment) and unpinned when scrolled back. `resize` re-aligns the pinned offset.
  - Re-crawls on DOM mutations via a `MutationObserver` (GitHub's SPA nav uses Turbo-frames, not pjax) in `src/ContentScript/index.ts`, filtered by `shouldSyncContents` to ignore unrelated UI mutations.
- Changes to GitHub's markup silently break features (empty TOC, missing button). After DOM-related edits, test against a real GitHub repo README (with headings) and a non-README page.
