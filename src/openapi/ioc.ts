import { IocContainer } from "@tsoa/runtime";
import { IUserService, IProductService } from "../interfaces";
import { UserService, ProductService } from "../services";

/**
 * IoC Container for dependency injection
 * This example shows how to provide services to controllers
 */

// Re-export interfaces for backward compatibility
export { IUserService, IProductService } from "../interfaces";

// IoC Container setup
const iocContainer: IocContainer = {
  get: <T>(controller: { prototype: T }): T => {
    // Register services here
    if (controller.name === "UserController") {
      return new controller(new UserService()) as any;
    }
    
    if (controller.name === "ProductController") {
      return new controller(new ProductService()) as any;
    }

    // Default instantiation
    return new (controller as any)();
  }
};

export { iocContainer };