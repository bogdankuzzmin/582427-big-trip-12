import moment from "moment";
import {MAX_EVENT_OFFERS} from "../const.js";
import {createElement} from "../utils.js";

const countPrice = (events) => {
  if (events.length === 0) {
    return `0`;
  }

  let price = 0;

  events.forEach((event) => {
    price += event.price;

    return event.offers
      .slice(0, MAX_EVENT_OFFERS)
      .filter((eventOffer) => {
        if (eventOffer.isChecked === true) {
          price += eventOffer.price;
        }
      });
  });

  return price;
};

const generateTripRoute = (events) => {
  if (events.length === 0) {
    return ``;
  }

  if (events.length > 3) {
    return `${events[0].city} &mdash; . . . &mdash; ${events[events.length - 1].city}`;
  }

  return events.map((event) => event.city).join(` &mdash; `);
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

const createMenuTemplate = (events) => {
  const price = countPrice(events);
  const city = generateTripRoute(events);
  const routeTimeTemplate = generateRouteTime(events);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${city}</h1>

        ${routeTimeTemplate}
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
      </p>
    </section>`
  );
};

export default class SiteMenu {
  constructor(events) {
    this._events = events;
    this._element = null;
  }

  get template() {
    return createMenuTemplate(this._events);
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
