# Enough is Enough

Frozen public record of the open letter to Mayor Michelle Wu and its 4,000 signatories.

The petition closed on July 16, 2026. The GitHub Pages site is fully static and has no database or form dependency. [`signatures.js`](signatures.js) contains only the public snapshot needed by the page: signer names, ZIP codes, and comments. It does not contain email addresses, roles, consent choices, database IDs, or timestamps.

## Local preview

Serve the repository root with any static web server. For example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.
