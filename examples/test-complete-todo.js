#!/usr/bin/env node

/**
 * Test Complete Todo - Manual test for complete_todo functionality
 * 
 * This script demonstrates how to use the ThingsClient to mark to-do items as completed.
 * It's designed for manual testing and verification that the completion operations work correctly.
 * 
 * Run this script with: node examples/test-complete-todo.js
 */

// Import our Things client
import { ThingsClient } from '../src/things-client.js';

/**
 * Main test function
 * 
 * This function demonstrates completing a to-do item.
 * In a real implementation, you would know the ID of the to-do you want to complete.
 */
async function testCompleteTodo() {
  console.log('Testing Things complete_todo functionality...\n');

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
      console.warn('Warning: THINGS_AUTHENTICATION_TOKEN not set. Completion operations require authentication.');
      console.warn('Please set this environment variable to test completion functionality.\n');
      return;
    }

    // Test data for completing a to-do
    // Note: You'll need to replace 'test-todo-id' with an actual to-do ID from your Things app
    const completeData = {
      id: 'test-todo-id' // Replace this with a real to-do ID
    };

    console.log('Attempting to complete to-do with data:');
    console.log(JSON.stringify(completeData, null, 2));
    console.log('');

    // Execute the complete command
    console.log('Executing complete command...');
    const success = await client.completeTodo(completeData);

    if (success) {
      console.log('✅ SUCCESS: To-do completion command executed successfully!');
      console.log('Check your Things app to verify the to-do has been marked as completed.');
    } else {
      console.log('❌ FAILED: To-do completion command failed to execute.');
    }

  } catch (error) {
    console.error('❌ ERROR during test:', error.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Make sure Things app is installed and running on macOS');
    console.error('2. Set THINGS_AUTHENTICATION_TOKEN environment variable');
    console.error('3. Replace "test-todo-id" with a real to-do ID from your Things app');
    console.error('4. Ensure the to-do with that ID exists and is not already completed');
  }
}

// Run the test
testCompleteTodo();