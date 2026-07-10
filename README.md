# Enough is Enough

Public open letter and signature wall, deployed as a static GitHub Pages site with Supabase providing persistent signatures.

## Launch checklist

1. Create a free Supabase project.
2. In its **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql).
3. In **Project Settings → API**, copy the project URL and anon public key into [`site/config.js`](site/config.js). The anon key is designed to be public; the database rules prevent public reads of emails and messages.
4. In the GitHub repository, open **Settings → Pages**, choose **GitHub Actions** as the deployment source, then push to `main`.
5. Test with a real email address. A signed name and ZIP should appear in last-name alphabetical order; other open pages refresh the wall within 30 seconds.

## Moderation

Use Supabase **Table Editor → signatures**. Delete spam or set `approved` to `false` to hide a signature from the public wall. Emails and messages never appear on the public view.

## Local preview

Serve the `site` folder with any static web server. It will only accept signatures after `site/config.js` is configured.
