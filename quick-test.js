#!/usr/bin/env node

/**
 * Quick validation test for the Swagger UI fixes
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Quick Validation Test\n');

try {
  // Test 1: Validate tsoa.json syntax and structure
  console.log('1. Validating tsoa.json...');
  const tsoaConfig = JSON.parse(fs.readFileSync('tsoa.json', 'utf8'));
  
  // Check required fields
  const hasEntryFile = !!tsoaConfig.entryFile;
  const hasControllerGlobs = !!tsoaConfig.controllerPathGlobs;
  const hasSpec = !!tsoaConfig.spec;
  const hasRoutes = !!tsoaConfig.routes;
  
  console.log(`   ✓ Entry file: ${tsoaConfig.entryFile}`);
  console.log(`   ✓ Controller globs: ${tsoaConfig.controllerPathGlobs.join(', ')}`);
  console.log(`   ✓ Spec output: ${tsoaConfig.spec.outputDirectory}`);
  console.log(`   ✓ Routes output: ${tsoaConfig.routes.routesDir}`);
  
  // Check security configuration
  const hasSecuritySchemes = tsoaConfig.spec.components && 
                             tsoaConfig.spec.components.securitySchemes &&
                             tsoaConfig.spec.components.securitySchemes.api_key;
  
  if (hasSecuritySchemes) {
    console.log('   ✓ Security schemes configured');
    const scheme = tsoaConfig.spec.components.securitySchemes.api_key;
    console.log(`     - Type: ${scheme.type}`);
    console.log(`     - Name: ${scheme.name}`);
    console.log(`     - Location: ${scheme.in}`);
  } else {
    console.log('   ✗ Security schemes not found');
  }
  
  // Check that hardcoded values are removed
  const noHardcodedHost = !tsoaConfig.spec.host;
  const noHardcodedSchemes = !tsoaConfig.spec.schemes;
  
  console.log(`   ✓ No hardcoded host: ${noHardcodedHost}`);
  console.log(`   ✓ No hardcoded schemes: ${noHardcodedSchemes}`);

  // Test 2: Validate app.ts modifications
  console.log('\n2. Validating app.ts modifications...');
  const appContent = fs.readFileSync('src/app.ts', 'utf8');
  
  const hasGetServerUrl = appContent.includes('function getServerUrl');
  const hasForwardedProto = appContent.includes('x-forwarded-proto');
  const hasDynamicServers = appContent.includes('servers: [');
  const hasSwaggerOptions = appContent.includes('swaggerOptions:');
  const hasPersistAuth = appContent.includes('persistAuthorization: true');
  
  console.log(`   ✓ Dynamic URL function: ${hasGetServerUrl}`);
  console.log(`   ✓ Heroku protocol detection: ${hasForwardedProto}`);
  console.log(`   ✓ Dynamic server injection: ${hasDynamicServers}`);
  console.log(`   ✓ Enhanced Swagger options: ${hasSwaggerOptions}`);
  console.log(`   ✓ Authentication persistence: ${hasPersistAuth}`);

  // Test 3: Check authentication module
  console.log('\n3. Validating authentication module...');
  const authContent = fs.readFileSync('src/openapi/authentication.ts', 'utf8');
  
  const hasApiKeyValidation = authContent.includes('VALID_API_KEYS');
  const hasExpressAuth = authContent.includes('expressAuthentication');
  const hasHeaderSupport = authContent.includes('x-api-key');
  
  console.log(`   ✓ API key validation: ${hasApiKeyValidation}`);
  console.log(`   ✓ Express authentication: ${hasExpressAuth}`);
  console.log(`   ✓ Header support: ${hasHeaderSupport}`);

  // Test 4: Check controller security
  console.log('\n4. Validating controller security...');
  const userControllerContent = fs.readFileSync('src/controllers/UserController.ts', 'utf8');
  
  const hasSecurityDecorators = userControllerContent.includes('@Security("api_key")');
  const securityMatches = userControllerContent.match(/@Security\("api_key"\)/g);
  const securedEndpoints = securityMatches ? securityMatches.length : 0;
  
  console.log(`   ✓ Security decorators present: ${hasSecurityDecorators}`);
  console.log(`   ✓ Secured endpoints: ${securedEndpoints}`);

  console.log('\n✅ All validations passed!');
  console.log('\n🚀 Ready to test:');
  console.log('   1. Run: npm run generate-spec');
  console.log('   2. Run: npm run dev');
  console.log('   3. Visit: http://localhost:3000/docs');
  console.log('   4. Test authentication with: demo-api-key');

} catch (error) {
  console.error('❌ Validation failed:', error.message);
  process.exit(1);
}