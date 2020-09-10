import moment from "moment";
import AbstractView from "./abstract.js";

const generateTripRoute = (events) => {
  if (events.length === 0) {
    return ``;
  }

  if (events.length > 3) {
    return `${events[0].destination.city} &mdash; . . . &mdash; ${events[events.length - 1].destination.city}`;
  }

  return events.map((event) => event.destination.city).join(` &mdash; `);
};

const generateRouteTime = (events) => {
  if (events.length === 0) {
    return ``;
  }

  const firstDay = moment(events[0].startDate).format(`MMM DD`);
  const eventsLength = events.length - 1;
  const lastDay = moment(events[eventsLength].startDate).format(`DD`);

  return `<p class="trip-info__dates">${firstDay}&nbsp;&mdash;&nbsp;${lastDay}</p>`;
};

const createMenuRouteTemplate = (events) => {
  const city = generateTripRoute(events);
  const routeTimeTemplate = generateRouteTime(events);

  return (
    `<div class="trip-info__main">
        <h1 class="trip-info__title">${city}</h1>
        ${routeTimeTemplate}
      </div>`
  );
};

export default class SiteMenuRoute extends AbstractView {
  constructor(events) {
    super();

    this._events = events;
  }

  get template() {
    return createMenuRouteTemplate(this._events);
  }
}
