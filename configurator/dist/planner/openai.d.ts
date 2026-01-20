import OpenAI from 'openai';
/**
 * Get or create OpenAI client
 */
export declare function getOpenAIClient(): OpenAI;
/**
 * Generate a completion using OpenAI
 */
export declare function generateCompletion(systemPrompt: string, userPrompt: string, model?: string): Promise<string>;
/**
 * Generate structured JSON output using OpenAI
 */
export declare function generateStructuredOutput<T>(systemPrompt: string, userPrompt: string, model?: string): Promise<T>;
//# sourceMappingURL=openai.d.ts.map