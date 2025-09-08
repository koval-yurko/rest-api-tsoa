import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./openapi/routes";
import { ErrorResponse } from "./models/Common";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced CORS middleware for Swagger UI cross-domain support
app.use(cors({
  // Allow requests from any origin (for development and Swagger UI)
  origin: "*",
  
  // Allow all HTTP methods that Swagger UI might use
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  
  // Allow all headers that Swagger UI and API clients might send
  allowedHeaders: [
    "Origin", 
    "X-Requested-With", 
    "Content-Type", 
    "Accept", 
    "Authorization", 
    "x-api-key", 
    "Cache-Control", 
    "Pragma", 
    "Expires"
  ],
  
  // Expose headers that clients might need to read
  exposedHeaders: [
    "Content-Length", 
    "Content-Type", 
    "Authorization", 
    "x-api-key", 
    "X-Total-Count"
  ],
  
  // Allow credentials (cookies, authorization headers, etc.)
  credentials: true,
  
  // Cache preflight requests for 24 hours to improve performance
  maxAge: 86400,
  
  // Handle preflight requests
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Register tsoa routes
RegisterRoutes(app);

// Helper function to get the server URL dynamically
function getServerUrl(req: Request): string {
  // For Heroku and other cloud platforms, use the host header
  const protocol = req.get('x-forwarded-proto') || req.protocol || 'http';
  const host = req.get('host') || `localhost:${PORT}`;
  return `${protocol}://${host}`;
}

// Serve OpenAPI spec with dynamic server configuration
app.get("/swagger.json", (req: Request, res: Response) => {
  try {
    const swaggerSpec = require("../dist/swagger.json");
    
    // Dynamically set the server URL based on the request
    const serverUrl = getServerUrl(req);
    
    // Update the spec with the current server URL
    const dynamicSpec = {
      ...swaggerSpec,
      servers: [
        {
          url: serverUrl + "/api",
          description: "Current server"
        }
      ]
    };
    
    res.json(dynamicSpec);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "OpenAPI spec not found. Run 'npm run generate-spec' first."
    });
  }
});

// Serve Swagger UI with enhanced configuration
app.use("/docs", swaggerUi.serve, (req: Request, res: Response, next: NextFunction) => {
  try {
    const swaggerSpec = require("../dist/swagger.json");
    
    // Dynamically set the server URL based on the request
    const serverUrl = getServerUrl(req);
    
    // Update the spec with the current server URL
    const dynamicSpec = {
      ...swaggerSpec,
      servers: [
        {
          url: serverUrl + "/api",
          description: "Current server"
        }
      ]
    };
    
    // Enhanced Swagger UI configuration
    const swaggerOptions = {
      explorer: true,
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .scheme-container { background: #f7f7f7; padding: 10px; border-radius: 4px; margin-bottom: 10px; }
        .swagger-ui .auth-wrapper { margin-bottom: 20px; }
      `,
      customSiteTitle: "TypeScript Express API Documentation",
      swaggerOptions: {
        // Enable the authorize button and make it prominent
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        // Pre-populate with example API key for easier testing
        initOAuth: {
          clientId: "swagger-ui",
          realm: "swagger-ui-realm",
          appName: "Swagger UI"
        }
      },
      customJs: `
        // Add custom JavaScript to enhance the auth experience
        window.onload = function() {
          // Add helpful text about API keys
          setTimeout(function() {
            const authSection = document.querySelector('.auth-wrapper');
            if (authSection && !document.querySelector('.api-key-help')) {
              const helpText = document.createElement('div');
              helpText.className = 'api-key-help';
              helpText.style.cssText = 'background: #e7f3ff; padding: 10px; border-radius: 4px; margin-bottom: 10px; border-left: 4px solid #0066cc;';
              helpText.innerHTML = '<strong>Available API Keys for Testing:</strong><br/>' +
                '• demo-api-key (Demo User)<br/>' +
                '• test-api-key-123 (Test User)<br/>' +
                '• admin-key-456 (Admin User)<br/>' +
                '• user-key-789 (Regular User)';
              authSection.insertBefore(helpText, authSection.firstChild);
            }
          }, 1000);
        };
      `
    };
    
    swaggerUi.setup(dynamicSpec, swaggerOptions)(req, res, next);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "OpenAPI spec not found. Run 'npm run generate-spec' first."
    });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);

  const errorResponse: ErrorResponse = {
    success: false,
    message: err.message || "Internal server error",
    code: err.code,
    details: process.env.NODE_ENV === "development" ? err.stack : undefined
  };

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json(errorResponse);
});

// 404 handler
app.use((req: Request, res: Response) => {
  const errorResponse: ErrorResponse = {
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    code: "NOT_FOUND"
  };

  res.status(404).json(errorResponse);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`📋 OpenAPI Spec: http://localhost:${PORT}/swagger.json`);
  console.log(`📚 Swagger UI: http://localhost:${PORT}/docs`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
});

export default app;