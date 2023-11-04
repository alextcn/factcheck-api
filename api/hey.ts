import type { VercelRequest, VercelResponse } from '@vercel/node'
import { AI } from '../src/anthropic'

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

  const ai = new AI()
  const joke = await ai.getJoke()

  response.status(200).json({
    message: message,
    joke: joke
  })
}
