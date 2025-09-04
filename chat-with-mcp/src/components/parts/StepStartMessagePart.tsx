'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StepStartMessagePartProps } from '@/types/message';

export function StepStartMessagePart({ 
  part, 
  className, 
  messageId, 
  partIndex 
}: StepStartMessagePartProps) {
  return (
    <div className={cn("flex items-center gap-4 my-4", className)}>
      <Separator className="flex-1" />
      
      <Card className="border-dashed">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="size-4" />
            <span>New step</span>
            <ArrowRight className="size-3" />
          </div>
        </CardContent>
      </Card>
      
      <Separator className="flex-1" />
    </div>
  );
}