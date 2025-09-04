# AI Chat App with Vercel AI SDK v5 and MCP Integration

A modern, full-stack chat application built with Next.js 15, featuring support for multiple AI providers (Anthropic Claude and OpenAI GPT) and real Model Context Protocol (MCP) server integration for extended functionality.

![AI Chat Interface](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI-5.0-000000)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)
![MCP](https://img.shields.io/badge/MCP-Enabled-purple)

## ✨ Features

- 🤖 **Multi-Provider Support**: Switch between Anthropic Claude and OpenAI GPT models seamlessly
- 🔄 **Real-time Streaming**: Live streaming responses with advanced message part rendering
- 🛠️ **MCP Integration**: Real Model Context Protocol server support with stdio and SSE transports
- 🎯 **Advanced Message Rendering**: Support for text, reasoning, tool calls, files, sources, and data parts
- 📁 **File Operations**: Read, write, and manage files through MCP filesystem tools
- 🔍 **Web Search**: Search the web using Brave Search MCP integration
- 💾 **Persistent Memory**: Store and retrieve information across conversations
- 🎨 **Modern UI**: Beautiful interface built with shadcn/ui and Tailwind CSS v4
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Server Components**: Optimized with Next.js 15 App Router
- 🔒 **Type Safe**: Full TypeScript support with strict typing
- ♿ **Accessible**: Built with accessibility in mind using Radix UI primitives
- 🔧 **Tool Execution Visualization**: Real-time tool call progress and results display
- 💡 **Reasoning Display**: See AI thinking process with collapsible reasoning sections

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- API keys for Anthropic and/or OpenAI

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your API keys:
   ```env
   # Required: At least one AI provider API key
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   
   # MCP Configuration
   MCP_ENABLED=true
   
   # Optional: API keys for MCP servers
   BRAVE_API_KEY=your_brave_api_key_here
   ```

4. **Configure MCP servers (optional)**
   ```bash
   cp mcp-config.example.json mcp-config.json
   ```
   
   The default configuration includes:
   - **Filesystem**: File operations (enabled by default)
   - **Memory**: Persistent conversation memory (enabled by default)
   - **Brave Search**: Web search (disabled, requires API key)

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Message Types & Rendering

The chat interface supports rich message rendering with multiple part types:

### Text Messages
Standard conversational text with markdown support and streaming indicators.

### Tool Call Messages
Interactive tool execution cards showing:
- **Tool Name**: Clear identification of the tool being used
- **Execution State**: Visual indicators for preparing, executing, completed, or error states
- **Input Parameters**: Expandable view of tool inputs with raw/parsed toggle
- **Output Results**: Formatted tool results with syntax highlighting
- **Progress Tracking**: Real-time updates during tool execution

### Reasoning Messages  
Collapsible sections showing AI thinking process:
- **Stream Visualization**: Live updates as reasoning develops
- **Expandable Content**: Click to view full reasoning process
- **Syntax Highlighting**: Formatted reasoning with code highlighting

### File Messages
Rich file handling with:
- **File Type Detection**: Automatic icon and type classification
- **Image Preview**: Inline image display for supported formats
- **Download Support**: Direct download functionality
- **Size Information**: File size display for data URLs

### Source Messages
Reference tracking for:
- **Web Sources**: URLs with titles and domains
- **Document Sources**: File references with metadata
- **External Links**: Direct navigation to source materials

### Data Messages
Structured data visualization:
- **Type Classification**: Data type identification and badges
- **JSON Formatting**: Syntax-highlighted JSON display
- **Expandable Views**: Collapsible data sections
- **Raw Data Access**: View original data structure

## 🔧 MCP Server Configuration

### Default Servers

The app comes with preconfigured MCP servers that work out of the box:

| Server | Description | Status | Requirements |
|--------|-------------|--------|--------------|
| **Filesystem** | Read, write, list files and directories | ✅ Enabled | None |
| **Memory** | Store and retrieve information across chats | ✅ Enabled | None |
| **Brave Search** | Web search capabilities | ❌ Disabled | BRAVE_API_KEY |

### Configuration File Structure

The `mcp-config.json` file defines your MCP servers:

```json
{
  "servers": [
    {
      "name": "Filesystem",
      "description": "File system operations",
      "transport": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users"]
      },
      "enabled": true
    },
    {
      "name": "Brave Search",
      "description": "Web search capabilities",
      "transport": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-brave-search"]
      },
      "env": {
        "BRAVE_API_KEY": ""
      },
      "enabled": false,
      "note": "Requires BRAVE_API_KEY environment variable"
    }
  ]
}
```

### Available MCP Servers

Popular MCP servers you can add to your configuration:

#### File System Operations
```json
{
  "name": "Filesystem",
  "transport": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/directory"]
  },
  "enabled": true
}
```

#### Web Search (Brave)
```json
{
  "name": "Brave Search",
  "transport": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-brave-search"]
  },
  "env": {
    "BRAVE_API_KEY": "your-api-key"
  },
  "enabled": true
}
```

#### Database Operations
```json
{
  "name": "PostgreSQL",
  "transport": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres"]
  },
  "env": {
    "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost:5432/db"
  },
  "enabled": false
}
```

#### Git Operations
```json
{
  "name": "Git",
  "transport": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-git", "/path/to/repository"]
  },
  "workingDirectory": "/path/to/repository",
  "enabled": false
}
```

### Transport Types

#### stdio Transport
For local command-line MCP servers:
```json
{
  "transport": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-name"],
    "env": {
      "API_KEY": "value"
    }
  }
}
```

#### SSE Transport
For HTTP-based MCP servers:
```json
{
  "transport": {
    "type": "sse",
    "url": "http://localhost:3001/mcp",
    "headers": {
      "Authorization": "Bearer token"
    }
  }
}
```

## 🔑 Getting API Keys

### Anthropic Claude
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Generate a new API key
5. Add it to your `.env.local` as `ANTHROPIC_API_KEY`

### OpenAI GPT
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Go to API Keys section
4. Create a new secret key
5. Add it to your `.env.local` as `OPENAI_API_KEY`

### Brave Search (Optional)
1. Visit [Brave Search API](https://api.search.brave.com/app/keys)
2. Sign up for a free account
3. Generate an API key
4. Add it to your `.env.local` as `BRAVE_API_KEY`
5. Enable Brave Search in `mcp-config.json`

## 🛠️ MCP Tools in Action

Once configured, your AI assistant can:

### File Operations
- "Read the contents of package.json"
- "Create a new file called notes.txt with my meeting notes"
- "List all files in the current directory"
- "Write a Python script to calculate fibonacci numbers"

### Web Search
- "Search for the latest news about AI developments"
- "Find information about Next.js 15 new features"
- "Look up the current weather in Tokyo"

### Memory
- "Remember that I prefer TypeScript over JavaScript"
- "What did we discuss about the project timeline yesterday?"
- "Store this meeting summary for future reference"

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **AI SDK**: Vercel AI SDK v5 with streaming support
- **AI Providers**: Anthropic Claude, OpenAI GPT
- **MCP Integration**: @modelcontextprotocol/sdk with stdio transport
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS 4.0 with CSS variables
- **Icons**: Lucide React

### Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── chat/          # Chat API with streaming & MCP integration
│   │   └── mcp/status/    # MCP server status endpoint
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── parts/             # Message part renderers
│   │   ├── TextMessagePart.tsx
│   │   ├── ToolCallMessagePart.tsx
│   │   ├── ReasoningMessagePart.tsx
│   │   ├── FileMessagePart.tsx
│   │   ├── SourceMessagePart.tsx
│   │   └── DataMessagePart.tsx
│   ├── chat-interface.tsx # Main chat interface with sidebar
│   ├── MessageRenderer.tsx # Message rendering orchestrator
│   ├── MessagePartRenderer.tsx # Part rendering dispatcher
│   ├── MessageHeader.tsx  # Message metadata header
│   ├── message-input.tsx  # Message input form
│   ├── provider-selector.tsx # AI provider selector
│   └── mcp-status.tsx     # MCP server status display
├── lib/
│   ├── ai-providers.ts    # AI provider configurations
│   ├── mcp-client.ts      # Real MCP client implementation
│   └── utils.ts           # Utility functions
└── types/
    ├── chat.ts            # Chat and MCP type definitions
    └── message.ts         # Message part type definitions

# Configuration Files
mcp-config.json            # MCP server configuration (gitignored)
mcp-config.example.json    # Example MCP configuration
```

### Message Rendering System

The application uses a sophisticated message rendering system:

1. **MessageRenderer**: Main component that handles message layout and metadata
2. **MessagePartRenderer**: Dispatcher that routes different part types to appropriate renderers
3. **Part Components**: Specialized renderers for each message part type
4. **Type Safety**: Full TypeScript coverage for all message part types

## 🧪 Development

### Scripts
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Type check
npm run type-check
```

### MCP Development

#### Adding New MCP Servers
1. Find or create an MCP server package
2. Add configuration to `mcp-config.json`
3. Enable the server and restart the app
4. The tools will automatically be available to the AI

#### Custom MCP Servers
You can create custom MCP servers following the [MCP specification](https://modelcontextprotocol.io/):

```typescript
// example-server.ts
import { Server } from '@modelcontextprotocol/sdk/server';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';

const server = new Server(
  { name: 'my-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// Add your tools here
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'my-tool',
      description: 'Does something useful',
      inputSchema: {
        type: 'object',
        properties: {
          input: { type: 'string' }
        }
      }
    }
  ]
}));
```

### Component Development

#### Adding New Message Parts
To add support for new message part types:

1. **Define Types**: Add type definitions to `src/types/message.ts`
2. **Create Component**: Add new part component to `src/components/parts/`
3. **Update Dispatcher**: Add case to `MessagePartRenderer.tsx`
4. **Style**: Use consistent styling patterns with existing parts

Example new part component:
```typescript
// src/components/parts/CustomMessagePart.tsx
export function CustomMessagePart({ part, messageId, partIndex }: CustomMessagePartProps) {
  return (
    <Card className="border-l-4 border-l-custom-500/50">
      <CardContent className="p-4">
        {/* Your custom rendering logic */}
      </CardContent>
    </Card>
  );
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

**Note**: MCP servers using stdio transport may have limitations in serverless environments. Consider using SSE transport for production deployments.

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway  
- AWS Amplify
- Google Cloud Run
- Self-hosted Docker

## 🔒 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Optional* | Anthropic Claude API key |
| `OPENAI_API_KEY` | Optional* | OpenAI GPT API key |
| `MCP_ENABLED` | No | Enable MCP server integration (default: true) |
| `BRAVE_API_KEY` | No | Brave Search API key for web search |
| `POSTGRES_CONNECTION_STRING` | No | PostgreSQL connection for database MCP server |

*At least one AI provider API key is required.

## 🆘 Troubleshooting

### Common Issues

#### MCP Servers Not Connecting
1. **Check server configuration**: Ensure `mcp-config.json` is properly formatted
2. **Verify commands**: Make sure MCP server packages are available (`npx` commands work)
3. **Environment variables**: Check that required API keys are set
4. **Permissions**: Ensure file system access for filesystem server
5. **Logs**: Check browser console and server logs for error messages

#### Message Rendering Issues
1. **Check console**: Look for TypeScript errors or rendering warnings
2. **Part types**: Verify message part types match expected interfaces
3. **Styling**: Ensure Tailwind classes are properly applied
4. **State management**: Check React component state and props

#### API Key Errors
- Ensure API keys are correctly set in `.env.local`
- Check API key validity and quotas
- Restart development server after changing environment variables

#### Build Errors
- Run `npm run type-check` to identify TypeScript issues
- Clear Next.js cache: `rm -rf .next`
- Update dependencies: `npm update`

#### Tool Execution Visualization
- Verify tool call states are being properly tracked
- Check that tool results are formatted correctly
- Ensure streaming updates are handled properly

### Getting Help
- Check the [Issues](https://github.com/your-repo/issues) page
- Review [Vercel AI SDK Documentation](https://sdk.vercel.ai)
- Visit [MCP Documentation](https://modelcontextprotocol.io/)
- Join the [Next.js Discord](https://nextjs.org/discord)

## 📖 Examples

### File Operations with Visual Feedback
```
User: "Create a new file called 'todo.txt' with my tasks for today"

AI: I'll create a todo.txt file for you with your tasks.

[Tool execution card shows:]
🔧 filesystem_write_file
📊 Executing...
📝 Input: { "path": "todo.txt", "content": "..." }
✅ Completed
📤 Output: { "success": true, "message": "File created successfully" }
```

### Web Search with Reasoning
```
User: "What's the weather like in Tokyo today?"

AI: Let me search for current weather information in Tokyo.

[Reasoning card shows:]
🧠 Reasoning
I need to search for current weather information for Tokyo. I'll use the Brave Search tool to find the most recent weather data.

[Tool execution shows live progress of web search...]

AI: Based on my search, here's the current weather in Tokyo...
```

### Memory Integration
```
User: "Remember that I'm planning a trip to Tokyo next month"

AI: I'll store this information for future reference.

[Memory tool shows:]
🔧 memory_store
💾 Storing...
📝 Input: { "key": "travel_plans", "value": "Trip to Tokyo next month" }
✅ Stored successfully
```

## 🎯 Features Showcase

### Advanced Tool Visualization
- **Real-time Progress**: Watch tools execute with live state updates
- **Input/Output Display**: See exactly what data is sent and received
- **Error Handling**: Clear error messages with debugging information
- **Expandable Details**: Click to see full tool execution details

### Rich Message Types
- **Streaming Text**: Real-time text updates with typing indicators
- **Reasoning Process**: Collapsible AI thinking process visualization
- **File Attachments**: Support for various file types with previews
- **Source Citations**: Track and display source materials and references
- **Structured Data**: Format and display complex data structures

### Responsive Design
- **Mobile Optimized**: Touch-friendly interface for mobile devices
- **Adaptive Layout**: Collapsible sidebar and responsive message layout
- **Accessibility**: Full keyboard navigation and screen reader support
- **Theme Support**: Light and dark mode with system preference detection

## 🙏 Acknowledgments

- [Vercel AI SDK](https://sdk.vercel.ai) for the comprehensive AI integration
- [Model Context Protocol](https://modelcontextprotocol.io/) for the extensible tool system
- [shadcn/ui](https://ui.shadcn.com) for the beautiful and accessible UI components
- [Anthropic](https://anthropic.com) and [OpenAI](https://openai.com) for powerful AI models
- [Next.js](https://nextjs.org) team for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first styling approach

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.