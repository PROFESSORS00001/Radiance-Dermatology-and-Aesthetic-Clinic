const puppeteer = require('puppeteer');

let browserPromise = null;

async function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: 'new',
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
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  // Set the HTML content
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
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

  await page.close();
  return pdfBuffer;
}

module.exports = {
  generatePdfBuffer
};
