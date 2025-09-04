'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Database,
  ChevronDown,
  ChevronRight,
  Code
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DataMessagePartProps } from '@/types/message';

export function DataMessagePart({
  part,
  className,
  messageId,
  partIndex
}: DataMessagePartProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract data type from the part type (e.g., "data-custom" -> "custom")
  const getDataType = (): string => {
    if (part.type.startsWith('data-')) {
      return part.type.replace('data-', '');
    }
    return 'unknown';
  };

  const formatData = (data: unknown): string => {
    if (data === null || data === undefined) return 'null';
    if (typeof data === 'string') return data;
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const dataType = getDataType();
  const hasData = part.data !== null && part.data !== undefined;

  return (
    <Card className={cn("border-l-4 border-l-emerald-500/50 bg-emerald-500/5", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Database className="size-4 text-emerald-500" />
            <span>Data</span>
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              {dataType}
            </code>
          </CardTitle>

          {hasData && (
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
          )}
        </div>

        {/* Data ID if available */}
        {part.id && (
          <div className="text-xs text-muted-foreground font-mono">
            ID: {part.id}
          </div>
        )}
      </CardHeader>

      {isExpanded && hasData && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">Data Content</h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
              >
                <Code className="size-3 mr-1" />
                Raw
              </Button>
            </div>

            <ScrollArea className="max-h-64">
              <pre className="bg-muted p-3 rounded-md text-xs font-mono overflow-x-auto">
                <code>{formatData(part.data)}</code>
              </pre>
            </ScrollArea>
          </div>
        </CardContent>
      )}

      {!isExpanded && hasData && (
        <CardContent className="pt-0">
          <div className="text-sm text-muted-foreground">
            Click to view data content...
          </div>
        </CardContent>
      )}

      {!hasData && (
        <CardContent className="pt-0">
          <div className="text-sm text-muted-foreground">
            No data content available
          </div>
        </CardContent>
      )}
    </Card>
  );
}