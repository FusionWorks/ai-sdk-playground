'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bot, User } from 'lucide-react';
import type { MessageHeaderProps } from '@/types/message';

export function MessageHeader({ message, provider, timestamp }: MessageHeaderProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  // Get display timestamp - prefer passed timestamp, then message metadata, then current time
  const displayTime = timestamp ||
    (message.metadata && typeof message.metadata === 'object' && 'timestamp' in message.metadata
      ? new Date(message.metadata.timestamp as string | number | Date)
      : new Date());

  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className={`text-xs font-medium ${isUser
          ? "bg-primary text-primary-foreground"
          : "bg-muted"
          }`}>
          {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message metadata - aligned to center of avatar */}
      <div className="flex flex-col justify-center min-h-[2rem]">
        {/* Main label */}
        <div className="text-base font-medium">
          {isUser ? 'You' : 'AI Assistant'}
        </div>

        {/* Secondary info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {displayTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>

          {isAssistant && provider && (
            <Badge variant="outline" className="text-xs">
              {provider === 'anthropic' ? 'Claude' : 'GPT'}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}