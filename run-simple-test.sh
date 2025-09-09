#!/bin/bash

echo "🔍 Running simple test..."
cd /workspace

node test-simple.js

echo ""
echo "📋 Now trying to generate spec..."

# Create directories if they don't exist
mkdir -p dist
mkdir -p src/openapi

# Try to generate the spec
if npx tsoa spec; then
    echo "✅ Generation successful"
    
    if [ -f "dist/swagger.json" ]; then
        echo "📄 Checking generated spec..."
        node test-simple.js
    else
        echo "❌ No swagger.json generated"
    fi
else
    echo "❌ Generation failed"
fi