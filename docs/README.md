# Open-Scrape

A local web scraper using NodeJS and Puppeteer to scrape remote websites and store data locally.

## Installation

Clone the repository and run:

```bash
npm install
```

## Usage

Run the scraper with:

```bash
node src/cli.js scrape
```

Or after installing globally:

```bash
npm link
open-scrape scrape
```

## Configuration

Edit `config/default.yaml` to set URLs to scrape, CSS selectors for data extraction, output format, file path, and delay between requests.

Example config:

```yaml
urls:
  - https://example.com
selectors:
  title: h1
  description: meta[name="description"]
  links: a[href]
output:
  format: json
  path: ./output.json
delay: 1000
screenshots:
  enabled: true
  dir: ./output/screenshots
```

## Features

- Scrape multiple URLs with configurable delays
- Extract data using CSS selectors
- Take screenshots of scraped pages and save to output directory
- Save to JSON, CSV, or SQLite
- CLI interface with Commander
- Headless browser automation with Puppeteer

## Testing

Run tests with:

```bash
npm test
```

## License

ISC
