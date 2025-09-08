/**
 * Interface for User service operations
 */
export interface IUserService {
  getUsers(): Promise<any[]>;
  getUserById(id: number): Promise<any>;
  createUser(userData: any): Promise<any>;
  updateUser(id: number, userData: any): Promise<any>;
  deleteUser(id: number): Promise<boolean>;
}