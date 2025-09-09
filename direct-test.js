#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Direct test of tsoa generation...');

// Check current tsoa.json
console.log('\n1. Current tsoa.json security config:');
const tsoa = JSON.parse(fs.readFileSync('tsoa.json', 'utf8'));
if (tsoa.spec?.components?.securitySchemes) {
  console.log('✅ Security schemes configured:');
  console.log(JSON.stringify(tsoa.spec.components.securitySchemes, null, 2));
} else {
  console.log('❌ No security schemes configured');
}

// Create directories
console.log('\n2. Creating directories...');
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
  console.log('✅ Created dist/');
}
if (!fs.existsSync('src/openapi')) {
  fs.mkdirSync('src/openapi', { recursive: true });
  console.log('✅ Created src/openapi/');
}

// Try generation
console.log('\n3. Attempting tsoa spec generation...');
try {
  const result = execSync('npx tsoa spec', { 
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'pipe']
  });
  console.log('✅ Generation completed');
  console.log('Output:', result);
  
  // Check result
  if (fs.existsSync('dist/swagger.json')) {
    console.log('\n4. Checking generated file...');
    const spec = JSON.parse(fs.readFileSync('dist/swagger.json', 'utf8'));
    
    console.log('OpenAPI version:', spec.openapi);
    console.log('Title:', spec.info?.title);
    
    if (spec.components?.securitySchemes) {
      console.log('\n✅ SUCCESS: Security schemes found in generated spec!');
      console.log(JSON.stringify(spec.components.securitySchemes, null, 2));
    } else {
      console.log('\n❌ PROBLEM: No security schemes in generated spec');
      console.log('Available components:', spec.components ? Object.keys(spec.components) : 'None');
    }
  } else {
    console.log('\n❌ No swagger.json file generated');
  }
  
} catch (error) {
  console.error('\n❌ Generation failed:');
  console.error('Error:', error.message);
  if (error.stdout) console.log('STDOUT:', error.stdout);
  if (error.stderr) console.log('STDERR:', error.stderr);
}