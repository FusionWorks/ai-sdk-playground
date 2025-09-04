'use client';

import { MessageHeader } from './MessageHeader';
import { MessagePartRenderer } from './MessagePartRenderer';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MessageRendererProps } from '@/types/message';
import type { AIProvider } from '@/types/chat';

export function MessageRenderer({
  message,
  isLast,
  isLoading,
  className
}: MessageRendererProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  // Try to extract provider and timestamp from metadata
  const provider = message.metadata && typeof message.metadata === 'object' && 'provider' in message.metadata
    ? message.metadata.provider as AIProvider
    : undefined;

  const timestamp = message.metadata && typeof message.metadata === 'object' && 'timestamp' in message.metadata
    ? new Date(message.metadata.timestamp as string | number | Date)
    : new Date();

  const hasAnyContent = message.parts && message.parts.length > 0;

  return (
    <div className={cn(
      "flex gap-4",
      // User messages align to the right, AI messages align to the left
      isUser ? "justify-end" : "justify-start",
      className
    )}>
      {/* For user messages, show header on the right side */}
      {isUser && (
        <div className="flex items-start gap-3 flex-row-reverse">
          <MessageHeader
            message={message}
            provider={provider}
            timestamp={timestamp}
          />

          {/* User message content - aligned to the right */}
          <div className="space-y-3 max-w-[70%]">
            {hasAnyContent ? (
              message.parts.map((part, index) => (
                <MessagePartRenderer
                  key={`${message.id}-part-${index}`}
                  part={part}
                  messageId={message.id}
                  partIndex={index}
                />
              ))
            ) : (
              // Fallback for messages without parts
              <Card className="relative bg-primary text-primary-foreground">
                <CardContent className="p-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap break-words">
                      No content available
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* For AI messages, show header on the left side */}
      {isAssistant && (
        <div className="flex items-start gap-3">
          <MessageHeader
            message={message}
            provider={provider}
            timestamp={timestamp}
          />

          {/* AI message content - aligned to the left */}
          <div className="space-y-3 max-w-[70%]">
            {hasAnyContent ? (
              message.parts.map((part, index) => (
                <MessagePartRenderer
                  key={`${message.id}-part-${index}`}
                  part={part}
                  messageId={message.id}
                  partIndex={index}
                />
              ))
            ) : (
              // Show loading state when no content yet
              isLoading && (
                <Card className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </CardContent>
                </Card>
              )
            )}

            {/* Loading indicator for streaming */}
            {isLoading && isLast && hasAnyContent && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground pl-4">
                <Loader2 className="size-3 animate-spin" />
                <span>Generating response...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}