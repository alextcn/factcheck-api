import got from 'got'
import textVersion from 'textversionjs'

async function fetchSource(url: string): Promise<{ url: string; content: string | null }> {
  try {
    const res = await got.get(url)
    return {
      url: url,
      content: textVersion(res.body)
    }
  } catch (e) {
    console.error(`failed to fetch source: ${url}`, e)
    return {
      url: url,
      content: null
    }
  }
}

export async function fetchSources(urls: string[]): Promise<{ url: string; content: string }[]> {
  const responses = await Promise.all(urls.map((url) => fetchSource(url)))
  return responses
    .filter((r) => r.content !== null)
    .map((r) => ({ url: r.url, content: r.content! }))
}
