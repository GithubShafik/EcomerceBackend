const mock_Roles = ["super_admin", "user"];
const mock_Menus = ["super_admin_dashboard","manage_product", "user_dashboard" , "shop_product" , "shopping_cart" , "my_order"];
const mock_Categories = ["fashion", "cosmetics", "medicine"];
const mock_Order_Statuses = [
  "Placed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
]

const mock_Menus_Access = [
  { role: "super_admin", menu: "super_admin_dashboard" },
  { role: "super_admin", menu: "manage_product" },
  { role: "user", menu: "user_dashboard" },
  { role: "user", menu: "shop_product" },
  { role: "user", menu: "shopping_cart" },
  { role: "user", menu: "my_order" },
];

module.exports = { mock_Menus, mock_Menus_Access, mock_Roles, mock_Categories,mock_Order_Statuses };
