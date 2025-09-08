/**
 * User model representing a user in the system
 */
export interface User {
  /** Unique identifier for the user */
  id: number;
  /** User's email address */
  email: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's age */
  age?: number;
  /** Date when user was created */
  createdAt: Date;
  /** Date when user was last updated */
  updatedAt: Date;
}

/**
 * Request model for creating a new user
 */
export interface CreateUserRequest {
  /** User's email address */
  email: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's age (optional) */
  age?: number;
}

/**
 * Request model for updating an existing user
 */
export interface UpdateUserRequest {
  /** User's email address */
  email?: string;
  /** User's first name */
  firstName?: string;
  /** User's last name */
  lastName?: string;
  /** User's age */
  age?: number;
}

/**
 * Response model for user operations
 */
export interface UserResponse {
  /** Success status */
  success: boolean;
  /** Response message */
  message: string;
  /** User data (if applicable) */
  data?: User;
}

/**
 * Response model for multiple users
 */
export interface UsersResponse {
  /** Success status */
  success: boolean;
  /** Response message */
  message: string;
  /** Array of users */
  data: User[];
  /** Total count of users */
  total: number;
}