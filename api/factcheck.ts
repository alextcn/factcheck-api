import type { VercelRequest, VercelResponse } from '@vercel/node'
import { AI } from '../src/anthropic'

type Params = {
  article: string
}

export default async (request: VercelRequest, response: VercelResponse) => {
  // cors preflight
  if (request.method?.toUpperCase() === 'OPTIONS') {
    return response.status(200).send('ok')
  }

  // parse query params
  const { article } = request.query as Params
  if (!article) {
    return response.status(400).json({
      error: 'missing query param: article'
    })
  }

  const ai = new AI()
  const result = await ai.factcheck(article)

  console.log(result)

  response.status(200).json([
    {
      quote: 'The home secretary claimed streets risked',
      confidence: ['low', 'mid', 'high'][Math.floor(Math.random() * 3)],
      reason_to_doubt: 'The quote may not be accurate.'
    }
  ])
}
