# Krushi ERP (offline-first, Google Drive backend)
Busy/Tally-style double-entry ERP for agri input shops. Masters (Accounts, Items, Groups, Units), 8 voucher types (Sales, Purchase, Receipt, Payment, Sales/Purchase Return, Journal, Contra) with F4-F9 keys, Day Book, Ledger, Trial Balance, P&L, Stock, Outstanding, GST summary, Expiry/Low stock, print, SMS, Drive sync, PIN lock.

## Deploy on GitHub
1. New repo -> upload `index.html`, `sw.js`, `manifest.json`, `README.md`.
2. Settings -> Pages -> Deploy from branch `main` / root. Open the URL on phone -> "Add to Home screen".

## Google Drive (no cloud server)
1. console.cloud.google.com -> new project -> enable **Google Drive API**.
2. OAuth consent screen (External, add yourself as test user) -> Credentials -> **OAuth client ID (Web)**; add your GitHub Pages origin under "Authorized JavaScript origins".
3. Paste Client ID in App -> Settings -> Save -> Sync now.
Files in your Drive: `krushi-erp-data.json` (full backup) and `vasooli-sync.json` (for the Vasooli app).
Scope is `drive.file`: the Vasooli Android app must use the **same Google Cloud project/client** (same account) to see these files.

## vasooli-sync.json format
`{v:1, updated, shop, customers:[{id,name,village,phone,balance}], ledger:[{id,date,cid,type:"sale"|"payment"|"return",amount,paid}]}`

## SMS
Settings -> URL with `{to}` and `{msg}` (GET) or a JSON body template (POST). Offline messages wait in an outbox and go out when online.
Note: if your SMS provider blocks browser (CORS) calls, send via a tiny proxy or use their CORS-enabled endpoint.

## Desktop (.exe for Windows)
Same code, wrapped in Electron. Data stays on the PC (offline) and syncs to Drive when online.
**Build without installing anything:** push the whole folder (including `.github/`) to GitHub -> Actions tab -> "Build Windows EXE" -> Run workflow -> download `Krushi-ERP-Setup` (the installer .exe) from the finished run.
**Or on your PC:** install Node.js, then `npm install` and `npm run dist` (installer appears in `dist/`); `npm start` to test.
Google OAuth: also add `http://localhost:5173` to "Authorized JavaScript origins".
