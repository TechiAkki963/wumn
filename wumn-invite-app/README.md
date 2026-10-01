# WUMN Warm Invite Studio

A lightweight HTML/CSS/JavaScript + Node app for creating personalised WUMN welcome cards and outreach messages for designers, boutiques and fashion brands.

## What changed in v1.2

- European fashion-editorial typography: **Playfair Display** for display names/headings and **Manrope** for supporting/UI text. Playfair keeps the fashion-editorial character while giving personalised names a more balanced, readable silhouette.
- All invitation wording is editable from the app — no code changes required.
- Personalisation tokens can be used inside editable copy: `{client}`, `{brand}`, `{speciality}`, `{type}`.
- The ready-to-send WhatsApp/email message can also be edited directly before sending.
- A **Refresh from template** action restores the generated message after manual edits.
- A **Restore selected style** action restores the default copy for Warm Hello, Little Note, or Simple Welcome.
- WUMN logo assets remain bundled locally for reliable PNG exports.

## Run locally

1. Install Node.js 18 or newer.
2. Extract this folder.
3. Open a terminal inside `wumn-invite-app`.
4. Run:

```bash
npm start
```

5. Open `http://localhost:3000`.

No npm dependencies are required.

## Edit the wording

Open **Edit card & message wording** in the app. You can change:

- card opening
- main card message
- closing line
- sign-off
- footer note
- full outreach message template

Use tokens such as `{client}` and `{brand}` to keep the copy personalised. Example:

```text
We’d love to have {brand} with us.
```

The final message below the editor is also directly editable. WhatsApp, email and copy actions use exactly what is currently in that final message box.

## GitHub Pages hosting

GitHub Pages hosts the static HTML/CSS/JavaScript version. The Node server is only for local development.

1. Create a new GitHub repository, for example `wumn-invite-studio`.
2. From this folder run:

```bash
git init
git add .
git commit -m "Build WUMN warm invite studio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/wumn-invite-studio.git
git push -u origin main
```

3. On GitHub open **Settings → Pages**.
4. Choose **Deploy from a branch**.
5. Select **main** and **/(root)**.
6. Save.

Your site will be available at:

```text
https://YOUR-USERNAME.github.io/wumn-invite-studio/
```

## Fonts

The app requests Playfair Display and Manrope from Google Fonts for the fashion-editorial appearance. If the font service is unavailable, the CSS falls back to common local serif/sans-serif fonts so the app remains usable.
