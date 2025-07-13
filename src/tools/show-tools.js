/**
 * Show Tools - MCP Tools for Things App Show Commands
 * 
 * This module defines MCP tools that handle "show" operations in the Things app.
 * MCP tools are functions that can be called by AI assistants and other MCP clients.
 * 
 * Each tool has:
 * - name: Unique identifier for the tool
 * - description: Human-readable description of what it does
 * - inputSchema: JSON Schema defining expected parameters
 * - handler: Async function that executes the tool
 */

/**
 * Create and return all show-related MCP tools
 * 
 * This is a factory function that creates tool objects configured with
 * a specific ThingsClient instance. Factory functions are a common
 * Node.js pattern for creating configured objects.
 * 
 * @param {ThingsClient} thingsClient - Configured Things client instance
 * @returns {Array} - Array of MCP tool objects
 */
export function createShowTools(thingsClient) {
  return [
    {
      name: "show_today_list",
      description: "Navigate to the Things app 'Today' list view. This opens the Things app and displays all tasks scheduled for today.",
      
      // JSON Schema defining the input parameters for this tool
      // For show_today_list, we don't need any parameters, so this is an empty object schema
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
      
      /**
       * Handler function for the show_today_list tool
       * 
       * This function is called when an MCP client wants to execute this tool.
       * It uses the ThingsClient to open the Today list in the Things app.
       * 
       * @param {Object} args - Arguments passed from the MCP client (empty for this tool)
       * @returns {Promise<string>} - Success or error message
       */
      handler: async (args) => {
        try {
          // Validate that Things is available before attempting to use it
          if (!thingsClient.isThingsAvailable()) {
            throw new Error("Things app is not available. Make sure you're running on macOS and Things is installed.");
          }
          
          // Execute the show today list command
          const success = await thingsClient.showTodayList();
          
          if (success) {
            return "Successfully opened Things app and navigated to Today list";
          } else {
            throw new Error("Failed to open Today list in Things app");
          }
        } catch (error) {
          // Provide detailed error information for debugging
          const errorMessage = `Failed to show Today list: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },
    
    // Future show tools can be added here, such as:
    // - show_inbox_list
    // - show_upcoming_list  
    // - show_anytime_list
    // - show_someday_list
    // - show_projects_list
    // - show_areas_list
    // - show_logbook_list
  ];
}