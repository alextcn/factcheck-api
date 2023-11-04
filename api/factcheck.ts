import type { VercelRequest, VercelResponse } from '@vercel/node'
import { AI, LLMSyntaxError } from '../src/anthropic'
import brave from '../src/brave'
import { bestSearchQuery } from '../src/utils'
import { fetchSources } from '../src/sources'

// Vercel Function config
export const config = {
  maxDuration: 120 // 2 minutes
}

export default async (request: VercelRequest, response: VercelResponse) => {
  // cors preflight
  if (request.method?.toUpperCase() === 'OPTIONS') {
    return response.status(200).send('ok')
  }

  // read article
  const article = request.body
  if (!article) {
    return response.status(400).json({
      error: 'missing article in the body'
    })
  }
  console.log('article:', `[${article.substring(0, 100)}...]`)

  const ai = new AI()

  // factcheck
  let factcheckItems: FactcheckItem[] = []
  try {
    factcheckItems = await ai.factcheck(article)
    if (factcheckItems.length === 0) {
      return response.status(200).json([])
    }
  } catch (e) {
    if (e instanceof LLMSyntaxError) {
      return response.status(400).json({
        error: 'failed to parse LLM response',
        llmResponse: e.llmResponse
      })
    }
  }

  // fetch sources
  const searchQuery = bestSearchQuery(factcheckItems)
  console.log('searchQuery:', searchQuery)
  if (!searchQuery) {
    // TODO: return format with sources
    return response.status(200).json(factcheckItems)
  }

  const res = await brave.search(searchQuery)
  let webLinks: string[] = []
  if (res.infobox?.results && res.infobox.results[0]) {
    webLinks.push(res.infobox.results[0].url)
  }
  if (res.news?.results) {
    webLinks.push(res.news.results[0].url)
    webLinks.push(res.web.results[0].url)
    webLinks.push(res.web.results[1].url)
  } else {
    webLinks.push(res.web.results[1].url)
    webLinks.push(res.web.results[2].url)
    webLinks.push(res.web.results[3].url)
  }
  console.log(`fetched ${webLinks.length} web links\n`, webLinks)

  const sources = await fetchSources(webLinks)
  console.log(`fetched ${sources.length} sources`)

  const result = await ai.proove(article, sources)
  response.status(200).json(result)
}
