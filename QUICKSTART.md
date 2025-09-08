# Quick Start Guide

Get up and running with the TypeScript Express API in minutes!

## 🚀 One-Command Setup

```bash
npm run setup
```

This will:
1. Install all dependencies
2. Generate OpenAPI spec and routes
3. Build the TypeScript project

## 🏃‍♂️ Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

## 📋 Test the API

### Health Check
```bash
curl http://localhost:3000/health
```

### Get All Users
```bash
curl http://localhost:3000/api/users
```

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "age": 25
  }'
```

### Search Products
```bash
curl "http://localhost:3000/api/products/search?category=electronics&page=1&limit=5"
```

### Get OpenAPI Specification
```bash
curl http://localhost:3000/swagger.json
```

### Access Interactive Documentation
Open your browser and visit:
```
http://localhost:3000/docs
```

## 🔧 Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/swagger.json` | OpenAPI specification |
| GET | `/docs` | Interactive Swagger UI |
| GET | `/api/users` | Get all users |
| GET | `/api/users/{id}` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |
| GET | `/api/products` | Get all products |
| GET | `/api/products/search` | Search products |
| GET | `/api/products/categories` | Get categories |
| GET | `/api/products/{id}` | Get product by ID |
| POST | `/api/products` | Create product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |

## 🛠 Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run generate-spec` - Regenerate OpenAPI spec
- `npm run generate-routes` - Regenerate routes only

## 📚 Next Steps

1. **Add a Database**: Replace mock data with real database integration
2. **Authentication**: Implement JWT or OAuth authentication
3. **Validation**: Add request validation middleware
4. **Testing**: Add unit and integration tests
5. **Logging**: Add structured logging
6. **Docker**: Containerize the application

Happy coding! 🎉