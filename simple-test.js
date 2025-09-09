#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Simple test to check tsoa generation...');

try {
  // Create dist directory if it doesn't exist
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('📁 Created dist directory');
  }

  // Create openapi directory if it doesn't exist
  const openapiDir = path.join(__dirname, 'src', 'openapi');
  if (!fs.existsSync(openapiDir)) {
    fs.mkdirSync(openapiDir, { recursive: true });
    console.log('📁 Created openapi directory');
  }

  console.log('📋 Generating OpenAPI spec...');
  
  // Try to generate the spec
  const result = execSync('npx tsoa spec', { 
    stdio: 'pipe', 
    cwd: __dirname,
    encoding: 'utf8'
  });
  
  console.log('✅ Spec generation output:', result);
  
  // Check if the spec file was created
  const specFile = path.join(distDir, 'swagger.json');
  if (fs.existsSync(specFile)) {
    console.log('✅ OpenAPI spec file created successfully');
    
    // Read and check the spec
    const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
    
    console.log('\n📋 Spec Analysis:');
    console.log('- OpenAPI version:', spec.openapi);
    console.log('- Title:', spec.info?.title);
    
    // Check for security schemes
    if (spec.components && spec.components.securitySchemes) {
      console.log('✅ Security schemes found!');
      console.log('Security schemes:', Object.keys(spec.components.securitySchemes));
      
      // Show the actual security scheme
      const schemes = spec.components.securitySchemes;
      Object.entries(schemes).forEach(([name, scheme]) => {
        console.log(`\n🔐 Security scheme "${name}":`);
        console.log('  Type:', scheme.type);
        console.log('  Name:', scheme.name);
        console.log('  In:', scheme.in);
        console.log('  Description:', scheme.description);
      });
    } else {
      console.log('❌ No security schemes found in the spec');
      console.log('Components:', spec.components ? Object.keys(spec.components) : 'No components');
    }
    
  } else {
    console.log('❌ OpenAPI spec file was not created');
  }

} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.stdout) {
    console.log('STDOUT:', error.stdout.toString());
  }
  if (error.stderr) {
    console.log('STDERR:', error.stderr.toString());
  }
}