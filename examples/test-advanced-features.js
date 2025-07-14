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

    // Test Data Retrieval (x-callback-url simulation)
    console.log('\n\n2. Testing Data Retrieval:');
    console.log('-' .repeat(30));

    const dataRetrievalTests = [
      {
        name: 'Get All Projects',
        dataType: 'projects',
        filter: { status: 'open' },
        format: 'json'
      },
      {
        name: 'Get Today\'s Todos',
        dataType: 'todos',
        filter: { 
          status: 'open',
          date_range: {
            start: new Date().toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0]
          }
        },
        format: 'json'
      },
      {
        name: 'Get Work Area Items',
        dataType: 'todos',
        filter: { area: 'Work' },
        format: 'markdown'
      },
      {
        name: 'Get Tagged Items',
        dataType: 'todos',
        filter: { tag: 'important' },
        format: 'csv'
      }
    ];

    for (const test of dataRetrievalTests) {
      try {
        console.log(`\n${test.name}:`);
        console.log(`Data Type: ${test.dataType}`);
        console.log(`Format: ${test.format}`);
        
        if (test.filter) {
          const filterStr = Object.entries(test.filter)
            .map(([key, value]) => `${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`)
            .join(', ');
          console.log(`Filters: ${filterStr}`);
        }
        
        const success = await client.getThingsData(test.dataType, test.filter, null, test.format);
        
        if (success) {
          console.log(`✅ SUCCESS: Data retrieval request sent successfully`);
          console.log(`   Note: Actual data would be returned via x-callback-url`);
        } else {
          console.log(`❌ FAILED: Data retrieval request failed`);
        }
        
      } catch (error) {
        console.log(`❌ ERROR: ${test.name} failed - ${error.message}`);
      }
    }

    // Test Export/Import Operations
    console.log('\n\n3. Testing Export/Import Operations:');
    console.log('-' .repeat(30));

    try {
      console.log('\nTesting Export Operation:');
      const exportOptions = {
        format: 'json',
        include: ['todos', 'projects', 'areas'],
        path: '/tmp/things-backup.json'
      };
      
      console.log(`Export Format: ${exportOptions.format}`);
      console.log(`Export Path: ${exportOptions.path}`);
      console.log(`Include: ${exportOptions.include.join(', ')}`);
      
      const exportSuccess = await client.exportThingsData(exportOptions);
      
      if (exportSuccess) {
        console.log(`✅ SUCCESS: Export operation initiated`);
      } else {
        console.log(`❌ FAILED: Export operation failed`);
      }
      
    } catch (error) {
      console.log(`❌ ERROR: Export operation failed - ${error.message}`);
    }

    try {
      console.log('\nTesting Import Operation:');
      const importOptions = {
        source: 'json',
        data: JSON.stringify([
          { title: 'Imported Task 1', area: 'Imported' },
          { title: 'Imported Task 2', area: 'Imported' }
        ]),
        mapping: { title: 'name', area: 'category' }
      };
      
      console.log(`Import Source: ${importOptions.source}`);
      console.log(`Data Items: 2 tasks`);
      console.log(`Field Mapping: title->name, area->category`);
      
      const importSuccess = await client.importThingsData(importOptions);
      
      if (importSuccess) {
        console.log(`✅ SUCCESS: Import operation initiated`);
      } else {
        console.log(`❌ FAILED: Import operation failed`);
      }
      
    } catch (error) {
      console.log(`❌ ERROR: Import operation failed - ${error.message}`);
    }

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