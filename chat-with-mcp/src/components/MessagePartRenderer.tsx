'use client';

import { TextMessagePart } from './parts/TextMessagePart';
import { ReasoningMessagePart } from './parts/ReasoningMessagePart';
import { ToolCallMessagePart } from './parts/ToolCallMessagePart';
import { FileMessagePart } from './parts/FileMessagePart';
import { SourceMessagePart } from './parts/SourceMessagePart';
import { DataMessagePart } from './parts/DataMessagePart';
import type { MessagePartRendererProps } from '@/types/message';

export function MessagePartRenderer({
  part,
  messageId,
  partIndex
}: MessagePartRendererProps) {
  const partKey = `${messageId}-${partIndex}`;

  switch (part.type) {
    case 'text':
      return (
        <TextMessagePart
          key={partKey}
          part={part}
          messageId={messageId}
          partIndex={partIndex}
        />
      );

    case 'reasoning':
      return (
        <ReasoningMessagePart
          key={partKey}
          part={part}
          messageId={messageId}
          partIndex={partIndex}
        />
      );

    case 'file':
      return (
        <FileMessagePart
          key={partKey}
          part={part}
          messageId={messageId}
          partIndex={partIndex}
        />
      );

    case 'source-url':
    case 'source-document':
      return (
        <SourceMessagePart
          key={partKey}
          part={part}
          messageId={messageId}
          partIndex={partIndex}
        />
      );

    case 'step-start':
      // Don't render step-start parts for now
      return null;

    default:
      // Handle tool parts (tool-*, dynamic-tool)
      if (part.type.startsWith('tool-') || part.type === 'dynamic-tool') {
        return (
          <ToolCallMessagePart
            key={partKey}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            part={part as any}
            messageId={messageId}
            partIndex={partIndex}
          />
        );
      }

      // Handle data parts (data-*)
      if (part.type.startsWith('data-')) {
        return (
          <DataMessagePart
            key={partKey}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            part={part as any}
            messageId={messageId}
            partIndex={partIndex}
          />
        );
      }

      // Unknown part type - render as text if possible
      if ('text' in part && typeof part.text === 'string') {
        return (
          <TextMessagePart
            key={partKey}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            part={{ type: 'text', text: part.text } as any}
            messageId={messageId}
            partIndex={partIndex}
          />
        );
      }

      // Fallback for completely unknown parts
      console.warn('Unknown message part type:', part.type);
      return (
        <div key={partKey} className="text-xs text-muted-foreground p-2 border border-dashed rounded">
          Unknown part type: {part.type}
        </div>
      );
  }
}