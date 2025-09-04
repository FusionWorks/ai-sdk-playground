import { experimental_createMCPClient as createMCPClient, experimental_MCPClient as MCPClient, Tool } from 'ai';
import { Experimental_StdioMCPTransport as StdioMCPTransport } from 'ai/mcp-stdio';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { MCPServer, MCPTool } from '@/types/chat';

interface MCPServerConfig {
  name: string;
  description?: string;
  transport: {
    type: 'stdio' | 'sse';
    command?: string;
    args?: string[];
    url?: string;
    headers?: Record<string, string>;
  };
  env?: Record<string, string>;
  enabled?: boolean;
  workingDirectory?: string;
  note?: string;
}

interface MCPConfig {
  servers: MCPServerConfig[];
}

export class RealMCPClient {
  private clients: Map<string, MCPClient> = new Map();
  private servers: Map<string, MCPServer> = new Map();
  private config: MCPConfig | null = null;
  private initialized = false;

  constructor() {
    this.loadConfig();
  }

  private loadConfig(): void {
    if (!this.isEnabled()) {
      console.log('MCP is disabled');
      return;
    }

    try {
      const configPath = join(process.cwd(), 'mcp-config.json');
      const configFile = readFileSync(configPath, 'utf8');
      this.config = JSON.parse(configFile);
      console.log('MCP config loaded successfully');
    } catch (error) {
      console.log('No MCP config file found, using empty configuration');
      this.config = { servers: [] };
    }
  }

  async initialize(): Promise<void> {
    if (this.initialized || !this.config) {
      return;
    }

    console.log('Initializing MCP clients...');

    for (const serverConfig of this.config.servers) {
      if (!serverConfig.enabled) {
        console.log(`Skipping disabled server: ${serverConfig.name}`);
        continue;
      }

      try {
        await this.initializeServer(serverConfig);
      } catch (error) {
        console.error(`Failed to initialize MCP server ${serverConfig.name}:`, error);

        // Add failed server to the list
        const serverId = this.generateServerId(serverConfig.name);
        this.servers.set(serverId, {
          id: serverId,
          name: serverConfig.name,
          description: serverConfig.description,
          url: this.getServerUrl(serverConfig),
          status: 'error',
          tools: []
        });
      }
    }

    this.initialized = true;
    console.log(`MCP initialization complete. ${this.clients.size} servers connected.`);
  }

  private async initializeServer(config: MCPServerConfig): Promise<void> {
    const serverId = this.generateServerId(config.name);

    try {
      let client: MCPClient;

      if (config.transport.type === 'stdio') {
        if (!config.transport.command || !config.transport.args) {
          throw new Error('stdio transport requires command and args');
        }

        // Set up environment variables for the server process
        const env: Record<string, string> = {};
        for (const [key, value] of Object.entries(process.env)) {
          if (typeof value === 'string') {
            env[key] = value;
          }
        }
        if (config.env) {
          Object.assign(env, config.env);
        }

        const transport = new StdioMCPTransport({
          command: config.transport.command,
          args: config.transport.args,
          env,
          cwd: config.workingDirectory
        });

        client = await createMCPClient({
          transport
        });
      } else if (config.transport.type === 'sse') {
        if (!config.transport.url) {
          throw new Error('SSE transport requires URL');
        }

        client = await createMCPClient({
          transport: {
            type: 'sse',
            url: config.transport.url,
            headers: config.transport.headers || {}
          }
        });
      } else {
        throw new Error(`Unsupported transport type: ${config.transport.type}`);
      }

      // Store the client
      this.clients.set(serverId, client);

      // Get tools from the server
      const tools = await this.getServerTools(client);

      // Create server record
      const server: MCPServer = {
        id: serverId,
        name: config.name,
        description: config.description,
        url: this.getServerUrl(config),
        status: 'connected',
        tools: tools.map(tool => ({
          name: tool.name,
          description: tool.description || '',
          parameters: tool.inputSchema || {}
        }))
      };

      this.servers.set(serverId, server);
      console.log(`MCP server ${config.name} connected with ${tools.length} tools`);

    } catch (error) {
      console.error(`Failed to connect to MCP server ${config.name}:`, error);
      throw error;
    }
  }

  private async getServerTools(client: MCPClient) {
    try {
      // Use schema discovery approach
      const tools = await client.tools();
      return Object.entries(tools).map(([name, tool]) => ({
        name,
        description: tool.description,
        inputSchema: tool.inputSchema
      }));
    } catch (error) {
      console.warn('Failed to get tools from server:', error);
      return [];
    }
  }

  private generateServerId(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }

  private getServerUrl(config: MCPServerConfig): string {
    if (config.transport.type === 'sse') {
      return config.transport.url || 'unknown';
    } else {
      return `stdio://${config.transport.command} ${(config.transport.args || []).join(' ')}`;
    }
  }

  async getTools() {
    if (!this.initialized) {
      await this.initialize();
    }

    const allTools: Record<string, Tool> = {};

    for (const [serverId, client] of this.clients) {
      try {
        const serverTools = await client.tools();

        // Prefix tool names with server ID to avoid conflicts
        for (const [toolName, tool] of Object.entries(serverTools)) {
          const prefixedName = `${serverId}_${toolName}`;
          allTools[prefixedName] = tool;
        }
      } catch (error) {
        console.error(`Failed to get tools from server ${serverId}:`, error);
      }
    }

    return allTools;
  }

  getServers(): MCPServer[] {
    return Array.from(this.servers.values());
  }

  getAvailableTools(): MCPTool[] {
    const tools: MCPTool[] = [];

    for (const server of this.servers.values()) {
      if (server.status === 'connected' && server.tools) {
        tools.push(...server.tools);
      }
    }

    return tools;
  }

  async close(): Promise<void> {
    console.log('Closing MCP clients...');

    for (const [serverId, client] of this.clients) {
      try {
        await client.close();
        console.log(`Closed MCP client: ${serverId}`);
      } catch (error) {
        console.error(`Error closing MCP client ${serverId}:`, error);
      }
    }

    this.clients.clear();
    this.initialized = false;
  }

  isEnabled(): boolean {
    return process.env.MCP_ENABLED === 'true';
  }

  getConnectedClientsCount(): number {
    return this.clients.size;
  }

  getServerConfig(): MCPConfig | null {
    return this.config;
  }
}

// Create global MCP client instance
export const mcpClient = new RealMCPClient();