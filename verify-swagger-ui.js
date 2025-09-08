#!/usr/bin/env node

/**
 * Verification script for Swagger UI implementation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Swagger UI implementation...\n');

let hasErrors = false;

function checkStep(stepName, checkFunction) {
  try {
    console.log(`📋 ${stepName}...`);
    checkFunction();
    console.log(`✅ ${stepName} - PASSED\n`);
  } catch (error) {
    console.error(`❌ ${stepName} - FAILED: ${error.message}\n`);
    hasErrors = true;
  }
}

// Step 1: Check package.json dependencies
checkStep('Checking package.json dependencies', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (!packageJson.dependencies['swagger-ui-express']) {
    throw new Error('swagger-ui-express not found in dependencies');
  }
  
  if (!packageJson.devDependencies['@types/swagger-ui-express']) {
    throw new Error('@types/swagger-ui-express not found in devDependencies');
  }
  
  console.log('  - swagger-ui-express dependency found');
  console.log('  - @types/swagger-ui-express devDependency found');
});

// Step 2: Check app.ts modifications
checkStep('Checking app.ts modifications', () => {
  const appTs = fs.readFileSync('src/app.ts', 'utf8');
  
  if (!appTs.includes('import swaggerUi from "swagger-ui-express"')) {
    throw new Error('swagger-ui-express import not found in app.ts');
  }
  
  if (!appTs.includes('app.use("/docs"')) {
    throw new Error('/docs endpoint not found in app.ts');
  }
  
  if (!appTs.includes('📚 Swagger UI:')) {
    throw new Error('Swagger UI console log not found in app.ts');
  }
  
  console.log('  - swagger-ui-express import found');
  console.log('  - /docs endpoint configuration found');
  console.log('  - Console logging updated');
});

// Step 3: Generate TSOA files
checkStep('Generating TSOA specification and routes', () => {
  console.log('  - Running npm run generate-spec...');
  execSync('npm run generate-spec', { stdio: 'pipe' });
  
  if (!fs.existsSync('dist/swagger.json')) {
    throw new Error('swagger.json not generated in dist directory');
  }
  
  if (!fs.existsSync('src/routes/routes.ts')) {
    throw new Error('routes.ts not generated in src/routes directory');
  }
  
  console.log('  - swagger.json generated successfully');
  console.log('  - routes.ts generated successfully');
});

// Step 4: Validate swagger.json
checkStep('Validating generated swagger.json', () => {
  const swaggerJson = JSON.parse(fs.readFileSync('dist/swagger.json', 'utf8'));
  
  if (!swaggerJson.openapi && !swaggerJson.swagger) {
    throw new Error('Invalid OpenAPI specification format');
  }
  
  if (!swaggerJson.info || !swaggerJson.info.title) {
    throw new Error('OpenAPI specification missing info.title');
  }
  
  if (!swaggerJson.paths || Object.keys(swaggerJson.paths).length === 0) {
    throw new Error('OpenAPI specification has no paths defined');
  }
  
  console.log(`  - OpenAPI version: ${swaggerJson.openapi || swaggerJson.swagger}`);
  console.log(`  - API title: ${swaggerJson.info.title}`);
  console.log(`  - Number of paths: ${Object.keys(swaggerJson.paths).length}`);
});

// Step 5: Check TypeScript compilation
checkStep('Checking TypeScript compilation', () => {
  console.log('  - Running npm run build...');
  execSync('npm run build', { stdio: 'pipe' });
  
  if (!fs.existsSync('dist/app.js')) {
    throw new Error('app.js not found in dist directory after build');
  }
  
  console.log('  - TypeScript compilation successful');
  console.log('  - app.js generated in dist directory');
});

// Step 6: Check documentation updates
checkStep('Checking documentation updates', () => {
  const readme = fs.readFileSync('README.md', 'utf8');
  const quickstart = fs.readFileSync('QUICKSTART.md', 'utf8');
  
  if (!readme.includes('Swagger UI')) {
    throw new Error('README.md not updated with Swagger UI information');
  }
  
  if (!readme.includes('/docs')) {
    throw new Error('README.md missing /docs endpoint documentation');
  }
  
  if (!quickstart.includes('/docs')) {
    throw new Error('QUICKSTART.md missing /docs endpoint');
  }
  
  console.log('  - README.md updated with Swagger UI information');
  console.log('  - QUICKSTART.md updated with /docs endpoint');
});

// Summary
console.log('🎯 Verification Summary:');
if (hasErrors) {
  console.log('❌ Some checks failed. Please review the errors above.');
  console.log('\n📝 Next steps:');
  console.log('1. Fix any failing checks');
  console.log('2. Run "npm install" to install new dependencies');
  console.log('3. Run "npm run dev" to start the development server');
  console.log('4. Visit http://localhost:3000/docs to test Swagger UI');
  process.exit(1);
} else {
  console.log('✅ All checks passed! Swagger UI implementation is ready.');
  console.log('\n🚀 Ready to test:');
  console.log('1. Run "npm install" to install new dependencies');
  console.log('2. Run "npm run dev" to start the development server');
  console.log('3. Visit http://localhost:3000/docs to access Swagger UI');
  console.log('4. Visit http://localhost:3000/swagger.json for raw OpenAPI spec');
  console.log('\n🎉 Swagger UI playground is now available at /docs endpoint!');
}