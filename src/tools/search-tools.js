/**
 * Search Tools - MCP Tools for Things App Search Commands
 * 
 * This module defines MCP tools that handle search operations in the Things app.
 * Search functionality allows users to find existing content across all their
 * to-dos, projects, areas, and other Things data.
 */

/**
 * Create and return all search-related MCP tools
 * 
 * This factory function creates tool objects configured with a specific
 * ThingsClient instance for performing search operations.
 * 
 * @param {ThingsClient} thingsClient - Configured Things client instance
 * @returns {Array} - Array of MCP tool objects
 */
export function createSearchTools(thingsClient) {
  return [
    {
      name: "search",
      description: "Search for content in Things app. Opens Things and displays search results for the given query across all to-dos, projects, and areas.",
      
      // JSON Schema defining the input parameters for search
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query to find in Things content",
            minLength: 1
          }
        },
        required: ["query"],
      },
      
      /**
       * Handler function for the search tool
       * 
       * This function validates the search query and uses the ThingsClient
       * to perform a search in the Things app. The search will open Things
       * and display results matching the query.
       * 
       * @param {Object} args - Arguments passed from the MCP client
       * @returns {Promise<string>} - Success or error message
       */
      handler: async (args) => {
        try {
          // Validate that Things is available
          if (!thingsClient.isThingsAvailable()) {
            throw new Error("Things app is not available. Make sure you're running on macOS and Things is installed.");
          }
          
          // Validate required fields
          if (!args.query || typeof args.query !== 'string' || args.query.trim() === '') {
            throw new Error("Search query is required and must be a non-empty string");
          }
          
          // Clean up the search query
          const searchQuery = args.query.trim();
          
          // Execute the search command
          const success = await thingsClient.search(searchQuery);
          
          if (success) {
            return `Successfully performed search for: "${searchQuery}". Things app is now showing search results.`;
          } else {
            throw new Error("Failed to perform search in Things app");
          }
        } catch (error) {
          const errorMessage = `Failed to search: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },
  ];
}