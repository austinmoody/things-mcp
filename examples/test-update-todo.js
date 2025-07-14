#!/usr/bin/env node

/**
 * Test Update Todo - Manual test for update_todo functionality
 * 
 * This script demonstrates how to use the ThingsClient to update existing to-do items.
 * It's designed for manual testing and verification that the update operations work correctly.
 * 
 * Run this script with: node examples/test-update-todo.js
 */

// Import our Things client
import { ThingsClient } from '../src/things-client.js';

/**
 * Main test function
 * 
 * This function demonstrates updating a to-do item with various properties.
 * In a real implementation, you would know the ID of the to-do you want to update.
 */
async function testUpdateTodo() {
  console.log('Testing Things update_todo functionality...\n');

  try {
    // Create a ThingsClient instance
    // This handles all the URL scheme communication with Things
    const client = new ThingsClient();

    // Check if we're in the right environment
    if (!client.isThingsAvailable()) {
      throw new Error('Things app is not available. Make sure you\'re running on macOS.');
    }

    // Check for authentication token
    if (!process.env.THINGS_AUTHENTICATION_TOKEN) {
      console.warn('Warning: THINGS_AUTHENTICATION_TOKEN not set. Update operations require authentication.');
      console.warn('Please set this environment variable to test update functionality.\n');
      return;
    }

    // Test data for updating a to-do
    // Note: You'll need to replace 'test-todo-id' with an actual to-do ID from your Things app
    const updateData = {
      id: 'test-todo-id', // Replace this with a real to-do ID
      title: 'Updated Todo Title',
      notes: 'This todo has been updated via the MCP server',
      tags: 'mcp, testing, updated',
      when: 'today'
    };

    console.log('Attempting to update to-do with data:');
    console.log(JSON.stringify(updateData, null, 2));
    console.log('');

    // Execute the update command
    console.log('Executing update command...');
    const success = await client.updateTodo(updateData);

    if (success) {
      console.log('✅ SUCCESS: To-do update command executed successfully!');
      console.log('Check your Things app to verify the changes were applied.');
    } else {
      console.log('❌ FAILED: To-do update command failed to execute.');
    }

  } catch (error) {
    console.error('❌ ERROR during test:', error.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Make sure Things app is installed and running on macOS');
    console.error('2. Set THINGS_AUTHENTICATION_TOKEN environment variable');
    console.error('3. Replace "test-todo-id" with a real to-do ID from your Things app');
    console.error('4. Ensure the to-do with that ID exists in Things');
  }
}

// Run the test
testUpdateTodo();