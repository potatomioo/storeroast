import * as cheerio from 'cheerio';

export async function scrapeWebsite(url: string) {
  try {
    // Ensure URL has protocol
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    const res = await fetch(formattedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; StoreRoastBot/1.0)' }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || '';
    
    // Get visible text from headers and paragraphs
    const textBlocks: string[] = [];
    $('h1, h2, h3, p, a.button, button').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 5) textBlocks.push(text);
    });
    
    return {
      type: 'website',
      title,
      description,
      visibleText: textBlocks.slice(0, 20).join('\n') // Limit to first 20 meaningful blocks to save tokens
    };
  } catch (e) {
    throw new Error('Failed to scrape website. Ensure the URL is accessible.');
  }
}
