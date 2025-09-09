#!/bin/bash

echo "🔍 Running verification test..."
cd /workspace

# Run the generate-spec script
echo "📋 Generating OpenAPI spec..."
node scripts/generate-spec.js

# Check if the spec was generated and contains security schemes
if [ -f "dist/swagger.json" ]; then
    echo ""
    echo "📄 Analyzing generated OpenAPI spec..."
    
    # Check for security schemes in the generated file
    if grep -q "securitySchemes" dist/swagger.json; then
        echo "✅ Security schemes found in generated spec!"
        
        # Show the security schemes section
        echo ""
        echo "🔐 Security schemes content:"
        node -e "
        const fs = require('fs');
        const spec = JSON.parse(fs.readFileSync('dist/swagger.json', 'utf8'));
        if (spec.components && spec.components.securitySchemes) {
            console.log(JSON.stringify(spec.components.securitySchemes, null, 2));
        } else {
            console.log('No security schemes found');
        }
        "
    else
        echo "❌ No security schemes found in generated spec"
    fi
else
    echo "❌ OpenAPI spec file not generated"
fi