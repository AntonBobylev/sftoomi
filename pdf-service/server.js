const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();
app.use(express.json({ limit: '50mb' }));

app.post('/convert', async (req, res) => {
    const { html, htmlFilepath, pdfFilepath } = req.body;

    let htmlContent = html;
    if (!htmlContent && htmlFilepath && fs.existsSync(htmlFilepath)) {
        htmlContent = fs.readFileSync(htmlFilepath, 'utf8');
    }

    if (!htmlContent) {
        return res.status(400).json({ error: 'No HTML content or valid htmlFilepath provided' });
    }

    let browser;
    try {
        browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ],
            headless: true,
        });

        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
        });

        if (pdfFilepath) {
            fs.writeFileSync(pdfFilepath, pdfBuffer);
            return res.json({ success: true, path: pdfFilepath });
        } else {
            res.setHeader('Content-Type', 'application/pdf');
            return res.send(pdfBuffer);
        }

    } catch (error) {
        console.error('PDF generation error:', error);
        return res.status(500).json({ error: error.message });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PDF Service running on port ${PORT}`);
});
