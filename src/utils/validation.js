/**
 * Validation Utilities - Enhanced validation helpers for Things MCP Server
 * 
 * This module provides comprehensive validation functions for input data,
 * environment setup, and system requirements. These utilities help ensure
 * robust error handling and provide clear feedback to users.
 * 
 * The validation functions follow a consistent pattern:
 * - Return true if validation passes
 * - Throw descriptive errors if validation fails
 * - Include suggestions for fixing common issues
 */

/**
 * Validate that the environment is properly configured for Things operations
 * 
 * This function checks all the prerequisites for running Things MCP operations:
 * - Operating system (macOS required)
 * - Things app availability
 * - Authentication token (for write operations)
 * 
 * @param {boolean} requiresAuth - Whether the operation requires authentication
 * @returns {boolean} - True if environment is valid
 * @throws {Error} - Descriptive error with troubleshooting suggestions
 */
export function validateEnvironment(requiresAuth = false) {
  // Import platform check here to avoid circular dependencies
  import { platform } from 'os';
  
  // Check operating system
  if (platform() !== 'darwin') {
    throw new Error(
      'Things app is only available on macOS. ' +
      'Please run this MCP server on a Mac with Things installed.'
    );
  }
  
  // Check authentication token if required
  if (requiresAuth && !process.env.THINGS_AUTHENTICATION_TOKEN) {
    throw new Error(
      'THINGS_AUTHENTICATION_TOKEN environment variable is required for this operation. ' +
      'Please set this variable with your Things authentication token. ' +
      'You can find your token in Things > Preferences > General > Enable Things URLs.'
    );
  }
  
  return true;
}

/**
 * Validate todo data for creation or update operations
 * 
 * This function ensures that todo data meets all requirements:
 * - Required fields are present and non-empty
 * - Optional fields have valid values
 * - Field lengths are within reasonable limits
 * 
 * @param {Object} todoData - The todo data to validate
 * @param {boolean} isUpdate - Whether this is for an update operation (allows missing title)
 * @returns {Object} - Cleaned and validated todo data
 * @throws {Error} - Validation error with specific field information
 */
export function validateTodoData(todoData, isUpdate = false) {
  if (!todoData || typeof todoData !== 'object') {
    throw new Error('Todo data must be an object');
  }
  
  const cleaned = {};
  
  // Validate title (required for creation, optional for updates)
  if (!isUpdate) {
    if (!todoData.title || typeof todoData.title !== 'string' || todoData.title.trim() === '') {
      throw new Error('Todo title is required and must be a non-empty string');
    }
    cleaned.title = todoData.title.trim();
  } else if (todoData.title !== undefined) {
    if (typeof todoData.title !== 'string') {
      throw new Error('Todo title must be a string');
    }
    cleaned.title = todoData.title.trim();
  }
  
  // Validate optional fields
  if (todoData.notes !== undefined) {
    if (typeof todoData.notes !== 'string') {
      throw new Error('Todo notes must be a string');
    }
    cleaned.notes = todoData.notes; // Don't trim notes to preserve formatting
  }
  
  if (todoData.when !== undefined) {
    const validWhenValues = ['today', 'tomorrow', 'evening', 'anytime', 'someday'];
    if (!validWhenValues.includes(todoData.when)) {
      throw new Error(`Todo 'when' must be one of: ${validWhenValues.join(', ')}`);
    }
    cleaned.when = todoData.when;
  }
  
  if (todoData.deadline !== undefined) {
    if (typeof todoData.deadline !== 'string') {
      throw new Error('Todo deadline must be a string (date format)');
    }
    cleaned.deadline = todoData.deadline.trim();
  }
  
  if (todoData.tags !== undefined) {
    if (typeof todoData.tags !== 'string') {
      throw new Error('Todo tags must be a string (comma-separated)');
    }
    cleaned.tags = todoData.tags.trim();
  }
  
  if (todoData.checklist !== undefined) {
    if (typeof todoData.checklist !== 'string') {
      throw new Error('Todo checklist must be a string (line-separated)');
    }
    cleaned.checklist = todoData.checklist; // Don't trim to preserve formatting
  }
  
  if (todoData.list !== undefined) {
    if (typeof todoData.list !== 'string') {
      throw new Error('Todo list must be a string');
    }
    cleaned.list = todoData.list.trim();
  }
  
  return cleaned;
}

/**
 * Validate project data for creation or update operations
 * 
 * Similar to todo validation but with project-specific fields and requirements.
 * 
 * @param {Object} projectData - The project data to validate
 * @param {boolean} isUpdate - Whether this is for an update operation
 * @returns {Object} - Cleaned and validated project data
 * @throws {Error} - Validation error with specific field information
 */
