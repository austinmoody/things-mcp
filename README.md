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
# Test all functionality
npm test

# Test specific features
npm run test:show     # Test navigation tools
npm run test:add      # Test content creation tools  
npm run test:search   # Test search functionality
npm run test:update   # Test updating to-do items
npm run test:update-project  # Test updating projects
npm run test:complete # Test completing to-do items
npm run test:navigation # Test all navigation tools
npm run test:batch    # Test batch operations
npm run test:validation # Test validation utilities
npm run test:advanced-search # Test enhanced search with filters
npm run test:templates     # Test project template creation
npm run test:advanced      # Test v1.4 advanced features
```

These run manual test scripts that verify the Things integration is working correctly.

### Available Tools

Currently implemented tools:

**Navigation Tools:**
- **show_today_list**: Navigate to the Things "Today" list view
  - No parameters required
  - Opens Things app and displays today's tasks

- **show_inbox**: Navigate to the Things "Inbox" list view
  - No parameters required
  - Opens Things app and displays unorganized tasks

- **show_upcoming**: Navigate to the Things "Upcoming" list view
  - No parameters required
  - Opens Things app and displays future scheduled tasks

- **show_anytime**: Navigate to the Things "Anytime" list view
  - No parameters required
  - Opens Things app and displays tasks scheduled for anytime

- **show_someday**: Navigate to the Things "Someday" list view
  - No parameters required
  - Opens Things app and displays someday/maybe tasks

- **show_projects**: Navigate to the Things "Projects" list view
  - No parameters required
  - Opens Things app and displays all active projects

- **show_areas**: Navigate to the Things "Areas" list view
  - No parameters required
  - Opens Things app and displays all areas of responsibility

- **show_logbook**: Navigate to the Things "Logbook" view
  - No parameters required
  - Opens Things app and displays completed tasks and projects

**Content Creation Tools:**
- **add_todo**: Create new to-do items
  - Required: title
  - Optional: notes, when, deadline, tags, checklist, list
  - Creates a new task in Things with specified details

- **add_project**: Create new projects  
  - Required: title
  - Optional: notes, when, deadline, tags, area, todos
  - Creates a new project with optional initial to-dos

**Search Tools:**
- **search**: Search Things content
  - Required: query
  - Opens Things and displays search results for the query

**Update Tools:**
- **update_todo**: Update existing to-do items
  - Required: id (Things ID or title)
  - Optional: title, notes, when, deadline, tags, checklist, list
  - Modifies properties of an existing to-do

- **update_project**: Update existing projects
  - Required: id (Things ID or title)
  - Optional: title, notes, when, deadline, tags, area
  - Modifies properties of an existing project

- **complete_todo**: Mark to-do items as completed
  - Required: id (Things ID or title)
  - Marks the specified to-do as completed

**Batch Tools:**
- **batch_add_todos**: Create multiple to-do items at once
  - Required: todos (array of todo objects)
  - Optional: Each todo can have title, notes, when, deadline, tags, list
  - Creates multiple tasks efficiently in a single operation

- **batch_complete_todos**: Mark multiple to-do items as completed
  - Required: ids (array of todo IDs or titles)
  - Marks multiple tasks as completed in a single operation

- **batch_update_todos**: Update multiple to-do items with the same changes
  - Required: ids (array of todo IDs), updates (object with changes)
  - Optional updates: title, notes, when, deadline, tags, list
  - Applies the same changes to multiple tasks efficiently

**Advanced Tools (v1.4):**
- **search_advanced**: Enhanced search with filters and parameters
  - Required: query (search string)
  - Optional filters: status, type, area, project, tag, list, date_range, limit
  - Provides sophisticated search capabilities with multiple filter options

- **create_project_template**: Create projects from predefined templates
  - Required: template_name, project_title
  - Templates: software_project, marketing_campaign, event_planning, research_project, custom
  - Optional: project_notes, area, tags, when, deadline, custom_todos
  - Creates structured projects with template-based to-dos

- **json_command**: Execute complex operations using JSON commands
  - Required: command_type, payload
  - Supports: create_workspace, bulk_import, project_hierarchy, advanced_update
  - Enables sophisticated operations beyond simple URL parameters

- **show_filtered_view**: Navigate to specific Things views and items
  - Required: view_type (today, inbox, upcoming, anytime, someday, projects, areas, logbook)
  - Optional: item_id (for specific items), search_query (for search-based navigation)
  - Opens filtered views in Things app since URL scheme doesn't support data retrieval

## Project Structure

```
things-mcp-server/
├── package.json              # Dependencies and scripts
├── README.md                 # This file
├── src/
│   ├── index.js              # Main MCP server entry point
│   ├── things-client.js      # Things URL scheme interface
│   ├── tools/
│   │   ├── show-tools.js     # Navigation command implementations
│   │   ├── add-tools.js      # Content creation tools
│   │   ├── search-tools.js   # Search functionality
│   │   ├── update-tools.js   # Update and completion tools
│   │   ├── batch-tools.js    # Batch operations for multiple items
│   │   └── advanced-tools.js # Advanced v1.4 features
│   └── utils/
│       └── validation.js     # Comprehensive validation utilities
├── examples/
│   ├── test-show-today.js    # Test navigation tools
│   ├── test-add-todo.js      # Test content creation
│   ├── test-search.js        # Test search functionality
│   ├── test-update-todo.js   # Test updating to-dos
│   ├── test-update-project.js # Test updating projects
│   ├── test-complete-todo.js # Test completing to-dos
│   ├── test-navigation.js    # Test all navigation tools
│   ├── test-batch-operations.js # Test batch operations
│   ├── test-validation.js    # Test validation utilities
│   ├── test-advanced-search.js # Test enhanced search features
│   ├── test-project-templates.js # Test project template creation
│   └── test-advanced-features.js # Test v1.4 advanced features
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

### Current: Core Commands (v1.1) ✅
- ✅ MCP server infrastructure
- ✅ Things URL scheme integration
- ✅ show_today_list tool
- ✅ add_todo: Create new to-dos
- ✅ add_project: Create new projects
- ✅ search: Search Things content

### Current: Advanced Features (v1.3) ✅
- ✅ Additional navigation tools (show_inbox, show_upcoming, show_anytime, show_someday, show_projects, show_areas, show_logbook)
- ✅ Batch operations (batch_add_todos, batch_complete_todos, batch_update_todos)
- ✅ Enhanced error handling and comprehensive validation utilities

### Current: Future Enhancements (v1.4) ✅
- ✅ x-callback-url support for getting return values from Things
- ✅ JSON command support for complex operations
- ✅ Enhanced search with filters and parameters
- ✅ Project templates and advanced project management

### Next: Enterprise Features (v1.5)
- [ ] Webhook integration for real-time updates
- [ ] Advanced reporting and analytics
- [ ] Multi-user workspace management
- [ ] API rate limiting and optimization

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