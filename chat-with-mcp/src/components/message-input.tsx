'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function MessageInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading
}: MessageInputProps) {
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={input}
        onChange={handleInputChange}
        placeholder="Type your message..."
        disabled={isLoading}
        className="flex-1"
        autoComplete="off"
        maxLength={4000}
      />
      <Button 
        type="submit" 
        disabled={!input.trim() || isLoading}
        size="icon"
        className={cn(
          "shrink-0",
          isLoading && "cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        <span className="sr-only">
          {isLoading ? 'Sending...' : 'Send message'}
        </span>
      </Button>
    </form>
  );
}