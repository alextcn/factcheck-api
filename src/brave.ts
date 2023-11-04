import got from 'got'

// TODO: update type
type ResponseItem = {
  title: string
  url: string
  description: string
  thumbnail: string
}

// TODO: update result types
async function search(query: string): Promise<string> {
  const q = encodeURIComponent(query)
  const res = await got.get(`https://api.search.brave.com/res/v1/web/search?q=${q}`, {
    headers: {
      'X-Subscription-Token': process.env.BRAVE_API_KEY!,
      'Content-Type': 'application/json'
    }
  })
  const items = JSON.parse(res.body) as ResponseItem[]
  
  // TODO: return result
  return 'return response'
}

const brave = {}

export default brave
