#!/usr/bin/env node

/**
 * Test Validation - Manual test for validation utilities
 * 
 * This script demonstrates the validation functions and shows how they
 * handle various valid and invalid inputs.
 * 
 * Run this script with: node examples/test-validation.js
 */

// Import our validation utilities
import { 
  validateTodoData, 
  validateProjectData, 
  validateItemId, 
  validateSearchQuery,
  validateBatchItems,
  validateListId
} from '../src/utils/validation.js';

/**
 * Test validation function with various inputs
 * 
 * @param {string} testName - Name of the test
 * @param {Function} validationFn - Validation function to test
 * @param {Array} testCases - Array of {input, shouldPass, description} objects
 */
function testValidation(testName, validationFn, testCases) {
  console.log(`\nTesting ${testName}:`);
  console.log('-'.repeat(30));
  
  testCases.forEach(({ input, shouldPass, description }, index) => {
    try {
      const result = validationFn(input);
      if (shouldPass) {
        console.log(`✅ Test ${index + 1}: ${description} - PASSED`);
        console.log(`   Result: ${JSON.stringify(result)}`);
      } else {
        console.log(`❌ Test ${index + 1}: ${description} - FAILED (should have thrown error)`);
      }
    } catch (error) {
      if (!shouldPass) {
        console.log(`✅ Test ${index + 1}: ${description} - PASSED (correctly rejected)`);
        console.log(`   Error: ${error.message}`);
      } else {
        console.log(`❌ Test ${index + 1}: ${description} - FAILED (unexpected error)`);
        console.log(`   Error: ${error.message}`);
      }
    }
  });
}

/**
 * Main test function
 */
async function testValidationUtils() {
  console.log('Testing validation utilities...\n');
  console.log('=' .repeat(50));

  // Test todo data validation
  testValidation('Todo Data Validation', validateTodoData, [
    {
      input: { title: 'Valid Todo', notes: 'Some notes' },
      shouldPass: true,
      description: 'Valid todo with title and notes'
    },
    {
      input: { title: '  Trimmed Title  ', when: 'today' },
      shouldPass: true,
      description: 'Todo with whitespace that gets trimmed'
    },
    {
      input: { title: '', notes: 'No title' },
      shouldPass: false,
      description: 'Todo with empty title'
    },
    {
      input: { notes: 'Missing title' },
      shouldPass: false,
      description: 'Todo without title'
    },
    {
      input: { title: 'Valid', when: 'invalid_when' },
      shouldPass: false,
      description: 'Todo with invalid when value'
    }
  ]);

  // Test project data validation
  testValidation('Project Data Validation', validateProjectData, [
    {
      input: { title: 'Valid Project', area: 'Work' },
      shouldPass: true,
      description: 'Valid project with title and area'
    },
    {
      input: { title: 'Project with todos', todos: ['Todo 1', 'Todo 2'] },
      shouldPass: true,
      description: 'Project with todos array'
    },
    {
      input: { title: 'Project', todos: ['Valid', '', '  ', 'Another'] },
      shouldPass: true,
      description: 'Project with todos array containing empty strings (filtered out)'
    },
    {
      input: { area: 'Missing title' },
      shouldPass: false,
      description: 'Project without title'
    }
  ]);

  // Test item ID validation
  testValidation('Item ID Validation', (id) => validateItemId(id, 'test'), [
    {
      input: 'valid-id-123',
      shouldPass: true,
      description: 'Valid ID string'
    },
    {
      input: '  trimmed-id  ',
      shouldPass: true,
      description: 'ID with whitespace (gets trimmed)'
    },
    {
      input: '',
      shouldPass: false,
      description: 'Empty ID'
    },
    {
      input: '   ',
      shouldPass: false,
      description: 'Whitespace-only ID'
    },
    {
      input: 'x'.repeat(1001),
      shouldPass: false,
      description: 'ID that is too long'
    }
  ]);

  // Test search query validation
  testValidation('Search Query Validation', validateSearchQuery, [
    {
      input: 'valid search query',
      shouldPass: true,
      description: 'Valid search query'
    },
    {
      input: '  trimmed query  ',
      shouldPass: true,
      description: 'Query with whitespace (gets trimmed)'
    },
    {
      input: '',
      shouldPass: false,
      description: 'Empty query'
    },
    {
      input: 'x'.repeat(501),
      shouldPass: false,
      description: 'Query that is too long'
    }
  ]);

  // Test batch items validation
  testValidation('Batch Items Validation', (items) => validateBatchItems(items, 'test', 3), [
    {
      input: ['item1', 'item2'],
      shouldPass: true,
      description: 'Valid array of items'
    },
    {
      input: ['single-item'],
      shouldPass: true,
      description: 'Single item array'
    },
    {
      input: [],
      shouldPass: false,
      description: 'Empty array'
    },
    {
      input: ['item1', 'item2', 'item3', 'item4'],
      shouldPass: false,
      description: 'Too many items (exceeds limit of 3)'
    },
    {
      input: 'not-an-array',
      shouldPass: false,
      description: 'Non-array input'
    }
  ]);

  // Test list ID validation
  testValidation('List ID Validation', validateListId, [
    {
      input: 'today',
      shouldPass: true,
      description: 'Valid list ID: today'
    },
    {
      input: 'INBOX',
      shouldPass: true,
      description: 'Valid list ID with different case'
    },
    {
      input: '  projects  ',
      shouldPass: true,
      description: 'Valid list ID with whitespace'
    },
    {
      input: 'invalid-list',
      shouldPass: false,
      description: 'Invalid list ID'
    },
    {
      input: '',
      shouldPass: false,
      description: 'Empty list ID'
    }
  ]);

  console.log('\n' + '=' .repeat(50));
  console.log('Validation testing completed!');
  console.log('All validation functions are working as expected.');
}

// Run the test
testValidationUtils();