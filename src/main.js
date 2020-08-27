import {InsertPosition} from "./const.js";
import {render} from "./utils/render.js";
import {sortTypeEvent} from "./utils/sort.js";

import TripPresenter from "./presenter/trip-board.js";

import SiteMenuView from "./view/site-menu.js";
import TripControlsView from "./view/trip-controls.js";
import TripFilterView from "./view/trip-filter.js";

import {generateEvent} from "./mock/event.js";
import {generateDestination} from "./mock/destination.js";

const MAX_WAYPOINTS = 6;

const destination = generateDestination();
const events = new Array(MAX_WAYPOINTS).fill().map(generateEvent);
const sortedEvents = events.sort(sortTypeEvent);
// console.log(sortedEvents);

const tripMain = document.querySelector(`.trip-main`);

render(tripMain, new SiteMenuView(sortedEvents).element, InsertPosition.AFTERBEGIN);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripControlsTitle = tripControls.querySelector(`h2`);

render(tripControlsTitle, new TripControlsView().element, InsertPosition.AFTEREND);
render(tripControls, new TripFilterView().element, InsertPosition.BEFOREEND);

const tripEventContainer = document.querySelector(`.trip-events`);
const tripPresenter = new TripPresenter(tripEventContainer);

tripPresenter.init(destination, sortedEvents);
