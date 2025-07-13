# Things MCP Server API Documentation

This document provides detailed information about the MCP tools available in the Things MCP Server.

## Overview

The Things MCP Server exposes tools through the Model Context Protocol (MCP) that allow interaction with the Things app on macOS. Each tool corresponds to a specific operation that can be performed in Things.

## Authentication

Some operations require authentication with the Things app. Set your authentication token in the environment:

```bash
export THINGS_AUTHENTICATION_TOKEN="your_token_here"
```

**Note**: The `show` commands typically don't require authentication, but other operations (like adding or modifying tasks) will require it.

## Available Tools

### show_today_list

Navigate to the Things "Today" list view.

**Description**: Opens the Things app and displays the Today list, which shows all tasks scheduled for today.

**Parameters**: None

**Input Schema**:
```json
{
  "type": "object",
  "properties": {},
  "required": []
}
```

**Returns**: Success message string

**Example Usage** (via MCP client):
```json
{
  "method": "tools/call",
  "params": {
    "name": "show_today_list",
    "arguments": {}
  }
}
```

**Success Response**:
```
"Successfully opened Things app and navigated to Today list"
```

**Error Conditions**:
- Things app not available (not on macOS or not installed)
- URL scheme permission denied
- Things app unable to respond

**Things URL Generated**: `things:///show?id=today`

## Error Handling

All tools implement comprehensive error handling:

1. **Environment Validation**: Checks for macOS platform and Things availability
2. **Parameter Validation**: Validates input parameters against JSON schema
3. **Execution Errors**: Catches and reports URL scheme execution failures
4. **Graceful Degradation**: Provides helpful error messages for troubleshooting

### Common Error Messages

- `"Things app is not available. Make sure you're running on macOS and Things is installed."`
- `"Things command execution failed: [specific error]"`
- `"THINGS_AUTHENTICATION_TOKEN not found in environment variables"`

## Implementation Details

### URL Scheme Format

All Things commands use the URL scheme format:
```
things:///command?parameter1=value1&parameter2=value2
```

### Authentication Token Usage

When required, the authentication token is automatically added to URLs:
```
things:///command?auth-token=YOUR_TOKEN&other=parameters
```

### Platform Requirements

- **macOS Only**: Things is exclusively available on macOS
- **Things App**: Must be installed and accessible
- **URL Scheme Permissions**: macOS may prompt for permission to open Things

## Future API Expansion

The following tools are planned for future iterations:

### Coming in v1.1

- `add_todo`: Create new to-do items
- `add_project`: Create new projects
- `search`: Search Things content

### Coming in v1.2

- `update_todo`: Modify existing to-dos
- `update_project`: Modify existing projects
- `complete_todo`: Mark tasks as completed

### Coming in v1.3

- `show_list`: Navigate to any list by ID
- `show_area`: Navigate to specific areas
- `show_project`: Navigate to specific projects

## Testing

### Manual Testing

Use the provided test script to verify functionality:

```bash
node examples/test-show-today.js
```

### MCP Client Testing

1. Start the server: `npm start`
2. Connect your MCP client
3. List available tools: should show `show_today_list`
4. Execute the tool with empty parameters
5. Verify Things opens to Today list

## Troubleshooting

### Tool Not Available

If a tool doesn't appear in the list:
1. Check that the server started successfully
2. Verify MCP client connection
3. Check server logs for registration errors

### Execution Failures

If tool execution fails:
1. Verify macOS platform
2. Check Things app installation
3. Test URL scheme permissions
4. Review authentication token setup

### Permission Issues

If macOS blocks URL scheme access:
1. Open System Preferences > Security & Privacy
2. Check Privacy settings for automation
3. Grant permission to your terminal/MCP client
4. Try executing a Things URL manually in Safari

## Development Guidelines

### Adding New Tools

When adding new MCP tools:

1. **Define the tool structure**:
   ```javascript
   {
     name: "tool_name",
     description: "Clear description of what it does",
     inputSchema: { /* JSON Schema */ },
     handler: async (args) => { /* Implementation */ }
   }
   ```

2. **Include comprehensive error handling**
3. **Add detailed comments explaining Node.js concepts**
4. **Update this documentation**
5. **Create test cases**

### Code Style Requirements

- Use JSDoc comments for all functions
- Explain async/await usage
- Comment MCP-specific concepts
- Include error handling explanations
- Use descriptive variable names

## Reference Links

- [Things URL Scheme Documentation](https://culturedcode.com/things/support/articles/2803573/)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Node.js Documentation](https://nodejs.org/en/docs/)