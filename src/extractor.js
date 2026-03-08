const cheerio = require('cheerio');

function extractData(html, selectors) {
  const $ = cheerio.load(html);
  const data = {};
  for (const [key, selector] of Object.entries(selectors)) {
    if (key === 'links') {
      const allLinks = [...new Set($(selector).map((i, el) => $(el).attr('href')).get())];
      data[key] = allLinks.slice(0, 10);
    } else if (key === 'headings') {
      data[key] = $(selector).map((i, el) => $(el).text().trim()).get().slice(0, 20); // Limit to 20 headings
    } else if (key === 'paragraphs') {
      data[key] = $(selector).map((i, el) => $(el).text().trim()).get().slice(0, 50); // Limit to 50 paragraphs
    } else if (key === 'fullText') {
      data[key] = $(selector).text().trim();
    } else {
      let text = $(selector).text().trim() || $(selector).attr('content') || '';
      if (key === 'title' && text.length > 100) text = text.substring(0, 100) + '...';
      if (key === 'description' && text.length > 200) text = text.substring(0, 200) + '...';
      data[key] = text;
    }
  }
  return data;
}

module.exports = { extractData };
