#!/usr/bin/env node

/**
 * Test Advanced Search - Manual test for enhanced search functionality
 * 
 * This script demonstrates how to use the ThingsClient for advanced search
 * with filters and parameters. It shows the enhanced search capabilities
 * introduced in v1.4.
 * 
 * Run this script with: node examples/test-advanced-search.js
 */

// Import our Things client
import { ThingsClient } from '../src/things-client.js';

/**
 * Main test function
 * 
 * This function demonstrates advanced search functionality with various
 * filter combinations and parameters.
 */
async function testAdvancedSearch() {
  console.log('Testing Things advanced search functionality...\n');

  try {
    // Create a ThingsClient instance
    const client = new ThingsClient();

    // Check if we're in the right environment
    if (!client.isThingsAvailable()) {
      throw new Error('Things app is not available. Make sure you\'re running on macOS.');
    }

    console.log('Testing Advanced Search with Various Filters:');
    console.log('=' .repeat(50));

    // Test cases for advanced search
    const searchTests = [
      {
        name: 'Basic Search',
        params: {
          query: 'project'
        }
      },
      {
        name: 'Search with Status Filter',
        params: {
          query: 'meeting',
          status: 'open'
        }
      },
      {
        name: 'Search with Type Filter',
        params: {
          query: 'development',
          type: 'projects'
        }
      },
      {
        name: 'Search with Area Filter',
        params: {
          query: 'task',
          area: 'Work'
        }
      },
      {
        name: 'Search with Tag Filter',
        params: {
          query: 'urgent',
          tag: 'priority'
        }
      },
      {
        name: 'Search with List Filter',
        params: {
          query: 'review',
          list: 'today'
        }
      },
      {
        name: 'Search with Date Range',
        params: {
          query: 'deadline',
          start_date: '2024-01-01',
          end_date: '2024-12-31'
        }
      },
      {
        name: 'Complex Search with Multiple Filters',
        params: {
          query: 'important',
          status: 'open',
          type: 'todos',
          area: 'Work',
          tag: 'urgent',
          limit: 10
        }
      }
    ];

    for (const test of searchTests) {
      try {
        console.log(`\n${test.name}:`);
        console.log(`Query: "${test.params.query}"`);
        
        // Show applied filters
        const filters = Object.keys(test.params).filter(key => key !== 'query');
        if (filters.length > 0) {
          console.log(`Filters: ${filters.map(f => `${f}=${test.params[f]}`).join(', ')}`);
        }
        
        const success = await client.searchAdvanced(test.params);
        
        if (success) {
          console.log(`✅ SUCCESS: Advanced search executed successfully`);
        } else {
          console.log(`❌ FAILED: Advanced search failed to execute`);
        }
        
        // Small delay between searches
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.log(`❌ ERROR: ${test.name} failed - ${error.message}`);
      }
    }

    console.log('\n' + '=' .repeat(50));
    console.log('Advanced search testing completed!');
    console.log('Check your Things app to see the search results.');
    console.log('\nNote: Advanced search filters depend on Things app support.');
    console.log('Some filters may not be directly supported by the Things URL scheme.');

  } catch (error) {
    console.error('❌ ERROR during advanced search test:', error.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Make sure Things app is installed and running on macOS');
    console.error('2. Ensure you have some data in Things to search');
    console.error('3. Grant permission for the script to open URLs if prompted');
  }
}

// Run the test
testAdvancedSearch();