export enum SORT {
  MOST_RELEVANT = 1,
  NEWEST = 2,
  RATING = 3,
}

const URL =
  "https://play.google.com/_/PlayStoreUi/data/batchexecute?hl=id&gl=id";

export async function getReviews(
  appId: string,
  count: number,
  sort: SORT = SORT.MOST_RELEVANT,
  score: number = 0,
): Promise<{ reviews: string[]; appName: string; icon: string }> {
  try {
    // Fetch reviews
    const response = await fetch(
      `${URL}&f.req=%5B%5B%5B%22oCPfdb%22%2C%22%5Bnull%2C%5B2%2C${sort}%2C%5B${count}%5D%2Cnull%2C%5Bnull%2C${score}%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C2%5D%5D%2C%5B%5C%22${appId}%5C%22%2C7%5D%5D%22%2Cnull%2C%22generic%22%5D%5D%5D%0A`,
      { method: "post" },
    );
    const text = await response.text();
    const data = JSON.parse(text.replace(")]}'\n\n", ""));
    const reviewsData = JSON.parse(data[0][2])[0] as [
      unknown,
      unknown,
      unknown,
      string,
      ...any[],
    ][];

    const reviews = reviewsData.map((review) => review[4]);

    const htmlRes = await fetch(
      `https://play.google.com/store/apps/details?id=${appId}&hl=id`,
    );
    const html = await htmlRes.text();

    const nameMatch = html.match(
      /<span class="AfwdI" itemprop="name">([^<]+)<\/span>/,
    );
    const appName = nameMatch ? nameMatch[1] : "Unknown App";

    let icon: string | undefined = undefined;
    const iconTagMatch = html.match(/<img[^>]+itemprop=["']image["'][^>]+>/i);
    if (iconTagMatch) {
      const tag = iconTagMatch[0];
      const srcMatch = tag.match(/src=["']([^"']+)["']/i);
      const srcsetMatch = tag.match(/srcset=["']([^"']+)["']/i);
      if (srcMatch) icon = srcMatch[1];
      else if (srcsetMatch) {
        const urls = srcsetMatch[1].split(/\s+/);
        icon = urls[0];
      }
    }

    if (!icon) icon = "https://via.placeholder.com/150";

    return { reviews, appName, icon };
  } catch (e) {
    console.error(e);
    throw new Error(
      `Failed to fetch reviews: ${e instanceof Error ? e.message : String(e)}`,
    );
  }
}
