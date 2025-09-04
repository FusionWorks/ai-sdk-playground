'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageRenderer } from '@/components/MessageRenderer';
import { MessageInput } from '@/components/message-input';
import { ProviderSelector } from '@/components/provider-selector';
import { MCPStatus } from '@/components/mcp-status';
import { ChevronRight, ChevronLeft, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AIProvider } from '@/types/chat';

export function ChatInterface() {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('anthropic');
  const [isMCPPanelOpen, setIsMCPPanelOpen] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop, error, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: () => ({
        provider: selectedProvider,
      }),
    }),
    onFinish: () => {
      // Scroll to bottom when message is complete
      setTimeout(() => {
        if (scrollAreaRef.current) {
          const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
          if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          }
        }
      }, 100);
    },
    onError: (error) => {
      console.error('Chat error:', error);
    }
  });

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current && messages.length > 0) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || status !== 'ready') return;

    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Fixed Header */}
      <header className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-semibold">AI Chat</h1>
            <p className="text-sm text-muted-foreground">
              Chat with AI using multiple providers with tool support
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ProviderSelector
              selectedProvider={selectedProvider}
              onProviderChange={setSelectedProvider}
              disabled={status !== 'ready'}
            />
            {/* MCP Panel Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMCPPanelOpen(!isMCPPanelOpen)}
              className="flex items-center gap-2"
            >
              <Server className="size-4" />
              MCP Status
              {isMCPPanelOpen ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Chat Area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Messages Area - Scrollable */}
          <div className="flex-1 min-h-0">
            <ScrollArea ref={scrollAreaRef} className="h-full">
              <div className="p-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full min-h-[400px]">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">Welcome to AI Chat</h3>
                      <p className="text-muted-foreground mb-4">
                        Start a conversation with AI using Anthropic Claude or OpenAI GPT
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                        <Card className="p-4">
                          <h4 className="font-medium mb-1">Ask anything</h4>
                          <p className="text-sm text-muted-foreground">
                            Get help with coding, writing, analysis, and more
                          </p>
                        </Card>
                        <Card className="p-4">
                          <h4 className="font-medium mb-1">Tool capabilities</h4>
                          <p className="text-sm text-muted-foreground">
                            Watch AI use tools in real-time via MCP servers
                          </p>
                        </Card>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-4xl mx-auto w-full">
                    {messages.map((message, index) => (
                      <MessageRenderer
                        key={message.id}
                        message={message}
                        isLast={index === messages.length - 1}
                        isLoading={status === 'streaming' && index === messages.length - 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex-shrink-0 p-4 border-t bg-background">
              <Card className="p-4 border-destructive bg-destructive/5">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-destructive">Error</div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {error.message || 'Something went wrong. Please try again.'}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => regenerate()}
                    className="text-sm bg-destructive/10 hover:bg-destructive/20 text-destructive px-3 py-1 rounded"
                  >
                    Retry
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* Stop button */}
          {(status === 'submitted' || status === 'streaming') && (
            <div className="flex-shrink-0 p-4 border-t bg-background">
              <div className="flex items-center justify-center">
                <button
                  onClick={stop}
                  className="text-sm bg-muted hover:bg-muted/80 px-4 py-2 rounded-md"
                >
                  Stop generating
                </button>
              </div>
            </div>
          )}

          {/* Fixed Message Input */}
          <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="p-4 max-w-4xl mx-auto w-full">
              <MessageInput
                input={input}
                handleInputChange={(e) => setInput(e.target.value)}
                handleSubmit={handleSubmit}
                isLoading={status !== 'ready'}
              />
            </div>
          </div>
        </div>

        {/* Collapsible MCP Status Panel */}
        <div className={cn(
          "flex-shrink-0 border-l bg-muted/5 transition-all duration-300 ease-in-out",
          isMCPPanelOpen ? "w-80" : "w-0 border-l-0"
        )}>
          <div className={cn(
            "h-full flex flex-col transition-opacity duration-300",
            isMCPPanelOpen ? "opacity-100" : "opacity-0"
          )}>
            {/* Panel Header */}
            <div className="flex-shrink-0 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">MCP Status</h3>
                  <p className="text-sm text-muted-foreground">
                    Model Context Protocol servers
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMCPPanelOpen(false)}
                  className="size-8"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>

            {/* Panel Content - Scrollable */}
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <MCPStatus />
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}