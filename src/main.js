import {createMenuTemplate} from "./view/site-menu.js";
import {createTripControlsTemplate} from "./view/trip-controls.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortTemplate} from "./view/sort.js";
import {createNewEventTemplate} from "./view/new-event.js";
import {createTripListTemplate} from "./view/trip-list.js";
import {createTripWaypointTemplate} from "./view/trip-waypoint";

const MAX_WAYPOINTS = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMain = document.querySelector(`.trip-main`);

render(tripMain, createMenuTemplate(), `afterbegin`);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripControlsTitle = tripControls.querySelector(`h2`);

render(tripControlsTitle, createTripControlsTemplate(), `afterend`);
render(tripControls, createFilterTemplate(), `beforeend`);

const tripEvents = document.querySelector(`.trip-events`);

render(tripEvents, createSortTemplate(), `beforeend`);
render(tripEvents, createNewEventTemplate(), `beforeend`);

render(tripEvents, createTripListTemplate(), `beforeend`);

const tripList = document.querySelector(`.trip-days`);
const tripEventList = tripList.querySelector(`.trip-events__list`);

for (let i = 0; i < MAX_WAYPOINTS; i++) {
  render(tripEventList, createTripWaypointTemplate(), `beforeend`);
}
