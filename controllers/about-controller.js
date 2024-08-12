import { accountsController } from "./accounts-controller.js";

// aboutController handles the logic for the "About" page of the application.
export const aboutController = {
  // The index method renders the "About" page.
  async index(request, response) {
    // Create an object with data to pass to the view template.
    const viewData = {
      title: "About Playlist",                                                  // Set the title for the "About" page.
      user: await accountsController.getLoggedInUser(request)                   // Fetch the currently logged-in user.
    };

    // Log a message to the console indicating that the "About" page is being rendered.
    console.log("about rendering");

    // Render the "about-view" template and pass in the viewData object.
    response.render("about-view", viewData);
  },
};
