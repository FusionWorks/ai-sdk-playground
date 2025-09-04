import { UIMessage, UIMessagePart, TextUIPart, ToolUIPart, DynamicToolUIPart, FileUIPart, ReasoningUIPart, SourceUrlUIPart, SourceDocumentUIPart, DataUIPart, StepStartUIPart } from 'ai';
import type { AIProvider } from './chat';

// Extended message interface for local use
export interface ExtendedMessage extends UIMessage {
  timestamp?: Date;
  provider?: AIProvider;
}

// Props for message part components
export interface MessagePartProps {
  messageId: string;
  partIndex: number;
  className?: string;
}

export interface TextMessagePartProps extends MessagePartProps {
  part: TextUIPart;
}

export interface ReasoningMessagePartProps extends MessagePartProps {
  part: ReasoningUIPart;
}

export interface ToolCallMessagePartProps extends MessagePartProps {
  part: ToolUIPart | DynamicToolUIPart;
}

export interface FileMessagePartProps extends MessagePartProps {
  part: FileUIPart;
}

export interface SourceMessagePartProps extends MessagePartProps {
  part: SourceUrlUIPart | SourceDocumentUIPart;
}

export interface DataMessagePartProps extends MessagePartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  part: DataUIPart<any>;
}

export interface StepStartMessagePartProps extends MessagePartProps {
  part: StepStartUIPart;
}

// Props for the main message renderer
export interface MessageRendererProps {
  message: UIMessage;
  isLast?: boolean;
  isLoading?: boolean;
  className?: string;
}

// Props for the part renderer
export interface MessagePartRendererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  part: UIMessagePart<any, any>;
  messageId: string;
  partIndex: number;
}

// Message header props
export interface MessageHeaderProps {
  message: UIMessage;
  provider?: AIProvider;
  timestamp?: Date;
}

// Tool call state types
export type ToolCallState = 'input-streaming' | 'input-available' | 'output-available' | 'output-error';

// Utility type for extracting tool name from tool parts
export type ExtractToolName<T> = T extends { type: `tool-${infer Name}` } ? Name :
  T extends { toolName: infer Name } ? Name : string;