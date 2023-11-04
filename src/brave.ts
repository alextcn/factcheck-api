import got from 'got'

// TODO: update type
type ResponseItem = {
  title: string
  url: string
  description: string
  thumbnail: string
}

async function search(query: string): Promise<SearchResponse> {
  const q = encodeURIComponent(query)
  return await got
    .get(`https://api.search.brave.com/res/v1/web/search?q=${q}`, {
      headers: {
        'X-Subscription-Token': process.env.BRAVE_API_KEY!,
        'Content-Type': 'application/json'
      }
    })
    .json<SearchResponse>()
}

const brave = {
  search
}

export default brave
