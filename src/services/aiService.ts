/**
 * AI Service - OpenRouter Integration
 * Handles AI chat interactions using OpenRouter API (GLM 4.5 Air Free)
 */

import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'z-ai/glm-4.5-air-free';
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1';
const AI_SITE_URL = process.env.AI_SITE_URL || 'http://localhost:3000';
const AI_SITE_NAME = process.env.AI_SITE_NAME || 'ELMS Learning Platform';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

/**
 * Send a chat completion request to OpenRouter
 */
export async function chatCompletion(
  messages: ChatMessage[],
  temperature: number = 0.7,
  maxTokens: number = 2000
): Promise<string> {
  try {
    const response = await axios.post(
      `${AI_BASE_URL}/chat/completions`,
      {
        model: AI_MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
      } as ChatCompletionRequest,
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': AI_SITE_URL,
          'X-Title': AI_SITE_NAME,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiMessage = response.data.choices[0]?.message?.content;
    if (!aiMessage) {
      throw new Error('No response from AI');
    }

    return aiMessage;
  } catch (error: any) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    throw new Error('Failed to get AI response: ' + (error.response?.data?.error?.message || error.message));
  }
}

/**
 * Build system prompt for educational context
 */
export function buildSystemPrompt(studentName: string, courseName?: string): string {
  return `You are an AI Learning Assistant for ${AI_SITE_NAME}. You are helping ${studentName}${courseName ? ` with their ${courseName} course` : ''}.

Your role:
- Explain concepts clearly and patiently
- Help with homework and assignments (guide, don't give direct answers)
- Answer questions about course materials
- Provide study tips and learning strategies
- Be encouraging and supportive

Guidelines:
- Always be helpful and educational
- Break down complex topics into simple explanations
- Use examples when explaining concepts
- If asked to solve homework, guide the student through the process
- Never be condescending or judgmental
- Keep responses concise but thorough`;
}

/**
 * Format conversation history for AI context
 */
export function formatConversationHistory(
  history: Array<{ role: string; message: string }>,
  maxMessages: number = 10
): ChatMessage[] {
  return history
    .slice(-maxMessages) // Get last N messages
    .map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.message,
    }));
}

/**
 * Analyze uploaded file content (simplified - for PDFs, use pdf-parse library)
 */
export async function analyzeFileContent(
  fileContent: string,
  fileName: string,
  studentQuestion?: string
): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: 'You are an AI assistant helping students understand educational materials. Analyze the provided content and answer questions about it.',
    },
    {
      role: 'user',
      content: studentQuestion 
        ? `Here is content from ${fileName}:\n\n${fileContent}\n\nQuestion: ${studentQuestion}`
        : `Here is content from ${fileName}:\n\n${fileContent}\n\nPlease provide a brief summary of this content.`,
    },
  ];

  return await chatCompletion(messages, 0.7, 1500);
}

/**
 * Generate study material summary
 */
export async function generateMaterialSummary(
  materialTitle: string,
  materialType: string,
  courseContext?: string
): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: 'You are an AI assistant helping students understand their course materials.',
    },
    {
      role: 'user',
      content: `I've added a study material to my context: "${materialTitle}" (${materialType})${courseContext ? ` from ${courseContext} course` : ''}. Can you help me understand what topics this material might cover and how I should approach studying it?`,
    },
  ];

  return await chatCompletion(messages, 0.7, 500);
}

export default {
  chatCompletion,
  buildSystemPrompt,
  formatConversationHistory,
  analyzeFileContent,
  generateMaterialSummary,
};
