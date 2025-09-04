'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw, Server, Hammer, AlertCircle, CheckCircle, XCircle, Settings, Terminal, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MCPServer, MCPTool } from '@/types/chat';

interface MCPStatusResponse {
  enabled: boolean;
  servers: MCPServer[];
  tools: MCPTool[];
  connectedCount: number;
  totalConfigured: number;
  message?: string;
  error?: string;
  details?: string;
}

export function MCPStatus() {
  const [status, setStatus] = useState<MCPStatusResponse>({
    enabled: false,
    servers: [],
    tools: [],
    connectedCount: 0,
    totalConfigured: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/mcp/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        setLastUpdated(new Date());
      } else {
        console.error('Failed to fetch MCP status:', response.statusText);
        setStatus(prev => ({
          ...prev,
          error: 'Failed to fetch status',
          details: `HTTP ${response.status}: ${response.statusText}`
        }));
      }
    } catch (error) {
      console.error('Failed to refresh MCP status:', error);
      setStatus(prev => ({
        ...prev,
        error: 'Network error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const getStatusIcon = (serverStatus: MCPServer['status']) => {
    switch (serverStatus) {
      case 'connected':
        return <CheckCircle className="size-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="size-4 text-muted-foreground" />;
      case 'error':
        return <AlertCircle className="size-4 text-destructive" />;
      default:
        return <AlertCircle className="size-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (serverStatus: MCPServer['status']) => {
    switch (serverStatus) {
      case 'connected':
        return <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="outline">Disconnected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTransportIcon = (url: string) => {
    if (url.startsWith('http')) {
      return <Globe className="size-3" />;
    } else if (url.startsWith('stdio://')) {
      return <Terminal className="size-3" />;
    }
    return <Settings className="size-3" />;
  };

  const formatUrl = (url: string) => {
    if (url.startsWith('stdio://')) {
      return url.replace('stdio://', '').substring(0, 50) + (url.length > 60 ? '...' : '');
    }
    return url;
  };

  if (!status.enabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Server className="size-4" />
            MCP Disabled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Model Context Protocol is not enabled. Set MCP_ENABLED=true in your environment configuration to access additional tools and capabilities.
            </p>
            <div className="text-xs text-muted-foreground">
              <p>To enable MCP:</p>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Set MCP_ENABLED=true in your .env.local file</li>
                <li>Configure servers in mcp-config.json</li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="size-4" />
            <span className="font-medium">MCP Status</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshStatus}
            disabled={isRefreshing}
            className="size-8"
          >
            <RefreshCw className={`size-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-xs">
            {status.connectedCount} / {status.totalConfigured} connected
          </Badge>
          {lastUpdated && (
            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
        </div>

        {status.message && (
          <p className="text-xs text-muted-foreground">{status.message}</p>
        )}
      </div>

      {/* Error Display */}
      {status.error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                <AlertCircle className="size-4" />
                {status.error}
              </div>
              {status.details && (
                <p className="text-xs text-muted-foreground">{status.details}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Servers List */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Servers</span>
          <Badge variant="outline" className="text-xs">
            {status.servers.length}
          </Badge>
        </div>

        {status.servers.length === 0 ? (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                No MCP servers configured. Add servers to mcp-config.json to enable MCP capabilities.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {status.servers.map((server) => (
              <Card key={server.id}>
                <CardContent className="p-3">
                  <div className="space-y-3">
                    {/* Server Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(server.status)}
                        <div>
                          <div className="font-medium text-sm">{server.name}</div>
                          {server.description && (
                            <div className="text-xs text-muted-foreground">
                              {server.description}
                            </div>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(server.status)}
                    </div>

                    {/* Transport Info */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {getTransportIcon(server.url)}
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                        {formatUrl(server.url)}
                      </code>
                    </div>

                    {/* Tools Count */}
                    {server.tools && server.tools.length > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <Hammer className="size-3" />
                        <span>{server.tools.length} tools available</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Available Tools */}
      {status.tools.length > 0 && (
        <>
          <Separator />
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Hammer className="size-4" />
              <span className="font-medium text-sm">Available Tools</span>
              <Badge variant="outline" className="text-xs">
                {status.tools.length}
              </Badge>
            </div>

            <ScrollArea className="max-h-64">
              <div className="space-y-2">
                {status.tools.map((tool, index) => (
                  <Card key={`${tool.name}-${index}`}>
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="font-medium text-sm font-mono">
                          {tool.name}
                        </div>
                        {tool.description && (
                          <div className="text-xs text-muted-foreground">
                            {tool.description}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </>
      )}

      {/* Configuration Help */}
      {status.servers.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-3">
            <div className="text-center space-y-2">
              <Settings className="size-8 mx-auto text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Configure MCP Servers</p>
                <p className="text-xs text-muted-foreground">
                  Copy mcp-config.example.json to mcp-config.json and enable desired servers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}