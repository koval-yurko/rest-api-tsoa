import { IUserService } from '../interfaces/IUserService';

/**
 * User service implementation with mock data
 */
export class UserService implements IUserService {
  async getUsers(): Promise<any[]> {
    // Mock implementation - replace with actual database calls
    return [
      {
        id: 1,
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        age: 30,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z")
      },
      {
        id: 2,
        email: "jane.smith@example.com",
        firstName: "Jane",
        lastName: "Smith",
        age: 25,
        createdAt: new Date("2023-01-02T00:00:00Z"),
        updatedAt: new Date("2023-01-02T00:00:00Z")
      }
    ];
  }

  async getUserById(id: number): Promise<any> {
    // Mock implementation
    if (id === 1) {
      return {
        id: 1,
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        age: 30,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z")
      };
    }
    return null;
  }

  async createUser(userData: any): Promise<any> {
    // Mock implementation
    return {
      id: Math.floor(Math.random() * 1000) + 3,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateUser(id: number, userData: any): Promise<any> {
    // Mock implementation
    if (id === 1) {
      return {
        id,
        email: userData.email || "john.doe@example.com",
        firstName: userData.firstName || "John",
        lastName: userData.lastName || "Doe",
        age: userData.age || 30,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date()
      };
    }
    return null;
  }

  async deleteUser(id: number): Promise<boolean> {
    // Mock implementation
    return id === 1;
  }
}