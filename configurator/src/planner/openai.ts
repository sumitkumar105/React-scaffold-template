import OpenAI from 'openai'

let client: OpenAI | null = null

/**
 * Get or create OpenAI client
 */
export function getOpenAIClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY environment variable is not set. ' +
        'Please set it in your environment or create a .env file.'
      )
    }

    client = new OpenAI({ apiKey })
  }

  return client
}

/**
 * Generate a completion using OpenAI
 */
export async function generateCompletion(
  systemPrompt: string,
  userPrompt: string,
  model: string = 'gpt-4-turbo-preview'
): Promise<string> {
  const openai = getOpenAIClient()

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.2,
    max_tokens: 2000,
  })

  return response.choices[0]?.message?.content || ''
}

/**
 * Generate structured JSON output using OpenAI
 */
export async function generateStructuredOutput<T>(
  systemPrompt: string,
  userPrompt: string,
  model: string = 'gpt-4-turbo-preview'
): Promise<T> {
  const openai = getOpenAIClient()

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.2,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content || '{}'
  return JSON.parse(content) as T
}
