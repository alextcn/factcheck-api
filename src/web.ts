import got from 'got'
import textVersion from 'textversionjs'

async function fetchSource(url: string): Promise<string | null> {
  try {
    const res = await got.get(url)
    return textVersion(res.body)
  } catch (e) {
    console.error(`failed to fetch source: ${url}`, e)
    return null
  }
}

export async function fetchSources(urls: string[]): Promise<string[]> {
  const responses = await Promise.all(urls.map((url) => fetchSource(url)))
  return responses.filter((text) => text !== null).map((text) => textVersion(text))
}
