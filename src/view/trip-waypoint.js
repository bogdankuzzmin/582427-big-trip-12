import moment from "moment";
import {MAX_EVENT_OFFERS} from "../const.js";
import {humanizeTime} from "../utils/event.js";
import AbstractView from "./abstract.js";

const createOfferTemplate = (event) => {
  if (event.length === 0) {
    return ``;
  }

  return event
    .filter((it) => it.isChecked === true)
    .slice(0, MAX_EVENT_OFFERS)
    .map((it) =>
      `<li class="event__offer">
        <span class="event__offer-title">${it.name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${it.price}</span>
       </li>`).join(``);
};

const createTripWayPointTemplate = (event) => {
  const {action, city, price, startDate, endDate} = event;

  const type = action.type;
  const typeInLowerCase = type.toLowerCase();
  const preposition = event.action.preposition;
  const offers = createOfferTemplate(event.offers);
  const differenceInTime = humanizeTime(startDate, endDate);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${typeInLowerCase}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${preposition} ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${moment(startDate).format(`YYYY-MM-DDTHH:mm`)}">
              ${moment(startDate).format(`HH:mm`)}
            </time>
            &mdash;
            <time class="event__end-time" datetime="${moment(startDate).format(`YYYY-MM-DDTHH:mm`)}">
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

export default class TripWaypoint extends AbstractView {
  constructor(event) {
    super();

    this._event = event;
    this._eventClickHandler = this._eventClickHandler.bind(this);
  }

  get template() {
    return createTripWayPointTemplate(this._event);
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
