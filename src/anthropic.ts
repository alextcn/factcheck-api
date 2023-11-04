import Anthropic from '@anthropic-ai/sdk'

const PROMPT_TEMPLATE = `
<article>{{article}}</article>

Human: You are a knowledgeable fact-checker and misinformation reporter expert. 
Your goal is to help people find false, propagandistic, misleading statements.

Analyize the article above, find the most misleading statements and explain what's wrong with them.

Your answer will always be verified by a human, so do not worry about giving a certain answer,
just highlight the most prolific examples. 

Think step by step.

Reply with json: [
  {
    "quote: "<the quote you want to fact-check>",
    "reason_for_doubt": "<why do you think this is false?>",
    "danger_level": "<low/mid/high>"
  }
]

Or reply with empty JSON if no false statements were found: []. Do not add preambles or postscripts.

Assistant: 
[
`

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

    return completion.completion
  }

  async factcheck(article: string): Promise<string> {
    const completion = await this.client.completions.create({
      model: 'claude-2',
      max_tokens_to_sample: 10_000,
      prompt: PROMPT_TEMPLATE.replace('{{article}}', article)
    })

    // TODO: add types
    // TODO: handle parse errors
    const response = '[' + completion.completion
    console.log(`anthropic response:`, response)

    return JSON.parse(response)
  }
}
