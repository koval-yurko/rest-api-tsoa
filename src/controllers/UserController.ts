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
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
  UsersResponse
} from "../models/User";
import { ErrorResponse } from "../models/Common";

/**
 * Controller for managing users
 */
@Route("users")
@Tags("Users")
export class UserController extends Controller {
  /**
   * Get all users with optional pagination
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 10)
   */
  @Get()
  @SuccessResponse("200", "Users retrieved successfully")
  @Response<ErrorResponse>("500", "Internal server error")
  @Example<UsersResponse>({
    success: true,
    message: "Users retrieved successfully",
    data: [
      {
        id: 1,
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        age: 30,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z")
      }
    ],
    total: 1
  })
  public async getUsers(
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<UsersResponse> {
    // Mock data - in real app, this would come from database
    const mockUsers: User[] = [
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

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = mockUsers.slice(startIndex, endIndex);

    return {
      success: true,
      message: "Users retrieved successfully",
      data: paginatedUsers,
      total: mockUsers.length
    };
  }

  /**
   * Get a user by ID
   * @param userId The user's identifier
   */
  @Get("{userId}")
  @SuccessResponse("200", "User retrieved successfully")
  @Response<ErrorResponse>("404", "User not found")
  @Response<ErrorResponse>("500", "Internal server error")
  @Example<UserResponse>({
    success: true,
    message: "User retrieved successfully",
    data: {
      id: 1,
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      age: 30,
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date("2023-01-01T00:00:00Z")
    }
  })
  public async getUserById(@Path() userId: number): Promise<UserResponse> {
    // Mock data - in real app, this would come from database
    if (userId === 1) {
      const user: User = {
        id: 1,
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        age: 30,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z")
      };

      return {
        success: true,
        message: "User retrieved successfully",
        data: user
      };
    }

    this.setStatus(404);
    return {
      success: false,
      message: "User not found"
    };
  }

  /**
   * Create a new user
   * @param requestBody User creation data
   */
  @Post()
  @SuccessResponse("201", "User created successfully")
  @Response<ErrorResponse>("400", "Invalid request data")
  @Response<ErrorResponse>("500", "Internal server error")
  @Example<UserResponse>({
    success: true,
    message: "User created successfully",
    data: {
      id: 3,
      email: "new.user@example.com",
      firstName: "New",
      lastName: "User",
      age: 28,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  public async createUser(
    @Body() requestBody: CreateUserRequest
  ): Promise<UserResponse> {
    // Mock creation - in real app, this would save to database
    const newUser: User = {
      id: Math.floor(Math.random() * 1000) + 3, // Mock ID generation
      email: requestBody.email,
      firstName: requestBody.firstName,
      lastName: requestBody.lastName,
      age: requestBody.age,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.setStatus(201);
    return {
      success: true,
      message: "User created successfully",
      data: newUser
    };
  }

  /**
   * Update an existing user
   * @param userId The user's identifier
   * @param requestBody User update data
   */
  @Put("{userId}")
  @SuccessResponse("200", "User updated successfully")
  @Response<ErrorResponse>("404", "User not found")
  @Response<ErrorResponse>("400", "Invalid request data")
  @Response<ErrorResponse>("500", "Internal server error")
  @Example<UserResponse>({
    success: true,
    message: "User updated successfully",
    data: {
      id: 1,
      email: "updated.email@example.com",
      firstName: "Updated",
      lastName: "Name",
      age: 31,
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date()
    }
  })
  public async updateUser(
    @Path() userId: number,
    @Body() requestBody: UpdateUserRequest
  ): Promise<UserResponse> {
    // Mock update - in real app, this would update in database
    if (userId === 1) {
      const updatedUser: User = {
        id: userId,
        email: requestBody.email || "john.doe@example.com",
        firstName: requestBody.firstName || "John",
        lastName: requestBody.lastName || "Doe",
        age: requestBody.age || 30,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date()
      };

      return {
        success: true,
        message: "User updated successfully",
        data: updatedUser
      };
    }

    this.setStatus(404);
    return {
      success: false,
      message: "User not found"
    };
  }

  /**
   * Delete a user
   * @param userId The user's identifier
   */
  @Delete("{userId}")
  @SuccessResponse("200", "User deleted successfully")
  @Response<ErrorResponse>("404", "User not found")
  @Response<ErrorResponse>("500", "Internal server error")
  @Example<UserResponse>({
    success: true,
    message: "User deleted successfully"
  })
  public async deleteUser(@Path() userId: number): Promise<UserResponse> {
    // Mock deletion - in real app, this would delete from database
    if (userId === 1) {
      return {
        success: true,
        message: "User deleted successfully"
      };
    }

    this.setStatus(404);
    return {
      success: false,
      message: "User not found"
    };
  }
}