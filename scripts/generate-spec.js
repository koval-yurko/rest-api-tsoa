#!/usr/bin/env node

/**
 * Script to generate OpenAPI specification and routes using tsoa
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Generating OpenAPI specification and routes...');

try {
  // Ensure dist directory exists
  const distDir = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('📁 Created dist directory');
  }

  // Ensure routes directory exists
  const routesDir = path.join(__dirname, '..', 'src', 'openapi');
  if (!fs.existsSync(routesDir)) {
    fs.mkdirSync(routesDir, { recursive: true });
    console.log('📁 Created openapi directory');
  }

  // Generate routes and OpenAPI spec
  console.log('📋 Generating routes...');
  execSync('npx tsoa routes', { stdio: 'inherit' });
  
  console.log('📄 Generating OpenAPI specification...');
  execSync('npx tsoa spec', { stdio: 'inherit' });

  console.log('✅ OpenAPI specification and routes generated successfully!');
  console.log('');
  console.log('Generated files:');
  console.log('  - src/openapi/routes.ts (Express routes)');
  console.log('  - dist/swagger.json (OpenAPI specification)');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Run "npm run build" to compile TypeScript');
  console.log('  2. Run "npm start" to start the server');
  console.log('  3. Visit http://localhost:3000/swagger.json to view the OpenAPI spec');

} catch (error) {
  console.error('❌ Error generating OpenAPI specification:', error.message);
  process.exit(1);
}