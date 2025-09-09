#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 Testing different tsoa.json configurations...');

// Current configuration
console.log('\n1. Current tsoa.json:');
const currentConfig = JSON.parse(fs.readFileSync('tsoa.json', 'utf8'));
console.log(JSON.stringify(currentConfig, null, 2));

// Let's try an alternative configuration format
console.log('\n2. Trying alternative configuration...');

// For tsoa 5.x, security schemes might need to be configured differently
const alternativeConfig = {
  ...currentConfig,
  spec: {
    ...currentConfig.spec,
    // Remove the components section and try securityDefinitions instead
    securityDefinitions: {
      api_key: {
        type: "apiKey",
        name: "x-api-key",
        in: "header",
        description: "API key for authentication. Use one of: demo-api-key, test-api-key-123, admin-key-456, user-key-789"
      }
    }
  }
};

// Remove components if we're using securityDefinitions
delete alternativeConfig.spec.components;

console.log('Alternative config (OpenAPI 2.0 style):');
console.log(JSON.stringify(alternativeConfig, null, 2));

// Save the alternative config temporarily
fs.writeFileSync('tsoa-alt.json', JSON.stringify(alternativeConfig, null, 2));
console.log('\n✅ Saved alternative config as tsoa-alt.json');

// Let's also try a mixed approach
const mixedConfig = {
  ...currentConfig,
  spec: {
    ...currentConfig.spec,
    // Keep both for compatibility
    securityDefinitions: {
      api_key: {
        type: "apiKey",
        name: "x-api-key",
        in: "header"
      }
    },
    components: {
      securitySchemes: {
        api_key: {
          type: "apiKey",
          name: "x-api-key",
          in: "header",
          description: "API key for authentication"
        }
      }
    }
  }
};

fs.writeFileSync('tsoa-mixed.json', JSON.stringify(mixedConfig, null, 2));
console.log('✅ Saved mixed config as tsoa-mixed.json');

console.log('\n📋 Next steps:');
console.log('1. Try: cp tsoa-alt.json tsoa.json && npx tsoa spec');
console.log('2. Or try: cp tsoa-mixed.json tsoa.json && npx tsoa spec');
console.log('3. Check which one generates security schemes correctly');