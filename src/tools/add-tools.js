/**
 * Add Tools - MCP Tools for Things App Add Commands
 * 
 * This module defines MCP tools that handle "add" operations in the Things app.
 * These tools allow creating new to-dos and projects through the MCP protocol.
 * 
 * Add operations require authentication tokens for security, unlike the basic
 * show commands. The tools validate input thoroughly and provide helpful
 * error messages for debugging.
 */

/**
 * Create and return all add-related MCP tools
 * 
 * This factory function creates tool objects configured with a specific
 * ThingsClient instance. Each tool handles different types of content
 * creation in the Things app.
 * 
 * @param {ThingsClient} thingsClient - Configured Things client instance
 * @returns {Array} - Array of MCP tool objects
 */
export function createAddTools(thingsClient) {
  return [
    {
      name: "add_todo",
      description: "Create a new to-do item in Things. Supports title, notes, scheduling, tags, and more.",
      
      // JSON Schema defining the input parameters for adding a to-do
      inputSchema: {
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
            description: "When to schedule the to-do (e.g., 'today', 'tomorrow', 'evening', specific date)",
            enum: ["today", "tomorrow", "evening", "anytime", "someday"]
          },
          deadline: {
            type: "string",
            description: "Due date for the to-do (format: YYYY-MM-DD or natural language)"
          },
          tags: {
            type: "string",
            description: "Comma-separated list of tags to apply to the to-do"
          },
          checklist: {
            type: "string",
            description: "Checklist items for the to-do (one per line)"
          },
          list: {
            type: "string",
            description: "Which list to add the to-do to (defaults to inbox)"
          }
        },
        required: ["title"],
      },
      
      /**
       * Handler function for the add_todo tool
       * 
       * This function validates the input, checks authentication requirements,
       * and uses the ThingsClient to create a new to-do item.
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
          if (!args.title || args.title.trim() === '') {
            throw new Error("Todo title is required and cannot be empty");
          }
          
          // Check for authentication token since add operations typically require it
          if (!process.env.THINGS_AUTHENTICATION_TOKEN) {
            console.warn("Warning: THINGS_AUTHENTICATION_TOKEN not set. Add operations may fail without authentication.");
          }
          
          // Clean up the input data
          const todoData = {
            title: args.title.trim(),
          };
          
          // Add optional fields if provided
          if (args.notes && args.notes.trim()) todoData.notes = args.notes.trim();
          if (args.when) todoData.when = args.when;
          if (args.deadline) todoData.deadline = args.deadline;
          if (args.tags && args.tags.trim()) todoData.tags = args.tags.trim();
          if (args.checklist && args.checklist.trim()) todoData.checklist = args.checklist.trim();
          if (args.list && args.list.trim()) todoData.list = args.list.trim();
          
          // Execute the add todo command
          const success = await thingsClient.addTodo(todoData);
          
          if (success) {
            return `Successfully created to-do: "${todoData.title}"`;
          } else {
            throw new Error("Failed to create to-do in Things app");
          }
        } catch (error) {
          const errorMessage = `Failed to add to-do: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },
    
    {
      name: "add_project",
      description: "Create a new project in Things. Projects help organize related to-dos and can include initial tasks.",
      
      // JSON Schema defining the input parameters for adding a project
      inputSchema: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "The title/name of the project (required)",
            minLength: 1
          },
          notes: {
            type: "string",
            description: "Optional notes or description for the project"
          },
          when: {
            type: "string",
            description: "When to schedule the project",
            enum: ["today", "tomorrow", "evening", "anytime", "someday"]
          },
          deadline: {
            type: "string",
            description: "Due date for the project (format: YYYY-MM-DD or natural language)"
          },
          tags: {
            type: "string",
            description: "Comma-separated list of tags to apply to the project"
          },
          area: {
            type: "string",
            description: "Which area to add the project to"
          },
          todos: {
            type: "array",
            description: "Array of initial to-do items to add to the project",
            items: {
              type: "string",
              description: "To-do item title"
            }
          }
        },
        required: ["title"],
      },
      
      /**
       * Handler function for the add_project tool
       * 
       * This function validates the input and uses the ThingsClient
       * to create a new project with optional initial to-dos.
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
          if (!args.title || args.title.trim() === '') {
            throw new Error("Project title is required and cannot be empty");
          }
          
          // Check for authentication token
          if (!process.env.THINGS_AUTHENTICATION_TOKEN) {
            console.warn("Warning: THINGS_AUTHENTICATION_TOKEN not set. Add operations may fail without authentication.");
          }
          
          // Clean up the input data
          const projectData = {
            title: args.title.trim(),
          };
          
          // Add optional fields if provided
          if (args.notes && args.notes.trim()) projectData.notes = args.notes.trim();
          if (args.when) projectData.when = args.when;
          if (args.deadline) projectData.deadline = args.deadline;
          if (args.tags && args.tags.trim()) projectData.tags = args.tags.trim();
          if (args.area && args.area.trim()) projectData.area = args.area.trim();
          
          // Handle todos array - filter out empty strings and trim
          if (args.todos && Array.isArray(args.todos)) {
            projectData.todos = args.todos
              .filter(todo => todo && todo.trim())
              .map(todo => todo.trim());
          }
          
          // Execute the add project command
          const success = await thingsClient.addProject(projectData);
          
          if (success) {
            let message = `Successfully created project: "${projectData.title}"`;
            if (projectData.todos && projectData.todos.length > 0) {
              message += ` with ${projectData.todos.length} initial to-do(s)`;
            }
            return message;
          } else {
            throw new Error("Failed to create project in Things app");
          }
        } catch (error) {
          const errorMessage = `Failed to add project: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },
  ];
}