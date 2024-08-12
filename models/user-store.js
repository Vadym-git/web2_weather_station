import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("users");

export const userStore = {

  // Retrieves all users from the store.
  async getAllUsers() {
    await db.read();
    return db.data.users;
  },

  // Adds a new user to the store and assigns a unique ID.
  async addUser(user) {
    await db.read();
    user._id = v4();
    db.data.users.push(user);
    await db.write();
    return user;
  },

  // Retrieves a user by their unique ID.
  async getUserById(id) {
    await db.read();
    return db.data.users.find((user) => user._id === id);
  },

  // Retrieves a user by their email address.
  async getUserByEmail(email) {
    await db.read();
    return db.data.users.find((user) => user.email === email);
  },

  // Deletes a user from the store by their unique ID.
  async deleteUserById(id) {
    await db.read();
    const index = db.data.users.findIndex((user) => user._id === id);
    db.data.users.splice(index, 1);
    await db.write();
  },

  // Deletes all users from the store.
  async deleteAll() {
    db.data.users = [];
    await db.write();
  },

  // Updates user information based on their unique ID with new data.
  async updateUserById(id, updatedData) {
    await db.read();
    const user = db.data.users.find((user) => user._id === id);

    if (user) {
      Object.assign(user, updatedData);
      await db.write();
      return user;
    } else {
      return null; // Return null if the user is not found
    }
  },

};
