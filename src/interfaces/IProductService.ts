/**
 * Interface for Product service operations
 */
export interface IProductService {
  getProducts(): Promise<any[]>;
  getProductById(id: number): Promise<any>;
  searchProducts(query: any): Promise<any[]>;
  createProduct(productData: any): Promise<any>;
  updateProduct(id: number, productData: any): Promise<any>;
  deleteProduct(id: number): Promise<boolean>;
}