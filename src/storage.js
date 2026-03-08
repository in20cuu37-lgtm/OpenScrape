const fs = require('fs').promises;
const sqlite3 = require('sqlite3').verbose();

async function saveData(data, format, path) {
  if (format === 'json') {
    await fs.writeFile(path, JSON.stringify(data, null, 2));
  } else if (format === 'csv') {
    // Simple CSV implementation
    if (Array.isArray(data)) {
      const keys = Object.keys(data[0]);
      const csv = [keys.join(',')];
      data.forEach(item => {
        csv.push(keys.map(key => item[key]).join(','));
      });
      await fs.writeFile(path, csv.join('\n'));
    }
  } else if (format === 'md') {
    let md = '# Scraped Data\n\n';
    data.forEach((item, index) => {
      md += `## Result ${index + 1}\n`;
      Object.entries(item).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          md += `- ${key}: ${value.join(', ')}\n`;
        } else {
          md += `- ${key}: ${value}\n`;
        }
      });
      md += '\n';
    });
    await fs.writeFile(path, md);
  } else if (format === 'xml') {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<results>\n';
    data.forEach(item => {
      xml += '  <result>\n';
      Object.entries(item).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          xml += `    <${key}>${value.join(', ')}</${key}>\n`;
        } else {
          xml += `    <${key}>${value}</${key}>\n`;
        }
      });
      xml += '  </result>\n';
    });
    xml += '</results>';
    await fs.writeFile(path, xml);
  } else if (format === 'sqlite') {
    // Simple SQLite
    const db = new sqlite3.Database(path);
    // Assume data is array of objects
    if (Array.isArray(data) && data.length > 0) {
      const keys = Object.keys(data[0]);
      const placeholders = keys.map(() => '?').join(',');
      const stmt = db.prepare(`INSERT INTO scraped_data (${keys.join(',')}) VALUES (${placeholders})`);
      data.forEach(item => {
        stmt.run(...keys.map(key => item[key]));
      });
      stmt.finalize();
      db.close();
    }
  }
}

module.exports = { saveData };
