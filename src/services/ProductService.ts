import { IProductService } from '../interfaces/IProductService';

/**
 * Product service implementation with mock data
 */
export class ProductService implements IProductService {
  async getProducts(): Promise<any[]> {
    // Mock implementation
    return [
      {
        id: 1,
        name: "Laptop",
        description: "High-performance laptop for professionals",
        price: 99999,
        category: "electronics",
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
        price: 2999,
        category: "clothing",
        stock: 50,
        sku: "TSH-001",
        isActive: true,
        createdAt: new Date("2023-01-02T00:00:00Z"),
        updatedAt: new Date("2023-01-02T00:00:00Z")
      }
    ];
  }

  async getProductById(id: number): Promise<any> {
    // Mock implementation
    if (id === 1) {
      return {
        id: 1,
        name: "Laptop",
        description: "High-performance laptop for professionals",
        price: 99999,
        category: "electronics",
        stock: 10,
        sku: "LAP-001",
        isActive: true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z")
      };
    }
    return null;
  }

  async searchProducts(query: any): Promise<any[]> {
    // Mock implementation with filtering
    let products = await this.getProducts();
    
    if (query.search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(query.search.toLowerCase()) ||
        p.description.toLowerCase().includes(query.search.toLowerCase())
      );
    }

    if (query.category) {
      products = products.filter(p => p.category === query.category);
    }

    if (query.minPrice !== undefined) {
      products = products.filter(p => p.price >= query.minPrice);
    }

    if (query.maxPrice !== undefined) {
      products = products.filter(p => p.price <= query.maxPrice);
    }

    return products;
  }

  async createProduct(productData: any): Promise<any> {
    // Mock implementation
    return {
      id: Math.floor(Math.random() * 1000) + 4,
      ...productData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateProduct(id: number, productData: any): Promise<any> {
    // Mock implementation
    if (id === 1) {
      return {
        id,
        name: productData.name || "Laptop",
        description: productData.description || "High-performance laptop",
        price: productData.price || 99999,
        category: productData.category || "electronics",
        stock: productData.stock || 10,
        sku: "LAP-001",
        isActive: productData.isActive !== undefined ? productData.isActive : true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date()
      };
    }
    return null;
  }

  async deleteProduct(id: number): Promise<boolean> {
    // Mock implementation
    return id === 1;
  }
}