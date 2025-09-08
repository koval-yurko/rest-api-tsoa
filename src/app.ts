import express, { Application, Request, Response, NextFunction } from "express";
import { RegisterRoutes } from "./routes/routes";
import { ErrorResponse } from "./models/Common";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (for development)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key");
  
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// API documentation endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "TypeScript Express API with tsoa",
    documentation: {
      swagger: "/swagger.json",
      endpoints: {
        users: "/api/users",
        products: "/api/products",
        health: "/health"
      }
    },
    version: "1.0.0"
  });
});

// Register tsoa routes
RegisterRoutes(app);

// Serve OpenAPI spec
app.get("/swagger.json", (req: Request, res: Response) => {
  try {
    const swaggerSpec = require("../dist/swagger.json");
    res.json(swaggerSpec);
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
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`📋 OpenAPI Spec: http://localhost:${PORT}/swagger.json`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
});

export default app;