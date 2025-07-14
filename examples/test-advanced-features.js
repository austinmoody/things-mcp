#!/usr/bin/env node

/**
 * Test Advanced Features - Manual test for v1.4 advanced functionality
 * 
 * This script demonstrates the advanced features introduced in v1.4,
 * including JSON commands, x-callback-url support, and data retrieval.
 * 
 * Run this script with: node examples/test-advanced-features.js
 */

// Import our Things client
import { ThingsClient } from '../src/things-client.js';

/**
 * Main test function
 * 
 * This function demonstrates the advanced v1.4 features including
 * JSON commands and data retrieval capabilities.
 */
async function testAdvancedFeatures() {
  console.log('Testing Things v1.4 advanced features...\n');

  try {
    // Create a ThingsClient instance
    const client = new ThingsClient();

    // Check if we're in the right environment
    if (!client.isThingsAvailable()) {
      throw new Error('Things app is not available. Make sure you\'re running on macOS.');
    }

    console.log('Testing Advanced v1.4 Features:');
    console.log('=' .repeat(50));

    // Test JSON Commands
    console.log('\n1. Testing JSON Commands:');
    console.log('-' .repeat(30));

    const jsonCommandTests = [
      {
        name: 'Create Workspace Command',
        commandType: 'create_workspace',
        payload: {
          name: 'Development Workspace',
          projects: [
            {
              title: 'Frontend Development',
              todos: ['Setup React app', 'Create components', 'Add styling']
            },
            {
              title: 'Backend Development', 
              todos: ['Setup API server', 'Create endpoints', 'Add database']
            }
          ]
        }
      },
      {
        name: 'Bulk Import Command',
        commandType: 'bulk_import',
        payload: {
          source: 'csv',
          data: [
            { title: 'Task 1', area: 'Work', tags: 'important' },
            { title: 'Task 2', area: 'Personal', tags: 'home' },
            { title: 'Task 3', area: 'Work', tags: 'meeting' }
          ]
        }
      },
      {
        name: 'Project Hierarchy Command',
        commandType: 'project_hierarchy',
        payload: {
          rootProject: 'Main Project',
          subProjects: [
            {
              title: 'Phase 1',
              todos: ['Planning', 'Research', 'Analysis']
            },
            {
              title: 'Phase 2',
              todos: ['Implementation', 'Testing', 'Review']
            }
          ]
        }
      }
    ];

    for (const test of jsonCommandTests) {
      try {
        console.log(`\n${test.name}:`);
        console.log(`Command Type: ${test.commandType}`);
        console.log(`Payload: ${JSON.stringify(test.payload, null, 2).substring(0, 100)}...`);
        
        const success = await client.executeJsonCommand(test.commandType, test.payload);
        
        if (success) {
          console.log(`✅ SUCCESS: JSON command executed successfully`);
        } else {
          console.log(`❌ FAILED: JSON command failed to execute`);
        }
        
      } catch (error) {
        console.log(`❌ ERROR: ${test.name} failed - ${error.message}`);
      }
    }

    // Test Filtered View Navigation (since Things doesn't support data retrieval)
    console.log('\n\n2. Testing Filtered View Navigation:');
    console.log('-' .repeat(30));

    const viewNavigationTests = [
      {
        name: 'Navigate to Today View',
        view_type: 'today'
      },
      {
        name: 'Navigate to Projects View',
        view_type: 'projects'
      },
      {
        name: 'Show Specific Item by ID',
        view_type: 'today',
        item_id: 'example-item-id-123'
      },
      {
        name: 'Search and Navigate',
        view_type: 'inbox',
        search_query: 'important tasks'
      }
    ];

    for (const test of viewNavigationTests) {
      try {
        console.log(`\n${test.name}:`);
        console.log(`View Type: ${test.view_type}`);
        
        if (test.item_id) {
          console.log(`Item ID: ${test.item_id}`);
        }
        if (test.search_query) {
          console.log(`Search Query: ${test.search_query}`);
        }
        
        const success = await client.showSpecificItem(test.item_id || test.view_type);
        
        if (success) {
          console.log(`✅ SUCCESS: View navigation executed successfully`);
          console.log(`   Note: Things URL scheme doesn't support data retrieval`);
        } else {
          console.log(`❌ FAILED: View navigation failed`);
        }
        
      } catch (error) {
        console.log(`❌ ERROR: ${test.name} failed - ${error.message}`);
      }
    }

    // Note about Export/Import Operations
    console.log('\n\n3. Export/Import Limitations:');
    console.log('-' .repeat(30));
    
    console.log('\n⚠️  Important Note about Data Operations:');
    console.log('Things URL scheme does NOT support:');
    console.log('• Data export operations');
    console.log('• Data import operations'); 
    console.log('• Data retrieval/reading operations');
    console.log('');
    console.log('The URL scheme is designed for:');
    console.log('• Creating new items (add, add-project)');
    console.log('• Updating existing items (update, update-project)');
    console.log('• Navigation (show, search)');
    console.log('• Complex operations via JSON commands');
    console.log('');
    console.log('For data export/import, use:');
    console.log('• Things app menu: File > Export');
    console.log('• Things app menu: File > Import');
    console.log('• Third-party sync services supported by Things');

    console.log('\n' + '=' .repeat(50));
    console.log('Advanced features testing completed!');
    console.log('\nImportant Notes:');
    console.log('• JSON commands are conceptual - Things may not support all features directly');
    console.log('• x-callback-url data retrieval requires Things app support');
    console.log('• Export/Import operations depend on Things URL scheme capabilities');
    console.log('• Some features may open Things app without executing the full operation');

  } catch (error) {
    console.error('❌ ERROR during advanced features test:', error.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Make sure Things app is installed and running on macOS');
    console.error('2. These are advanced/experimental features that may not be fully supported');
    console.error('3. Check Things app documentation for URL scheme support');
  }
}

// Run the test
testAdvancedFeatures();