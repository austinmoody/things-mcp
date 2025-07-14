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

    {
      name: "show_inbox",
      description: "Navigate to the Things app 'Inbox' list view. This opens the Things app and displays all unorganized tasks in the inbox.",
      
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
      
      handler: async (args) => {
        try {
          if (!thingsClient.isThingsAvailable()) {
            throw new Error("Things app is not available. Make sure you're running on macOS and Things is installed.");
          }
          
          const success = await thingsClient.showList('inbox');
          
          if (success) {
            return "Successfully opened Things app and navigated to Inbox";
          } else {
            throw new Error("Failed to open Inbox in Things app");
          }
        } catch (error) {
          const errorMessage = `Failed to show Inbox: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },

    {
      name: "show_upcoming",
      description: "Navigate to the Things app 'Upcoming' list view. This opens the Things app and displays all tasks scheduled for future dates.",
      
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
      
      handler: async (args) => {
        try {
          if (!thingsClient.isThingsAvailable()) {
            throw new Error("Things app is not available. Make sure you're running on macOS and Things is installed.");
          }
          
          const success = await thingsClient.showList('upcoming');
          
          if (success) {
            return "Successfully opened Things app and navigated to Upcoming";
          } else {
            throw new Error("Failed to open Upcoming in Things app");
          }
        } catch (error) {
          const errorMessage = `Failed to show Upcoming: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },

    {
      name: "show_anytime",
      description: "Navigate to the Things app 'Anytime' list view. This opens the Things app and displays all tasks scheduled for anytime (no specific date).",
      
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
      
      handler: async (args) => {
        try {
          if (!thingsClient.isThingsAvailable()) {
            throw new Error("Things app is not available. Make sure you're running on macOS and Things is installed.");
          }
          
          const success = await thingsClient.showList('anytime');
          
          if (success) {
            return "Successfully opened Things app and navigated to Anytime";
          } else {
            throw new Error("Failed to open Anytime in Things app");
          }
        } catch (error) {
          const errorMessage = `Failed to show Anytime: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },

    {
      name: "show_someday",
      description: "Navigate to the Things app 'Someday' list view. This opens the Things app and displays all tasks and projects scheduled for someday (maybe later).",
      
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
      
      handler: async (args) => {
        try {
          if (!thingsClient.isThingsAvailable()) {
            throw new Error("Things app is not available. Make sure you're running on macOS and Things is installed.");
          }
          
          const success = await thingsClient.showList('someday');
          
          if (success) {
            return "Successfully opened Things app and navigated to Someday";
          } else {
            throw new Error("Failed to open Someday in Things app");
          }
        } catch (error) {
          const errorMessage = `Failed to show Someday: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },

    {
      name: "show_projects",
      description: "Navigate to the Things app 'Projects' list view. This opens the Things app and displays all active projects.",
      
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
      
      handler: async (args) => {
        try {
          if (!thingsClient.isThingsAvailable()) {
            throw new Error("Things app is not available. Make sure you're running on macOS and Things is installed.");
          }
          
          const success = await thingsClient.showList('projects');
          
          if (success) {
            return "Successfully opened Things app and navigated to Projects";
          } else {
            throw new Error("Failed to open Projects in Things app");
          }
        } catch (error) {
          const errorMessage = `Failed to show Projects: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },

    {
      name: "show_areas",
      description: "Navigate to the Things app 'Areas' list view. This opens the Things app and displays all areas of responsibility.",
      
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
      
      handler: async (args) => {
        try {
          if (!thingsClient.isThingsAvailable()) {
            throw new Error("Things app is not available. Make sure you're running on macOS and Things is installed.");
          }
          
          const success = await thingsClient.showList('areas');
          
          if (success) {
            return "Successfully opened Things app and navigated to Areas";
          } else {
            throw new Error("Failed to open Areas in Things app");
          }
        } catch (error) {
          const errorMessage = `Failed to show Areas: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },

    {
      name: "show_logbook",
      description: "Navigate to the Things app 'Logbook' view. This opens the Things app and displays all completed tasks and projects.",
      
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
      
      handler: async (args) => {
        try {
          if (!thingsClient.isThingsAvailable()) {
            throw new Error("Things app is not available. Make sure you're running on macOS and Things is installed.");
          }
          
          const success = await thingsClient.showList('logbook');
          
          if (success) {
            return "Successfully opened Things app and navigated to Logbook";
          } else {
            throw new Error("Failed to open Logbook in Things app");
          }
        } catch (error) {
          const errorMessage = `Failed to show Logbook: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },
  ];
}