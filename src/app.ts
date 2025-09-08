import express, { Application, Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes/routes";
import { ErrorResponse } from "./models/Common";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced CORS middleware for Swagger UI cross-domain support
app.use((req: Request, res: Response, next: NextFunction) => {
  // Allow requests from any origin (for development and Swagger UI)
  res.header("Access-Control-Allow-Origin", "*");
  
  // Allow all HTTP methods that Swagger UI might use
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD");
  
  // Allow all headers that Swagger UI and API clients might send
  res.header(
    "Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key, Cache-Control, Pragma, Expires"
  );
  
  // Expose headers that clients might need to read
  res.header(
    "Access-Control-Expose-Headers", 
    "Content-Length, Content-Type, Authorization, x-api-key, X-Total-Count"
  );
  
  // Allow credentials (cookies, authorization headers, etc.)
  res.header("Access-Control-Allow-Credentials", "true");
  
  // Cache preflight requests for 24 hours to improve performance
  res.header("Access-Control-Max-Age", "86400");
  
  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    // Send success status for preflight requests
    res.status(200).end();
    return;
  }
  
  next();
});

// Health check endpoint with CORS support
app.get("/health", (req: Request, res: Response) => {
  // Ensure CORS headers for health check
  res.header("Access-Control-Allow-Origin", "*");
  
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Explicit CORS preflight handler for all routes
app.options("*", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD");
  res.header(
    "Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key, Cache-Control, Pragma, Expires"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Max-Age", "86400");
  res.status(200).end();
});

// Register tsoa routes
RegisterRoutes(app);

// Serve OpenAPI spec with CORS support
app.get("/swagger.json", (req: Request, res: Response) => {
  try {
    const swaggerSpec = require("../dist/swagger.json");
    
    // Ensure CORS headers are set for the spec endpoint
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Content-Type", "application/json");
    
    res.json(swaggerSpec);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "OpenAPI spec not found. Run 'npm run generate-spec' first."
    });
  }
});

// Serve Swagger UI with enhanced CORS support
app.use("/docs", swaggerUi.serve, (req: Request, res: Response, next: NextFunction) => {
  try {
    const swaggerSpec = require("../dist/swagger.json");
    
    // Enhanced Swagger UI configuration for cross-domain support
    const swaggerOptions = {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: "TypeScript Express API Documentation",
      swaggerOptions: {
        // Enable CORS support in Swagger UI
        requestInterceptor: (request: any) => {
          // Ensure proper headers are set for cross-domain requests
          request.headers['Accept'] = 'application/json, text/plain, */*';
          request.headers['Content-Type'] = 'application/json';
          return request;
        },
        // Configure Swagger UI to handle CORS properly
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'],
        // Enable credentials for cross-domain requests if needed
        withCredentials: false,
        // Set request timeout
        timeout: 30000
      }
    };
    
    swaggerUi.setup(swaggerSpec, swaggerOptions)(req, res, next);
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