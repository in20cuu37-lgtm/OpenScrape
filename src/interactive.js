const inquirer = require('inquirer');
const figlet = require('figlet');
const chalk = require('chalk');
const { scrapePage } = require('./scraper');
const { extractData } = require('./extractor');
const { saveData } = require('./storage');
const fs = require('fs');
const fsPromises = require('fs').promises;

async function runInteractive() {
  console.log(chalk.cyan(figlet.textSync('OpenScrape', 'ANSI Shadow')));
  console.log(chalk.yellow(`Current directory: ${process.cwd()}`));
  console.log(chalk.gray('─'.repeat(80)));
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: chalk.white('> Enter the URL to scrape:'),
      validate: (input) => input.startsWith('http') ? true : 'Please enter a valid URL',
      prefix: chalk.blue('┌─'),
      suffix: chalk.blue('─┐'),
    },
    {
      type: 'checkbox',
      name: 'options',
      message: chalk.white('Select options (use space to select, arrow keys to navigate):'),
      choices: [
        { name: 'Enable Screenshots', value: 'screenshots' },
      ],
      prefix: chalk.blue('┌─'),
    },
    {
      type: 'list',
      name: 'screenshotType',
      message: chalk.white('Select screenshot type:'),
      choices: [
        { name: 'Full Page', value: 'full' },
        { name: 'Viewport', value: 'viewport' },
      ],
      when: (answers) => answers.options.includes('screenshots'),
      prefix: chalk.blue('┌─'),
    },
  ]);
  const baseName = answers.url.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').toLowerCase();
  let folder = `output/${baseName}`;
  let counter = 0;
  while (fs.existsSync(folder)) {
    counter++;
    folder = `output/${baseName}-${counter}`;
  }
  fs.mkdirSync(folder, { recursive: true });
  if (answers.options.includes('screenshots')) {
    fs.mkdirSync(`${folder}/screenshots`, { recursive: true });
  }
  const screenshotPath = answers.options.includes('screenshots') ? `${folder}/screenshots/screenshot.png` : null;
  console.log(chalk.blue('Scraping...'));
  let dots = 0;
  let interval = setInterval(() => {
    dots = (dots + 1) % 4;
    process.stdout.write(`\rScraping${'.'.repeat(dots)}`);
  }, 500);
  try {
    const result = await scrapePage(answers.url, !!screenshotPath, screenshotPath, answers.screenshotType || 'viewport');
    const config = { selectors: { title: 'h1', description: 'meta[name="description"]', links: 'a[href]' } };
    const data = extractData(result.html, config.selectors);
    const results = [{ url: answers.url, ...data }];
    await saveData(results, 'md', `${folder}/scraped.md`);
    await saveData(results, 'xml', `${folder}/scraped.xml`);
    await fsPromises.writeFile(`${folder}/scraped.html`, result.html);
    if (answers.options.includes('screenshots')) {
      clearInterval(interval);
      dots = 0;
      interval = setInterval(() => {
        dots = (dots + 1) % 4;
        process.stdout.write(`\rCapturing${'.'.repeat(dots)}`);
      }, 500);
      setTimeout(() => {
        clearInterval(interval);
        console.log(`\nScraping complete! Results saved to ${folder}`);
      }, 1000);
    } else {
      clearInterval(interval);
      console.log(`\nScraping complete! Results saved to ${folder}`);
    }
  } catch (error) {
    clearInterval(interval);
    fs.rmSync(folder, { recursive: true, force: true });
    if (error.message.includes('net::ERR_NAME_NOT_RESOLVED') || error.message.includes('ERR_NAME_NOT_RESOLVED')) {
      console.log(chalk.red(figlet.textSync('URL NOT FOUND', { horizontalLayout: 'full' })));
      process.exit(0);
    } else {
      console.error('Error:', error.message);
    }
  }
}

module.exports = { runInteractive };
