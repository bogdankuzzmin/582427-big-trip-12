import {UpdateType} from "./const.js";

import TripBoardPresenter from "./presenter/trip-board.js";
import SiteMenuPresenter from "./presenter/site-menu.js";
import FilterPresenter from "./presenter/filter.js";
import TripControlsPresenter from "./presenter/trip-controls.js";

import EventsModel from "./model/events.js";
import OffersModel from "./model/offers.js";
import DestinationModel from "./model/destination.js";
import FilterModel from "./model/filter.js";

import Api from "./api.js";

const AUTHORIZATION = `Basic e1D7qDMAawddWR1m4Bv`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const offersModel = new OffersModel();
const destinationModel = new DestinationModel();
const eventsModel = new EventsModel();
const filterModel = new FilterModel();

const tripMain = document.querySelector(`.trip-main`);
const tripControlsContainer = document.querySelector(`.trip-main__trip-controls`);
const tripEventContainer = document.querySelector(`.trip-events`);

const tripBoardPresenter = new TripBoardPresenter(tripEventContainer, eventsModel, offersModel, destinationModel, filterModel, api);
const filterPresenter = new FilterPresenter(tripControlsContainer, filterModel, eventsModel);
const tripControlsPresenter = new TripControlsPresenter(tripControlsContainer, tripEventContainer, tripMain, tripBoardPresenter, eventsModel, filterModel);
const siteMenuPresenter = new SiteMenuPresenter(tripMain, eventsModel, filterModel);

tripBoardPresenter.init();
tripControlsPresenter.init();

Promise.all([
  api.getDestinations(),
  api.getOffers(),
  api.getEvents()
])
  .then((values) => {
    const [destination, offers, event] = values;

    destinationModel.setDestination(destination);
    offersModel.setOffers(offers);
    eventsModel.setEvents(UpdateType.INIT, event);

    siteMenuPresenter.init();
    filterPresenter.init();
  })
  .catch(() => {
    eventsModel.setError(UpdateType.ERROR);
  });
