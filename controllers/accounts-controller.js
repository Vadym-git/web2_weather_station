import { userStore } from "../models/user-store.js";

// The accountsController manages user authentication and account-related actions.
export const accountsController = {
  // Renders the initial page where users can choose to log in or sign up.
  async index(request, response) {
    const viewData = {
      title: "Login or Signup",                                                 // Set the title for the login/signup page.
      user: await accountsController.getLoggedInUser(request)                   // Fetch the currently logged-in user.
    };
    response.render("user-page", viewData);                                     // Render the user-page view with the provided data.
  },

  // Renders the login view where users can enter their credentials.
  login(request, response) {
    const viewData = {
      title: "Login to the Service",                                            // Set the title for the login page.
    };
    response.render("login-view", viewData);                                    // Render the login-view with the provided data.
  },

  // Logs the user out by clearing the user cookie and redirecting to the homepage.
  logout(request, response) {
    response.cookie("user", "");                                                // Clear the user cookie.
    response.redirect("/");                                                     // Redirect to the homepage.
  },

  // Renders the signup view where users can create a new account.
  signup(request, response) {
    const viewData = {
      title: "Sign up for the Service",                                         // Set the title for the signup page.
    };
    response.render("signup-view", viewData);                                   // Render the signup-view with the provided data.
  },

  // Registers a new user by adding their data to the user store.
  async register(request, response) {
    const user = request.body;                                                  // Extract the user data from the request body.
    await userStore.addUser(user);                                              // Add the user to the user store.
    response.redirect("/user");                                                 // Redirect to the user page after registration.
  },

  // Authenticates a user by checking their email and password.
  async authenticate(request, response) {
    const user = await userStore.getUserByEmail(request.body.email);            // Get the user by their email.
    if (user && user.password === request.body.password) {
      response.cookie("user", user.email);                                      // Set a cookie with the user's email if authentication is successful.
      response.redirect("/");                                                   // Redirect to the homepage.
    } else {
      response.redirect("/user");                                               // Redirect to the user page if authentication fails.
    }
  },

  // Retrieves the currently logged-in user based on the email stored in cookies.
  async getLoggedInUser(request) {
    const userEmail = request.cookies.user;                                     // Get the user email from the cookie.
    return await userStore.getUserByEmail(userEmail);                           // Fetch the user from the user store by email.
  },

  // Updates the user's data (first name, last name, and email).
  async updateUserData(request, response) {
    const user = await userStore.getUserByEmail(request.cookies.user);          // Get the logged-in user by email from cookies.
    if (user) {
      // Update the user's data in the user store.
      const updatedUser = await userStore.updateUserById(user._id, {
        firstName: request.body.name,                                           // Update the user's first name.
        lastName: request.body.lastname,                                        // Update the user's last name.
        email: request.cookies.user,                                            // Keep the user's email the same.
      });
    }
    response.redirect("/user");                                                 // Redirect to the user page after updating the data.
  }
};
