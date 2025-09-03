const mongoose = require('mongoose')

const UserAccessSchema = new mongoose.Schema(
  {
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "menus",
    },
    roleID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Role",
    },
    create: {
      type: Boolean,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
    },
    update: {
      type: Boolean,
      required: true,
    },
    remove: {
      type: Boolean,
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

const UserAccessModel = mongoose.model("user_access", UserAccessSchema);

// export default UserAccessModel;

const saveUserAccess = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new UserAccessModel(data);
      const saved_document = await doc.save();
      resolve(saved_document);
    } catch (error) {
      reject(error);
    }
  });
};

 const FindUserAccess = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docs = UserAccessModel.findOne(data);
      resolve(docs);
    } catch (error) {
      reject(error);
    }
  });
};

 const FindAllAccess = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docs = UserAccessModel.find(data).populate("menuId");
      resolve(docs);
    } catch (error) {
      reject(error);
    }
  });
};

 const getAllUserAccess = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const docs = UserAccessModel.find();
      resolve(docs);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports =  UserAccessFunctions = {
  saveUserAccess,
  FindUserAccess,
  getAllUserAccess,
  FindAllAccess,
};
