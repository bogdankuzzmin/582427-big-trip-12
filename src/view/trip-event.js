import moment from "moment";
import he from "he";
import {MAX_EVENT_OFFERS} from "../const.js";
import {humanizeTime, getPrepositon} from "../utils/event.js";
import {capitalizeFirstLetter} from "../utils/common.js";
import AbstractView from "./abstract.js";

const createOffersTemplate = (offers) => {
  if (offers.length === 0) {
    return ``;
  }

  return offers
    .slice(0, MAX_EVENT_OFFERS)
    .map((offer) =>
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
       </li>`
    ).join(``);
};

const createTripEventTemplate = (event) => {
  const {type, price, startDate, endDate, destination} = event;

  const city = destination.city;
  const typeInLowerCase = type.toLowerCase();
  const preposition = getPrepositon(type);
  const offers = createOffersTemplate(event.offers);
  const differenceInTime = humanizeTime(startDate, endDate);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${typeInLowerCase}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalizeFirstLetter(type)} ${preposition} ${he.encode(city)}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${moment(startDate).format(`YYYY-MM-DDTHH:mm`)}">
              ${moment(startDate).format(`HH:mm`)}
            </time>
            &mdash;
            <time class="event__end-time" datetime="${moment(endDate).format(`YYYY-MM-DDTHH:mm`)}">
              ${moment(endDate).format(`HH:mm`)}
            </time>
          </p>
          <p class="event__duration">${differenceInTime}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offers}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class TripEvent extends AbstractView {
  constructor(events) {
    super();

    this._events = events;
    this._eventClickHandler = this._eventClickHandler.bind(this);
  }

  get template() {
    return createTripEventTemplate(this._events);
  }

  _eventClickHandler(evt) {
    evt.preventDefault();
    this._callback.eventClick();
  }

  setEventClickHandler(callback) {
    this._callback.eventClick = callback;
    this.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, this._eventClickHandler);
  }
}