export function validateProjectData(projectData, isUpdate = false) {
  if (!projectData || typeof projectData !== 'object') {
    throw new Error('Project data must be an object');
  }
  
  const cleaned = {};
  
  // Validate title (required for creation, optional for updates)
  if (!isUpdate) {
    if (!projectData.title || typeof projectData.title !== 'string' || projectData.title.trim() === '') {
      throw new Error('Project title is required and must be a non-empty string');
    }
    cleaned.title = projectData.title.trim();
  } else if (projectData.title !== undefined) {
    if (typeof projectData.title !== 'string') {
      throw new Error('Project title must be a string');
    }
    cleaned.title = projectData.title.trim();
  }
  
  // Validate optional fields
  if (projectData.notes !== undefined) {
    if (typeof projectData.notes !== 'string') {
      throw new Error('Project notes must be a string');
    }
    cleaned.notes = projectData.notes;
  }
  
  if (projectData.when !== undefined) {
    const validWhenValues = ['today', 'tomorrow', 'evening', 'anytime', 'someday'];
    if (!validWhenValues.includes(projectData.when)) {
      throw new Error(`Project 'when' must be one of: ${validWhenValues.join(', ')}`);
    }
    cleaned.when = projectData.when;
  }
  
  if (projectData.deadline !== undefined) {
    if (typeof projectData.deadline !== 'string') {
      throw new Error('Project deadline must be a string (date format)');
    }
    cleaned.deadline = projectData.deadline.trim();
  }
  
  if (projectData.tags !== undefined) {
    if (typeof projectData.tags !== 'string') {
      throw new Error('Project tags must be a string (comma-separated)');
    }
    cleaned.tags = projectData.tags.trim();
  }
  
  if (projectData.area !== undefined) {
    if (typeof projectData.area !== 'string') {
      throw new Error('Project area must be a string');
    }
    cleaned.area = projectData.area.trim();
  }
  
  if (projectData.todos !== undefined) {
    if (!Array.isArray(projectData.todos)) {
      throw new Error('Project todos must be an array');
    }
    // Validate each todo in the array
    cleaned.todos = projectData.todos
      .filter(todo => todo && typeof todo === 'string' && todo.trim())
      .map(todo => todo.trim());
  }
  
  return cleaned;
}

/**
 * Validate ID for update/completion operations
 * 
 * Ensures that IDs used for identifying existing items are valid.
 * 
 * @param {string} id - The ID to validate
 * @param {string} itemType - Type of item (for error messages)
 * @returns {string} - Cleaned ID
 * @throws {Error} - Validation error
 */
export function validateItemId(id, itemType = 'item') {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    throw new Error(`${itemType} ID is required and must be a non-empty string`);
  }
  
  const cleanId = id.trim();
  
  // Basic length check (Things IDs are typically reasonable length)
  if (cleanId.length > 1000) {
    throw new Error(`${itemType} ID is too long (max 1000 characters)`);
  }
  
  return cleanId;
}

/**
 * Validate search query
 * 
 * Ensures search queries are valid and not empty.
 * 
 * @param {string} query - The search query to validate
 * @returns {string} - Cleaned query
 * @throws {Error} - Validation error
 */
export function validateSearchQuery(query) {
  if (!query || typeof query !== 'string' || query.trim() === '') {
    throw new Error('Search query is required and must be a non-empty string');
  }
  
  const cleanQuery = query.trim();
  
  // Reasonable length limit for search queries
  if (cleanQuery.length > 500) {
    throw new Error('Search query is too long (max 500 characters)');
  }
  
  return cleanQuery;
}

/**
 * Validate batch operation parameters
 * 
 * Ensures batch operations have reasonable limits and valid data.
 * 
 * @param {Array} items - Array of items for batch operation
 * @param {string} operationType - Type of operation (for error messages)
 * @param {number} maxItems - Maximum allowed items
 * @returns {Array} - Validated items array
 * @throws {Error} - Validation error
 */
export function validateBatchItems(items, operationType = 'batch operation', maxItems = 50) {
  if (!Array.isArray(items)) {
    throw new Error(`${operationType} requires an array of items`);
  }
  
  if (items.length === 0) {
    throw new Error(`${operationType} requires at least one item`);
  }
  
  if (items.length > maxItems) {
    throw new Error(`${operationType} supports a maximum of ${maxItems} items at once. ` +
                   `Please split your request into smaller batches.`);
  }
  
  return items;
}

/**
 * Validate Things list ID for show operations
 * 
 * Ensures list IDs are valid Things list identifiers.
 * 
 * @param {string} listId - The list ID to validate
 * @returns {string} - Validated list ID
 * @throws {Error} - Validation error
 */
export function validateListId(listId) {
  if (!listId || typeof listId !== 'string' || listId.trim() === '') {
    throw new Error('List ID is required');
  }
  
  const validListIds = [
    'today', 'inbox', 'upcoming', 'anytime', 'someday', 
    'projects', 'areas', 'logbook'
  ];
  
  const cleanListId = listId.trim().toLowerCase();
  
  if (!validListIds.includes(cleanListId)) {
    throw new Error(`Invalid list ID. Must be one of: ${validListIds.join(', ')}`);
  }
  
  return cleanListId;
}