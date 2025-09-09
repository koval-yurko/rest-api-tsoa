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

  // Ensure openapi directory exists (updated from routes)
  const openapiDir = path.join(__dirname, 'src', 'openapi');
  if (!fs.existsSync(openapiDir)) {
    fs.mkdirSync(openapiDir, { recursive: true });
    console.log('📁 Created openapi directory');
  }

  // Generate routes first
  console.log('📋 Generating routes...');
  execSync('npx tsoa routes', { stdio: 'inherit', cwd: __dirname });
  
  // Generate OpenAPI spec
  console.log('📄 Generating OpenAPI specification...');
  execSync('npx tsoa spec', { stdio: 'inherit', cwd: __dirname });

  console.log('✅ Generation completed successfully!');
  
  // Check if files were created
  const routesFile = path.join(openapiDir, 'routes.ts');
  const specFile = path.join(distDir, 'swagger.json');
  
  if (fs.existsSync(routesFile)) {
    console.log('✓ Routes file created: src/openapi/routes.ts');
  } else {
    console.log('✗ Routes file not found');
  }
  
  if (fs.existsSync(specFile)) {
    console.log('✓ OpenAPI spec created: dist/swagger.json');
    
    // Read and display security info from the spec
    const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
    console.log('\n📋 OpenAPI Spec Analysis:');
    console.log('- Title:', spec.info?.title);
    console.log('- Version:', spec.info?.version);
    
    // Check for security schemes
    if (spec.components && spec.components.securitySchemes) {
      console.log('✓ Security schemes found in OpenAPI spec');
      console.log('Security schemes:', Object.keys(spec.components.securitySchemes));
      
      // Display details of each security scheme
      Object.entries(spec.components.securitySchemes).forEach(([name, scheme]) => {
        console.log(`  - ${name}:`, {
          type: scheme.type,
          name: scheme.name,
          in: scheme.in,
          description: scheme.description?.substring(0, 50) + '...'
        });
      });
    } else if (spec.securityDefinitions) {
      console.log('✓ Security definitions found (OpenAPI 2.0 format)');
      console.log('Security definitions:', Object.keys(spec.securityDefinitions));
    } else {
      console.log('⚠ No security schemes found in OpenAPI spec');
    }
    
    // Check for security requirements on paths
    let securedEndpoints = 0;
    if (spec.paths) {
      Object.entries(spec.paths).forEach(([path, methods]) => {
        Object.entries(methods).forEach(([method, operation]) => {
          if (operation.security && operation.security.length > 0) {
            securedEndpoints++;
          }
        });
      });
    }
    console.log(`✓ Found ${securedEndpoints} secured endpoints`);
    
  } else {
    console.log('✗ OpenAPI spec file not found');
  }

} catch (error) {
  console.error('❌ Error during generation:', error.message);
  console.error('Full error:', error);
  process.exit(1);
}