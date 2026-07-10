import gplay from 'google-play-scraper';

export async function scrapePlayStore(appId: string) {
  try {
    const app = await gplay.app({ appId, lang: 'en', country: 'us' });
    const reviews = await gplay.reviews({ appId, num: 5, lang: 'en', country: 'us' });
    
    return {
      type: 'play_store',
      title: app.title,
      description: app.description,
      score: app.scoreText,
      installs: app.installs,
      screenshots: app.screenshots ? app.screenshots.slice(0, 3) : [],
      recentReviews: reviews.data.slice(0, 5).map(r => r.text)
    };
  } catch (e) {
    throw new Error('Failed to scrape Play Store. Ensure the appId is correct.');
  }
}
