/**
 * Standard error response model
 */
export interface ErrorResponse {
  /** Success status (always false for errors) */
  success: false;
  /** Error message */
  message: string;
  /** Error code */
  code?: string;
  /** Additional error details */
  details?: any;
}

/**
 * Standard success response model
 */
export interface SuccessResponse<T = any> {
  /** Success status (always true for success) */
  success: true;
  /** Success message */
  message: string;
  /** Response data */
  data?: T;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  /** Current page number */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNext: boolean;
  /** Whether there is a previous page */
  hasPrev: boolean;
}

/**
 * Paginated response model
 */
export interface PaginatedResponse<T> {
  /** Success status */
  success: boolean;
  /** Response message */
  message: string;
  /** Array of data items */
  data: T[];
  /** Pagination metadata */
  pagination: PaginationMeta;
}