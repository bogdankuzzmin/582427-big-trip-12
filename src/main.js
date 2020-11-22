import {UpdateType} from "./const.js";

import TripBoardPresenter from "./presenter/trip-board.js";
import SiteMenuPresenter from "./presenter/site-menu.js";
import FilterPresenter from "./presenter/filter.js";
import TripControlsPresenter from "./presenter/trip-controls.js";

import EventsModel from "./model/events.js";
import OffersModel from "./model/offers.js";
import DestinationModel from "./model/destinations.js";
import FilterModel from "./model/filter.js";

import Api from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const AUTHORIZATION = `Basic e1D7q11DgdEddWR1m4Bv`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `big-trip`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const tripMain = document.querySelector(`.trip-main`);
const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripControlsContainer = tripControls.querySelector(`h2`);
const tripEventContainer = document.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const offersModel = new OffersModel();
const destinationModel = new DestinationModel();
const eventsModel = new EventsModel();
const filterModel = new FilterModel();

const tripBoardPresenter = new TripBoardPresenter(tripEventContainer, eventsModel, offersModel, destinationModel, filterModel, apiWithProvider);
const filterPresenter = new FilterPresenter(tripControls, filterModel, eventsModel);
const tripControlsPresenter = new TripControlsPresenter(tripControlsContainer, tripEventContainer, tripMain, tripBoardPresenter, filterPresenter, eventsModel, filterModel);
const siteMenuPresenter = new SiteMenuPresenter(tripMain, eventsModel, filterModel);

tripBoardPresenter.init();
tripControlsPresenter.init();
tripControlsPresenter.setEventAddButtonToggleDisable(true);

Promise.all([
  apiWithProvider.getDestinations(),
  apiWithProvider.getOffers(),
  apiWithProvider.getEvents()
])
  .then((values) => {
    const [destination, offers, event] = values;

    destinationModel.setDestination(destination);
    offersModel.setOffers(offers);
    eventsModel.setEvents(UpdateType.INIT, event);

    siteMenuPresenter.init();
    filterPresenter.init();
    tripControlsPresenter.setEventAddButtonToggleDisable(false);
  })
  .catch(() => {
    eventsModel.setError(UpdateType.ERROR);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
    }).catch(() => {
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
