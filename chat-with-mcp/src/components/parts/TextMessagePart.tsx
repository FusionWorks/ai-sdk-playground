'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TextMessagePartProps } from '@/types/message';

export function TextMessagePart({ part, className, messageId, partIndex }: TextMessagePartProps) {
  return (
    <Card className={cn("relative", className)}>
      <CardContent className="px-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap break-words">
            {part.text}
            {/* Show streaming indicator if part is still streaming */}
            {part.state === 'streaming' && (
              <span className="inline-flex items-center gap-1 ml-2">
                <Loader2 className="size-3 animate-spin" />
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}