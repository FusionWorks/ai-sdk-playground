'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ExternalLink, 
  Globe, 
  FileText,
  Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SourceMessagePartProps } from '@/types/message';

export function SourceMessagePart({ 
  part, 
  className, 
  messageId, 
  partIndex 
}: SourceMessagePartProps) {
  const isUrlSource = part.type === 'source-url';
  const isDocumentSource = part.type === 'source-document';

  const handleOpenSource = () => {
    if (isUrlSource) {
      window.open(part.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getSourceIcon = () => {
    if (isUrlSource) {
      return <Globe className="size-4" />;
    } else if (isDocumentSource) {
      return <FileText className="size-4" />;
    }
    return <LinkIcon className="size-4" />;
  };

  const getSourceTitle = () => {
    if (isUrlSource) {
      return part.title || new URL(part.url).hostname;
    } else if (isDocumentSource) {
      return part.title || part.filename || 'Document Source';
    }
    return 'Source';
  };

  const getSourceDescription = () => {
    if (isUrlSource) {
      try {
        const url = new URL(part.url);
        return `${url.protocol}//${url.hostname}${url.pathname}`;
      } catch {
        return part.url;
      }
    } else if (isDocumentSource) {
      return `${part.mediaType} • ${part.filename || 'Document'}`;
    }
    return 'External source';
  };

  return (
    <Card className={cn("border-l-4 border-l-cyan-500/50 bg-cyan-500/5", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Source Icon */}
          <div className="flex-shrink-0 mt-1">
            {getSourceIcon()}
          </div>

          {/* Source Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">
                {getSourceTitle()}
              </h4>
              <Badge variant="outline" className="text-xs">
                {isUrlSource ? 'Web' : 'Document'}
              </Badge>
            </div>

            <div className="text-xs text-muted-foreground mb-3">
              {getSourceDescription()}
            </div>

            {/* Source ID */}
            <div className="text-xs text-muted-foreground font-mono mb-3">
              Source ID: {part.sourceId}
            </div>

            {/* Actions */}
            {isUrlSource && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenSource}
                className="flex items-center gap-1"
              >
                <ExternalLink className="size-3" />
                Visit Source
              </Button>
            )}

            {isDocumentSource && (
              <div className="text-xs text-muted-foreground">
                Referenced document used as context
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}