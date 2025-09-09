#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔄 Trying alternative tsoa configurations...');

// Ensure directories exist
if (!fs.existsSync('dist')) fs.mkdirSync('dist', { recursive: true });
if (!fs.existsSync('src/openapi')) fs.mkdirSync('src/openapi', { recursive: true });

// Backup current config
if (fs.existsSync('tsoa.json')) {
  fs.copyFileSync('tsoa.json', 'tsoa-backup.json');
  console.log('✅ Backed up current tsoa.json');
}

// Try OpenAPI 2.0 style configuration
console.log('\n1️⃣ Trying OpenAPI 2.0 style (securityDefinitions)...');

const config2 = {
  "entryFile": "src/app.ts",
  "noImplicitAdditionalProperties": "throw-on-extras",
  "controllerPathGlobs": ["src/controllers/**/*Controller.ts"],
  "iocModule": "src/openapi/ioc.ts",
  "spec": {
    "outputDirectory": "dist",
    "specVersion": 3,
    "info": {
      "title": "TypeScript Express API",
      "version": "1.0.0",
      "description": "API built with TypeScript, Express, and tsoa"
    },
    "basePath": "/api",
    "securityDefinitions": {
      "api_key": {
        "type": "apiKey",
        "name": "x-api-key",
        "in": "header",
        "description": "API key for authentication"
      }
    }
  },
  "routes": {
    "routesDir": "src/openapi",
    "authenticationModule": "src/openapi/authentication.ts",
    "iocModule": "src/openapi/ioc.ts"
  }
};

fs.writeFileSync('tsoa.json', JSON.stringify(config2, null, 2));

try {
  console.log('Generating with securityDefinitions...');
  const result = execSync('npx tsoa spec', { encoding: 'utf8' });
  console.log('✅ Generation completed');
  
  if (fs.existsSync('dist/swagger.json')) {
    const spec = JSON.parse(fs.readFileSync('dist/swagger.json', 'utf8'));
    
    if (spec.components?.securitySchemes || spec.securityDefinitions) {
      console.log('✅ SUCCESS with securityDefinitions approach!');
      if (spec.components?.securitySchemes) {
        console.log('Found in components.securitySchemes:');
        console.log(JSON.stringify(spec.components.securitySchemes, null, 2));
      }
      if (spec.securityDefinitions) {
        console.log('Found in securityDefinitions:');
        console.log(JSON.stringify(spec.securityDefinitions, null, 2));
      }
    } else {
      console.log('❌ Still no security schemes with securityDefinitions');
    }
  }
} catch (error) {
  console.log('❌ Failed with securityDefinitions:', error.message);
}

// Try the original OpenAPI 3.0 style but with different structure
console.log('\n2️⃣ Trying OpenAPI 3.0 style with different structure...');

const config3 = {
  "entryFile": "src/app.ts",
  "noImplicitAdditionalProperties": "throw-on-extras",
  "controllerPathGlobs": ["src/controllers/**/*Controller.ts"],
  "iocModule": "src/openapi/ioc.ts",
  "spec": {
    "outputDirectory": "dist",
    "specVersion": 3,
    "info": {
      "title": "TypeScript Express API",
      "version": "1.0.0",
      "description": "API built with TypeScript, Express, and tsoa"
    },
    "basePath": "/api"
  },
  "routes": {
    "routesDir": "src/openapi",
    "authenticationModule": "src/openapi/authentication.ts",
    "iocModule": "src/openapi/ioc.ts"
  }
};

fs.writeFileSync('tsoa.json', JSON.stringify(config3, null, 2));

try {
  console.log('Generating without explicit security config (let tsoa infer)...');
  const result = execSync('npx tsoa spec', { encoding: 'utf8' });
  console.log('✅ Generation completed');
  
  if (fs.existsSync('dist/swagger.json')) {
    const spec = JSON.parse(fs.readFileSync('dist/swagger.json', 'utf8'));
    
    if (spec.components?.securitySchemes) {
      console.log('✅ SUCCESS with inferred security schemes!');
      console.log('Inferred security schemes:');
      console.log(JSON.stringify(spec.components.securitySchemes, null, 2));
    } else {
      console.log('❌ No security schemes inferred');
      console.log('Available components:', spec.components ? Object.keys(spec.components) : 'None');
    }
  }
} catch (error) {
  console.log('❌ Failed with inference approach:', error.message);
}

// Restore backup
console.log('\n🔄 Restoring original config...');
if (fs.existsSync('tsoa-backup.json')) {
  fs.copyFileSync('tsoa-backup.json', 'tsoa.json');
  fs.unlinkSync('tsoa-backup.json');
  console.log('✅ Restored original tsoa.json');
}