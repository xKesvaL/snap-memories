# SnapMemories

**Securely Download Your Snapchat Memories.**

SnapMemories is a privacy-first, client-side tool that allows you to easily download all your Snapchat memories and stories in a single ZIP file. 

**Website:** [https://snap-memories.vercel.app](https://snap-memories.vercel.app) (or your deployed URL)

---

## 🔒 Privacy & Security

We understand that your memories are private. That's why SnapMemories is built with a **Trust No One** architecture:

*   **Client-Side Processing:** All parsing and ZIP generation happens directly in your browser.
*   **Zero Data Upload:** Your `memories_history.html` file is never uploaded to our servers.
*   **Direct Connection:** Your browser connects directly to Snapchat's AWS servers (`aws.amazon.com` and `sc-cdn.net`) to fetch your media.
*   **Open Source:** The code is 100% open source and auditable.

## 🚀 Running Locally

If you are security-conscious, we encourage you to run this project locally on your own machine. This ensures that you are running the exact code you see here.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18+) or [Bun](https://bun.sh/) (v1.0+)
*   Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/xKesvaL/snap-memories.git
    cd snap-memories
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    # or
    npm install
    ```

3.  **Start the development server:**
    ```bash
    bun dev
    # or
    npm run dev
    ```

4.  **Open your browser:**
    Navigate to `http://localhost:3000` to use the tool.

## 🛠️ Building for Production

To build the application for production:

```bash
bun run build
# or
npm run build
```

This will generate a `dist` folder (or `.output` depending on configuration) that can be served by any static file host.

## ✅ How to Verify

You can verify that the code running in your browser matches the source code:

1.  **Check the Commit Hash:** The `/security` page displays the current build's commit hash. Compare this with the latest commit on GitHub.
2.  **Inspect Network Traffic:** Open your browser's DevTools (F12) -> Network tab. Verify that requests are only made to:
    *   `us-east1-aws.api.snapchat.com` (Metadata)
    *   `d2vwf4obepocaj.cloudfront.net` (Media CDN)
    *   `aws.amazon.com` (Storage)

## 💻 Tech Stack

*   [TanStack Start](https://tanstack.com/start) - Framework
*   [React](https://react.dev/) - UI Library
*   [Tailwind CSS](https://tailwindcss.com/) - Styling
*   [Shadcn UI](https://ui.shadcn.com/) - Components
*   [JSZip](https://stuk.github.io/jszip/) / [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) - ZIP generation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ☕ Support

This project is 100% free and open source. If it helped you save your memories, consider supporting the server costs:

[**Buy Me a Coffee**](https://buymeacoffee.com/kesvalstudio)
