# Zero-Latency Architect Blog

A **Zero-JavaScript Runtime** static site built with [Hugo](https://gohugo.io/). This project follows a strict "Shift Left" philosophy: all complexity (diagram rendering, math processing, syntax highlighting) happens at **build time**, ensuring the browser receives only pure HTML/CSS.

## 🚀 Key Features
- **100/100 Lighthouse Performance**: No client-side JS bundles.
- **Build-Time Diagrams**: Mermaid.js and Excalidraw are pre-rendered to SVGs.
- **Server-Side Math**: KaTeX formulas are rendered to static HTML/CSS.
- **Critical CSS**: Styles are inlined in `<head>` to minimize network requests.
- **System Fonts**: Zero font layout shift or fetch latency.

## 🛠 Prerequisites
- **Node.js** (v18+)
- **Hugo Extended** (v0.120+)
  - *Option A*: Install globally (e.g., `brew install hugo`, `sudo apt install hugo`).
  - *Option B*: Rely on the local npm package (included in `package.json`).

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd zero-latency-blog

# Install build dependencies (Mermaid CLI, KaTeX, Hugo wrapper)
npm install
```

## ✍️ Development Workflow

To write content and preview changes instantly:

```bash
hugo server
```

> **Note**: In `hugo server` mode, Mermaid diagrams will appear as raw code blocks. This is expected behavior. We strictly avoid loading the heavy Mermaid JS runtime in the browser. To see the diagrams, run a production build.

## 🏗 Production Build

To build the site and trigger the asset processing pipeline:

```bash
npm run build
```

This command runs:
1. `hugo --minify` (Generates the site to `public/`)
2. `node scripts/postbuild.js` (Scans HTML, converts Mermaid/Math to static SVGs)

### Preview Production Artifact
To verify the zero-latency output:

```bash
npx serve public
```

Now navigate to the local server (usually `http://localhost:3000`). You should see fully rendered diagrams with **no JavaScript** executing in the network tab.

## 📂 Project Structure

```
├── .github/          # CI/CD Workflows (Cloudflare Pages)
├── content/          # Markdown posts
├── layouts/          # HTML Templates (Zero-JS)
│   ├── _default/     # baseof.html (Inline CSS), single.html
│   └── shortcodes/   # excalidraw.html
├── scripts/          # Build-time rendering logic (postbuild.js)
├── static/           # Static assets
├── hugo.toml         # Hugo configuration
└── package.json      # Build dependencies
```

## ☁️ Deployment

The project is configured for **Cloudflare Pages** via GitHub Actions.

1. Push code to GitHub.
2. The workflow defined in `.github/workflows/hugo.yml` will trigger.
3. It installs Hugo & Node, builds the site, and deploys `public/`.

**Secrets Required in GitHub:**
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## 🧩 Architectural Decisions
- **Why no Tailwind?** Tailwind is great, but we wanted absolute minimal CSS footprint. We use manually optimized CSS variables and Grid layouts inlined in `baseof.html`.
- **Why Node.js?** The ecosystem has the best tools for headless rendering (Puppeteer/Mermaid-CLI). We use it only as a build tool, never at runtime.
