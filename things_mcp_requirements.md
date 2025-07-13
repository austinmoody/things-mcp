# Things MCP Server - Requirements Document

## Project Overview

Build a Model Context Protocol (MCP) server that interfaces with the Mac application "Things" (by Cultured Code) through its URL scheme. This will enable AI assistants and other applications to interact with Things for task management operations.

**Primary Goal**: Create a Node.js-based MCP server that can execute Things URL scheme commands and return results.

**Target User**: Experienced programmer, new to Node.js ecosystem (requires verbose code comments explaining Node.js concepts, patterns, and package usage).

## Technical Specifications

### Language & Runtime
- **Language**: JavaScript (Node.js)
- **MCP Protocol**: Use official MCP SDK for Node.js
- **Package Manager**: npm
- **Node Version**: Use LTS version (recommend specifying in package.json engines field)

### Documentation Reference
- **Things URL Scheme Documentation**: https://culturedcode.com/things/support/articles/2803573/
- Key URL format: `things:///commandName?parameter1=value1&parameter2=value2`

PLEASE NOTE - An authorization token is required to talk to the Things URL.  Assume that I will have that in a .env file with environment variable THINGS_AUTHENTICATION_TOKEN

## First Iteration Scope (Minimal Viable Product)

**Goal**: Create the basic MCP server structure and implement ONE working command.

### Core Infrastructure
1. **MCP Server Setup**
   - Initialize proper MCP server with required dependencies
   - Implement proper MCP protocol message handling
   - Add comprehensive error handling and logging
   - Include verbose comments explaining MCP concepts

2. **Single Command Implementation**
   - Implement `show_today_list` MCP tool
   - Maps to Things command: `things:///show?id=today`
   - Should open Things app and navigate to Today list
   - Return success/failure status

### Project Structure
```
things-mcp-server/
├── package.json              # Dependencies and scripts
├── package-lock.json         # Lock file  
├── README.md                 # Setup and usage instructions
├── src/
│   ├── index.js              # Main MCP server entry point
│   ├── things-client.js      # Things URL scheme interface
│   └── tools/
│       └── show-tools.js     # Show command implementations
├── examples/
│   └── test-show-today.js    # Manual testing script
└── docs/
    └── API.md                # MCP tools documentation
```

### Code Comment Requirements
Since the developer is new to Node.js:

1. **Verbose Comments**: Every function, class, and complex operation needs detailed comments
2. **Node.js Concepts**: Explain specific Node.js patterns (modules, async/await, URL handling)
3. **MCP Protocol**: Comment all MCP-specific code thoroughly
4. **Package Usage**: Explain what each npm package does and why it's needed
5. **Error Handling**: Comment error handling strategies specific to Node.js

Example comment style:
```javascript
/**
 * Executes a Things URL scheme command by opening the URL.
 * In Node.js, we use the 'open' package to launch URLs with the default application.
 * This will trigger macOS to open the Things app with the specified command.
 * 
 * @param {string} thingsUrl - The complete Things URL (e.g., "things:///show?id=today")
 * @returns {Promise<boolean>} - True if URL was successfully opened, false otherwise
 */
```

## Implementation Details

### Dependencies Required
```json
{
  "@modelcontextprotocol/sdk": "latest",  // Core MCP protocol implementation
  "open": "^8.0.0",                       // For opening URLs on macOS
  "url": "built-in"                       // Node.js built-in for URL parsing
}
```

### MCP Tools to Implement (First Iteration)

#### 1. show_today_list
- **Description**: Navigate to Things "Today" list
- **Parameters**: None
- **Things Command**: `things:///show?id=today`
- **Return**: Success confirmation message

### URL Construction Helpers
Create utility functions for:
1. URL encoding parameters properly
2. Building valid Things URLs
3. Parameter validation
4. Error response formatting

