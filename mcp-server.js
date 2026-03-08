const readline = require('readline');
const { scrapePage } = require('./src/scraper');
const { extractData } = require('./src/extractor');
const cheerio = require('cheerio');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  let message;
  try {
    message = JSON.parse(line);
    if (message.method === 'initialize') {
      const response = {
        jsonrpc: '2.0',
        id: message.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'open-scrape-mcp',
            version: '1.0.0'
          }
        }
      };
      console.log(JSON.stringify(response));
    } else if (message.method === 'tools/list') {
      const response = {
        jsonrpc: '2.0',
        id: message.id,
        result: {
          tools: [
            {
              name: 'scrape_page',
              description: 'Scrape a single web page for data',
              inputSchema: {
                type: 'object',
                properties: {
                  url: { type: 'string', description: 'URL to scrape' },
                  selectors: { type: 'object', description: 'CSS selectors for data extraction' },
                  screenshot: { type: 'boolean', description: 'Whether to take screenshot' },
                  screenshotType: { type: 'string', enum: ['viewport', 'full'], description: 'Screenshot type' }
                },
                required: ['url']
              }
            },
            {
              name: 'crawl_pages',
              description: 'Crawl pages starting from a URL up to max pages',
              inputSchema: {
                type: 'object',
                properties: {
                  startUrl: { type: 'string', description: 'Starting URL' },
                  maxPages: { type: 'number', description: 'Maximum pages to crawl', default: 20 }
                },
                required: ['startUrl']
              }
            }
          ]
        }
      };
      console.log(JSON.stringify(response));
    } else if (message.method === 'tools/call') {
      const { name, arguments: args } = message.params;
      if (name === 'scrape_page') {
        const { html } = await scrapePage(args.url, args.screenshot, null, args.screenshotType);
        const data = extractData(html, args.selectors || { title: 'h1', description: 'meta[name="description"]', links: 'a[href]', headings: 'h1,h2,h3,h4,h5,h6', paragraphs: 'p', fullText: 'body' });
        const response = {
          jsonrpc: '2.0',
          id: message.id,
          result: {
            content: [{ type: 'text', text: JSON.stringify({ url: args.url, ...data }) }]
          }
        };
        console.log(JSON.stringify(response));
      } else if (name === 'crawl_pages') {
        const maxPages = args.maxPages || 20;
        const visited = new Set();
        const toVisit = [args.startUrl];
        const results = [];
        while (toVisit.length > 0 && results.length < maxPages) {
          const url = toVisit.shift();
          if (visited.has(url)) continue;
          visited.add(url);
          try {
            const { html } = await scrapePage(url);
            const $ = cheerio.load(html);
            const links = $('a[href]').map((i, el) => $(el).attr('href')).get()
              .filter(href => href && href.startsWith('http'))
              .slice(0, 10)
              .map(href => {
                try { return new URL(href, url).href; } catch { return null; }
              })
              .filter(href => href && !visited.has(href) && !toVisit.includes(href));
            toVisit.push(...links);
            const data = extractData(html, { title: 'h1', description: 'meta[name="description"]', links: 'a[href]' });
            results.push({ url, ...data });
          } catch (error) {
            // skip
          }
        }
        const response = {
          jsonrpc: '2.0',
          id: message.id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(results) }]
          }
        };
        console.log(JSON.stringify(response));
      }
    }
  } catch (error) {
    const response = {
      jsonrpc: '2.0',
      id: message ? message.id : null,
      error: { code: -32000, message: error.message }
    };
    console.log(JSON.stringify(response));
  }
});
