import moment from "moment";
import {separateEventsIntoDays, render} from "./utils.js";
import {createMenuTemplate} from "./view/site-menu.js";
import {createTripControlsTemplate} from "./view/trip-controls.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortTemplate} from "./view/sort.js";
import {createNewEventTemplate} from "./view/new-event.js";
import {createTripListTemplate} from "./view/trip-list.js";

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

render(tripMain, createMenuTemplate(sortedEvents), `afterbegin`);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripControlsTitle = tripControls.querySelector(`h2`);

render(tripControlsTitle, createTripControlsTemplate(), `afterend`);
render(tripControls, createFilterTemplate(), `beforeend`);

const tripEvents = document.querySelector(`.trip-events`);

render(tripEvents, createSortTemplate(), `beforeend`);
render(tripEvents, createNewEventTemplate(destination, sortedEvents[0]), `beforeend`);


const groupSeparatedEvents = separateEventsIntoDays(sortedEvents);

Object.keys(groupSeparatedEvents).forEach((oneDay, dayId) => {
  const eventDay = (formatDate) => moment(oneDay).format(formatDate);
  render(tripEvents, createTripListTemplate(dayId + 1, eventDay, groupSeparatedEvents[oneDay]), `beforeend`);
});
