/**
 * Simple CORS test script to verify cross-domain functionality
 * This script can be run to test if the CORS configuration is working properly
 */

const http = require('http');

// Test configuration
const API_BASE_URL = 'http://localhost:3000';
const TEST_ENDPOINTS = [
  '/health',
  '/swagger.json',
  '/docs',
  '/api/users'
];

/**
 * Make a test request to check CORS headers
 */
function testCorsHeaders(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint,
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://example.com',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    };

    const req = http.request(options, (res) => {
      const headers = res.headers;
      const corsHeaders = {
        'access-control-allow-origin': headers['access-control-allow-origin'],
        'access-control-allow-methods': headers['access-control-allow-methods'],
        'access-control-allow-headers': headers['access-control-allow-headers'],
        'access-control-allow-credentials': headers['access-control-allow-credentials'],
        'access-control-max-age': headers['access-control-max-age']
      };

      resolve({
        endpoint,
        statusCode: res.statusCode,
        corsHeaders
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

/**
 * Run CORS tests
 */
async function runCorsTests() {
  console.log('🧪 Testing CORS Configuration...\n');
  
  try {
    for (const endpoint of TEST_ENDPOINTS) {
      console.log(`Testing ${endpoint}...`);
      
      try {
        const result = await testCorsHeaders(endpoint);
        
        console.log(`✅ Status: ${result.statusCode}`);
        console.log(`   Origin: ${result.corsHeaders['access-control-allow-origin']}`);
        console.log(`   Methods: ${result.corsHeaders['access-control-allow-methods']}`);
        console.log(`   Headers: ${result.corsHeaders['access-control-allow-headers']}`);
        console.log(`   Credentials: ${result.corsHeaders['access-control-allow-credentials']}`);
        console.log(`   Max-Age: ${result.corsHeaders['access-control-max-age']}`);
        
        // Validate CORS headers
        const isValidCors = 
          result.corsHeaders['access-control-allow-origin'] === '*' &&
          result.corsHeaders['access-control-allow-methods']?.includes('GET') &&
          result.corsHeaders['access-control-allow-headers']?.includes('Content-Type');
        
        if (isValidCors) {
          console.log('   ✅ CORS headers are properly configured');
        } else {
          console.log('   ❌ CORS headers may be missing or incorrect');
        }
        
      } catch (error) {
        console.log(`   ❌ Error testing ${endpoint}: ${error.message}`);
      }
      
      console.log('');
    }
    
    console.log('🎉 CORS testing completed!');
    console.log('\n📋 Summary:');
    console.log('- If all endpoints show "✅ CORS headers are properly configured", your API should work with Swagger UI from different domains');
    console.log('- If any endpoint shows "❌", review the CORS configuration for that specific route');
    console.log('\n🔧 To test with a real browser:');
    console.log('1. Start your API server: npm run dev');
    console.log('2. Open Swagger UI from a different domain');
    console.log('3. Try the "Try it out" functionality on various endpoints');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure your API server is running on port 3000');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runCorsTests();
}

module.exports = { testCorsHeaders, runCorsTests };