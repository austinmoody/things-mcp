#!/usr/bin/env node

/**
 * Things MCP Server - Main Entry Point
 * 
 * This is the main entry point for our Model Context Protocol (MCP) server.
 * MCP is a protocol that allows AI assistants and other applications to interact
 * with external tools and services in a standardized way.
 * 
 * In Node.js, we use ES modules (import/export) rather than CommonJS (require).
 * The "type": "module" in package.json enables this modern JavaScript syntax.
 */

// Import the MCP SDK components we need
// The MCP SDK provides the core functionality for creating MCP servers
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

// Import our custom modules
import { ThingsClient } from './things-client.js';
import { createShowTools } from './tools/show-tools.js';
import { createAddTools } from './tools/add-tools.js';
import { createSearchTools } from './tools/search-tools.js';
import { createUpdateTools } from './tools/update-tools.js';
import { createBatchTools } from './tools/batch-tools.js';
import { createAdvancedTools } from './tools/advanced-tools.js';

/**
 * Main server class that handles MCP protocol communication
 * 
 * In Node.js, classes are used to organize related functionality.
 * This class extends the base MCP Server class to add our specific
 * Things app integration capabilities.
 */
class ThingsMCPServer {
  constructor() {
    // Create a new MCP server instance
    // The Server class handles all the MCP protocol details for us
    this.server = new Server(
      {
        name: "things-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          // Tell MCP clients that we provide tools they can call
          tools: {},
        },
      }
    );

    // Create our Things client for URL scheme communication
    this.thingsClient = new ThingsClient();

    // Initialize our tools (functions that MCP clients can call)
    this.tools = [];
    
    // Set up all our server handlers
    this.setupHandlers();
  }

  /**
   * Set up MCP protocol message handlers
   * 
   * MCP works by sending and receiving specific types of messages.
   * We need to handle two main types:
   * 1. list_tools - Returns what tools are available
   * 2. call_tool - Executes a specific tool
   */
  setupHandlers() {
    // Handler for listing available tools
    // This tells MCP clients what tools they can call
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        })),
      };
    });

    // Handler for executing tools
    // This runs when an MCP client wants to call one of our tools
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      // Find the requested tool in our tool registry
      const tool = this.tools.find(t => t.name === name);
      if (!tool) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
      }

      try {
        // Execute the tool and return the result
        const result = await tool.handler(args || {});
        return {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        };
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message}`
        );
      }
    });
  }

  /**
   * Register tools with the server
   * 
   * Tools are the functions that MCP clients can call.
   * Each tool has a name, description, input schema, and handler function.
   */
  registerTools(tools) {
    this.tools.push(...tools);
  }

  /**
   * Start the MCP server
   * 
   * This sets up the communication transport (stdin/stdout) and begins
   * listening for MCP protocol messages. In Node.js, this is an async
   * operation that returns a Promise.
   */
  async start() {
    // Create stdio transport for communication
    // MCP servers typically communicate via stdin/stdout pipes
    const transport = new StdioServerTransport();
    
    // Connect the server to the transport
    await this.server.connect(transport);
    
    console.error("Things MCP Server started successfully");
  }
}

/**
 * Initialize and start the server
 * 
 * This is the main function that runs when the script starts.
 * In Node.js, we often use immediately invoked async functions (IIFE)
 * to handle top-level async operations.
 */
async function main() {
  try {
    // Create server instance
    const server = new ThingsMCPServer();

    // Register all our tool categories
    // Show tools for navigation (show_today_list, etc.)
    const showTools = createShowTools(server.thingsClient);
    server.registerTools(showTools);
    
    // Add tools for creating content (add_todo, add_project)
    const addTools = createAddTools(server.thingsClient);
    server.registerTools(addTools);
    
    // Search tools for finding content (search)
    const searchTools = createSearchTools(server.thingsClient);
    server.registerTools(searchTools);
    
    // Update tools for modifying content (update_todo, update_project, complete_todo)
    const updateTools = createUpdateTools(server.thingsClient);
    server.registerTools(updateTools);
    
    // Batch tools for efficient multi-item operations (batch_add_todos, batch_complete_todos, batch_update_todos)
    const batchTools = createBatchTools(server.thingsClient);
    server.registerTools(batchTools);
    
    // Advanced tools for sophisticated features (search_advanced, create_project_template, json_command, get_things_data)
    const advancedTools = createAdvancedTools(server.thingsClient);
    server.registerTools(advancedTools);

    // Start the server
    await server.start();
  } catch (error) {
    console.error("Failed to start Things MCP Server:", error);
    process.exit(1);
  }
}

// Only run main() if this file is being executed directly
// This is a common Node.js pattern to make files both importable and executable
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
}