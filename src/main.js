import moment from "moment";
import {InsertPosition} from "./const.js";
import {render} from "./utils/render.js";

import TripPresenter from "./presenter/trip.js";

import SiteMenuView from "./view/site-menu.js";
import TripControlsView from "./view/trip-controls.js";
import FilterView from "./view/filter.js";

import {generateEvent} from "./mock/event.js";
import {generateDestination} from "./mock/destination.js";

const MAX_WAYPOINTS = 22;

const events = new Array(MAX_WAYPOINTS).fill().map(generateEvent);

const sortedEvents = events.slice().sort((a, b) => {
  return moment(a.startDate) - moment(b.startDate);
});

// console.log(sortedEvents);

const destination = generateDestination();

const tripMain = document.querySelector(`.trip-main`);

render(tripMain, new SiteMenuView(sortedEvents).element, InsertPosition.AFTERBEGIN);
const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripControlsTitle = tripControls.querySelector(`h2`);

render(tripControlsTitle, new TripControlsView().element, InsertPosition.AFTEREND);
render(tripControls, new FilterView().element, InsertPosition.BEFOREEND);

const tripEvents = document.querySelector(`.trip-events`);
const taskPresenter = new TripPresenter(tripEvents);

taskPresenter.init(destination, sortedEvents);
