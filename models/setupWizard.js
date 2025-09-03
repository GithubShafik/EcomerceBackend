const {
  mock_Menus,
  // mock_Roles,
  mock_Menus_Access,
  mock_Roles,
  mock_Categories,
  mock_Order_Statuses
} = require("../constants/staticdata.js");
const UserAccessFunctions = require("./UserAccess.js");
const orderStatusModel = require("./OrderStatus.js")
const MenusFunctions = require("./Menu.js");
const roleModel = require("./Role.js");
const Category = require("./Category.js")

const InitialSetupWizard = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // all status

      // all Roles
      await Promise.all(
        mock_Roles.map(async (menus) => {
          let existingMenus = await roleModel.findOne({
            roleName: menus,
          });
          if (!existingMenus) {
            const doc = new roleModel({ roleName: menus });
            const saved_document = await doc.save();
            console.log(`${menus} Created`);
          } else {
            console.log(`${menus} exist`);
          }
        })
      );

      // all Menus
      await Promise.all(
        mock_Menus.map(async (menus) => {
          let existingMenus = await MenusFunctions.FindMenu({
            description: menus,
          });
          if (!existingMenus) {
            await MenusFunctions.CreateMenu({ description: menus });
            console.log(`${menus} Created`);
          } else {
            console.log(`${menus} exist`);
          }
        })
      );

      // all access
      await Promise.all(
        mock_Menus_Access.map(async (menusaccess) => {
          let menu = await MenusFunctions.FindMenu({
            description: menusaccess.menu,
          });
          let role = await roleModel.findOne({
            roleName: menusaccess.role,
          });

          let existingMenuAccess = await UserAccessFunctions.FindUserAccess({
            menuId: menu._id,
            roleID: role._id,
          });
          if (!existingMenuAccess) {
            await UserAccessFunctions.saveUserAccess({
              menuId: menu._id,
              roleID: role._id,
              create: true,
              read: true,
              update: true,
              remove: true,
            });
            console.log(`${menusaccess.menu} Created`);
          } else {
            console.log(`${menusaccess.menu} exist`);
          }
        })
      );

      await Promise.all(
        mock_Categories.map(async (cat) => {
          const exists = await Category.findOne({ name: cat });
          if (!exists) {
            await new Category({ name: cat }).save();
            console.log(`Category ${cat} Created`);
          } else {
            console.log(`Category ${cat} exists`);
          }
        })
      );

      await Promise.all(
  mock_Order_Statuses.map(async (status) => {
    const existing = await orderStatusModel.findOne({ name: status });
    if (!existing) {
      await new orderStatusModel({ name: status }).save();
      console.log(`${status} status created`);
    } else {
      console.log(`${status} status exists`);
    }
  })
);

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = InitialSetupWizard;
