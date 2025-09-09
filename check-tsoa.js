#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking tsoa.json configuration...');

try {
  // Read and validate tsoa.json
  const tsoaConfig = JSON.parse(fs.readFileSync('tsoa.json', 'utf8'));
  
  console.log('📋 Current tsoa.json configuration:');
  console.log(JSON.stringify(tsoaConfig, null, 2));
  
  // Check if security schemes are properly configured
  if (tsoaConfig.spec && tsoaConfig.spec.components && tsoaConfig.spec.components.securitySchemes) {
    console.log('\n✅ Security schemes configuration found:');
    const schemes = tsoaConfig.spec.components.securitySchemes;
    Object.entries(schemes).forEach(([name, scheme]) => {
      console.log(`  - ${name}:`, scheme);
    });
  } else {
    console.log('\n❌ No security schemes configuration found');
  }
  
  // Check if required files exist
  console.log('\n📁 Checking required files:');
  
  const requiredFiles = [
    'src/app.ts',
    'src/openapi/authentication.ts',
    'src/openapi/ioc.ts',
    'src/controllers/UserController.ts',
    'src/controllers/ProductController.ts'
  ];
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} - MISSING`);
    }
  });
  
} catch (error) {
  console.error('❌ Error reading tsoa.json:', error.message);
}