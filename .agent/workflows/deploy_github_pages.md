---
description: Deploy the application to GitHub Pages
---

1.  **Configure Base URL**:
    In `vite.config.ts`, set the `base` property to your repository name.

    ```typescript
    export default defineConfig({
      base: "/badminton-tournament.vga.com/", // MATCHES REPO NAME
      plugins: [react()],
      // ...
    });
    ```

2.  **Install `gh-pages`**:
    This utility allows us to publish a folder to the `gh-pages` branch on GitHub.

    ```bash
    bun add -d gh-pages
    ```

3.  **Update `package.json`**:
    Add these scripts to your `package.json`:

    ```json
    "scripts": {
      // ... existing scripts
      "predeploy": "bun run build",
      "deploy": "gh-pages -d dist"
    }
    ```

4.  **Deploy**:
    Run the deploy command. This will automatically build your app and push it to GitHub.

    ```bash
    bun run deploy
    ```

5.  **GitHub Settings**:
    - Go to your repository on GitHub.
    - Navigate to **Settings** > **Pages**.
    - Ensure behavior is set to deploy from the `gh-pages` branch.
