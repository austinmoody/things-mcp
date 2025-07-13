# Things MCP Server

A Model Context Protocol (MCP) server that interfaces with the Mac application "Things" (by Cultured Code) through its URL scheme. This enables AI assistants and other applications to interact with Things for task management operations.

## Overview

This MCP server allows you to control the Things app on macOS through standardized MCP protocol commands. The first iteration implements basic navigation functionality, with plans to expand to full task management capabilities.

## Requirements

- **macOS**: Things is a Mac-only application
- **Node.js**: Version 18.0.0 or higher (LTS recommended)
- **Things App**: Must be installed and accessible via URL scheme
- **Authentication Token**: Required for some operations (stored in environment variables)

## Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd things-mcp-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional for basic show commands)
   Create a `.env` file in the root directory:
   ```bash
   THINGS_AUTHENTICATION_TOKEN=your_auth_token_here
   ```

4. **Verify Things app is installed**
   Make sure the Things app is installed on your Mac and can be opened normally.

## Usage

### As an MCP Server

Start the MCP server:
```bash
npm start
```

The server will start and listen for MCP protocol messages via stdin/stdout. You can then connect any MCP-compatible client to use the available tools.

### Manual Testing

Test the functionality directly:
```bash
npm test
```

This runs the manual test script that verifies the Things integration is working correctly.

### Available Tools

Currently implemented tools:

- **show_today_list**: Navigate to the Things "Today" list view
  - No parameters required
  - Opens Things app and displays today's tasks

## Project Structure

```
things-mcp-server/
├── package.json              # Dependencies and scripts
├── README.md                 # This file
├── src/
│   ├── index.js              # Main MCP server entry point
│   ├── things-client.js      # Things URL scheme interface
│   └── tools/
│       └── show-tools.js     # Show command implementations
├── examples/
│   └── test-show-today.js    # Manual testing script
└── docs/
    └── API.md                # Detailed API documentation
```

## Configuration

### Environment Variables

- `THINGS_AUTHENTICATION_TOKEN`: Required for write operations (optional for show commands)

### MCP Client Configuration

When connecting with an MCP client, use:
- **Server command**: `node src/index.js`
- **Working directory**: Path to this project
- **Transport**: stdio

## Troubleshooting

### Common Issues

1. **"Things app is not available"**
   - Ensure you're running on macOS
   - Verify Things app is installed
   - Check that Things can be opened manually

2. **"Permission denied" or URL scheme errors**
   - macOS may prompt for permission to open Things
   - Grant permission when prompted
   - Try opening a Things URL manually in Safari to test

3. **Module import errors**
   - Ensure Node.js version is 18.0.0 or higher
   - Run `npm install` to install dependencies
   - Check that `"type": "module"` is in package.json

4. **MCP connection issues**
   - Verify your MCP client supports the stdio transport
   - Check that the server starts without errors
   - Ensure proper working directory is set

### Testing

Run the manual test to verify everything works:
```bash
node examples/test-show-today.js
```

This will attempt to open the Things Today list and report success or failure.

## Development

### Adding New Tools

1. Create tool definitions in the appropriate module (e.g., `src/tools/`)
2. Register tools in `src/index.js`
3. Add tests in `examples/`
4. Update documentation

### Code Style

- Use ES6+ features with comprehensive comments
- Follow async/await pattern for asynchronous operations
- Include JSDoc comments for all public functions
- Explain Node.js concepts for developers new to the ecosystem

## Roadmap

### Current: Basic Navigation (v1.0)
- ✅ MCP server infrastructure
- ✅ Things URL scheme integration
- ✅ show_today_list tool

### Next: Core Commands (v1.1)
- [ ] add_todo: Create new to-dos
- [ ] add_project: Create new projects
- [ ] search: Search Things content

### Future: Advanced Features
- [ ] Update operations for existing items
- [ ] Batch operations
- [ ] Full Things URL scheme support

## Contributing

1. Follow the existing code style and comment patterns
2. Add comprehensive tests for new functionality
3. Update documentation for any new features
4. Ensure compatibility with macOS and Things app requirements

## License

MIT License - see LICENSE file for details

## Support

For issues related to:
- **This MCP server**: Create an issue in this repository
- **Things app**: Contact Cultured Code support
- **MCP protocol**: Refer to the official MCP documentation