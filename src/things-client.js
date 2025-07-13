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
      
      // Add authentication token if available and not a simple show command
      // Show commands typically don't require authentication
      if (this.authToken && command !== 'show') {
        url.searchParams.set('auth-token', this.authToken);
      }
      
      // Add all other parameters
      // Object.entries() gives us an array of [key, value] pairs
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Convert value to string and add to URL parameters
          url.searchParams.set(key, String(value));
        }
      });
      
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