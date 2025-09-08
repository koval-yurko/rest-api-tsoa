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
  Example,
  Security
} from "tsoa";

import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
  UsersResponse
} from "../models/User";
import { ErrorResponse } from "../models/Common";
import { IUserService } from "../interfaces";

/**
 * Controller for managing users
 */
@Route("users")
@Tags("Users")
export class UserController extends Controller {
  private userService: IUserService;

  constructor(userService?: IUserService) {
    super();
    // If no service is injected, fall back to mock implementation
    this.userService = userService || {
      async getUsers() {
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
      },
      async getUserById(id: number) {
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
      },
      async createUser(userData: any) {
        return {
          id: Math.floor(Math.random() * 1000) + 3,
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      },
      async updateUser(id: number, userData: any) {
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
      },
      async deleteUser(id: number) {
        return id === 1;
      }
    };
  }

  /**
   * Get all users with optional pagination
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 10)
   */
  @Get()
  @Security("api_key")
  @SuccessResponse("200", "Users retrieved successfully")
  @Response<ErrorResponse>("401", "Unauthorized - Invalid API key")
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
    const users = await this.userService.getUsers();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = users.slice(startIndex, endIndex);

    return {
      success: true,
      message: "Users retrieved successfully",
      data: paginatedUsers,
      total: users.length
    };
  }

  /**
   * Get a user by ID
   * @param userId The user's identifier
   */
  @Get("{userId}")
  @Security("api_key")
  @SuccessResponse("200", "User retrieved successfully")
  @Response<ErrorResponse>("401", "Unauthorized - Invalid API key")
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
    const user = await this.userService.getUserById(userId);

    if (user) {
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
  @Security("api_key")
  @SuccessResponse("201", "User created successfully")
  @Response<ErrorResponse>("400", "Invalid request data")
  @Response<ErrorResponse>("401", "Unauthorized - Invalid API key")
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
    const newUser = await this.userService.createUser(requestBody);

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
  @Security("api_key")
  @SuccessResponse("200", "User updated successfully")
  @Response<ErrorResponse>("401", "Unauthorized - Invalid API key")
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
    const updatedUser = await this.userService.updateUser(userId, requestBody);

    if (updatedUser) {
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
  @Security("api_key")
  @SuccessResponse("200", "User deleted successfully")
  @Response<ErrorResponse>("401", "Unauthorized - Invalid API key")
  @Response<ErrorResponse>("404", "User not found")
  @Response<ErrorResponse>("500", "Internal server error")
  @Example<UserResponse>({
    success: true,
    message: "User deleted successfully"
  })
  public async deleteUser(@Path() userId: number): Promise<UserResponse> {
    const deleted = await this.userService.deleteUser(userId);

    if (deleted) {
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