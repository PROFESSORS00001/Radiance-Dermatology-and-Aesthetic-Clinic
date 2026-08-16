const puppeteer = require('puppeteer');
const fs = require('fs');
const os = require('os');
const path = require('path');

let browserPromise = null;

async function getBrowser() {
  if (!browserPromise) {
    let executablePath = undefined;
    
    // Check common paths for Chrome on Windows
    if (process.platform === 'win32') {
      const possiblePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        path.join(os.homedir(), 'AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'),
        path.join(os.homedir(), 'Local Settings\\Application Data\\Google\\Chrome\\Application\\chrome.exe')
      ];
      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          executablePath = p;
          console.log("Found local Chrome executable for PDF generation:", executablePath);
          break;
        }
      }
    }

    browserPromise = puppeteer.launch({
      headless: 'new',
      executablePath: executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
  }
  return browserPromise;
}

/**
 * Generates a PDF buffer from an HTML string
 * @param {string} htmlContent - The HTML string to convert
 * @returns {Promise<Buffer>} - The generated PDF buffer
 */
async function generatePdfBuffer(htmlContent) {
  let page = null;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    
    // Set the HTML content with a 15s timeout and domcontentloaded to prevent network hangs
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
        right: '0.5in'
      }
    });

    return pdfBuffer;
  } finally {
    if (page) {
      try { await page.close(); } catch (e) {}
    }
  }
}

module.exports = {
  generatePdfBuffer
};
