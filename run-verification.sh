#!/bin/bash

echo "🚀 Running Swagger UI Fixes Verification..."
echo "============================================"

cd /workspace

# Make the verification script executable
chmod +x verify-fixes.js

# Run the verification
node verify-fixes.js

echo ""
echo "Verification complete!"