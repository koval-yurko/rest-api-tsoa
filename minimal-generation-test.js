#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Minimal generation test...');

// First check tsoa.json
console.log('📋 Checking tsoa.json...');
try {
  const tsoaConfig = JSON.parse(fs.readFileSync('tsoa.json', 'utf8'));
  
  if (tsoaConfig.spec && tsoaConfig.spec.components && tsoaConfig.spec.components.securitySchemes) {
    console.log('✅ Security schemes found in tsoa.json');
    console.log('Security schemes:', Object.keys(tsoaConfig.spec.components.securitySchemes));
  } else {
    console.log('❌ No security schemes in tsoa.json');
  }
} catch (error) {
  console.error('❌ Error reading tsoa.json:', error.message);
  process.exit(1);
}

// Create directories
const distDir = path.join(__dirname, 'dist');
const openapiDir = path.join(__dirname, 'src', 'openapi');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('📁 Created dist directory');
}

if (!fs.existsSync(openapiDir)) {
  fs.mkdirSync(openapiDir, { recursive: true });
  console.log('📁 Created openapi directory');
}

// Try to run tsoa spec generation
console.log('📄 Running tsoa spec generation...');

const tsoaProcess = spawn('npx', ['tsoa', 'spec'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  cwd: __dirname
});

let stdout = '';
let stderr = '';

tsoaProcess.stdout.on('data', (data) => {
  stdout += data.toString();
  process.stdout.write(data);
});

tsoaProcess.stderr.on('data', (data) => {
  stderr += data.toString();
  process.stderr.write(data);
});

tsoaProcess.on('close', (code) => {
  console.log(`\n📊 Process exited with code: ${code}`);
  
  if (code === 0) {
    console.log('✅ Generation completed successfully');
    
    // Check the generated file
    const specFile = path.join(distDir, 'swagger.json');
    if (fs.existsSync(specFile)) {
      console.log('✅ swagger.json file created');
      
      try {
        const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
        
        if (spec.components && spec.components.securitySchemes) {
          console.log('✅ Security schemes found in generated spec!');
          console.log('Generated security schemes:', Object.keys(spec.components.securitySchemes));
          
          // Show the actual content
          console.log('\n🔐 Security schemes content:');
          console.log(JSON.stringify(spec.components.securitySchemes, null, 2));
        } else {
          console.log('❌ No security schemes in generated spec');
          console.log('Available components:', spec.components ? Object.keys(spec.components) : 'None');
        }
      } catch (error) {
        console.error('❌ Error parsing generated spec:', error.message);
      }
    } else {
      console.log('❌ swagger.json file not found');
    }
  } else {
    console.log('❌ Generation failed');
    console.log('STDOUT:', stdout);
    console.log('STDERR:', stderr);
  }
});