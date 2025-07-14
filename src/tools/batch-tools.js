/**
 * Batch Tools - MCP Tools for Things App Batch Operations
 * 
 * This module defines MCP tools that handle batch operations in the Things app.
 * These tools allow performing operations on multiple items at once, which is
 * more efficient than executing individual commands for each item.
 * 
 * Batch operations require authentication tokens for security and need to identify
 * multiple items to operate on. The tools validate input thoroughly and provide
 * detailed progress reporting for each operation.
 */

/**
 * Create and return all batch-related MCP tools
 * 
 * This factory function creates tool objects configured with a specific
 * ThingsClient instance. Each tool handles different types of batch
 * operations in the Things app.
 * 
 * @param {ThingsClient} thingsClient - Configured Things client instance
 * @returns {Array} - Array of MCP tool objects
 */
export function createBatchTools(thingsClient) {
  return [
    {
      name: "batch_add_todos",
      description: "Create multiple to-do items in Things at once. This is more efficient than adding items one by one.",
      
      // JSON Schema defining the input parameters for batch adding to-dos
      inputSchema: {
        type: "object",
        properties: {
          todos: {
            type: "array",
            description: "Array of to-do items to create",
            minItems: 1,
            maxItems: 20, // Reasonable limit to prevent overwhelming the system
            items: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "The title/name of the to-do item (required)",
                  minLength: 1
                },
                notes: {
                  type: "string",
                  description: "Optional notes or description for the to-do"
                },
                when: {
                  type: "string",
                  description: "When to schedule the to-do",
                  enum: ["today", "tomorrow", "evening", "anytime", "someday"]
                },
                deadline: {
                  type: "string",
                  description: "Due date for the to-do"
                },
                tags: {
                  type: "string",
                  description: "Comma-separated list of tags"
                },
                list: {
                  type: "string",
                  description: "Which list to add the to-do to"
                }
              },
              required: ["title"]
            }
          }
        },
        required: ["todos"],
      },
      
      /**
       * Handler function for the batch_add_todos tool
       * 
       * This function validates the input and creates multiple to-dos sequentially.
       * It provides detailed feedback on the success/failure of each operation.
       * 
       * @param {Object} args - Arguments passed from the MCP client
       * @returns {Promise<string>} - Detailed success or error message
       */
      handler: async (args) => {
        try {
          // Validate that Things is available
          if (!thingsClient.isThingsAvailable()) {
            throw new Error("Things app is not available. Make sure you're running on macOS and Things is installed.");
          }
          
          // Validate required fields
          if (!args.todos || !Array.isArray(args.todos) || args.todos.length === 0) {
            throw new Error("Todos array is required and must contain at least one item");
          }
          
          // Check for authentication token
          if (!process.env.THINGS_AUTHENTICATION_TOKEN) {
            throw new Error("THINGS_AUTHENTICATION_TOKEN is required for batch add operations. Please set this environment variable.");
          }
          
          const results = [];
          let successCount = 0;
          let failureCount = 0;
          
          // Process each to-do sequentially to avoid overwhelming the system
          for (let i = 0; i < args.todos.length; i++) {
            const todo = args.todos[i];
            
            try {
              // Validate individual todo
              if (!todo.title || todo.title.trim() === '') {
                throw new Error(`Todo ${i + 1}: Title is required`);
              }
              
              // Clean up the todo data
              const todoData = {
                title: todo.title.trim(),
              };
              
              // Add optional fields if provided
              if (todo.notes && todo.notes.trim()) todoData.notes = todo.notes.trim();
              if (todo.when) todoData.when = todo.when;
              if (todo.deadline) todoData.deadline = todo.deadline;
              if (todo.tags && todo.tags.trim()) todoData.tags = todo.tags.trim();
              if (todo.list && todo.list.trim()) todoData.list = todo.list.trim();
              
              // Execute the add todo command
              const success = await thingsClient.addTodo(todoData);
              
              if (success) {
                results.push(`✅ Todo ${i + 1}: "${todoData.title}" - Created successfully`);
                successCount++;
              } else {
                results.push(`❌ Todo ${i + 1}: "${todoData.title}" - Failed to create`);
                failureCount++;
              }
              
              // Small delay between operations to be respectful to the system
              if (i < args.todos.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
              }
              
            } catch (error) {
              results.push(`❌ Todo ${i + 1}: "${todo.title || 'Unknown'}" - Error: ${error.message}`);
              failureCount++;
            }
          }
          
          // Compile final report
          const summary = `Batch add todos completed: ${successCount} successful, ${failureCount} failed`;
          const detailReport = results.join('\n');
          
          return `${summary}\n\nDetailed Results:\n${detailReport}`;
          
        } catch (error) {
          const errorMessage = `Failed to batch add todos: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },
    
    {
      name: "batch_complete_todos",
      description: "Mark multiple to-do items as completed in Things at once. Requires the IDs or titles of the to-dos to complete.",
      
      // JSON Schema defining the input parameters for batch completing to-dos
      inputSchema: {
        type: "object",
        properties: {
          ids: {
            type: "array",
            description: "Array of to-do IDs or titles to mark as completed",
            minItems: 1,
            maxItems: 50, // Higher limit since this is just marking items complete
            items: {
              type: "string",
              description: "The unique identifier or title of the to-do to complete",
              minLength: 1
            }
          }
        },
        required: ["ids"],
      },
      
      /**
       * Handler function for the batch_complete_todos tool
       * 
       * This function validates the input and marks multiple to-dos as completed.
       * It provides detailed feedback on the success/failure of each operation.
       * 
       * @param {Object} args - Arguments passed from the MCP client
       * @returns {Promise<string>} - Detailed success or error message
       */
      handler: async (args) => {
        try {
          // Validate that Things is available
          if (!thingsClient.isThingsAvailable()) {
            throw new Error("Things app is not available. Make sure you're running on macOS and Things is installed.");
          }
          
          // Validate required fields
          if (!args.ids || !Array.isArray(args.ids) || args.ids.length === 0) {
            throw new Error("IDs array is required and must contain at least one item");
          }
          
          // Check for authentication token
          if (!process.env.THINGS_AUTHENTICATION_TOKEN) {
            throw new Error("THINGS_AUTHENTICATION_TOKEN is required for batch completion operations. Please set this environment variable.");
          }
          
          const results = [];
          let successCount = 0;
          let failureCount = 0;
          
          // Process each to-do sequentially
          for (let i = 0; i < args.ids.length; i++) {
            const id = args.ids[i];
            
            try {
              // Validate individual ID
              if (!id || id.trim() === '') {
                throw new Error(`ID ${i + 1}: ID cannot be empty`);
              }
              
              const completeData = {
                id: id.trim(),
              };
              
              // Execute the complete todo command
              const success = await thingsClient.completeTodo(completeData);
              
              if (success) {
                results.push(`✅ Todo ${i + 1}: "${completeData.id}" - Marked as completed`);
                successCount++;
              } else {
                results.push(`❌ Todo ${i + 1}: "${completeData.id}" - Failed to complete`);
                failureCount++;
              }
              
              // Small delay between operations
              if (i < args.ids.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
              }
              
            } catch (error) {
              results.push(`❌ Todo ${i + 1}: "${id || 'Unknown'}" - Error: ${error.message}`);
              failureCount++;
            }
          }
          
          // Compile final report
          const summary = `Batch complete todos finished: ${successCount} successful, ${failureCount} failed`;
          const detailReport = results.join('\n');
          
          return `${summary}\n\nDetailed Results:\n${detailReport}`;
          
        } catch (error) {
          const errorMessage = `Failed to batch complete todos: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },
    
    {
      name: "batch_update_todos",
      description: "Update multiple to-do items in Things at once. Allows applying the same changes to multiple items efficiently.",
      
      // JSON Schema defining the input parameters for batch updating to-dos
      inputSchema: {
        type: "object",
        properties: {
          ids: {
            type: "array",
            description: "Array of to-do IDs or titles to update",
            minItems: 1,
            maxItems: 20,
            items: {
              type: "string",
              description: "The unique identifier or title of the to-do to update",
              minLength: 1
            }
          },
          updates: {
            type: "object",
            description: "The updates to apply to all specified to-dos",
            properties: {
              title: {
                type: "string",
                description: "New title/name for the to-dos"
              },
              notes: {
                type: "string",
                description: "New notes or description for the to-dos"
              },
              when: {
                type: "string",
                description: "When to reschedule the to-dos",
                enum: ["today", "tomorrow", "evening", "anytime", "someday"]
              },
              deadline: {
                type: "string",
                description: "New due date for the to-dos"
              },
              tags: {
                type: "string",
                description: "New comma-separated list of tags"
              },
              list: {
                type: "string",
                description: "Move the to-dos to a different list"
              }
            },
            minProperties: 1 // At least one field must be provided for updates
          }
        },
        required: ["ids", "updates"],
      },
      
      /**
       * Handler function for the batch_update_todos tool
       * 
       * This function validates the input and updates multiple to-dos with the same changes.
       * It provides detailed feedback on the success/failure of each operation.
       * 
       * @param {Object} args - Arguments passed from the MCP client
       * @returns {Promise<string>} - Detailed success or error message
       */
      handler: async (args) => {
        try {
          // Validate that Things is available
          if (!thingsClient.isThingsAvailable()) {
            throw new Error("Things app is not available. Make sure you're running on macOS and Things is installed.");
          }
          
          // Validate required fields
          if (!args.ids || !Array.isArray(args.ids) || args.ids.length === 0) {
            throw new Error("IDs array is required and must contain at least one item");
          }
          
          if (!args.updates || typeof args.updates !== 'object') {
            throw new Error("Updates object is required");
          }
          
          // Check that at least one update field is provided
          const updateKeys = Object.keys(args.updates).filter(key => args.updates[key] !== undefined);
          if (updateKeys.length === 0) {
            throw new Error("At least one update field must be provided");
          }
          
          // Check for authentication token
          if (!process.env.THINGS_AUTHENTICATION_TOKEN) {
            throw new Error("THINGS_AUTHENTICATION_TOKEN is required for batch update operations. Please set this environment variable.");
          }
          
          const results = [];
          let successCount = 0;
          let failureCount = 0;
          
          // Process each to-do sequentially
          for (let i = 0; i < args.ids.length; i++) {
            const id = args.ids[i];
            
            try {
              // Validate individual ID
              if (!id || id.trim() === '') {
                throw new Error(`ID ${i + 1}: ID cannot be empty`);
              }
              
              // Build update data for this specific to-do
              const updateData = {
                id: id.trim(),
              };
              
              // Add the update fields
              if (args.updates.title !== undefined) updateData.title = args.updates.title;
              if (args.updates.notes !== undefined) updateData.notes = args.updates.notes;
              if (args.updates.when !== undefined) updateData.when = args.updates.when;
              if (args.updates.deadline !== undefined) updateData.deadline = args.updates.deadline;
              if (args.updates.tags !== undefined) updateData.tags = args.updates.tags;
              if (args.updates.list !== undefined) updateData.list = args.updates.list;
              
              // Execute the update todo command
              const success = await thingsClient.updateTodo(updateData);
              
              if (success) {
                results.push(`✅ Todo ${i + 1}: "${updateData.id}" - Updated successfully`);
                successCount++;
              } else {
                results.push(`❌ Todo ${i + 1}: "${updateData.id}" - Failed to update`);
                failureCount++;
              }
              
              // Small delay between operations
              if (i < args.ids.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
              }
              
            } catch (error) {
              results.push(`❌ Todo ${i + 1}: "${id || 'Unknown'}" - Error: ${error.message}`);
              failureCount++;
            }
          }
          
          // Compile final report
          const summary = `Batch update todos completed: ${successCount} successful, ${failureCount} failed`;
          const detailReport = results.join('\n');
          
          // Show what updates were applied
          const appliedUpdates = Object.entries(args.updates)
            .filter(([key, value]) => value !== undefined)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          
          return `${summary}\n\nApplied Updates: ${appliedUpdates}\n\nDetailed Results:\n${detailReport}`;
          
        } catch (error) {
          const errorMessage = `Failed to batch update todos: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },
  ];
}