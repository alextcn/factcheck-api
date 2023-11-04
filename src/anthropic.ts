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
    "danger_level": "<low/mid/high>",
    "search_queries": [
      "<query to find more factual information about this claim>"
    ]
  }
]

Or reply with empty JSON if no false statements were found: []. Do not add preambles or postscripts.

Assistant: 
[
`

const PROOVE_PROMPT_TEMPLATE = `
{{sources}}


<article>{{article}}</article>


Human: You are a knowledgeable fact-checker and misinformation reporter expert. 
Your goal is to help people find false, propagandistic, misleading statements.

1. Analyize the article above
2. Find the most false and highly misleadeing statements
3. Explain what's wrong with them based on sources
4. Provide sources to back up your claims

Your answer will always be verified by a human, so do not worry about giving a certain answer,
just highlight the most prolific examples.

Think step by step.

Reply with json: [
  {
    "quote: "<the quote you want to fact-check>",
    "reason_for_doubt": "<why do you think this is false?>",
    "danger_level": "<low/mid/high>",
    "sources": [
      {
        "url": "<url to the source>",
        "content": "<quote source>"
      }
    ]
  }
]

Or reply with empty JSON if no false statements were found: []. Do not add preambles or postscripts.

Assistant: 
[
`

export class LLMSyntaxError extends Error {
  llmResponse: string

  constructor(message: string, llmResponse: string) {
    super(message)
    Object.setPrototypeOf(this, LLMSyntaxError.prototype)
    this.llmResponse = llmResponse
  }
}

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

  async factcheck(article: string): Promise<FactcheckItem[]> {
    const completion = await this.client.completions.create({
      model: 'claude-2',
      max_tokens_to_sample: 10_000,
      prompt: PROMPT_TEMPLATE.replace('{{article}}', article)
    })

    const response = '[' + completion.completion
    console.log(`----------------\nanthropic factcheck response:\n\n${response}\n----------------`)

    try {
      return JSON.parse(response) as FactcheckItem[]
    } catch (e) {
      throw e instanceof SyntaxError
        ? new LLMSyntaxError(e.message, '[' + completion.completion)
        : e
    }
  }

  async proove(
    article: string,
    sources: { url: string; content: string }[]
  ): Promise<ProoveItem[]> {
    const completion = await this.client.completions.create({
      model: 'claude-2',
      max_tokens_to_sample: 10_000,
      prompt: PROOVE_PROMPT_TEMPLATE.replace('{{article}}', article).replace(
        '{{sources}}',
        sources.map((s) => `<source url="${s.url}">${s.content}</source>`).join('\n')
      )
    })

    // TODO: add types
    const response = '[' + completion.completion
    console.log(`----------------\nanthropic proove response:\n\n${response}\n----------------`)

    try {
      return JSON.parse(response) as ProoveItem[]
    } catch (e) {
      throw e instanceof SyntaxError
        ? new LLMSyntaxError(e.message, '[' + completion.completion)
        : e
    }
  }
}
