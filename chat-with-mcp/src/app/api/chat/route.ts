import { NextRequest, NextResponse } from 'next/server';
import { streamText, stepCountIs, convertToModelMessages, UIMessage } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { mcpClient } from '@/lib/mcp-client';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Request validation schema - simplified to match AI SDK expectations
const ChatRequestSchema = z.object({
  messages: z.array(z.any()), // Let AI SDK handle UIMessage validation
  provider: z.enum(['anthropic', 'openai']).default('anthropic'),
  model: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ChatRequestSchema.parse(body);

    const { messages, provider } = validatedData;

    // Convert UI messages to model messages format
    const modelMessages = convertToModelMessages(messages as UIMessage[]);

    // Select AI provider and model
    let modelProvider;
    let model: string;

    if (provider === 'anthropic') {
      if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json(
          { error: 'Anthropic API key not configured' },
          { status: 400 }
        );
      }
      modelProvider = anthropic;
      model = validatedData.model || 'claude-3-5-sonnet-20241022';
    } else if (provider === 'openai') {
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
          { error: 'OpenAI API key not configured' },
          { status: 400 }
        );
      }
      modelProvider = openai;
      model = validatedData.model || 'gpt-4o';
    } else {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      );
    }

    // Build system prompt with MCP capabilities
    const systemPrompt = 'You are a helpful AI assistant.';
    let tools = {};

    if (mcpClient.isEnabled()) {
      try {
        // Initialize MCP client and get tools
        await mcpClient.initialize();
        tools = await mcpClient.getTools();

      } catch (error) {
        console.error('Failed to initialize MCP tools:', error);
        // Continue without MCP tools
      }
    }

    // Stream the response
    const result = await streamText({
      model: modelProvider(model),
      system: systemPrompt,
      messages: modelMessages,
      tools,
      temperature: 0.7,
      stopWhen: stepCountIs(5),
      onFinish: async () => {
        // Clean up MCP clients after the response is complete
        try {
          await mcpClient.close();
        } catch (error) {
          console.error('Error closing MCP clients:', error);
        }
      },
    });

    // Return streaming response using the new API format
    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error('Chat API error:', error);

    // Ensure MCP clients are closed on error
    try {
      await mcpClient.close();
    } catch (closeError) {
      console.error('Error closing MCP clients after API error:', closeError);
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle CORS for development
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}