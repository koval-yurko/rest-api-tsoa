import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Route,
  SuccessResponse,
  Response,
  Tags,
  Example
} from "tsoa";

import {
  Product,
  ProductCategory,
  CreateProductRequest,
  UpdateProductRequest,
  ProductSearchQuery,
  ProductResponse,
  ProductsResponse
} from "../models/Product";
import { ErrorResponse } from "../models/Common";

/**
 * Controller for managing products
 */
@Route("products")
@Tags("Products")
export class ProductController extends Controller {
  /**
   * Search products with various filters
   * @param search Search term for product name or description
   * @param category Filter by product category
   * @param minPrice Minimum price filter (in cents)
   * @param maxPrice Maximum price filter (in cents)
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 10)
   */
  @Get("search")
  @SuccessResponse("200", "Products retrieved successfully")
  @Response<ErrorResponse>("500", "Internal server error")
  @Example<ProductsResponse>({
    success: true,
    message: "Products retrieved successfully",
    data: [
      {
        id: 1,
        name: "Laptop",
        description: "High-performance laptop",
        price: 99999,
        category: ProductCategory.ELECTRONICS,
        stock: 10,
        sku: "LAP-001",
        isActive: true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z")
      }
    ],
    total: 1,
    page: 1,
    limit: 10
  })
  public async searchProducts(
    @Query() search?: string,
    @Query() category?: ProductCategory,
    @Query() minPrice?: number,
    @Query() maxPrice?: number,
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<ProductsResponse> {
    // Mock data - in real app, this would come from database with actual search/filtering
    let mockProducts: Product[] = [
      {
        id: 1,
        name: "Laptop",
        description: "High-performance laptop for professionals",
        price: 99999, // $999.99 in cents
        category: ProductCategory.ELECTRONICS,
        stock: 10,
        sku: "LAP-001",
        isActive: true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z")
      },
      {
        id: 2,
        name: "T-Shirt",
        description: "Comfortable cotton t-shirt",
        price: 2999, // $29.99 in cents
        category: ProductCategory.CLOTHING,
        stock: 50,
        sku: "TSH-001",
        isActive: true,
        createdAt: new Date("2023-01-02T00:00:00Z"),
        updatedAt: new Date("2023-01-02T00:00:00Z")
      },
      {
        id: 3,
        name: "Programming Book",
        description: "Learn TypeScript programming",
        price: 4999, // $49.99 in cents
        category: ProductCategory.BOOKS,
        stock: 25,
        sku: "BOK-001",
        isActive: true,
        createdAt: new Date("2023-01-03T00:00:00Z"),
        updatedAt: new Date("2023-01-03T00:00:00Z")
      }
    ];

    // Apply filters (mock implementation)
    if (search) {
      mockProducts = mockProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      mockProducts = mockProducts.filter(p => p.category === category);
    }

    if (minPrice !== undefined) {
      mockProducts = mockProducts.filter(p => p.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      mockProducts = mockProducts.filter(p => p.price <= maxPrice);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = mockProducts.slice(startIndex, endIndex);

    return {
      success: true,
      message: "Products retrieved successfully",
      data: paginatedProducts,
      total: mockProducts.length,
      page,
      limit
    };
  }

  /**
   * Get all products with pagination
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 10)
   */
  @Get()
  @SuccessResponse("200", "Products retrieved successfully")
  @Response<ErrorResponse>("500", "Internal server error")
  public async getProducts(
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<ProductsResponse> {
    // Delegate to search without filters
    return this.searchProducts(undefined, undefined, undefined, undefined, page, limit);
  }

  /**
   * Get a product by ID
   * @param productId The product's identifier
   */
  @Get("{productId}")
  @SuccessResponse("200", "Product retrieved successfully")
  @Response<ErrorResponse>("404", "Product not found")
  @Response<ErrorResponse>("500", "Internal server error")
  @Example<ProductResponse>({
    success: true,
    message: "Product retrieved successfully",
    data: {
      id: 1,
      name: "Laptop",
      description: "High-performance laptop",
      price: 99999,
      category: ProductCategory.ELECTRONICS,
      stock: 10,
      sku: "LAP-001",
      isActive: true,
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date("2023-01-01T00:00:00Z")
    }
  })
  public async getProductById(@Path() productId: number): Promise<ProductResponse> {
    // Mock data - in real app, this would come from database
    if (productId === 1) {
      const product: Product = {
        id: 1,
        name: "Laptop",
        description: "High-performance laptop for professionals",
        price: 99999,
        category: ProductCategory.ELECTRONICS,
        stock: 10,
        sku: "LAP-001",
        isActive: true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z")
      };

      return {
        success: true,
        message: "Product retrieved successfully",
        data: product
      };
    }

    this.setStatus(404);
    return {
      success: false,
      message: "Product not found"
    };
  }

  /**
   * Create a new product
   * @param requestBody Product creation data
   */
  @Post()
  @SuccessResponse("201", "Product created successfully")
  @Response<ErrorResponse>("400", "Invalid request data")
  @Response<ErrorResponse>("500", "Internal server error")
  @Example<ProductResponse>({
    success: true,
    message: "Product created successfully",
    data: {
      id: 4,
      name: "New Product",
      description: "A new product",
      price: 1999,
      category: ProductCategory.ELECTRONICS,
      stock: 5,
      sku: "NEW-001",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  public async createProduct(
    @Body() requestBody: CreateProductRequest
  ): Promise<ProductResponse> {
    // Mock creation - in real app, this would save to database
    const newProduct: Product = {
      id: Math.floor(Math.random() * 1000) + 4, // Mock ID generation
      name: requestBody.name,
      description: requestBody.description,
      price: requestBody.price,
      category: requestBody.category,
      stock: requestBody.stock,
      sku: requestBody.sku,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.setStatus(201);
    return {
      success: true,
      message: "Product created successfully",
      data: newProduct
    };
  }

  /**
   * Update an existing product
   * @param productId The product's identifier
   * @param requestBody Product update data
   */
  @Put("{productId}")
  @SuccessResponse("200", "Product updated successfully")
  @Response<ErrorResponse>("404", "Product not found")
  @Response<ErrorResponse>("400", "Invalid request data")
  @Response<ErrorResponse>("500", "Internal server error")
  public async updateProduct(
    @Path() productId: number,
    @Body() requestBody: UpdateProductRequest
  ): Promise<ProductResponse> {
    // Mock update - in real app, this would update in database
    if (productId === 1) {
      const updatedProduct: Product = {
        id: productId,
        name: requestBody.name || "Laptop",
        description: requestBody.description || "High-performance laptop",
        price: requestBody.price || 99999,
        category: requestBody.category || ProductCategory.ELECTRONICS,
        stock: requestBody.stock || 10,
        sku: "LAP-001",
        isActive: requestBody.isActive !== undefined ? requestBody.isActive : true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date()
      };

      return {
        success: true,
        message: "Product updated successfully",
        data: updatedProduct
      };
    }

    this.setStatus(404);
    return {
      success: false,
      message: "Product not found"
    };
  }

  /**
   * Delete a product
   * @param productId The product's identifier
   */
  @Delete("{productId}")
  @SuccessResponse("200", "Product deleted successfully")
  @Response<ErrorResponse>("404", "Product not found")
  @Response<ErrorResponse>("500", "Internal server error")
  public async deleteProduct(@Path() productId: number): Promise<ProductResponse> {
    // Mock deletion - in real app, this would delete from database
    if (productId === 1) {
      return {
        success: true,
        message: "Product deleted successfully"
      };
    }

    this.setStatus(404);
    return {
      success: false,
      message: "Product not found"
    };
  }

  /**
   * Get available product categories
   */
  @Get("categories")
  @SuccessResponse("200", "Categories retrieved successfully")
  @Response<ErrorResponse>("500", "Internal server error")
  @Example<{ success: boolean; message: string; data: ProductCategory[] }>({
    success: true,
    message: "Categories retrieved successfully",
    data: Object.values(ProductCategory)
  })
  public async getCategories(): Promise<{ success: boolean; message: string; data: ProductCategory[] }> {
    return {
      success: true,
      message: "Categories retrieved successfully",
      data: Object.values(ProductCategory)
    };
  }
}