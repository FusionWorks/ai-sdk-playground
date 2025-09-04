'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bot, Zap } from 'lucide-react';
import type { AIProvider } from '@/types/chat';
import { PROVIDERS } from '@/lib/ai-providers';

interface ProviderSelectorProps {
  selectedProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
  disabled?: boolean;
}

export function ProviderSelector({
  selectedProvider,
  onProviderChange,
  disabled = false
}: ProviderSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="font-mono text-xs">
        {PROVIDERS[selectedProvider].model}
      </Badge>
      
      <Select
        value={selectedProvider}
        onValueChange={(value) => onProviderChange(value as AIProvider)}
        disabled={disabled}
      >
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="anthropic">
            <div className="flex items-center gap-2">
              <Bot className="size-4 text-orange-500" />
              <div>
                <div className="font-medium">{PROVIDERS.anthropic.name}</div>
                <div className="text-xs text-muted-foreground">
                  {PROVIDERS.anthropic.description}
                </div>
              </div>
            </div>
          </SelectItem>
          <SelectItem value="openai">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-green-500" />
              <div>
                <div className="font-medium">{PROVIDERS.openai.name}</div>
                <div className="text-xs text-muted-foreground">
                  {PROVIDERS.openai.description}
                </div>
              </div>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}