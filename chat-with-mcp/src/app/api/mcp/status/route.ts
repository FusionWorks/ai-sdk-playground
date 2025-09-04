import { NextResponse } from 'next/server';
import { mcpClient } from '@/lib/mcp-client';

export async function GET() {
  try {
    const isEnabled = mcpClient.isEnabled();
    
    if (!isEnabled) {
      return NextResponse.json({
        enabled: false,
        servers: [],
        tools: [],
        message: 'MCP is disabled. Set MCP_ENABLED=true to enable.'
      });
    }

    // Initialize if not already done
    await mcpClient.initialize();

    const servers = mcpClient.getServers();
    const tools = mcpClient.getAvailableTools();
    const connectedCount = mcpClient.getConnectedClientsCount();
    const config = mcpClient.getServerConfig();

    return NextResponse.json({
      enabled: isEnabled,
      servers,
      tools,
      connectedCount,
      totalConfigured: config?.servers?.length || 0,
      message: `${connectedCount} of ${config?.servers?.length || 0} configured servers connected`
    });
  } catch (error) {
    console.error('MCP status API error:', error);
    return NextResponse.json(
      { 
        enabled: mcpClient.isEnabled(),
        servers: [],
        tools: [],
        connectedCount: 0,
        error: 'Failed to fetch MCP status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}