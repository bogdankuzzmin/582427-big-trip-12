import moment from "moment";
import {insertPosition} from "./const.js";
import {separateEventsIntoDays, render} from "./utils.js";

import SiteMenuView from "./view/site-menu.js";
import TripControlsView from "./view/trip-controls.js";
import FilterView from "./view/filter.js";
import SortView from "./view/sort.js";
import TripDaysView from "./view/trip-days.js";
import TripWaypointView from "./view/trip-waypoint.js";
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

const renderEvent = (test, event) => {
  const tripEventList = test.querySelector(`.trip-events__list`);

  const eventComponent = new TripWaypointView(event);
  const taskEditComponent = new NewEventView(destination, event);

  const replaceWaypoinToEdit = () => {
    tripEventList.replaceChild(taskEditComponent.element, eventComponent.element);
  };

  const replaceEditToWaypoint = () => {
    tripEventList.replaceChild(eventComponent.element, taskEditComponent.element);
  };

  eventComponent.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceWaypoinToEdit();
  });

  taskEditComponent.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceEditToWaypoint();
  });

  taskEditComponent.element.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToWaypoint();
  });

  render(tripEventList, eventComponent.element, insertPosition.BEFOREEND);
};

const tripMain = document.querySelector(`.trip-main`);

render(tripMain, new SiteMenuView(sortedEvents).element, insertPosition.AFTERBEGIN);
const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripControlsTitle = tripControls.querySelector(`h2`);

render(tripControlsTitle, new TripControlsView().element, insertPosition.AFTEREND);

render(tripControls, new FilterView().element, insertPosition.BEFOREEND);

const tripEvents = document.querySelector(`.trip-events`);

render(tripEvents, new SortView().element, insertPosition.BEFOREEND);
render(tripEvents, new TripDaysView().element, insertPosition.BEFOREEND);

const groupSeparatedEvents = separateEventsIntoDays(sortedEvents);

const tripDays = tripEvents.querySelector(`.trip-days`);

Object.keys(groupSeparatedEvents).forEach((oneDay, dayId) => {
  const eventDay = (formatDate) => moment(oneDay).format(formatDate);
  const TripListComponent = new TripListView(dayId + 1, eventDay, groupSeparatedEvents[oneDay]);

  render(tripDays, TripListComponent.element, insertPosition.BEFOREEND);

  groupSeparatedEvents[oneDay].forEach((event) => {
    renderEvent(TripListComponent.element, event);
  });
});


