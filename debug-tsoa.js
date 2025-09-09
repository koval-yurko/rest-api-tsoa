#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');

console.log('🐛 Debug tsoa generation...');

// Ensure directories exist
if (!fs.existsSync('dist')) fs.mkdirSync('dist', { recursive: true });
if (!fs.existsSync('src/openapi')) fs.mkdirSync('src/openapi', { recursive: true });

console.log('📋 Running: npx tsoa spec');

const child = spawn('npx', ['tsoa', 'spec'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

child.on('close', (code) => {
  console.log(`\n📊 Process finished with code: ${code}`);
  
  if (code === 0) {
    console.log('✅ Generation successful');
    
    // Check the file
    if (fs.existsSync('dist/swagger.json')) {
      console.log('✅ swagger.json created');
      
      try {
        const spec = JSON.parse(fs.readFileSync('dist/swagger.json', 'utf8'));
        
        console.log('\n📋 Generated spec info:');
        console.log('- OpenAPI:', spec.openapi);
        console.log('- Title:', spec.info?.title);
        console.log('- Paths:', spec.paths ? Object.keys(spec.paths).length : 0);
        
        if (spec.components) {
          console.log('- Components:', Object.keys(spec.components));
          
          if (spec.components.securitySchemes) {
            console.log('\n🔐 Security schemes:');
            console.log(JSON.stringify(spec.components.securitySchemes, null, 2));
          } else {
            console.log('\n❌ No securitySchemes in components');
          }
        } else {
          console.log('- No components section');
        }
        
      } catch (error) {
        console.error('❌ Error reading spec:', error.message);
      }
    } else {
      console.log('❌ swagger.json not created');
    }
  } else {
    console.log('❌ Generation failed');
  }
});

child.on('error', (error) => {
  console.error('❌ Spawn error:', error.message);
});