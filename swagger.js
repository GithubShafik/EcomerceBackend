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
    { name: "Attributes", description: "Product attribute management" },
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
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "John Doe" },
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", format: "password", example: "Secret123" },
          dob: { type: "string", format: "date", example: "1998-05-21" },
          mobile: {
            type: "string",
            example: "9876543210",
            description: "10-digit mobile number (starts with 6-9)",
          },
        },
      },
      RegisterResponse: {
        type: "object",
        properties: {
          name: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john@example.com" },
          dob: { type: "string", format: "date-time", example: "1998-05-21T00:00:00.000Z" },
          mobile: { type: "string", example: "9876543210" },
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
        required: ["name", "email", "password", "roleID"],
        properties: {
          name: { type: "string", example: "Jane Doe" },
          email: { type: "string", format: "email", example: "jane@example.com" },
          password: { type: "string", format: "password", example: "Password123" },
          dob: { type: "string", format: "date", example: "1998-05-21" },
          mobile: { type: "string", example: "9876543210" },
          roleID: { type: "string", example: "650c1f1e9b1d8b2bad123456" },
          turf: { type: "string", description: "Optional, only for Turf Admin" },
        },
      },
      Category: {
        type: "object",
        properties: {
          _id: { type: "string", example: "650c1f1e9b1d8b2bad222222" },
          name: { type: "string", example: "Electronics" },
          slug: { type: "string", example: "electronics" },
          parentId: {
            nullable: true,
            description: "Parent category (null for top-level). Populated as object in list API.",
            oneOf: [
              { type: "string", example: "650c1f1e9b1d8b2bad999999" },
              {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  name: { type: "string" },
                  slug: { type: "string" },
                },
              },
            ],
          },
          seoMetaDescription: {
            type: "string",
            example: "Shop the latest electronics at the best prices.",
          },
          imageUrl: {
            type: "string",
            nullable: true,
            example: "https://myblob.blob.core.windows.net/categories/abc123.png",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CategoryRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Footwear" },
          parentId: {
            type: "string",
            description: "Parent category ObjectId. Leave empty for top-level category.",
            example: "650c1f1e9b1d8b2bad222222",
          },
          seoMetaDescription: {
            type: "string",
            maxLength: 160,
            example: "Shop the best footwear collection online.",
          },
          image: {
            type: "string",
            format: "binary",
            description: "Category image file (PNG, JPG, WEBP, SVG, max 2MB)",
          },
          imageUrl: {
            type: "string",
            description: "Direct image URL. Used only when no `image` file is uploaded.",
            example: "https://example.com/images/footwear.png",
          },
          removeImage: {
            type: "string",
            enum: ["true", "false"],
            description: "Update only: set to `true` to remove the existing image.",
          },
        },
      },
      Attribute: {
        type: "object",
        properties: {
          _id: { type: "string", example: "650c1f1e9b1d8b2bad333333" },
          name: { type: "string", example: "Size" },
          inputType: { type: "string", enum: ["text", "dropdown", "multi-select"] },
          values: { type: "array", items: { type: "string" }, example: ["Small", "Large"] },
          categories: {
            type: "array",
            items: {
              oneOf: [
                { type: "string" },
                {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    slug: { type: "string" },
                  },
                },
              ],
            },
          },
          status: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      AttributeRequest: {
        type: "object",
        required: ["name", "inputType"],
        properties: {
          name: { type: "string", example: "Size" },
          inputType: { type: "string", enum: ["text", "dropdown", "multi-select"] },
          values: {
            type: "array",
            items: { type: "string" },
            description: "Required for dropdown and multi-select attributes; leave empty for text.",
          },
          categories: {
            type: "array",
            items: { type: "string" },
            description: "Category ObjectIds to associate with this attribute.",
          },
          status: { type: "boolean", default: true },
        },
      },
      AttributeUpdateRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Size" },
          inputType: { type: "string", enum: ["text", "dropdown", "multi-select"] },
          values: { type: "array", items: { type: "string" } },
          categories: { type: "array", items: { type: "string" } },
          status: { type: "boolean" },
        },
        minProperties: 1,
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
      // ==========================================
      // Order Management Schemas
      // ==========================================
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
            description: "Status name (e.g. Placed, Processing, Packed, Shipped, Delivered, Cancelled)",
          },
        },
      },
      UpdateOrderStatusNameRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "string",
            example: "In Transit",
            description: "Updated status name",
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
          state: { type: "string", example: "Oregon" },
          postalCode: { type: "string", example: "97477" },
          country: { type: "string", example: "United States" },
        },
      },
      OrderProductItemRequest: {
        type: "object",
        required: ["product"],
        properties: {
          product: {
            type: "string",
            example: "650c1f1e9b1d8b2bad333333",
            description: "MongoDB ObjectId of the Product",
          },
          quantity: {
            type: "integer",
            minimum: 1,
            default: 1,
            example: 2,
          },
        },
      },
      OrderProductSnapshot: {
        type: "object",
        properties: {
          _id: { type: "string", example: "650c1f1e9b1d8b2bad888888" },
          product: {
            oneOf: [
              { type: "string", example: "650c1f1e9b1d8b2bad333333" },
              { $ref: "#/components/schemas/Product" },
            ],
          },
          name: { type: "string", example: "Wireless Bluetooth Headphones" },
          sku: { type: "string", example: "SKU-333333" },
          price: { type: "number", example: 99.99, description: "Unit price at time of order" },
          mrp: { type: "number", example: 129.99 },
          quantity: { type: "integer", example: 2 },
        },
      },
      OrderPricing: {
        type: "object",
        properties: {
          subtotal: { type: "number", example: 199.98 },
          mrpSavings: { type: "number", example: 60.0 },
          promoDiscount: { type: "number", example: 20.0 },
          deliveryFee: { type: "number", example: 10.0 },
          packagingFee: { type: "number", example: 5.0 },
          consultationFee: { type: "number", example: 0.0 },
        },
      },
      OrderTimelineItem: {
        type: "object",
        properties: {
          _id: { type: "string", example: "650c1f1e9b1d8b2bad777777" },
          title: { type: "string", example: "Order Placed" },
          description: { type: "string", example: "Order placed successfully via UPI (ONLINE)." },
          updatedBy: {
            type: "object",
            properties: {
              _id: { type: "string", example: "650c1f1e9b1d8b2bad111111" },
              name: { type: "string", example: "John Doe" },
              email: { type: "string", example: "john@example.com" },
            },
          },
          createdAt: { type: "string", format: "date-time", example: "2026-10-29T10:00:00.000Z" },
        },
      },
      PlaceOrderRequest: {
        type: "object",
        required: ["products", "paymentMethod", "shippingAddress"],
        properties: {
          products: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderProductItemRequest" },
          },
          paymentMethod: {
            type: "string",
            enum: ["cod", "online"],
            example: "online",
            description: "High-level payment classification",
          },
          paymentMode: {
            type: "string",
            enum: ["upi", "credit_card", "debit_card", "net_banking", "cod"],
            example: "upi",
            description: "Specific payment channel. Required for online, defaults to 'cod' for COD.",
          },
          paymentStatus: {
            type: "string",
            enum: ["pending", "paid", "failed"],
            default: "pending",
            example: "paid",
          },
          transactionId: {
            type: "string",
            example: "TXN_UPI_9837264821",
            description: "Gateway transaction ID",
          },
          shippingAddress: { $ref: "#/components/schemas/ShippingAddress" },
          promoCode: { type: "string", example: "SAVE20", description: "Discount promo code" },
          consultationAdded: { type: "boolean", default: false, example: false },
          pricing: {
            type: "object",
            properties: {
              promoDiscount: { type: "number", example: 20 },
              deliveryFee: { type: "number", example: 10 },
              packagingFee: { type: "number", example: 5 },
              consultationFee: { type: "number", example: 0 },
            },
          },
          customer: {
            type: "object",
            properties: {
              name: { type: "string", example: "John Doe" },
              email: { type: "string", format: "email", example: "john@example.com" },
            },
            description: "Customer snapshot override (defaults to logged-in user)",
          },
          clearCart: {
            type: "boolean",
            default: true,
            example: true,
            description: "Automatically remove ordered products from the user's shopping cart",
          },
        },
      },
      Order: {
        type: "object",
        properties: {
          _id: { type: "string", example: "650c1f1e9b1d8b2bad666666" },
          orderNumber: { type: "string", example: "ORD-894102" },
          userId: {
            oneOf: [
              { type: "string", example: "650c1f1e9b1d8b2bad111111" },
              {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  name: { type: "string" },
                  email: { type: "string" },
                  mobile: { type: "string" },
                },
              },
            ],
          },
          customer: {
            type: "object",
            properties: {
              name: { type: "string", example: "John Doe" },
              email: { type: "string", example: "john@example.com" },
            },
          },
          products: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderProductSnapshot" },
          },
          paymentMethod: { type: "string", enum: ["cod", "online"], example: "online" },
          paymentMode: {
            type: "string",
            enum: ["upi", "credit_card", "debit_card", "net_banking", "cod"],
            example: "upi",
          },
          paymentStatus: {
            type: "string",
            enum: ["pending", "paid", "failed", "refunded"],
            example: "paid",
          },
          transactionId: { type: "string", nullable: true, example: "TXN_UPI_9837264821" },
          shippingAddress: { $ref: "#/components/schemas/ShippingAddress" },
          orderStatus: { $ref: "#/components/schemas/OrderStatus" },
          promoCode: { type: "string", nullable: true, example: "SAVE20" },
          consultationAdded: { type: "boolean", example: false },
          pricing: { $ref: "#/components/schemas/OrderPricing" },
          totalAmount: { type: "number", example: 194.98 },
          slaDeadline: { type: "string", format: "date-time", example: "2026-10-30T10:00:00.000Z" },
          isSlaDelayed: {
            type: "boolean",
            example: false,
            description: "Virtual: whether dispatch SLA deadline passed while still Pending/Processing",
          },
          itemCount: {
            type: "integer",
            example: 2,
            description: "Virtual: total quantity of products in order",
          },
          timeline: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderTimelineItem" },
          },
          createdAt: { type: "string", format: "date-time", example: "2026-10-29T10:00:00.000Z" },
        },
      },
      UpdateOrderStatusRequest: {
        type: "object",
        required: ["statusId"],
        properties: {
          statusId: {
            type: "string",
            example: "650c1f1e9b1d8b2bad555555",
            description: "MongoDB ObjectId or exact Name of the new OrderStatus",
          },
          note: {
            type: "string",
            example: "Dispatched with BlueDart Tracking #BLU123456",
            description: "Audit description recorded in the order timeline",
          },
        },
      },
      UpdatePaymentStatusRequest: {
        type: "object",
        required: ["paymentStatus"],
        properties: {
          paymentStatus: {
            type: "string",
            enum: ["pending", "paid", "failed", "refunded"],
            example: "paid",
          },
          transactionId: {
            type: "string",
            example: "TXN_9876543210",
            description: "Transaction or payment gateway reference ID",
          },
          note: {
            type: "string",
            example: "Payment confirmed via merchant bank dashboard",
          },
        },
      },
      CancelOrderRequest: {
        type: "object",
        properties: {
          reason: {
            type: "string",
            example: "Customer requested cancellation before shipment",
            description: "Reason for cancellation",
          },
        },
      },
      AddTimelineEventRequest: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", example: "Courier Delay Notice" },
          description: {
            type: "string",
            example: "Shipment delayed due to heavy snowfall at logistics hub.",
          },
        },
      },
      PaginatedOrdersResponse: {
        type: "object",
        properties: {
          total: { type: "integer", example: 45 },
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          totalPages: { type: "integer", example: 5 },
          orders: {
            type: "array",
            items: { $ref: "#/components/schemas/Order" },
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
        description: "Creates a new user account with a hashed password and assigns the default user role.",
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
            "multipart/form-data": {
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
            "multipart/form-data": {
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
    "/api/attribute": {
      get: {
        tags: ["Attributes"],
        summary: "List attributes (Super Admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Attributes fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Attribute" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Authentication required" },
          403: { description: "Super Admin access required" },
        },
      },
      post: {
        tags: ["Attributes"],
        summary: "Create an attribute (Super Admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AttributeRequest" },
            },
          },
        },
        responses: {
          201: { description: "Attribute created successfully" },
          400: { description: "Invalid attribute data" },
          401: { description: "Authentication required" },
          403: { description: "Super Admin access required" },
          409: { description: "An attribute with this name already exists" },
        },
      },
    },
    "/api/attribute/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "MongoDB ObjectId of the attribute",
          schema: { type: "string", example: "650c1f1e9b1d8b2bad333333" },
        },
      ],
      get: {
        tags: ["Attributes"],
        summary: "Get an attribute (Super Admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Attribute fetched successfully" },
          400: { description: "Invalid attribute ID" },
          401: { description: "Authentication required" },
          403: { description: "Super Admin access required" },
          404: { description: "Attribute not found" },
        },
      },
      put: {
        tags: ["Attributes"],
        summary: "Update an attribute (Super Admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AttributeUpdateRequest" },
            },
          },
        },
        responses: {
          200: { description: "Attribute updated successfully" },
          400: { description: "Invalid attribute data or ID" },
          401: { description: "Authentication required" },
          403: { description: "Super Admin access required" },
          404: { description: "Attribute not found" },
          409: { description: "An attribute with this name already exists" },
        },
      },
      patch: {
        tags: ["Attributes"],
        summary: "Partially update an attribute (Super Admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AttributeUpdateRequest" },
            },
          },
        },
        responses: {
          200: { description: "Attribute updated successfully" },
          400: { description: "Invalid attribute data or ID" },
          401: { description: "Authentication required" },
          403: { description: "Super Admin access required" },
          404: { description: "Attribute not found" },
          409: { description: "An attribute with this name already exists" },
        },
      },
      delete: {
        tags: ["Attributes"],
        summary: "Delete an attribute (Super Admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Attribute deleted successfully" },
          400: { description: "Invalid attribute ID" },
          401: { description: "Authentication required" },
          403: { description: "Super Admin access required" },
          404: { description: "Attribute not found" },
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
    // ==========================================
    // Order Management API Endpoints
    // ==========================================
    "/api/orders/statuses": {
      get: {
        tags: ["Orders"],
        summary: "Get all order statuses",
        description: "Retrieves the list of configured order statuses (e.g. Placed, Processing, Packed, Shipped, Delivered, Cancelled).",
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
        description: "Adds a custom status option to the system status list.",
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
            description: "Order status created successfully",
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
          400: { description: "Status name is required" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - Super Admin only" },
          409: { description: "Status already exists" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/orders/statuses/{id}": {
      put: {
        tags: ["Orders"],
        summary: "Update order status name (Super Admin only)",
        description: "Renames an existing order status by ID.",
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
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateOrderStatusNameRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Order status updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Order status updated" },
                    status: { $ref: "#/components/schemas/OrderStatus" },
                  },
                },
              },
            },
          },
          400: { description: "Status name is required" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - Super Admin only" },
          404: { description: "Order status not found" },
          409: { description: "Another status with this name already exists" },
          500: { description: "Server error" },
        },
      },
      delete: {
        tags: ["Orders"],
        summary: "Delete an order status (Super Admin only)",
        description:
          "Safely removes an order status by ID. Blocked with 400 if any existing orders are currently linked to this status.",
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
            description: "Order status deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Order status deleted successfully" },
                  },
                },
              },
            },
          },
          400: { description: "Cannot delete status while active orders reference it" },
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
        summary: "Get all orders for OMS (Super Admin only)",
        description:
          "OMS order listing with full-text search (orderNumber, customer name, email), filtering by orderStatus, paymentStatus, paymentMode, paymentMethod, date range, and SLA delay detection. Supports pagination and custom sorting.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "search",
            in: "query",
            required: false,
            description: "Search term matching orderNumber, customer name, or customer email",
            schema: { type: "string", example: "ORD-894102" },
          },
          {
            name: "status",
            in: "query",
            required: false,
            description: "Filter by OrderStatus ObjectId or Name (e.g. Placed, Processing, Shipped)",
            schema: { type: "string", example: "Placed" },
          },
          {
            name: "paymentStatus",
            in: "query",
            required: false,
            description: "Filter by payment status",
            schema: { type: "string", enum: ["pending", "paid", "failed", "refunded"] },
          },
          {
            name: "paymentMode",
            in: "query",
            required: false,
            description: "Filter by payment mode",
            schema: { type: "string", enum: ["upi", "credit_card", "debit_card", "net_banking", "cod"] },
          },
          {
            name: "paymentMethod",
            in: "query",
            required: false,
            description: "Filter by payment method category",
            schema: { type: "string", enum: ["cod", "online"] },
          },
          {
            name: "startDate",
            in: "query",
            required: false,
            description: "Filter orders created on or after this ISO date",
            schema: { type: "string", format: "date", example: "2026-10-01" },
          },
          {
            name: "endDate",
            in: "query",
            required: false,
            description: "Filter orders created on or before this ISO date",
            schema: { type: "string", format: "date", example: "2026-10-31" },
          },
          {
            name: "isSlaDelayed",
            in: "query",
            required: false,
            description: "Filter only SLA delayed orders (slaDeadline passed and still Pending/Processing)",
            schema: { type: "boolean", example: true },
          },
          {
            name: "page",
            in: "query",
            required: false,
            description: "Page number (1-based)",
            schema: { type: "integer", default: 1, minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            description: "Items per page (max 100)",
            schema: { type: "integer", default: 10, minimum: 1, maximum: 100 },
          },
          {
            name: "sortBy",
            in: "query",
            required: false,
            description: "Field to sort by",
            schema: { type: "string", enum: ["createdAt", "totalAmount", "orderNumber", "slaDeadline"], default: "createdAt" },
          },
          {
            name: "sortOrder",
            in: "query",
            required: false,
            description: "Sorting direction",
            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
          },
        ],
        responses: {
          200: {
            description: "List of orders (returns PaginatedOrdersResponse when pagination parameters are provided, or array of Order)",
            headers: {
              "X-Total-Count": { schema: { type: "integer" }, description: "Total matching orders count" },
              "X-Page": { schema: { type: "integer" }, description: "Current page" },
              "X-Limit": { schema: { type: "integer" }, description: "Page limit" },
              "X-Total-Pages": { schema: { type: "integer" }, description: "Total page count" },
            },
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    { $ref: "#/components/schemas/PaginatedOrdersResponse" },
                    { type: "array", items: { $ref: "#/components/schemas/Order" } },
                  ],
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
          "Places an order for the authenticated user with verified product pricing, customer snapshot, automated orderNumber generation, SLA deadline (24 hours), audit timeline creation, and optional cart cleanup.",
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
          400: { description: "Incomplete shipping address, invalid payment mode, or empty products" },
          401: { description: "Unauthorized" },
          404: { description: "Product not found or soft-deleted" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/orders/me": {
      get: {
        tags: ["Orders"],
        summary: "Get current user's order history",
        description: "Fetches all orders placed by the currently authenticated user with optional status filter and pagination.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "status",
            in: "query",
            required: false,
            description: "Filter by status ObjectId or name",
            schema: { type: "string", example: "Placed" },
          },
          {
            name: "page",
            in: "query",
            required: false,
            description: "Page number",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            description: "Results per page",
            schema: { type: "integer", default: 20 },
          },
        ],
        responses: {
          200: {
            description: "User's order history",
            headers: {
              "X-Total-Count": { schema: { type: "integer" } },
            },
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    { $ref: "#/components/schemas/PaginatedOrdersResponse" },
                    { type: "array", items: { $ref: "#/components/schemas/Order" } },
                  ],
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
        summary: "Get order by ID or orderNumber",
        description:
          "Retrieves complete details of an order including products, customer snapshot, pricing breakdown, and full audit timeline. Accessible by order owner or Super Admin. Accepts either MongoDB ObjectId or readable orderNumber (e.g. `ORD-894102`).",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId or human-readable orderNumber (e.g. ORD-894102)",
            schema: { type: "string", example: "ORD-894102" },
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
        description:
          "Changes the status of an order (e.g. to Processing, Packed, Shipped, Delivered) and automatically appends an audit event to the order timeline with the administrator's ID and optional note.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId or orderNumber of the order",
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
            description: "Order status updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Order status updated successfully" },
                    order: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
          },
          400: { description: "Invalid status ID or status not found" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - Super Admin only" },
          404: { description: "Order not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/orders/{id}/payment": {
      put: {
        tags: ["Orders"],
        summary: "Update payment status & details (Super Admin only)",
        description:
          "Updates paymentStatus ('pending', 'paid', 'failed', 'refunded'), gateway transactionId, and appends an audit event to the order timeline.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId or orderNumber of the order",
            schema: { type: "string", example: "650c1f1e9b1d8b2bad666666" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePaymentStatusRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Payment status updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Payment status updated successfully" },
                    order: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
          },
          400: { description: "Invalid payment status" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - Super Admin only" },
          404: { description: "Order not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/orders/{id}/cancel": {
      put: {
        tags: ["Orders"],
        summary: "Cancel an order",
        description:
          "Cancels an order. Customers can cancel their own orders while in Placed/Pending status. Super Admins can cancel any order before it is Delivered. Records cancellation in timeline and transitions paid orders to refunded.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId or orderNumber of the order",
            schema: { type: "string", example: "650c1f1e9b1d8b2bad666666" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CancelOrderRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Order cancelled successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Order cancelled successfully" },
                    order: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
          },
          400: { description: "Order cannot be cancelled (already dispatched or delivered)" },
          401: { description: "Unauthorized" },
          403: { description: "Not authorized to cancel this order" },
          404: { description: "Order not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/orders/{id}/timeline": {
      post: {
        tags: ["Orders"],
        summary: "Append audit timeline event (Super Admin only)",
        description: "Adds a custom audit note or operational event to the order's tracking timeline.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId or orderNumber of the order",
            schema: { type: "string", example: "650c1f1e9b1d8b2bad666666" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddTimelineEventRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Timeline event added successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Timeline event added successfully" },
                    timeline: {
                      type: "array",
                      items: { $ref: "#/components/schemas/OrderTimelineItem" },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Title is required" },
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
