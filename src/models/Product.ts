/**
 * Product category enumeration
 */
export enum ProductCategory {
  ELECTRONICS = "electronics",
  CLOTHING = "clothing",
  BOOKS = "books",
  HOME = "home",
  SPORTS = "sports"
}

/**
 * Product model representing a product in the system
 */
export interface Product {
  /** Unique identifier for the product */
  id: number;
  /** Product name */
  name: string;
  /** Product description */
  description: string;
  /** Product price in cents */
  price: number;
  /** Product category */
  category: ProductCategory;
  /** Product stock quantity */
  stock: number;
  /** Product SKU */
  sku: string;
  /** Whether the product is active */
  isActive: boolean;
  /** Date when product was created */
  createdAt: Date;
  /** Date when product was last updated */
  updatedAt: Date;
}

/**
 * Request model for creating a new product
 */
export interface CreateProductRequest {
  /** Product name */
  name: string;
  /** Product description */
  description: string;
  /** Product price in cents */
  price: number;
  /** Product category */
  category: ProductCategory;
  /** Product stock quantity */
  stock: number;
  /** Product SKU */
  sku: string;
}

/**
 * Request model for updating an existing product
 */
export interface UpdateProductRequest {
  /** Product name */
  name?: string;
  /** Product description */
  description?: string;
  /** Product price in cents */
  price?: number;
  /** Product category */
  category?: ProductCategory;
  /** Product stock quantity */
  stock?: number;
  /** Whether the product is active */
  isActive?: boolean;
}

/**
 * Query parameters for product search
 */
export interface ProductSearchQuery {
  /** Search term for product name or description */
  search?: string;
  /** Filter by category */
  category?: ProductCategory;
  /** Minimum price filter */
  minPrice?: number;
  /** Maximum price filter */
  maxPrice?: number;
  /** Page number for pagination */
  page?: number;
  /** Number of items per page */
  limit?: number;
}

/**
 * Response model for product operations
 */
export interface ProductResponse {
  /** Success status */
  success: boolean;
  /** Response message */
  message: string;
  /** Product data (if applicable) */
  data?: Product;
}

/**
 * Response model for multiple products
 */
export interface ProductsResponse {
  /** Success status */
  success: boolean;
  /** Response message */
  message: string;
  /** Array of products */
  data: Product[];
  /** Total count of products */
  total: number;
  /** Current page */
  page: number;
  /** Items per page */
  limit: number;
}