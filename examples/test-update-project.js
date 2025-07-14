#!/usr/bin/env node

/**
 * Test Update Project - Manual test for update_project functionality
 * 
 * This script demonstrates how to use the ThingsClient to update existing projects.
 * It's designed for manual testing and verification that the update operations work correctly.
 * 
 * Run this script with: node examples/test-update-project.js
 */

// Import our Things client
import { ThingsClient } from '../src/things-client.js';

/**
 * Main test function
 * 
 * This function demonstrates updating a project with various properties.
 * In a real implementation, you would know the ID of the project you want to update.
 */
async function testUpdateProject() {
  console.log('Testing Things update_project functionality...\n');

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

    // Test data for updating a project
    // Note: You'll need to replace 'test-project-id' with an actual project ID from your Things app
    const updateData = {
      id: 'test-project-id', // Replace this with a real project ID
      title: 'Updated Project Title',
      notes: 'This project has been updated via the MCP server',
      tags: 'mcp, testing, updated',
      when: 'anytime',
      deadline: '2024-12-31'
    };

    console.log('Attempting to update project with data:');
    console.log(JSON.stringify(updateData, null, 2));
    console.log('');

    // Execute the update command
    console.log('Executing update command...');
    const success = await client.updateProject(updateData);

    if (success) {
      console.log('✅ SUCCESS: Project update command executed successfully!');
      console.log('Check your Things app to verify the changes were applied.');
    } else {
      console.log('❌ FAILED: Project update command failed to execute.');
    }

  } catch (error) {
    console.error('❌ ERROR during test:', error.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Make sure Things app is installed and running on macOS');
    console.error('2. Set THINGS_AUTHENTICATION_TOKEN environment variable');
    console.error('3. Replace "test-project-id" with a real project ID from your Things app');
    console.error('4. Ensure the project with that ID exists in Things');
  }
}

// Run the test
testUpdateProject();