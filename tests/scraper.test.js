const { extractData } = require('../src/extractor');

describe('Extractor', () => {
  test('extracts title and description', () => {
    const html = '<html><head><meta name="description" content="test desc"></head><body><h1>Test Title</h1></body></html>';
    const selectors = { title: 'h1', description: 'meta[name="description"]' };
    const data = extractData(html, selectors);
    expect(data.title).toBe('Test Title');
    expect(data.description).toBe('test desc');
  });
});
