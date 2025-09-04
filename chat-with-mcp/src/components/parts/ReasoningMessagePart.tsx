'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReasoningMessagePartProps } from '@/types/message';

export function ReasoningMessagePart({ 
  part, 
  className, 
  messageId, 
  partIndex 
}: ReasoningMessagePartProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={cn("border-l-4 border-l-purple-500/50 bg-purple-500/5", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Brain className="size-4 text-purple-500" />
            <span>Reasoning</span>
            {part.state === 'streaming' && (
              <Loader2 className="size-4 animate-spin text-purple-500" />
            )}
          </CardTitle>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="size-6"
          >
            {isExpanded ? (
              <ChevronDown className="size-3" />
            ) : (
              <ChevronRight className="size-3" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <ScrollArea className="max-h-64">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="bg-muted p-3 rounded-md text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                {part.text}
                {part.state === 'streaming' && (
                  <span className="inline-flex items-center gap-1 ml-2">
                    <Loader2 className="size-3 animate-spin" />
                  </span>
                )}
              </pre>
            </div>
          </ScrollArea>
        </CardContent>
      )}

      {!isExpanded && (
        <CardContent className="pt-0">
          <div className="text-sm text-muted-foreground">
            Click to view reasoning process...
          </div>
        </CardContent>
      )}
    </Card>
  );
}