#!/usr/bin/env node

// Simple test to check if we can read tsoa.json and understand the issue
const fs = require('fs');

console.log('🔍 Simple test...');

// Check tsoa.json
console.log('Reading tsoa.json...');
const tsoa = JSON.parse(fs.readFileSync('tsoa.json', 'utf8'));

console.log('Security schemes in config:');
if (tsoa.spec?.components?.securitySchemes) {
  console.log('✅ Found security schemes:');
  console.log(JSON.stringify(tsoa.spec.components.securitySchemes, null, 2));
} else {
  console.log('❌ No security schemes found');
}

// Check if dist/swagger.json exists
if (fs.existsSync('dist/swagger.json')) {
  console.log('\nReading existing swagger.json...');
  const spec = JSON.parse(fs.readFileSync('dist/swagger.json', 'utf8'));
  
  if (spec.components?.securitySchemes) {
    console.log('✅ Security schemes in generated spec:');
    console.log(JSON.stringify(spec.components.securitySchemes, null, 2));
  } else {
    console.log('❌ No security schemes in generated spec');
    console.log('Components available:', spec.components ? Object.keys(spec.components) : 'None');
  }
} else {
  console.log('\nNo existing swagger.json found');
}