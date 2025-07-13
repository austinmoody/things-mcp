#!/usr/bin/env node

/**
 * Manual Test Script for Things MCP Server - Add Todo
 * 
 * This script demonstrates how to test the add_todo functionality
 * directly using our Things client.
 * 
 * Run this script with: node examples/test-add-todo.js
 */

import { ThingsClient } from '../src/things-client.js';

/**
 * Test the add todo functionality
 */
async function testAddTodo() {
  console.log('🧪 Testing Things MCP Server - Add Todo');
  console.log('=========================================');
  
  try {
    // Create a new Things client instance
    console.log('📱 Creating Things client...');
    const thingsClient = new ThingsClient();
    
    // Check if Things is available
    console.log('🔍 Checking if Things app is available...');
    const isAvailable = thingsClient.isThingsAvailable();
    
    if (!isAvailable) {
      console.error('❌ Things app is not available on this system');
      console.log('💡 Make sure you are running this on macOS with Things installed');
      process.exit(1);
    }
    
    console.log('✅ Things app appears to be available');
    
    // Test adding a simple todo
    console.log('📝 Testing add todo command...');
    const todoData = {
      title: 'Test Todo from MCP Server',
      notes: 'This is a test todo created by the Things MCP Server',
      when: 'today',
      tags: 'test,mcp'
    };
    
    const result = await thingsClient.addTodo(todoData);
    
    if (result) {
      console.log('✅ Successfully executed add todo command');
      console.log(`📋 Created todo: "${todoData.title}"`);
    } else {
      console.error('❌ Add todo command failed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('- Make sure you are running on macOS');
    console.log('- Make sure Things app is installed');
    console.log('- Check that THINGS_AUTHENTICATION_TOKEN is set if required');
    console.log('- Verify Things app can be opened manually');
    process.exit(1);
  }
  
  console.log('\n🎉 Test completed successfully!');
  console.log('💡 Check Things app to verify the todo was created');
}

/**
 * Run the test if this script is executed directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  testAddTodo().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}