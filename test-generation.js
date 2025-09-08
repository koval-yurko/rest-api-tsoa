#!/usr/bin/env node

/**
 * Test script to generate OpenAPI specification and routes
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Testing OpenAPI specification and routes generation...');

try {
  // Ensure dist directory exists
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('📁 Created dist directory');
  }

  // Ensure routes directory exists
  const routesDir = path.join(__dirname, 'src', 'routes');
  if (!fs.existsSync(routesDir)) {
    fs.mkdirSync(routesDir, { recursive: true });
    console.log('📁 Created routes directory');
  }

  // Generate routes first
  console.log('📋 Generating routes...');
  execSync('npx tsoa routes', { stdio: 'inherit', cwd: __dirname });
  
  // Generate OpenAPI spec
  console.log('📄 Generating OpenAPI specification...');
  execSync('npx tsoa spec', { stdio: 'inherit', cwd: __dirname });

  console.log('✅ Generation completed successfully!');
  
  // Check if files were created
  const routesFile = path.join(routesDir, 'routes.ts');
  const specFile = path.join(distDir, 'swagger.json');
  
  if (fs.existsSync(routesFile)) {
    console.log('✓ Routes file created: src/routes/routes.ts');
  } else {
    console.log('✗ Routes file not found');
  }
  
  if (fs.existsSync(specFile)) {
    console.log('✓ OpenAPI spec created: dist/swagger.json');
    
    // Read and display security info from the spec
    const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
    if (spec.components && spec.components.securitySchemes) {
      console.log('✓ Security schemes found in OpenAPI spec');
      console.log('Security schemes:', Object.keys(spec.components.securitySchemes));
    } else {
      console.log('⚠ No security schemes found in OpenAPI spec');
    }
  } else {
    console.log('✗ OpenAPI spec file not found');
  }

} catch (error) {
  console.error('❌ Error during generation:', error.message);
  console.error('Full error:', error);
  process.exit(1);
}