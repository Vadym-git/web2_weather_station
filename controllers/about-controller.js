import { accountsController } from "./accounts-controller.js";

export const aboutController = {
  async index(request, response) {
    const viewData = {
      title: "About Playlist",
      user: await accountsController.getLoggedInUser(request)
    };
    console.log("about rendering");
    response.render("about-view", viewData);
  },
};
