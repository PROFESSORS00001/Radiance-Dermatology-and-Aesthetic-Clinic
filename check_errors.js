const puppeteer = require('puppeteer');
const { spawn } = require('child_process');

(async () => {
  const vite = spawn('npx', ['vite', '--port', '5173'], { cwd: './frontend', shell: true });
  
  setTimeout(async () => {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER_ERROR:', err.toString()));
    
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' }).catch(e => console.log("GOTO ERROR", e));
    
    await browser.close();
    vite.kill();
    process.exit(0);
  }, 3000);
})();
