import moment from "moment";
import {insertPosition} from "./const.js";
import {separateEventsIntoDays, render} from "./utils.js";

import SiteMenuView from "./view/site-menu.js";
import TripControlsView from "./view/trip-controls.js";
import FilterView from "./view/filter.js";
import SortView from "./view/sort.js";
import NewEventView from "./view/new-event.js";
import TripListView from "./view/trip-list.js";

import {generateEvent} from "./mock/event.js";
import {generateDestination} from "./mock/destination.js";

const MAX_WAYPOINTS = 20;

export const events = new Array(MAX_WAYPOINTS).fill().map(generateEvent);

export const sortedEvents = events.slice().sort((a, b) => {
  return moment(a.startDate) - moment(b.startDate);
});
// console.log(sortedEvents);

const destination = generateDestination();

const tripMain = document.querySelector(`.trip-main`);

render(tripMain, new SiteMenuView(sortedEvents).element, insertPosition.AFTERBEGIN);
const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripControlsTitle = tripControls.querySelector(`h2`);

render(tripControlsTitle, new TripControlsView().element, insertPosition.AFTEREND);

render(tripControls, new FilterView().element, insertPosition.BEFOREEND);

const tripEvents = document.querySelector(`.trip-events`);

render(tripEvents, new SortView().element, insertPosition.BEFOREEND);
render(tripEvents, new NewEventView(destination, sortedEvents[0]).element, insertPosition.BEFOREEND);

const groupSeparatedEvents = separateEventsIntoDays(sortedEvents);

Object.keys(groupSeparatedEvents).forEach((oneDay, dayId) => {
  const eventDay = (formatDate) => moment(oneDay).format(formatDate);
  render(tripEvents, new TripListView(dayId + 1, eventDay, groupSeparatedEvents[oneDay]).element, insertPosition.BEFOREEND);
});
