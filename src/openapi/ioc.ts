import { IocContainer } from "@tsoa/runtime";
import { UserService, ProductService } from "../services";

// Re-export interfaces for backward compatibility
export { IUserService, IProductService } from "../interfaces";

// IoC Container setup
const iocContainer: IocContainer = {
  get: <T>(controller: { prototype: T }): T => {
    const controllerName = (controller as Function).name;

    // Register services here
    if (controllerName === "UserController") {
      const instance = new (controller as any)();
      (instance as any).userService = new UserService();
      return instance;
    }

    if (controllerName === "ProductController") {
      const instance = new (controller as any)();
      (instance as any).productService = new ProductService();
      return instance;
    }

    // Default instantiation
    return new (controller as any)();
  }
};

export { iocContainer };
