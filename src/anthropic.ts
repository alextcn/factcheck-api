import Anthropic from '@anthropic-ai/sdk'

export class AI {
  client: Anthropic

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })
  }

  async getJoke(): Promise<string> {
    const completion = await this.client.completions.create({
      model: 'claude-2',
      max_tokens_to_sample: 300,
      prompt: `${Anthropic.HUMAN_PROMPT} How many toes do dogs have?${Anthropic.AI_PROMPT}`
    })

    console.log(`response: `, completion)
    
    return completion.completion
  }
}