### Error Handling Strategy
1. **URL Validation**: Ensure proper Things URL format
2. **macOS Detection**: Verify running on macOS (Things is Mac-only)
3. **Things Installation**: Handle case where Things app isn't installed
4. **Permission Issues**: Handle URL scheme permission prompts gracefully

## Testing Requirements

### Manual Testing
- Create simple test script that can be run with `node examples/test-show-today.js`
- Should demonstrate the MCP tool working end-to-end

### Validation Checklist
- [ ] MCP server starts without errors
- [ ] Can connect to server via MCP client
- [ ] `show_today_list` tool appears in tool list
- [ ] Executing tool opens Things app to Today list
- [ ] Proper error messages for failure cases

## Future Iterations Roadmap

After the basic structure is working, subsequent iterations should add:

### Iteration 2: Core Things Commands
- `add_todo`: Create new to-dos
- `add_project`: Create new projects  
- `search`: Search Things content

### Iteration 3: Update Operations
- `update_todo`: Modify existing to-dos
- `update_project`: Modify existing projects
- Auth token handling for modification commands

### Iteration 4: Advanced Features
- JSON command support for complex operations
- Batch operations
- x-callback-url support for getting return values

## Development Guidelines

### Code Style
- Use ES6+ features with clear comments explaining newer JavaScript concepts
- Prefer async/await over Promises for readability
- Use descriptive variable and function names
- Include JSDoc comments for all public functions

### Security Considerations
- Input validation for all parameters
- Safe URL construction to prevent injection
- Proper handling of auth tokens (when implemented)
- Never expose sensitive data in logs

### Platform Requirements
- **Target Platform**: macOS only (Things is Mac-exclusive)
- **Node.js Version**: LTS (18.x or 20.x)
- **Things App**: Must be installed and URL scheme enabled

## Success Criteria

The first iteration is successful when:
1. ✅ MCP server starts and accepts connections
2. ✅ Tool `show_today_list` is available and documented
3. ✅ Executing the tool successfully opens Things to Today list
4. ✅ Code is thoroughly commented for Node.js learning
5. ✅ Error cases are handled gracefully with informative messages
6. ✅ Project structure supports easy addition of future commands

## Current Status

**Iteration 2: COMPLETED** ✅

All core infrastructure and the initial set of tools have been implemented:
- ✅ `show_today_list` - Navigate to Today list
- ✅ `add_todo` - Create new to-do items  
- ✅ `add_project` - Create new projects
- ✅ `search` - Search Things content

The project is ready for production use with comprehensive MCP tool coverage.

### Testing the Implementation

1. **Manual tests**: 
   - `npm run test:show` - Test navigation tools
   - `npm run test:add` - Test content creation  
   - `npm run test:search` - Test search functionality
   - `npm test` - Run default test (show_today_list)

2. **MCP server**: Run `npm start` to start the server for MCP clients
3. **Validation**: All 4 tools should be available and functional

### Next Session Focus

When resuming development, the next logical steps are:

1. **Begin Iteration 3** by implementing update operations:
   - `update_todo` tool for modifying existing to-dos
   - `update_project` tool for modifying existing projects  
   - `complete_todo` tool for marking tasks as completed

2. **Consider advanced features**:
   - Additional navigation tools (show_inbox, show_upcoming, etc.)
   - Batch operations for multiple items
   - Enhanced error handling and validation

### Implementation Notes for Future Sessions

- All foundation code is in place and thoroughly documented
- The modular structure supports easy addition of new tools
- Error handling patterns are established and can be replicated
- Authentication token support is built-in and tested
- Comprehensive test coverage exists for all current functionality

## Notes for Claude Code

- **Focus on Code Quality**: Prioritize clear, well-commented code over advanced features
- **Error Handling**: Be comprehensive - handle all failure modes gracefully
- **Documentation**: Include setup instructions assuming the user is new to Node.js
- **Testing**: Provide clear manual testing steps
- **Modularity**: Structure code to make adding new Things commands straightforward

The goal is a solid foundation that demonstrates MCP + Things integration and teaches Node.js concepts through practical implementation.