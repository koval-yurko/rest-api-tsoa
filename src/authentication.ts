import { Request } from "express";

/**
 * Simple authentication function for tsoa
 * In a real application, this would validate JWT tokens, API keys, etc.
 */
export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  return new Promise((resolve, reject) => {
    // For demo purposes, we'll just check for a simple API key
    if (securityName === "api_key") {
      const apiKey = request.headers["x-api-key"] || request.query.apiKey;
      
      if (apiKey === "demo-api-key") {
        resolve({
          id: 1,
          name: "Demo User"
        });
      } else {
        reject(new Error("Invalid API key"));
      }
    } else {
      reject(new Error("Unknown security scheme"));
    }
  });
}