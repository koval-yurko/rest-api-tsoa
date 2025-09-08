import { Request } from "express";

/**
 * Valid API keys for authentication
 * In a production environment, these would be stored in a database or environment variables
 */
const VALID_API_KEYS = new Set([
  "demo-api-key",
  "test-api-key-123",
  "admin-key-456",
  "user-key-789"
]);

/**
 * User context returned after successful authentication
 */
export interface AuthenticatedUser {
  id: number;
  name: string;
  role: string;
  apiKey: string;
}

/**
 * Authentication function for TSOA
 * Validates API keys provided in the x-api-key header or query parameter
 */
export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<AuthenticatedUser> {
  return new Promise((resolve, reject) => {
    if (securityName === "api_key") {
      // Extract API key from header (preferred) or query parameter (fallback)
      const apiKey = (request.headers["x-api-key"] as string) || 
                    (request.query.apiKey as string);
      
      if (!apiKey) {
        reject(new Error("API key is required. Please provide it in the 'x-api-key' header or 'apiKey' query parameter."));
        return;
      }

      if (typeof apiKey !== "string") {
        reject(new Error("API key must be a string."));
        return;
      }

      if (VALID_API_KEYS.has(apiKey)) {
        // Return user context based on API key
        const userContext = getUserContextByApiKey(apiKey);
        resolve(userContext);
      } else {
        reject(new Error("Invalid API key. Please check your credentials."));
      }
    } else {
      reject(new Error(`Unknown security scheme: ${securityName}`));
    }
  });
}

/**
 * Get user context based on API key
 * In a real application, this would query a database
 */
function getUserContextByApiKey(apiKey: string): AuthenticatedUser {
  switch (apiKey) {
    case "demo-api-key":
      return {
        id: 1,
        name: "Demo User",
        role: "user",
        apiKey
      };
    case "test-api-key-123":
      return {
        id: 2,
        name: "Test User",
        role: "user",
        apiKey
      };
    case "admin-key-456":
      return {
        id: 3,
        name: "Admin User",
        role: "admin",
        apiKey
      };
    case "user-key-789":
      return {
        id: 4,
        name: "Regular User",
        role: "user",
        apiKey
      };
    default:
      throw new Error("Invalid API key");
  }
}