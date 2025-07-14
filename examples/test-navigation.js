#!/usr/bin/env node

/**
 * Test Navigation Tools - Manual test for all navigation functionality
 * 
 * This script demonstrates how to use the ThingsClient to navigate to different
 * views in the Things app. It tests all the available show commands.
 * 
 * Run this script with: node examples/test-navigation.js
 */

// Import our Things client
import { ThingsClient } from '../src/things-client.js';

/**
 * Main test function
 * 
 * This function demonstrates all the navigation tools available in the MCP server.
 */
async function testNavigationTools() {
  console.log('Testing Things navigation tools...\n');

  try {
    // Create a ThingsClient instance
    const client = new ThingsClient();

    // Check if we're in the right environment
    if (!client.isThingsAvailable()) {
      throw new Error('Things app is not available. Make sure you\'re running on macOS.');
    }

    // Test all navigation commands
    const navigationTests = [
      { name: 'Today List', id: 'today' },
      { name: 'Inbox', id: 'inbox' },
      { name: 'Upcoming', id: 'upcoming' },
      { name: 'Anytime', id: 'anytime' },
      { name: 'Someday', id: 'someday' },
      { name: 'Projects', id: 'projects' },
      { name: 'Areas', id: 'areas' },
      { name: 'Logbook', id: 'logbook' }
    ];

    console.log('Testing navigation to different Things views:');
    console.log('=' .repeat(50));

    for (const test of navigationTests) {
      try {
        console.log(`\nNavigating to ${test.name}...`);
        const success = await client.showList(test.id);
        
        if (success) {
          console.log(`✅ SUCCESS: Opened ${test.name} view`);
        } else {
          console.log(`❌ FAILED: Could not open ${test.name} view`);
        }
        
        // Small delay between navigation commands to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.log(`❌ ERROR: Failed to open ${test.name} - ${error.message}`);
      }
    }

    console.log('\n' + '=' .repeat(50));
    console.log('Navigation testing completed!');
    console.log('Check your Things app to see if the final view opened correctly.');

  } catch (error) {
    console.error('❌ ERROR during navigation test:', error.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Make sure Things app is installed and running on macOS');
    console.error('2. Grant permission for the script to open URLs if prompted');
    console.error('3. Ensure Things app can be opened manually');
  }
}

// Run the test
testNavigationTools();