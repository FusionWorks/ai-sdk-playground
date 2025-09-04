'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  ChevronDown,
  ChevronRight,
  Hammer,
  Loader2,
  CheckCircle,
  AlertCircle,
  Code,
  Play,
  Square
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ToolCallMessagePartProps, ToolCallState } from '@/types/message';

export function ToolCallMessagePart({
  part,
  className,
  messageId,
  partIndex
}: ToolCallMessagePartProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRawInput, setShowRawInput] = useState(false);

  const getToolName = (): string => {
    if (part.type === 'dynamic-tool') {
      return part.toolName || 'Unknown Tool';
    }
    // For typed tool parts like tool-weather, tool-calculator, etc.
    if (part.type.startsWith('tool-')) {
      return part.type.replace('tool-', '');
    }
    return 'Unknown Tool';
  };

  const getStateIcon = (state: ToolCallState) => {
    switch (state) {
      case 'input-streaming':
        return <Loader2 className="size-4 animate-spin text-blue-500" />;
      case 'input-available':
        return <Play className="size-4 text-yellow-500" />;
      case 'output-available':
        return <CheckCircle className="size-4 text-green-500" />;
      case 'output-error':
        return <AlertCircle className="size-4 text-destructive" />;
      default:
        return <Square className="size-4 text-muted-foreground" />;
    }
  };

  const getStateBadge = (state: ToolCallState, isPreliminary?: boolean) => {
    const baseProps = { className: "text-xs font-mono" };

    if (isPreliminary) {
      return <Badge variant="outline" {...baseProps}>Streaming...</Badge>;
    }

    switch (state) {
      case 'input-streaming':
        return <Badge {...baseProps} className="bg-blue-500/10 text-blue-700 border-blue-500/20 text-xs font-mono">
          Preparing
        </Badge>;
      case 'input-available':
        return <Badge {...baseProps} className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20 text-xs font-mono">
          Executing
        </Badge>;
      case 'output-available':
        return <Badge {...baseProps} className="bg-green-500/10 text-green-700 border-green-500/20 text-xs font-mono">
          Completed
        </Badge>;
      case 'output-error':
        return <Badge variant="destructive" {...baseProps}>
          Error
        </Badge>;
      default:
        return <Badge variant="outline" {...baseProps}>Unknown</Badge>;
    }
  };

  const formatJson = (data: unknown): string => {
    if (data === null || data === undefined) return '';
    if (typeof data === 'string') return data;
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  // Type-safe checks for part properties
  const hasInput = 'input' in part && part.input !== undefined && part.input !== null;
  const hasOutput = 'output' in part && part.output !== undefined && part.output !== null;
  const hasError = 'errorText' in part && part.errorText !== undefined && part.errorText !== null;
  const hasContent = hasInput || hasOutput || hasError;
  const toolName = getToolName();
  const hasRawInput = 'rawInput' in part && part.rawInput !== undefined;
  const isPreliminary = 'preliminary' in part ? part.preliminary : false;

  return (
    <Card className={cn("border-l-4 border-l-blue-500/50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Hammer className="size-4" />
            <code className="font-mono">{toolName}</code>
            {getStateIcon(part.state)}
          </CardTitle>

          <div className="flex items-center gap-2">
            {getStateBadge(part.state, isPreliminary)}

            {hasContent && (
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
        </div>

        {/* Tool Call ID */}
        <div className="text-xs text-muted-foreground font-mono">
          ID: {part.toolCallId}
        </div>
      </CardHeader>

      {/* Expandable Content */}
      {isExpanded && hasContent && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Input Parameters */}
            {hasInput && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-medium">Input Parameters</h4>
                  {hasRawInput && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRawInput(!showRawInput)}
                      className="h-6 px-2 text-xs"
                    >
                      <Code className="size-3 mr-1" />
                      {showRawInput ? 'Parsed' : 'Raw'}
                    </Button>
                  )}
                </div>

                <ScrollArea className="max-h-48">
                  <pre className="bg-muted p-3 rounded-md text-xs font-mono overflow-x-auto">
                    <code>
                      {formatJson(
                        showRawInput && hasRawInput
                          ? (part as { rawInput: unknown }).rawInput
                          : part.input
                      )}
                    </code>
                  </pre>
                </ScrollArea>
              </div>
            )}

            {/* Separator */}
            {hasInput && (hasOutput || hasError) && (
              <Separator />
            )}

            {/* Output Result */}
            {hasOutput && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-medium">Output Result</h4>
                  {isPreliminary && (
                    <Badge variant="outline" className="text-xs">
                      <Loader2 className="size-3 mr-1 animate-spin" />
                      Partial
                    </Badge>
                  )}
                </div>

                <ScrollArea className="max-h-48">
                  <pre className="bg-muted p-3 rounded-md text-xs font-mono overflow-x-auto">
                    <code>{formatJson(part.output)}</code>
                  </pre>
                </ScrollArea>
              </div>
            )}

            {/* Error Message */}
            {hasError && (
              <div>
                <h4 className="text-sm font-medium text-destructive mb-2">Error</h4>
                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-md">
                  <p className="text-sm text-destructive font-mono">
                    {part.errorText}
                  </p>
                </div>
              </div>
            )}

            {/* Metadata */}
            {'providerExecuted' in part && part.providerExecuted && (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="size-3" />
                  <span>Executed by provider</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}

      {/* Loading/Status states for non-expanded view */}
      {!isExpanded && (
        <CardContent className="pt-0">
          {part.state === 'input-streaming' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              <span>Preparing tool call...</span>
            </div>
          )}

          {part.state === 'input-available' && !hasOutput && !hasError && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Play className="size-4 text-yellow-500" />
              <span>Executing tool...</span>
            </div>
          )}

          {part.state === 'output-available' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="size-4 text-green-500" />
              <span>Tool executed successfully</span>
            </div>
          )}

          {part.state === 'output-error' && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4" />
              <span>Tool execution failed</span>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}