const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      maxlength: 255,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
const MenusModal = mongoose.model("menus", MenuSchema);

// save
 const CreateMenu = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new MenusModal(data);
      const saved_document = await doc.save();
      resolve(saved_document);
    } catch (error) {
      reject(error);
    }
  });
};
 const FindMenu = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docs = MenusModal.findOne(data);
      resolve(docs);
    } catch (error) {
      reject(error);
    }
  });
};

 const getAllMenus = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const docs = MenusModal.find();
      resolve(docs);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = MenusFunctions = {
  CreateMenu,
  FindMenu,
  getAllMenus,
};
