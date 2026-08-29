import { seoPageList, siteUrl } from "../../seo-pages";

const fallbackKey = "bf1d94f0e625ceac4d1d0b5032ce05cb";

function indexNowKey() {
  return process.env.INDEXNOW_KEY ?? fallbackKey;
}

export function GET() {
  return new Response(indexNowKey(), { headers: { "content-type": "text/plain; charset=utf-8" } });
}

export async function POST() {
  const key = indexNowKey();
  const urlList = [siteUrl, ...seoPageList.map(({ slug }) => `${siteUrl}/${slug}`)];
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ host: "www.unmarkdown.in", key, keyLocation: `${siteUrl}/api/indexnow`, urlList }),
  });
  return Response.json({ submitted: response.ok, status: response.status, urls: urlList.length }, { status: response.ok ? 200 : 502 });
}
