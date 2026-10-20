const swaggerUi = require("swagger-ui-express");

const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "E-Commerce API Documentation",
    version: "1.0.0",
    description:
      "Comprehensive REST API documentation for the E-Commerce platform. Includes endpoints for Authentication, Users, Roles, Products, Categories, Cart, Orders, and System Setup.",
    contact: {
      name: "API Support",
    },
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local Development Server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication and authorization operations" },
    { name: "Roles", description: "Role management" },
    { name: "Users", description: "User account management" },
    { name: "Categories", description: "Product category management" },
    { name: "Products", description: "Product catalog and inventory management" },
    { name: "Cart", description: "Shopping cart operations" },
    { name: "Orders", description: "Order placement and order lifecycle management" },
    { name: "System", description: "System initialization and seed data" },
  ], 
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Enter your JWT token obtained from `/api/auth/login`. Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Error message description" },
          error: { type: "object" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["email", "password", "roleID"],
        properties: {
          name: { type: "string", example: "John Doe" },
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", format: "password", example: "Secret123" },
          roleID: {
            type: "string",
            example: "650c1f1e9b1d8b2bad123456",
            description: "MongoDB ObjectId of the Role",
          },
        },
      },
      RegisterResponse: {
        type: "object",
        properties: {
          username: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john@example.com" },
          role: { type: "string", example: "user" },
          message: { type: "string", example: "User created successfully" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", format: "password", example: "Secret123" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            description: "JWT Bearer Token (expires in 1 day)",
          },
        },
      },
      ConfigResponse: {
        type: "object",
        properties: {
          UserAccess: {
            type: "array",
            items: {
              type: "object",
              properties: {
                _id: { type: "string", example: "650c1f1e9b1d8b2bad654321" },
                menuId: {
                  type: "object",
                  properties: {
                    _id: { type: "string", example: "650c1f1e9b1d8b2bad999999" },
                    description: { type: "string", example: "Products" },
                  },
                },
                roleID: { type: "string", example: "650c1f1e9b1d8b2bad123456" },
                create: { type: "boolean", example: true },
                read: { type: "boolean", example: true },
                update: { type: "boolean", example: true },
                remove: { type: "boolean", example: true },
              },
            },
          },
        },
      },
      Role: {
        type: "object",
        properties: {
          _id: { type: "string", example: "650c1f1e9b1d8b2bad123456" },
          roleName: { type: "string", example: "super_admin" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateRoleRequest: {
        type: "object",
        required: ["roleName"],
        properties: {
          roleName: {
            type: "string",
            example: "vendor",
            description: "Unique name of the role (e.g., super_admin, turf_admin, user, vendor)",
          },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "650c1f1e9b1d8b2bad111111" },
          name: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john@example.com" },
          roleId: {
            type: "string",
            example: "650c1f1e9b1d8b2bad123456",
            description: "Referenced Role ObjectId",
          },
        },
      },
      CreateUserAdminRequest: {
        type: "object",
        required: ["email", "password", "roleID"],
        properties: {
          username: { type: "string", example: "Jane Doe" },
          email: { type: "string", format: "email", example: "jane@example.com" },
          password: { type: "string", format: "password", example: "Password123" },
          roleID: { type: "string", example: "650c1f1e9b1d8b2bad123456" },
        },
      },
      Category: {
        type: "object",
        properties: {
          _id: { type: "string", example: "650c1f1e9b1d8b2bad222222" },
          name: { type: "string", example: "Electronics" },
        },
      },
      CategoryRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Footwear" },
        },
      },
      Product: {
        type: "object",
        properties: {
          _id: { type: "string", example: "650c1f1e9b1d8b2bad333333" },
          name: { type: "string", example: "Wireless Bluetooth Headphones" },
          description: { type: "string", example: "Premium noise cancelling over-ear headphones." },
          price: { type: "number", example: 99.99 },
          image: { type: "string", example: "uploads/1712345678-headphones.jpg" },
          category: {
            oneOf: [
              { type: "string", example: "650c1f1e9b1d8b2bad222222" },
              { $ref: "#/components/schemas/Category" },
            ],
          },
          createdBy: { type: "string", example: "650c1f1e9b1d8b2bad111111" },
          isDeleted: { type: "boolean", example: false },
          deletedAt: { type: "string", format: "date-time", nullable: true, example: null },
        },
      },
      CartItem: {
        type: "object",
        properties: {
          product: { $ref: "#/components/schemas/Product" },
          quantity: { type: "integer", example: 2 },
        },
      },
      Cart: {
        type: "object",
        properties: {
          _id: { type: "string", example: "650c1f1e9b1d8b2bad444444" },
          userId: { type: "string", example: "650c1f1e9b1d8b2bad111111" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/CartItem" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      AddToCartRequest: {
        type: "object",
        required: ["productId", "quantity"],
        properties: {
          productId: { type: "string", example: "650c1f1e9b1d8b2bad333333" },
          quantity: { type: "integer", minimum: 1, example: 1 },
        },
      },
      OrderStatus: {
        type: "object",
        properties: {
          _id: { type: "string", example: "650c1f1e9b1d8b2bad555555" },
          name: { type: "string", example: "Placed" },
        },
      },
      CreateOrderStatusRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "string",
            example: "Shipped",
            description: "Status name (e.g. Placed, Processing, Shipped, Delivered, Cancelled)",
          },
        },
      },
      ShippingAddress: {
        type: "object",
        required: ["fullName", "phone", "addressLine", "city", "postalCode", "country"],
        properties: {
          fullName: { type: "string", example: "John Doe" },
          phone: { type: "string", example: "+1 555-0199" },
          addressLine: { type: "string", example: "742 Evergreen Terrace" },
          city: { type: "string", example: "Springfield" },
          postalCode: { type: "string", example: "97477" },
          country: { type: "string", example: "United States" },
        },
      },
      PlaceOrderRequest: {
        type: "object",
        required: ["products", "paymentMethod", "shippingAddress"],
        properties: {
          products: {
            type: "array",
            items: {
              type: "object",
              required: ["product", "quantity"],
              properties: {
                product: { type: "string", example: "650c1f1e9b1d8b2bad333333" },
                quantity: { type: "integer", example: 1 },
              },
            },
          },
          paymentMethod: {
            type: "string",
            enum: ["cod", "online"],
            example: "cod",
          },
          shippingAddress: { $ref: "#/components/schemas/ShippingAddress" },
        },
      },
      Order: {
        type: "object",
        properties: {
          _id: { type: "string", example: "650c1f1e9b1d8b2bad666666" },
          userId: {
            oneOf: [
              { type: "string", example: "650c1f1e9b1d8b2bad111111" },
              {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  name: { type: "string" },
                  email: { type: "string" },
                },
              },
            ],
          },
          products: {
            type: "array",
            items: {
              type: "object",
              properties: {
                product: { $ref: "#/components/schemas/Product" },
                quantity: { type: "integer", example: 2 },
              },
            },
          },
          paymentMethod: { type: "string", example: "cod" },
          totalAmount: { type: "number", example: 199.98 },
          orderStatus: { $ref: "#/components/schemas/OrderStatus" },
          shippingAddress: { $ref: "#/components/schemas/ShippingAddress" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      UpdateOrderStatusRequest: {
        type: "object",
        required: ["statusId"],
        properties: {
          statusId: {
            type: "string",
            example: "650c1f1e9b1d8b2bad555555",
            description: "MongoDB ObjectId of the new OrderStatus",
          },
        },
      },
    },
  },
  paths: {
    "/init": {
      get: {
        tags: ["System"],
        summary: "Run initial setup wizard",
        description:
          "Seeds the database with default Roles (super_admin, turf_admin, user), default Menus, Menu Access rules, default Categories, and default Order Statuses.",
        responses: {
          200: {
            description: "System setup completed successfully",
            content: {
              "text/plain": {
                schema: { type: "string", example: "working" },
              },
            },
          },
          500: {
            description: "Initialization error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        description: "Creates a new user account with hashed password and associated role.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterResponse" },
              },
            },
          },
          400: {
            description: "User already exists or validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "User login",
        description: "Authenticates user credentials and returns a signed JWT Bearer token valid for 24 hours.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          400: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/getConfig": {
      get: {
        tags: ["Auth"],
        summary: "Get current user permissions and configuration",
        description: "Returns access control rules and menus available for the authenticated user's role.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "User configuration retrieved",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ConfigResponse" },
              },
            },
          },
          401: {
            description: "Unauthorized - missing or invalid token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/role/UserRoles": {
      post: {
        tags: ["Roles"],
        summary: "Create a new role",
        description: "Adds a new role to the database (e.g. super_admin, turf_admin, user, vendor).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateRoleRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Role created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "string", example: "success" },
                    message: { type: "string", example: "Role created successfully" },
                    data: { $ref: "#/components/schemas/Role" },
                  },
                },
              },
            },
          },
          400: {
            description: "Role Name is required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          409: {
            description: "Role already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/role/getAllRoles": {
      get: {
        tags: ["Roles"],
        summary: "Get all roles",
        description: "Fetches all roles defined in the system.",
        responses: {
          200: {
            description: "Roles fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "string", example: "success" },
                    message: { type: "string", example: "Role fetched successfully" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Role" },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        description: "Fetches a list of all registered users.",
        responses: {
          200: {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/users/create": {
      post: {
        tags: ["Users"],
        summary: "Create a new user (Super Admin only)",
        description: "Creates a user account directly by an administrator.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUserAdminRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "User created successfully" },
                  },
                },
              },
            },
          },
          400: {
            description: "User already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: { description: "Unauthorized" },
          403: { description: "Permission Denied - Requires Super Admin" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/users/{id}": {
      delete: {
        tags: ["Users"],
        summary: "Delete a user by ID",
        description: "Deletes a user account from the system.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId of the user to delete",
            schema: { type: "string", example: "650c1f1e9b1d8b2bad111111" },
          },
        ],
        responses: {
          200: {
            description: "User deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "User deleted successfully" },
                  },
                },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: { description: "Server error" },
        },
      },
    },
    "/api/category": {
      get: {
        tags: ["Categories"],
        summary: "Get all categories",
        description: "Returns a list of all product categories.",
        responses: {
          200: {
            description: "Categories fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "string", example: "success" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Category" },
                    },
                  },
                },
              },
            },
          },
          500: { description: "Server error" },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Create a new category",
        description: "Adds a new product category.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CategoryRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Category created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "string", example: "success" },
                    message: { type: "string", example: "Category created successfully" },
                    data: { $ref: "#/components/schemas/Category" },
                  },
                },
              },
            },
          },
          400: { description: "Category name is required" },
          409: { description: "Category already exists" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/category/{id}": {
      put: {
        tags: ["Categories"],
        summary: "Update a category",
        description: "Updates an existing category by its ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId of the category",
            schema: { type: "string", example: "650c1f1e9b1d8b2bad222222" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CategoryRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Category updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "string", example: "success" },
                    message: { type: "string", example: "Category updated" },
                    data: { $ref: "#/components/schemas/Category" },
                  },
                },
              },
            },
          },
          404: { description: "Category not found" },
          500: { description: "Server error" },
        },
      },
      delete: {
        tags: ["Categories"],
        summary: "Delete a category",
        description: "Deletes a category by its ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId of the category",
            schema: { type: "string", example: "650c1f1e9b1d8b2bad222222" },
          },
        ],
        responses: {
          200: {
            description: "Category deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "string", example: "success" },
                    message: { type: "string", example: "Category deleted" },
                  },
                },
              },
            },
          },
          404: { description: "Category not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Get all active products (Public)",
        description: "Fetches all non-deleted products for public customer browsing.",
        responses: {
          200: {
            description: "List of active products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
          500: { description: "Server error" },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create a new product (Super Admin only)",
        description: "Uploads product details and an image file (`multipart/form-data`).",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["name", "price", "categoryId", "image"],
                properties: {
                  name: { type: "string", example: "Air Cushion Running Shoes" },
                  description: { type: "string", example: "Breathable athletic shoes for daily runs." },
                  price: { type: "number", example: 79.99 },
                  categoryId: {
                    type: "string",
                    example: "650c1f1e9b1d8b2bad222222",
                    description: "ObjectId of Category",
                  },
                  image: {
                    type: "string",
                    format: "binary",
                    description: "Product image file (JPEG, PNG, JPG, max 5MB)",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Product created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          400: { description: "Missing image or invalid category ID" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - Super Admin only" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/products/admin/all": {
      get: {
        tags: ["Products"],
        summary: "Get all products including soft-deleted (Super Admin only)",
        description: "Returns the complete inventory including archived/soft-deleted items.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Complete list of products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - Super Admin only" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get single product by ID (Public)",
        description: "Fetches details of an active product. Returns 404 if deleted or not found.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId of the product",
            schema: { type: "string", example: "650c1f1e9b1d8b2bad333333" },
          },
        ],
        responses: {
          200: {
            description: "Product details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          404: { description: "Product not found or soft-deleted" },
          500: { description: "Server error" },
        },
      },
      put: {
        tags: ["Products"],
        summary: "Update a product (Super Admin only)",
        description: "Updates product information and optionally replaces the product image.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId of the product",
            schema: { type: "string", example: "650c1f1e9b1d8b2bad333333" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Updated Running Shoes" },
                  description: { type: "string", example: "Updated description..." },
                  price: { type: "number", example: 89.99 },
                  categoryId: { type: "string", example: "650c1f1e9b1d8b2bad222222" },
                  image: {
                    type: "string",
                    format: "binary",
                    description: "Optional new image file",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Product updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          400: { description: "Invalid category ID" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - Super Admin only" },
          404: { description: "Product not found" },
          500: { description: "Server error" },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Soft-delete a product (Super Admin only)",
        description: "Marks a product as deleted without permanently removing records.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId of the product",
            schema: { type: "string", example: "650c1f1e9b1d8b2bad333333" },
          },
        ],
        responses: {
          200: {
            description: "Product deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Product deleted successfully" },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - Super Admin only" },
          404: { description: "Product not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/products/{id}/restore": {
      put: {
        tags: ["Products"],
        summary: "Restore a soft-deleted product (Super Admin only)",
        description: "Reactivates a soft-deleted product so it reappears in the public catalog.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId of the product to restore",
            schema: { type: "string", example: "650c1f1e9b1d8b2bad333333" },
          },
        ],
        responses: {
          200: {
            description: "Product restored successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Product restored successfully" },
                    product: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - Super Admin only" },
          404: { description: "Product not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/cart": {
      get: {
        tags: ["Cart"],
        summary: "Get current user's shopping cart",
        description: "Retrieves the logged-in user's cart along with populated product details.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Cart details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    cart: { $ref: "#/components/schemas/Cart" },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          500: { description: "Server error" },
        },
      },
      post: {
        tags: ["Cart"],
        summary: "Add item to cart",
        description: "Adds a product to the user's shopping cart or increments quantity if already present.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddToCartRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Cart updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Cart updated" },
                    cart: { $ref: "#/components/schemas/Cart" },
                  },
                },
              },
            },
          },
          400: { description: "Product ID and quantity are required" },
          401: { description: "Unauthorized" },
          404: { description: "Product not found or deleted" },
          500: { description: "Server error" },
        },
      },
      put: {
        tags: ["Cart"],
        summary: "Update cart item quantity",
        description: "Directly sets the item quantity in the cart.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddToCartRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Cart updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Cart updated" },
                    cart: { $ref: "#/components/schemas/Cart" },
                  },
                },
              },
            },
          },
          400: { description: "Valid productId and quantity (>= 1) required" },
          401: { description: "Unauthorized" },
          404: { description: "Cart or product not found in cart" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/cart/{productId}": {
      delete: {
        tags: ["Cart"],
        summary: "Remove an item from cart",
        description: "Removes a specific product from the authenticated user's cart.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "productId",
            in: "path",
            required: true,
            description: "MongoDB ObjectId of the product to remove",
            schema: { type: "string", example: "650c1f1e9b1d8b2bad333333" },
          },
        ],
        responses: {
          200: {
            description: "Product removed from cart",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Product removed from cart" },
                    cart: { $ref: "#/components/schemas/Cart" },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          404: { description: "Cart or product not found in cart" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/orders/statuses": {
      get: {
        tags: ["Orders"],
        summary: "Get all order statuses",
        description: "Retrieves the list of possible order statuses (e.g. Placed, Processing, Shipped, Delivered, Cancelled).",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of order statuses",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/OrderStatus" },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          500: { description: "Server error" },
        },
      },
      post: {
        tags: ["Orders"],
        summary: "Create a new order status (Super Admin only)",
        description: "Adds a new custom order status option.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateOrderStatusRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Order status created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Order status created" },
                    status: { $ref: "#/components/schemas/OrderStatus" },
                  },
                },
              },
            },
          },
          400: { description: "Status name is required or already exists" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - Super Admin only" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/orders/statuses/{id}": {
      delete: {
        tags: ["Orders"],
        summary: "Delete an order status (Super Admin only)",
        description: "Removes an order status option by ID.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId of the order status",
            schema: { type: "string", example: "650c1f1e9b1d8b2bad555555" },
          },
        ],
        responses: {
          200: {
            description: "Order status deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Order status deleted" },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - Super Admin only" },
          404: { description: "Order status not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/orders": {
      get: {
        tags: ["Orders"],
        summary: "Get all orders (Super Admin only)",
        description: "Retrieves all customer orders across the platform sorted newest first.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "All orders list",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Order" },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - Super Admin only" },
          500: { description: "Server error" },
        },
      },
      post: {
        tags: ["Orders"],
        summary: "Place a new order",
        description:
          "Places an order for the authenticated user, automatically calculates totals, sets status to 'Placed', and records shipping/payment details.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PlaceOrderRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Order placed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Order placed successfully" },
                    order: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
          },
          400: { description: "Incomplete shipping address, payment method, or products" },
          401: { description: "Unauthorized" },
          404: { description: "Product not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/orders/me": {
      get: {
        tags: ["Orders"],
        summary: "Get current user's order history",
        description: "Fetches all orders placed by the currently authenticated user.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "User's order history",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Order" },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get order by ID",
        description: "Retrieves details of a specific order. Accessible by the order owner or Super Admin.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId of the order",
            schema: { type: "string", example: "650c1f1e9b1d8b2bad666666" },
          },
        ],
        responses: {
          200: {
            description: "Order details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Order" },
              },
            },
          },
          401: { description: "Unauthorized" },
          403: { description: "Not authorized to view this order" },
          404: { description: "Order not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/orders/{id}/status": {
      put: {
        tags: ["Orders"],
        summary: "Update order status (Super Admin only)",
        description: "Changes the status of an order (e.g. to Processing, Shipped, Delivered).",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId of the order to update",
            schema: { type: "string", example: "650c1f1e9b1d8b2bad666666" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateOrderStatusRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Order status updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Order status updated" },
                    order: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
          },
          400: { description: "Invalid status ID" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - Super Admin only" },
          404: { description: "Order not found" },
          500: { description: "Server error" },
        },
      },
    },
  },
};

