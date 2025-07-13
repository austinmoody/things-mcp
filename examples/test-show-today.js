#!/usr/bin/env node

/**
 * Manual Test Script for Things MCP Server - Show Today List
 * 
 * This script demonstrates how to manually test the show_today_list functionality
 * without needing a full MCP client setup. It directly imports and uses our
 * Things client to verify the basic functionality works.
 * 
 * Run this script with: node examples/test-show-today.js
 */

// Import our Things client class
import { ThingsClient } from '../src/things-client.js';

/**
 * Main test function
 * 
 * This function tests the Things client functionality by attempting
 * to open the Today list in the Things app.
 */
async function testShowTodayList() {
  console.log('🧪 Testing Things MCP Server - Show Today List');
  console.log('===============================================');
  
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
    
    // Test the show today list functionality
    console.log('🎯 Testing show today list command...');
    const result = await thingsClient.showTodayList();
    
    if (result) {
      console.log('✅ Successfully executed show today list command');
      console.log('📅 Things app should now be showing the Today list');
    } else {
      console.error('❌ Show today list command failed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('- Make sure you are running on macOS');
    console.log('- Make sure Things app is installed');
    console.log('- Make sure URL scheme permissions are granted');
    console.log('- Check that Things app is not already running and stuck');
    process.exit(1);
  }
  
  console.log('\n🎉 Test completed successfully!');
  console.log('💡 If Things opened to the Today list, the integration is working correctly');
}

/**
 * Run the test if this script is executed directly
 * 
 * This is a common Node.js pattern to make scripts both importable and executable.
 * The import.meta.url check ensures this only runs when the file is executed directly.
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  testShowTodayList().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}