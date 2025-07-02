const { USER_ROLES } = require("../constants/userConstants");
const bcrypt = require("bcrypt");
const Users = require("../models/User");
const send = require("../service/emailService");

const generatePassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const userController = {
  create: async (request, response) => {
    try {
      const { name, email, role } = request.body;

      if (!USER_ROLES.includes(role)) {
        return response.status(400).json({ message: "Invalid role" });
      }

      const temporaryPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      const user = await Users.create({
        email,
        password: hashedPassword,
        name,
        role,
        adminId: request.user._id,
      });

      try {
        await send(email, "Affiliate++ Temporary Password", `Your temporary password is: ${temporaryPassword}`);
      } catch (error) {
        console.log("Error sending email:", error);
        console.log(`Temporary password: ${temporaryPassword}`);
      }

      response.json(user);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Internal Server Error" });
    }
  },

  getAll: async (request, response) => {
    try {
      const users = await Users.find({ adminId: request.user._id });
      response.json(users);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Internal Server Error" });
    }
  },

  update: async (request, response) => {
    try {
      const { id } = request.params;
      const { name, role } = request.body;

      if (role && !USER_ROLES.includes(role)) {
        return response.status(400).json({ message: "Invalid role" });
      }

      const user = await Users.findOne({ _id: id, adminId: request.user._id });

      if (!user) {
        return response.status(404).json({ message: "User does not exist" });
      }

      if (name) user.name = name;
      if (role) user.role = role;

      await user.save();
      response.json(user);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Internal Server Error" });
    }
  },

  delete: async (request, response) => {
    try {
      const { id } = request.params;
      const user = await Users.findOneAndDelete({ _id: id, adminId: request.user._id });

      if (!user) {
        return response.status(404).json({ message: "User does not exist" });
      }

      response.json({ message: "User deleted" });
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = userController;
