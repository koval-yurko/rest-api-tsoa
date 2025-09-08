# CORS Fix Documentation

## Overview

This document describes the CORS (Cross-Origin Resource Sharing) fixes implemented to enable Swagger UI to work properly across different domains.

## Problem

The original CORS implementation was basic and didn't provide comprehensive support for cross-domain requests, particularly for Swagger UI functionality. This caused issues when:

- Accessing Swagger UI from different domains
- Using the "Try it out" functionality in Swagger UI
- Making API requests from web applications hosted on different domains

## Solution

### 1. Enhanced CORS Middleware

**File:** `src/app.ts` (lines 13-47)

**Changes Made:**
- Added comprehensive CORS headers including `Access-Control-Expose-Headers`
- Added support for credentials with `Access-Control-Allow-Credentials`
- Implemented preflight request caching with `Access-Control-Max-Age`
- Extended allowed methods to include `PATCH` and `HEAD`
- Enhanced allowed headers to include cache control and additional API headers
- Improved OPTIONS request handling

**Key Headers Added:**
```javascript
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key, Cache-Control, Pragma, Expires
Access-Control-Expose-Headers: Content-Length, Content-Type, Authorization, x-api-key, X-Total-Count
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

### 2. Enhanced Swagger UI Configuration

**File:** `src/app.ts` (lines 80-114)

**Changes Made:**
- Added request interceptor to ensure proper headers for cross-domain requests
- Configured supported HTTP methods for Swagger UI
- Added timeout configuration
- Enhanced error handling for missing OpenAPI specs

**Key Configuration:**
```javascript
swaggerOptions: {
  requestInterceptor: (request) => {
    request.headers['Accept'] = 'application/json, text/plain, */*';
    request.headers['Content-Type'] = 'application/json';
    return request;
  },
  supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'],
  withCredentials: false,
  timeout: 30000
}
```

### 3. OpenAPI Spec Endpoint Enhancement

**File:** `src/app.ts` (lines 62-78)

**Changes Made:**
- Added explicit CORS headers for the `/swagger.json` endpoint
- Ensured proper content-type headers

### 4. Explicit Preflight Handler

**File:** `src/app.ts` (lines 62-73)

**Changes Made:**
- Added a catch-all OPTIONS handler for complex preflight requests
- Ensures all routes properly handle CORS preflight requests

## Testing

### Automated Testing

A CORS test script has been provided: `test-cors.js`

**To run the test:**
```bash
# Start your API server
npm run dev

# In another terminal, run the CORS test
node test-cors.js
```

**Expected Output:**
The test should show ✅ for all endpoints with proper CORS headers configured.

### Manual Testing

1. **Start the API server:**
   ```bash
   npm run dev
   ```

2. **Access Swagger UI from a different domain:**
   - Open your browser's developer tools
   - Navigate to `http://localhost:3000/docs`
   - Check the Network tab for CORS-related errors

3. **Test API endpoints:**
   - Use the "Try it out" functionality in Swagger UI
   - Test different HTTP methods (GET, POST, PUT, DELETE)
   - Verify no CORS errors appear in the browser console

### Cross-Domain Testing

1. **Create a simple HTML file on a different port:**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>CORS Test</title>
   </head>
   <body>
       <script>
           // Test API call from different origin
           fetch('http://localhost:3000/health')
               .then(response => response.json())
               .then(data => console.log('Success:', data))
               .catch(error => console.error('CORS Error:', error));
       </script>
   </body>
   </html>
   ```

2. **Serve this file from a different port (e.g., 8080)**

3. **Open the file in your browser and check the console**

## Security Considerations

### Development vs Production

The current configuration uses `Access-Control-Allow-Origin: *` which is suitable for development but should be restricted in production:

```javascript
// Production example - restrict origins
const allowedOrigins = [
  'https://yourdomain.com',
  'https://api-docs.yourdomain.com'
];

res.header("Access-Control-Allow-Origin", 
  allowedOrigins.includes(req.headers.origin) ? req.headers.origin : 'null'
);
```

### Credentials Handling

The configuration includes `Access-Control-Allow-Credentials: true`. In production:
- Only enable if you need to send cookies or authorization headers
- Must be paired with specific origins (not `*`)
- Consider the security implications

## Troubleshooting

### Common Issues

1. **Swagger UI still shows CORS errors:**
   - Ensure the API server is running
   - Check that the OpenAPI spec is generated (`npm run generate-spec`)
   - Verify browser cache is cleared

2. **API requests fail from external domains:**
   - Check that the CORS middleware is loaded before route registration
   - Verify the middleware order in `app.ts`
   - Check browser developer tools for specific CORS error messages

3. **Preflight requests failing:**
   - Ensure the explicit OPTIONS handler is working
   - Check that all required headers are included in `Access-Control-Allow-Headers`

### Debug Steps

1. **Check CORS headers in browser:**
   ```javascript
   // In browser console
   fetch('http://localhost:3000/health', {method: 'OPTIONS'})
     .then(response => {
       console.log('CORS Headers:', response.headers);
     });
   ```

2. **Verify middleware order:**
   - CORS middleware should be before route registration
   - Body parsing middleware should be before CORS if needed

3. **Test specific endpoints:**
   ```bash
   curl -H "Origin: http://example.com" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        http://localhost:3000/api/users
   ```

## Files Modified

- `src/app.ts` - Enhanced CORS middleware and Swagger UI configuration
- `test-cors.js` - Added CORS testing script (new file)
- `CORS_FIX_DOCUMENTATION.md` - This documentation (new file)

## Validation Checklist

- [ ] API server starts without errors
- [ ] Swagger UI loads at `/docs`
- [ ] "Try it out" functionality works for all endpoints
- [ ] No CORS errors in browser console
- [ ] Cross-domain requests work from external origins
- [ ] Preflight OPTIONS requests return proper headers
- [ ] All API endpoints return CORS headers

## Additional Resources

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Swagger UI CORS Configuration](https://swagger.io/docs/open-source-tools/swagger-ui/usage/cors/)
- [Express.js CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)