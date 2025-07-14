#!/usr/bin/env node

/**
 * Test Batch Operations - Manual test for batch functionality
 * 
 * This script demonstrates how to use the ThingsClient for batch operations.
 * It shows how to create multiple to-dos at once and perform other batch operations.
 * 
 * Run this script with: node examples/test-batch-operations.js
 */

// Import our Things client
import { ThingsClient } from '../src/things-client.js';

/**
 * Main test function
 * 
 * This function demonstrates batch operations for creating and managing multiple items.
 */
async function testBatchOperations() {
  console.log('Testing Things batch operations...\n');

  try {
    // Create a ThingsClient instance
    const client = new ThingsClient();

    // Check if we're in the right environment
    if (!client.isThingsAvailable()) {
      throw new Error('Things app is not available. Make sure you\'re running on macOS.');
    }

    // Check for authentication token
    if (!process.env.THINGS_AUTHENTICATION_TOKEN) {
      console.warn('Warning: THINGS_AUTHENTICATION_TOKEN not set. Batch operations require authentication.');
      console.warn('Please set this environment variable to test batch functionality.\n');
      return;
    }

    console.log('Testing Batch Add Todos...');
    console.log('=' .repeat(40));

    // Test batch add todos
    const testTodos = [
      {
        title: 'Batch Test Todo 1',
        notes: 'This is the first todo created via batch operation',
        tags: 'batch, test, mcp',
        when: 'today'
      },
      {
        title: 'Batch Test Todo 2',
        notes: 'This is the second todo created via batch operation',
        tags: 'batch, test, mcp',
        when: 'tomorrow'
      },
      {
        title: 'Batch Test Todo 3',
        notes: 'This is the third todo created via batch operation',
        tags: 'batch, test, mcp',
        when: 'anytime'
      }
    ];

    console.log(`Creating ${testTodos.length} todos in batch...`);
    
    // Simulate the batch_add_todos tool
    let successCount = 0;
    let failureCount = 0;
    const results = [];

    for (let i = 0; i < testTodos.length; i++) {
      const todo = testTodos[i];
      
      try {
        const success = await client.addTodo(todo);
        
        if (success) {
          results.push(`✅ Todo ${i + 1}: "${todo.title}" - Created successfully`);
          successCount++;
        } else {
          results.push(`❌ Todo ${i + 1}: "${todo.title}" - Failed to create`);
          failureCount++;
        }
        
        // Small delay between operations
        if (i < testTodos.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (error) {
        results.push(`❌ Todo ${i + 1}: "${todo.title}" - Error: ${error.message}`);
        failureCount++;
      }
    }

    // Display batch results
    console.log(`\nBatch add completed: ${successCount} successful, ${failureCount} failed`);
    console.log('\nDetailed Results:');
    results.forEach(result => console.log(result));

    console.log('\n' + '=' .repeat(40));
    console.log('Batch testing completed!');
    console.log('Check your Things app to see the created todos.');
    console.log('\nNote: To test batch completion and updates, you would need specific todo IDs.');
    console.log('The batch operations work by applying the same operation to multiple items efficiently.');

  } catch (error) {
    console.error('❌ ERROR during batch test:', error.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Make sure Things app is installed and running on macOS');
    console.error('2. Set THINGS_AUTHENTICATION_TOKEN environment variable');
    console.error('3. Ensure you have permission to create items in Things');
  }
}

// Run the test
testBatchOperations();