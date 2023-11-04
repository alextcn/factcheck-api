import type { VercelRequest, VercelResponse } from '@vercel/node'
import { AI } from '../src/anthropic'
import brave from '../src/brave'
import { fetchSources } from '../src/sources'

type Params = {
  message: string
  inviteLink: string | undefined
}

export default async (request: VercelRequest, response: VercelResponse) => {
  // cors preflight
  if (request.method?.toUpperCase() === 'OPTIONS') {
    return response.status(200).send('ok')
  }

  // parse query params
  const { message } = request.query as Params

  const res = await brave.search(message)

  let webLinks: string[] = []
  if (res.infobox?.results && res.infobox.results[0]) {
    webLinks.push(res.infobox.results[0].url)
  }
  if (res.news?.results) {
    webLinks.push(res.news.results[0].url)
    webLinks.push(res.news.results[1].url)
    webLinks.push(res.web.results[0].url)
    webLinks.push(res.web.results[1].url)
    webLinks.push(res.web.results[2].url)
  } else {
    webLinks.push(res.web.results[0].url)
    webLinks.push(res.web.results[1].url)
    webLinks.push(res.web.results[2].url)
    webLinks.push(res.web.results[3].url)
    webLinks.push(res.web.results[4].url)
  }

  console.log('webLinks:', webLinks)

  const sources = await fetchSources(webLinks)
  console.log('sources:', sources)

  // const ai = new AI()
  // const joke = await ai.getJoke()

  response.status(200).json({
    message: message,
    webLinks: webLinks,
    sources: sources
    // joke: joke
  })
}
