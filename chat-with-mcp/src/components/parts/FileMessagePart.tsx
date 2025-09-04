'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  File, 
  Download, 
  Eye, 
  Image as ImageIcon, 
  FileText, 
  Music, 
  Video,
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FileMessagePartProps } from '@/types/message';

export function FileMessagePart({ 
  part, 
  className, 
  messageId, 
  partIndex 
}: FileMessagePartProps) {
  const getFileIcon = (mediaType: string) => {
    if (mediaType.startsWith('image/')) {
      return <ImageIcon className="size-4" />;
    } else if (mediaType.startsWith('video/')) {
      return <Video className="size-4" />;
    } else if (mediaType.startsWith('audio/')) {
      return <Music className="size-4" />;
    } else if (mediaType.includes('text/') || mediaType.includes('json')) {
      return <FileText className="size-4" />;
    } else if (mediaType.includes('zip') || mediaType.includes('tar') || mediaType.includes('gzip')) {
      return <Archive className="size-4" />;
    } else {
      return <File className="size-4" />;
    }
  };

  const getFileTypeLabel = (mediaType: string) => {
    const type = mediaType.split('/')[0];
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatFileSize = (url: string) => {
    // For data URLs, we can estimate size from the base64 length
    if (url.startsWith('data:')) {
      const base64Data = url.split(',')[1];
      if (base64Data) {
        const sizeInBytes = (base64Data.length * 3) / 4;
        if (sizeInBytes < 1024) {
          return `${Math.round(sizeInBytes)} B`;
        } else if (sizeInBytes < 1024 * 1024) {
          return `${Math.round(sizeInBytes / 1024)} KB`;
        } else {
          return `${Math.round(sizeInBytes / (1024 * 1024))} MB`;
        }
      }
    }
    return null;
  };

  const handleView = () => {
    if (part.mediaType.startsWith('image/') || part.mediaType.startsWith('text/')) {
      window.open(part.url, '_blank');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = part.url;
    link.download = part.filename || 'download';
    link.click();
  };

  const fileSize = formatFileSize(part.url);
  const isImage = part.mediaType.startsWith('image/');
  const isViewable = isImage || part.mediaType.startsWith('text/');

  return (
    <Card className={cn("relative", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* File Icon */}
          <div className="flex-shrink-0">
            {getFileIcon(part.mediaType)}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium truncate">
                {part.filename || 'Untitled File'}
              </h4>
              <Badge variant="outline" className="text-xs">
                {getFileTypeLabel(part.mediaType)}
              </Badge>
              {fileSize && (
                <Badge variant="outline" className="text-xs">
                  {fileSize}
                </Badge>
              )}
            </div>

            <div className="text-xs text-muted-foreground font-mono mb-3">
              {part.mediaType}
            </div>

            {/* Image Preview */}
            {isImage && (
              <div className="mb-3">
                <img
                  src={part.url}
                  alt={part.filename || 'File'}
                  className="max-w-full max-h-48 rounded-md border"
                  loading="lazy"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {isViewable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleView}
                  className="flex items-center gap-1"
                >
                  <Eye className="size-3" />
                  View
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-1"
              >
                <Download className="size-3" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}