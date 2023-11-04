import type { VercelRequest, VercelResponse } from '@vercel/node'
import { AI, LLMSyntaxError } from '../src/anthropic'

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
  try {
    const result = await ai.factcheck(article)
    response.status(200).json(result)
  } catch (e) {
    if (e instanceof LLMSyntaxError) {
      return response.status(400).json({
        error: 'failed to parse LLM response',
        llmResponse: e.llmResponse
      })
    }
  }
}
