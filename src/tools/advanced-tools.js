/**
 * Advanced Tools - MCP Tools for Things App Advanced Features (v1.4)
 * 
 * This module defines advanced MCP tools that provide enhanced functionality
 * for the Things app, including enhanced search, x-callback-url support,
 * JSON commands, and project templates.
 * 
 * These tools represent the cutting-edge capabilities of the Things MCP server
 * and provide sophisticated integration with Things' advanced features.
 */

/**
 * Create and return all advanced MCP tools
 * 
 * This factory function creates tool objects configured with a specific
 * ThingsClient instance. Each tool handles advanced functionality that
 * goes beyond basic CRUD operations.
 * 
 * @param {ThingsClient} thingsClient - Configured Things client instance
 * @returns {Array} - Array of MCP tool objects
 */
export function createAdvancedTools(thingsClient) {
  return [
    {
      name: "search_advanced",
      description: "Perform advanced search in Things with filters and parameters. Supports filtering by status, tags, areas, projects, and date ranges.",
      
      // JSON Schema defining the input parameters for advanced search
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query string (required)",
            minLength: 1
          },
          filter: {
            type: "object",
            description: "Advanced search filters",
            properties: {
              status: {
                type: "string",
                description: "Filter by completion status",
                enum: ["open", "completed", "canceled", "all"]
              },
              type: {
                type: "string", 
                description: "Filter by item type",
                enum: ["todos", "projects", "all"]
              },
              area: {
                type: "string",
                description: "Filter by specific area name"
              },
              project: {
                type: "string",
                description: "Filter by specific project name"
              },
              tag: {
                type: "string",
                description: "Filter by specific tag"
              },
              list: {
                type: "string",
                description: "Filter by specific list",
                enum: ["inbox", "today", "upcoming", "anytime", "someday"]
              },
              date_range: {
                type: "object",
                description: "Filter by date range",
                properties: {
                  start: {
                    type: "string",
                    description: "Start date (YYYY-MM-DD format)"
                  },
                  end: {
                    type: "string", 
                    description: "End date (YYYY-MM-DD format)"
                  }
                }
              }
            }
          },
          limit: {
            type: "integer",
            description: "Maximum number of results to return",
            minimum: 1,
            maximum: 100,
            default: 20
          }
        },
        required: ["query"],
      },
      
      /**
       * Handler function for the search_advanced tool
       * 
       * This function performs advanced search with filtering capabilities.
       * It builds a sophisticated search URL with multiple parameters.
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
          if (!args.query || args.query.trim() === '') {
            throw new Error("Search query is required and cannot be empty");
          }
          
          // Build search parameters
          const searchParams = {
            query: args.query.trim(),
          };
          
          // Add filters if provided
          if (args.filter) {
            if (args.filter.status) searchParams.status = args.filter.status;
            if (args.filter.type) searchParams.type = args.filter.type;
            if (args.filter.area) searchParams.area = args.filter.area;
            if (args.filter.project) searchParams.project = args.filter.project;
            if (args.filter.tag) searchParams.tag = args.filter.tag;
            if (args.filter.list) searchParams.list = args.filter.list;
            
            // Handle date range
            if (args.filter.date_range) {
              if (args.filter.date_range.start) searchParams.start_date = args.filter.date_range.start;
              if (args.filter.date_range.end) searchParams.end_date = args.filter.date_range.end;
            }
          }
          
          // Add limit if provided
          if (args.limit) {
            searchParams.limit = args.limit;
          }
          
          // Execute the advanced search command
          const success = await thingsClient.searchAdvanced(searchParams);
          
          if (success) {
            let message = `Successfully executed advanced search for: "${searchParams.query}"`;
            
            // Add filter summary if filters were applied
            const appliedFilters = Object.keys(searchParams).filter(key => key !== 'query' && key !== 'limit');
            if (appliedFilters.length > 0) {
              message += `\nApplied filters: ${appliedFilters.join(', ')}`;
            }
            
            if (args.limit) {
              message += `\nResult limit: ${args.limit}`;
            }
            
            return message;
          } else {
            throw new Error("Failed to execute advanced search in Things app");
          }
        } catch (error) {
          const errorMessage = `Failed to perform advanced search: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },

    {
      name: "create_project_template",
      description: "Create a project from a predefined template with multiple to-dos, areas, tags, and structure. Supports custom templates for common project types.",
      
      // JSON Schema defining the input parameters for project templates
      inputSchema: {
        type: "object",
        properties: {
          template_name: {
            type: "string",
            description: "Name of the project template to use",
            enum: ["software_project", "marketing_campaign", "event_planning", "research_project", "custom"]
          },
          project_title: {
            type: "string",
            description: "Title for the new project (required)",
            minLength: 1
          },
          project_notes: {
            type: "string",
            description: "Optional notes for the project"
          },
          area: {
            type: "string",
            description: "Area to assign the project to"
          },
          tags: {
            type: "string",
            description: "Comma-separated list of tags for the project"
          },
          when: {
            type: "string",
            description: "When to schedule the project",
            enum: ["today", "tomorrow", "anytime", "someday"]
          },
          deadline: {
            type: "string",
            description: "Project deadline (YYYY-MM-DD format)"
          },
          custom_todos: {
            type: "array",
            description: "Custom to-do items for the project (used with 'custom' template)",
            items: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "Title of the to-do item"
                },
                notes: {
                  type: "string",
                  description: "Notes for the to-do item"
                },
                tags: {
                  type: "string",
                  description: "Tags for the to-do item"
                },
                when: {
                  type: "string",
                  description: "When to schedule this to-do",
                  enum: ["today", "tomorrow", "anytime", "someday"]
                }
              },
              required: ["title"]
            }
          }
        },
        required: ["template_name", "project_title"],
      },
      
      /**
       * Handler function for the create_project_template tool
       * 
       * This function creates a project from a predefined template with
       * multiple to-dos and proper structure.
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
          if (!args.template_name || !args.project_title || args.project_title.trim() === '') {
            throw new Error("Template name and project title are required");
          }
          
          // Check for authentication token
          if (!process.env.THINGS_AUTHENTICATION_TOKEN) {
            throw new Error("THINGS_AUTHENTICATION_TOKEN is required for project creation. Please set this environment variable.");
          }
          
          // Get template todos based on template name
          let templateTodos = [];
          
          switch (args.template_name) {
            case 'software_project':
              templateTodos = [
                'Project planning and requirements gathering',
                'Set up development environment',
                'Create initial architecture and design',
                'Implement core functionality',
                'Write unit tests',
                'Integration testing',
                'Documentation and README',
                'Code review and refactoring',
                'Deployment and release preparation',
                'Post-launch monitoring and feedback'
              ];
              break;
              
            case 'marketing_campaign':
              templateTodos = [
                'Define campaign objectives and KPIs',
                'Research target audience and competitors',
                'Develop campaign messaging and positioning',
                'Create content calendar and timeline',
                'Design marketing materials and assets',
                'Set up tracking and analytics',
                'Launch campaign across channels',
                'Monitor campaign performance',
                'Analyze results and optimize',
                'Prepare campaign report and learnings'
              ];
              break;
              
            case 'event_planning':
              templateTodos = [
                'Define event goals and success metrics',
                'Set budget and get approvals',
                'Choose venue and book date',
                'Create event timeline and schedule',
                'Invite speakers and plan agenda',
                'Set up registration and ticketing',
                'Plan catering and logistics',
                'Create marketing and promotional materials',
                'Coordinate day-of-event logistics',
                'Post-event follow-up and feedback collection'
              ];
              break;
              
            case 'research_project':
              templateTodos = [
                'Define research questions and hypotheses',
                'Literature review and background research',
                'Design research methodology',
                'Gather and organize data sources',
                'Conduct primary research and data collection',
                'Analyze data and identify patterns',
                'Draw conclusions and validate findings',
                'Write research report or paper',
                'Peer review and feedback incorporation',
                'Present findings and publish results'
              ];
              break;
              
            case 'custom':
              if (args.custom_todos && Array.isArray(args.custom_todos)) {
                templateTodos = args.custom_todos.map(todo => 
                  typeof todo === 'string' ? todo : todo.title
                );
              } else {
                templateTodos = ['Define project scope and objectives', 'Create project plan', 'Execute project tasks', 'Review and finalize project'];
              }
              break;
              
            default:
              throw new Error(`Unknown template: ${args.template_name}`);
          }
          
          // Build project data
          const projectData = {
            title: args.project_title.trim(),
            todos: templateTodos
          };
          
          // Add optional fields
          if (args.project_notes) projectData.notes = args.project_notes;
          if (args.area) projectData.area = args.area;
          if (args.tags) projectData.tags = args.tags;
          if (args.when) projectData.when = args.when;
          if (args.deadline) projectData.deadline = args.deadline;
          
          // Execute the create project command
          const success = await thingsClient.addProject(projectData);
          
          if (success) {
            return `Successfully created project "${projectData.title}" from ${args.template_name} template with ${templateTodos.length} to-do items`;
          } else {
            throw new Error("Failed to create project template in Things app");
          }
        } catch (error) {
          const errorMessage = `Failed to create project template: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },

    {
      name: "json_command",
      description: "Execute complex Things operations using JSON command format. Supports advanced operations like creating multiple projects with nested todos, complex updates, and batch operations with detailed configuration.",
      
      // JSON Schema defining the input parameters for JSON commands
      inputSchema: {
        type: "object",
        properties: {
          command_type: {
            type: "string",
            description: "Type of JSON command to execute",
            enum: ["create_workspace", "bulk_import", "project_hierarchy", "advanced_update"]
          },
          payload: {
            type: "object",
            description: "JSON payload containing the command data",
            additionalProperties: true
          }
        },
        required: ["command_type", "payload"],
      },
      
      /**
       * Handler function for the json_command tool
       * 
       * This function processes complex JSON commands for advanced operations.
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
          if (!args.command_type || !args.payload) {
            throw new Error("Command type and payload are required");
          }
          
          // Check for authentication token
          if (!process.env.THINGS_AUTHENTICATION_TOKEN) {
            throw new Error("THINGS_AUTHENTICATION_TOKEN is required for JSON commands. Please set this environment variable.");
          }
          
          // Execute based on command type
          let result;
          
          switch (args.command_type) {
            case 'create_workspace':
              result = await thingsClient.executeJsonCommand('create_workspace', args.payload);
              break;
              
            case 'bulk_import':
              result = await thingsClient.executeJsonCommand('bulk_import', args.payload);
              break;
              
            case 'project_hierarchy':
              result = await thingsClient.executeJsonCommand('project_hierarchy', args.payload);
              break;
              
            case 'advanced_update':
              result = await thingsClient.executeJsonCommand('advanced_update', args.payload);
              break;
              
            default:
              throw new Error(`Unsupported JSON command type: ${args.command_type}`);
          }
          
          if (result) {
            return `Successfully executed JSON command: ${args.command_type}`;
          } else {
            throw new Error(`Failed to execute JSON command: ${args.command_type}`);
          }
        } catch (error) {
          const errorMessage = `Failed to execute JSON command: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },

    {
      name: "get_things_data",
      description: "Retrieve data from Things using x-callback-url support. This tool can fetch information about projects, todos, areas, and other Things data for analysis and reporting.",
      
      // JSON Schema defining the input parameters for data retrieval
      inputSchema: {
        type: "object",
        properties: {
          data_type: {
            type: "string",
            description: "Type of data to retrieve from Things",
            enum: ["projects", "todos", "areas", "tags", "lists", "specific_item"]
          },
          filter: {
            type: "object",
            description: "Filter criteria for data retrieval",
            properties: {
              status: {
                type: "string",
                description: "Filter by completion status",
                enum: ["open", "completed", "canceled", "all"]
              },
              area: {
                type: "string",
                description: "Filter by specific area"
              },
              project: {
                type: "string", 
                description: "Filter by specific project"
              },
              tag: {
                type: "string",
                description: "Filter by specific tag"
              },
              date_range: {
                type: "object",
                description: "Filter by date range",
                properties: {
                  start: {
                    type: "string",
                    description: "Start date (YYYY-MM-DD)"
                  },
                  end: {
                    type: "string",
                    description: "End date (YYYY-MM-DD)"
                  }
                }
              }
            }
          },
          item_id: {
            type: "string",
            description: "Specific item ID to retrieve (for 'specific_item' data_type)"
          },
          format: {
            type: "string",
            description: "Output format for the retrieved data",
            enum: ["json", "markdown", "csv"],
            default: "json"
          }
        },
        required: ["data_type"],
      },
      
      /**
       * Handler function for the get_things_data tool
       * 
       * This function retrieves data from Things using x-callback-url support.
       * Note: This is a mock implementation as actual x-callback-url requires
       * Things app support and URL scheme extensions.
       * 
       * @param {Object} args - Arguments passed from the MCP client
       * @returns {Promise<string>} - Retrieved data or error message
       */
      handler: async (args) => {
        try {
          // Validate that Things is available
          if (!thingsClient.isThingsAvailable()) {
            throw new Error("Things app is not available. Make sure you're running on macOS and Things is installed.");
          }
          
          // Validate required fields
          if (!args.data_type) {
            throw new Error("Data type is required");
          }
          
          // For specific_item requests, require item_id
          if (args.data_type === 'specific_item' && !args.item_id) {
            throw new Error("Item ID is required for specific_item data type");
          }
          
          // Execute the data retrieval command
          const data = await thingsClient.getThingsData(args.data_type, args.filter, args.item_id, args.format);
          
          if (data) {
            let message = `Successfully retrieved ${args.data_type} data from Things`;
            
            // Add filter summary if filters were applied
            if (args.filter) {
              const appliedFilters = Object.keys(args.filter).filter(key => args.filter[key] !== undefined);
              if (appliedFilters.length > 0) {
                message += `\nApplied filters: ${appliedFilters.join(', ')}`;
              }
            }
            
            message += `\nFormat: ${args.format || 'json'}`;
            message += `\n\nNote: This feature requires Things app support for x-callback-url data retrieval.`;
            message += `\nCurrent implementation opens Things to display the requested data.`;
            
            return message;
          } else {
            throw new Error("Failed to retrieve data from Things app");
          }
        } catch (error) {
          const errorMessage = `Failed to retrieve Things data: ${error.message}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },
  ];
}