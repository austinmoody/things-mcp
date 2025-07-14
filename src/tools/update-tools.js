/**
 * Update Tools - MCP Tools for Things App Update Commands
 * 
 * This module defines MCP tools that handle "update" operations in the Things app.
 * These tools allow modifying existing to-dos and projects, as well as marking
 * items as complete through the MCP protocol.
 * 
 * Update operations require authentication tokens for security and need to identify
 * specific items to modify. The tools validate input thoroughly and provide helpful
 * error messages for debugging.
 */

/**
 * Create and return all update-related MCP tools
 * 
 * This factory function creates tool objects configured with a specific
 * ThingsClient instance. Each tool handles different types of content
 * modification in the Things app.
 * 
 * @param {ThingsClient} thingsClient - Configured Things client instance
 * @returns {Array} - Array of MCP tool objects
 */
export function createUpdateTools(thingsClient) {
  return [
    {
      name: "update_todo",
      description: "Update an existing to-do item in Things. Allows modifying title, notes, scheduling, tags, and other properties.",
      
      // JSON Schema defining the input parameters for updating a to-do
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The unique identifier of the to-do to update (required). This can be the Things ID or title.",
            minLength: 1
          },
          title: {
            type: "string",
            description: "New title/name for the to-do item",
            minLength: 1
          },
          notes: {
            type: "string",
            description: "New notes or description for the to-do"
          },
          when: {
            type: "string",
            description: "When to reschedule the to-do (e.g., 'today', 'tomorrow', 'evening', specific date)",
            enum: ["today", "tomorrow", "evening", "anytime", "someday"]
          },
          deadline: {
            type: "string",
            description: "New due date for the to-do (format: YYYY-MM-DD or natural language)"
          },
          tags: {
            type: "string",
            description: "New comma-separated list of tags to apply to the to-do"
          },
          checklist: {
            type: "string",
            description: "New checklist items for the to-do (one per line)"
          },
          list: {
            type: "string",
            description: "Move the to-do to a different list"
          }
        },
        required: ["id"],
      },
      
      /**
       * Handler function for the update_todo tool
       * 
       * This function validates the input, checks authentication requirements,
       * and uses the ThingsClient to update an existing to-do item.
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
          if (!args.id || args.id.trim() === '') {
            throw new Error("Todo ID is required and cannot be empty");
          }
          
          // Check for authentication token since update operations require it
          if (!process.env.THINGS_AUTHENTICATION_TOKEN) {
            throw new Error("THINGS_AUTHENTICATION_TOKEN is required for update operations. Please set this environment variable.");
          }
          
          // Clean up the input data
          const updateData = {
            id: args.id.trim(),
          };
          
          // Add optional fields if provided
          if (args.title && args.title.trim()) updateData.title = args.title.trim();
          if (args.notes !== undefined) updateData.notes = args.notes; // Allow empty string to clear notes
          if (args.when) updateData.when = args.when;
          if (args.deadline !== undefined) updateData.deadline = args.deadline; // Allow empty string to clear deadline
          if (args.tags !== undefined) updateData.tags = args.tags; // Allow empty string to clear tags
          if (args.checklist !== undefined) updateData.checklist = args.checklist; // Allow empty string to clear checklist
          if (args.list && args.list.trim()) updateData.list = args.list.trim();
          
          // Execute the update todo command
          const success = await thingsClient.updateTodo(updateData);
          
          if (success) {
            return `Successfully updated to-do with ID: "${updateData.id}"`;
          } else {
            throw new Error("Failed to update to-do in Things app");
          }
        } catch (error) {
          const errorMessage = `Failed to update to-do: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },
    
    {
      name: "update_project",
      description: "Update an existing project in Things. Allows modifying title, notes, scheduling, tags, area, and other properties.",
      
      // JSON Schema defining the input parameters for updating a project
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The unique identifier of the project to update (required). This can be the Things ID or title.",
            minLength: 1
          },
          title: {
            type: "string",
            description: "New title/name for the project",
            minLength: 1
          },
          notes: {
            type: "string",
            description: "New notes or description for the project"
          },
          when: {
            type: "string",
            description: "When to reschedule the project",
            enum: ["today", "tomorrow", "evening", "anytime", "someday"]
          },
          deadline: {
            type: "string",
            description: "New due date for the project (format: YYYY-MM-DD or natural language)"
          },
          tags: {
            type: "string",
            description: "New comma-separated list of tags to apply to the project"
          },
          area: {
            type: "string",
            description: "Move the project to a different area"
          }
        },
        required: ["id"],
      },
      
      /**
       * Handler function for the update_project tool
       * 
       * This function validates the input and uses the ThingsClient
       * to update an existing project.
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
          if (!args.id || args.id.trim() === '') {
            throw new Error("Project ID is required and cannot be empty");
          }
          
          // Check for authentication token
          if (!process.env.THINGS_AUTHENTICATION_TOKEN) {
            throw new Error("THINGS_AUTHENTICATION_TOKEN is required for update operations. Please set this environment variable.");
          }
          
          // Clean up the input data
          const updateData = {
            id: args.id.trim(),
          };
          
          // Add optional fields if provided
          if (args.title && args.title.trim()) updateData.title = args.title.trim();
          if (args.notes !== undefined) updateData.notes = args.notes; // Allow empty string to clear notes
          if (args.when) updateData.when = args.when;
          if (args.deadline !== undefined) updateData.deadline = args.deadline; // Allow empty string to clear deadline
          if (args.tags !== undefined) updateData.tags = args.tags; // Allow empty string to clear tags
          if (args.area && args.area.trim()) updateData.area = args.area.trim();
          
          // Execute the update project command
          const success = await thingsClient.updateProject(updateData);
          
          if (success) {
            return `Successfully updated project with ID: "${updateData.id}"`;
          } else {
            throw new Error("Failed to update project in Things app");
          }
        } catch (error) {
          const errorMessage = `Failed to update project: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },
    
    {
      name: "complete_todo",
      description: "Mark a to-do item as completed in Things. This will move the item to the completed state.",
      
      // JSON Schema defining the input parameters for completing a to-do
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The unique identifier of the to-do to complete (required). This can be the Things ID or title.",
            minLength: 1
          }
        },
        required: ["id"],
      },
      
      /**
       * Handler function for the complete_todo tool
       * 
       * This function validates the input and uses the ThingsClient
       * to mark a to-do item as completed.
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
          if (!args.id || args.id.trim() === '') {
            throw new Error("Todo ID is required and cannot be empty");
          }
          
          // Check for authentication token
          if (!process.env.THINGS_AUTHENTICATION_TOKEN) {
            throw new Error("THINGS_AUTHENTICATION_TOKEN is required for completion operations. Please set this environment variable.");
          }
          
          // Clean up the input data
          const completeData = {
            id: args.id.trim(),
          };
          
          // Execute the complete todo command
          const success = await thingsClient.completeTodo(completeData);
          
          if (success) {
            return `Successfully marked to-do as completed: "${completeData.id}"`;
          } else {
            throw new Error("Failed to complete to-do in Things app");
          }
        } catch (error) {
          const errorMessage = `Failed to complete to-do: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },
  ];
}