import {InsertPosition} from "./const.js";
import {render} from "./utils/render.js";
import {sortTypeEvent} from "./utils/sort.js";

import TripBoardPresenter from "./presenter/trip-board.js";
import SiteMenuPresenter from "./presenter/site-menu.js";

import EventsModel from "./model/events.js";
import OffersModel from "./model/offers.js";

import TripControlsView from "./view/trip-controls.js";
import TripFilterView from "./view/trip-filter.js";

import {generateEvent} from "./mock/event.js";
import {generateDestination} from "./mock/destination.js";
import {generateOffers} from "./mock/offers.js";

const MAX_WAYPOINTS = 6;

const offers = generateOffers();
const offersModel = new OffersModel();
offersModel.setOffers(offers);

const destination = generateDestination();

const events = new Array(MAX_WAYPOINTS).fill().map(() => generateEvent(offers, destination));
const sortedEvents = events.sort(sortTypeEvent);
// console.log(sortedEvents);

const eventsModel = new EventsModel();
eventsModel.setEvents(sortedEvents);

const tripMain = document.querySelector(`.trip-main`);
const siteMenuPresenter = new SiteMenuPresenter(tripMain, eventsModel);
siteMenuPresenter.init();

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripControlsTitle = tripControls.querySelector(`h2`);


render(tripControlsTitle, new TripControlsView(), InsertPosition.AFTEREND);
render(tripControls, new TripFilterView().element, InsertPosition.BEFOREEND);

const tripEventContainer = document.querySelector(`.trip-events`);
const tripBoardPresenter = new TripBoardPresenter(tripEventContainer, eventsModel, offersModel);

tripBoardPresenter.init(destination);
