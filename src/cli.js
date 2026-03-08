const chalk = require('chalk');
const figlet = require('figlet');
const { Command } = require('commander');

const program = new Command();

program
  .name('open-scrape')
  .description('A local web scraper using Puppeteer')
  .version('1.0.0');

program
  .command('scrape')
  .description('Scrape URLs from config')
  .option('-c, --config <path>', 'config file path', './config/default.yaml')
  .action(async (options) => {
    try {
      const configText = await fs.readFile(options.config, 'utf8');
      const config = yaml.parse(configText);
      const results = [];
      if (config.screenshots && config.screenshots.enabled) {
        await fs.mkdir(path.resolve(config.screenshots.dir), { recursive: true });
      }
      for (const url of config.urls) {
        console.log(`Scraping ${url}...`);
        const html = await scrapePage(url, config.screenshots ? config.screenshots.enabled : false, config.screenshots ? config.screenshots.dir : './output/screenshots');
        const data = extractData(html, config.selectors);
        results.push({ url, ...data });
        await new Promise(resolve => setTimeout(resolve, config.delay));
      }
      await saveData(results, config.output.format, config.output.path);
      console.log('Scraping complete.');
    } catch (error) {
      console.error('Error:', error.message);
    }
  });

program
  .command('serve')
  .description('Start the API server')
  .action(() => {
    require('./api');
  });

program
  .command('interactive')
  .description('Run interactive scraping mode')
  .action(async () => {
    const { runInteractive } = require('./interactive');
    await runInteractive();
  });

program.helpOption(false);

program.parse();

if (process.argv.length === 2) {
  process.exit(0);
}
