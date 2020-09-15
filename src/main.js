import {sortTypeEvent} from "./utils/sort.js";

import TripBoardPresenter from "./presenter/trip-board.js";
import SiteMenuPresenter from "./presenter/site-menu.js";
import FilterPresenter from "./presenter/filter.js";
import TripControlsPresenter from "./presenter/trip-controls.js";

import EventsModel from "./model/events.js";
import OffersModel from "./model/offers.js";
import DestinationModel from "./model/destination.js";
import FilterModel from "./model/filter.js";

import {generateEvent} from "./mock/event.js";
import {generateDestination} from "./mock/destination.js";
import {generateOffers} from "./mock/offers.js";

const MAX_WAYPOINTS = 22;

const offers = generateOffers();
const destination = generateDestination();
const events = new Array(MAX_WAYPOINTS).fill().map(() => generateEvent(offers, destination));
const sortedEvents = events.sort(sortTypeEvent);
// console.log(sortedEvents);

const offersModel = new OffersModel();
offersModel.setOffers(offers);

const destinationModel = new DestinationModel();
destinationModel.setDestination(destination);

const eventsModel = new EventsModel();
eventsModel.setEvents(sortedEvents);

const filterModel = new FilterModel();

const tripMain = document.querySelector(`.trip-main`);
const tripControlsContainer = document.querySelector(`.trip-main__trip-controls`);
const tripEventContainer = document.querySelector(`.trip-events`);

const tripBoardPresenter = new TripBoardPresenter(tripEventContainer, eventsModel, offersModel, destinationModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsContainer, filterModel, eventsModel);
const tripControlsPresenter = new TripControlsPresenter(tripControlsContainer, tripEventContainer, tripMain, tripBoardPresenter, eventsModel, filterModel);
const siteMenuPresenter = new SiteMenuPresenter(tripMain, eventsModel, filterModel);

filterPresenter.init();
tripBoardPresenter.init();
tripControlsPresenter.init();
siteMenuPresenter.init();
