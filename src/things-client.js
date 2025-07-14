/**
 * Things Client - Interface for Things App URL Scheme
 * 
 * This module handles communication with the Things app through its URL scheme.
 * Things provides a URL scheme that allows external applications to interact
 * with it by opening specially formatted URLs.
 * 
 * The Things URL scheme format is: things:///command?parameter1=value1&parameter2=value2
 * An authentication token is required for most operations.
 */

// Import Node.js built-in modules
import { platform } from 'os';  // For checking if we're on macOS
import { URL } from 'url';       // For URL construction and validation

// Import third-party package for opening URLs
// The 'open' package allows us to open URLs with the default application
import open from 'open';

/**
 * Client class for interacting with the Things app via URL scheme
 * 
 * This class encapsulates all the logic for building Things URLs,
 * validating parameters, and executing commands.
 */
export class ThingsClient {
  constructor() {
    // Get authentication token from environment variables
    // Environment variables in Node.js are accessed via process.env
    this.authToken = process.env.THINGS_AUTHENTICATION_TOKEN;
    
    // Base URL for all Things commands
    this.baseUrl = 'things:///';
    
    // Validate the environment
    this.validateEnvironment();
  }

  /**
   * Validate that the environment is suitable for Things integration
   * 
   * Things is a macOS-only application, so we need to check that we're
   * running on macOS. We also check for the required auth token.
   */
  validateEnvironment() {
    // Check if we're running on macOS
    // The os.platform() function returns the operating system platform
    if (platform() !== 'darwin') {
      throw new Error('Things app is only available on macOS');
    }

    // Check if auth token is provided
    // Note: For the show commands in this first iteration, the token might not be required,
    // but we'll warn if it's missing since it will be needed for other operations
    if (!this.authToken) {
      console.warn('THINGS_AUTHENTICATION_TOKEN not found in environment variables. Some operations may fail.');
    }
  }

