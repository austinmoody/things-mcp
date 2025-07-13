#!/usr/bin/env node

/**
 * Manual Test Script for Things MCP Server - Search
 * 
 * This script demonstrates how to test the search functionality
 * directly using our Things client.
 * 
 * Run this script with: node examples/test-search.js
 */

import { ThingsClient } from '../src/things-client.js';

/**
 * Test the search functionality
 */
async function testSearch() {
  console.log('🧪 Testing Things MCP Server - Search');
  console.log('=====================================');
  
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
    
    // Test search functionality
    console.log('🔎 Testing search command...');
    const searchQuery = 'test';
    
    const result = await thingsClient.search(searchQuery);
    
    if (result) {
      console.log('✅ Successfully executed search command');
      console.log(`🔍 Searched for: "${searchQuery}"`);
      console.log('📱 Things app should now be showing search results');
    } else {
      console.error('❌ Search command failed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('- Make sure you are running on macOS');
    console.log('- Make sure Things app is installed');
    console.log('- Verify Things app can be opened manually');
    console.log('- Try a different search query');
    process.exit(1);
  }
  
  console.log('\n🎉 Test completed successfully!');
  console.log('💡 Check Things app to see the search results');
}

/**
 * Run the test if this script is executed directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  testSearch().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}