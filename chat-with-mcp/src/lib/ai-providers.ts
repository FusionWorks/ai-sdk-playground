import { Anthropic } from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import type { AIProvider } from '@/types/chat';

// Provider configurations
export const PROVIDERS = {
  anthropic: {
    id: 'anthropic' as const,
    name: 'Anthropic Claude',
    model: 'claude-4-sonnet',
    description: 'Advanced reasoning and analysis'
  },
  openai: {
    id: 'openai' as const,
    name: 'OpenAI GPT',
    model: 'gpt-5',
    description: 'Creative and versatile conversations'
  }
};

// Initialize Anthropic client
export function createAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  return new Anthropic({
    apiKey,
  });
}

// Initialize OpenAI client
export function createOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  return new OpenAI({
    apiKey,
  });
}

// Validate provider availability
export function validateProvider(provider: AIProvider): boolean {
  try {
    if (provider === 'anthropic') {
      return !!process.env.ANTHROPIC_API_KEY;
    } else if (provider === 'openai') {
      return !!process.env.OPENAI_API_KEY;
    }
    return false;
  } catch {
    return false;
  }
}

// Get available providers
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = [];

  if (validateProvider('anthropic')) {
    providers.push('anthropic');
  }

  if (validateProvider('openai')) {
    providers.push('openai');
  }

  return providers;
}