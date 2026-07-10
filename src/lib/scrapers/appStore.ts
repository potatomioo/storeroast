export async function scrapeAppStore(appId: string) {
  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${appId}&country=us`);
    const data = await res.json();
    if (!data.results || data.results.length === 0) throw new Error('App not found');
    
    const app = data.results[0];
    return {
      type: 'app_store',
      title: app.trackName,
      description: app.description,
      score: app.averageUserRating,
      screenshots: app.screenshotUrls ? app.screenshotUrls.slice(0, 3) : [],
      releaseNotes: app.releaseNotes,
    };
  } catch (e) {
    throw new Error('Failed to scrape App Store. Ensure the ID is correct.');
  }
}
