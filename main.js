const { app, BrowserWindow, shell, session } = require('electron');
const http = require('http'), fs = require('fs'), path = require('path');
const PORT = 5173; // add http://localhost:5173 in Google OAuth "Authorized JavaScript origins"
const FILES = { '/': ['index.html', 'text/html; charset=utf-8'], '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/sw.js': ['sw.js', 'text/javascript; charset=utf-8'], '/manifest.json': ['manifest.json', 'application/json'] };

function serve() {
  return new Promise((ok, fail) => {
    const srv = http.createServer((q, s) => {
      const f = FILES[q.url.split('?')[0]];
      if (!f) { s.writeHead(404); return s.end(); }
      fs.readFile(path.join(__dirname, f[0]), (e, d) => {
        if (e) { s.writeHead(500); return s.end(); }
        s.writeHead(200, { 'Content-Type': f[1] }); s.end(d);
      });
    });
    srv.on('error', fail);
    srv.listen(PORT, '127.0.0.1', ok);
  });
}

app.whenReady().then(async () => {
  try { await serve(); } catch (e) { /* port already used by another copy */ }
  const ses = session.defaultSession;
  // Google blocks sign-in from "Electron" user agents; present as plain Chrome
  ses.setUserAgent(ses.getUserAgent().replace(/\sElectron\/\S+/, '').replace(/\skrushi-erp\/\S+/i, ''));
  // Let SMS gateways answer browser requests (CORS) - desktop only
  ses.webRequest.onHeadersReceived((d, cb) => {
    const h = d.responseHeaders || {};
    if (!/google|gstatic/.test(d.url) && !d.url.startsWith('http://127.0.0.1')) {
      h['Access-Control-Allow-Origin'] = ['*']; h['Access-Control-Allow-Headers'] = ['*'];
    }
    cb({ responseHeaders: h });
  });
  const win = new BrowserWindow({ width: 1100, height: 760, minWidth: 420, autoHideMenuBar: true, title: 'Krushi ERP', backgroundColor: '#f4f1e8' });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/accounts\.google\.com/.test(url)) return { action: 'allow' }; // Google sign-in popup
    shell.openExternal(url); return { action: 'deny' };
  });
  win.loadURL('http://localhost:' + PORT + '/');
});
app.on('window-all-closed', () => app.quit());
