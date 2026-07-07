// Render social share cards: og-image.png (landing) + og/<slug>.png per chapter.
// Usage: node gen_og.js
const path = require('path');
const fs = require('fs');
const puppeteer = require(path.resolve(__dirname, '../Platform/node_modules/puppeteer-core'));

const CHAPTERS = [
  ['youth', 'Youth & Generational Fairness', 'A Hopeful Future For Young Ontarians'],
  ['seniors', 'Seniors', 'No Seniors Left Behind'],
  ['economy', 'Economy', 'An Opportunity Economy'],
  ['democracy', 'Democracy & Governance', 'Restore Faith That Democracy Can Deliver'],
  ['housing', 'Housing & Municipalities', 'Build Homes, Build Communities, Build Futures'],
  ['health', 'Health', 'Healthcare You Can Depend On'],
  ['education', 'Education', 'Get Serious About Education'],
  ['energy', 'Energy & Resources', 'Clean Energy For A Prosperous Future'],
  ['north', 'North & Rural', 'Northern and Rural Communities Deserve Better'],
  ['transportation', 'Transportation', 'Build The Future Of Transportation'],
  ['welfare', 'Welfare & Social Safety', 'A Welfare System That Lifts People Up'],
  ['justice', 'Justice, Safety & Immigration', 'Real Justice and Orderly Immigration'],
  ['reform', 'Reform Dividends', 'Reform Dividends'],
];

(async () => {
  fs.mkdirSync(path.resolve(__dirname, 'og'), { recursive: true });
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new', args: ['--no-sandbox', '--allow-file-access-from-files', '--font-render-hinting=none'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
  await page.goto('file://' + path.resolve(__dirname, 'og-image.html'), { waitUntil: 'networkidle0' });

  // landing card (template as-is)
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.resolve(__dirname, 'og-image.png') });
  console.log('og-image.png (landing)');

  for (const [slug, theme, title] of CHAPTERS) {
    await page.evaluate(([theme, title]) => {
      const k = document.querySelector('.kicker');
      const h = document.querySelector('h1');
      k.textContent = `${theme} · Eric Lombardi for Ontario`;
      h.textContent = title;
      h.style.whiteSpace = 'normal';
      h.style.textWrap = 'balance';
      // auto-fit: shrink kicker to one line, title block to the frame
      k.style.whiteSpace = 'nowrap';
      let kf = 24;
      while (k.scrollWidth > 1020 && kf > 15) { kf -= 1; k.style.fontSize = kf + 'px'; }
      // prefer 2 big lines; allow 3 for the longest titles; never more
      const linesAt = (f) => {
        h.style.fontSize = f + 'px';
        return Math.round(h.offsetHeight / (f * 1.02));
      };
      let chosen = null;
      for (const [maxLines, minFont] of [[2, 88], [3, 72]]) {
        for (let f = 118; f >= minFont; f -= 2) {
          if (linesAt(f) <= maxLines && h.scrollWidth <= 1030) { chosen = f; break; }
        }
        if (chosen) break;
      }
      h.style.fontSize = (chosen || 72) + 'px';
    }, [theme, title]);
    await new Promise(r => setTimeout(r, 120));
    await page.screenshot({ path: path.resolve(__dirname, `og/${slug}.png`) });
    console.log(`og/${slug}.png`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
