import { stationStore } from "../models/station-store.js";
import { trackStore } from "../models/track-store.js";

export const stationsController = {
  async index(request, response) {
    const playlist = await stationStore.getStationById(request.params.id);
    const viewData = {
      title: "Playlist",
      playlist: playlist,
    };
    response.render("playlist-view", viewData);
  },

  async addTrack(request, response) {
    const playlist = await stationListStore.getStationById(request.params.id);
    const newTrack = {
      title: request.body.title,
      artist: request.body.artist,
      duration: Number(request.body.duration),
    };
    console.log(`adding track ${newTrack.title}`);
    await trackStore.addTrack(playlist._id, newTrack);
    response.redirect("/playlist/" + playlist._id);
  },
};