  /**
   * Build a properly formatted Things URL
   * 
   * This method constructs a valid Things URL with the given command and parameters.
   * It handles URL encoding and parameter validation.
   * 
   * @param {string} command - The Things command (e.g., 'show', 'add')
   * @param {Object} params - Parameters for the command
   * @returns {string} - The complete Things URL
   */
  buildUrl(command, params = {}) {
    try {
      // Start with the base Things URL and add the command
      const url = new URL(command, this.baseUrl);
      
      // Build query string manually to avoid URLSearchParams encoding spaces as '+'
      const queryParts = [];
      
      // Add authentication token if available and not a simple show command
      // Show commands typically don't require authentication
      if (this.authToken && command !== 'show') {
        queryParts.push(`auth-token=${encodeURIComponent(this.authToken)}`);
      }
      
      // Add all other parameters
      // Object.entries() gives us an array of [key, value] pairs
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Use encodeURIComponent to properly encode parameters while preserving spaces as %20
          queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
        }
      });
      
      // Manually set the search string to avoid URLSearchParams automatic encoding
      if (queryParts.length > 0) {
        url.search = '?' + queryParts.join('&');
      }
      
      return url.toString();
    } catch (error) {
      throw new Error(`Failed to build Things URL: ${error.message}`);
    }
  }

  /**
   * Execute a Things command by opening the URL
   * 
   * This method opens the constructed Things URL, which causes macOS to
   * launch the Things app and execute the command.
   * 
   * @param {string} command - The Things command to execute
   * @param {Object} params - Parameters for the command
   * @returns {Promise<boolean>} - True if the URL was successfully opened
   */
  async executeCommand(command, params = {}) {
    try {
      // Build the complete Things URL
      const thingsUrl = this.buildUrl(command, params);
      
      console.error(`Executing Things command: ${thingsUrl}`);
      
      // Open the URL with the default application (Things)
      // The 'await' keyword waits for the Promise to resolve
      // The 'open' function returns a Promise that resolves when the URL is opened
      await open(thingsUrl, {
        // Specify that we want to open with the default app for this URL scheme
        wait: false,  // Don't wait for the app to close
      });
      
      return true;
    } catch (error) {
      console.error(`Failed to execute Things command: ${error.message}`);
      throw new Error(`Things command execution failed: ${error.message}`);
    }
  }

  /**
   * Show a specific list or item in Things
   * 
   * This is a convenience method for the 'show' command, which is used
   * to navigate to different views within the Things app.
   * 
   * @param {string} id - The ID of the list or item to show (e.g., 'today', 'inbox')
   * @returns {Promise<boolean>} - True if successful
   */
  async showList(id) {
    return this.executeCommand('show', { id });
  }

  /**
   * Show the Today list in Things
   * 
   * This is a specific implementation for showing the Today list,
   * which is commonly used and mentioned in the requirements.
   * 
   * @returns {Promise<boolean>} - True if successful
   */
  async showTodayList() {
    return this.showList('today');
  }

  /**
   * Add a new to-do item to Things
   * 
   * This method creates a new to-do item using the Things 'add' command.
   * The add command supports many parameters for setting title, notes, 
   * due dates, tags, and more.
   * 
   * @param {Object} todoData - The to-do item data
   * @param {string} todoData.title - The title/name of the to-do (required)
   * @param {string} [todoData.notes] - Notes or description for the to-do
   * @param {string} [todoData.when] - When to schedule it (today, tomorrow, evening, etc.)
   * @param {string} [todoData.deadline] - Due date for the to-do
   * @param {string} [todoData.tags] - Comma-separated list of tags
   * @param {string} [todoData.checklist] - Checklist items (line-separated)
   * @param {string} [todoData.list] - Which list to add to (inbox by default)
   * @returns {Promise<boolean>} - True if successful
   */
  async addTodo(todoData) {
    // Validate required parameters
    if (!todoData || !todoData.title) {
      throw new Error('Todo title is required');
    }

    // Build parameters object for the URL
    const params = {
      title: todoData.title,
    };

    // Add optional parameters if provided
    // Only add parameters that have values to keep URLs clean
    if (todoData.notes) params.notes = todoData.notes;
    if (todoData.when) params.when = todoData.when;
    if (todoData.deadline) params.deadline = todoData.deadline;
    if (todoData.tags) params.tags = todoData.tags;
    if (todoData.checklist) params.checklist = todoData.checklist;
    if (todoData.list) params.list = todoData.list;

    return this.executeCommand('add', params);
  }

  /**
   * Add a new project to Things
   * 
   * This method creates a new project using the Things 'add-project' command.
   * Projects in Things are containers for organizing related to-dos.
   * 
   * @param {Object} projectData - The project data
   * @param {string} projectData.title - The title/name of the project (required)
   * @param {string} [projectData.notes] - Notes or description for the project
   * @param {string} [projectData.when] - When to schedule the project
   * @param {string} [projectData.deadline] - Due date for the project
   * @param {string} [projectData.tags] - Comma-separated list of tags
   * @param {string} [projectData.area] - Which area to add the project to
   * @param {Array} [projectData.todos] - Array of to-do items to add to the project
   * @returns {Promise<boolean>} - True if successful
   */
  async addProject(projectData) {
    // Validate required parameters
    if (!projectData || !projectData.title) {
      throw new Error('Project title is required');
    }

    // Build parameters object for the URL
    const params = {
      title: projectData.title,
    };

    // Add optional parameters if provided
    if (projectData.notes) params.notes = projectData.notes;
    if (projectData.when) params.when = projectData.when;
    if (projectData.deadline) params.deadline = projectData.deadline;
    if (projectData.tags) params.tags = projectData.tags;
    if (projectData.area) params.area = projectData.area;
    
    // Handle todos array - convert to newline-separated string
    if (projectData.todos && Array.isArray(projectData.todos)) {
      params.todos = projectData.todos.join('\n');
    }

    return this.executeCommand('add-project', params);
  }

  /**
   * Search for content in Things
   * 
   * This method performs a search using the Things 'search' command.
   * It will open Things and display search results for the given query.
   * 
   * @param {string} query - The search query
   * @returns {Promise<boolean>} - True if successful
   */
  async search(query) {
    // Validate required parameters
    if (!query || typeof query !== 'string' || query.trim() === '') {
      throw new Error('Search query is required and must be a non-empty string');
    }

    return this.executeCommand('search', { query: query.trim() });
  }

  /**
   * Update an existing to-do item in Things
   * 
   * This method updates an existing to-do using the Things 'update' command.
   * The update command allows modifying various properties of existing items.
   * 
   * @param {Object} updateData - The to-do update data
   * @param {string} updateData.id - The unique identifier of the to-do to update (required)
   * @param {string} [updateData.title] - New title/name for the to-do
   * @param {string} [updateData.notes] - New notes or description for the to-do
   * @param {string} [updateData.when] - When to reschedule the to-do
   * @param {string} [updateData.deadline] - New due date for the to-do
   * @param {string} [updateData.tags] - New comma-separated list of tags
   * @param {string} [updateData.checklist] - New checklist items (line-separated)
   * @param {string} [updateData.list] - Move to a different list
   * @returns {Promise<boolean>} - True if successful
   */
  async updateTodo(updateData) {
    // Validate required parameters
    if (!updateData || !updateData.id) {
      throw new Error('Todo ID is required for updates');
    }

    // Build parameters object for the URL
    const params = {
      id: updateData.id,
    };

    // Add optional parameters if provided
    // For update operations, we need to be careful about undefined vs empty string
    if (updateData.title !== undefined) params.title = updateData.title;
    if (updateData.notes !== undefined) params.notes = updateData.notes;
    if (updateData.when !== undefined) params.when = updateData.when;
    if (updateData.deadline !== undefined) params.deadline = updateData.deadline;
    if (updateData.tags !== undefined) params.tags = updateData.tags;
    if (updateData.checklist !== undefined) params.checklist = updateData.checklist;
    if (updateData.list !== undefined) params.list = updateData.list;

    return this.executeCommand('update', params);
  }

  /**
   * Update an existing project in Things
   * 
   * This method updates an existing project using the Things 'update' command.
   * Projects can have their properties modified just like to-dos.
   * 
   * @param {Object} updateData - The project update data
   * @param {string} updateData.id - The unique identifier of the project to update (required)
   * @param {string} [updateData.title] - New title/name for the project
   * @param {string} [updateData.notes] - New notes or description for the project
   * @param {string} [updateData.when] - When to reschedule the project
   * @param {string} [updateData.deadline] - New due date for the project
   * @param {string} [updateData.tags] - New comma-separated list of tags
   * @param {string} [updateData.area] - Move to a different area
   * @returns {Promise<boolean>} - True if successful
   */
  async updateProject(updateData) {
    // Validate required parameters
    if (!updateData || !updateData.id) {
      throw new Error('Project ID is required for updates');
    }

    // Build parameters object for the URL
    const params = {
      id: updateData.id,
    };

    // Add optional parameters if provided
    if (updateData.title !== undefined) params.title = updateData.title;
    if (updateData.notes !== undefined) params.notes = updateData.notes;
    if (updateData.when !== undefined) params.when = updateData.when;
    if (updateData.deadline !== undefined) params.deadline = updateData.deadline;
    if (updateData.tags !== undefined) params.tags = updateData.tags;
    if (updateData.area !== undefined) params.area = updateData.area;

    return this.executeCommand('update', params);
  }

  /**
   * Mark a to-do item as completed in Things
   * 
   * This method marks a to-do as completed using the Things 'update' command
   * with the completed status parameter.
   * 
   * @param {Object} completeData - The completion data
   * @param {string} completeData.id - The unique identifier of the to-do to complete (required)
   * @returns {Promise<boolean>} - True if successful
   */
  async completeTodo(completeData) {
    // Validate required parameters
    if (!completeData || !completeData.id) {
      throw new Error('Todo ID is required for completion');
    }

    // Build parameters for completing the to-do
    const params = {
      id: completeData.id,
      completed: true, // Mark as completed
    };

    return this.executeCommand('update', params);
  }

  /**
   * Perform advanced search in Things with filters
   * 
   * This method performs a sophisticated search using multiple parameters
   * and filters to narrow down results in the Things app.
   * 
   * @param {Object} searchParams - The search parameters and filters
   * @param {string} searchParams.query - The search query (required)
   * @param {string} [searchParams.status] - Filter by completion status
   * @param {string} [searchParams.type] - Filter by item type
   * @param {string} [searchParams.area] - Filter by area
   * @param {string} [searchParams.project] - Filter by project
   * @param {string} [searchParams.tag] - Filter by tag
   * @param {string} [searchParams.list] - Filter by list
   * @param {string} [searchParams.start_date] - Filter start date
   * @param {string} [searchParams.end_date] - Filter end date
   * @param {number} [searchParams.limit] - Limit number of results
   * @returns {Promise<boolean>} - True if successful
   */
  async searchAdvanced(searchParams) {
    // Validate required parameters
    if (!searchParams || !searchParams.query) {
      throw new Error('Search query is required for advanced search');
    }

    // Build parameters object for the URL
    const params = {
      query: searchParams.query,
    };

    // Add filter parameters if provided
    if (searchParams.status) params.status = searchParams.status;
    if (searchParams.type) params.type = searchParams.type;
    if (searchParams.area) params.area = searchParams.area;
    if (searchParams.project) params.project = searchParams.project;
    if (searchParams.tag) params.tag = searchParams.tag;
    if (searchParams.list) params.list = searchParams.list;
    if (searchParams.start_date) params['start-date'] = searchParams.start_date;
    if (searchParams.end_date) params['end-date'] = searchParams.end_date;
    if (searchParams.limit) params.limit = searchParams.limit;

    return this.executeCommand('search', params);
  }

  /**
   * Execute JSON command for complex operations
   * 
   * This method handles complex JSON-based commands that support
   * sophisticated operations beyond simple URL parameters.
   * 
   * @param {string} commandType - The type of JSON command
   * @param {Object} payload - The JSON payload for the command
   * @returns {Promise<boolean>} - True if successful
   */
  async executeJsonCommand(commandType, payload) {
    // Validate required parameters
    if (!commandType || !payload) {
      throw new Error('Command type and payload are required for JSON commands');
    }

    // Convert payload to JSON string for URL parameter
    const jsonPayload = JSON.stringify(payload);
    
    // Build parameters for the JSON command
    const params = {
      'command-type': commandType,
      data: jsonPayload
    };

    // Use a special 'json-command' endpoint (if supported by Things)
    // Note: This is a conceptual implementation as Things may not support this directly
    return this.executeCommand('json-command', params);
  }

  /**
   * Retrieve data from Things using x-callback-url
   * 
   * This method attempts to retrieve data from Things and return it.
   * Note: This requires Things app support for data retrieval callbacks.
   * 
   * @param {string} dataType - Type of data to retrieve
   * @param {Object} filter - Filter criteria for data retrieval
   * @param {string} itemId - Specific item ID (for single item requests)
   * @param {string} format - Output format for the data
   * @returns {Promise<boolean>} - True if successful
   */
  async getThingsData(dataType, filter = {}, itemId = null, format = 'json') {
    // Validate required parameters
    if (!dataType) {
      throw new Error('Data type is required for data retrieval');
    }

    // Build parameters for data retrieval
    const params = {
      'data-type': dataType,
      format: format
    };

    // Add item ID if provided
    if (itemId) {
      params.id = itemId;
    }

    // Add filter parameters if provided
    if (filter.status) params.status = filter.status;
    if (filter.area) params.area = filter.area;
    if (filter.project) params.project = filter.project;
    if (filter.tag) params.tag = filter.tag;
    if (filter.date_range) {
      if (filter.date_range.start) params['start-date'] = filter.date_range.start;
      if (filter.date_range.end) params['end-date'] = filter.date_range.end;
    }

    // Add x-callback-url parameters for data return
    // Note: This would require a local server to receive the callback
    params['x-callback-url'] = 'things-mcp://callback';
    params['x-success'] = 'things-mcp://success';
    params['x-error'] = 'things-mcp://error';

    // Use a special 'get-data' command (conceptual - may not exist in Things)
    return this.executeCommand('get-data', params);
  }

  /**
   * Create a backup export of Things data
   * 
   * This method triggers an export operation in Things to create
   * a backup of user data in various formats.
   * 
   * @param {Object} exportOptions - Export configuration options
   * @param {string} exportOptions.format - Export format (json, csv, xml)
   * @param {string} [exportOptions.path] - Export file path
   * @param {Array} [exportOptions.include] - Data types to include
   * @returns {Promise<boolean>} - True if successful
   */
  async exportThingsData(exportOptions) {
    // Validate required parameters
    if (!exportOptions || !exportOptions.format) {
      throw new Error('Export format is required');
    }

    // Build parameters for export
    const params = {
      format: exportOptions.format
    };

    // Add optional parameters
    if (exportOptions.path) params.path = exportOptions.path;
    if (exportOptions.include && Array.isArray(exportOptions.include)) {
      params.include = exportOptions.include.join(',');
    }

    // Use export command (conceptual)
    return this.executeCommand('export', params);
  }

  /**
   * Import data into Things from various sources
   * 
   * This method handles importing data from external sources
   * into Things with proper formatting and validation.
   * 
   * @param {Object} importOptions - Import configuration options
   * @param {string} importOptions.source - Import source (file, url, json)
   * @param {string} importOptions.data - Import data or path
   * @param {Object} [importOptions.mapping] - Field mapping configuration
   * @returns {Promise<boolean>} - True if successful
   */
  async importThingsData(importOptions) {
    // Validate required parameters
    if (!importOptions || !importOptions.source || !importOptions.data) {
      throw new Error('Import source and data are required');
    }

    // Build parameters for import
    const params = {
      source: importOptions.source,
      data: importOptions.data
    };

    // Add mapping if provided
    if (importOptions.mapping) {
      params.mapping = JSON.stringify(importOptions.mapping);
    }

    // Use import command (conceptual)
    return this.executeCommand('import', params);
  }

  /**
   * Validate that Things app is available
   * 
   * This method can be used to check if the Things app is installed
   * and accessible via URL scheme. Note: This is a basic implementation
   * that assumes if we're on macOS, Things might be available.
   * 
   * @returns {boolean} - True if Things appears to be available
   */
  isThingsAvailable() {
    // Basic check - we're on macOS and have the URL scheme
    // A more sophisticated check would try to open Things and see if it responds
    return platform() === 'darwin';
  }
}