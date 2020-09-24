import moment from "moment";
import AbstractView from "./abstract.js";

const ROUTE_COUNT = 3;

const generateTripRoute = (events) => {
  if (events.length === 0) {
    return ``;
  }

  if (events.length > ROUTE_COUNT) {
    return `${events[0].destination.city} &mdash; . . . &mdash; ${events[events.length - 1].destination.city}`;
  }

  return events.map((event) => event.destination.city).join(` &mdash; `);
};

const generateTripRouteDate = (events) => {
  if (events.length === 0) {
    return ``;
  }

  const firstDay = moment(events[0].startDate).format(`MMM DD`);
  const eventsLength = events.length - 1;
  const lastDay = moment(events[eventsLength].endDate).format(`MMM DD`);

  return `<p class="trip-info__dates">${firstDay}&nbsp;&mdash;&nbsp;${lastDay}</p>`;
};

const createMenuRouteTemplate = (events) => {
  const city = generateTripRoute(events);
  const routeDate = generateTripRouteDate(events);

  return (
    `<div class="trip-info__main">
        <h1 class="trip-info__title">${city}</h1>
        ${routeDate}
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