const customCss = `
  .swagger-ui .topbar { background-color: #1e293b; border-bottom: 2px solid #3b82f6; }
  .swagger-ui .topbar .topbar-wrapper img { content: url('https://upload.wikimedia.org/wikipedia/commons/a/ab/Swagger-logo.png'); height: 36px; }
  .swagger-ui .topbar a span { font-weight: 700; color: #f8fafc; font-size: 1.15rem; margin-left: 8px; }
  .swagger-ui .info { margin: 24px 0; }
  .swagger-ui .info .title { font-size: 2rem; color: #0f172a; font-weight: 800; }
  .swagger-ui .info p { font-size: 15px; line-height: 1.6; color: #475569; }
  .swagger-ui .btn.authorize { background-color: #2563eb; color: #ffffff; border-color: #2563eb; border-radius: 6px; font-weight: 600; }
  .swagger-ui .btn.authorize svg { fill: #ffffff; }
  .swagger-ui .opblock.opblock-post { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }
  .swagger-ui .opblock.opblock-get { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
  .swagger-ui .opblock.opblock-put { border-color: #f59e0b; background: rgba(245, 158, 11, 0.05); }
  .swagger-ui .opblock.opblock-delete { border-color: #ef4444; background: rgba(239, 68, 68, 0.05); }
  .swagger-ui .opblock .opblock-summary-method { border-radius: 4px; font-weight: 700; }
  .swagger-ui section.models { border-radius: 8px; border: 1px solid #e2e8f0; }
`;

function setupSwagger(app) {
  // Serve raw JSON spec
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocument);
  });

  // Swagger UI options
  const options = {
    customCss,
    customSiteTitle: "E-Commerce API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      docExpansion: "list",
      defaultModelsExpandDepth: 2,
    },
  };

  // Mount Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

  // Convenience aliases
  app.get("/docs", (req, res) => res.redirect("/api-docs"));
  app.get("/swagger", (req, res) => res.redirect("/api-docs"));

  console.log("Swagger UI configured at /api-docs");
}

module.exports = {
  swaggerDocument,
  setupSwagger,
};
