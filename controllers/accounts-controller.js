import { userStore } from "../models/user-store.js";

export const accountsController = {
  async index(request, response) {
    const viewData = {
      title: "Login or Signup",
      user: await accountsController.getLoggedInUser(request)
    };
    response.render("user-page", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("login-view", viewData);
  },

  logout(request, response) {
    response.cookie("user", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("signup-view", viewData);
  },

  async register(request, response) {
    const user = request.body;
    await userStore.addUser(user);
    console.log(`registering ${user.email}`);
    response.redirect("/user");
  },

  async authenticate(request, response) {
    const user = await userStore.getUserByEmail(request.body.email);
    if (user && user.password === request.body.password) {
      response.cookie("user", user.email);
      console.log(`Logging in ${user.email}`);
      response.redirect("/");
  } else{
      response.redirect("/user");
    }
  },

  async getLoggedInUser(request) {
    const userEmail = request.cookies.user;
    console.log(userEmail);
    return await userStore.getUserByEmail(userEmail);
  },
};
