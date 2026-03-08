# OpenScrape CLI

Interactive CLI tool for web scraping with Puppeteer. Extract titles, descriptions, links, headings, paragraphs, and full text from any website.

## Installation

### Global Installation
```bash
npm install -g openscrape-cli
```

### Local Installation
```bash
npm install openscrape-cli
```

## Usage

### Interactive Mode
```bash
openscrape
```
Or if installed locally:
```bash
npx openscrape-cli
```

### Using the MCP Server
To use the MCP server capabilities, run:
```bash
node mcp-server.js
```

The MCP server provides two tools:
- `scrape_page`: Scrape a single web page
- `crawl_pages`: Crawl multiple pages starting from a URL

## Features

- **Interactive CLI**: User-friendly terminal interface with colorful prompts
- **Screenshot Support**: Capture full page or viewport screenshots
- **Multiple Output Formats**: Save results as Markdown, XML, or HTML
- **Comprehensive Extraction**: Extract titles, descriptions, links, headings, paragraphs, and full text
- **MCP Server**: Model Context Protocol server for integration with AI assistants

## Example

```
 ██████╗ ██████╗ ███████╗███╗   ██╗███████╗ ██████╗██████╗  █████╗ ██████╗ ███████╗
██╔═══██╗██╔══██╗██╔════╝████╗  ██║██╔════╝██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔════╝
██║   ██║██████╔╝█████╗  ██╔██╗ ██║███████╗██║     ██████╔╝███████║██████╔╝█████╗
██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║╚════██║██║     ██╔══██╗██╔══██║██╔═══╝ ██╔══╝
╚██████╔╝██║     ███████╗██║ ╚████║███████║╚██████╗██║  ██║██║  ██║██║     ███████╗
 ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚══════╝

Current directory: /your/project/directory
────────────────────────────────────────────────────────────────────────────────
┌─ > Enter the URL to scrape:─┐
```

## Configuration

Create a `config/default.yaml` file to configure scraping options:

```yaml
urls:
  - https://example.com
  - https://example.org
screenshots:
  enabled: true
  dir: ./output/screenshots
output:
  format: md
  path: ./output/scraped.md
delay: 1000
```

## Requirements

- Node.js 18+
- npm

## License

ISC
