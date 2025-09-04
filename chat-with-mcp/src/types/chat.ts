export type AIProvider = 'anthropic' | 'openai';

export interface MCPServer {
  id: string;
  name: string;
  description?: string;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  tools?: MCPTool[];
}

export interface MCPTool {
  name: string;
  description: string;
}


